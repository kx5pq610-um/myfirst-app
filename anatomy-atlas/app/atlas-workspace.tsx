import {useEffect,useState} from 'react';
import {Bookmark,Save,Trash2,X} from 'lucide-react';
import {REGIONS} from './atlas-controls';
import {readSavedViews,VIEW_STORAGE_KEY,type SavedView} from './saved-views';
import {localizeAnatomyName,type Atlas,type CameraPose,type SceneState} from './anatomy';

export default function AtlasWorkspace({kind,atlas,state,camera,onChange,onLoad,onClose}:{kind:'views'|'tools';atlas:Atlas|null;state:SceneState;camera:()=>CameraPose|undefined;onChange:(update:(s:SceneState)=>SceneState)=>void;onLoad:(view:SavedView)=>void;onClose:()=>void}){
 const [views,setViews]=useState<SavedView[]>([]),[name,setName]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>{if(!atlas)return;try{setViews(readSavedViews(localStorage.getItem(VIEW_STORAGE_KEY)??'[]',atlas));}catch{setMessage('このブラウザーでは保存機能を利用できません。');}},[atlas]);
 const persist=(next:SavedView[])=>{try{localStorage.setItem(VIEW_STORAGE_KEY,JSON.stringify(next));setViews(next);return true;}catch{setMessage('保存できませんでした。ブラウザーの保存設定を確認してください。');return false;}};
 const save=()=>{
  if(views.length>=8){setMessage('保存は8件までです。不要な観察を削除してから保存してください。');return;}
  const label=name.trim()||(state.selectionName?localizeAnatomyName(state.selectionName):REGIONS.find(r=>r.id===(state.region??'all'))?.name??'全身');
  const view:SavedView={id:`view-${Date.now()}`,name:label.slice(0,60),state:{...state,inspectorOpen:undefined,cameraRequest:undefined,zoomRequest:undefined,rotate:false},camera:camera()};
  if(persist([...views,view])){setMessage(`「${view.name}」を保存しました。`);setName('');}
 };
 return <section className="atlas-workspace glass" aria-label={kind==='views'?'保存した観察':'観察の設定'}><div className="panel-heading"><strong>{kind==='views'?'保存した観察':'観察の設定'}</strong><button aria-label="観察パネルを閉じる" onClick={onClose}><X size={20}/></button></div>
 {kind==='views'?<><p>この端末に、表示する部位と視点を保存します。</p><label className="atlas-save-name">観察の名前<input maxLength={60} placeholder="例：心臓と肺のつながり" value={name} onChange={e=>setName(e.target.value)}/></label><button className="atlas-save-button" onClick={save} disabled={!atlas||views.length>=8}><Save size={17}/>今の観察を保存</button><div className="atlas-saved-list">{views.length===0&&<p>保存した観察はまだありません。</p>}{views.map(v=><div key={v.id}><button onClick={()=>onLoad(v)}><Bookmark size={15}/>{v.name}</button><button aria-label={`保存した観察「${v.name}」を削除`} onClick={()=>{if(persist(views.filter(w=>w.id!==v.id)))setMessage('保存した観察を削除しました。');}}><Trash2 size={16}/></button></div>)}</div></>:
 <><label className="atlas-setting"><input type="checkbox" checked={state.labels!==false} onChange={e=>onChange(s=>({...s,labels:e.target.checked}))}/>選択した部位の名前を3D画面に表示</label><label className="atlas-setting"><input type="checkbox" checked={state.rotate} onChange={e=>onChange(s=>({...s,rotate:e.target.checked}))}/>ゆっくり自動回転</label><label className="atlas-setting">描画<select value={state.quality??'light'} onChange={e=>onChange(s=>({...s,quality:e.target.value as 'light'|'standard'}))}><option value="light">軽量（Chromebook向け）</option><option value="standard">標準（輪郭を細かく）</option></select></label><p>軽量表示でも、収録する部位や操作は同じです。</p><h3>マウス・タッチ操作</h3><p>ドラッグ：回転<br/>右ドラッグ／2本指：位置を動かす<br/>スクロール／ピンチ：拡大・縮小</p><h3>キーボード操作</h3><dl className="atlas-shortcuts"><dt>Ctrl／⌘＋Z</dt><dd>一つ戻す</dd><dt>Ctrl／⌘＋Shift＋Z</dt><dd>やり直す</dd><dt>F</dt><dd>選択した部位を拡大</dd><dt>H</dt><dd>選択した部位を隠す</dd><dt>T</dt><dd>半透明を切り替える</dd><dt>Esc</dt><dd>パネルや選択を閉じる</dd></dl></>}
 {message&&<p role="status" className="atlas-workspace-status">{message}</p>}</section>;
}
