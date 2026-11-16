// Tự kiểm phần lõi tab Menu PDF (menuFrames, menuName), lấy thẳng từ index.html: node check-menu.mjs
import fs from 'fs'; import assert from 'assert';
const src=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8').split('/*menu-core*/')[1].split('/*/menu-core*/')[0];
const {menuFrames,menuName,menuJson,crc32,zipStore}=new Function(src+';return {menuFrames,menuName,menuJson,crc32,zipStore}')();
// zip: CRC chuẩn, và file zip mở lại được bằng trình giải nén thật (python zipfile) nếu máy có python
assert.equal(crc32(new TextEncoder().encode('123456789')),0xCBF43926);
{ const z=Buffer.from(await zipStore([{name:'p01_a.jpg',data:new Uint8Array([1,2,3])},{name:'_ds.csv',data:new TextEncoder().encode('món')}]).arrayBuffer());
  assert.equal(z.readUInt32LE(z.length-22),0x06054b50); assert.equal(z.readUInt16LE(z.length-12),2);
  const f=(await import('os')).tmpdir()+'/check-menu.zip'; fs.writeFileSync(f,z);
  const r=(await import('child_process')).spawnSync('python',['-c','import zipfile,sys;z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;print(",".join(z.namelist()))',f],{encoding:'utf8'});
  if(!r.error) assert.equal(r.stdout.trim(),'p01_a.jpg,_ds.csv',r.stderr); fs.unlinkSync(f); }
const Util={
  transform:(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]],
  applyTransform:(p,m)=>[p[0]*m[0]+p[1]*m[2]+m[4],p[0]*m[1]+p[1]*m[3]+m[5]] };
const OPS={save:1,restore:2,transform:3,constructPath:4,clip:5,eoClip:6,paintFormXObjectBegin:7,paintFormXObjectEnd:8,paintImageXObject:9};
const vp={transform:[1,0,0,1,0,0],width:800,height:600};
// ảnh 400x300 đặt ở (0,100) bị clip còn 40..280 x 120..280; icon 20x20; ảnh nền kín trang; ảnh sau restore không còn clip
const ops=[[1],[4,[[],[],[40,120,280,280]]],[5],[3,[400,0,0,300,0,100]],[9],[2],
           [1],[3,[20,0,0,20,5,5]],[9],[2], [1],[3,[800,0,0,600,0,0]],[9],[2], [1],[3,[200,0,0,150,500,400]],[9],[2]];
assert.deepStrictEqual(menuFrames({fnArray:ops.map(o=>o[0]),argsArray:ops.map(o=>o[1])},vp,OPS,Util),
  [[40,120,280,280],[500,400,700,550]]);
const img=(x,y,w,h)=>[[1],[3,[w,0,0,h,x,y]],[9],[2]], F=(list,t)=>{ const o=list.flat(); return menuFrames({fnArray:o.map(a=>a[0]),argsArray:o.map(a=>a[1])},vp,OPS,Util,t); };
// lưới 4 ô khít nhau -> 1 khung; ảnh vẽ trùng 2 lần -> 1; 2 ảnh món khít nhau vẫn để riêng
assert.deepStrictEqual(F([img(100,100,100,100),img(200,100,100,100),img(100,200,100,100),img(200,200,100,100),
  img(500,100,100,100),img(500,100,100,100),img(400,400,100,100),img(500,400,100,100)]),
  [[100,100,300,300],[500,100,600,200],[400,400,500,500],[500,400,600,500]]);
// tấm nền sau đoạn văn (chữ phủ dày) bị bỏ, ảnh có 1 nhãn in đè giữ; trang không chữ giữ cả ảnh kín trang
assert.deepStrictEqual(F([img(0,0,300,200),img(400,0,200,200)],[...Array(10)].map((_,i)=>({s:'x',x:10,y:20+15*i,h:10,w:280})).concat({s:'Phở',x:450,y:100,h:20,w:40})),
  [[400,0,600,200]]);
assert.deepStrictEqual(F([img(0,0,800,600)],[]),[[0,0,800,600]]);
assert.deepStrictEqual(F([img(0,0,800,600)]),[]);
const texts=[{s:'KHAI VỊ',x:600,y:80,h:44},{s:'BÁNH MÌ SOURDOUGH &',x:40,y:304,h:14},{s:'BƠ MISO',x:40,y:319,h:14},
  {s:'185.000++',x:220,y:304,h:14},{s:'Bột chua, bơ',x:40,y:334,h:9},{s:'LaKitchen.com',x:40,y:590,h:14},{s:'SÚP BÍ',x:710,y:450,h:14}];
assert.equal(menuName([40,120,280,280],texts),'BÁNH MÌ SOURDOUGH & BƠ MISO');   // dưới ảnh: ghép 2 dòng, bỏ giá và mô tả
assert.equal(menuName([500,400,700,550],texts),'SÚP BÍ');                         // dưới không có gì -> lấy bên phải
assert.equal(menuName([300,100,500,200],texts),'');                               // không chắc thì để trống
// trang chỉ có tên món, mọi chữ cùng cỡ (menu buffet): không có tiêu đề để loại, tên in giữa, cách đáy ảnh ~40pt
assert.equal(menuName([297,256,579,469],[{s:'Sườn bò',x:87,y:510,h:12},{s:'Bít tết thăn bò',x:365,y:510,h:12}]),'Bít tết thăn bò');
// nhãn nhỏ phía trên ảnh (menu BASON): không lấy món có giá ở cột bên; mảnh chữ Việt sát nhau thì nối liền
{ const T=[{s:'ZEN FRIED RICE',x:60,y:448,h:8.3,w:60},{s:'C',x:59,y:459,h:7.3,w:5},{s:'ơ',x:64,y:459,h:7.3,w:4},
    {s:'m Chi',x:69,y:459,h:7.3,w:18},{s:'TIRAMISU LAVA CAKE',x:322,y:483,h:12,w:120},{s:'75.000',x:522,y:482,h:12,w:35},
    {s:'B',x:30,y:720,h:12,w:7},{s:'ò',x:37,y:720,h:12,w:7},{s:'N',x:48,y:720,h:12,w:8},{s:'é',x:56,y:720,h:12,w:6}];
  const used=new Set(); menuJson([{texts:T}],'x',used);
  assert.equal(menuName([13,480,273,702],T.slice(0,6),used),'ZEN FRIED RICE');
  assert.equal(menuName([13,480,273,702],T,used),'Bò Né'); }
// số in đè trên ảnh trỏ về món "45. …" (pdf.js cắt vụn chữ có dấu); bỏ số thứ tự, giá "— 280", dừng ở dòng mô tả
{ const T=[{s:'45',x:400,y:300,h:12,w:14},{s:'45. BÚN TH',x:48,y:278,h:12,w:72},{s:'Ị',x:120,y:278,h:12,w:5},{s:'T N',x:125,y:278,h:12,w:22},
    {s:'ƯỚ',x:147,y:278,h:12,w:19},{s:'NG',x:166,y:278,h:12,w:18},{s:'— 280',x:258,y:278,h:12,w:30},
    {s:'Grilled pork and sausage, spring-roll bites over',x:48,y:293,h:12,w:250}];
  assert.equal(menuName([350,122,577,349],T),'BÚN THỊT NƯỚNG'); }
// dòng tên tiếng Anh viết hoa đầu từ vẫn thuộc tên; "VND 220", tên mục "MEAT - THỊT BÒ" không phải tên món
assert.equal(menuName([50,100,200,250],[{s:'COM TAM',x:60,y:265,h:12,w:60},{s:'Broken Rice Platter',x:60,y:279,h:12,w:110}]),'COM TAM Broken Rice Platter');
assert.equal(menuName([50,100,200,250],[{s:'VND 220',x:60,y:265,h:12,w:60},{s:'VND 500/100gr',x:60,y:279,h:12,w:80}]),'');
assert.equal(menuName([726,169,815,258],[{s:'MEAT - CÁC MÓN THỊT BÒ & THỊT LỢN',x:484,y:243,h:12.4,w:220}]),'');
// JSON menu: (1) tên + chấm dẫn + giá cùng dòng, mô tả cỡ nhỏ bên dưới, giá ghi theo nghìn; (2) giá in dưới khối tên
const J=menuJson([{texts:[{s:'Soups',x:266,y:159,h:40},
  {s:'LOBSTER BISQUE',x:85,y:227,h:12},{s:'| SÚP TÔM HÙM',x:253,y:227,h:12},{s:'..........',x:388,y:227,h:12},{s:'380',x:490,y:227,h:12},
  {s:'Double Cream',x:85,y:239,h:10},{s:'GIÁ CHƯA GỒM 8% VAT',x:85,y:800,h:8},
  {s:'Cơm trắng.',x:300,y:400,h:9},{s:'Steamed rice.',x:300,y:389,h:9},{s:'—',x:300,y:411,h:9},{s:'150.000++',x:300,y:422,h:9}]}],'Thử');
assert.deepStrictEqual(J,{schema_version:1,menus:[{name:'Thử',type:'a_la_carte',source_url:null,content:{sections:[{name:'Soups',items:[
  {name:'LOBSTER BISQUE | SÚP TÔM HÙM',note:'Double Cream',price:380000,price_text:'380'},
  {name:'Steamed rice. Cơm trắng.',price:150000,price_text:'150.000++'}]}],price_note:'GIÁ CHƯA GỒM 8% VAT'}}]});
console.log('ok');
