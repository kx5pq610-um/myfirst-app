import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { MeshoptSimplifier } from 'meshoptimizer';
import { organParts } from '../app/organ-parts.ts';

const models = new URL('../public/models/', import.meta.url);
const atlas = JSON.parse(fs.readFileSync(new URL('atlas.json', models), 'utf8'));
const originals = atlas.chunks.map(chunk => fs.readFileSync(new URL(chunk.url.split('/').pop(), models)));
await MeshoptSimplifier.ready;

function geometry(part, simplify) {
 const buffer = originals[part.chunk];
 const positions = new Float32Array(buffer.buffer, buffer.byteOffset + part.positions, part.vertexCount * 3);
 const normals = new Int16Array(buffer.buffer, buffer.byteOffset + part.normals, part.vertexCount * 3);
 const indices = new Uint32Array(buffer.buffer, buffer.byteOffset + part.indices, part.indexCount);
 const target = Math.max(288, Math.floor(indices.length * .23 / 3) * 3);
 if (!simplify || indices.length <= target) return { positions, normals, indices };

 // Limit each part's geometric error relative to its own size. Small structures and
 // the eye and heart parts used for dedicated lessons are kept at source resolution.
 const [reduced, error] = MeshoptSimplifier.simplify(indices, positions, 3, target, .009);
 assert(error <= .00901 && reduced.length >= 3);
 const [remap, count] = MeshoptSimplifier.compactMesh(reduced);
 const compactPositions = new Float32Array(count * 3);
 const compactNormals = new Int16Array(count * 3);
 for (const [oldIndex, newIndex] of remap.entries()) {
  if (newIndex === 0xffffffff) continue;
  compactPositions.set(positions.subarray(oldIndex * 3, oldIndex * 3 + 3), newIndex * 3);
  compactNormals.set(normals.subarray(oldIndex * 3, oldIndex * 3 + 3), newIndex * 3);
 }
 return { positions: compactPositions, normals: compactNormals, indices: reduced };
}

function writeModel(prefix, parts, simplify) {
 const chunks = [];
 const packedParts = [];
 let segments = [], bytes = 0, triangles = 0;
 function flush() {
  if (!bytes) return;
  const filename = `${prefix}-${chunks.length}.bin`;
  const data = Buffer.concat(segments, bytes);
  const compressed = gzipSync(data, { level: 9 });
  fs.writeFileSync(new URL(filename, models), data);
  fs.writeFileSync(new URL(`${filename}.gz`, models), compressed);
  chunks.push({ url: `models/${filename}`, bytes, gzip: `models/${filename}.gz`, gzipBytes: compressed.length });
  segments = [];
  bytes = 0;
 }
 function append(array) {
  const padding = (4 - bytes % 4) % 4;
  if (padding) segments.push(Buffer.alloc(padding));
  bytes += padding;
  const offset = bytes;
  segments.push(Buffer.from(array.buffer, array.byteOffset, array.byteLength));
  bytes += array.byteLength;
  return offset;
 }
 for (const part of parts) {
  const { positions, normals, indices } = geometry(part, simplify(part));
  if (bytes + positions.byteLength + normals.byteLength + indices.byteLength > 3_000_000) flush();
  const vertexCount = positions.length / 3;
  packedParts.push({ ...part, chunk: chunks.length, vertexCount, indexCount: indices.length,
   positions: append(positions), normals: append(normals), indices: append(indices) });
  triangles += indices.length / 3;
 }
 flush();
 return { parts: packedParts, chunks, triangles };
}

const eye = writeModel('detail-eye', organParts(atlas, 'eye'), () => false);
const heart = writeModel('detail-heart', organParts(atlas, 'heart'), () => false);
const protectedParts = new Set([...eye.parts, ...heart.parts].map(part => part.id));
const light = writeModel('body-light', atlas.parts, part => !protectedParts.has(part.id));
const manifest = { ...atlas, ...light, organDetails: { eye, heart } };
fs.writeFileSync(new URL('atlas-light.json', models), JSON.stringify(manifest));
for (const [name, model] of Object.entries({ original: atlas, light, eye, heart })) {
 console.log(name, model.parts.length, model.triangles, model.chunks.reduce((total, chunk) => total + chunk.gzipBytes, 0));
}
