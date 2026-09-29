import * as T from 'three';

// The original cavity meshes are opened out for teaching; these are not vessel geometries.
export const CHAMBERS=[
 // Chamber centers in the model's native coordinates, normalized around heart origin.
 {id:'FJ2424',name:'右心房',position:[-.641,.079,-.007],color:'#b66b64',role:'全身から戻った血液を受け取る'},
 {id:'FJ2423',name:'右心室',position:[-.08,-.123,.362],color:'#b66b64',role:'肺動脈を通して肺へ送る'},
 {id:'FJ2425',name:'左心房',position:[-.131,.182,-.424],color:'#b66b64',role:'肺静脈から血液を受け取る'},
 {id:'FJ2422',name:'左心室',position:[.291,-.156,-.016],color:'#b66b64',role:'大動脈を通して全身へ送る'},
] as const;
export const FLOW_STEPS=[
 {text:'全身 → 大静脈 → 右心房',detail:'全身で酸素を渡した血液が、大静脈から右心房へ戻ります。',chamber:0,color:'#267bb8'},
 {text:'右心房 → 三尖弁 → 右心室',detail:'右心房から右心室へ。三尖弁が逆流を防ぎます。',chamber:1,color:'#267bb8'},
 {text:'右心室 → 肺動脈 → 肺',detail:'右心室が縮み、肺動脈弁を通して肺へ送ります。肺動脈には酸素の少ない血液が流れます。',chamber:1,color:'#267bb8'},
 {text:'肺で酸素を受け取る',detail:'肺胞と血液の間で気体を交換し、酸素を受け取り二酸化炭素を渡します。',chamber:-1,color:'#ab5b90'},
 {text:'肺 → 肺静脈 → 左心房',detail:'酸素の多い血液が、肺静脈を通って左心房へ戻ります。',chamber:2,color:'#c34052'},
 {text:'左心房 → 僧帽弁 → 左心室',detail:'左心房から左心室へ。僧帽弁が逆流を防ぎます。',chamber:3,color:'#c34052'},
 {text:'左心室 → 大動脈 → 全身',detail:'左心室が縮み、大動脈弁を通して全身へ送ります。',chamber:3,color:'#c34052'},
 {text:'全身で酸素を渡す',detail:'毛細血管で組織へ酸素を渡した血液は、再び静脈を通って心臓へ戻ります。',chamber:-1,color:'#ab5b90'},
];

export function createHeartFlow(scene:T.Scene,host:HTMLElement,onChamber:(id:string)=>void){
 const group=new T.Group();scene.add(group);
 const a=new T.Vector3(...CHAMBERS[0].position),v=new T.Vector3(...CHAMBERS[1].position),b=new T.Vector3(...CHAMBERS[2].position),w=new T.Vector3(...CHAMBERS[3].position);
 const lung=new T.Vector3(0,1.3,0),body=new T.Vector3(0,-1.35,0);
 const curves=[
  new T.CatmullRomCurve3([body,new T.Vector3(-1.22,-1.1,0),new T.Vector3(-1.22,.45,0),a]),
  new T.CatmullRomCurve3([a,new T.Vector3(-.62,0,.55),v]),
  new T.CatmullRomCurve3([v,new T.Vector3(-1.02,-.05,-.35),new T.Vector3(-1.03,1.1,0),lung]),
  new T.CatmullRomCurve3([lung.clone().add(new T.Vector3(-.15,0,0)),lung.clone().add(new T.Vector3(0,.06,0)),lung.clone().add(new T.Vector3(.15,0,0))]),
  new T.CatmullRomCurve3([lung,new T.Vector3(.45,1.2,0),b]),
  new T.CatmullRomCurve3([b,new T.Vector3(.62,0,.55),w]),
  new T.CatmullRomCurve3([w,new T.Vector3(1.25,.1,0),new T.Vector3(1.3,-1.1,0),body]),
  new T.CatmullRomCurve3([body.clone().add(new T.Vector3(.15,0,0)),body.clone().add(new T.Vector3(0,-.06,0)),body.clone().add(new T.Vector3(-.15,0,0))]),
 ];
 const tubes=curves.map((curve,i)=>{const m=new T.MeshBasicMaterial({color:FLOW_STEPS[i].color,transparent:true,opacity:.22,depthTest:false});const mesh=new T.Mesh(new T.TubeGeometry(curve,40,.013,6,false),m);mesh.renderOrder=15;group.add(mesh);return mesh;});
 const arrows=curves.map((curve,i)=>{const arrow=new T.ArrowHelper(curve.getTangent(.6).normalize(),curve.getPoint(.6),.14,FLOW_STEPS[i].color,.09,.06);for(const object of [arrow.line,arrow.cone]){const material=object.material as T.Material;material.depthTest=false;object.renderOrder=16;}group.add(arrow);return arrow;});
 const bead=new T.Mesh(new T.SphereGeometry(.055,16,12),new T.MeshBasicMaterial({color:'#267bb8',depthTest:false}));bead.renderOrder=20;group.add(bead);
 // Multiple particles make simultaneous circulation visible. AV and outlet routes
 // move in their respective simplified cardiac phases; venous return continues.
 const offsets=new Float32Array(8);
 const streams=curves.map((_,i)=>Array.from({length:i===3||i===7?2:5},()=>{const mesh=new T.Mesh(new T.SphereGeometry(.028,10,8),new T.MeshBasicMaterial({color:FLOW_STEPS[i].color,depthTest:false}));mesh.renderOrder=19;group.add(mesh);return mesh;}));
 const layer=document.createElement('div');layer.className='heart-label-layer';host.appendChild(layer);
 const vessel=document.createElement('span');vessel.className='heart-vessel-label';layer.appendChild(vessel);
 const labels=[...CHAMBERS.map(c=>{const el=document.createElement('button');el.textContent=c.name;el.className='heart-chamber-label';el.style.borderColor=c.color;el.setAttribute('aria-label',`${c.name}：${c.role}`);el.onclick=()=>onChamber(c.id);layer.appendChild(el);return {el,point:new T.Vector3(...c.position)};}),...[{text:'肺：酸素を受け取る',point:lung},{text:'全身：酸素を渡す',point:body}].map(item=>{const el=document.createElement('span');el.textContent=item.text;el.className='heart-route-label';layer.appendChild(el);return {el,point:item.point};})];
 const projected=new T.Vector3();
 return {
  update(camera:T.Camera,visible:boolean,step:number,progress:number,coupled:boolean,running:boolean,stage:number,dt:number,bpm:number){group.visible=visible;layer.hidden=!visible;if(!visible)return;const width=host.clientWidth,height=host.clientHeight;
   const chamberLabelX=[-24,-42,34,42],chamberLabelY=[-30,15,-25,25];
   labels.forEach(({el,point},i)=>{projected.copy(point).project(camera);el.style.left=`${(projected.x*.5+.5)*width+(i<4?chamberLabelX[i]:0)}px`;el.style.top=`${(-projected.y*.5+.5)*height+(i<4?chamberLabelY[i]:i===5?-18:0)}px`;el.hidden=projected.z>1||projected.z< -1;el.classList.toggle('active',i===FLOW_STEPS[step].chamber);});
   tubes.forEach((t,i)=>{t.material.opacity=i===step?.95:.16;});arrows.forEach((a,i)=>{a.visible=i===step;});bead.position.copy(curves[step].getPoint(progress));bead.material.color.set(FLOW_STEPS[step].color);
   bead.visible=!coupled;
   streams.forEach((particles,i)=>{
    const active=i===1||i===5?stage!==1:i===2||i===6?stage===1:true;
    if(coupled&&running&&active)offsets[i]=(offsets[i]+dt*bpm/60*(i===1||i===5?1.1:.48))%1;
    particles.forEach((particle,j)=>{particle.visible=coupled;particle.position.copy(curves[i].getPoint((offsets[i]+j/particles.length)%1));particle.scale.setScalar(active?1:.65);if(i===3||i===7){const t=(offsets[i]+j/particles.length)%1;particle.material.color.set(i===3?'#267bb8':'#c34052').lerp(new T.Color(i===3?'#c34052':'#267bb8'),t);}});
    if(coupled){tubes[i].material.opacity=active?.65:.18;arrows[i].visible=active;}
   });
   if(coupled)labels.slice(0,4).forEach(({el},i)=>el.classList.toggle('active',stage===1?i===1||i===3:i===0||i===2));
   const names=['大静脈','三尖弁','肺動脈','','肺静脈','僧帽弁','大動脈',''];vessel.textContent=names[step];vessel.hidden=coupled||!names[step];projected.copy(curves[step].getPoint(.5)).project(camera);vessel.style.left=`${(projected.x*.5+.5)*width}px`;vessel.style.top=`${(-projected.y*.5+.5)*height-18}px`;vessel.style.color=FLOW_STEPS[step].color;
  },
  dispose(){scene.remove(group);group.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Line){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});layer.remove();}
 };
}
