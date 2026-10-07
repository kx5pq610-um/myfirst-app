"""Build the bundled Japanese dictionary; fail rather than leave untranslated words.

Usage: python scripts/build-japanese-names.py isa_parts_list.txt partof_parts_list.txt
Source: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/
BodyParts3D © ライフサイエンス統合データベースセンター, CC BY 4.0.
Japanese names are adapted, with composed labels for fine subdivisions.
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
terms = {}
for path in sys.argv[1:]:
    for row in csv.DictReader(open(path, encoding='utf-8'), delimiter='\t'):
        label = re.split('[;|]', row['kanji'])[0]
        if label and not re.search('[a-zA-Z]', label):
            terms[row['en'].lower()] = label.replace('頚', '頸')

# Whole phrases take precedence over individual words, especially Latin muscle names.
ADDITIONS = '''
musculature|筋群
nerve trunk|神経幹
arterial trunk|動脈幹
pulmonary arterial trunk|肺動脈幹
systemic arterial trunk|全身動脈幹
right side of heart|心臓の右側
left side of heart|心臓の左側
second toe|第2趾（足の人差し指）
third toe|第3趾（足の中指）
fourth toe|第4趾（足の薬指）
fifth toe|第5趾（足の小指）
second finger|人差し指
third finger|中指
fourth finger|薬指
fifth finger|小指
secondary canine tooth|永久犬歯
secondary incisor tooth|永久切歯
secondary premolar tooth|永久小臼歯
secondary molar tooth|永久大臼歯
central secondary incisor tooth|永久中切歯
lateral secondary incisor tooth|永久側切歯
first secondary premolar tooth|第1永久小臼歯
second secondary premolar tooth|第2永久小臼歯
first secondary molar tooth|第1永久大臼歯
second secondary molar tooth|第2永久大臼歯
third secondary molar tooth|第3永久大臼歯
plantar interosseous|足底骨間筋
palmar interosseous|掌側骨間筋
dorsal interosseous|背側骨間筋
cardiac chamber|心臓の部屋
cardiac valve|心臓の弁
cardiac vein|心臓静脈
colic artery|結腸動脈
iliocostalis thoracis|胸腸肋筋
lumbar intertransversarius|腰横突間筋
main bronchus|主気管支
in-vivo|体内での配置
sigmoid|Ｓ状結腸
cervical vertebra|頸椎
cervical vertebrae|頸椎
cervical intervertebral symphysis|頸椎の椎間結合
cervical vertebral column|頸部の脊柱
fornix|脳弓
brachium|腕
fibrous ring|線維輪
bone organ|骨
muscle organ|筋肉
spinal cord|せきずい
pancreas|すい臓
spleen|ひ臓
urinary bladder|ぼうこう
phalanx|指節骨（指の骨）
big toe|母趾（足の親指）
little toe|小趾（足の小指）
little finger|小指
ring finger|薬指
middle finger|中指
index finger|人差し指
thumb|親指
abductor digiti minimi|小指外転筋
flexor digiti minimi brevis|短小指屈筋
opponens digiti minimi|小指対立筋
pectoralis major|大胸筋
pectoralis minor|小胸筋
biceps femoris|大腿二頭筋
biceps brachii|上腕二頭筋
triceps brachii|上腕三頭筋
quadriceps femoris|大腿四頭筋
flexor hallucis brevis|短母趾屈筋
flexor hallucis longus|長母趾屈筋
abductor hallucis|母趾外転筋
adductor hallucis|母趾内転筋
flexor pollicis brevis|短母指屈筋
flexor pollicis longus|長母指屈筋
abductor pollicis brevis|短母指外転筋
abductor pollicis longus|長母指外転筋
adductor pollicis|母指内転筋
opponens pollicis|母指対立筋
pronator teres|円回内筋
flexor carpi ulnaris|尺側手根屈筋
extensor carpi ulnaris|尺側手根伸筋
interspinalis thoracis|胸棘間筋
interspinalis muscle|棘間筋
intertransversarius muscle|横突間筋
levatores costarum breves|短肋骨挙筋
levatores costarum longi|長肋骨挙筋
lumbrical muscle|虫様筋
lumbricals|虫様筋群
lumbrical|虫様筋
interossei|骨間筋群
interosseous muscle|骨間筋
gastrocnemius|腓腹筋
deltoid|三角筋
trapezius|僧帽筋
longus colli|頸長筋
fascia lata|大腿筋膜
arteria princeps pollicis|母指主動脈
taenia libera|自由ヒモ（結腸の筋肉の帯）
taenia mesocolica|間膜ヒモ（結腸の筋肉の帯）
taenia omentalis|大網ヒモ（結腸の筋肉の帯）
in vivo|体内での配置
vena caval|大静脈
vena cava|大静脈
thoraco-acromial|胸肩峰
bronchopulmonary segment|肺区域
bronchopulmonary|気管支・肺
subdivisionof|細区分の
anatomical entity|人体の構造
anatomical boundary entity|人体構造の境界
immaterial anatomical entity|人体内の空間・境界
physical anatomical entity|人体の構造
material anatomical entity|人体の組織・器官
human body|人体
vascular tree|血管の枝分かれ
biliary tree|胆管の枝分かれ
bronchial tree|気管支の枝分かれ
arterial tree|動脈の枝分かれ
venous tree|静脈の枝分かれ
hepatovenous|肝静脈
check ligament|制止靭帯（目の動きを支える靭帯）
suspensory ligament|支持靭帯
arterial anastomosis|動脈の吻合（つながり）
venous anastomosis|静脈の吻合（つながり）
vascular anastomosis|血管の吻合（つながり）
anastomosis|吻合（つながり）
cardinal segment|主要区間
proper palmar digital|固有掌側指
proper plantar digital|固有底側趾
digital|指・趾の
palmar|掌側（手のひら側）
plantar|足底側
distal|遠位（体の中心から遠い側）
proximal|近位（体の中心に近い側）
medial|内側
lateral|外側
superficial|浅部
deep|深部
interventricular|心室間
ventricular|心室
atrial|心房
papillary muscle|乳頭筋
myocardium|心筋
myocardial|心筋
pulmonary trunk|肺動脈幹
pulmonary|肺
coronary|冠状
portal|門脈
hepatic|肝
renal|腎
gastrointestinal|胃腸
pancreaticobiliary|すい臓・胆管
pancreatic|すい臓
pancreaticoduodenal|すい十二指腸
esophageal|食道
ureteric|尿管
urinary|泌尿器
epigastric|上腹部
ileocecal|回盲部
ileal|回腸
coeliac|腹腔
respiratory|呼吸器
alimentary|消化管
musculoskeletal|筋骨格
cardiovascular|心血管
integumentary|体表
endocrine|内分泌
reproductive|生殖
neural|神経
nervous|神経
autonomic|自律
parasympathetic|副交感
oculomotor|動眼
trigeminal|三叉
optic|視
cranial|頭蓋
spinal|脊髄
cerebral|大脳
cerebellar|小脳
pontine|橋
choroidal|脈絡
hippocampal formation|海馬体
hippocampal|海馬
hypothalamic|視床下部
limbic|辺縁
insular|島
prefrontal|前頭前
frontal|前頭
temporal|側頭
occipital|後頭
temporo-occipital|側頭後頭
parietal|頭頂
postcentral|中心後
precentral|中心前
precuneal|楔前部
paracentral|中心傍
archicortex|原皮質
subcortex|皮質下
white matter|白質
gray matter|灰白質
dura mater|硬膜
subarachnoid|くも膜下
circumventricular|脳室周囲
postcommunicating|交通後部
precommunicating|交通前部
intermediomedial|中間内側
laterobasal|外側底部
mediobasal|内側底部
inferomedial|下内側
posteromedial|後内側
anterolateral|前外側
subsuperior|上部の下側
apicoposterior|尖後
bronchial|気管支
tracheobronchial|気管・気管支
pulmopleural|肺・胸膜
intrapulmonary|肺内
lingular|舌区
lobar|葉
lobular|小葉
nasal|鼻
salivary|唾液
lacrimal|涙
ciliary|毛様
extraocular|外眼
ocular|眼
orbital|眼窩
laryngeal|喉頭
laryngopharynx|喉頭咽頭
faucial|口峡
phrenic|横隔
cricothyroid|輪状甲状
thyrocervical|甲状頸
costocervical|肋頸
musculophrenic|筋横隔
intercostal|肋間
suprarenal|副腎
jugular|頸静脈
testicular|精巣
pudendal|陰部
genital|生殖器
perineal|会陰
pelvic|骨盤
peritoneal|腹膜
prevertebral|椎前
postvertebral|椎後
intervertebral|椎間
suboccipital|後頭下
suprahyoid|舌骨上
infrahyoid|舌骨下
sternocostal|胸肋
sternal|胸骨
clavicular|鎖骨
acromial|肩峰
scapular|肩甲
pectoral|胸
thoracic|胸部
abdominal|腹部
lumbar|腰部
sacral|仙骨
gluteal|殿部
femoral|大腿
femoris|大腿
brachial|上腕
brachii|上腕
humeral|上腕骨
ulnar|尺骨
ulnaris|尺側
radial|橈骨
carpal|手根
carpi|手根
metacarpal|中手
metatarsal|中足
tarsal|足根
tibial|脛骨
fibular|腓骨
patellar|膝蓋
genicular|膝
navicular|舟状
cuneiform|楔状
sphenoid|蝶形
maxillary|上顎
mandibular|下顎
pubic|恥骨
obturator|閉鎖
auriculotemporal|耳介側頭
hypothenar|小指球
thenar|母指球
abductor|外転筋
adductor|内転筋
flexor|屈筋
extensor|伸筋
opponens|対立筋
levator ani|肛門挙筋
levator|挙筋
constrictor|収縮筋
serratus|鋸筋
scalene|斜角筋
gemellus|双子筋
retinaculum|支帯
collateral|側副
alar|翼状
fibrous|線維性
fascial|筋膜
investing|包む
cartilaginous|軟骨性
osseous|骨性
bony|骨性
skeletal|骨格
nonskeletal|骨格以外の
systemic|全身
arterial|動脈
venous|静脈
vascular|血管
cavernous|海綿状
cavitated|内腔のある
parenchymatous|実質性
nonparenchymatous|実質以外の
parenchyma|実質（器官の主な組織）
mucoid|粘液性
membranous|膜性
serous|漿液性
solid|充実性
hollow|中空
intrinsic|内在
extrinsic|外来
intracranial|頭蓋内
intrahepatic|肝内
extrahepatic|肝外
subendocardial|心内膜下
subaortic|大動脈下
vermian|小脳虫部
corticomedullary|皮質・髄質
nuclear complex|核複合体
caudate|尾状
septal|中隔
apical|尖部
basal|底部
central|中心
terminal|末端
marginal|辺縁
communicating|交通
ascending|上行
descending|下行
circumflex|回旋
diagonal|対角
perforating|穿通
transverse|横
oblique|斜
straight|直
vertical|縦
interosseous|骨間
''' 
for line in ADDITIONS.strip().splitlines():
    en, ja = line.split('|')
    terms[en] = ja

WORDS = '''
cardiac|心臓
cardinal|主要な
cervical|頸部
thoracis|胸部
intermediate|中間
intertransversarius|横突間筋
tree|枝分かれ
main|主
ring|輪
right|右
left|左
anterior|前
posterior|後
superior|上
inferior|下
upper|上
lower|下
middle|中
first|第1
second|第2
third|第3
fourth|第4
fifth|第5
sixth|第6
seventh|第7
eighth|第8
ninth|第9
tenth|第10
eleventh|第11
twelfth|第12
branch|枝
segmental|区域
subsegmental|亜区域
segment|区間
subdivision|細区分
division|区分
part|部
parts|部分
wall|壁
tributary|流入枝
organ|器官
organs|器官
bone|骨
muscle|筋
ligament|靭帯
fascia|筋膜
cartilage|軟骨
membrane|膜
layer|層
zone|領域
region|領域
regions|領域
sector|区域
subsector|細区域
set|群
cluster|集まり
clusters|集まり
system|系
component|構成部分
compartment|区画
content|内容
portion|部分
structure|構造
anatomical|解剖学的
entity|構造
space|空間
cavity|内腔
chamber|房
lobe|葉
lobule|小葉
gyrus|回
sulcus|溝
tract|路
matter|質
cortex|皮質
nucleus|核
network|網
commissure|交連
septum|中隔
cusp|弁尖
leaflet|弁尖
leaf|膜状部分
valve|弁
plate|板
lamina|板
body|体
body organ|器官
side|側
secondary|二次
proper|固有
common|総
internal|内
external|外
free|遊離
major|大
minor|小
long|長
short|短
longus|長筋
longi|長筋群
brevis|短筋
breves|短筋群
accessory|副
variant|変異型
typical|典型的な
atypical|非典型的な
irregular|不規則な形の
true|真
false|仮
floating|浮遊
heterogeneous|異なる組織からなる
continuity|連続部
junction|接合部
boundary|境界
conduit|通路
line|線
human|人体
foot|足
hand|手
finger|手の指
toe|足の指
limb|肢
forearm|前腕
arm|腕
leg|下腿
thigh|大腿
chest|胸
back|背部
shoulder|肩
knee|膝
wrist|手首
jaw|顎
cheek|頬
hip|股関節
girdle|帯
skeleton|骨格
eyeball|眼球
eyelid|まぶた
eye|目
ear|耳
orbit|眼窩
larynx|喉頭
pharynx|咽頭
penis|陰茎
colon|結腸
urethra|尿道
bronchus|気管支
retina|網膜
gland|腺
cell|細胞
tissue|組織
hair|毛
hairs|毛
lip|唇
palate|口蓋
mesentery|腸間膜
duct|管
arch|弓
appendage|付属部
apparatus|装置
formation|形成体
peduncle|脚
process|突起
sac|嚢
capsule|被膜
incisure|切痕
curtain|膜状部分
epidermis|表皮
epithelium|上皮
tectum|蓋
stria|条
trochlea|滑車
taenia|ヒモ
basicranial|頭蓋底
axial|体軸
axis|軸椎
atlas|環椎
articular|関節
disk|円板
symphysis|結合
vertebrae|椎骨
hemisphere|半球
trunk|幹
inflow|流入部
outflow|流出部
vasculature|血管系
connective|結合
heart|心臓
atrium|心房
ventricle|心室
artery|動脈
vein|静脈
nerve|神経
lung|肺
pre|前
antero|前
extra|外
small|小
large|大
big|大
little|小
dorsal|背側
dorsum|背面
facial|顔面
salivary|唾液
ix|第9
''' 
for line in WORDS.strip().splitlines():
    en, ja = line.split('|')
    terms.setdefault(en, ja)

pattern = re.compile(r'\b(' + '|'.join(re.escape(t) for t in sorted(terms, key=len, reverse=True)) + r')\b')

def translate(name):
    name = name.lower().strip().replace('subdivisionof ', 'subdivision of ')
    if name in terms:
        return terms[name]
    # A named structure's side belongs outside its subpart: 左上腕二頭筋の長頭.
    sides = re.findall(r'\b(right|left)\b', name)
    if len(sides) == 1:
        side = terms[sides[0]]
        rest = re.sub(r'\b(right|left)\s+', '', name)
        return side + translate(rest)
    if ' of ' in name:
        part, parent = name.split(' of ', 1)
        return translate(parent) + 'の' + ('幹' if part == 'trunk' else translate(part))
    if ' to ' in name:
        origin, target = name.split(' to ', 1)
        return translate(target) + 'へ向かう' + translate(origin)
    if ' with ' in name:
        base, addition = name.split(' with ', 1)
        return translate(base) + '（' + translate(addition) + 'を含む）'
    value = pattern.sub(lambda m: terms[m[0]], name)
    value = value.replace(' in ', '内の').replace('(', '（').replace(')', '）').replace('-', '・')
    value = re.sub(r'\s+', '', value)
    if re.search('[a-zA-Z]', value):
        raise ValueError(f'Untranslated: {name} => {value}')
    return value.replace('筋筋', '筋')

atlas = json.loads((ROOT / 'public/models/atlas.json').read_text())
names = sorted({p['name'].lower().strip() for p in atlas['parts'] + atlas['concepts']})
labels = {}
errors = []
for name in names:
    try:
        labels[name] = translate(name)
    except ValueError as error:
        errors.append(str(error))
if errors:
    print('\n'.join(errors))
    sys.exit(1)
(ROOT / 'app/anatomy-names-ja.json').write_text(json.dumps(labels, ensure_ascii=False, indent=1) + '\n')
print(f'Japanese dictionary: {len(labels)} names; {len(atlas["parts"])} parts and {len(atlas["concepts"])} concepts covered.')
