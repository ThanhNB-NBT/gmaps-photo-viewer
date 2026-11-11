// Self-check phần đặt tên file của worker.js: node check-worker.mjs
import assert from 'node:assert/strict';
import { fileName as f, disposition as d, ytId, igCode } from './worker.js';

assert.equal(f('', 'mac_dinh.mp4'), 'mac_dinh.mp4');
assert.equal(f('   ', 'mac_dinh.mp4'), 'mac_dinh.mp4');
assert.equal(f('Tháp Bà', 'x.mp4'), 'Tháp Bà.mp4');
assert.equal(f('a.MP4', 'x.mp4'), 'a.MP4');
assert.equal(f('../../etc/pa:ss?', 'x.mp4'), 'etc pa ss.mp4');
assert.equal(f('a\\b', 'x.mp4'), 'a b.mp4');
assert.equal(f('...', 'x.mp4'), 'x.mp4');
assert.equal(d('Tháp Bà (1).mp4'),
  `attachment; filename="Th_p B_ (1).mp4"; filename*=UTF-8''Th%C3%A1p%20B%C3%A0%20%281%29.mp4`);
for (const l of ['https://www.youtube.com/watch?v=jNQXAC9IVRw&t=5s', 'https://youtu.be/jNQXAC9IVRw?si=x&t=90',
  'https://www.youtube.com/shorts/jNQXAC9IVRw', 'https://m.youtube.com/watch?app=desktop&v=jNQXAC9IVRw#t=1m2s',
  'https://www.youtube.com/live/jNQXAC9IVRw?feature=share', 'https://www.youtube.com/embed/jNQXAC9IVRw?start=30',
  'https://www.youtube.com/watch?v=jNQXAC9IVRw&list=PLx&index=3', 'https://music.youtube.com/watch?v=jNQXAC9IVRw'])
  assert.equal(ytId(l), 'jNQXAC9IVRw', l);
assert.equal(ytId('https://www.youtube.com/@kenh'), null);
assert.equal(ytId('https://www.youtube.com/watch?v=ngan'), null);
for (const l of ['https://www.instagram.com/reel/CDUMkliABpa/?igsh=abc', 'https://www.instagram.com/p/CDUMkliABpa/',
  'https://www.instagram.com/reels/CDUMkliABpa/', 'https://www.instagram.com/tv/CDUMkliABpa', 'https://instagram.com/nguoi.dung/reel/CDUMkliABpa/'])
  assert.equal(igCode(l), 'CDUMkliABpa', l);
assert.equal(igCode('https://www.instagram.com/nguoi.dung/'), undefined);
console.log('ok');
