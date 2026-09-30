import {heartCycle} from './heart-cycle.ts';

export const HEART_OBSERVATION_STEPS=[
 {phase:.08,title:'① 心房が縮む'},
 {phase:.38,title:'② 心室が縮む'},
 {phase:.80,title:'③ 心室がゆるむ'},
] as const;

/** The phase key is based on the same clock as the 3D animation. */
export function heartObservationState(phase:number){
 const beat=heartCycle(phase);
 return {avOpen:beat.avOpen,outletOpen:beat.outletOpen,
  key:beat.stage===0?0:beat.stage===1||beat.stage===2?1:2};
}

export function heartFocusOpacity(partId:string,selected:string,enabled:boolean){
 const chambers=['FJ2424','FJ2423','FJ2425','FJ2422'];
 return enabled&&chambers.includes(selected)&&partId!==selected?.18:1;
}

/** Keep the heart view at the real valve/vessel waypoints; hide distant loops. */
export function heartFlowWindow(route:number,scope:'heart'|'all'):[number,number]|null{
 if(scope==='all')return [0,1];
 return ([[.75,1],[0,1],[0,.5],null,[2/3,1],[0,1],[0,.4],null] as ([number,number]|null)[])[route]??null;
}
