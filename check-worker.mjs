// Self-check phần đặt tên file của worker.js: node check-worker.mjs
import assert from 'node:assert/strict';
import { fileName as f, disposition as d } from './worker.js';

assert.equal(f('', 'mac_dinh.mp4'), 'mac_dinh.mp4');
assert.equal(f('   ', 'mac_dinh.mp4'), 'mac_dinh.mp4');
assert.equal(f('Tháp Bà', 'x.mp4'), 'Tháp Bà.mp4');
assert.equal(f('a.MP4', 'x.mp4'), 'a.MP4');
assert.equal(f('../../etc/pa:ss?', 'x.mp4'), 'etc pa ss.mp4');
assert.equal(f('a\\b', 'x.mp4'), 'a b.mp4');
assert.equal(f('...', 'x.mp4'), 'x.mp4');
assert.equal(d('Tháp Bà (1).mp4'),
  `attachment; filename="Th_p B_ (1).mp4"; filename*=UTF-8''Th%C3%A1p%20B%C3%A0%20%281%29.mp4`);
console.log('ok');
