// Package only reviewed project files; no credentials, hosting identity or local saves.
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { deflateRawSync } from 'node:zlib';
const root = fileURLToPath(new URL('../', import.meta.url));
const names = ['README.md', 'DEPLOYMENT.md', 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'index.html', '.gitignore'];
function collect(folder) {
  for (const entry of readdirSync(join(root, folder), { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (folder === 'public' && entry.name === 'downloads') continue;
    if (entry.isDirectory()) collect(path);
    else if (entry.isFile()) names.push(path);
  }
}
for (const folder of ['src', 'public', 'scripts', '.github']) collect(folder);
const table = Array.from({length: 256}, (_, n) => {
  for (let k = 0; k < 8; k++) n = (n & 1) ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(bytes) { let crc = 0xffffffff; for (const b of bytes) crc = table[(crc ^ b) & 255] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0; }
const localParts = [], centralParts = [];
let offset = 0;
for (const file of names.sort()) {
  const name = Buffer.from('sumikko-spire/' + file.split('\\').join('/'));
  const bytes = readFileSync(join(root, file)), packed = deflateRawSync(bytes), crc = crc32(bytes);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x800, 6); local.writeUInt16LE(8, 8);
  local.writeUInt16LE(0x21, 12); local.writeUInt32LE(crc, 14); local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(bytes.length, 22); local.writeUInt16LE(name.length, 26);
  localParts.push(local, name, packed);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10);
  central.writeUInt16LE(0x21, 14); central.writeUInt32LE(crc, 16); central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(bytes.length, 24); central.writeUInt16LE(name.length, 28); central.writeUInt32LE(offset, 42);
  centralParts.push(central, name); offset += local.length + name.length + packed.length;
}
const directory = Buffer.concat(centralParts), end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(names.length, 8); end.writeUInt16LE(names.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
const target = join(root, 'public/downloads/sumikko-spire-source.zip');
mkdirSync(join(root, 'public/downloads'), {recursive: true}); writeFileSync(target, Buffer.concat([...localParts, directory, end]));
console.log(`已更新源码下载包：${relative(root, target)}（${names.length} 个文件）`);
