import * as T from 'three';
import {heartFlowWindow} from './heart-observation.ts';
import type {heartCycle} from './heart-cycle.ts';

export const CHAMBERS=[
 {id:'FJ2424',name:'右心房',position:[-.641,.079,-.007],color:'#377ea7',role:'全身から戻った血液を受け取る',inflow:'上大静脈・下大静脈',outflow:'三尖弁 → 右心室',hint:'向かって左側。体の右側の部屋です。'},
 {id:'FJ2423',name:'右心室',position:[-.08,-.123,.362],color:'#377ea7',role:'肺動脈を通して肺へ送る',inflow:'右心房 → 三尖弁',outflow:'肺動脈弁 → 肺動脈 → 肺',hint:'心臓の前側に広がっています。'},
 {id:'FJ2425',name:'左心房',position:[-.131,.182,-.424],color:'#bf4653',role:'肺静脈から血液を受け取る',inflow:'肺 → 肺静脈',outflow:'僧帽弁 → 左心室',hint:'心臓の後ろ側にあります。「周囲を透かす」や「後ろから」で位置を確かめよう。'},
 {id:'FJ2422',name:'左心室',position:[.291,-.156,-.016],color:'#bf4653',role:'大動脈を通して全身へ送る',inflow:'左心房 → 僧帽弁',outflow:'大動脈弁 → 大動脈 → 全身',hint:'右心室より壁が厚く、全身へ血液を送る部屋です。模型の壁の厚みは補助表現です。'},
] as const;
export const FLOW_STEPS=[
 {text:'全身 → 大静脈 → 右心房',detail:'全身で酸素を渡した血液が、大静脈から右心房へ戻ります。',chamber:0,color:'#267bb8'},
 {text:'右心房 → 三尖弁 → 右心室',detail:'房室弁が開いている間に、右心房から右心室へ血液が入ります。',chamber:1,color:'#267bb8'},
 {text:'右心室 → 肺動脈 → 肺',detail:'右心室が縮み、肺動脈弁を通して肺へ送ります。肺動脈には酸素の少ない血液が流れます。',chamber:1,color:'#267bb8'},
 {text:'肺で酸素を受け取る',detail:'肺胞と血液の間で気体を交換し、酸素を受け取り二酸化炭素を渡します。',chamber:-1,color:'#ab5b90'},
 {text:'肺 → 肺静脈 → 左心房',detail:'酸素の多い血液が、肺静脈を通って左心房へ戻ります。',chamber:2,color:'#c34052'},
 {text:'左心房 → 僧帽弁 → 左心室',detail:'房室弁が開いている間に、左心房から左心室へ血液が入ります。',chamber:3,color:'#c34052'},
 {text:'左心室 → 大動脈 → 全身',detail:'左心室が縮み、大動脈弁を通して全身へ送ります。',chamber:3,color:'#c34052'},
 {text:'全身で酸素を渡す',detail:'毛細血管で組織へ酸素を渡した血液は、再び静脈を通って心臓へ戻ります。',chamber:-1,color:'#ab5b90'},
];
export type HeartLandmarks={chambers:T.Vector3[];tricuspid:T.Vector3;mitral:T.Vector3;pulmonaryValve:T.Vector3;aorticValve:T.Vector3;pulmonaryTrunk:T.Vector3;aorta:T.Vector3;venaCava:T.Vector3;pulmonaryVein:T.Vector3};
type Beat=ReturnType<typeof heartCycle>;
export function createHeartFlow(scene:T.Scene,host:HTMLElement,onChamber:(id:string)=>void,landmarks:HeartLandmarks){
 const group=new T.Group();scene.add(group);
 const [a,v,b,w]=landmarks.chambers;
 const lung=new T.Vector3(0,1.6,-.1),body=new T.Vector3(0,-1.55,-.1);
 // Valve and proximal vessel waypoints come from the actual atlas parts.
 // The routes beyond these ports are explanatory paths, not vessel meshes.
 const curves=[
  new T.CatmullRomCurve3([body,new T.Vector3(-1.35,-.9,.1),new T.Vector3(-1.3,1.1,.1),landmarks.venaCava.clone(),a.clone()]),
  new T.CatmullRomCurve3([a.clone(),landmarks.tricuspid.clone(),v.clone()]),
  new T.CatmullRomCurve3([v.clone(),landmarks.pulmonaryValve.clone(),landmarks.pulmonaryTrunk.clone(),new T.Vector3(-.6,1.45,0),lung.clone()]),
  new T.CatmullRomCurve3([lung.clone().add(new T.Vector3(-.18,0,0)),lung.clone().add(new T.Vector3(0,.06,0)),lung.clone().add(new T.Vector3(.18,0,0))]),
  new T.CatmullRomCurve3([lung.clone(),new T.Vector3(.9,1.2,-.5),landmarks.pulmonaryVein.clone(),b.clone()]),
  new T.CatmullRomCurve3([b.clone(),landmarks.mitral.clone(),w.clone()]),
  new T.CatmullRomCurve3([w.clone(),landmarks.aorticValve.clone(),landmarks.aorta.clone(),new T.Vector3(1.35,1.1,.1),new T.Vector3(1.4,-1,.1),body.clone()]),
  new T.CatmullRomCurve3([body.clone().add(new T.Vector3(.18,0,0)),body.clone().add(new T.Vector3(0,-.06,0)),body.clone().add(new T.Vector3(-.18,0,0))]),
 ];
 const lines=curves.map((curve,i)=>{const geometry=new T.BufferGeometry().setFromPoints(curve.getPoints(48));const material=new T.LineBasicMaterial({color:FLOW_STEPS[i].color,transparent:true,opacity:.3,depthTest:false});const line=new T.Line(geometry,material);line.renderOrder=10;group.add(line);return line;});
 // A biconcave disc suggests a red blood cell; its size and spacing are magnified.
 const bloodGeometry=new T.LatheGeometry([new T.Vector2(0,-.004),new T.Vector2(.009,-.005),new T.Vector2(.017,-.003),new T.Vector2(.020,0),new T.Vector2(.017,.003),new T.Vector2(.009,.005),new T.Vector2(0,.004)],10);
 const streams=curves.map((_,i)=>{const material=new T.MeshStandardMaterial({color:'#ffffff',roughness:.48,depthTest:false});const mesh=new T.InstancedMesh(bloodGeometry,material,i===3||i===7?4:12);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.renderOrder=12;group.add(mesh);return mesh;});
 const offsets=new Float32Array(8),dummy=new T.Object3D(),point=new T.Vector3(),tangent=new T.Vector3(),color=new T.Color(),up=new T.Vector3(0,1,0);
 const bead=new T.Mesh(new T.SphereGeometry(.036,12,8),new T.MeshBasicMaterial({color:'#267bb8',depthTest:false}));bead.renderOrder=13;group.add(bead);
 const layer=document.createElement('div');layer.className='heart-label-layer';host.appendChild(layer);
 const labels=[...CHAMBERS.map((c,i)=>{const el=document.createElement('button');el.textContent=c.name;el.className='heart-chamber-label';el.style.borderColor=c.color;el.setAttribute('aria-label',`${c.name}：${c.role}`);el.onclick=()=>onChamber(c.id);layer.appendChild(el);return {el,point:landmarks.chambers[i].clone()};}),...[{text:'肺でガス交換',point:lung},{text:'全身へ酸素を届ける',point:body}].map(item=>{const el=document.createElement('span');el.textContent=item.text;el.className='heart-route-label';layer.appendChild(el);return {el,point:item.point};})];
 const leaderGeometry=new T.BufferGeometry();leaderGeometry.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(24),3));
 const leaders=new T.LineSegments(leaderGeometry,new T.LineBasicMaterial({color:'#586f76',transparent:true,opacity:.65,depthTest:false}));leaders.frustumCulled=false;leaders.renderOrder=14;scene.add(leaders);
 const vesselNames=['大静脈','三尖弁','肺動脈弁・肺動脈','','肺静脈','僧帽弁','大動脈弁・大動脈',''];
 const vessel=document.createElement('span');vessel.className='heart-vessel-label';layer.appendChild(vessel);
 const mapped=[[-1,-1,-1,0,0],[0,1,1],[1,1,-1,-1,-1],[-1,-1,-1],[-1,-1,-1,2],[2,3,3],[3,3,-1,-1,-1,-1],[-1,-1,-1]];
 const originals=[[body,new T.Vector3(-1.35,-.9,.1),new T.Vector3(-1.3,1.1,.1),landmarks.venaCava,a],[a,landmarks.tricuspid,v],[v,landmarks.pulmonaryValve,landmarks.pulmonaryTrunk,new T.Vector3(-.6,1.45,0),lung],[lung.clone().add(new T.Vector3(-.18,0,0)),lung.clone().add(new T.Vector3(0,.06,0)),lung.clone().add(new T.Vector3(.18,0,0))],[lung,new T.Vector3(.9,1.2,-.5),landmarks.pulmonaryVein,b],[b,landmarks.mitral,w],[w,landmarks.aorticValve,landmarks.aorta,new T.Vector3(1.35,1.1,.1),new T.Vector3(1.4,-1,.1),body],[body.clone().add(new T.Vector3(.18,0,0)),body.clone().add(new T.Vector3(0,-.06,0)),body.clone().add(new T.Vector3(-.18,0,0))]];
 const oxygenated=new T.Color('#de4750'),deoxygenated=new T.Color('#863b49');
 const projected=new T.Vector3(),sample=new T.Vector3();
 return {
  update(camera:T.Camera,visible:boolean,step:number,progress:number,coupled:boolean,running:boolean,beat:Beat,dt:number,bpm:number,showFlow:boolean,transform:(p:T.Vector3,chamber:number)=>T.Vector3,scope:'heart'|'all'='all',xray=true,selected=''){
   group.visible=visible&&showFlow;leaders.visible=visible;layer.hidden=!visible;if(!visible)return;
   const width=host.clientWidth,height=host.clientHeight;
   // Follow the same deformation as the tissue, including each valve anchor.
   const placed:{x:number;y:number}[]=[],leaderPositions=leaderGeometry.getAttribute('position');
   labels.forEach(({el,point},i)=>{
    const anchor=i<4?sample.copy(transform(point,i)):sample.copy(point);projected.copy(anchor).project(camera);
    const hidden=projected.z>1||projected.z< -1||(i>=4&&(!showFlow||scope==='heart'));
    el.hidden=hidden;
    let x=(projected.x*.5+.5)*width+(i<4?[-65,-58,70,65][i]:0),y=(-projected.y*.5+.5)*height+(i<4?[-30,35,-48,45][i]:0);
    x=Math.max(58,Math.min(width-58,x));y=Math.max(24,Math.min(height-68,y));
    if(i<4){for(let tries=0;tries<5&&placed.some(p=>Math.abs(p.x-x)<100&&Math.abs(p.y-y)<35);tries++)y=Math.max(24,Math.min(height-68,y+38));placed.push({x,y});}
    el.style.left=`${x}px`;el.style.top=`${y}px`;
    el.classList.toggle('selected',i<4&&CHAMBERS[i].id===selected);
    el.classList.toggle('active',coupled?(beat.stage===0?i===0||i===2:beat.stage===1||beat.stage===2?i===1||i===3:false):i===FLOW_STEPS[step].chamber);
    if(i<4){leaderPositions.setXYZ(i*2,anchor.x,anchor.y,anchor.z);projected.set(x/width*2-1,1-y/height*2,projected.z).unproject(camera);leaderPositions.setXYZ(i*2+1,hidden?anchor.x:projected.x,hidden?anchor.y:projected.y,hidden?anchor.z:projected.z);}
   });leaderPositions.needsUpdate=true;
   if(!showFlow){vessel.hidden=true;return;}
   curves.forEach((curve,i)=>{curve.points.forEach((p,j)=>p.copy(transform(originals[i][j],mapped[i][j])));const window=heartFlowWindow(i,scope)??[0,0];const positions=lines[i].geometry.getAttribute('position');for(let j=0;j<=48;j++){curve.getPoint(window[0]+j/48*(window[1]-window[0]),sample);positions.setXYZ(j,sample.x,sample.y,sample.z);}positions.needsUpdate=true;});
   lines.forEach((line,i)=>{line.visible=!!heartFlowWindow(i,scope);line.material.depthTest=!xray;const gate=i===1||i===5?beat.avOpen:i===2||i===6?beat.outletOpen:true;line.material.opacity=coupled?(gate?.42:.08):i===step?.85:.12;});
   const beadWindow=heartFlowWindow(step,scope);bead.visible=!coupled&&!!beadWindow;bead.material.depthTest=!xray;curves[step].getPoint(beadWindow?beadWindow[0]+progress*(beadWindow[1]-beadWindow[0]):0,bead.position);bead.material.color.set(FLOW_STEPS[step].color);
   streams.forEach((mesh,i)=>{
    const gate=i===1||i===5?beat.avOpen:i===2||i===6?beat.outletOpen:true;
    const window=heartFlowWindow(i,scope);mesh.visible=coupled&&gate&&!!window;mesh.material.depthTest=!xray;if(running&&gate)offsets[i]=(offsets[i]+dt*bpm/60*(i===1||i===5?1.25:i===2||i===6?1.45:.4))%1;
    for(let j=0;j<mesh.count;j++){
     const t=(offsets[i]+j/mesh.count)%1,routeT=window?window[0]+t*(window[1]-window[0]):0;curves[i].getPoint(routeT,point);curves[i].getTangent(routeT,tangent).normalize();dummy.position.copy(point);dummy.quaternion.setFromUnitVectors(up,tangent);dummy.rotateY(j*.8+offsets[i]*3);dummy.scale.setScalar(1);dummy.updateMatrix();mesh.setMatrixAt(j,dummy.matrix);
     color.set(i<3||i===7?'#863b49':'#de4750');if(i===3||i===7)color.lerp(i===3?oxygenated:deoxygenated,t);mesh.setColorAt(j,color);
    }mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
   });
   vessel.textContent=vesselNames[step];vessel.hidden=coupled||!showFlow||!vesselNames[step]||!heartFlowWindow(step,scope);curves[step].getPoint(.5,projected).project(camera);vessel.style.left=`${(projected.x*.5+.5)*width}px`;vessel.style.top=`${(-projected.y*.5+.5)*height-18}px`;
  },
  dispose(){scene.remove(group,leaders);leaderGeometry.dispose();leaders.material.dispose();group.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Line){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());if(o instanceof T.InstancedMesh)o.dispose();}});layer.remove();}
 };
}
