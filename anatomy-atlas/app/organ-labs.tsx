import {useEffect, useRef, useState} from 'react';
import './organ-labs.css';

function Check({question, options, correct, explanation}:{question:string; options:string[]; correct:number; explanation:string}) {
 const [answer,setAnswer]=useState<number|null>(null);
 return <section className="lab-check"><strong>確かめよう：{question}</strong><div className="lab-controls">{options.map((o,i)=><button key={o} aria-pressed={answer===i} onClick={()=>setAnswer(i)}>{o}</button>)}</div>{answer!==null&&<p role="status">{answer===correct?'正解です。':'もう一度、図を見てみよう。'}{explanation}</p>}</section>;
}

const phases=[
 {name:'① 血液が心室へ入る',text:'心房と心室がゆるみ、血液が心房から心室へ流れ込みます。心房と心室の間の弁は開いています。',av:true,out:false},
 {name:'② 心房が縮む',text:'左右の心房がほぼ同時に縮み、心室へ最後のひと押しをします。',av:true,out:false},
 {name:'③ 心室が縮む',text:'左右の心室がほぼ同時に縮みます。心房との間の弁が閉じ、圧力が上がると出口の弁が開きます。右から肺へ、左から全身へ送り出します。',av:false,out:true},
 {name:'④ 心室がゆるむ',text:'出口の弁が閉じ、動脈からの逆流を防ぎます。圧力が下がると心房との間の弁が開き、次の拍動へ進みます。',av:false,out:false},
];
const chambers=[
 {name:'右心房',x:145,y:116,d:'M105 76 Q68 88 80 137 Q96 164 178 150 L183 92 Q151 60 105 76Z',color:'#447ea3',explain:'大静脈から全身をめぐった血液を受け取ります。'},
 {name:'左心房',x:284,y:116,d:'M233 91 Q285 61 323 90 Q349 113 326 153 L240 155Z',color:'#c96670',explain:'肺静脈から酸素を多く含む血液を受け取ります。'},
 {name:'右心室',x:146,y:233,d:'M82 173 Q89 260 209 323 L201 182 Q136 163 82 173Z',color:'#447ea3',explain:'肺動脈を通して肺へ血液を送ります。'},
 {name:'左心室',x:274,y:230,d:'M224 180 L224 321 Q346 281 335 177 Q289 162 224 180Z',color:'#c96670',explain:'大動脈を通して全身へ血液を送ります。遠くまで送るため、壁の筋肉が厚くなっています。'},
];

export function HeartLab(){
 const [phase,setPhase]=useState(0),[running,setRunning]=useState(false),[slow,setSlow]=useState(true),[bpm,setBpm]=useState(72),[sound,setSound]=useState(false),[selected,setSelected]=useState(0);
 const context=useRef<AudioContext|null>(null);
 const p=phases[phase];
 useEffect(()=>{
  if(!running)return;
  const durations=[.4,.15,.3,.15];
  const timer=window.setTimeout(()=>setPhase(v=>(v+1)%4),60000/bpm*(slow?4:1)*durations[phase]);
  return ()=>window.clearTimeout(timer);
 },[running,phase,bpm,slow]);
 useEffect(()=>{
  if(!running||!sound||!context.current||(phase!==2&&phase!==3))return;
  const ctx=context.current,osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;
  osc.frequency.setValueAtTime(phase===2?85:65,now);gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.16,now+.012);gain.gain.exponentialRampToValueAtTime(.001,now+.12);
  osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+.13);
  return ()=>{osc.disconnect();gain.disconnect();};
 },[phase,running,sound]);
 useEffect(()=>()=>{void context.current?.close();},[]);
 async function toggleSound(){if(sound){setSound(false);return;}try{context.current??=new AudioContext();await context.current.resume();setSound(true);}catch{setSound(false);}}
 return <section className="organ-lab">
  <h4>心臓を切り開いて、1拍を観察</h4><p>再生して動きを見たら、一時停止して部屋をタッチしよう。</p>
  <svg viewBox="0 0 420 370" className="organ-diagram" aria-label="心臓の断面模式図。向かって左が体の右側。左右の心室は同時に収縮する。">
   <defs><linearGradient id="heart-wall" x2="1" y2="1"><stop stopColor="#e7aaa2"/><stop offset="1" stopColor="#973c4d"/></linearGradient><marker id="heart-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#fff"/></marker></defs>
   <path d="M66 104 C55 47 149 35 209 70 C264 32 355 58 360 127 C390 246 274 342 215 354 C157 336 41 246 59 154Z" fill="url(#heart-wall)"/>
   <path d="M111 15V89 M284 77V23" stroke="#608faf" strokeWidth="24" fill="none"/>
   <path d="M309 87L359 38 M245 84Q217 2 184 35" stroke="#c96670" strokeWidth="23" fill="none"/>
   {chambers.map((c,i)=><g key={c.name} role="button" tabIndex={0} aria-label={c.name} aria-pressed={selected===i} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(i);}}}>
    <path d={c.d} fill={c.color} stroke={selected===i?'#ffdc79':'#edb6ac'} strokeWidth={selected===i?4:2} style={{transformOrigin:`${c.x}px ${c.y}px`,transform:`scale(${(i<2&&phase===1)||(i>=2&&phase===2)?.91:1})`,transition:'transform 140ms'}}/>
    <text x={c.x} y={c.y} textAnchor="middle" fill="white">{c.name}</text>
   </g>)}
   {[143,278].map(x=><path key={x} d={p.av?`M${x-22} 163l12 17 M${x+22} 163l-12 17`:`M${x-22} 163l22 3 22-3`} fill="none" stroke="#fff3c5" strokeWidth="5"/>)}
   {p.av&&[143,278].map(x=><path key={x} d={`M${x} 135V203`} stroke="white" strokeWidth="3" markerEnd="url(#heart-arrow)" className={running?'lab-flow':''}/>)}
   {p.out&&<g fill="none" stroke="white" strokeWidth="3" markerEnd="url(#heart-arrow)"><path d="M166 249Q202 170 284 37" className={running?'lab-flow':''}/><path d="M286 252Q266 144 211 38" className={running?'lab-flow':''}/></g>}
   <g fontSize="12" fill="#344957"><text x="20" y="361">体の右側</text><text x="318" y="361">体の左側</text><text x="62" y="14">大静脈</text><text x="260" y="14">肺動脈</text><text x="352" y="30">肺静脈</text><text x="165" y="23">大動脈</text></g>
  </svg>
  <div className="lab-controls"><button onClick={()=>setRunning(!running)}>{running?'一時停止':'拍動を再生'}</button><button onClick={()=>{setRunning(false);setPhase(v=>(v+1)%4);}}>1段階進む</button><button aria-pressed={sound} onClick={()=>void toggleSound()}>{sound?'心音を切る':'心音を入れる'}</button></div>
  <div className="lab-controls"><label>心拍数 <select value={bpm} onChange={e=>setBpm(Number(e.target.value))}>{[60,72,100,120].map(n=><option key={n} value={n}>{n} 回/分</option>)}</select></label><label><input type="checkbox" checked={slow} onChange={e=>setSlow(e.target.checked)}/> ゆっくり観察（4倍の時間）</label></div>
  <div className="lab-steps">{phases.map((item,i)=><button key={item.name} aria-pressed={phase===i} onClick={()=>{setRunning(false);setPhase(i);}}>{item.name}</button>)}</div>
  <div className="lab-explanation"><strong>{p.name}</strong><p>{p.text}</p><span>心房と心室の間：{p.av?'開く':'閉じる'} ／ 心室の出口：{p.out?'開く':'閉じる'}</span></div>
  <div className="lab-explanation"><strong>{chambers[selected].name}</strong><p>{chambers[selected].explain}</p></div>
  <p className="lab-note">青は酸素が少ない血液、赤は多い血液。実際の血液はどちらも赤色です。位置・形・時間配分は説明用に簡略化しています。弁が切り替わる短い時間は省略。心音は弁が閉じる時に合わせた合成音で、録音した心音ではありません。</p>
  <details><summary>肺循環と体循環を一周する</summary><p>右心室 → 肺動脈 → 肺（酸素を受け取る）→ 肺静脈 → 左心房 → 左心室 → 大動脈 → 全身（酸素を渡す）→ 大静脈 → 右心房 → 右心室</p><p>動脈は心臓から出る血管、静脈は心臓へ戻る血管。名前は酸素の量で決まるのではありません。</p></details>
  <Check question="肺へ血液を送り出す部屋は？" options={['右心室','左心室','左心房']} correct={0} explanation="右心室から肺動脈へ、左心室から大動脈へ送り出します。"/>
  <a className="lab-source" href="https://www.nhlbi.nih.gov/health/heart/heart-beats" target="_blank" rel="noreferrer">図の参考：米国NIH・心臓の拍動</a>
 </section>;
}

const eyeParts=[
 ['角膜','目の前面にある透明な膜。光を通し、大きく屈折させます。'],
 ['虹彩・瞳孔','虹彩は色のついた部分。中央の穴が瞳孔（ひとみ）です。明るい所では穴を小さくして、入る光の量を減らします。'],
 ['水晶体','透明で弾力のあるレンズです。近くを見ると厚く、遠くを見ると薄くなり、角膜とともに網膜に像を結びます。「レンズ」はここでは水晶体のことです。'],
 ['毛様体・チン小帯','発展：近くを見ると毛様体筋が収縮し、チン小帯がゆるんで水晶体が厚くなります。遠くを見ると逆になります。水晶体そのものが筋肉で縮むわけではありません。'],
 ['網膜','光を受け取る視細胞がある薄い層です。光の情報を神経の信号に変えます。像は上下左右が逆に結ばれます。'],
 ['黄斑・中心窩','発展：網膜の中央付近で、ものを細かく見分ける場所です。中心窩は黄斑の中心にあり、色を見分ける錐体細胞が集中しています。'],
 ['視神経・盲点','視神経は網膜から脳へ信号を運びます。神経が束になって出る場所（視神経乳頭）には視細胞がなく、盲点になります。'],
 ['硝子体','水晶体の後ろを満たす透明なゼリー状の物質。光を通し、眼球の形を支えます。'],
];

export function EyeLab({advanced=true}:{advanced?:boolean}){
 const [near,setNear]=useState(false),[bright,setBright]=useState(true),[part,setPart]=useState(2),[rays,setRays]=useState(true);
 const lens=near?28:14, gap=bright?14:29;
 function hit(i:number){return {role:'button',tabIndex:0,'aria-label':eyeParts[i][0],'aria-pressed':part===i,onClick:()=>setPart(i),onKeyDown:(e:React.KeyboardEvent)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setPart(i);}}};}
 return <section className="organ-lab"><h4>目の断面をのぞいてみよう</h4><p>見たい部分をタッチ。距離と明るさを変え、形の変化を比べよう。</p>
  <svg viewBox="0 0 440 325" className="organ-diagram" aria-label="眼球の断面模式図。左から入る光が角膜と水晶体で曲がって右側の網膜に届く。">
   <defs><radialGradient id="eye-glass"><stop stopColor="#f8feff"/><stop offset="1" stopColor="#c9e0e4"/></radialGradient></defs>
   <path d="M140 60 C245 -10 382 47 382 165 C382 275 250 321 140 268 Q85 220 85 165 Q85 80 140 60Z" fill="url(#eye-glass)" stroke="#a6b2bd" strokeWidth="13"/>
   <path {...hit(4)} d="M142 65 C245 0 375 50 375 165 C375 270 250 312 142 263" fill="none" stroke={part===4?'#e9b438':'#cf7e78'} strokeWidth="9"/>
   <path {...hit(0)} d="M102 105Q37 165 106 226" fill="#d3f0f8" stroke={part===0?'#d89f29':'#6bafc4'} strokeWidth="5"/>
   <path {...hit(1)} d={`M119 112V${165-gap} M119 ${165+gap}V218`} stroke={part===1?'#c49328':'#407a79'} strokeWidth="11"/>
   <g {...(advanced?hit(3):{})} stroke={part===3?'#e4b837':'#a56881'} strokeWidth="6"><path d="M138 87l18 20 M136 239l20-19"/><path d="M154 107L162 129 M154 221L162 201" strokeWidth="2"/></g>
   <ellipse {...hit(2)} cx="165" cy="165" rx={lens} ry="43" fill="#8bcddda0" stroke={part===2?'#c38e22':'#4e95ac'} strokeWidth="3"/>
   <path {...hit(6)} d="M363 215L414 245L408 263L354 231" fill="#edcf8b" stroke={part===6?'#a37518':'#c5a56c'} strokeWidth="3"/>
   <path {...(advanced?hit(5):{})} d="M374 153Q377 166 374 180" stroke={part===5?'#a57d17':'#e4b937'} strokeWidth="8" fill="none"/>
   <text {...hit(7)} x="252" y="224" fill="#5c7887">硝子体</text>
   {rays&&<g fill="none" stroke="#c28a12" strokeWidth="2" pointerEvents="none">{[-1,1].map(sign=><path key={sign} d={`M8 ${near?165:165+sign*(gap-4)} L80 ${165+sign*(gap-4)} L165 ${165+sign*(gap-7)} L375 165`}/>)}</g>}
   <g fontSize="13" fill="#385460"><text x="27" y="83">角膜</text><text x="91" y="268">虹彩</text>{advanced&&<text x="132" y="62">毛様体</text>}<text x="151" y="237">水晶体</text><text x="299" y="49">網膜</text>{advanced&&<text x="329" y="137">黄斑</text>}<text x="365" y="289">視神経</text><text x="10" y="156">光 →</text></g>
  </svg>
  <div className="lab-controls"><button aria-pressed={!near} onClick={()=>setNear(false)}>遠くを見る</button><button aria-pressed={near} onClick={()=>setNear(true)}>近くを見る</button><button aria-pressed={bright} onClick={()=>setBright(!bright)}>{bright?'明るい所 → 暗くする':'暗い所 → 明るくする'}</button><label><input type="checkbox" checked={rays} onChange={e=>setRays(e.target.checked)}/> 光の道すじ</label></div>
  <div className="lab-explanation" aria-live="polite"><strong>{near?'近く：水晶体が厚くなる':'遠く：水晶体が薄くなる'}</strong><p>{bright?'明るい所：瞳孔が小さくなり、光を入れすぎないようにします。':'暗い所：瞳孔が大きくなり、より多くの光を取り込みます。'}</p></div>
  <div className="lab-controls lab-part-list">{eyeParts.map(([name],i)=>!advanced&&[3,5].includes(i)?null:<button key={name} aria-pressed={part===i} onClick={()=>setPart(i)}>{name}</button>)}</div>
  <div className="lab-explanation" aria-live="polite"><strong>{eyeParts[part][0]}</strong><p>{eyeParts[part][1]}</p></div>
  <p className="lab-note">断面・光線は働きを示す模式図です。形や角度は実寸・厳密な光学計算ではありません。距離と明るさを別々に操作して、ピント調節と光量調節を比べます。</p>
  <details><summary>網膜から脳へ：なぜ「見える」の？</summary><p>光 → 網膜の視細胞 → 神経の信号 → 視神経 → 脳。水晶体は像を結び、網膜は光を受け取り、脳は情報を処理します。</p>{advanced&&<p>発展：桿体細胞は暗い所での見え方、錐体細胞は色や細かい形の見分けに関わります。</p>}</details>
  <Check question="近くにピントを合わせると水晶体は？" options={['厚くなる','薄くなる','光を出す']} correct={0} explanation="近くを見ると水晶体は厚くなります。瞳孔の大きさは光の量の調節に関係します。"/>
  <a className="lab-source" href="https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work" target="_blank" rel="noreferrer">図の参考：米国NIH・目のしくみ</a>
 </section>;
}
