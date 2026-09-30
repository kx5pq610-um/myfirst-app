import {useEffect,useMemo,useRef,useState} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {decodeModelResponse} from './model-download';
import {localizeAnatomyName,type Atlas,type Part} from './anatomy';
import './organ-model.css';
import {CHAMBERS,FLOW_STEPS,createHeartFlow,type HeartLandmarks} from './heart-flow';
import {createChamberWall} from './chamber-wall';
import {heartCycle} from './heart-cycle';
import {HEART_OBSERVATION_STEPS,heartObservationState,heartFocusOpacity} from './heart-observation';

type Kind='heart'|'eye';
interface Settings {running:boolean;bpm:number;volume:number;muted:boolean;cut:boolean;spread:number;drag:boolean;near:boolean;selected:string;solo:boolean;reset:number;flowPlaying:boolean;flowStep:number;coupled:boolean;opened:string[];slow:boolean;showFlow:boolean;depth:number;scrub:number;scrubRevision:number;focusChamber:boolean;view:'front'|'oblique'|'back';viewRevision:number;flowScope:'heart'|'all';xray:boolean}
const defaults:Settings={running:false,bpm:72,volume:.5,muted:false,cut:false,spread:0,drag:false,near:false,selected:'',solo:false,reset:0,flowPlaying:false,flowStep:0,coupled:false,opened:CHAMBERS.map(c=>c.id),slow:false,showFlow:true,depth:.56,scrub:0,scrubRevision:0,focusChamber:true,view:'front',viewRevision:0,flowScope:'heart',xray:false};
function organParts(atlas:Atlas,kind:Kind){
 const names=kind==='heart'?['heart','wall of ventricle']:['right eye','right optic nerve'];
 const ids=new Set(atlas.concepts.filter(c=>names.includes(c.name.toLowerCase())).flatMap(c=>c.elements));
 if(kind==='heart')for(const p of atlas.parts)if(['FJ2966','FJ3413','FJ3441','FJ3645','FJ2925','FJ2933','FJ2944','FJ2950','FJ2955','FJ3020','FJ3040'].includes(p.id))ids.add(p.id);
 const opticId=atlas.parts.find(p=>p.name.toLowerCase()==='right optic nerve')?.id;
 return atlas.parts.filter(p=>kind==='heart'?ids.has(p.id):
  (ids.has(p.id)||/right (retina|sclera|choroid|vitreous)/i.test(p.name))&&!/eyelid|tarsal|lacrimal|conjunctiva|rectus|oblique|levator|eyelash|skin|vessel/i.test(p.name)&&(p.name.toLowerCase()!=='right optic nerve'||p.id===opticId));
}
function partName(p:Part){const n=p.name.toLowerCase();const names:Record<string,string>={'right choroid':'脈絡膜','right cornea':'角膜','right iris':'虹彩','right lens':'水晶体','right optic nerve':'視神経','optic part of right retina':'網膜','right sclera':'強膜','suspensory ligament of right lens':'チン小帯（水晶体を支える線維）','right vitreous body':'硝子体','wall of ventricle':'心室の筋肉の壁'};if(names[n])return names[n];if(n.includes('pulmonary vein'))return '肺静脈';if(n==='pulmonary trunk')return '肺動脈（肺動脈幹）';if(n==='ascending aorta')return '大動脈（上行大動脈）';if(n.includes('vena cava'))return n.includes('superior')?'上大静脈':'下大静脈';if(n.includes('pulmonary valve'))return '肺動脈弁の部品';if(n.includes('aortic valve'))return '大動脈弁の部品';if(n.includes('mitral valve'))return '僧帽弁（左心房と左心室の間）';if(n.includes('tricuspid valve'))return '三尖弁（右心房と右心室の間）';if(n.includes('papillary'))return '乳頭筋（弁を支える筋肉）';if(n.includes('artery'))return '心臓を養う動脈の枝';if(n.includes('vein')||n.includes('sinus'))return '心臓の血液を集める静脈';return localizeAnatomyName(p.name);}
function tint(p:Part,kind:Kind){const n=p.name.toLowerCase();if(kind==='heart')return n.includes('pulmonary vein')?'#bd4c55':n==='pulmonary trunk'||n.includes('vena cava')?'#557f9b':n==='ascending aorta'?'#b8464c':n.includes('cavity')?(n.includes('right')?'#487faa':'#bf565b'):n.includes('valve')?'#e7c0a0':p.system==='venous'?'#597893':p.system==='arterial'?'#ad484a':'#b66b64';return n.includes('lens')?'#8bc8dd':n.includes('cornea')?'#9fd1e5':n.includes('iris')?'#558b7b':n.includes('retina')?'#dc8a77':n.includes('nerve')?'#e8c678':n.includes('sclera')?'#e6ddd3':'#c79891';}
function describe(p:Part|undefined,kind:Kind){
 if(!p)return '模型をタップすると部品名が分かります。ドラッグで回転、ピンチやホイールで拡大できます。';
 const chamber=CHAMBERS.find(c=>c.id===p.id);if(chamber)return `${chamber.name}：${chamber.role}部屋です。前半分を開くと、内側の空間と壁の切り口が見えます。壁の厚みは学習用の補助表現です。`;
 const n=p.name.toLowerCase();
 if(n.includes('lens'))return '水晶体は透明なレンズ。近くを見ると厚くなり、網膜にピントを合わせます。取り出して横から形を確かめよう。';
 if(n.includes('iris'))return '虹彩は中央の穴（瞳孔）の大きさを変え、目に入る光の量を調節します。';
 if(n.includes('retina'))return '網膜は光を受け取り、神経の信号に変える薄い層です。';
 if(n.includes('cornea'))return '角膜は目の前にある透明な膜。光を通して曲げる働きがあります。';
 if(n.includes('optic nerve'))return '視神経は網膜からの信号を脳へ伝えます。';
 if(n.includes('sclera'))return '強膜は眼球を包む丈夫な膜です。半分ひらくと内側の部品が見えます。';
 if(n.includes('valve'))return '弁は圧力の差で開閉して逆流を防ぎます。この3D模型では元の弁の形を保ちながら、拍動に合わせた開閉の模式的な動きを観察できます。';
 if(n.includes('cavity'))return '血液が入る空間の形を色付きの立体で示しています。実際にこの色の固まりが入っているわけではありません。';
 return kind==='heart'?'心臓の筋肉や血管の部品です。拍動は動きを分かりやすくするための変形アニメーションです。':'眼球をつくる部品です。元に戻すと、他の部品との位置関係を確認できます。';
}

export default function OrganModel({atlas,kind,onClose}:{atlas:Atlas;kind:Kind;onClose:()=>void}){
 const parts=useMemo(()=>organParts(atlas,kind),[atlas,kind]);
 const [settings,setSettings]=useState<Settings>(()=>({...defaults,cut:kind==='heart'})),[ready,setReady]=useState(false),[error,setError]=useState(''),[phase,setPhase]=useState('停止中'),[audioError,setAudioError]=useState(''),[beatPhase,setBeatPhase]=useState(0);
 const host=useRef<HTMLDivElement>(null),latest=useRef(settings),cycleSlider=useRef<HTMLInputElement>(null),audio=useRef<AudioContext|null>(null),master=useRef<GainNode|null>(null);
 latest.current=settings;
 const update=(p:Partial<Settings>)=>setSettings(s=>({...s,...p}));
 async function start(){
  if(settings.running){update({running:false,flowPlaying:false});return;}
  update({running:true,coupled:true,flowPlaying:false,cut:true,solo:false,drag:false,spread:0,opened:CHAMBERS.map(c=>c.id),showFlow:true});
  try{audio.current??=new AudioContext();if(!master.current){master.current=audio.current.createGain();master.current.connect(audio.current.destination);}setAudioError('音声を準備しています…');void audio.current.resume().then(()=>setAudioError('')).catch(()=>setAudioError('音を開始できませんでした。Chromeで開き直し、端末の音量・ミュートを確認してください。'));}catch{setAudioError('音を開始できませんでした。Chromeで開き直し、端末の音量・ミュートを確認してください。');}
 }
 useEffect(()=>{if(master.current)master.current.gain.value=settings.muted||!settings.running?0:settings.volume;},[settings.muted,settings.volume,settings.running]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',key);return()=>{window.removeEventListener('keydown',key);void audio.current?.close();};},[onClose]);
 useEffect(()=>{
  const el=host.current!;let disposed=false,raf=0,loaded=false;const abort=new AbortController();
  let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true});}catch{setError('3D表示を開始できませんでした。ブラウザーを再読み込みしてください。');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(kind==='heart'?'#e5e9e6':'#eaf0f1');renderer.toneMapping=kind==='heart'?T.ACESFilmicToneMapping:T.NoToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=T.SRGBColorSpace;renderer.localClippingEnabled=true;el.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label',`${kind==='heart'?'拍動する心臓':'部品を取り出せる目'}の3D模型。ドラッグで回転、部品をタップで選択。`);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.01,100),controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.minDistance=.6;controls.maxDistance=12;controls.enablePan=true;
  scene.add(new T.HemisphereLight('#ffffff','#708594',2));const light=new T.DirectionalLight('#fff3ea',3);light.position.set(-3,4,5);scene.add(light);const fill=new T.DirectionalLight('#c4dfff',2);fill.position.set(3,1,-3);scene.add(fill);
  const group=new T.Group();scene.add(group);
  const box=new T.Box3();for(const p of parts.filter(p=>kind!=='heart'||!['FJ2966','FJ3413','FJ3441','FJ3645','FJ2925','FJ2933','FJ2944','FJ2950','FJ2955','FJ3020','FJ3040'].includes(p.id)))box.union(new T.Box3(new T.Vector3().fromArray(p.bounds[0]),new T.Vector3().fromArray(p.bounds[1])));
  const center=box.getCenter(new T.Vector3());let extent=Math.max(...box.getSize(new T.Vector3()).toArray());
  if(kind==='eye'){const lens=parts.find(p=>p.name.toLowerCase()==='right lens');if(lens){const lensBox=new T.Box3(new T.Vector3().fromArray(lens.bounds[0]),new T.Vector3().fromArray(lens.bounds[1]));lensBox.getCenter(center);const diameter=Math.max(...lensBox.getSize(new T.Vector3()).toArray());center.z-=diameter*.7;extent=diameter*3.2;}}
  const scale=2/extent,plane=new T.Plane(kind==='eye'?new T.Vector3(-1,0,0):new T.Vector3(0,0,-1),0);
 type Piece={shell?:ReturnType<typeof createChamberWall>;section:T.Plane;cutZ:number;mesh:T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>;part:Part;base:T.Vector3;offset:T.Vector3;spread:T.Vector3};const pieces:Piece[]=[];
  function fit(){const overview=kind==='heart'&&latest.current.cut;controls.target.set(0,0,0);const distance=Math.max(overview?6.3:4,(overview?4.2:3)/Math.max(.35,camera.aspect));if(kind==='heart'){const view=latest.current.view;camera.position.set(view==='oblique'?-distance*.5:0,.35,view==='back'?-distance:distance*(view==='oblique'?.87:1));}else camera.position.set(2.5,.6,distance);controls.update();}
  const resize=()=>{if(!el.clientWidth||!el.clientHeight)return;renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();fit();};const observer=new ResizeObserver(resize);observer.observe(el);resize();
  (async()=>{try{
   for(const ci of new Set(parts.map(p=>p.chunk))){
    const chunk=atlas.chunks[ci],compressed=!!chunk.gzip&&typeof DecompressionStream!=='undefined';
    const response=await fetch(new URL((compressed?chunk.gzip!:chunk.url).replace(/^\/+/,''),document.baseURI),{signal:abort.signal});
    const buffer=await decodeModelResponse(response,chunk.bytes,compressed);if(disposed)return;
    for(const p of parts.filter(p=>p.chunk===ci)){
     const g=new T.BufferGeometry(),positions=new Float32Array(buffer,p.positions,p.vertexCount*3).slice();
     const base=new T.Vector3().fromArray(p.bounds[0]).add(new T.Vector3().fromArray(p.bounds[1])).multiplyScalar(.5);
     for(let i=0;i<positions.length;i+=3){positions[i]=(positions[i]-base.x)*scale;positions[i+1]=(positions[i+1]-base.y)*scale;positions[i+2]=(positions[i+2]-base.z)*scale;}
     g.setAttribute('position',new T.BufferAttribute(positions,3));g.setAttribute('normal',new T.BufferAttribute(new Int16Array(buffer,p.normals,p.vertexCount*3),3,true));g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,p.indices,p.indexCount),1));g.computeBoundingSphere();g.computeBoundingBox();
     const glass=kind==='eye'&&/cornea|vitreous/i.test(p.name);const m=new T.MeshStandardMaterial({color:tint(p,kind),roughness:kind==='heart'?.54:.45,metalness:.02,side:T.DoubleSide,transparent:glass,opacity:glass?.18:1,depthWrite:!glass});const mesh=new T.Mesh(g,m);base.sub(center).multiplyScalar(scale);mesh.position.copy(base);group.add(mesh);
     const spread=base.clone();if(spread.length()<.05)spread.set(.2,0,.4);spread.normalize().multiplyScalar(.65);
     if(kind==='eye'&&/lens|cornea|iris/i.test(p.name))spread.set(/lens/i.test(p.name)?-.65:/iris/i.test(p.name)?-.25:.25,0,1);
     const chamber=CHAMBERS.find(c=>c.id===p.id);
     const shell=chamber?createChamberWall(g,p.id):undefined;if(shell){mesh.add(shell.outer,shell.rim);shell.outer.userData.chamberId=p.id;shell.rim.userData.chamberId=p.id;m.side=T.BackSide;m.color.set('#a96159');}
     pieces.push({mesh,part:p,base,offset:new T.Vector3(),spread,shell,section:new T.Plane(new T.Vector3(0,0,-1),base.z),cutZ:0});
    }
   }
   loaded=true;setReady(true);
  }catch(e){if(!disposed)setError(e instanceof Error?e.message:'3D模型を読み込めませんでした。');}})();
  const ray=new T.Raycaster(),pointer=new T.Vector2(),dragPlane=new T.Plane(),intersection=new T.Vector3(),dragStart=new T.Vector3(),savedOffset=new T.Vector3();let dragging:Piece|undefined,downX=0,downY=0,pointerId=-1;
  function nativePoint(match:(p:Part)=>boolean,fallback:T.Vector3){const bounds=new T.Box3();for(const p of parts.filter(match))bounds.union(new T.Box3(new T.Vector3().fromArray(p.bounds[0]),new T.Vector3().fromArray(p.bounds[1])));return bounds.isEmpty()?fallback.clone():bounds.getCenter(new T.Vector3()).sub(center).multiplyScalar(scale);}
  const chamberPoints=CHAMBERS.map(c=>nativePoint(p=>p.id===c.id,new T.Vector3(...c.position)));
  const landmarks:HeartLandmarks={chambers:chamberPoints,tricuspid:nativePoint(p=>p.name.toLowerCase().includes('tricuspid valve'),chamberPoints[1]),mitral:nativePoint(p=>p.name.toLowerCase().includes('mitral valve'),chamberPoints[3]),pulmonaryValve:nativePoint(p=>p.name.toLowerCase().includes('pulmonary valve'),chamberPoints[1]),aorticValve:nativePoint(p=>p.name.toLowerCase().includes('aortic valve'),chamberPoints[3]),pulmonaryTrunk:nativePoint(p=>p.id==='FJ2966',new T.Vector3(0,1,0)),aorta:nativePoint(p=>p.id==='FJ3413',new T.Vector3(.4,1,0)),venaCava:nativePoint(p=>p.id==='FJ3645',chamberPoints[0]),pulmonaryVein:nativePoint(p=>p.id==='FJ2933',chamberPoints[2])};
  const flow=kind==='heart'?createHeartFlow(scene,el,id=>setSettings(s=>({...s,selected:id})),landmarks):null;
  const rotationAxis=new T.Vector3(0,1,0);
  const ventricleAnchor=chamberPoints[1].clone().add(chamberPoints[3]).multiplyScalar(.5),transformScale=new T.Vector3(),transformPoint=new T.Vector3();
  const vesselFloor=new T.Plane(new T.Vector3(0,1,0),1.2);
  let currentBeat=heartCycle(0);
  function transform(point:T.Vector3,chamber:number){if(chamber<0||(!latest.current.running&&!latest.current.coupled))return transformPoint.copy(point);const atrium=chamber===0||chamber===2,amount=atrium?currentBeat.atrial:currentBeat.ventricular;const anchor=atrium?chamberPoints[chamber]:ventricleAnchor;transformScale.set(1-amount*(atrium?.085:.13),1-amount*(atrium?.04:.065),1-amount*(atrium?.085:.13));return transformPoint.copy(point).sub(anchor).multiply(transformScale).applyAxisAngle(rotationAxis,atrium?0:amount*.035).add(anchor);}
  function cast(e:PointerEvent){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2);ray.setFromCamera(pointer,camera);}
  function hit(e:PointerEvent){cast(e);const meshes=pieces.filter(p=>p.mesh.visible).map(p=>p.mesh);return ray.intersectObjects(meshes,true).find(h=>{if(!h.object.visible)return false;const piece=pieces.find(p=>p.mesh===h.object||p.part.id===h.object.userData.chamberId);return !!piece&&(!latest.current.cut||!latest.current.opened.includes(piece.part.id)||piece.section.distanceToPoint(h.point)>=-1e-5);});}
  function down(e:PointerEvent){downX=e.clientX;downY=e.clientY;pointerId=e.pointerId;if(!latest.current.drag)return;const h=hit(e);if(!h)return;dragging=pieces.find(p=>p.mesh===h.object||p.part.id===h.object.userData.chamberId);if(!dragging)return;controls.enabled=false;renderer.domElement.setPointerCapture(e.pointerId);dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new T.Vector3()),h.point);dragStart.copy(h.point);savedOffset.copy(dragging.offset);const selectedId=dragging.part.id;setSettings(s=>({...s,selected:selectedId,running:false}));}
  function move(e:PointerEvent){if(!dragging||e.pointerId!==pointerId)return;cast(e);if(ray.ray.intersectPlane(dragPlane,intersection))dragging.offset.copy(savedOffset).add(intersection.clone().sub(dragStart));}
  function up(e:PointerEvent){if(dragging){dragging=undefined;controls.enabled=true;return;}if(Math.hypot(e.clientX-downX,e.clientY-downY)>6)return;const h=hit(e),p=pieces.find(p=>p.mesh===h?.object||p.part.id===h?.object.userData.chamberId);if(p)setSettings(s=>({...s,selected:p.part.id}));}
  function cancel(){dragging=undefined;controls.enabled=true;}
  renderer.domElement.addEventListener('pointerdown',down,true);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',cancel);
  let last=performance.now(),cycle=0,lastStage=-1,lastReset=0,wasRunning=false,lastSolo='',lastCut=latest.current.cut,flowProgress=0,lastFlowStep=-1,lastDepth=-1,lastScrub=-1,lastView=-1;
  function sound(high:boolean){const ctx=audio.current,gainOut=master.current;if(!ctx||!gainOut||ctx.state!=='running')return;const now=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(high?105:78,now);osc.frequency.exponentialRampToValueAtTime(high?55:42,now+.11);gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.75,now+.012);gain.gain.exponentialRampToValueAtTime(.001,now+.16);osc.connect(gain).connect(gainOut);osc.start(now);osc.stop(now+.17);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
  function animate(now:number){if(disposed)return;raf=requestAnimationFrame(animate);const s=latest.current,dt=Math.min((now-last)/1000,.08);last=now;const beatDt=dt*(s.slow?.25:1);
   const overview=kind==='heart'&&s.cut&&!s.solo;
   if(s.cut!==lastCut||s.viewRevision!==lastView){fit();lastCut=s.cut;lastView=s.viewRevision;}
   if(s.flowStep!==lastFlowStep){flowProgress=0;lastFlowStep=s.flowStep;}
   if(overview&&s.flowPlaying&&loaded){flowProgress+=dt/1.8;if(flowProgress>=1){flowProgress=0;setSettings(v=>({...v,flowStep:(v.flowStep+1)%FLOW_STEPS.length}));}}
   if(s.reset!==lastReset){for(const p of pieces)p.offset.set(0,0,0);fit();cycle=0;lastReset=s.reset;}
   if(s.scrubRevision!==lastScrub){cycle=s.scrub;lastScrub=s.scrubRevision;lastStage=-1;}
   if(s.running){if(!wasRunning)lastStage=-1;cycle=(cycle+beatDt*s.bpm/60)%1;}wasRunning=s.running;
   currentBeat=heartCycle(cycle);if(cycleSlider.current)cycleSlider.current.value=String(cycle);const stage=currentBeat.stage;
   if(stage!==lastStage){if(s.running&&stage===1)sound(true);if(s.running&&stage===3)sound(false);setPhase(currentBeat.text);setBeatPhase(cycle);lastStage=stage;}
   if(s.depth!==lastDepth&&loaded){for(const p of pieces){if(!p.shell)continue;p.mesh.remove(p.shell.outer,p.shell.rim);p.shell.dispose();p.mesh.geometry.computeBoundingBox();p.cutZ=(.5-s.depth)*p.mesh.geometry.boundingBox!.getSize(new T.Vector3()).z;p.shell=createChamberWall(p.mesh.geometry,p.part.id,p.cutZ);p.shell.outer.userData.chamberId=p.part.id;p.shell.rim.userData.chamberId=p.part.id;p.mesh.add(p.shell.outer,p.shell.rim);}lastDepth=s.depth;}
   for(const p of pieces){
    const n=p.part.name.toLowerCase(),cavity=n.includes('cavity'),chamber=CHAMBERS.find(c=>c.id===p.part.id);
    const opened=s.opened.includes(p.part.id);
    const nativeWall=n.startsWith('wall of'),coronary=p.part.system==='arterial'||p.part.system==='venous';
    const isPort=['FJ2966','FJ3413','FJ3441','FJ3645','FJ2925','FJ2933','FJ2944','FJ2950','FJ2955','FJ3020','FJ3040'].includes(p.part.id);
    const shellView=kind==='heart'&&s.cut&&!s.solo;
    p.mesh.visible=(!s.solo||s.selected===p.part.id)&&(!cavity||s.cut||s.selected===p.part.id)&&!(shellView&&(nativeWall||coronary&&!isPort));
    p.mesh.material.emissive.set(p.part.id===s.selected?'#2c160f':'#000000');
    if(kind==='heart'){
     const opacity=heartFocusOpacity(p.part.id,s.selected,s.focusChamber&&s.cut&&!s.solo);
     for(const material of [p.mesh.material,...(p.shell?[p.shell.outer.material,p.shell.rim.material]:[])]){const transparent=opacity<1;if(material.transparent!==transparent){material.transparent=transparent;material.needsUpdate=true;}material.opacity=opacity;material.depthWrite=!transparent;}
    }
    p.mesh.position.copy(p.base).addScaledVector(p.spread,s.spread).add(p.offset);p.mesh.rotation.set(0,0,0);p.mesh.scale.setScalar(1);
    if(kind==='heart'){
     const atriumIndex=n.includes('right atrium')?0:n.includes('left atrium')?2:-1;
     const chamberIndex=atriumIndex>=0?atriumIndex:isPort?-1:1;
     if(s.running||s.coupled){p.mesh.position.copy(transform(p.base,chamberIndex)).addScaledVector(p.spread,s.spread).add(p.offset);if(chamberIndex>=0){p.mesh.scale.copy(transformScale);p.mesh.rotation.y=atriumIndex>=0?0:currentBeat.ventricular*.035;}}
     if(n.includes('valve')){
      const av=n.includes('mitral')||n.includes('tricuspid'),open=av?currentBeat.avOpen:currentBeat.outletOpen;
      // Actual leaflet meshes move about their upper attachment. Angles are illustrative.
      const opening=(s.running||s.coupled)&&open?.45:0;
      const hinge=p.mesh.geometry.boundingBox!.max.y*p.mesh.scale.y;
      const sign=n.includes('posterior')?-1:1;p.mesh.rotation.x=opening*sign;p.mesh.position.y+=hinge*(1-Math.cos(opening));p.mesh.position.z-=hinge*Math.sin(opening)*sign;
     }
     if(chamber){
      p.mesh.material.side=T.BackSide;p.mesh.material.color.set('#a96159');
      p.section.setFromNormalAndCoplanarPoint(new T.Vector3(0,0,-1).applyEuler(p.mesh.rotation),new T.Vector3(0,0,p.cutZ).multiply(p.mesh.scale).applyEuler(p.mesh.rotation).add(p.mesh.position));
      p.mesh.material.clippingPlanes=s.cut&&opened?[p.section]:[];
      if(p.shell){p.shell.outer.visible=true;p.shell.outer.material.clippingPlanes=s.cut&&opened?[p.section]:[];p.shell.rim.visible=s.cut&&opened;p.shell.outer.material.emissive.copy(p.mesh.material.emissive);}
     }else p.mesh.material.clippingPlanes=isPort?[vesselFloor]:kind==='heart'?[]:s.cut?[plane]:[];
    }else{p.mesh.material.clippingPlanes=s.cut?[plane]:[];if(n==='right lens')p.mesh.scale.set(1,1,s.near?1.35:1);}
   }
   const soloKey=s.solo?s.selected:'';
   if(soloKey!==lastSolo){if(soloKey){const p=pieces.find(p=>p.part.id===soloKey);if(p){const radius=p.mesh.geometry.boundingSphere?.radius??.3;controls.target.copy(p.mesh.position);camera.position.copy(p.mesh.position).add(new T.Vector3(.5,.15,1).normalize().multiplyScalar(Math.max(.6,radius*3.6/Math.min(1,camera.aspect))));}}else fit();lastSolo=soloKey;}
   controls.update();flow?.update(camera,overview&&loaded,s.flowStep,flowProgress,s.coupled,s.running,currentBeat,beatDt,s.bpm,s.showFlow,transform,s.flowScope,s.xray,s.selected);if(loaded)renderer.render(scene,camera);
  }raf=requestAnimationFrame(animate);
  return()=>{disposed=true;abort.abort();cancelAnimationFrame(raf);observer.disconnect();controls.dispose();flow?.dispose();for(const p of pieces){p.shell?.dispose();p.mesh.geometry.dispose();p.mesh.material.dispose();}renderer.dispose();renderer.domElement.remove();};
 },[atlas,kind,parts]);
 const selected=parts.find(p=>p.id===settings.selected),selectedChamber=CHAMBERS.find(c=>c.id===settings.selected),observation=heartObservationState(beatPhase);
 const observe=(p:number)=>{setPhase(heartCycle(p).text);setBeatPhase(p);update({scrub:p,scrubRevision:settings.scrubRevision+1,running:false,coupled:true,flowPlaying:false,cut:true,spread:0,drag:false});};
 return <section className="model-workbench" role="dialog" aria-modal="true" aria-label="手で動かす3D模型">
  <header><div><span>手で動かす3D模型 · BodyParts3D</span><h2>{kind==='heart'?'心臓の四つの部屋と血液の流れ':'目を回して、分解してみる'}</h2></div><button onClick={onClose}>閉じる ×</button></header>
  <div className="model-workspace"><div className="model-stage"><div ref={host} className="model-canvas"/>{!ready&&!error&&<p className="model-status" role="status">器官の3Dデータを読み込み中…</p>}{error&&<p className="model-status" role="alert">{error}</p>}<div className="model-caption">{kind==='heart'&&settings.cut?'前側を開いた心臓 · ドラッグで角度を変える':settings.drag?'部品をつかんで移動 · 空いている所で回転':'ドラッグで回転 · ピンチ／ホイールで拡大'}<br/>{selected?partName(selected):'部品をタップして選択'}</div>{kind==='heart'&&<div className="model-beat" role="status">{phase}<small>{settings.bpm}回／分{settings.slow?'（観察用に4倍ゆっくり）':''} · {settings.muted?'消音':`音量 ${Math.round(settings.volume*100)}%`}</small></div>}</div>
  <aside className="model-tools">
   {kind==='heart'&&<section className="four-chamber-tools" aria-label="二心房・二心室と血液の流れ">
    <button className="model-primary" disabled={!ready} onClick={()=>void start()}>{settings.running?'■ 拍動・心音・血流を一緒に停止':'▶ 拍動・心音・血流を一緒に再生'}</button>
    {settings.coupled&&<div className="flow-current" role="status"><strong>{phase}</strong><p>心房から心室へ入る流れと、心室から肺・全身へ出る流れが切り替わります。左右の心室は一緒に縮みます。</p><small>赤血球の動きは経路を示す模式表現です。実際の流速や一周の時間は再現していません。</small></div>}
    <button className="model-primary" aria-pressed={settings.cut} onClick={()=>update({cut:!settings.cut,solo:false,spread:0,drag:false,selected:''})}>{settings.cut?'前側を閉じて外観を見る':'前側を開いて内部を見る'}</button>
    <nav className="heart-views" aria-label="心臓を見る方向">{([['front','正面'],['oblique','斜め前'],['back','後ろから']] as const).map(([view,title])=><button key={view} aria-pressed={settings.view===view} onClick={()=>update({view,viewRevision:settings.viewRevision+1,solo:false})}>{title}</button>)}</nav>
    <label className="model-check"><input type="checkbox" checked={settings.slow} onChange={e=>update({slow:e.target.checked})}/>1拍を4倍ゆっくり観察</label>
    <label className="model-check"><input type="checkbox" checked={settings.showFlow} onChange={e=>update({showFlow:e.target.checked})}/>血流の道すじと赤血球を表示</label>
    <div className="heart-flow-scope" role="group" aria-label="血流を表示する範囲"><button aria-pressed={settings.flowScope==='heart'} onClick={()=>update({flowScope:'heart'})}>心臓の中を中心に</button><button aria-pressed={settings.flowScope==='all'} onClick={()=>update({flowScope:'all'})}>肺・全身まで追う</button></div>
    <label className="model-check"><input type="checkbox" checked={settings.xray} onChange={e=>update({xray:e.target.checked})}/>壁越しに血流を見る（透視）</label>
    <label>1拍を手で進める（操作すると停止）<input ref={cycleSlider} aria-label="1拍の進み具合" type="range" min="0" max=".999" step=".005" defaultValue={settings.scrub} onChange={e=>observe(+e.target.value)}/></label>
    <div className="heart-phase-key" role="group" aria-label="一拍を止めて観察">{HEART_OBSERVATION_STEPS.map((step,i)=><button key={step.title} aria-pressed={observation.key===i} onClick={()=>observe(step.phase)}>{step.title}</button>)}</div>
    <div className="heart-valve-state" aria-live="polite"><div><span>心房と心室の間<br/><small>三尖弁・僧帽弁</small></span><b className={observation.avOpen?'open':'closed'}>{observation.avOpen?'開く':'閉じる'}</b></div><div><span>心室の出口<br/><small>肺動脈弁・大動脈弁</small></span><b className={observation.outletOpen?'open':'closed'}>{observation.outletOpen?'開く':'閉じる'}</b></div></div>
    {settings.cut&&<><label>前側を開く深さ<input aria-label="前側を開く深さ" type="range" min=".3" max=".7" step=".02" value={settings.depth} onChange={e=>update({depth:+e.target.value})}/></label><h3>二心房・二心室</h3><div className="chamber-picks">{CHAMBERS.map(c=><button key={c.id} aria-pressed={settings.selected===c.id} onClick={()=>update({selected:c.id,solo:false})}>{c.name}<small>{c.role}</small></button>)}</div>
    <label className="model-check"><input type="checkbox" checked={settings.focusChamber} onChange={e=>update({focusChamber:e.target.checked})}/>選んだ部屋の周囲を透かす</label>
    {selectedChamber&&<div className="heart-chamber-info" aria-live="polite"><strong>{selectedChamber.name}</strong><dl><dt>入ってくる道</dt><dd>{selectedChamber.inflow}</dd><dt>出ていく道</dt><dd>{selectedChamber.outflow}</dd></dl><p>{selectedChamber.hint}</p><button onClick={()=>update({selected:'',solo:false})}>四つの部屋に戻す</button></div>}
    <fieldset className="chamber-open"><legend>それぞれの前半分を開く</legend>{CHAMBERS.map(c=><label key={c.id}><input type="checkbox" checked={settings.opened.includes(c.id)} onChange={e=>update({opened:e.target.checked?[...settings.opened,c.id]:settings.opened.filter(id=>id!==c.id)})}/>{c.name}の前半分を開く</label>)}</fieldset>
    <p className="flow-legend">青い経路：酸素が少ない ／ 赤い経路：酸素が多い。流れる赤血球はどちらも赤色で示しています。</p>
    <p>一周する順序をゆっくり確認する</p><div className="model-tool-row"><button disabled={!ready} onClick={()=>update({flowPlaying:!settings.flowPlaying,coupled:false,running:false,flowScope:'all'})}>{settings.flowPlaying?'経路の案内を一時停止':'▶ 経路を順番に追う'}</button><button onClick={()=>update({flowPlaying:false,coupled:false,running:false,flowStep:(settings.flowStep+1)%8,flowScope:'all'})}>次の流れ</button></div>
    {!settings.coupled&&<div className="flow-current" aria-live="polite"><strong>{settings.flowStep+1}/8　{FLOW_STEPS[settings.flowStep].text}</strong><p>{FLOW_STEPS[settings.flowStep].detail}</p></div>}
    <details><summary>血液の道すじを選ぶ</summary>{FLOW_STEPS.map((step,i)=><button key={step.text} aria-pressed={settings.flowStep===i} onClick={()=>update({flowPlaying:false,coupled:false,running:false,flowStep:i,flowScope:'all'})}>{i+1}. {step.text}</button>)}</details>
    <p className="flow-note">心房・心室の壁、弁、血管、内側の空間を含む3D部品を元の位置で表示します。断面は観察用に前側を切り取ります。線と拡大した赤血球は血流の模式表現です。</p>
    <a href="https://www.nhlbi.nih.gov/health/heart/anatomy" target="_blank" rel="noreferrer">構造の参考：米国NIH・心臓のつくり</a>
    </>}
   </section>}
   {kind==='heart'?<><label>心拍数：{settings.bpm}回／分<input type="range" min="40" max="140" step="1" value={settings.bpm} onChange={e=>update({bpm:+e.target.value})}/></label><label>心音の音量<input type="range" min="0" max="1" step=".05" value={settings.volume} onChange={e=>update({volume:+e.target.value})}/></label><button aria-pressed={settings.muted} onClick={()=>update({muted:!settings.muted})}>{settings.muted?'心音を入れる':'心音を消す'}</button><p>「ドッ」は心室が縮み始めるころ、「クン」はゆるみ始めるころ。弁が閉じる時の心音を合成音で表しています。</p>{audioError&&<p role="alert">{audioError}</p>}</>:<><button aria-pressed={settings.near} onClick={()=>update({near:!settings.near})}>{settings.near?'近くを見る：水晶体が厚い':'遠くを見る：水晶体が薄い'}</button><p>水晶体を選び、「選んだ部品だけ」で横から形を比べよう。</p></>}
   <div className="model-tool-row">{kind==='eye'&&<button aria-pressed={settings.cut} onClick={()=>update({cut:!settings.cut})}>半分ひらく</button>}<button aria-pressed={settings.drag} onClick={()=>update({drag:!settings.drag,cut:false,running:false})}>部品をつかむ</button></div>
   <label>模型を分解<input type="range" min="0" max="1" step=".01" value={settings.spread} onChange={e=>update({spread:+e.target.value,running:false,cut:false})}/></label>
   <label>部品を選ぶ<select aria-label="3D模型の部品" value={settings.selected} onChange={e=>update({selected:e.target.value})}><option value="">模型をタップして選べます</option>{parts.map(p=><option key={p.id} value={p.id}>{partName(p)}</option>)}</select></label>
   <button disabled={!selected} aria-pressed={settings.solo} onClick={()=>update({solo:!settings.solo,cut:kind==='heart'&&CHAMBERS.some(c=>c.id===settings.selected)?settings.cut:false})}>{settings.solo?'全部品を表示':'選んだ部品だけ'}</button><p aria-live="polite"><strong>{selected?partName(selected):'触って確かめよう'}</strong><br/>{describe(selected,kind)}</p>
   <button onClick={()=>setSettings(s=>({...defaults,cut:kind==='heart',reset:s.reset+1}))}>組み立て直して最初に戻す</button>
   <small>元の形状はBodyParts3Dの3Dデータです。心臓の壁の厚み・切り口・収縮・弁の開閉・拡大した赤血球と経路、水晶体の変形は学習用の表現です。目の切断面は埋めていません。</small>
  </aside></div>
 </section>;
}
