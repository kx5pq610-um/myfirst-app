'use strict';

const newtShore = (() => {
  const styles = {
    moss: {
      top:139, base:448,
      ridge:[.206,.039,.043,.043,.046,.046,.053,.092,.191,.262,.344,.390,.443,.518,.578,.638,.670,.706,.741,.755,.865],
    },
    wood: {
      top:131, base:431,
      ridge:[.337,.004,.022,.141,.167,.167,.163,.237,.344,.430,.485,.541,.578,.641,.689,.730,.770,.811,.859,.900,.941],
    },
  };
  const events = {
    land: { label:'岸を登って上陸', detail:'斜面に足をかけ、水から陸へ上がる。' },
    hide: { label:'コルクの下でひと休み', detail:'湿った隠れ家に入り、入口から顔を出す。' },
    meal: { label:'岸の餌を見つけた', detail:'岸に置いた赤虫まで登って食べる。' },
  };
  const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
  const zoom = z => .66 + .44*z;
  const screenX = (x,z) => 500 + (x-.5)*1000*zoom(z);
  const tankX = (x,z) => .5 + (x-500)/(1000*zoom(z));
  const floor = z => 449 + 129*z;
  const travelZ = .52;

  function settings(saved) {
    return {
      style:saved?.style==='none'||Object.hasOwn(styles,saved?.style)?saved.style:'moss',
      side:saved?.side==='right'?'right':'left',
      width:Number.isFinite(saved?.width)?clamp(Math.round(saved.width),34,52):43,
      hide:saved?.hide!==false,
    };
  }

  function build(options, waterline) {
    const style=styles[options.style];
    if (!style) return null;
    const width=options.width*10;
    const height=style.base-style.top;
    const direction=options.side==='right'?-1:1;
    const edge=direction===1?0:1000;
    const atX=u=>edge+direction*u*width;
    const fromX=x=>(x-edge)*direction/width;
    function atY(u) {
      const i=clamp(u,0,1)*(style.ridge.length-1);
      const a=style.ridge[Math.floor(i)], b=style.ridge[Math.ceil(i)];
      return style.top+height*(a+(b-a)*(i%1));
    }
    // The navigation surface is sampled from the cutout's upper silhouette.
    let entry=.63;
    while (entry<.98 && atY(entry)<waterline+44) entry+=.012;
    const terrace=.29;
    const dry=atY(terrace)<waterline-13;
    const foodSite=atY(.39)<waterline-16?.39:.30;
    return {
      key:[options.style,options.side,options.width].join(),
      style:options.style, direction, edge, width, top:style.top, height, waterline,
      z:travelZ, atX, fromX, atY, entry, terrace, dry,
      hide:dry&&options.hide ? {x:atX(.27),y:atY(.27)+10,width:Math.min(140,width*.34)}:null,
      bait:dry ? {x:atX(foodSite),y:atY(foodSite)-5}:null,
    };
  }

  function move(current,target,step) {
    return current+clamp(target-current,-step,step);
  }

  function leave(m) {
    m.visit=null;
    m.mode='sink';
    m.age=0;
    m.air=20+Math.random()*20;
    m.shoreIn=14+Math.random()*20;
  }

  function advance(f,m,dt,tank,shore,bait,damp,blocked) {
    let visit=m.visit;
    if (visit && (!shore?.dry||visit.key!==shore.key)) {
      leave(m);
      return null;
    }
    m.shoreIn=Math.max(0,m.shoreIn-dt);
    if (!visit && !blocked && shore?.dry && (bait||m.shoreIn===0)) {
      visit=m.visit={key:shore.key, phase:'approach', age:0, u:shore.entry, dry:false};
    }
    if (!visit) return null;
    if (visit.phase==='hide'&&!shore.hide) { visit.phase='land';visit.age=0; }
    const p=f.space;
    visit.age+=dt;
    const {entry,terrace,z,direction,atX,atY,waterline}=shore;
    const grip=visit.phase!=='approach';
    const contact=atY(entry);
    let dx=0, dy=0, event=null, eat=false, walking=false;
    if (!grip) {
      const ordinaryLimit=floor(z)-waterline-24;
      const targetLift=clamp(floor(z)-contact+5,0,ordinaryLimit);
      const x=tankX(atX(entry),z);
      const oldX=screenX(p.x,p.z);
      p.x=move(p.x,x,5.5/tank.width*dt);
      p.z=move(p.z,z,3.6/tank.depth*dt);
      const oldLift=p.lift;
      p.lift=move(p.lift,targetLift,106*30/tank.height*dt);
      dx=screenX(p.x,p.z)-oldX;
      dy=oldLift-p.lift;
      f.tail+=dt*(8+2*Math.sin(f.tail*.5));
      if (Math.abs(p.x-x)<.013 && Math.abs(p.z-z)<.027 && Math.abs(p.lift-targetLift)<5) {
        visit.phase='climb';visit.age=0;
      }
    } else {
      let target=terrace;
      if (visit.phase==='return') target=entry;
      else if (bait && visit.phase!=='hide') target=shore.fromX(bait.x);
      else if (shore.hide) target=shore.fromX(shore.hide.x);
      const before=visit.u;
      const pace=(visit.phase==='climb'?2.3:visit.phase==='return'?2.8:1.7) *
        (1+.26*Math.sin(f.tail*2));
      if (visit.phase!=='hide') visit.u=move(before,target,pace/tank.width*dt*1000*zoom(z)/shore.width);
      const y=atY(visit.u);
      p.z=z;
      p.x=tankX(atX(visit.u),z);
      p.lift=floor(z)-y;
      dx=direction*(visit.u-before)*shore.width;
      dy=y-atY(before);
      walking=Math.abs(dx)>.005;
      if (walking) f.tail+=Math.abs(dx)*.084;
      if (!visit.dry && y<waterline-12 && visit.phase==='climb') {
        visit.dry=true;event='land';
      }
      if (visit.phase==='climb' && Math.abs(target-visit.u)<.009) {
        visit.phase='land';visit.age=0;
      }
      if (visit.phase==='land' && bait && Math.abs(visit.u-target)<.014) {
        eat=true;event='meal';visit.age=0;
      } else if (visit.phase==='land' && shore.hide && Math.abs(visit.u-target)<.009) {
        visit.phase='hide';visit.age=0;event='hide';
      } else if (visit.phase==='land' && visit.age>3) {
        visit.phase='return';visit.age=0;
      }
      if (visit.phase==='hide' && visit.age>2.3+damp*.06) {
        visit.phase='return';visit.age=0;
      }
      if (visit.phase==='return' && Math.abs(visit.u-entry)<.009) {
        leave(m);
      }
    }
    const facing=Math.abs(dx)>.04?Math.sign(dx):-direction;
    if (walking || Math.abs(dx)>.04 || visit.phase==='climb') {
      m.yaw=move(m.yaw,facing,dt*5);
      if(Math.abs(m.yaw)>.17) f.direction=Math.sign(m.yaw);
    }
    const pitch=walking ? clamp(Math.atan2(dy,Math.max(.04,Math.abs(dx)*.76)),-.89,.73) :
      grip ? 0 : clamp(dy/(Math.max(dt,.001)*105),-1.05,.57);
    m.pitch=move(m.pitch,pitch,dt*3.6);
    m.vx=0;m.vz=0;m.vy=0;
    const notes={approach:'岸へ泳ぐ',climb:'斜面に足をかける',land:'陸場を歩く',hide:'隠れ家から顔を出す',return:'斜面を下りる'};
    return { note:notes[visit.phase], event, eatBank:eat };
  }

  return { events, settings, build, advance, floor, screenX };
})();
