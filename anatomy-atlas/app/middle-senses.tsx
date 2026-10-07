import {useState} from 'react';

const curriculum='https://www.mext.go.jp/content/20260730-mxt_kyoiku01-100002608_05.pdf';
export default function MiddleSenses({kind}:{kind:'ear'|'eye'}){
 const ear=kind==='ear';
 const [tab,setTab]=useState<'compare'|'response'>('compare'),[strong,setStrong]=useState(false),[step,setStep]=useState(0);
 const route=ear?[
  ['音の刺激','スタートの合図の音が耳へ届きます。'],
  ['耳で受け取る','鼓膜・耳小骨が振動を伝え、うずまき管で神経の情報へ変わります。'],
  ['感覚神経','聴神経が耳から脳へ情報を伝えます。'],
  ['脳で判断','合図を聞いたと判断し、腕を動かす命令を出します。'],
  ['運動神経','命令が運動神経を通って筋肉へ伝わります。'],
  ['筋肉と反応','腕の筋肉が縮み、手を挙げます。']
 ]:[
  ['光の刺激','先生が挙げたカードからの光が目へ届きます。'],
  ['目で受け取る','角膜と水晶体で光が曲がり、網膜に像を結びます。網膜で神経の情報へ変わります。'],
  ['感覚神経','視神経が目から脳へ情報を伝えます。'],
  ['脳で判断','カードを見たと判断し、腕を動かす命令を出します。'],
  ['運動神経','命令が運動神経を通って筋肉へ伝わります。'],
  ['筋肉と反応','腕の筋肉が縮み、手を挙げます。']
 ];
 const amplitude=strong?24:10;
 const wave=Array.from({length:121},(_,i)=>`${i===0?'M':'L'}${20+i*3.5} ${100-amplitude*Math.sin(i*Math.PI/15)}`).join(' ');
 return <section className="organ-lab school-lab middle-senses">
  <h4>中学校理科：{ear?'耳':'目'}から反応まで</h4>
  <p>「何の刺激を受け取るか」「どこで神経の情報に変わるか」「どう反応につながるか」を説明しよう。</p>
  <div className="lab-controls" aria-label="中学生の感覚器官の観察"><button aria-pressed={tab==='compare'} onClick={()=>setTab('compare')}>{ear?'音の大小を比べる':'明るい所と暗い所を比べる'}</button><button aria-pressed={tab==='response'} onClick={()=>setTab('response')}>刺激から反応までたどる</button></div>
  {tab==='compare'?<>
   <div className="lab-controls"><button aria-pressed={!strong} onClick={()=>setStrong(false)}>{ear?'小さい音':'暗い所'}</button><button aria-pressed={strong} onClick={()=>setStrong(true)}>{ear?'大きい音':'明るい所'}</button></div>
   {ear?<svg viewBox="0 0 460 230" className="organ-diagram" role="img" aria-label={`${strong?'大きい':'小さい'}音。同じ高さの音で振動の幅を比較する模式図。`}>
    <rect x="4" y="4" width="452" height="222" rx="12" fill="#f1f6f7"/>
    <path d="M20 100H440" stroke="#bacbd0" strokeDasharray="4 4"/>
    <path d={wave} fill="none" stroke="#367d88" strokeWidth="3"/>
    <path d={`M285 166L${285+amplitude/2} 204`} stroke="#c88746" strokeWidth="7"/>
    <path d="M285 163V208" stroke="#baa28d" strokeDasharray="3 3"/>
    <g fill="#3e5a64" fontSize="13"><text x="20" y="29">音の振動を波で表す</text><text x="20" y="149">振動の幅：{strong?'大きい':'小さい'}</text><text x="20" y="189">鼓膜も振動する</text><text x="315" y="188">鼓膜</text><text x="315" y="209">傾きは模式表現</text></g>
   </svg>:<svg viewBox="0 0 460 210" className="organ-diagram" role="img" aria-label={`${strong?'明るい所では瞳孔が小さく':'暗い所では瞳孔が大きく'}なる。虹彩が光量を調節する模式図。`}>
    <rect x="4" y="4" width="452" height="202" rx="12" fill="#f1f6f7"/>
    <ellipse cx="140" cy="100" rx="93" ry="63" fill="white" stroke="#8aa2ae" strokeWidth="3"/>
    <circle cx="140" cy="100" r="48" fill="#7faaa7"/><circle cx="140" cy="100" r={strong?16:31} fill="#253e4b"/>
    <path d="M145 45L269 44M145 100L269 100" stroke="#577980" strokeWidth="2"/>
    <g fill="#3e5a64" fontSize="14"><text x="280" y="49">虹彩：光の量を調節</text><text x="280" y="105">瞳孔：中央の穴</text><text x="62" y="187">瞳孔は{strong?'小さくなる':'大きくなる'}</text></g>
   </svg>}
   <div className="lab-explanation" aria-live="polite"><strong>{ear?(strong?'大きい音：振動の幅が大きい':'小さい音：振動の幅が小さい'):(strong?'明るい所：入る光を減らす':'暗い所：より多くの光を取り込む')}</strong><p>{ear?'音の大きさは振動の幅（振幅）と関係します。高さは変えずに比べています。耳では振動が鼓膜から耳小骨、うずまき管へ伝わります。':'虹彩が瞳孔の大きさを変えます。瞳孔は筋肉やレンズではなく、光の通る穴です。ピントを合わせる水晶体の働きとは区別しましょう。'}</p></div>
   <details className="school-extension"><summary>考える：{ear?'音が脳まで振動したまま伝わる？':'暗い所で瞳孔が大きくなるのはなぜ？'}</summary><p>{ear?'うずまき管で神経の情報に変わり、聴神経を通って脳へ伝わります。音そのものが聴神経の中を通るわけではありません。':'目に入る光の量を増やすためです。暗さへの適応には網膜の働きの変化も関係します。瞳孔だけで説明できるわけではありません。'}</p></details>
  </>:<>
   <p>{ear?'合図を聞いて手を挙げる':'カードを見て手を挙げる'}例を順に選ぼう。</p>
   <div className="middle-response" aria-label="刺激から反応までの経路">{route.map(([name],i)=><button key={name} aria-pressed={step===i} onClick={()=>setStep(i)}><span>{i+1}</span>{name}{i<route.length-1&&<small aria-hidden="true">↓</small>}</button>)}</div>
   <div className="lab-controls"><button disabled={step===0} onClick={()=>setStep(step-1)}>前の段階</button><button disabled={step===route.length-1} onClick={()=>setStep(step+1)}>次の段階</button><button onClick={()=>setStep(0)}>はじめに戻る</button></div>
   <div className="lab-explanation" aria-live="polite"><strong>{route[step][0]}</strong><p>{route[step][1]}</p></div>
   <p className="lab-note">脳で判断する反応の例です。熱いものから手を引く反射とは区別します。実際には命令はせきずいも経由しますが、ここでは感覚神経と運動神経の役割を中心に示しています。矢印は情報の順序で、速さや時間を表しません。</p>
   <details className="school-extension"><summary>考える：感覚神経と運動神経は何が違う？</summary><p>感覚神経は感覚器官から中枢へ情報を伝え、運動神経は中枢から筋肉へ命令を伝えます。{ear?'聴神経':'視神経'}は感覚神経です。脳・せきずいが中枢神経です。</p></details>
  </>}
  <p className="lab-note">形・動き・色は働きを理解するための模式表現です。{ear?'音は再生しません。':'画面の明るさは変更しません。'}</p>
  <details className="school-extension"><summary>先生へ：学習指導要領との対応</summary><p>中学校第2分野（3）生物の体のつくりと働き「刺激と反応」に対応。感覚器官・神経系・運動器官のつくりと働きを関連付け、刺激の強さに応じた感覚器官の調節も考えます。個々の部位名は説明を助ける語として示し、指導要領が一律に暗記を指定した一覧ではありません。</p><a className="lab-source" href={curriculum} target="_blank" rel="noreferrer">文部科学省：中学校学習指導要領解説 理科編（本文90–91ページ）</a></details>
 </section>;
}
