import {useState} from 'react';
import type {SchoolLevel} from './school-curriculum';
export function EarLab({level}:{level:SchoolLevel}){
 const [step,setStep]=useState(0);
 const stages=[['外耳道','耳介で集めた音が、外耳道を通って鼓膜へ届きます。'],['鼓膜','音によって鼓膜が振動します。'],['耳小骨','3つの小さな骨が振動を内耳へ伝えます。'],['うずまき管（蝸牛）','液体の振動が感覚細胞に伝わり、神経の情報へ変わります。'],['聴神経','神経の情報を脳へ伝えます。'],['脳','届いた情報を処理し、音として感じます。']];
 const color=(i:number)=>step===i?'#c47e17':'#78909b';
 return <section className="organ-lab school-lab"><h4>耳の断面：音から神経の情報へ</h4><p>部位を順に選び、振動が伝わる範囲と神経の情報が伝わる範囲を比べよう。</p>
 <svg viewBox="0 0 460 270" className="organ-diagram" role="img" aria-label="耳の断面模式図。外耳道、鼓膜、耳小骨、うずまき管、聴神経、脳の順に情報が伝わる。">
 <rect x="8" y="35" width="174" height="208" rx="15" fill="#e4f1ef"/><rect x="187" y="35" width="93" height="208" rx="15" fill="#f5ecdd"/><rect x="285" y="35" width="167" height="208" rx="15" fill="#e9ecf5"/>
 <g fill="#47616d" fontSize="15" textAnchor="middle"><text x="90" y="25">外耳</text><text x="233" y="25">中耳</text><text x="363" y="25">内耳 → 脳</text></g>
 <path d="M69 65C20 51 21 156 51 195C74 221 97 187 80 157C65 137 50 167 45 132C39 102 63 80 70 104" fill="#edc0ad" stroke="#a37a70" strokeWidth="5"/>
 <path d="M73 139L175 139M75 169L180 169" stroke={color(0)} strokeWidth="8"/><path d="M184 127L193 180" stroke={color(1)} strokeWidth="7"/>
 <path d="M193 143L218 122L239 135L256 148L272 143" fill="none" stroke={color(2)} strokeWidth="7" strokeLinecap="round"/><circle cx="216" cy="123" r="7" fill={color(2)}/><path d="M271 139v20l12-4v-17Z" fill="none" stroke={color(2)} strokeWidth="4"/>
 <path d="M294 149C300 115 352 117 352 152C352 183 309 189 309 157C309 136 335 135 335 153C335 165 321 170 321 157" fill="none" stroke={color(3)} strokeWidth="9" strokeLinecap="round"/>
 <path d="M314 126C275 82 301 55 330 91C354 52 377 82 340 128M325 123C337 68 374 85 346 129" fill="none" stroke="#b6a7c2" strokeWidth="6"/>
 <path d="M350 161L391 161" stroke={color(4)} strokeWidth="10"/><path d="M408 132C391 113 380 147 397 149C383 171 405 182 414 171C439 174 445 143 427 136C425 121 411 121 408 132Z" fill={step===5?'#f2d393':'#c9d5df'} stroke={color(5)} strokeWidth="3"/>
 <path d="M226 168L250 220" stroke="#baa594" strokeWidth="8"/>
 <g fontSize="12" fill="#3e5360" textAnchor="middle"><text x="125" y="112">外耳道</text><text x="174" y="207">鼓膜</text><text x="235" y="105">耳小骨</text><text x="326" y="208">うずまき管</text><text x="373" y="192">聴神経</text><text x="413" y="205">脳</text><text x="349" y="56">三半規管</text><text x="251" y="239">耳管</text></g>
 <text x="19" y="256" fontSize="11" fill="#6c7c86">音の振動 → → →　　　　　　神経の情報 →</text>
 </svg>
 <div className="lab-controls school-flow-steps" aria-label="聞こえるまでの経路">{stages.map(([name],i)=><button key={name} aria-pressed={step===i} onClick={()=>setStep(i)}>{i+1}. {name}</button>)}</div>
 <div className="lab-explanation" aria-live="polite"><strong>{stages[step][0]}</strong><p>{stages[step][1]}</p></div>
 {level==='biology'&&<p className="school-extension">高校生物：蝸牛の有毛細胞は振動を受け取る受容器です。三半規管・前庭は平衡感覚に関わります。</p>}
 <details><summary>発展：耳小骨・耳管・平衡感覚</summary><p>耳小骨は、つち骨・きぬた骨・あぶみ骨です。耳管は中耳とのどをつなぎ、鼓膜の両側の圧力を調節することに関わります。三半規管や前庭は体の動き・傾きを感じる働きに関わります。</p></details>
 <p className="lab-note">位置関係と働きを示す学習用の模式図です。実寸の断面ではありません。内部の耳の部品はBodyParts3Dの収録モデルに含まれていません。</p>
 <a className="lab-source" href="https://www.nidcd.nih.gov/health/how-do-we-hear" target="_blank" rel="noreferrer">参考：NIH/NIDCD・音が聞こえるしくみ</a>
 </section>;
}
export function GlucoseLab(){
 const [fed,setFed]=useState(true);
 return <section className="lesson-visual school-lab"><h4>食後と空腹時を比べる</h4><div className="lab-controls"><button aria-pressed={fed} onClick={()=>setFed(true)}>食後：血糖濃度が上がる</button><button aria-pressed={!fed} onClick={()=>setFed(false)}>空腹時：血糖濃度が下がる</button></div>
 <div className="school-feedback" aria-live="polite"><div><b>すい臓</b><span>{fed?'インスリンの分泌が増える':'グルカゴンの分泌が増える'}</span></div><span aria-hidden="true">↓ 血液で運ばれるホルモン</span><div><b>肝臓</b><span>{fed?'グルコース → グリコーゲンの合成を促す':'グリコーゲン → グルコースへの分解を促す'}</span></div><span aria-hidden="true">↓</span><div><b>血糖濃度</b><span>{fed?'下げる方向に働く':'上げる方向に働く'}</span></div></div>
 <p className="lab-note">肝臓とすい臓の連携を絞って示した模式説明です。筋肉・脂肪組織、他のホルモンや神経の働きも関係します。実測値や時間変化のシミュレーションではありません。</p></section>;
}
export function LiverStructureLab(){
 const [bile,setBile]=useState(false);const vertices=Array.from({length:6},(_,i)=>{const a=Math.PI*i/3;return [210+125*Math.cos(a),160+100*Math.sin(a)];});
 return <details className="school-lobule"><summary>発展：肝小葉を拡大して血液と胆汁を比べる</summary><p>肝小葉は肝臓の組織の単位の一つです。血液は周辺から中心静脈へ、胆汁は肝細胞の間の細い通路を通って周辺の胆管へ流れます。</p><div className="lab-controls"><button aria-pressed={!bile} onClick={()=>setBile(false)}>血液の流れ</button><button aria-pressed={bile} onClick={()=>setBile(true)}>胆汁の流れ</button></div>
 <svg viewBox="0 0 420 300" role="img" className="organ-diagram" aria-label={bile?'肝小葉の模式図。胆汁は肝細胞から周辺の胆管へ流れる。':'肝小葉の模式図。血液は周辺から中心静脈へ流れる。'}><defs><marker id="lobule-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={bile?'#a87813':'#4e809e'}/></marker></defs><polygon points={vertices.map(v=>v.join(',')).join(' ')} fill="#f5e2d8" stroke="#ac8778" strokeWidth="3"/>{vertices.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="13" fill="#d2e5ee" stroke="#4e809e"/><circle cx={x+13} cy={y+13} r="7" fill="#e0bd63" stroke="#a87813"/><path d={`M${bile?210+(x-210)*.25:x+(210-x)*.2} ${bile?160+(y-160)*.25:y+(160-y)*.2}L${bile?x+(210-x)*.15:210+(x-210)*.2} ${bile?y+(160-y)*.15:160+(y-160)*.2}`} stroke={bile?'#a87813':'#4e809e'} strokeWidth="3" markerEnd="url(#lobule-arrow)"/></g>)}<circle cx="210" cy="160" r="20" fill="#88b0c5"/><text x="210" y="165" textAnchor="middle" fill="#253e4b" fontSize="12">中心静脈</text><text x="210" y="21" textAnchor="middle" fontSize="13" fill="#73574e">肝細胞の集まり（六角形に簡略化）</text><text x="210" y="284" textAnchor="middle" fontSize="12" fill="#4e6876">周辺：門脈・肝動脈の枝、胆管</text></svg>
 <p className="lab-note">独自作成の拡大模式図です。門脈・肝動脈の血液をまとめて青で示しています。実際の色・形・本数とは異なり、収録3Dを拡大したものではありません。発展の観察で、細部の暗記を必須にはしません。</p></details>;
}
export function DigestiveLab(){return <section className="lesson-visual school-lab"><h4>食物の通り道と吸収先</h4><div className="school-route">口 → 食道 → 胃 → 小腸 → 大腸 → 肛門</div><div className="organ-role-grid"><div><b>消化する</b><span>消化酵素などの働きで、吸収できる物質へ分解</span></div><div><b>吸収する</b><span>小腸の柔毛から、血管やリンパ管へ取り込む</span></div></div><p>ブドウ糖やアミノ酸などは血液へ。脂肪の消化でできた物質は小腸の壁で再び脂肪になり、主にリンパ管へ入ります。</p><table className="school-enzyme-table"><caption>代表的な消化酵素と分解される物質</caption><thead><tr><th>消化酵素</th><th>はたらく物質・消化液の例</th></tr></thead><tbody><tr><td>アミラーゼ</td><td>デンプン／だ液・すい液</td></tr><tr><td>ペプシン</td><td>タンパク質／胃液</td></tr><tr><td>トリプシン</td><td>タンパク質／すい液</td></tr><tr><td>リパーゼ</td><td>脂肪／すい液</td></tr></tbody></table><p className="lab-note">胆汁には消化酵素が含まれません。脂肪を細かな粒にして、消化酵素が働きやすくします。柔毛は収録3Dには含まれません。</p></section>}
export function MovementLab(){const [bent,setBent]=useState(true);return <section className="lesson-visual school-lab"><h4>筋肉は縮んで骨を引く</h4><div className="lab-controls"><button aria-pressed={bent} onClick={()=>setBent(true)}>肘を曲げる</button><button aria-pressed={!bent} onClick={()=>setBent(false)}>肘を伸ばす</button></div><svg viewBox="0 0 380 220" className="organ-diagram" role="img" aria-label={bent?'上腕二頭筋が縮み、肘が曲がる模式図':'上腕三頭筋が縮み、肘が伸びる模式図'}><path d={`M130 35L160 145L${bent?285:190} ${bent?78:204}`} fill="none" stroke="#b6ac9b" strokeWidth="15" strokeLinecap="round"/><circle cx="160" cy="145" r="13" fill="#e7ddcb" stroke="#8b8170"/><ellipse cx="150" cy="88" rx={bent?20:10} ry={bent?32:45} fill={bent?'#ba6b5f':'#d7aaa1'} transform="rotate(-15 150 88)"/><ellipse cx="115" cy="93" rx={bent?10:20} ry={bent?45:32} fill={bent?'#d7aaa1':'#ba6b5f'} transform="rotate(-15 115 93)"/><g fontSize="13" fill="#465b65"><text x="174" y="43">上腕二頭筋</text><text x="16" y="115">上腕三頭筋</text><text x="196" y="155">肘の関節</text></g></svg><p aria-live="polite">{bent?'曲げる：上腕二頭筋が縮み、上腕三頭筋はゆるみます。':'伸ばす：上腕三頭筋が縮み、上腕二頭筋はゆるみます。'}</p><p className="lab-note">働きの違いを示す模式図です。実際の長さ・太さの比率や複数の筋肉の協調は簡略化しています。</p></section>}
export function ImmuneLab(){return <section className="lesson-visual school-lab"><h4>異物への反応を比べる</h4><div className="organ-role-grid"><div><b>自然免疫</b><span>食細胞による食作用など。まず異物に対応する。</span></div><div><b>獲得免疫</b><span>抗原に応じた反応。抗体やT細胞が働き、免疫記憶ができる。</span></div></div><p className="school-route">初めての出会い → 抗原に応じた反応 → 記憶細胞 → 再び出会うと速く強い反応</p><p className="lab-note">免疫は細胞どうしの協調で働きます。この図は体を守る仕組みを整理する模式説明です。</p></section>}
