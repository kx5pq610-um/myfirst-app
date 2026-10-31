import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {SCHOOL_TOPICS,SCHOOL_LEVELS,observationIds,curriculumRelation} from '../app/school-curriculum.ts';
const atlas=JSON.parse(readFileSync(new URL('../public/models/atlas.json',import.meta.url)));
const names=new Map(atlas.concepts.map(c=>[c.name.toLowerCase(),c]));
const parts=new Set(atlas.parts.map(p=>p.id));
assert.equal(Object.keys(SCHOOL_TOPICS).length,12);
for(const level of SCHOOL_LEVELS)assert.ok(Object.values(SCHOOL_TOPICS).some(t=>t.levels.includes(level.id)));
for(const [id,t] of Object.entries(SCHOOL_TOPICS)){
 assert.ok(t.goal&&t.question&&t.answer&&t.essential.length&&t.observations.length,id);
 for(const o of t.observations){
  for(const name of o.names)assert.ok(names.get(name.toLowerCase())?.elements.length,`${id}: missing concept ${name}`);
  const ids=observationIds(atlas,o.names);
  assert.ok(ids.length,`${id}: empty 3D selection`);
  assert.equal(ids.length,new Set(ids).size);
  assert.ok(ids.every(id=>parts.has(id)));
 }
}
assert.ok(SCHOOL_TOPICS.eye.levels.includes('middle'));
assert.ok(SCHOOL_TOPICS.ear.levels.includes('middle'));
assert.ok(SCHOOL_TOPICS.liver.levels.includes('basic'));
assert.ok(SCHOOL_TOPICS.homeostasis.levels.includes('basic'));
assert.ok(!SCHOOL_TOPICS.homeostasis.levels.includes('middle'));
assert.ok(!SCHOOL_TOPICS.immune.levels.includes('middle'));
assert.match(curriculumRelation('liver','biology'),/復習・発展/);
assert.match(SCHOOL_TOPICS.ear.observations[0].hint,/専用の耳の3D模型/);
const ear=JSON.parse(readFileSync(new URL('../app/openear-parts.json',import.meta.url)));
const earBuffer=readFileSync(new URL('../public/models/openear-0.bin',import.meta.url));
const earCompressed=readFileSync(new URL('../public/models/openear-0.bin.gz',import.meta.url));
assert.equal(earBuffer.length,2896552);
assert.ok(gunzipSync(earCompressed).equals(earBuffer),'Compressed and fallback 3D files must match');
for(const id of ['OE000','OE001','OE002','OE003','OE004','OE007','OE008','OE009']){
 const p=ear.parts.find(part=>part.id===id);
 assert.ok(p,`Missing ear geometry ${id}`);
 assert.ok(p.positions+p.vertexCount*12<=earBuffer.length&&p.normals+p.vertexCount*6<=earBuffer.length&&p.indices+p.indexCount*4<=earBuffer.length,`Ear geometry is out of bounds: ${id}`);
 const view=new DataView(earBuffer.buffer,earBuffer.byteOffset+p.indices,p.indexCount*4);
 for(let i=0;i<p.indexCount;i++)assert.ok(view.getUint32(i*4,true)<p.vertexCount,`Invalid ear triangle index: ${id}`);
}
assert.deepEqual(observationIds(atlas,['not a real structure']),[]);
assert.deepEqual(observationIds(atlas,['liver','liver']),observationIds(atlas,['liver']));
const liverIds=observationIds(atlas,['liver','hepatic portal vein','hepatic artery','hepatic vein']);
assert.ok(liverIds.length>observationIds(atlas,['liver']).length,'Show blood vessels as well as the liver');
console.log('School learning: 12 topics, 3 levels, all observation targets and curriculum boundaries validated.');
