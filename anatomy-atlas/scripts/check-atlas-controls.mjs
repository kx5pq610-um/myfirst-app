import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {hideParts,fadeSelected,partStates,partVisibility,sceneHistory} from '../app/atlas-controls.ts';
import {configureAtlasMaterial} from '../app/atlas-material.ts';

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
