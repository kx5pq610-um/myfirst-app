/** A teaching timeline, not patient-specific pressure or flow measurements. */
export function heartCycle(phase:number){
 const p=((phase%1)+1)%1;
 const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
 const atrial=p<.12?smooth(p/.12):1-smooth((p-.12)/.12);
 const ventricular=p<.14?0:p<.35?smooth((p-.14)/.21):p<.45?1:1-smooth((p-.45)/.25);
 const avOpen=p<.14||p>=.56,outletOpen=p>=.20&&p<.48;
 const stage=p<.14?0:p<.20?1:p<.48?2:p<.56?3:4;
 return {phase:p,atrial,ventricular,avOpen,outletOpen,stage,
  text:['心房が縮む：心室へ血液が入る','ドッ：房室弁が閉じ、心室が縮み始める','左右の心室が縮む：肺と全身へ送り出す','クン：出口の弁が閉じ、心室がゆるむ','心室がふくらむ：血液が流れ込む'][stage]};
}
