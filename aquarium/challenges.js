'use strict';

const paludariumChallenges = (() => {
  const stages = [
    { title:'岸辺のごはん', goal:'岸に置いた赤虫を、イモリが登って食べる。', prize:'段々石の岸', action:'岸に赤虫を置く' },
    { title:'湿った隠れ家', goal:'岸の湿り気を85%以上にして、コルクの下で休む姿を観察する。', prize:'水中の個別給餌', action:'霧吹き' },
    { title:'どちらもお腹いっぱい', goal:'別々のイモリ2匹に、水中で赤虫を食べてもらう。', prize:'飼育チャレンジ全クリア', action:'水中に赤虫を置く' },
  ];
  function load(saved) {
    const stage=Number.isInteger(saved?.stage)?Math.max(0,Math.min(stages.length,saved.stage)):0;
    const active=saved?.active===true&&stage<stages.length;
    return { stage, active,
      unlocked:Number.isInteger(saved?.unlocked)?Math.max(stage,Math.min(stages.length,saved.unlocked)):stage,
      fed:active&&stage===2&&Array.isArray(saved.fed)?[...new Set(saved.fed.filter(id=>typeof id==='string'))].slice(0,2):[],
    };
  }
  function progress(state,event) {
    if(!state.active)return null;
    if(state.stage===0&&event.kind!=='shoreMeal')return null;
    if(state.stage===1&&(event.kind!=='hide'||event.damp<85))return null;
    if(state.stage===2){
      if(event.kind!=='waterMeal'||state.fed.includes(event.id))return null;
      state.fed.push(event.id);
      if(state.fed.length<2)return { complete:false };
    }
    const title=stages[state.stage].title;
    const prize=stages[state.stage].prize;
    state.active=false;
    state.fed=[];
    state.stage++;
    const newReward=state.stage>state.unlocked;
    state.unlocked=Math.max(state.unlocked,state.stage);
    return { complete:true,title,prize:newReward?prize:null };
  }
  return { stages, load, progress };
})();
