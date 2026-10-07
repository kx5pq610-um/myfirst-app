import type {Part,SceneState} from './anatomy.ts';

export type History={current:SceneState;past:SceneState[]};
export type HistoryAction={type:'change';update:SceneState|((state:SceneState)=>SceneState)}|{type:'undo'};
export function sceneHistory(history:History,action:HistoryAction):History{
 if(action.type==='undo'){
  const previous=history.past.at(-1);
  return previous?{current:{...previous,reset:history.current.reset+1,focus:previous.focus?(history.current.focus??0)+1:0},past:history.past.slice(0,-1)}:history;
 }
 const next=typeof action.update==='function'?action.update(history.current):action.update;
 if(JSON.stringify(next)===JSON.stringify(history.current))return history;
 return {current:next,past:[...history.past.slice(-19),history.current]};
}
export function hideParts(state:SceneState,ids=state.selected):SceneState{
 return {...state,hidden:[...new Set([...(state.hidden??[]),...ids])],selected:[],selectionName:undefined,isolate:false,rotate:false};
}
export function fadeSelected(state:SceneState):SceneState{
 const selected=new Set(state.selected),faded=new Set(state.faded??[]);
 const clear=state.selected.every(id=>faded.has(id));
 for(const id of selected)clear?faded.delete(id):faded.add(id);
 return {...state,faded:[...faded]};
}
export function partVisibility(part:Pick<Part,'id'|'system'>,state:SceneState){
 if(state.hidden?.includes(part.id))return false;
 return state.isolate?state.selected.includes(part.id):state.visible.includes(part.system)||state.selected.includes(part.id);
}

/** One cached lookup per state change, rather than array scans for every animation frame. */
export function partStates(parts:Pick<Part,'id'|'system'>[],state:SceneState){
 const hidden=new Set(state.hidden),faded=new Set(state.faded),selected=new Set(state.selected),visible=new Set(state.visible);
 return parts.map(part=>({selected:selected.has(part.id),faded:faded.has(part.id),visible:!hidden.has(part.id)&&(state.isolate?selected.has(part.id):visible.has(part.system)||selected.has(part.id))}));
}
