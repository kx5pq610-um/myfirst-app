import {flushSync} from 'react-dom';
import {registerAtlasTools} from './agent-tools';
import {useEffect,useMemo,useReducer,useRef,useState} from 'react';
import {Activity,ArrowUpRight,BookOpen,ChevronRight,Focus,Info,Layers3,RotateCcw,Search,X,Undo2,MousePointer2,EyeOff,ScanLine,ZoomIn,ZoomOut,Redo2,Bookmark,Settings2,ListChecks,Network} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Switch} from '@/components/ui/switch';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import {Combobox,ComboboxInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty} from '@/components/ui/combobox';
import AnatomyScene from './scene';
import {sceneHistory,hideParts,fadeSelected,partVisibility,toggleSelected,fadeSurroundings,nearbyParts,REGIONS} from './atlas-controls';
import {DEFAULT_VISIBLE,LEARNING_LAYERS,LEARNING_VISIBLE_SYSTEMS,ORGAN_VISIBLE_SYSTEMS,SYSTEMS,EXPLANATIONS,explanation,localizeAnatomyName,anatomyNameHint,type Atlas,type Concept,type SceneState,type View} from './anatomy';
import LearningPanel,{type Lesson,type LessonId} from './learning';
import OrganModel from './organ-model';
import AtlasWorkspace from './atlas-workspace';
import type {SavedView} from './saved-views';
import type {CameraPose} from './anatomy';
const initial:SceneState={explode:0,visible:DEFAULT_VISIBLE,selected:[],isolate:false,view:'three-quarter',rotate:false,reset:0,focus:0,hidden:[],faded:[],revealed:[],region:'all',labels:true,quality:'light',mode:'select'};
export default function Home(){
 const [organModel,setOrganModel]=useState<'heart'|'eye'|null>(null);
 const detailTitle=useRef<HTMLHeadingElement>(null),cameraPose=useRef<CameraPose|undefined>(undefined);
 const cameraSequence=useRef(0);
 const [history,dispatch]=useReducer(sceneHistory,{current:initial,past:[]});
 const state=history.current;
 const setState=(update:SceneState|((state:SceneState)=>SceneState))=>dispatch({type:'change',update});
 const [atlas,setAtlas]=useState<Atlas|null>(null),[progress,setProgress]=useState(0),[error,setError]=useState(''),[panel,setPanel]=useState<'layers'|'search'|'views'|'tools'|null>(null),[details,setDetails]=useState(false),[about,setAbout]=useState(false),[lessonOpen,setLessonOpen]=useState(false),[lessonId,setLessonId]=useState<LessonId>('heart'),[query,setQuery]=useState('');
 useEffect(()=>{const abort=new AbortController();setProgress(0);setError('');setAtlas(null);setDetails(false);setState({...initial,visible:DEFAULT_VISIBLE});const atlasUrl=new URL('models/atlas.json',document.baseURI);fetch(atlasUrl,{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error('人体データを読み込めませんでした。');return r.json();}).then(data=>setAtlas(data as Atlas)).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>abort.abort();},[]);

 const parts=useMemo(()=>new Map(atlas?.parts.map(p=>[p.id,p])),[atlas]);
 const counts=useMemo(()=>Object.fromEntries(LEARNING_LAYERS.map(layer=>[layer.id,atlas?.parts.filter(p=>layer.systems.includes(p.system)).length??0])),[atlas]);
 const activeLayers=LEARNING_LAYERS.filter(layer=>counts[layer.id]>0);
 const selectedParts=state.selected.map(id=>parts.get(id)).filter(p=>!!p),selected=selectedParts[0],system=SYSTEMS.find(s=>s.id===selected?.system);
 const chosen=selected?{id:selected.conceptId,name:state.selectionName??selected.name,elements:state.selected}:null;
 const selectedTitle=state.selectionName?localizeAnatomyName(state.selectionName):state.selected.length>1?`${state.selected.length}個の部位を選択`:chosen?localizeAnatomyName(chosen.name):'';
 const visibleCount=atlas?.parts.filter(p=>partVisibility(p,state)).length??0;
 const selectionFaded=state.selected.length>0&&state.selected.every(id=>state.faded?.includes(id));
 const undo=()=>{const previous=history.past.at(-1);dispatch({type:'undo'});setDetails(!!previous?.selected.length);setPanel(null);};
 const redo=()=>{const next=history.future?.[0];dispatch({type:'redo'});setDetails(!!next?.selected.length);setPanel(null);};
 const loadView=(view:SavedView)=>{setState(s=>({...view.state,reset:s.reset+1,cameraRequest:view.camera?{...view.camera,id:++cameraSequence.current}:undefined}));setDetails(!!view.state.selected.length);setPanel(null);};
 const zoom=(factor:number)=>setState(s=>({...s,zoomRequest:{id:++cameraSequence.current,factor}}));
 const restore=()=>{setState(s=>({...s,hidden:[],faded:[],revealed:[],selected:[],selectionName:undefined,isolate:false,focus:0,explode:0,reset:s.reset+1}));setDetails(false);};
 const results=useMemo(()=>{if(!atlas)return[];const term=query.toLowerCase().trim();if(!term)return ['heart','brain','liver','stomach','spleen','pancreas','urinary bladder','trachea'].map(name=>atlas.concepts.find(c=>c.name.toLowerCase()===name)).filter((x):x is Concept=>!!x);return atlas.concepts.filter(c=>c.name.toLowerCase().includes(term)||localizeAnatomyName(c.name).toLowerCase().includes(term)||c.id.toLowerCase().includes(term)).sort((a,b)=>a.name.length-b.name.length).slice(0,80);},[atlas,query]);
 const choose=(c:Concept)=>{setState(s=>({...s,selected:s.mode==='multi'?[...new Set([...s.selected,...c.elements])]:c.elements,selectionName:s.mode==='multi'?undefined:c.name,hidden:s.hidden?.filter(id=>!c.elements.includes(id)),mode:s.mode==='multi'?'multi':'select',focus:0,isolate:false,rotate:false}));setDetails(true);setPanel(null);};
 useEffect(()=>{if(!atlas)return;return registerAtlasTools(atlas,c=>flushSync(()=>choose(c)));},[atlas]);
 const choosePart=(id:string)=>{const p=parts.get(id);if(!p)return;if(state.mode==='dissect'){setState(s=>hideParts(s,[id]));setDetails(false);return;}setState(s=>s.mode==='multi'?toggleSelected(s,id):({...s,selected:[id],selectionName:p.name,focus:0,isolate:false,rotate:false}));setDetails(true);setPanel(null);};
 const toggleLayer=(layer:typeof LEARNING_LAYERS[number])=>{setDetails(false);setState(s=>{const enabled=layer.systems.every(id=>s.visible.includes(id));return {...s,selected:[],isolate:false,visible:enabled?s.visible.filter(id=>!layer.systems.includes(id)):[...new Set([...s.visible,...layer.systems])]};});};
 const focusLesson=(lesson:Lesson)=>{setLessonId(lesson.id);const selected=lesson.focusNames?.flatMap(name=>atlas?.concepts.filter(c=>c.name.toLowerCase()===name.toLowerCase()).flatMap(c=>c.elements)??[])??[];setDetails(false);setState(s=>({...s,visible:lesson.systems,selected:[...new Set(selected)],selectionName:undefined,isolate:false,rotate:false,reset:s.reset+1,hidden:[],faded:[],revealed:[],region:'all',focus:0,mode:'select'}));};
 const reset=()=>{setState(s=>({...initial,visible:DEFAULT_VISIBLE,reset:s.reset+1}));setDetails(false);setPanel(null);};
 const openPanel=(next:'layers'|'search'|'views'|'tools')=>{setDetails(false);setPanel(p=>p===next?null:next);};
 const viewNames:Record<View,string>={'three-quarter':'斜め前','front':'正面','side':'側面','back':'背面'};
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   const target=e.target as HTMLElement|null;if(target?.closest('input,textarea,select,[contenteditable=true]'))return;
   const key=e.key.toLowerCase();
   if((e.ctrlKey||e.metaKey)&&key==='z'){e.preventDefault();e.shiftKey?redo():undo();return;}
   if((e.ctrlKey||e.metaKey)&&key==='y'){e.preventDefault();redo();return;}
   if(e.ctrlKey||e.metaKey||e.altKey)return;
   if(key==='/'){e.preventDefault();setPanel('search');setDetails(false);}
   else if(key==='escape'){setPanel(null);setDetails(false);setState(s=>({...s,selected:[],selectionName:undefined,isolate:false,focus:0}));}
   else if(state.selected.length&&key==='f'){e.preventDefault();setState(s=>({...s,focus:(s.focus??0)+1,explode:0}));}
   else if(state.selected.length&&key==='h'){e.preventDefault();setState(s=>hideParts(s));setDetails(false);}
   else if(state.selected.length&&key==='t'){e.preventDefault();setState(fadeSelected);}
  };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[state,history]);
 return <main className="studio">
  {atlas&&<AnatomyScene atlas={atlas} state={{...state,inspectorOpen:details&&selectedParts.length>0}} onSelect={choosePart} onCamera={pose=>{cameraPose.current=pose;}} onProgress={n=>{setProgress(n);if(n===100)setError('');}} onError={setError}/>}
  <div className="vignette"/>
  <header className="identity"><div className="eyebrow"><span className="status-dot"/> 3D人体アトラス</div><h1>人体アトラス<Badge variant="outline" className="edition">3D</Badge></h1><div className="identity-meta">{atlas?atlas.parts.length.toLocaleString():'2,234'}個の3Dパーツ <span>·</span> BodyParts3D</div></header>
  <nav className="top-actions" aria-label="アトラスの操作"><Button variant="ghost" className={panel==='layers'?'active':''} onClick={()=>openPanel('layers')} aria-label="表示する系統"><Layers3 size={18}/><span>表示する系統</span></Button><Button variant="ghost" className={lessonOpen?'active':''} onClick={()=>{setDetails(false);setPanel(null);setLessonOpen(true);}} aria-label="授業で学ぶ"><BookOpen size={18}/><span>授業で学ぶ</span></Button><Button variant="ghost" className={panel==='search'?'active':''} onClick={()=>openPanel('search')} aria-label="人体を検索"><Search size={18}/><span>構造を検索</span><kbd>/</kbd></Button><Button variant="ghost" aria-label="観察を保存・開く" onClick={()=>openPanel('views')}><Bookmark size={18}/><span>保存した観察</span></Button><Button variant="ghost" aria-label="観察の設定と操作方法" onClick={()=>openPanel('tools')}><Settings2 size={18}/><span>設定</span></Button><Button variant="ghost" className="icon-button" aria-label="このアトラスについて" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}><Info size={18}/></Button></nav>
  <section className={`layers-panel glass ${panel==='layers'?'mobile-open atlas-layers-open':'atlas-layers-closed'}`} aria-label="人体の学習レイヤー">
   <div className="panel-heading"><span>学習する部位</span><Button variant="ghost" className="icon-button" onClick={()=>setPanel(null)} aria-label="学習レイヤーを閉じる"><X size={18}/></Button><Badge variant="secondary" className="desktop-only small-number">{activeLayers.length}</Badge></div>
   <div className="atlas-region-picker" aria-label="観察する範囲">{REGIONS.map(r=><Button variant="ghost" key={r.id} aria-pressed={(state.region??'all')===r.id} onClick={()=>{setDetails(false);setState(s=>({...s,region:r.id,selected:[],selectionName:undefined,isolate:false,focus:0,reset:s.reset+1}));}}>{r.name}</Button>)}</div><div className="layer-presets"><Button variant="ghost" aria-pressed={LEARNING_VISIBLE_SYSTEMS.every(id=>state.visible.includes(id))} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:LEARNING_VISIBLE_SYSTEMS}))}>学習用</Button><Button variant="ghost" aria-pressed={state.visible.length===1&&state.visible[0]==='skeletal'} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:['skeletal']}))}>骨格</Button><Button variant="ghost" aria-pressed={ORGAN_VISIBLE_SYSTEMS.every(id=>state.visible.includes(id))&&state.visible.length===ORGAN_VISIBLE_SYSTEMS.length} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:ORGAN_VISIBLE_SYSTEMS}))}>内臓</Button></div>
   <div className="system-list">{activeLayers.map(layer=>{const enabled=layer.systems.some(id=>state.visible.includes(id));const checked=layer.systems.every(id=>state.visible.includes(id));return <div className={`system-row ${enabled?'enabled':''}`} key={layer.id}><Button variant="ghost" className="system-name" title={`${layer.name}だけを表示`} onClick={()=>setState(v=>({...v,visible:layer.systems,isolate:false,selected:[]}))}><span className="system-dot" style={{background:layer.color}}/>{layer.name}<span className="system-count">{counts[layer.id]}</span></Button><Switch checked={checked} onCheckedChange={()=>toggleLayer(layer)} aria-label={`${layer.name}を表示`} /></div>})}</div>
   <div className="panel-foot"><span>{visibleCount.toLocaleString()}個のパーツを表示</span><Button variant="ghost" onClick={()=>setState(s=>({...s,visible:[],selected:[],isolate:false}))}>すべて隠す</Button></div>
  </section>
  {panel==='search'&&<section className="search-panel glass" aria-label="人体を検索"><div className="panel-heading"><span>構造を検索</span><Button variant="ghost" className="icon-button" onClick={()=>setPanel(null)} aria-label="検索を閉じる"><X size={18}/></Button></div><Combobox<Concept> items={results} value={null} onValueChange={value=>{if(value)choose(value);}} inputValue={query} onInputValueChange={setQuery} itemToStringLabel={c=>localizeAnatomyName(c.name)} filter={null} open onOpenChange={open=>{if(!open)setPanel(null);}}><ComboboxInput autoFocus placeholder="心臓、太ももの骨、視神経…" aria-label="名前から人体の構造を検索" showTrigger={false}/><ComboboxContent className="anatomy-search-results"><ComboboxEmpty>一致する構造がありません。</ComboboxEmpty><ComboboxList>{(c:Concept)=><ComboboxItem key={c.id} value={c}><span className="search-result-name">{localizeAnatomyName(c.name)}</span><span className="small-number">{c.elements.length}個</span></ComboboxItem>}</ComboboxList></ComboboxContent></Combobox><p className="search-note">{query?'最大80件を表示しています。より細かい構造は検索語を追加してください。':'主な器官名や、体の構造名を入力してください。日本語・英語のどちらでも検索できます。'}</p></section>}
  {(panel==='views'||panel==='tools')&&<AtlasWorkspace key={panel} kind={panel} atlas={atlas} state={state} camera={()=>cameraPose.current} onChange={setState} onLoad={loadView} onClose={()=>setPanel(null)}/>}
  <LearningPanel open={lessonOpen} lessonId={lessonId} onClose={()=>setLessonOpen(false)} onLessonChange={setLessonId} onFocus={focusLesson} onModel={kind=>{setLessonOpen(false);setOrganModel(kind);}}/>
  {organModel&&atlas&&<OrganModel key={organModel} atlas={atlas} kind={organModel} onClose={()=>{setOrganModel(null);setLessonOpen(true);}}/>}
  <nav className="view-controls glass" aria-label="視点コントロール">{(['three-quarter','front','side','back'] as View[]).map((v,i)=><Button variant="ghost" key={v} className={state.view===v?'active':''} aria-pressed={state.view===v} onClick={()=>setState(s=>({...s,view:v,reset:s.reset+1}))} title={`${viewNames[v]}から見る`} aria-label={`${viewNames[v]}から見る`}><span>{['斜め','正面','側面','背面'][i]}</span></Button>)}<i/><Button variant="ghost" aria-label="拡大" title="拡大" onClick={()=>zoom(.82)}><ZoomIn size={17}/></Button><Button variant="ghost" aria-label="縮小" title="縮小" onClick={()=>zoom(1.22)}><ZoomOut size={17}/></Button><Button variant="ghost" aria-label="視点と表示をリセット" title="リセット" onClick={reset}><RotateCcw size={17}/></Button></nav>
  <div className="scene-caption"><span className="caption-line"/><span>{state.isolate?(selectedTitle||'選択中の構造'):'成人男性の人体モデル'}</span><span className="caption-line"/></div>
  <div className="bottom-dock glass atlas-dock" aria-label="人体の観察ツール">
   <Button variant="ghost" aria-pressed={state.mode==='select'} className={state.mode==='select'?'active':''} onClick={()=>setState(s=>({...s,mode:'select'}))}><MousePointer2 size={18}/><span>選ぶ</span></Button>
   <Button variant="ghost" aria-pressed={state.mode==='dissect'} className={state.mode==='dissect'?'active':''} onClick={()=>{setState(s=>({...s,mode:'dissect',isolate:false,focus:0,selected:[]}));setDetails(false);}}><EyeOff size={18}/><span>順に隠す</span></Button>
   <Button variant="ghost" aria-pressed={state.mode==='multi'} className={state.mode==='multi'?'active':''} onClick={()=>setState(s=>({...s,mode:'multi'}))}><ListChecks size={18}/><span>まとめて選ぶ</span></Button>
   <i/><Button variant="ghost" disabled={!history.past.length} onClick={undo}><Undo2 size={18}/><span>一つ戻す</span></Button>
   <Button variant="ghost" disabled={!history.future?.length} onClick={redo}><Redo2 size={18}/><span>やり直す</span></Button>
   <Button variant="ghost" disabled={!state.hidden?.length&&!state.faded?.length&&!state.isolate&&!state.focus&&!state.revealed?.length} onClick={restore}><RotateCcw size={18}/><span>表示を戻す</span></Button>
   <Button variant="ghost" onClick={reset}><Focus size={18}/><span>全身に戻す</span></Button>
  </div>
  <div className="atlas-mode-tip" role="status">{state.mode==='dissect'?'調べたいところが見えるまで、手前の部位をタップして隠します。':state.mode==='multi'?'部位をタップするたびに選択を追加・解除します。':'ドラッグで回転 · ピンチやスクロールで拡大 · 部位をタップして選択'}{(state.hidden?.length??0)>0&&<span>隠した部位：{state.hidden!.length}個</span>}</div>
  <footer className="studio-footer"><span>ドラッグで回転 <b>·</b> ピンチで拡大縮小 <b>·</b> タップで詳しく見る</span><Button variant="ghost" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}>出典・クレジット <ArrowUpRight size={12}/></Button></footer>
  {progress<100&&!error&&<div className="loading glass" role="status"><Activity size={18}/><div><strong>3D人体を準備中</strong><span>{progress}% · {atlas?.parts.length.toLocaleString()??'2,234'}個のパーツを読み込み中</span><div className="loading-track"><i style={{width:`${progress}%`}}/></div></div></div>}
  {error&&<div className="loading glass error" role="alert"><p>{error}</p><Button variant="ghost" onClick={()=>location.reload()}>再読み込み</Button></div>}
  <Sheet open={details&&selectedParts.length>0} modal={false} disablePointerDismissal onOpenChange={setDetails}><SheetContent initialFocus={detailTitle} className={`detail-sheet glass ${state.isolate?'is-isolated':''}`} showCloseButton={true}><div className="detail-header"><div className="detail-accent" style={{background:system?.color}}/><div className="eyebrow">{system?.name??'人体'}</div><SheetTitle ref={detailTitle} tabIndex={-1} className="structure-title">{selectedTitle}</SheetTitle></div><div className="detail-scroll" key={`${chosen?.id}-${state.isolate}`}><SheetDescription className="structure-description">{chosen&&selected?explanation(chosen.name,selected.system):''}</SheetDescription>{chosen&&!EXPLANATIONS[chosen.name.toLowerCase()]&&<span className="context-note">この器官が属する系統の説明です。</span>}{chosen&&anatomyNameHint(chosen.name)&&<p className="context-note">{anatomyNameHint(chosen.name)}</p>}{state.mode==='multi'&&state.selected.length>1&&<div className="atlas-selected-list">{selectedParts.slice(0,20).map(p=><button key={p.id} onClick={()=>setState(s=>toggleSelected(s,p.id))} aria-label={`${localizeAnatomyName(p.name)}の選択を解除`}>{localizeAnatomyName(p.name)}<X size={13}/></button>)}{selectedParts.length>20&&<small>ほか{selectedParts.length-20}個</small>}</div>}<div className="structure-meta"><span>選択中の3Dパーツ<strong>{state.selected.length.toLocaleString()}個</strong></span></div></div><div className="detail-actions atlas-selection-actions">
   <Button variant="ghost" onClick={()=>setState(s=>({...s,focus:(s.focus??0)+1,explode:0,rotate:false}))}><ZoomIn size={18}/>選択部位を拡大</Button>
   <Button variant="ghost" aria-pressed={selectionFaded} onClick={()=>setState(fadeSelected)}><ScanLine size={18}/>{selectionFaded?'不透明に戻す':'半透明にする'}</Button>
   <Button variant="ghost" onClick={()=>{setState(s=>hideParts(s));setDetails(false);}}><EyeOff size={18}/>選択部位を隠す</Button>
   <Button variant="ghost" aria-pressed={state.isolate} onClick={()=>setState(s=>({...s,isolate:!s.isolate,focus:0,explode:0,rotate:false}))}><Focus size={18}/>{state.isolate?'周囲の人体に戻す':'取り出して観察'}</Button>
   <Button variant="ghost" onClick={()=>atlas&&setState(s=>fadeSurroundings(atlas.parts,s))}><ScanLine size={18}/>周囲を半透明</Button>
   <Button variant="ghost" onClick={()=>atlas&&setState(s=>nearbyParts(atlas.parts,s))}><Network size={18}/>近くの構造も表示</Button>
   <Button variant="ghost" className="atlas-clear-selection" onClick={()=>{setState(s=>({...s,selected:[],selectionName:undefined,isolate:false,focus:0}));setDetails(false);}}>選択を解除</Button>
  </div></SheetContent></Sheet>
  <Sheet open={about} onOpenChange={setAbout}><SheetContent className="about-sheet glass"><div className="eyebrow">出典と収録範囲</div><SheetTitle className="structure-title">人体をひらく。</SheetTitle><SheetDescription>BodyParts3Dの成人男性モデルを、3Dで観察できます。</SheetDescription><div className="about-copy"><p><strong>成人男性 · BodyParts3D</strong><br/>2,234個の選択できる3Dメッシュと、3,432個の構造名を収録しています。</p><p>このモデルはすべての人の体や個人差を表すものではありません。1つの構造名が複数の3Dパーツをまとめている場合があります。</p><p>色と系統分けは観察しやすくするためのものです。Webで動かすために形状は簡略化されており、説明は学習用の一般的な情報です。診断や手術のための資料ではありません。</p><h3>出典</h3><p>BodyParts3D（ライフサイエンス統合データベースセンター）を、クリエイティブ・コモンズ「表示4.0 国際」の条件で使用しています。</p><a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer">データセットのライセンス <ArrowUpRight size={14}/></a><a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noreferrer">元の形状とメタデータ <ArrowUpRight size={14}/></a><a href="https://academic.oup.com/nar/article/37/suppl_1/D782/1000752" target="_blank" rel="noreferrer">元の研究論文 <ArrowUpRight size={14}/></a></div></SheetContent></Sheet>
 </main>;
}
