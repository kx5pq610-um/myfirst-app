import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {heartCycle} from '../app/heart-cycle.ts';
import {createChamberWall} from '../app/chamber-wall.ts';

const atlas=JSON.parse(readFileSync(new URL('../public/models/atlas.json',import.meta.url),'utf8'));
for(let i=0;i<1000;i++){
 const beat=heartCycle(i/1000);
 assert(!(beat.avOpen&&beat.outletOpen),'An inlet and an outlet must not be open together');
 assert(beat.atrial>=0&&beat.atrial<=1&&beat.ventricular>=0&&beat.ventricular<=1);
 const next=heartCycle((i+1)/1000);
 assert(Math.abs(beat.ventricular-next.ventricular)<.02,'Contraction must be continuous, including cycle wrap');
}
assert(heartCycle(.08).atrial>0&&heartCycle(.08).ventricular===0);
assert(heartCycle(.38).ventricular===1&&heartCycle(.38).outletOpen);
assert(heartCycle(.52).ventricular>0&&!heartCycle(.52).avOpen&&!heartCycle(.52).outletOpen);
assert(heartCycle(.80).ventricular===0&&heartCycle(.80).avOpen);
const ids=['FJ2422','FJ2423','FJ2424','FJ2425'];
for(const id of ids){
 const part=atlas.parts.find(p=>p.id===id);assert(part);
 const buffer=readFileSync(new URL('../public/'+atlas.chunks[part.chunk].url.replace(/^\//,''),import.meta.url));
 const positions=new Float32Array(buffer.buffer,buffer.byteOffset+part.positions,part.vertexCount*3).slice();
 const center=part.bounds[0].map((v,i)=>(v+part.bounds[1][i])/2);
 for(let i=0;i<positions.length;i++)positions[i]=(positions[i]-center[i%3])*17.323;
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setIndex(new T.BufferAttribute(new Uint32Array(buffer.buffer,buffer.byteOffset+part.indices,part.indexCount).slice(),1));
 geometry.computeBoundingBox();const size=geometry.boundingBox.getSize(new T.Vector3());
 for(const depth of [.3,.55,.7]){
  const z=(.5-depth)*size.z,shell=createChamberWall(geometry,id,z),rim=shell.rim.geometry.getAttribute('position');
  assert(rim.count>0,`${id} should have an open rim at depth ${depth}`);
  assert(rim.count%6===0,'The rim must consist of edge quads');
  for(let i=0;i<rim.count;i++){assert(Math.abs(rim.getZ(i)-z)<1e-6);assert(Number.isFinite(rim.getX(i))&&Number.isFinite(rim.getY(i)));}
  shell.dispose();
 }
 geometry.dispose();
}
for(const id of ['FJ2966','FJ3413','FJ3441','FJ3645','FJ3020'])assert(atlas.parts.find(p=>p.id===id),`Missing vessel: ${id}`);
console.log('PASS: valve timing, continuous cardiac cycle, real chamber rims at all depths, and proximal vessel data.');

// Exercise the actual flow scene without relying on a GPU. This checks the
// geometry submitted to WebGL, valve gates, pause, and resumed particle motion.
const {createHeartFlow,CHAMBERS}=await import('../app/heart-flow.ts');
const element=()=>({style:{},classList:{toggle(){}},appendChild(){},setAttribute(){},remove(){}});
globalThis.document={createElement:element};
const host={...element(),clientWidth:1000,clientHeight:720},scene=new T.Scene();
const points=CHAMBERS.map(c=>new T.Vector3(...c.position));
const landmarks={chambers:points,tricuspid:points[0].clone().lerp(points[1],.5),mitral:points[2].clone().lerp(points[3],.5),pulmonaryValve:new T.Vector3(0,.6,.3),aorticValve:new T.Vector3(.2,.7,0),pulmonaryTrunk:new T.Vector3(0,1,.3),aorta:new T.Vector3(.2,1,0),venaCava:new T.Vector3(-.6,.8,0),pulmonaryVein:new T.Vector3(.2,.5,-.3)};
const flow=createHeartFlow(scene,host,()=>{},landmarks),camera=new T.PerspectiveCamera(38,1000/720,.01,100);camera.position.set(0,0,6);camera.lookAt(0,0,0);camera.updateMatrixWorld();
const identity=p=>p;
flow.update(camera,true,0,0,true,false,heartCycle(.08),.016,72,true,identity);
const streams=[];scene.traverse(o=>{if(o instanceof T.InstancedMesh)streams.push(o);});
assert.equal(streams.length,8);assert(streams[1].visible&&!streams[2].visible);
const paused=Array.from(streams[0].instanceMatrix.array);
flow.update(camera,true,0,0,true,false,heartCycle(.08),.016,72,true,identity);
assert.deepEqual(Array.from(streams[0].instanceMatrix.array),paused,'Pause must freeze the blood cells');
flow.update(camera,true,0,0,true,true,heartCycle(.38),.016,72,true,identity);
assert(!streams[1].visible&&streams[2].visible,'Blood must not cross a closed inlet valve');
assert.notDeepEqual(Array.from(streams[0].instanceMatrix.array),paused,'Blood cells must resume moving');
for(const mesh of streams)assert(Array.from(mesh.instanceMatrix.array).every(Number.isFinite));
flow.update(camera,true,0,0,true,false,heartCycle(.38),.016,72,false,identity);
assert.equal(scene.children[0].visible,false,'The flow overlay must be switchable');
flow.dispose();assert.equal(scene.children.length,0);
console.log('PASS: flow scene matrices, valve gating, particle pause/resume, hidden overlay, and resource cleanup.');

const {HEART_OBSERVATION_STEPS,heartObservationState,heartFocusOpacity,heartFlowWindow}=await import('../app/heart-observation.ts');
for(const step of HEART_OBSERVATION_STEPS){const state=heartObservationState(step.phase),beat=heartCycle(step.phase);assert.equal(state.avOpen,beat.avOpen);assert.equal(state.outletOpen,beat.outletOpen);}
assert.equal(heartFocusOpacity('FJ2425','FJ2425',true),1);
assert(heartFocusOpacity('FJ2423','FJ2425',true)<.2);
assert.equal(heartFocusOpacity('FJ2423','FJ2425',false),1);
assert.equal(heartFocusOpacity('FJ2423','FJ2933',true),1);
assert.deepEqual(heartFlowWindow(2,'heart'),[0,.5]);
assert.deepEqual(heartFlowWindow(6,'heart'),[0,.4]);
assert.equal(heartFlowWindow(3,'heart'),null);
assert.deepEqual(heartFlowWindow(3,'all'),[0,1]);
const scene2=new T.Scene(),flow2=createHeartFlow(scene2,host,()=>{},landmarks);
flow2.update(camera,true,2,0,true,true,heartCycle(.38),.016,72,true,identity,'heart',false,'FJ2425');
const streams2=[];scene2.traverse(o=>{if(o instanceof T.InstancedMesh)streams2.push(o);});
assert(streams2[2].visible&&streams2[6].visible,'Heart scope must show ejection into both proximal vessels');
assert(!streams2[3].visible&&!streams2[7].visible,'Heart scope should hide distant lung/body exchange loops');
assert(streams2.every(o=>o.material.depthTest),'An opaque wall should occlude blood unless xray is enabled');
flow2.update(camera,true,2,0,true,false,heartCycle(.38),.016,72,true,identity,'heart',true);
assert(streams2.every(o=>!o.material.depthTest));
flow2.dispose();assert.equal(scene2.children.length,0);
console.log('PASS: phase controls, focused chambers, proximal ventricular outflow, and explicit xray rendering.');
