import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {learningSelections} from '../app/learning-selection.ts';
import {inspectOrgan,selectOrganPart,returnToOrgan} from '../app/organ-inspection.ts';
import {hideParts,partStates,partVisibility} from '../app/atlas-controls.ts';
import {createOrganExplosionLayout} from '../app/explosion-layout.ts';
const atlas=JSON.parse(readFileSync(new URL('../public/models/atlas.json',import.meta.url)));
const groups=learningSelections(atlas),liver=[...groups.values()].find(c=>c.name==='liver');
assert.ok(liver.elements.length>50);
const base={selected:liver.elements,selectionName:'liver',visible:['digestive','venous','arterial'],view:'front',reset:0,explode:0,isolate:false,rotate:false};
let state=inspectOrgan(base,liver);
const part=atlas.parts.find(p=>p.id===liver.elements[0]);
state=selectOrganPart(state,part.id,part.name);
assert.equal(partStates(atlas.parts,state).filter(p=>p.visible).length,liver.elements.length,'Selecting a small part retains the complete isolated organ');
assert.equal(partStates(atlas.parts,state).filter(p=>p.selected).length,1);
const hidden=hideParts(state);
assert.equal(hidden.isolate,true);assert.deepEqual(hidden.inspection.elements,liver.elements);
assert.equal(partStates(atlas.parts,hidden).filter(p=>p.visible).length,liver.elements.length-1);
assert.equal(hidden.keepCamera,state.keepCamera+1,'Hiding explicitly holds the camera');
assert.equal(hideParts({...base,focus:2}).keepCamera,1);
assert.equal(hideParts({...base,focus:2}).reset,base.reset);
atlas.parts.forEach((p,i)=>assert.equal(partVisibility(p,hidden),partStates(atlas.parts,hidden)[i].visible));
const restored=returnToOrgan(hidden);assert.equal(restored.selectionName,'liver');assert.deepEqual(restored.selected,liver.elements);assert.deepEqual(restored.hidden,[]);
assert.equal(selectOrganPart(state,'outside-organ','wrong'),state,'Cannot replace isolated liver with another organ');
const layout=createOrganExplosionLayout(atlas.parts,groups,1.5);
for(const id of liver.elements)assert.deepEqual(layout.offsets.get(id),layout.offsets.get(liver.elements[0]),'All liver meshes move together without losing their anatomical relationship');
console.log('PASS: whole liver grouping, contextual fine selection, scoped hiding, camera hold, whole-organ restore and intact packed organ geometry.');

for(const name of ['heart','right lung','left lung','right kidney','left kidney','stomach','pancreas','brain','small intestine','large intestine']){
 const organ=[...groups.values()].find(c=>c.name===name);assert.ok(organ?.elements.length,name);
 const whole=inspectOrgan(base,organ),part=atlas.parts.find(p=>p.id===organ.elements[0]);
 const fine=selectOrganPart(whole,part.id,part.name);
 assert.equal(partStates(atlas.parts,fine).filter(p=>p.visible).length,organ.elements.length,name+' remains whole during fine selection');
 const removed=hideParts(fine);assert.equal(partStates(atlas.parts,removed).filter(p=>p.visible).length,organ.elements.length-1,name+' hides only selected part');
 for(const id of organ.elements)assert.deepEqual(layout.offsets.get(id),layout.offsets.get(organ.elements[0]),name+' stays intact in the organ layout');
}
console.log('PASS: heart, both lungs, both kidneys, stomach, pancreas, brain, small intestine and large intestine share the organ inspection behavior.');
