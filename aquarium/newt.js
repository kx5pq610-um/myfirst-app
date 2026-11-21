'use strict';

const newtHabitat = (() => {
  const tanks = {
    small: { width: 30, depth: 20, height: 25 },
    medium: { width: 45, depth: 30, height: 30 },
    large: { width: 60, depth: 36, height: 36 },
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  const notes = { walk:'水底を歩く', wait:'水底で休む', rise:'泳いで浮上', breathe:'水面で息継ぎ',
    sink:'水底へ潜る', swim:'尾を振って泳ぐ', coast:'水中を滑る', feed:'餌を追う' };
  const motion = new WeakMap();
  const floor = z => 449 + 129 * z;
  const surface = level => 550 - 4.9 * level;

  function settings(saved) {
    const tank = Object.hasOwn(tanks, saved?.tank) ? saved.tank : 'medium';
    const level = Number.isFinite(saved?.level) ? clamp(Math.round(saved.level), 35, 90) : 85;
    return { tank, level };
  }

  function pose(f, config, waterline) {
    if (!f.space || !['x','z','lift'].every(axis => Number.isFinite(f.space[axis]))) {
      f.space = { x:clamp(f.x / 1000, .14, .86), z:clamp((f.y - 415) / 155, .14, .86), lift:0 };
    }
    const p = f.space;
    p.x = clamp(p.x,.14,.86);
    p.z = clamp(p.z,.08,.92);
    p.lift = clamp(p.lift,0,floor(p.z)-waterline-24);
    const m = motion.get(f);
    const zoom = .66 + .44 * p.z;
    const ground = floor(p.z);
    const step = m?.mode === 'walk' ? Math.abs(Math.sin(f.tail)) * 2.7 : 0;
    f.x = 500 + (p.x - .5) * 1000 * zoom;
    f.y = ground - p.lift - 10 - step;
    return { ground, x:f.x, y:f.y, scale:zoom*45/tanks[config.tank].width,
      yaw:m?.yaw ?? f.direction, pitch:m?.pitch ?? 0,
      opacity:.79+.21*p.z, mode:m?.mode ?? 'wait', age:m?.age ?? 0 };
  }

  function advance(f, dt, config, waterline, meal, shelter) {
    pose(f,config,waterline);
    const p = f.space, tank = tanks[config.tank];
    let m = motion.get(f);
    if (!m) {
      m = { mode:'wait', age:0, air:rand(5,15), wait:rand(.35,1.2), targetX:p.x,
        targetZ:p.z, vx:0, vz:0, vy:0, pitch:0, yaw:f.direction || 1 };
      motion.set(f,m);
    }
    function enter(mode) { m.mode=mode; m.age=0; }
    function wander() {
      m.targetX=clamp(p.x+rand(-.33,.33),.14,.86);
      m.targetZ=clamp(p.z+rand(-.53,.53),.08,.92);
    }
    m.age+=dt;
    m.air-=dt;
    const limit=floor(p.z)-waterline-24;
    if (m.air<=0 && m.mode!=='rise' && m.mode!=='breathe') { wander(); enter('rise'); }
    if (m.mode==='rise' && limit-p.lift<2) enter('breathe');
    if (m.mode==='breathe' && m.age>.65) { m.air=rand(24,48); wander(); enter('sink'); }
    if (m.mode==='sink' && p.lift<1) { m.wait=rand(.8,2.1); enter('wait'); }
    if (m.mode==='feed' && !meal) enter('sink');
    if (meal && !['rise','breathe'].includes(m.mode)) {
      if (m.mode!=='feed') enter('feed');
      m.targetZ=meal.y>450 ? clamp((meal.y-429)/139,.08,.92) : p.z;
      m.targetX=clamp(.5+(meal.x-500)/(1000*(.66+.44*m.targetZ)),.14,.86);
    }
    if (m.mode==='wait' && m.age>m.wait) {
      wander();
      if (shelter && Math.random()<.35) {
        m.targetZ=clamp((shelter.y-449)/129,.08,.92);
        m.targetX=clamp(.5+(shelter.x-500)/(1000*(.66+.44*m.targetZ)),.14,.86);
      }
      enter(Math.random()<.28 ? 'swim' : 'walk');
    }
    const dx=(m.targetX-p.x)*tank.width, dz=(m.targetZ-p.z)*tank.depth;
    const distance=Math.hypot(dx,dz);
    if (m.mode==='walk' && (distance<.65 || m.age>8)) { m.wait=rand(.5,2); enter('wait'); }
    if (m.mode==='swim' && (m.age>1.25 || distance<.5)) enter('coast');
    if (m.mode==='coast' && m.age>.8) enter('sink');

    const walking=m.mode==='walk', rising=m.mode==='rise', breathing=m.mode==='breathe';
    const powering=rising || m.mode==='swim' || m.mode==='feed';
    const pulse=Math.sin(f.tail);
    const speed=walking ? 2.45*(.72+.28*Math.abs(pulse)) :
      rising ? 4.1 : powering ? 7.2*(.8+.2*pulse) : m.mode==='sink' ? 1.75 : 0;
    const pace=Math.min(speed,distance*3) * (f.health<35?.55:1);
    const steering=1-Math.exp(-dt*(walking?7:m.mode==='coast'?2.5:4.5));
    m.vx+=(dx/(distance||1)*pace/tank.width-m.vx)*steering;
    m.vz+=(dz/(distance||1)*pace/tank.depth-m.vz)*steering;
    let targetLift=0;
    if (rising||breathing) targetLift=limit;
    else if (m.mode==='feed') targetLift=clamp(floor(p.z)-meal.y-10,0,limit);
    else if (m.mode==='swim'||m.mode==='coast') targetLift=Math.min(limit*.46,116);
    const verticalRate=(rising?111:powering?81:44)*30/tank.height;
    const vertical=clamp((targetLift-p.lift)*5,-verticalRate*.68,verticalRate);
    m.vy+=(vertical-m.vy)*steering;
    p.x+=m.vx*dt;
    p.z+=m.vz*dt;
    p.lift+=m.vy*dt;
    const vx=m.vx*tank.width, vz=m.vz*tank.depth;
    const heading=Math.hypot(vx,vz);
    if (heading>.32) m.yaw+=(vx/heading-m.yaw)*(1-Math.exp(-dt*7));
    if (Math.abs(m.yaw)>.16) f.direction=Math.sign(m.yaw);
    const angle=breathing ? -.52 : walking ? .035*pulse : clamp(-m.vy*.011,-.83,.54);
    m.pitch+=(angle-m.pitch)*(1-Math.exp(-dt*7));
    f.tail+=dt*(walking?heading*2.1:powering?10.7:m.mode==='coast'?2.4:0);
    pose(f,config,waterline);
    return { note:notes[m.mode], eat:m.mode==='feed' && Math.hypot(f.x-meal.x,f.y-meal.y)<25 };
  }

  return { tanks, settings, surface, pose, advance };
})();
