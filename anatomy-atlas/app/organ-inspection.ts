import type {Concept,SceneState} from './anatomy.ts';

export function inspectOrgan(state:SceneState,organ:Concept):SceneState{
 return {...state,inspection:{name:organ.name,elements:organ.elements},selectionLevel:'part',selected:organ.elements,selectionName:organ.name,isolate:true,explode:0,mode:'select',rotate:false,focus:(state.focus??0)+1};
}
export function selectOrganPart(state:SceneState,id:string,name:string):SceneState{
 if(state.inspection&&!state.inspection.elements.includes(id))return state;
 return {...state,selected:[id],selectionName:name,hidden:state.hidden?.filter(p=>p!==id),rotate:false,keepCamera:(state.keepCamera??0)+1};
}
export function returnToOrgan(state:SceneState):SceneState{
 const organ=state.inspection;if(!organ)return {...state,selectionLevel:'organ'};
 return {...state,inspection:undefined,selectionLevel:'organ',selected:organ.elements,selectionName:organ.name,hidden:state.hidden?.filter(id=>!organ.elements.includes(id)),keepCamera:(state.keepCamera??0)+1};
}
