export type SystemId = 'skeletal'|'muscular'|'arterial'|'venous'|'nervous'|'digestive'|'respiratory'|'urinary'|'reproductive'|'lymphatic'|'endocrine'|'integumentary'|'connective'|'sensory'|'cardiac';
export const SYSTEMS: {id:SystemId;name:string;color:string;description:string}[] = [
 {id:'skeletal',name:'骨格',color:'#e2d9ba',description:'骨格は体を支える柱となり、内臓を守り、筋肉が付く場所になります。骨の内部ではミネラルをたくわえたり、血液の細胞をつくったりします。'},
 {id:'muscular',name:'筋肉',color:'#a85b50',description:'骨格筋は、付着している骨を引くことで体を動かします。腱と協力して関節を動かし、姿勢を保ち、熱もつくります。'},
 {id:'cardiac',name:'心臓',color:'#b96760',description:'心臓は4つの部屋をもつ筋肉のポンプです。弁が血液の逆流を防ぎ、肺循環と全身循環へ血液を送り出します。'},
 {id:'sensory',name:'感覚器官',color:'#b0c8ce',description:'目・耳など、光や音、体の傾きなどを受け取る器官です。受け取った情報は神経を通って脳に伝わります。'},
 {id:'arterial',name:'動脈',color:'#c05245',description:'動脈は心臓から送り出された血液を全身へ運ぶ血管です。肺へ向かう肺動脈のように、酸素の量だけでは動脈・静脈は決まりません。'},
 {id:'venous',name:'静脈',color:'#527c9f',description:'静脈は体の各部分から心臓へ血液を戻す血管です。肺から心臓へ戻る肺静脈は、酸素を多く含む血液を運びます。'},
 {id:'nervous',name:'神経系',color:'#d8b565',description:'脳・せきずい・末しょう神経でできています。感覚の情報を受け取り、体を動かす命令を出し、体の働きを調節します。'},
 {id:'respiratory',name:'呼吸器',color:'#b98991',description:'気道は空気を肺へ運び、肺で酸素と二酸化炭素を血液と交換します。横隔膜などの筋肉が胸の容積を変えて呼吸を起こします。'},
 {id:'digestive',name:'消化器',color:'#b8916b',description:'食べ物を口から取り入れ、消化して栄養分や水分を吸収し、残りを便として運びます。肝臓やすい臓も消化を助けます。'},
 {id:'urinary',name:'泌尿器',color:'#b47961',description:'腎臓は血液から不要な物質や余分な水分をこし取り、尿をつくります。尿は尿管を通ってぼうこうにたまり、尿道から出ます。'},
 {id:'lymphatic',name:'リンパ系',color:'#879f7c',description:'リンパ管は組織に出た余分な水分を血液へ戻します。リンパ節などは体内に入った異物を見張り、免疫の働きに関わります。'},
 {id:'endocrine',name:'内分泌',color:'#c5a09a',description:'内分泌器官はホルモンを血液中に出し、体の成長・代謝・ストレスへの反応などを調節します。'},
 {id:'reproductive',name:'生殖器',color:'#bda098',description:'このモデルに含まれる男性の生殖器官です。精子をつくり、運び、性ホルモンを分泌する働きがあります。'},
 {id:'integumentary',name:'体表',color:'#ba9b7d',description:'体表は外側から見た人体の目印です。皮膚は体を守り、感覚や体温調節にも関わります。'},
 {id:'connective',name:'結合組織',color:'#aec3bb',description:'軟骨や靭帯など、器官を支えたりつないだりする組織です。関節を安定させ、力を分散する働きがあります。'},
];
export interface Part {id:string;name:string;conceptId:string;system:SystemId;chunk:number;positions:number;normals:number;indices:number;vertexCount:number;indexCount:number;bounds:[number[],number[]]}
export interface Concept {id:string;name:string;elements:string[]}
export interface Atlas {version:string;sex?:'male';source?:string;scope?:string;parts:Part[];concepts:Concept[];chunks:{url:string;bytes:number;gzip?:string;gzipBytes?:number}[];triangles:number}
export type View = 'three-quarter'|'front'|'back'|'side';
export interface SceneState {inspectorOpen?:boolean;explode:number;visible:SystemId[];selected:string[];isolate:boolean;view:View;rotate:boolean;reset:number}
/** 中学校の授業でまず扱うまとまり。細かい医学系の分類はデータとして残し、画面には出しません。 */
export interface LearningLayer {id:string;name:string;color:string;systems:SystemId[]}
export const LEARNING_LAYERS:LearningLayer[] = [
 {id:'surface',name:'体表',color:'#ba9b7d',systems:['integumentary']},
 {id:'skeletal',name:'骨格',color:'#e2d9ba',systems:['skeletal']},
 {id:'muscular',name:'筋肉',color:'#a85b50',systems:['muscular']},
 {id:'circulatory',name:'循環器',color:'#c05245',systems:['cardiac','arterial','venous']},
 {id:'respiratory',name:'呼吸器',color:'#b98991',systems:['respiratory']},
 {id:'digestive',name:'消化器',color:'#b8916b',systems:['digestive']},
 {id:'urinary',name:'泌尿器',color:'#b47961',systems:['urinary']},
 {id:'nervous-sensory',name:'神経・感覚器',color:'#d8b565',systems:['nervous','sensory']},
];
export const LEARNING_VISIBLE_SYSTEMS:SystemId[] = LEARNING_LAYERS.flatMap(layer=>layer.systems);
export const ORGAN_VISIBLE_SYSTEMS:SystemId[] = ['cardiac','arterial','venous','respiratory','digestive','urinary'];
export const DEFAULT_VISIBLE:SystemId[] = LEARNING_VISIBLE_SYSTEMS;
export const EXPLANATIONS:Record<string,string> = {
 'heart':'胸の中央にある筋肉のポンプです。右側は肺へ、左側は全身へ血液を送り出します。4つの部屋と弁が、血液の流れを一方向に保ちます。',
 'liver':'横隔膜の右下にある大きな器官です。吸収された栄養分を処理し、胆汁をつくり、血液中のたんぱく質もつくります。',
 'brain':'神経系の中心となる器官です。見たり聞いたりした情報を受け取り、運動・記憶・言葉・体の調節に関わります。',
 'stomach':'食道と小腸の間にある筋肉の袋です。食べ物を一時的にたくわえ、胃液と混ぜて消化します。',
 'spleen':'腹部の左上にあるリンパ系の器官です。血液を調べ、古くなった血球を処理し、免疫にも関わります。',
 'pancreas':'消化とホルモンの両方に関わる器官です。小腸へ消化液を出し、インスリンなどのホルモンも分泌します。',
 'urinary bladder':'腎臓でつくられた尿を一時的にたくわえる、骨盤内の筋肉の袋です。',
 'trachea':'のどから左右の気管支へ続く空気の通り道です。軟骨の輪が気管をつぶれにくくしています。',
 'diaphragm':'胸と腹を分ける広い筋肉です。縮むと胸の容積が大きくなり、空気を肺へ吸い込みます。',
};

const EXACT_JA:Record<string,string> = {
 'heart':'心臓','brain':'脳','spinal cord':'せきずい','liver':'肝臓','stomach':'胃','spleen':'ひ臓','pancreas':'すい臓',
 'right lung':'右肺','left lung':'左肺','lung':'肺','trachea':'気管','diaphragm':'横隔膜','esophagus':'食道','small intestine':'小腸','large intestine':'大腸',
 'kidney':'腎臓','right kidney':'右腎臓','left kidney':'左腎臓','ureter':'尿管','right ureter':'右尿管','left ureter':'左尿管','urinary bladder':'ぼうこう','urethra':'尿道',
 'right eye':'右目','left eye':'左目','right eyeball':'右眼球','left eyeball':'左眼球','iris':'虹彩','right iris':'右虹彩','left iris':'左虹彩','lens':'水晶体','right lens':'右水晶体','left lens':'左水晶体',
 'optic nerve':'視神経','right optic nerve':'右視神経','left optic nerve':'左視神経','retina':'網膜','optic part of retina':'網膜','external ear':'外耳','middle ear':'中耳','inner ear':'内耳','cochlea':'うずまき管（蝸牛）',
 'skin':'皮膚','bone organ':'骨','muscle organ':'筋肉','cranial nerve':'脳神経','nerve trunk':'神経幹','right side of heart':'心臓の右側','left side of heart':'心臓の左側',
};

const PHRASES:[RegExp,string][] = [
 [/\bcardinal segment of\b/gi,'主要部位の'],[/\bsegment of\b/gi,'部位の'],[/\bregion of\b/gi,'領域の'],[/\bzone of\b/gi,'領域の'],[/\bpart of\b/gi,'部の'],[/\bwall of\b/gi,'壁の'],
 [/\bright side of\b/gi,'右側の'],[/\bleft side of\b/gi,'左側の'],[/\bright\b/gi,'右'],[/\bleft\b/gi,'左'],[/\bupper\b/gi,'上'],[/\blower\b/gi,'下'],[/\banterior\b/gi,'前'],[/\bposterior\b/gi,'後'],[/\bsuperior\b/gi,'上'],[/\binferior\b/gi,'下'],[/\bmiddle\b/gi,'中'],
 [/\bcommon\b/gi,'総'],[/\binternal\b/gi,'内'],[/\bexternal\b/gi,'外'],[/\bsuperficial\b/gi,'表面'],[/\bdeep\b/gi,'深'],[/\bsmall\b/gi,'小'],[/\blarge\b/gi,'大'],[/\bfirst\b/gi,'第1'],[/\bsecond\b/gi,'第2'],[/\bthird\b/gi,'第3'],[/\bbranch\b/gi,'枝'],[/\btrunk\b/gi,'幹'],[/\bsegmental\b/gi,'区域'],
 [/\bartery\b/gi,'動脈'],[/\bvein\b/gi,'静脈'],[/\bnerve\b/gi,'神経'],[/\bmuscle\b/gi,'筋'],[/\bbone\b/gi,'骨'],[/\bligament\b/gi,'靭帯'],[/\bcartilage\b/gi,'軟骨'],[/\borgan\b/gi,'器官'],[/\bmembrane\b/gi,'膜'],[/\bwall\b/gi,'壁'],
 [/\bheart\b/gi,'心臓'],[/\bbrain\b/gi,'脳'],[/\bspinal cord\b/gi,'せきずい'],[/\blung\b/gi,'肺'],[/\btrachea\b/gi,'気管'],[/\bdiaphragm\b/gi,'横隔膜'],[/\besophagus\b/gi,'食道'],[/\bstomach\b/gi,'胃'],[/\bliver\b/gi,'肝臓'],[/\bspleen\b/gi,'ひ臓'],[/\bpancreas\b/gi,'すい臓'],[/\bintestin(?:e|al)\b/gi,'腸'],[/\bkidney\b/gi,'腎臓'],[/\bureter\b/gi,'尿管'],[/\bbladder\b/gi,'ぼうこう'],[/\burethra\b/gi,'尿道'],[/\beye(?:ball)?\b/gi,'眼'],[/\biris\b/gi,'虹彩'],[/\blens\b/gi,'水晶体'],[/\bretina\b/gi,'網膜'],[/\boptic\b/gi,'視'],[/\bear\b/gi,'耳'],[/\bskin\b/gi,'皮膚'],[/\bblood\b/gi,'血液'],
];

/** BodyParts3D names are English source labels. Keep the source name for IDs/search, but show a readable Japanese label in the UI. */
export function localizeAnatomyName(name:string){
 const source=name.trim();
 const exact=EXACT_JA[source.toLowerCase()];
 if(exact)return exact;
 let value=source;
 for(const [pattern,replacement] of PHRASES)value=value.replace(pattern,replacement);
 return value.split(/\s+/).filter(Boolean).join(' ')
   .replace(/\s+の\s+/g,'の').replace(/\s+([右左上下前後])\s+/g,'$1');
}

export function explanation(name:string,system:SystemId){return EXPLANATIONS[name.toLowerCase()] ?? SYSTEMS.find(s=>s.id===system)?.description ?? '';}
