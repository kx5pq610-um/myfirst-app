import {SYSTEMS,type Atlas,type CameraPose,type SceneState} from './anatomy.ts';
import {REGIONS} from './atlas-controls.ts';
export const VIEW_STORAGE_KEY='human-atlas-observation-views-v1';
export interface SavedView {id:string;name:string;state:SceneState;camera?:CameraPose}
export function validCamera(value:unknown):value is CameraPose{
 const v=value as CameraPose|undefined;
 return !!v&&[v.position,v.target].every(a=>Array.isArray(a)&&a.length===3&&a.every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<1000));
}
export function readSavedViews(raw:string,atlas:Atlas):SavedView[]{
 try{
  const list=JSON.parse(raw);if(!Array.isArray(list))return [];
  const ids=new Set(atlas.parts.map(p=>p.id)),systems=new Set(SYSTEMS.map(s=>s.id));
  const parts=(v:unknown)=>Array.isArray(v)?[...new Set(v.filter(id=>typeof id==='string'&&ids.has(id)))].slice(0,atlas.parts.length):[];
  return list.slice(0,8).flatMap(item=>{
   if(!item||typeof item.name!=='string'||!item.state||typeof item.id!=='string')return [];
   const s=item.state;
   const state:SceneState={visible:Array.isArray(s.visible)?s.visible.filter((id:string)=>systems.has(id as never)):[],selected:parts(s.selected),hidden:parts(s.hidden),faded:parts(s.faded),revealed:parts(s.revealed),selectionName:typeof s.selectionName==='string'?s.selectionName.slice(0,160):undefined,region:REGIONS.some(r=>r.id===s.region)?s.region:'all',quality:s.quality==='standard'?'standard':'light',labels:s.labels!==false,mode:'select',view:['front','side','back','three-quarter'].includes(s.view)?s.view:'three-quarter',isolate:!!s.isolate,rotate:false,reset:0,explode:0,focus:s.focus?1:0};
   return [{id:item.id.slice(0,80),name:item.name.slice(0,60),state,camera:validCamera(item.camera)?item.camera:undefined}];
  });
 }catch{return [];}
}
