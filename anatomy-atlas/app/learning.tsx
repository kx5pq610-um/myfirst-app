import {useState,type ReactNode} from 'react';
import {BookOpen,ChevronRight,Info,MousePointer2,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {SystemId} from './anatomy';
import {SCHOOL_LEVELS,SCHOOL_TOPICS,curriculumRelation,type SchoolLevel,type Observation} from './school-curriculum';
import {EarLab,GlucoseLab,LiverStructureLab,DigestiveLab,MovementLab,ImmuneLab} from './school-labs';
import './school-learning.css';
import {HeartLab,EyeLab} from './organ-labs';
import MiddleSenses from './middle-senses';

export type LessonId='heart'|'blood'|'respiratory'|'urinary'|'liver'|'eye'|'nervous'|'ear'|'digestive'|'movement'|'homeostasis'|'immune';

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
 {id:'blood',title:'血液の4つの成分',subtitle:'赤血球・白血球・血小板・血しょうの役割',color:'#9c5961',systems:['cardiac','arterial','venous'],middle:['血液は、血しょうと血球からできています。血球には赤血球・白血球・血小板があります。','赤血球は酸素を運び、白血球は体内に入った異物から体を守ります。血小板は傷口をふさぐ働きをします。','血しょうは液体の部分で、養分や二酸化炭素、不要な物質などを運びます。','血しょうの一部が毛細血管の外へ出て組織液となり、細胞と血液の物質の受け渡しを仲立ちします。'],high:['赤血球に含まれるヘモグロビンは、肺で酸素と結びつき、全身の組織で酸素を手放します。','白血球には複数の種類があり、異物を取り込んだり、抗体をつくったりして免疫に関わります。','血小板と血しょう中の物質は血液凝固に関わり、出血を止めます。血液は体温や水分、pHなどの体内環境にも関係します。'],terms:['赤血球','ヘモグロビン','白血球','免疫','血小板','血液凝固','血しょう','養分','酸素','二酸化炭素']},
 {id:'respiratory',title:'肺と呼吸',subtitle:'空気の通り道と肺胞でのガス交換',color:'#a97d88',systems:['respiratory','arterial','venous'],focusNames:['lung','left lung','right lung','trachea','diaphragm'],middle:['空気は、鼻や口から入り、気管・気管支を通って肺へ運ばれます。','肺の中の肺胞で、酸素が血液に入り、二酸化炭素が血液から出ます。','横隔膜が動くと胸の容積が変化し、肺に空気が出入りします。'],high:['肺胞は薄い壁と多くの毛細血管に囲まれた構造で、濃度差によって気体が交換されます。','肺で酸素を受け取った血液は肺静脈を通って左心房へ戻り、二酸化炭素を多く含む血液は肺動脈で肺へ向かいます。'],terms:['気管','気管支','肺','肺胞','横隔膜','酸素','二酸化炭素','毛細血管','肺動脈','肺静脈']},
 {id:'urinary',title:'腎臓と尿の通り道',subtitle:'血液から尿ができ、体外へ出るまで',color:'#a47663',systems:['urinary'],focusNames:['kidney','right kidney','left kidney','urinary bladder','ureter','urethra'],middle:['腎臓は血液から不要な物質や余分な水分を取り除き、尿をつくります。','尿は、腎臓 → 尿管 → ぼうこう → 尿道の順に通ります。','ぼうこうは尿を一時的にたくわえる筋肉の袋です。'],high:['腎臓は体内の水分量や塩分濃度の調節にも関わり、体内環境を一定に保つ働きを助けます。','血液が腎臓を通ることで、必要な物質を残しながら、尿素などの不要な物質を尿として排出します。'],terms:['腎臓','尿管','ぼうこう','尿道','尿','尿素','排出','体内環境','水分量','塩分濃度']},
 {id:'liver',title:'肝臓の働き',subtitle:'消化・吸収された物質を受け取り、体内で役立てる',color:'#9b755b',systems:['digestive','venous'],focusNames:['liver'],middle:['肝臓は腹部の右上にある大きな器官で、消化された養分を受け取ります。','胆汁をつくり、脂肪の消化を助けます。','吸収された養分を一時的にたくわえたり、体で使いやすい形に変えたりします。','有害な物質を分解・変換する働きもあります。'],high:['小腸から吸収された物質は門脈を通って肝臓へ運ばれ、体内で利用・貯蔵しやすい形に調整されます。','肝臓は血液中の物質を処理し、体内環境を保つ働きにも関わります。説明では「解毒」と一言で済ませず、物質を分解・変換する器官として理解します。'],terms:['肝臓','胆汁','小腸','吸収','養分','門脈','貯蔵','体内環境']},
 {id:'eye',title:'目と神経',subtitle:'光を受け取り、視神経を通って脳で見る',color:'#6f97a0',systems:['sensory','nervous'],focusNames:['right eye','left eye','right lens','left lens','right optic nerve','left optic nerve'],middle:['光は角膜から目に入り、虹彩の中央の瞳孔を通ります。','水晶体が光を曲げて網膜に像を結び、網膜の情報が視神経を通って脳へ伝わります。','目で受けた情報を脳が処理することで、私たちは「見えた」と感じます。'],high:['虹彩は瞳孔の大きさを変えて目に入る光の量を調節し、水晶体は厚さを変えて焦点を合わせます。','網膜の視細胞が光を電気的な信号に変え、視神経を通って大脳へ伝えます。','耳などの感覚器官からの情報も、感覚神経を通って中枢神経へ伝えられます。'],terms:['角膜','虹彩','瞳孔','水晶体','網膜','視神経','大脳','感覚器官','感覚神経','耳']},
 {id:'nervous',title:'神経系と反応',subtitle:'刺激を受け取り、脳・せきずい・神経で体を動かす',color:'#b28d51',systems:['nervous','sensory'],focusNames:['brain','spinal cord','optic nerve'],middle:['神経系は、脳・せきずい・末しょう神経などからできています。','感覚器官が刺激を受けると、感覚神経を通って情報が脳やせきずいへ伝わります。','脳やせきずいからの命令は運動神経を通って筋肉へ伝わり、体が動きます。'],high:['熱いものに触れて手を引く反射では、情報がせきずいを通る短い経路で筋肉に命令が出されます。','高校では神経系と内分泌系による調節を学び、神経やホルモンが体内環境の維持に関わることにつなげます。','感覚器官は情報の入口であり、脳は情報を統合して判断や運動の指令を出す中枢です。'],terms:['脳','せきずい','末しょう神経','感覚器官','感覚神経','運動神経','反射','刺激','反応','体内環境']},
 {id:'ear',title:'耳の構造と聞こえるしくみ',subtitle:'音の振動が神経の情報へ変わるまで',color:'#9882a6',systems:['sensory','nervous'],focusNames:['external ear','brain'],middle:['耳は音の振動を刺激として受け取る感覚器官です。','外耳道を通った音が鼓膜を振動させ、その振動が耳小骨を通ってうずまき管へ伝わります。','うずまき管で神経の情報に変わり、聴神経を通って脳へ伝わります。'],high:['受容器と神経の情報伝達を、聴覚を例に考えます。'],terms:['外耳道','鼓膜','耳小骨','うずまき管','聴神経']},
 {id:'digestive',title:'消化と吸収',subtitle:'食物の通り道から、養分が体内へ入るまで',color:'#a68753',systems:['digestive'],focusNames:['esophagus','stomach','small intestine','large intestine'],middle:['消化管では食物が吸収できる小さな物質へ分解されます。','小腸の内側には柔毛があり、養分を吸収する表面積を大きくしています。','吸収された物質は血液やリンパに取り込まれ、全身へ運ばれます。'],high:[],terms:['胃','小腸','大腸','消化酵素','柔毛']},
 {id:'movement',title:'骨・筋肉と運動',subtitle:'筋肉の収縮で骨が動くしくみ',color:'#a58171',systems:['skeletal','muscular'],focusNames:['right humerus','right radius','right ulna'],middle:['骨と骨のつなぎ目には関節があり、曲げ伸ばしなどの動きができます。','筋肉はけんで骨に付着し、収縮して骨を引くことで体を動かします。','肘を曲げる筋肉と伸ばす筋肉は、互いに協調して働きます。'],high:['筋肉は神経の情報を受けて働く効果器です。'],terms:['骨','関節','筋肉','けん']},
 {id:'homeostasis',title:'ホルモンと血糖調節',subtitle:'すい臓と肝臓が連携して、体内環境を保つ',color:'#7b8caa',systems:['digestive'],focusNames:['liver','pancreas'],middle:[],high:['血糖濃度の変化に応じ、すい臓からのホルモンの分泌が変化します。','ホルモンは血液で運ばれ、肝臓などの標的器官の働きを調節します。'],terms:['恒常性','ホルモン','インスリン','グルカゴン','グリコーゲン']},
 {id:'immune',title:'免疫と体を守るしくみ',subtitle:'自然免疫・獲得免疫・免疫記憶',color:'#898e70',systems:['lymphatic'],focusNames:['spleen'],middle:[],high:['自然免疫と獲得免疫が協調し、異物から体を守ります。','獲得免疫では、特定の抗原に応じた反応と免疫記憶が見られます。'],terms:['自然免疫','獲得免疫','抗原','抗体','免疫記憶']},
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

function Visual({id,level}:{id:LessonId;level:SchoolLevel}){if(id==='ear')return <EarLab level={level}/>;if(id==='digestive')return <DigestiveLab/>;if(id==='movement')return <MovementLab/>;if(id==='homeostasis')return <GlucoseLab/>;if(id==='immune')return <ImmuneLab/>;if(id==='heart')return <HeartLab/>;if(id==='blood')return <BloodLesson/>;if(id==='respiratory')return <RespiratoryLesson/>;if(id==='urinary')return <UrinaryLesson/>;if(id==='liver')return <LiverLesson/>;if(id==='eye')return <><EyeLab advanced={level==='biology'}/>{level==='middle'&&<MiddleSenses kind="eye"/>}</>;return <NervousLesson/>;}

export interface LearningPanelProps {open:boolean;lessonId:LessonId;onClose:()=>void;onLessonChange:(id:LessonId)=>void;onFocus:(lesson:Lesson)=>void;onObserve:(lesson:Lesson,observation:Observation)=>void;onModel:(kind:'heart'|'eye')=>void}

export default function LearningPanel({open,lessonId,onClose,onLessonChange,onFocus,onObserve,onModel}:LearningPanelProps){
 const [expanded,setExpanded]=useState(false),[level,setLevel]=useState<SchoolLevel>('middle');
 const available=LESSONS.filter(l=>SCHOOL_TOPICS[l.id].levels.includes(level));
 const lesson=available.find(item=>item.id===lessonId)??available[0],topic=SCHOOL_TOPICS[lesson.id],course=SCHOOL_LEVELS.find(l=>l.id===level)!;
 const notes=level==='middle'?lesson.middle:level==='basic'?(topic.basic??lesson.high):(topic.biology??lesson.high);
 const changeLevel=(next:SchoolLevel)=>{setLevel(next);if(!SCHOOL_TOPICS[lessonId].levels.includes(next))onLessonChange(LESSONS.find(l=>SCHOOL_TOPICS[l.id].levels.includes(next))!.id);};
 return <>
  {open&&<button className="learning-scrim" aria-label="授業モードを閉じる" onClick={onClose}/>}
  {open&&<aside className={`learning-panel glass${expanded?' learning-expanded':''}`} aria-label="授業で学ぶ">
   <header className="learning-header"><div><div className="eyebrow"><BookOpen size={14}/> 授業で学ぶ</div><h2>構造と働きをつなげよう</h2><p>学ぶ段階を選ぶと、テーマと説明が切り替わります。</p></div><Button variant="ghost" className="icon-button" onClick={onClose} aria-label="授業モードを閉じる"><X size={20}/></Button></header>
   <div className="school-levels" aria-label="学習する段階">{SCHOOL_LEVELS.map(l=><button key={l.id} aria-pressed={level===l.id} onClick={()=>changeLevel(l.id)}>{l.name}</button>)}</div>
   <nav className="lesson-nav school-topic-nav" aria-label="学習テーマ">{available.map(item=><button key={item.id} aria-pressed={item.id===lesson.id} className={item.id===lesson.id?'active':''} onClick={()=>onLessonChange(item.id)}><span className="lesson-nav-dot" style={{background:item.color}}/>{item.title}</button>)}</nav>
   <div className="learning-scroll" key={`${level}-${lesson.id}`}>
    <button className="lab-expand" aria-pressed={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?'3Dモデルと並べる':'学習図を大きく表示'}</button>
    <div className="lesson-heading"><div><span className="lesson-kicker">{course.name} · {topic.unit}</span><h3>{lesson.title}</h3><p>{lesson.subtitle}</p></div></div>
    <p className="school-scope">{curriculumRelation(lesson.id,level)}</p><section className="school-goal"><b>この観察で説明できるようになること</b><p>{topic.goal}</p></section>
    <section className="school-observations"><h4>構造を3Dで見る</h4><Button className="lesson-focus" onClick={()=>onFocus(lesson)}><MousePointer2 size={16}/> 関係する器官を取り出して見る<ChevronRight size={16}/></Button>
     {topic.observations.map(o=><div key={o.title}><button onClick={()=>onObserve(lesson,o)}>{o.title} <ChevronRight size={15}/></button><p>{o.hint}</p></div>)}
    </section>
    {(lesson.id==='heart'||lesson.id==='eye')&&<button className="model-launch" onClick={()=>onModel(lesson.id as 'heart'|'eye')}>{lesson.id==='heart'?'▶ 拍動する3D心臓を手で動かす':'目の3D模型を手で分解する'}<small>{lesson.id==='heart'?'前側を開く・拍動と血流・弁の動き':'水晶体・虹彩・網膜を取り出して観察'}</small></button>}
    <Visual id={lesson.id} level={level}/>
    {lesson.id==='liver'&&level!=='middle'&&<><GlucoseLab/><LiverStructureLab/></>}
    <section className="lesson-text-section"><h4><span className={`curriculum-chip ${level==='middle'?'middle':'high'}`}>{course.name}</span>構造と働き</h4><ul>{notes.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="term-section"><h4>まず使う言葉</h4><div className="term-cloud">{topic.essential.map(term=><span key={term}>{term}</span>)}</div><p className="school-scope">学習の入口に絞った用語です。教科書に合わせて学ぶ範囲を調整してください。</p></section>
    <section className="school-check"><h4>観察して、説明しよう</h4><p>{topic.question}</p><details><summary>説明の例を見る</summary><p>{topic.answer}</p></details></section>
    {topic.advanced&&<details className="school-extension"><summary>発展内容と収録範囲</summary><p>{topic.advanced}</p></details>}
    <div className="learning-tip"><Info size={15}/><span>3Dは位置と形、模式図は流れと働きの観察に使います。色・動き・模式図は学習用の表現です。</span></div>
   </div>
   <footer className="curriculum-source"><span>{course.name}：{course.unit}<br/>器官ごとの教材として構成。指導要領の全内容を網羅するものではありません。</span><div><a href={course.source} target="_blank" rel="noreferrer">文部科学省・学習指導要領解説 <ChevronRight size={13}/></a></div></footer>
  </aside>}
 </>;
}

export function LessonIcon({children}:{children:ReactNode}){return <span className="lesson-icon">{children}</span>}
