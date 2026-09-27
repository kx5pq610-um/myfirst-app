import {useState,type ReactNode} from 'react';
import {BookOpen,ChevronRight,Info,MousePointer2,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {SystemId} from './anatomy';
import {HeartLab,EyeLab} from './organ-labs';

export type LessonId='heart'|'blood'|'respiratory'|'urinary'|'liver'|'eye'|'nervous';

export interface Lesson {
 id:LessonId;
 title:string;
 subtitle:string;
 color:string;
 systems:SystemId[];
 focusNames?:string[];
 middle:string[];
 high:string[];
 terms:string[];
}

export const LESSONS:Lesson[]=[
 {id:'heart',title:'心臓と血液循環',subtitle:'2つの心房・2つの心室から、肺循環と体循環へ',color:'#bd625d',systems:['cardiac','arterial','venous'],focusNames:['heart','cavity of right atrium','cavity of left atrium','cavity of right ventricle','cavity of left ventricle'],middle:['心臓は、右心房・右心室・左心房・左心室の4つの部屋をもつ筋肉のポンプです。','右心室は肺へ、左心室は全身へ血液を送り出します。心房は血液を受け取り、心室は血液を送り出します。','弁は血液の逆流を防ぎ、血液を一方向に流します。'],high:['肺循環は右心室から肺を通って左心房へ戻る流れ、体循環は左心室から全身を通って右心房へ戻る流れです。','「動脈＝酸素が多い、静脈＝酸素が少ない」とは限りません。肺動脈は酸素の少ない血液、肺静脈は酸素の多い血液を運びます。','心拍によって血液が周期的に送り出されます。運動時は体が必要とする酸素が増えるため、心拍数も増えます。'],terms:['右心房','右心室','左心房','左心室','弁','肺動脈','肺静脈','大動脈','大静脈','肺循環','体循環']},
 {id:'blood',title:'血液の4つの成分',subtitle:'赤血球・白血球・血小板・血しょうの役割',color:'#9c5961',systems:['cardiac','arterial','venous'],middle:['血液は、血しょうと血球からできています。血球には赤血球・白血球・血小板があります。','赤血球は酸素を運び、白血球は体内に入った異物から体を守ります。血小板は傷口をふさぐ働きをします。','血しょうは液体の部分で、養分や二酸化炭素、不要な物質などを運びます。'],high:['赤血球に含まれるヘモグロビンは、肺で酸素と結びつき、全身の組織で酸素を手放します。','白血球には複数の種類があり、異物を取り込んだり、抗体をつくったりして免疫に関わります。','血小板と血しょう中の物質は血液凝固に関わり、出血を止めます。血液は体温や水分、pHなどの体内環境にも関係します。'],terms:['赤血球','ヘモグロビン','白血球','免疫','血小板','血液凝固','血しょう','養分','酸素','二酸化炭素']},
 {id:'respiratory',title:'肺と呼吸',subtitle:'空気の通り道と肺胞でのガス交換',color:'#a97d88',systems:['respiratory','arterial','venous'],focusNames:['lung','left lung','right lung','trachea','diaphragm'],middle:['空気は、鼻や口から入り、気管・気管支を通って肺へ運ばれます。','肺の中の肺胞で、酸素が血液に入り、二酸化炭素が血液から出ます。','横隔膜が動くと胸の容積が変化し、肺に空気が出入りします。'],high:['肺胞は薄い壁と多くの毛細血管に囲まれた構造で、濃度差によって気体が交換されます。','肺で酸素を受け取った血液は肺静脈を通って左心房へ戻り、二酸化炭素を多く含む血液は肺動脈で肺へ向かいます。'],terms:['気管','気管支','肺','肺胞','横隔膜','酸素','二酸化炭素','毛細血管','肺動脈','肺静脈']},
 {id:'urinary',title:'腎臓と尿の通り道',subtitle:'血液から尿ができ、体外へ出るまで',color:'#a47663',systems:['urinary'],focusNames:['kidney','right kidney','left kidney','urinary bladder','ureter','urethra'],middle:['腎臓は血液から不要な物質や余分な水分を取り除き、尿をつくります。','尿は、腎臓 → 尿管 → ぼうこう → 尿道の順に通ります。','ぼうこうは尿を一時的にたくわえる筋肉の袋です。'],high:['腎臓は体内の水分量や塩分濃度の調節にも関わり、体内環境を一定に保つ働きを助けます。','血液が腎臓を通ることで、必要な物質を残しながら、尿素などの不要な物質を尿として排出します。'],terms:['腎臓','尿管','ぼうこう','尿道','尿','尿素','排出','体内環境','水分量','塩分濃度']},
 {id:'liver',title:'肝臓の働き',subtitle:'消化・吸収された物質を受け取り、体内で役立てる',color:'#9b755b',systems:['digestive','venous'],focusNames:['liver'],middle:['肝臓は腹部の右上にある大きな器官で、消化された養分を受け取ります。','胆汁をつくり、脂肪の消化を助けます。','吸収された養分を一時的にたくわえたり、体で使いやすい形に変えたりします。'],high:['小腸から吸収された物質は門脈を通って肝臓へ運ばれ、体内で利用・貯蔵しやすい形に調整されます。','肝臓は血液中の物質を処理し、体内環境を保つ働きにも関わります。説明では「解毒」と一言で済ませず、物質を分解・変換する器官として理解します。'],terms:['肝臓','胆汁','小腸','吸収','養分','門脈','貯蔵','体内環境']},
 {id:'eye',title:'目と神経',subtitle:'光を受け取り、視神経を通って脳で見る',color:'#6f97a0',systems:['sensory','nervous'],focusNames:['right eye','left eye','right lens','left lens','right optic nerve','left optic nerve'],middle:['光は角膜から目に入り、虹彩の中央の瞳孔を通ります。','水晶体が光を曲げて網膜に像を結び、網膜の情報が視神経を通って脳へ伝わります。','目で受けた情報を脳が処理することで、私たちは「見えた」と感じます。'],high:['虹彩は瞳孔の大きさを変えて目に入る光の量を調節し、水晶体は厚さを変えて焦点を合わせます。','網膜の視細胞が光を電気的な信号に変え、視神経を通って大脳へ伝えます。','耳などの感覚器官からの情報も、感覚神経を通って中枢神経へ伝えられます。'],terms:['角膜','虹彩','瞳孔','水晶体','網膜','視神経','大脳','感覚器官','感覚神経','耳']},
 {id:'nervous',title:'神経系と反応',subtitle:'刺激を受け取り、脳・せきずい・神経で体を動かす',color:'#b28d51',systems:['nervous','sensory'],focusNames:['brain','spinal cord','optic nerve'],middle:['神経系は、脳・せきずい・末しょう神経などからできています。','感覚器官が刺激を受けると、感覚神経を通って情報が脳やせきずいへ伝わります。','脳やせきずいからの命令は運動神経を通って筋肉へ伝わり、体が動きます。'],high:['熱いものに触れて手を引く反射では、情報がせきずいを通る短い経路で筋肉に命令が出されます。','高校では神経系と内分泌系による調節を学び、神経やホルモンが体内環境の維持に関わることにつなげます。','感覚器官は情報の入口であり、脳は情報を統合して判断や運動の指令を出す中枢です。'],terms:['脳','せきずい','末しょう神経','感覚器官','感覚神経','運動神経','反射','刺激','反応','体内環境']},
];

function Route({items,accent='teal'}:{items:string[];accent?:string}){
 return <div className={`lesson-route ${accent}`} aria-label={`${items.join('、')}の流れ`}>
  {items.map((item,index)=><span className="route-step" key={`${item}-${index}`}><span>{item}</span>{index<items.length-1&&<ChevronRight size={15} aria-hidden="true"/>}</span>)}
 </div>;
}


function BloodLesson(){
 const items=[['rbc','赤血球','ヘモグロビンで酸素を運ぶ','酸素・二酸化炭素'],['wbc','白血球','異物から体を守る','免疫'],['platelet','血小板','傷口をふさぎ出血を止める','血液凝固'],['plasma','血しょう','養分・ホルモン・不要物を運ぶ','体内環境']];
 return <div className="lesson-visual blood-lesson">
  <div className="lesson-visual-head"><span className="visual-label"><span className="blood-drop"/> 血液を分けて見る</span><span className="visual-note">血しょう＋血球</span></div>
  <div className="blood-composition" aria-label="血液の成分の模式図"><span className="blood-plasma">血しょう</span><span className="blood-cells">血球</span></div>
  <div className="blood-grid">{items.map(([kind,name,role,term])=><div className="blood-card" key={kind}><span className={`blood-symbol ${kind}`} aria-hidden="true">{kind==='rbc'?'●':kind==='wbc'?'○':kind==='platelet'?'••':'~'}</span><div><b>{name}</b><p>{role}</p><small>{term}</small></div></div>)}</div>
  <p className="diagram-caption">血液は、運ぶ・守る・止血するという働きを分担しています。成分を役割と結びつけて覚えましょう。</p>
 </div>;
}

function RespiratoryLesson(){return <div className="lesson-visual"><div className="lesson-visual-head"><span className="visual-label">呼吸の通り道</span><span className="visual-note">空気と血液の交換</span></div><Route items={['空気','気管','気管支','肺胞']} accent="pink"/><div className="exchange-grid"><div className="exchange-card oxygen"><b>酸素 O₂</b><span>肺胞 → 血液</span></div><div className="exchange-card carbon"><b>二酸化炭素 CO₂</b><span>血液 → 肺胞 → 体外</span></div></div><div className="breath-card"><span className="diaphragm-shape"/><div><b>横隔膜</b><p>縮むと胸の容積が大きくなり、空気を吸い込みます。</p></div></div></div>}

function UrinaryLesson(){return <div className="lesson-visual"><div className="lesson-visual-head"><span className="visual-label">尿の通り道</span><span className="visual-note">腎臓から体外へ</span></div><Route items={['腎臓','尿管','ぼうこう','尿道','体外']} accent="amber"/><div className="organ-role-grid"><div><b>腎臓</b><span>血液から不要物と余分な水分を取り出し、尿をつくる</span></div><div><b>ぼうこう</b><span>尿を一時的にたくわえる</span></div></div><p className="diagram-caption">尿は腎臓から直接体外へ出るのではなく、尿管・ぼうこう・尿道を通ります。</p></div>}

function LiverLesson(){return <div className="lesson-visual"><div className="lesson-visual-head"><span className="visual-label">肝臓へ運ばれる養分</span><span className="visual-note">消化・吸収とのつながり</span></div><Route items={['小腸で吸収','肝臓','全身で利用・貯蔵']} accent="brown"/><div className="liver-facts"><div><b>胆汁をつくる</b><span>脂肪の消化を助ける</span></div><div><b>養分を処理する</b><span>体で使いやすい形に調整する</span></div><div><b>血液中の物質を処理する</b><span>体内環境の維持に関わる</span></div></div></div>}


function NervousLesson(){return <div className="lesson-visual"><div className="lesson-visual-head"><span className="visual-label">刺激から反応まで</span><span className="visual-note">神経の情報の流れ</span></div><Route items={['刺激','感覚器官','感覚神経','脳・せきずい','運動神経','筋肉','反応']} accent="gold"/><div className="reflex-card"><b>反射の例：熱いものに触れた</b><p>せきずいを通る短い経路で、脳で考える前に手を引く命令が出ます。</p></div><p className="diagram-caption">高校では、神経系と内分泌系が体内環境を保つ調節にも関わることへ学びを広げます。</p></div>}

function Visual({id}:{id:LessonId}){if(id==='heart')return <HeartLab/>;if(id==='blood')return <BloodLesson/>;if(id==='respiratory')return <RespiratoryLesson/>;if(id==='urinary')return <UrinaryLesson/>;if(id==='liver')return <LiverLesson/>;if(id==='eye')return <EyeLab/>;return <NervousLesson/>;}

export interface LearningPanelProps {open:boolean;lessonId:LessonId;onClose:()=>void;onLessonChange:(id:LessonId)=>void;onFocus:(lesson:Lesson)=>void}

export default function LearningPanel({open,lessonId,onClose,onLessonChange,onFocus}:LearningPanelProps){
 const [expanded,setExpanded]=useState(false);
 const lesson=LESSONS.find(item=>item.id===lessonId)??LESSONS[0];
 return <>
  {open&&<button className="learning-scrim" aria-label="授業モードを閉じる" onClick={onClose}/>} 
  {open&&<aside className={`learning-panel glass${expanded?' learning-expanded':''}`} aria-label="授業で学ぶ">
   <header className="learning-header"><div><div className="eyebrow"><BookOpen size={14}/> 授業で学ぶ</div><h2>人体のはたらき</h2><p>中学校理科を中心に、高校生物へのつながりまで。</p></div><Button variant="ghost" className="icon-button" onClick={onClose} aria-label="授業モードを閉じる"><X size={20}/></Button></header>
   <nav className="lesson-nav" aria-label="学習テーマ">{LESSONS.map(item=><button key={item.id} className={item.id===lesson.id?'active':''} onClick={()=>onLessonChange(item.id)}><span className="lesson-nav-dot" style={{background:item.color}}/>{item.title}</button>)}</nav>
   <div className="learning-scroll">
    <button className="lab-expand" aria-pressed={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?'3Dモデルと並べる':'学習図を大きく表示'}</button>
    <div className="lesson-heading"><div><span className="lesson-kicker">{lesson.id==='blood'?'血液を模式図で確認':'3Dモデル＋学習図'}</span><h3>{lesson.title}</h3><p>{lesson.subtitle}</p></div><span className="lesson-index">{LESSONS.findIndex(item=>item.id===lesson.id)+1} / {LESSONS.length}</span></div>
    <Button className="lesson-focus" onClick={()=>onFocus(lesson)}><MousePointer2 size={16}/> 3Dで{lesson.title}を見る<ChevronRight size={16}/></Button>
    <Visual id={lesson.id}/>
    <section className="lesson-text-section"><h4><span className="curriculum-chip middle">中学校理科</span>まず押さえる</h4><ul>{lesson.middle.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="lesson-text-section high-section"><h4><span className="curriculum-chip high">高校生物への橋わたし</span>さらに深める</h4><ul>{lesson.high.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="term-section"><h4>このテーマの用語</h4><div className="term-cloud">{lesson.terms.map(term=><span key={term}>{term}</span>)}</div></section>
    <div className="learning-tip"><Info size={15}/><span>3Dモデルでは器官の位置と形を、学習図では流れと働きを確認します。両方を行き来して学びましょう。</span></div>
   </div>
   <footer className="curriculum-source"><span>学習範囲：中学校理科「人の体のつくりと働き」／高校「生物基礎」</span><div><a href="https://www.mext.go.jp/a_menu/shotou/new-cs/1387016.htm" target="_blank" rel="noreferrer">中学校理科の解説 <ChevronRight size={13}/></a><a href="https://www.mext.go.jp/content/20230626-mxt_kyoikujinzai02-000033064_06.pdf" target="_blank" rel="noreferrer">高校理科・生物の解説 <ChevronRight size={13}/></a></div></footer>
  </aside>}
 </>;
}

export function LessonIcon({children}:{children:ReactNode}){return <span className="lesson-icon">{children}</span>}
