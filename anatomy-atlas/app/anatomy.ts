import JAPANESE_NAMES from './anatomy-names-ja.json' with {type:'json'};
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
export type RegionId='all'|'head'|'chest'|'abdomen'|'pelvis'|'arms'|'legs';
export interface CameraPose {position:number[];target:number[]}
export interface SceneState {inspectorOpen?:boolean;explode:number;visible:SystemId[];selected:string[];selectionName?:string;hidden?:string[];faded?:string[];revealed?:string[];region?:RegionId;labels?:boolean;quality?:'light'|'standard';zoomRequest?:{id:number;factor:number};cameraRequest?:CameraPose&{id:number};mode?:'select'|'multi'|'dissect';focus?:number;isolate:boolean;view:View;rotate:boolean;reset:number}
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
 'cavity of right atrium':'右心房の内側の空間です。全身から戻った酸素の少ない血液を受け取り、右心室へ送ります。',
 'cavity of left atrium':'左心房の内側の空間です。肺から戻った酸素の多い血液を受け取り、左心室へ送ります。',
 'cavity of right ventricle':'右心室の内側の空間です。肺動脈を通して、酸素の少ない血液を肺へ送り出します。',
 'cavity of left ventricle':'左心室の内側の空間です。大動脈を通して、酸素の多い血液を全身へ送り出します。',
 'liver':'横隔膜の右下にある大きな器官です。吸収された栄養分を処理し、胆汁をつくり、血液中のたんぱく質もつくります。',
 'kidney':'血液から不要な物質や余分な水分を取り除き、尿をつくる器官です。水分量や塩分濃度の調節にも関わります。',
 'brain':'神経系の中心となる器官です。見たり聞いたりした情報を受け取り、運動・記憶・言葉・体の調節に関わります。',
 'spinal cord':'脳と末しょう神経をつなぐ中枢神経です。反射では、脳へ情報が届く前に筋肉へ命令を出す経路になります。',
 'stomach':'食道と小腸の間にある筋肉の袋です。食べ物を一時的にたくわえ、胃液と混ぜて消化します。',
 'spleen':'腹部の左上にあるリンパ系の器官です。血液を調べ、古くなった血球を処理し、免疫にも関わります。',
 'pancreas':'消化とホルモンの両方に関わる器官です。小腸へ消化液を出し、インスリンなどのホルモンも分泌します。',
 'urinary bladder':'腎臓でつくられた尿を一時的にたくわえる、骨盤内の筋肉の袋です。',
 'trachea':'のどから左右の気管支へ続く空気の通り道です。軟骨の輪が気管をつぶれにくくしています。',
 'right eye':'光を受け取る感覚器官です。角膜、虹彩、瞳孔、水晶体、網膜、視神経などからなります。',
 'left eye':'光を受け取る感覚器官です。角膜、虹彩、瞳孔、水晶体、網膜、視神経などからなります。',
 'right lens':'光を曲げて網膜に像を結ばせる透明な部分です。厚さを変えて焦点を合わせます。',
 'left lens':'光を曲げて網膜に像を結ばせる透明な部分です。厚さを変えて焦点を合わせます。',
 'right optic nerve':'右目の網膜の情報を脳へ伝える神経です。',
 'left optic nerve':'左目の網膜の情報を脳へ伝える神経です。',
 'diaphragm':'胸と腹を分ける広い筋肉です。縮むと胸の容積が大きくなり、空気を肺へ吸い込みます。',
};

const EXACT_JA:Record<string,string> = {
 'heart':'心臓','brain':'脳','spinal cord':'せきずい','liver':'肝臓','stomach':'胃','spleen':'ひ臓','pancreas':'すい臓',
 'right lung':'右肺','left lung':'左肺','lung':'肺','trachea':'気管','diaphragm':'横隔膜','esophagus':'食道','small intestine':'小腸','large intestine':'大腸',
 'kidney':'腎臓','right kidney':'右腎臓','left kidney':'左腎臓','ureter':'尿管','right ureter':'右尿管','left ureter':'左尿管','urinary bladder':'ぼうこう','urethra':'尿道',
 'right eye':'右目','left eye':'左目','right eyeball':'右眼球','left eyeball':'左眼球','iris':'虹彩','right iris':'右虹彩','left iris':'左虹彩','pupil':'瞳孔','right pupil':'右瞳孔','left pupil':'左瞳孔','cornea':'角膜','right cornea':'右角膜','left cornea':'左角膜','lens':'水晶体','right lens':'右水晶体','left lens':'左水晶体',
 'optic nerve':'視神経','right optic nerve':'右視神経','left optic nerve':'左視神経','retina':'網膜','optic part of retina':'網膜','external ear':'外耳','middle ear':'中耳','inner ear':'内耳','cochlea':'うずまき管（蝸牛）',
 'skin':'皮膚','bone organ':'骨','muscle organ':'筋肉','cranial nerve':'脳神経','nerve trunk':'神経幹','right side of heart':'心臓の右側','left side of heart':'心臓の左側','cavity of right atrium':'右心房','cavity of left atrium':'左心房','cavity of right ventricle':'右心室','cavity of left ventricle':'左心室','wall of right atrium':'右心房の壁','wall of left atrium':'左心房の壁','wall of right ventricle':'右心室の壁','wall of left ventricle':'左心室の壁',
};

/** Source labels remain unchanged for model IDs and English search. */
export function localizeAnatomyName(name:string){
 const source=name.trim().toLowerCase();
 return EXACT_JA[source] ?? (JAPANESE_NAMES as Record<string,string>)[source] ?? '名称未登録の人体構造';
}

/** Explain difficult words used in the selected structure's label. */
export function anatomyNameHint(name:string){
 const label=localizeAnatomyName(name);
 const hints:string[]=[];
 if(/\b(right|left)\b/i.test(name))hints.push('右・左は、見ている人ではなく人体自身の向きです。');
 const terms:[string,string][]=[
  ['乳頭筋','乳頭筋は、心臓の弁を支える筋肉です。'],
  ['腱索','腱索は、心臓の弁と筋肉をつなぐひものような組織です。'],
  ['靭帯','靭帯（じんたい）は、骨や器官をつないで支える組織です。'],
  ['腓腹筋','腓腹筋（ひふくきん）は、ふくらはぎの筋肉です。'],
  ['橈','橈骨（とうこつ）は、前腕の親指側にある骨です。'],
  ['尺','尺骨（しゃっこつ）は、前腕の小指側にある骨です。'],
  ['脛','脛骨（けいこつ）は、すねにある太い骨です。'],
  ['腓骨','腓骨（ひこつ）は、すねの外側にある細い骨です。'],
  ['屈筋','屈筋（くっきん）は、関節を曲げる筋肉です。'],
  ['伸筋','伸筋（しんきん）は、関節を伸ばす筋肉です。'],
  ['外転筋','外転筋（がいてんきん）は、手足などを体の中心線から離す筋肉です。'],
  ['内転筋','内転筋（ないてんきん）は、手足などを体の中心線へ近づける筋肉です。'],
  ['幹','幹（かん）は、血管や神経などの太い主な部分を表します。'],
  ['枝','枝（えだ）は、血管や神経などが枝分かれした部分を表します。'],
  ['区域','区域（くいき）は、器官の中を分けて呼ぶ範囲です。'],
  ['皮質','皮質（ひしつ）は、器官の外側の層です。'],
  ['髄質','髄質（ずいしつ）は、器官の内側の部分です。'],
 ];
 for(const [word,hint] of terms)if(label.includes(word)&&hints.length<3)hints.push(hint);
 return hints.join(' ');
}

export function explanation(name:string,system:SystemId){return EXPLANATIONS[name.toLowerCase()] ?? SYSTEMS.find(s=>s.id===system)?.description ?? '';}
