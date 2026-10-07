import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {hideParts,fadeSelected,partStates,partVisibility,sceneHistory,toggleSelected,nearbyParts,fadeSurroundings,inRegion,REGIONS} from '../app/atlas-controls.ts';
import {configureAtlasMaterial} from '../app/atlas-material.ts';
import {readSavedViews,validCamera} from '../app/saved-views.ts';

const atlas=JSON.parse(readFileSync(new URL('../public/models/atlas.json',import.meta.url)));
const heart=atlas.parts.find(p=>p.id==='FJ2422');
const initial={visible:['cardiac'],selected:[heart.id],selectionName:heart.name,isolate:false,view:'front',rotate:false,reset:0,explode:0,focus:0,hidden:[],faded:[],mode:'select'};
let history={current:initial,past:[]};
const change=update=>{history=sceneHistory(history,{type:'change',update});};
change(fadeSelected);
assert.equal(partStates([heart],history.current)[0].faded,true);
assert.equal(partVisibility(heart,history.current),true);
change(fadeSelected);
assert.equal(partStates([heart],history.current)[0].faded,false);
change(s=>hideParts(s));
assert.equal(partVisibility(heart,history.current),false);
assert.deepEqual(history.current.selected,[]);
history=sceneHistory(history,{type:'undo'});
assert.equal(partVisibility(heart,history.current),true);
assert.equal(history.current.selectionName,heart.name);
assert.equal(history.current.focus,0,'Undo must not unexpectedly zoom a regular selection');
change(s=>({...s,isolate:true}));
const states=partStates(atlas.parts,history.current);
assert.equal(states.filter(p=>p.visible).length,1);
change(s=>({...s,focus:1}));
change(s=>hideParts(s));
history=sceneHistory(history,{type:'undo'});
assert.ok(history.current.focus>0,'Restore the focused observation');
let repeated=hideParts(initial,[heart.id]);
repeated=hideParts(repeated,[heart.id]);
assert.equal(repeated.hidden.length,1);
assert.equal(partVisibility(heart,{...initial,hidden:[heart.id],isolate:true}),false);
for(let i=0;i<35;i++)change(s=>({...s,reset:s.reset+1}));
assert.equal(history.past.length,20,'History stays bounded');
assert.equal(sceneHistory(history,{type:'change',update:s=>s}),history);
for(const state of [initial,hideParts(initial),fadeSelected(initial),{...initial,isolate:true}]){
 const flags=partStates(atlas.parts,state);
 atlas.parts.forEach((p,i)=>assert.equal(flags[i].visible,partVisibility(p,state)));
}

// Test the actual Three.js shader chunks: visible and faded passes must be exclusive.
const texture=new T.DataTexture(new Float32Array(16),4,1,T.RGBAFormat,T.FloatType);
for(const faded of [false,true]){
 const material=new T.MeshStandardMaterial();
 configureAtlasMaterial(material,texture,texture,4,faded);
 assert.equal(material.customProgramCacheKey(),`atlas-parts-${faded?'faded':'solid'}`);
 const shader={uniforms:{},vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};
 material.onBeforeCompile(shader,null);
 assert.ok(shader.vertexShader.includes('partFaded = selection.g'));
 assert.ok(shader.vertexShader.includes('transformed += state.xyz'));
 assert.ok(shader.fragmentShader.includes(faded?'partFaded < 0.5':'partFaded > 0.5'));
 assert.ok(shader.fragmentShader.includes('partVisible < 0.5'));
 material.dispose();
}
texture.dispose();
console.log('PASS: hide/fade/isolate, restored selection and focus, 20-step undo limit, full-atlas visibility, and exclusive shared-geometry render passes.');

const femur=atlas.parts.find(p=>p.name.toLowerCase()==='left femur');
const kidney=atlas.parts.find(p=>p.name.toLowerCase()==='left kidney');
assert.ok(inRegion(femur,'legs'));assert.ok(!inRegion(femur,'head'));
assert.ok(inRegion(kidney,'abdomen'));assert.ok(!inRegion(kidney,'arms'));
for(const region of REGIONS){
 const regional={...initial,selected:[],region:region.id,visible:[...new Set(atlas.parts.map(p=>p.system))]};
 const flags=partStates(atlas.parts,regional);
 assert.ok(flags.some(f=>f.visible),region.id);
 atlas.parts.forEach((p,i)=>assert.equal(flags[i].visible,partVisibility(p,regional)));
}
let multi=toggleSelected({...initial,mode:'multi'},femur.id);
assert.equal(multi.selected.length,2);
multi=toggleSelected(multi,femur.id);assert.deepEqual(multi.selected,[heart.id]);
const context=nearbyParts(atlas.parts,{...initial,isolate:true});
assert.ok(context.revealed.length>1&&context.revealed.length<=80);
assert.equal(context.isolate,false);
const surrounding=fadeSurroundings(atlas.parts,initial);
assert.ok(!surrounding.faded.includes(heart.id));
assert.ok(surrounding.faded.length>0);
const beforeUndo=history.current;
history=sceneHistory(history,{type:'undo'});
history=sceneHistory(history,{type:'redo'});
assert.deepEqual(history.current.selected,beforeUndo.selected);
assert.deepEqual(history.current.hidden,beforeUndo.hidden);
history=sceneHistory(history,{type:'undo'});
history=sceneHistory(history,{type:'change',update:s=>({...s,labels:false})});
assert.equal(history.future.length,0,'A new operation clears the redo branch');
const pose={position:[1,1,3],target:[0,.8,0]};
assert.ok(validCamera(pose));assert.ok(!validCamera({position:[NaN,0,0],target:[0,0,0]}));
const saved=readSavedViews(JSON.stringify([{id:'example',name:'心臓',state:{...surrounding,selected:[heart.id,'bad-id'],visible:['cardiac','bad-system']},camera:pose}]),atlas);
assert.equal(saved.length,1);assert.deepEqual(saved[0].state.selected,[heart.id]);
assert.deepEqual(saved[0].state.visible,['cardiac']);assert.deepEqual(saved[0].camera,pose);
assert.deepEqual(readSavedViews('broken',atlas),[]);
assert.equal(readSavedViews(JSON.stringify(Array.from({length:12},()=>({id:'test',name:'観察',state:initial}))),atlas).length,8);
console.log('PASS: multiple selection, all regional views, capped nearby structures, surrounding fade, redo branches, saved view validation and camera poses.');
