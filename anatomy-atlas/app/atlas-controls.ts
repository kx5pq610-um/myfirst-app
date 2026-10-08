import type {Part,SceneState,RegionId} from './anatomy.ts';

export type History={current:SceneState;past:SceneState[];future?:SceneState[]};
export type HistoryAction={type:'change';update:SceneState|((state:SceneState)=>SceneState)}|{type:'undo'}|{type:'redo'};
export function sceneHistory(history:History,action:HistoryAction):History{
 if(action.type==='undo'){
  const previous=history.past.at(-1);
  return previous?{current:{...previous,reset:history.current.reset+1,focus:previous.focus?(history.current.focus??0)+1:0},past:history.past.slice(0,-1),future:[history.current,...history.future??[]].slice(0,20)}:history;
 }
 if(action.type==='redo'){
  const next=history.future?.[0];
  return next?{current:{...next,reset:history.current.reset+1},past:[...history.past.slice(-19),history.current],future:history.future!.slice(1)}:history;
 }
 const next=typeof action.update==='function'?action.update(history.current):action.update;
 if(JSON.stringify(next)===JSON.stringify(history.current))return history;
 return {current:next,past:[...history.past.slice(-19),history.current],future:[]};
}
export function hideParts(state:SceneState,ids=state.selected):SceneState{
 return {...state,hidden:[...new Set([...(state.hidden??[]),...ids])],selected:[],selectionName:undefined,isolate:!!state.inspection,focus:0,keepCamera:(state.keepCamera??0)+1,rotate:false};
}
export function fadeSelected(state:SceneState):SceneState{
 const selected=new Set(state.selected),faded=new Set(state.faded??[]);
 const clear=state.selected.every(id=>faded.has(id));
 for(const id of selected)clear?faded.delete(id):faded.add(id);
 return {...state,faded:[...faded]};
}
export const REGIONS:{id:RegionId;name:string}[]=[{id:'all',name:'全身'},{id:'head',name:'頭・首'},{id:'chest',name:'胸'},{id:'abdomen',name:'腹'},{id:'pelvis',name:'骨盤'},{id:'arms',name:'腕・手'},{id:'legs',name:'脚・足'}];
export function inRegion(part:Pick<Part,'id'|'system'>&Partial<Pick<Part,'bounds'>>,region:RegionId='all'){
 if(region==='all'||!part.bounds)return true;
 const x=Math.abs((part.bounds[0][0]+part.bounds[1][0])/2),y=(part.bounds[0][1]+part.bounds[1][1])/2;
 const arm=x>.145&&y>.8;
 // Whole-surface meshes would conceal the localized view; smaller regions use their own parts.
 if(part.system==='integumentary'&&part.bounds[1][1]-part.bounds[0][1]>1)return false;
 return region==='arms'?arm:region==='legs'?y<.82:!arm&&(region==='head'?y>=1.43:region==='chest'?y>=1.19&&y<1.43:region==='abdomen'?y>=.98&&y<1.19:y>=.82&&y<.98);
}
export function partVisibility(part:Pick<Part,'id'|'system'>&Partial<Pick<Part,'bounds'>>,state:SceneState){
 if(state.hidden?.includes(part.id))return false;
 return state.isolate?(state.inspection?.elements??state.selected).includes(part.id):state.selected.includes(part.id)||((state.visible.includes(part.system)||!!state.revealed?.includes(part.id))&&inRegion(part,state.region));
}

/** One cached lookup per state change, rather than array scans for every animation frame. */
export function partStates(parts:(Pick<Part,'id'|'system'>&Partial<Pick<Part,'bounds'>>)[],state:SceneState){
 const hidden=new Set(state.hidden),faded=new Set(state.faded),selected=new Set(state.selected),isolated=new Set(state.inspection?.elements??state.selected),visible=new Set(state.visible),revealed=new Set(state.revealed);
 return parts.map(part=>({selected:selected.has(part.id),faded:faded.has(part.id),visible:!hidden.has(part.id)&&(state.isolate?isolated.has(part.id):selected.has(part.id)||((visible.has(part.system)||revealed.has(part.id))&&inRegion(part,state.region)))}));
}

export function toggleSelected(state:SceneState,id:string):SceneState{
 const selected=state.selected.includes(id)?state.selected.filter(p=>p!==id):[...state.selected,id];
 return {...state,selected,selectionName:undefined,hidden:state.hidden?.filter(p=>p!==id),rotate:false,focus:0};
}
export function fadeSurroundings(parts:Part[],state:SceneState):SceneState{
 const selected=new Set(state.selected),faded=new Set(state.faded);
 for(const p of parts)if(selected.has(p.id))faded.delete(p.id);else if(partVisibility(p,{...state,isolate:false}))faded.add(p.id);
 return {...state,isolate:false,faded:[...faded],focus:0,keepCamera:(state.keepCamera??0)+1};
}
export function nearbyParts(parts:Part[],state:SceneState):SceneState{
 const selected=parts.filter(p=>state.selected.includes(p.id));if(!selected.length)return state;
 const min=[0,1,2].map(i=>Math.min(...selected.map(p=>p.bounds[0][i]))),max=[0,1,2].map(i=>Math.max(...selected.map(p=>p.bounds[1][i])));
 const radius=.055;
 const neighbors=parts.filter(p=>p.system!=='integumentary'&&[0,1,2].every(i=>p.bounds[0][i]<=max[i]+radius&&p.bounds[1][i]>=min[i]-radius)).sort((a,b)=>{
  const distance=(p:Part)=>[0,1,2].reduce((sum,i)=>sum+Math.abs((p.bounds[0][i]+p.bounds[1][i]-min[i]-max[i])/2),0);
  return distance(a)-distance(b);
 }).slice(0,80).map(p=>p.id);
 return {...state,isolate:false,revealed:[...new Set([...state.revealed??[],...neighbors])],hidden:state.hidden?.filter(id=>!neighbors.includes(id)),focus:0,keepCamera:(state.keepCamera??0)+1};
}
