import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import metadata from './openear-parts.json';
import {decodeModelResponse} from './model-download';
import {PointerTap} from './pointer-tap';
import './organ-model.css';
import './ear-model.css';

type EarGroup='canal'|'drum'|'ossicles'|'cochlea'|'nerve'|'brain'|'vestibule';
interface Step {id:EarGroup;name:string;title:string;description:string}
const STEPS:Step[]=[
 {id:'canal',name:'外耳道',title:'音が耳の中に入る',description:'音は空気の振動として外耳道を通り、奥の鼓膜に届きます。外耳道は半透明で示しています。'},
 {id:'drum',name:'鼓膜',title:'鼓膜が振動する',description:'音の振動を受けて鼓膜がふるえ、その振動が内側の耳小骨に伝わります。'},
 {id:'ossicles',name:'耳小骨',title:'小さな骨が振動を伝える',description:'ツチ骨・キヌタ骨・アブミ骨の3つがつながり、振動を内耳へ伝えます。'},
 {id:'cochlea',name:'うずまき管',title:'振動が内耳に届く',description:'うずまき管の中の液体に振動が伝わり、感覚細胞がそれを受け取ります。'},
 {id:'nerve',name:'聴神経',title:'神経の信号が脳へ向かう',description:'受け取った振動は神経の信号に変わり、聴神経を通って脳に伝わります。模型の黄色い部分は聴神経を含む神経です。'},
 {id:'brain',name:'脳',title:'脳で音として感じる',description:'脳が届いた情報を処理することで、私たちは音として感じます。脳はこの耳の模型には含まれていません。'},
 {id:'vestibule',name:'前庭・半規管を含む内耳',title:'体の傾きや動きを感じる部分',description:'前庭と半規管は、体の傾きや回転を感じる働きに関わります。強調した立体は、前庭・半規管とうずまき管につながる内耳の空間を含みます。'},
];
const PATH_LENGTH=6;
const GROUPS:Record<string,EarGroup>={OE000:'cochlea',OE001:'vestibule',OE002:'ossicles',OE003:'ossicles',OE004:'ossicles',OE007:'nerve',OE008:'drum',OE009:'canal'};
const COLORS:Record<EarGroup,string>={canal:'#aabbb9',drum:'#daccc5',ossicles:'#eadcc5',cochlea:'#c99780',nerve:'#d5b76c',brain:'#b8a5a0',vestibule:'#c5a695'};

export default function EarModel({onClose}:{onClose:()=>void}){
 const [step,setStep]=useState(-1),[playing,setPlaying]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState('');
 const host=useRef<HTMLDivElement>(null),current=useRef(step),resetView=useRef<()=>void>(()=>{});
 current.current=step;
 useEffect(()=>{
  if(!playing)return;
  if(step>=PATH_LENGTH-1){setPlaying(false);return;}
  const timer=window.setTimeout(()=>setStep(value=>value+1),2600);
  return()=>window.clearTimeout(timer);
 },[playing,step]);
 useEffect(()=>{
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();};
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[onClose]);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let disposed=false,raf=0,dirty=true,lastStep=-2;
  const abort=new AbortController();
  let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true});}
  catch{setError('この端末では3D表示を開始できませんでした。Chromeの設定を確認してください。');return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25));
  renderer.setClearColor('#edf2f0');renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  renderer.domElement.setAttribute('aria-label','耳の内部の3D模型。ドラッグで回転し、部位をタップして選択できます。');
  el.appendChild(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.05,50);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=1.5;controls.maxDistance=12;
  controls.addEventListener('change',()=>{dirty=true;});
  scene.add(new T.HemisphereLight('#ffffff','#9aa6a6',1.7));
  const key=new T.DirectionalLight('#fff8f0',2.3);key.position.set(-2,4,5);scene.add(key);
  const fill=new T.DirectionalLight('#d9e8ee',1.2);fill.position.set(4,1,-3);scene.add(fill);
  const parts=metadata.parts.filter(p=>GROUPS[p.id]);
  const box=new T.Box3();
  for(const part of parts)box.union(new T.Box3(new T.Vector3().fromArray(part.bounds[0]),new T.Vector3().fromArray(part.bounds[1])));
  const center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
  const scale=2.4/Math.max(size.x,size.y,size.z);
  const meshes:T.Mesh<T.BufferGeometry,T.MeshStandardMaterial>[]=[];
  const fit=()=>{controls.target.set(0,0,0);const distance=Math.max(3.7,3.1/Math.max(.55,camera.aspect));camera.position.set(-distance*.45,distance*.22,distance);controls.update();dirty=true;};
  resetView.current=fit;
  const resize=()=>{if(!el.clientWidth||!el.clientHeight)return;renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();dirty=true;};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();fit();
  (async()=>{try{
   const compressed=typeof DecompressionStream!=='undefined';
   const response=await fetch(new URL(compressed?'models/openear-0.bin.gz':'models/openear-0.bin',document.baseURI),{signal:abort.signal});
   const buffer=await decodeModelResponse(response,2896552,compressed);
   if(disposed)return;
   for(const part of parts){
    const positions=new Float32Array(buffer,part.positions,part.vertexCount*3).slice();
    for(let i=0;i<positions.length;i+=3){positions[i]=(positions[i]-center.x)*scale;positions[i+1]=(positions[i+1]-center.y)*scale;positions[i+2]=(positions[i+2]-center.z)*scale;}
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.BufferAttribute(positions,3));
    geometry.setAttribute('normal',new T.BufferAttribute(new Int16Array(buffer,part.normals,part.vertexCount*3),3,true));
    geometry.setIndex(new T.BufferAttribute(new Uint32Array(buffer,part.indices,part.indexCount),1));
    geometry.computeBoundingSphere();
    const group=GROUPS[part.id],material=new T.MeshStandardMaterial({color:COLORS[group],roughness:.58,metalness:0,side:T.DoubleSide,transparent:group==='canal',opacity:group==='canal'?.14:1,depthWrite:group!=='canal'});
    const mesh=new T.Mesh(geometry,material);mesh.userData.group=group;
    if(group==='canal')mesh.renderOrder=2;
    scene.add(mesh);meshes.push(mesh);
   }
   dirty=true;setReady(true);
  }catch(e){if(!disposed)setError('耳の3Dデータを読み込めませんでした。ページを再読み込みしてください。');}})();
  const ray=new T.Raycaster(),pointer=new T.Vector2(),tap=new PointerTap(),canvas=renderer.domElement;
  const down=(e:PointerEvent)=>tap.down(e.pointerId,e.clientX,e.clientY,e.pointerType==='touch'?12:5);
  const move=(e:PointerEvent)=>tap.move(e.pointerId,e.clientX,e.clientY);
  const cancel=(e:PointerEvent)=>tap.cancel(e.pointerId);
  const up=(e:PointerEvent)=>{
   if(!tap.up(e.pointerId,e.clientX,e.clientY))return;
   const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2);ray.setFromCamera(pointer,camera);
   const hits=ray.intersectObjects(meshes),hit=hits.find(h=>h.object.userData.group!=='canal')??hits[0];
   const index=STEPS.findIndex(item=>item.id===hit?.object.userData.group);
   if(index>=0){setPlaying(false);setStep(index);}
  };
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',cancel);
  const animate=()=>{
   if(disposed)return;raf=requestAnimationFrame(animate);
   if(current.current!==lastStep){
    const selected=STEPS[current.current]?.id;
    for(const mesh of meshes){
     const group=mesh.userData.group as EarGroup,active=group===selected,canal=group==='canal';
     const opacity=canal?(active?.55:.14):selected&&selected!=='brain'&&!active?.33:1;
     mesh.material.color.set(active?'#23877a':COLORS[group]);mesh.material.opacity=opacity;mesh.material.transparent=opacity<1;mesh.material.depthWrite=opacity>=1;mesh.material.emissive.set(active?'#315c51':'#000000');mesh.material.emissiveIntensity=active?.25:0;mesh.material.needsUpdate=true;
    }
    lastStep=current.current;dirty=true;
   }
   controls.update();if(dirty){renderer.render(scene,camera);dirty=false;}
  };animate();
  return()=>{
   disposed=true;abort.abort();cancelAnimationFrame(raf);observer.disconnect();controls.dispose();
   canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',cancel);
   for(const mesh of meshes){mesh.geometry.dispose();mesh.material.dispose();}
   renderer.dispose();canvas.remove();resetView.current=()=>{};
  };
 },[]);
 const item=STEPS[step];
 return <section className="model-workbench ear-workbench" role="dialog" aria-modal="true" aria-label="耳の3D模型">
  <header><div><span>耳を回して観察 · 実際の耳の画像から作られた3D形状</span><h2>音は、どのように脳に届く？</h2></div><button onClick={onClose}>学習メニューに戻る ×</button></header>
  <div className="model-workspace"><div className="model-stage ear-stage"><div ref={host} className="model-canvas"/>
   {!ready&&!error&&<p className="model-status" role="status">耳の3D模型を準備中…</p>}{error&&<p className="model-status" role="alert">{error}</p>}
   <div className="ear-stage-hint">ドラッグで回転 ・ ピンチやスクロールで拡大縮小</div>
  </div>
  <aside className="model-tools ear-tools">
   <div className="ear-intro"><span>観察のめあて</span><h3>振動が神経の情報に変わるまで</h3><p>模型を回し、順番に部位を選んでたどってみよう。</p></div>
   <div className="ear-current" aria-live="polite"><small>{item?(step<PATH_LENGTH?`${step+1} / ${PATH_LENGTH}　${item.name}`:`発展　${item.name}`):'まずは全体を観察'}</small><strong>{item?.title??'鼓膜・耳小骨・内耳の位置を見よう'}</strong><p>{item?.description??'外側の通り道は半透明です。骨や内耳の形を、いろいろな角度から確かめましょう。'}</p></div>
   <div className="ear-controls"><button className="model-primary" disabled={!ready} onClick={()=>{if(playing){setPlaying(false);}else{setStep(0);setPlaying(true);}}}>{playing?'■ 自動案内を止める':'▶ 音の道すじをたどる'}</button><button disabled={!ready||step>=PATH_LENGTH-1} onClick={()=>{setPlaying(false);setStep(s=>Math.min(s+1,PATH_LENGTH-1));}}>次へ</button></div>
   <div className="ear-steps" aria-label="音が伝わる順序">{STEPS.slice(0,PATH_LENGTH).map((s,i)=><button key={s.id} aria-pressed={step===i} onClick={()=>{setPlaying(false);setStep(i);}}><span>{i+1}</span>{s.name}</button>)}</div>
   <button aria-pressed={step===PATH_LENGTH} onClick={()=>{setPlaying(false);setStep(PATH_LENGTH);}}>前庭・半規管を含む内耳も見る</button>
   <button onClick={()=>{setPlaying(false);setStep(-1);resetView.current();}}>全体の位置と向きに戻す</button>
   <details className="ear-source"><summary>模型の出典と見方</summary><p>OpenEar（Sieberら、ZETA標本）の実際の耳の画像から再構成した形状を使用しています。Cogni Anatomyによる座標調整・簡略化を含み、本アプリでは色と表示を調整しています。振動や神経信号は、順番を示す強調表示であり、実際の速さ・動きの再現ではありません。</p><p>うずまき管は内部の空間を表します。聴神経と平衡感覚の神経は模型上でまとまっています。</p><a href="https://doi.org/10.1038/sdata.2018.297" target="_blank" rel="noreferrer">OpenEar の研究と出典</a> · <a href="https://cogni.cards/anatomy/about/" target="_blank" rel="noreferrer">Cogni Anatomy の加工内容</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a><p>学習内容の参考：<a href="https://www.nidcd.nih.gov/health/how-do-we-hear" target="_blank" rel="noreferrer">米国NIDCD「How Do We Hear?」</a></p></details>
  </aside></div>
 </section>;
}
