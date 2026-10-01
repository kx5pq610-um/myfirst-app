const labs=[
{id:'cell',unit:'生命',icon:'🔬',title:'観察1 細胞分裂をするときの細胞の変化',page:'p.13',desc:'タマネギなどの根の先端を処理し、染色・押しつぶしをして、分裂中の細胞を顕微鏡で観察する。'},
{id:'sunspot',unit:'地球',icon:'☀️',title:'観察1 太陽の表面の観察',page:'p.51',desc:'天体望遠鏡と太陽投影板を使い、太陽像を投影して黒点の位置や形を観察する。'},
{id:'sunpath',unit:'地球',icon:'🌞',title:'観測1 太陽の1日の動き',page:'p.67',desc:'透明半球上で、ペン先の影が中心に重なる位置を約1時間ごとに記録する。'},
{id:'starpath',unit:'地球',icon:'✨',title:'観測2 星の1日の動き',page:'p.75',desc:'東西南北の空を時間をあけて撮影し、星の位置の変化を比較する。'},
{id:'venus',unit:'地球',icon:'🪐',title:'探Q実習 金星の見え方のモデル',page:'p.88–89',desc:'太陽・地球・金星の位置関係をモデルで変え、金星の形と見かけの大きさを確かめる。'},
{id:'conduct',unit:'物質',icon:'⚡',title:'実験1 電流が流れる水溶液',page:'p.107',desc:'蒸留水や塩酸、砂糖水などに電極を入れ、モーターと電流計で電流が流れるかを調べる。'},
{id:'hcl',unit:'物質',icon:'🧪',title:'実験2 うすい塩酸の電気分解',page:'p.111',desc:'専用の電気分解装置でうすい塩酸に電流を流し、両極にたまる気体の性質を調べる。'},
{id:'metals',unit:'物質',icon:'🔩',title:'探Q実験3 金属のイオンへのなりやすさ',page:'p.125–127',desc:'銅・亜鉛・マグネシウムと、それぞれの硫酸塩水溶液を組み合わせて変化を比較する。'},
{id:'daniel',unit:'物質',icon:'🔋',title:'実験4 ダニエル電池の製作',page:'p.132–133',desc:'亜鉛板・銅板、硫酸亜鉛水溶液・硫酸銅水溶液、セロハンを使って電池をつくる。'},
{id:'acidprop',unit:'物質',icon:'🧫',title:'実験5 酸性やアルカリ性の水溶液に共通する性質',page:'p.142–143',desc:'複数の酸性・アルカリ性水溶液をBTB、フェノールフタレイン、pH試験紙などで比較する。'},
{id:'ionmove',unit:'物質',icon:'↔️',title:'実験6 酸性やアルカリ性を決めているもの',page:'p.147',desc:'硝酸カリウムで湿らせたpH試験紙に電圧をかけ、塩酸や水酸化ナトリウムの色の広がりを観察する。'},
{id:'neutral',unit:'物質',icon:'⚗️',title:'実験7 酸とアルカリを混ぜたときの変化',page:'p.153',desc:'水酸化ナトリウム水溶液に塩酸を少しずつ加え、フェノールフタレインの色が消えた液を蒸発させる。'},
{id:'buoyancy',unit:'エネルギー',icon:'⚖️',title:'実験1 水中の物体にはたらく力',page:'p.175',desc:'ばねばかりにつるしたおもりを半分・浅く・深く沈め、示す値の変化を調べる。'},
{id:'vectors',unit:'エネルギー',icon:'📐',title:'実験2 角度をもってはたらく2力の合成',page:'p.180',desc:'リングを2つのばねばかりで引き、2力の大きさ・向きと合力の関係を調べる。'},
{id:'cartforce',unit:'エネルギー',icon:'🛒',title:'実験3 台車に一定の力がはたらき続けるときの運動',page:'p.191',desc:'力学台車をおもりで引き、記録タイマーのテープから運動の変化を調べる。'},
{id:'incline',unit:'エネルギー',icon:'📈',title:'探Q実験4 斜面上での台車の運動',page:'p.198',desc:'斜面の角度を変え、記録タイマーで台車の速さの変化を比較する。'},
{id:'work',unit:'エネルギー',icon:'⚙️',title:'実験5 道具を使った仕事',page:'p.207',desc:'同じ物体を10 cm上げるとき、直接・動滑車・斜面で力と距離を比べる。'},
{id:'potential',unit:'エネルギー',icon:'🔨',title:'実験6 物体のもつエネルギーと高さや質量の関係',page:'p.211',desc:'落下するおもりでくいを打ち、落とす高さや質量とくいの移動量の関係を調べる。'}
];
const el=s=>document.querySelector(s),grid=el('#labGrid'),area=el('#labArea'),stage=el('#stage'),controls=el('#controls'),statusEl=el('#status');
let cleanup=()=>{}, currentUnit='すべて';
function setStatus(t,on=false){statusEl.textContent=t;statusEl.classList.toggle('running',on)}
function renderGrid(){grid.innerHTML='';labs.filter(l=>currentUnit==='すべて'||l.unit===currentUnit).forEach(l=>{const c=document.createElement('article');c.className='lab-card';c.innerHTML=`<div><div class="top"><span class="icon">${l.icon}</span><span class="page">教科書 ${l.page}</span></div><h3>${l.title}</h3><p>${l.desc}</p></div><div class="unit">${l.unit}</div>`;c.onclick=()=>openLab(l);grid.append(c)})}
['すべて','生命','地球','物質','エネルギー'].forEach(u=>{const b=document.createElement('button');b.className='filter'+(u==='すべて'?' active':'');b.textContent=u;b.onclick=()=>{currentUnit=u;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderGrid()};el('#filters').append(b)});renderGrid();
el('#backBtn').onclick=()=>{cleanup();area.classList.add('hidden');el('#labs').scrollIntoView({behavior:'smooth'});history.replaceState(null,'',location.pathname)};
function openLab(l){cleanup();stage.innerHTML='';controls.innerHTML='';el('#labTitle').textContent=l.title;el('#labMeta').textContent=`${l.unit} · 啓林館 ${l.page}`;el('#labDesc').textContent=l.desc;area.classList.remove('hidden');setStatus('準備');cleanup=(renderers[l.id]||(()=>()=>{}))();history.replaceState(null,'','#'+l.id);setTimeout(()=>area.scrollIntoView({behavior:'smooth'}),20)}
function ctl(title,html){return `<div class="control">${title?`<div class="label"><span>${title}</span></div>`:''}${html}</div>`}
function range(id,label,min,max,step,val,unit=''){return `<div class="control"><div class="label"><span>${label}</span><span class="val" id="${id}Val">${val}${unit}</span></div><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></div>`}
function select(id,label,opts){return `<div class="control"><div class="label"><span>${label}</span></div><select id="${id}">${opts.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('')}</select></div>`}
function btn(id,label,cls=''){return `<button id="${id}" class="btn ${cls}">${label}</button>`}
function buttons(a,b){return `<div class="btn-row">${a}${b}</div>`}
function meter(label,id,val){return `<div class="meter"><span>${label}</span><b id="${id}">${val}</b></div>`}
function canvas(){stage.innerHTML='<canvas></canvas>';const c=stage.querySelector('canvas'),ctx=c.getContext('2d');function resize(){const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)}resize();window.addEventListener('resize',resize);return{c,ctx,off:()=>window.removeEventListener('resize',resize)}}
const W=c=>c.clientWidth,H=c=>c.clientHeight;
function txt(ctx,t,x,y,s=16,col='#eef7ff',align='left',weight=700){ctx.fillStyle=col;ctx.font=`${weight} ${s}px system-ui`;ctx.textAlign=align;ctx.fillText(t,x,y)}
function line(ctx,x1,y1,x2,y2,col='rgba(255,255,255,.55)',wid=2){ctx.strokeStyle=col;ctx.lineWidth=wid;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function rr(ctx,x,y,w,h,r=10,fill=null,stroke=null){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function circ(ctx,x,y,r,fill,stroke=null){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function beaker(ctx,x,y,w,h,liquid='#5a9bd533'){ctx.strokeStyle='rgba(210,235,255,.6)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+8,y+h);ctx.lineTo(x+w-8,y+h);ctx.lineTo(x+w,y);ctx.stroke();ctx.fillStyle=liquid;ctx.fillRect(x+9,y+h*.35,w-18,h*.64)}
function meterDial(ctx,x,y,r,value,label){ctx.save();ctx.translate(x,y);ctx.fillStyle='#e7e2d4';ctx.strokeStyle='#8594a2';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();for(let i=0;i<=10;i++){const a=Math.PI*.75+i*Math.PI*1.5/10;line(ctx,Math.cos(a)*(r-8),Math.sin(a)*(r-8),Math.cos(a)*(r-2),Math.sin(a)*(r-2),'#31404c',1)}const ang=Math.PI*.75+Math.max(0,Math.min(1,value))*Math.PI*1.5;line(ctx,0,0,Math.cos(ang)*(r-13),Math.sin(ang)*(r-13),'#d64545',2);txt(ctx,label,0,r*.52,11,'#28333c','center',800);ctx.restore()}
function hit(c,e,x,y,w,h){const r=c.getBoundingClientRect(),px=(e.clientX??e.touches?.[0]?.clientX)-r.left,py=(e.clientY??e.touches?.[0]?.clientY)-r.top;return px>=x&&px<=x+w&&py>=y&&py<=y+h}
const renderers={
cell(){let step=0,mag=100,focus=35,sx=50,sy=50;controls.innerHTML=ctl('標本づくり',`<div class="steps">${['根の先端を3〜5 mm切る','5%塩酸を1滴・3〜5分','酢酸オルセインで約5分染色','カバーガラスをかけて押しつぶす'].map((s,i)=>`<div class="step" id="st${i}">${i+1}. ${s}</div>`).join('')}</div><div style="height:8px"></div>${btn('nextStep','次の操作')}`)+select('mag','倍率',[[100,'100〜150倍'],[400,'400〜600倍']])+range('focus','ピント',0,100,1,35,'')+ctl('',`<div class="note">標本完成後、視野をドラッグして分裂中の細胞を探します。</div>`);const {c,ctx,off}=canvas();let drag=false,last={x:0,y:0};function draw(){const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);if(step<4){txt(ctx,'プレパラート作製',w/2,70,24,'#eef7ff','center');const y=h*.46;line(ctx,w*.18,y,w*.82,y,'#92a8bb',8);rr(ctx,w*.35,y-28,w*.3,56,12,'rgba(216,177,145,.55)','#e9c09e');if(step>=1){circ(ctx,w*.50,y-5,24,'rgba(225,225,210,.5)');txt(ctx,'HCl',w*.5,y+3,13,'#07111f','center')}if(step>=2){ctx.fillStyle='rgba(126,52,110,.55)';ctx.fillRect(w*.35,y-28,w*.3,56)}if(step>=3){ctx.strokeStyle='rgba(210,235,255,.8)';ctx.lineWidth=4;ctx.strokeRect(w*.32,y-50,w*.36,100);txt(ctx,'押しつぶして薄くする',w/2,y+100,15,'#9fb4c9','center')}txt(ctx,['根の先端を切り取る','塩酸で細胞をばらばらにしやすくする','染色して核・染色体を見やすくする','標本完成 → 顕微鏡へ'][step],w/2,h*.78,17,'#64e2c4','center')}else{const r=Math.min(w,h)*.36,cx=w/2,cy=h/2;ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.clip();ctx.fillStyle='#efd7cb';ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.filter=`blur(${Math.abs(focus-62)/10}px)`;const cell=mag==400?86:42,ox=(sx-50)*2,oy=(sy-50)*2;for(let yy=cy-r-cell;yy<cy+r+cell;yy+=cell*.72){for(let xx=cx-r-cell;xx<cx+r+cell;xx+=cell){const X=xx+(Math.floor(yy/cell)%2)*cell*.25+ox%cell,Y=yy+oy%cell;ctx.strokeStyle='rgba(130,80,90,.45)';ctx.lineWidth=1.5;ctx.strokeRect(X,Y,cell*.9,cell*.62);let seed=Math.abs((Math.floor((X-ox)/cell)*37+Math.floor((Y-oy)/cell)*19)%17);if(seed<4){ctx.strokeStyle='#54204e';ctx.lineWidth=mag==400?3:2;for(let k=0;k<3;k++)line(ctx,X+cell*(.28+k*.12),Y+cell*.18,X+cell*(.58-k*.07),Y+cell*.46,'#54204e',mag==400?3:2)}else{circ(ctx,X+cell*.45,Y+cell*.31,cell*.10,'rgba(99,51,91,.5)')}}}ctx.restore();ctx.strokeStyle='#d8e8f5';ctx.lineWidth=7;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();txt(ctx,`${mag}×`,w*.84,h*.86,18,'#64e2c4','center')}}
nextStep.onclick=()=>{step=Math.min(4,step+1);document.querySelectorAll('.step').forEach((x,i)=>x.classList.toggle('done',i<step));if(step===4){nextStep.disabled=true;setStatus('観察中',true)}draw()};el('#mag').onchange=()=>{mag=+el('#mag').value;draw()};el('#focus').oninput=()=>{focus=+el('#focus').value;el('#focusVal').textContent=focus;draw()};c.onpointerdown=e=>{if(step<4)return;drag=true;last={x:e.clientX,y:e.clientY};c.setPointerCapture(e.pointerId)};c.onpointermove=e=>{if(!drag)return;sx=Math.max(0,Math.min(100,sx+(e.clientX-last.x)*.25));sy=Math.max(0,Math.min(100,sy+(e.clientY-last.y)*.25));last={x:e.clientX,y:e.clientY};draw()};c.onpointerup=()=>drag=false;draw();return off},
sunspot(){let focus=35,dist=35,day=0;controls.innerHTML=range('dist','投影板までの距離',20,70,1,35,' cm')+range('sfocus','ピント',0,100,1,35,'')+range('day','観察日',0,7,1,0,' 日後')+ctl('',`<div class="note danger">太陽を望遠鏡で直接見ない。太陽像を投影板に映して観察します。</div>`);const {c,ctx,off}=canvas();function draw(){const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);txt(ctx,'天体望遠鏡',w*.2,80,17,'#9fb4c9','center');line(ctx,w*.1,h*.58,w*.42,h*.34,'#aab5c0',26);line(ctx,w*.25,h*.5,w*.16,h*.82,'#7d8a96',7);line(ctx,w*.25,h*.5,w*.34,h*.82,'#7d8a96',7);rr(ctx,w*.57,h*.20,w*.30,h*.58,12,'#eef2e8','#cbd9e4');const cx=w*.72,cy=h*.48,r=Math.min(w,h)*(.16+dist/700);ctx.save();ctx.filter=`blur(${Math.abs(focus-58)/10}px)`;circ(ctx,cx,cy,r,'#fff0a5','#f8d45b');for(let i=0;i<5;i++){const x=cx-r*.65+((day*18+i*43)%(r*1.3)),y=cy-r*.42+(i*37%(r*.84));circ(ctx,x,y,4+(i%3)*2,'#4a4338')}ctx.restore();txt(ctx,'太陽投影板',cx,h*.83,15,'#9fb4c9','center');txt(ctx,'像の大きさを合わせ、黒点を記録',w/2,h*.93,16,'#64e2c4','center')}['dist','sfocus','day'].forEach(id=>el('#'+id).oninput=()=>{if(id==='dist'){dist=+el('#dist').value;el('#distVal').textContent=dist+' cm'}if(id==='sfocus'){focus=+el('#sfocus').value;el('#sfocusVal').textContent=focus}if(id==='day'){day=+el('#day').value;el('#dayVal').textContent=day+' 日後'}draw()});draw();return off},
sunpath(){let hour=8,marks=[];controls.innerHTML=range('hour','時刻',7,17,.5,8,'時')+ctl('',buttons(btn('mark','この時刻を記録'),btn('clear','記録を消す','secondary')))+ctl('',`<div class="note">実際の観測と同じように、ペン先の影が透明半球の中心 X に重なる位置を記録します。</div>`);const {c,ctx,off}=canvas();function sunpos(t){const f=(t-6)/12,az=90+180*f,alt=Math.max(0,55*Math.sin(Math.PI*f));return{az,alt}}function project(p,w,h){const cx=w/2,cy=h*.72,r=Math.min(w*.38,h*.47);const a=(p.az-180)*Math.PI/180,rad=r*(1-p.alt/100*.75);return{x:cx+Math.sin(a)*rad,y:cy-Math.cos(a)*rad*.42-p.alt/90*r*.62,cx,cy,r}}function draw(){const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);const {cx,cy,r}=project(sunpos(hour),w,h);ctx.strokeStyle='rgba(210,235,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy,r,r*.43,0,Math.PI,0,true);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,0);ctx.stroke();circ(ctx,cx,cy,5,'#eef7ff');txt(ctx,'X',cx+12,cy+5,13,'#eef7ff');['東','南','西'].forEach((t,i)=>txt(ctx,t,[cx-r,cx,cx+r][i],cy+34,15,'#9fb4c9','center'));marks.forEach(m=>{const q=project(sunpos(m),w,h);circ(ctx,q.x,q.y,5,'#ffd36a');txt(ctx,String(m),q.x,q.y-10,11,'#ffd36a','center')});const q=project(sunpos(hour),w,h);circ(ctx,q.x,q.y,16,'#ffd36a');line(ctx,q.x,q.y,q.cx,q.cy,'rgba(255,211,106,.4)',1);txt(ctx,'ペン先',q.x,q.y-25,12,'#eef7ff','center');txt(ctx,'影 → X',q.cx,q.cy-18,12,'#64e2c4','center')}el('#hour').oninput=()=>{hour=+el('#hour').value;el('#hourVal').textContent=hour+'時';draw()};mark.onclick=()=>{if(!marks.includes(hour))marks.push(hour);marks.sort((a,b)=>a-b);setStatus(`${marks.length}点記録`,true);draw()};clear.onclick=()=>{marks=[];setStatus('準備');draw()};draw();return off},
starpath(){let dir='南',mins=0,shots=[];controls.innerHTML=select('dir','観察する空',[['東','東'],['南','南'],['西','西'],['北','北']])+range('mins','経過時間',0,120,30,0,'分')+ctl('',buttons(btn('shot','撮影する'),btn('starClear','撮影を消す','secondary')))+ctl('',`<div class="note">地上の景色を入れて同じ方向を撮影し、0分・30分・60分などの写真を比較します。</div>`);const {c,ctx,off}=canvas();const base=Array.from({length:25},(_,i)=>({x:(i*47%91)/100,y:(i*29%53)/100+.08}));function shift(p,m){const d=m/4; if(dir==='南')return{x:p.x+d/100,y:p.y};if(dir==='北'){const a=Math.atan2(p.y-.45,p.x-.5)+m*Math.PI/720,r=Math.hypot(p.x-.5,p.y-.45);return{x:.5+r*Math.cos(a),y:.45+r*Math.sin(a)}}if(dir==='東')return{x:p.x,y:p.y-d/100};return{x:p.x,y:p.y+d/100}}function draw(){const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#020617');g.addColorStop(.7,'#0b1b38');g.addColorStop(1,'#17283b');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle='#081018';ctx.fillRect(0,h*.78,w,h*.22);for(let i=0;i<8;i++){ctx.fillStyle='#111a21';ctx.fillRect(i*w/8,h*.69+(i%3)*20,w/10,h*.12)}const times=[...shots,mins];times.forEach((m,j)=>base.forEach((p,i)=>{const q=shift(p,m);if(q.x<0||q.x>1||q.y<0||q.y>.74)return;circ(ctx,q.x*w,q.y*h,2+(i%3===0),j===times.length-1?'#fff8c4':'rgba(116,170,255,.5)')}));txt(ctx,`${dir}の空　${mins}分後`,w/2,42,18,'#eef7ff','center');txt(ctx,'地上の景色を基準に位置を比べる',w/2,h*.91,15,'#9fb4c9','center')}dir.onchange=()=>{dir=el('#dir').value;shots=[];draw()};el('#mins').oninput=()=>{mins=+el('#mins').value;el('#minsVal').textContent=mins+'分';draw()};shot.onclick=()=>{if(!shots.includes(mins))shots.push(mins);setStatus(`${shots.length}枚撮影`,true);draw()};starClear.onclick=()=>{shots=[];setStatus('準備');draw()};draw();return off},
venus(){let pos=0;controls.innerHTML=range('vpos','金星の位置',0,7,1,0,'')+ctl('',`<div class="note">8か所に金星モデルを置き、地球側から見た明るい面と見かけの大きさを比べます。</div>`)+`<div class="readout">${meter('見える形','phaseR','—')}${meter('見かけの大きさ','sizeR','—')}</div>`;const {c,ctx,off}=canvas();function calc(){const theta=pos*Math.PI/4,V={x:.58*Math.cos(theta),y:.58*Math.sin(theta)},E={x:1,y:0};const sv={x:-V.x,y:-V.y},ev={x:E.x-V.x,y:E.y-V.y};const dot=(sv.x*ev.x+sv.y*ev.y)/(Math.hypot(sv.x,sv.y)*Math.hypot(ev.x,ev.y));const alpha=Math.acos(Math.max(-1,Math.min(1,dot))),illum=(1+Math.cos(alpha))/2,dist=Math.hypot(ev.x,ev.y);return{V,illum,dist}}function drawPhase(x,y,r,illum){circ(ctx,x,y,r,'#222');ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.clip();ctx.fillStyle='#fff4b4';const ww=2*r*Math.max(.03,illum);ctx.beginPath();ctx.ellipse(x-r+ww/2,y,ww/2,r,0,0,7);ctx.fill();ctx.restore();ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke()}function draw(){const w=W(c),h=H(c),cx=w*.38,cy=h*.47,R=Math.min(w,h)*.27,{V,illum,dist}=calc();ctx.clearRect(0,0,w,h);circ(ctx,cx,cy,28,'#ffd36a');ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,R*.58,0,7);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();const ex=cx+R,ey=cy;circ(ctx,ex,ey,14,'#72a7ff');txt(ctx,'地球',ex,ey+35,13,'#9fb4c9','center');const vx=cx+V.x*R,vy=cy+V.y*R;circ(ctx,vx,vy,10,'#fff4b4');txt(ctx,'金星',vx,vy-17,12,'#eef7ff','center');const sr=Math.max(16,45/dist);drawPhase(w*.80,h*.44,sr,illum);txt(ctx,'地球から見た金星',w*.80,h*.24,15,'#9fb4c9','center');phaseR.textContent=illum>.78?'丸く見える':illum>.45?'半月に近い':illum>.12?'三日月状':'ほぼ新月';sizeR.textContent=dist<.7?'大きい':dist<1.2?'中くらい':'小さい'}el('#vpos').oninput=()=>{pos=+el('#vpos').value;el('#vposVal').textContent=`位置 ${pos+1}`;draw()};el('#vposVal').textContent='位置 1';draw();return off},
conduct(){const sols={water:{n:'蒸留水',cond:0,change:'変化なし'},hcl:{n:'2.5%塩酸',cond:.9,change:'電極付近から気体'},naoh:{n:'2.5%水酸化ナトリウム水溶液',cond:.85,change:'電極付近から気体'},sugar:{n:'2.5%砂糖水',cond:0,change:'変化なし'},eth:{n:'エタノールと水の混合物',cond:0,change:'変化なし'},cucl:{n:'2.5%塩化銅水溶液',cond:.8,change:'電極の色変化・気体'}};let key='water',down=false,power=false,rinsed=true,contam=0;controls.innerHTML=select('sol','水溶液',Object.entries(sols).map(([k,v])=>[k,v.n]))+ctl('',buttons(btn('lower','電極を入れる'),btn('rinse','蒸留水で洗う','secondary')))+ctl('',btn('power','電源ON'))+`<div class="readout">${meter('電流計','ampR','0')}${meter('モーター','motorR','停止')}</div>`+ctl('',`<div class="note">水溶液を変える前に、電極の先を蒸留水で洗う操作も再現しています。</div>`);const {c,ctx,off}=canvas();function effective(){return down&&power?Math.max(sols[key].cond,contam*.16):0}function draw(){const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);rr(ctx,w*.06,65,w*.25,145,15,'#d7e0e5','#71808b');txt(ctx,'電源装置 3 V',w*.185,95,16,'#26343d','center');circ(ctx,w*.12,170,10,'#222');circ(ctx,w*.25,170,10,'#d8504f');beaker(ctx,w*.40,h*.40,w*.27,h*.33,key==='cucl'?'rgba(35,126,210,.38)':'rgba(115,185,235,.16)');const yy=down?h*.48:h*.28;line(ctx,w*.48,h*.20,w*.48,yy+h*.18,'#434b51',14);line(ctx,w*.59,h*.20,w*.59,yy+h*.18,'#434b51',14);line(ctx,w*.12,170,w*.48,h*.20,'#111',4);line(ctx,w*.25,170,w*.59,h*.20,'#e14949',4);meterDial(ctx,w*.80,h*.33,60,effective(),'A');const e=effective();circ(ctx,w*.82,h*.67,45,e>.05?'#64e2c4':'#253242','#667');for(let i=0;i<3;i++){ctx.save();ctx.translate(w*.82,h*.67);ctx.rotate((performance.now()/400)+(i*2.09));rr(ctx,-5,-42,10,38,4,e>.05?'#7effcf':'#607080');ctx.restore()}txt(ctx,'光電池用モーター',w*.82,h*.80,13,'#9fb4c9','center');txt(ctx,sols[key].n,w*.535,h*.82,16,'#eef7ff','center');if(down&&e>.05)txt(ctx,sols[key].change,w*.535,h*.88,13,'#ffd36a','center');ampR.textContent=e?`${Math.round(e*100)}（相対）`:'0';motorR.textContent=e>.08?'回転':'停止'}let raf;function loop(){draw();raf=requestAnimationFrame(loop)}sol.onchange=()=>{if(key!==sol.value&&!rinsed)contam=Math.max(contam,sols[key].cond);key=sol.value;rinsed=false};lower.onclick=()=>{down=!down;lower.textContent=down?'電極を上げる':'電極を入れる';setStatus(down?'電極を浸した':'準備',down)};rinse.onclick=()=>{contam=0;rinsed=true;setStatus('電極を洗浄')};power.onclick=()=>{power=!power;power.textContent=power?'電源OFF':'電源ON';setStatus(power?'通電中':'電源OFF',power)};raf=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(raf);off()}},
hcl(){
  let filled=false,airPurged=false,on=false,gasH=0,gasCl=0,test='',raf;
  const voltage=6;
  controls.innerHTML=
    ctl('装置の準備',
      buttons(btn('fill','ろうとで塩酸100 cm³を入れる'),btn('purge','前面を液で満たす','secondary'))
    )+
    ctl('',btn('hpower','6 Vで電流を流す'))+
    ctl('発生した物質を調べる',
      buttons(btn('testH','陰極側：マッチの火','secondary'),btn('testCl','陽極側：上部の液を調べる','secondary'))
    )+
    `<div class="readout">${meter('陰極側の気体','hgas','0.0目盛')}${meter('陽極側の気体','clgas','0.0目盛')}</div>`+
    ctl('',`<div class="note">教科書どおり、前面を液で満たして空気が残らない状態にしてから通電します。どちらかの気体が4目盛たまったらスイッチを切ります。</div>`);
  const {c,ctx,off}=canvas();

  function draw(){
    const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);
    txt(ctx,'うすい塩酸の電気分解',w/2,48,22,'#eef7ff','center');
    rr(ctx,w*.25,h*.20,w*.50,h*.56,18,'rgba(206,224,235,.10)','#9fb0be');

    // two graduated tubes
    const tubes=[{x:w*.39,label:'陰極',col:'#111',g:gasH},{x:w*.61,label:'陽極',col:'#df4c4c',g:gasCl}];
    tubes.forEach(t=>{
      rr(ctx,t.x-38,h*.23,76,h*.43,10,'rgba(225,240,250,.07)','#adc2d0');
      for(let i=0;i<5;i++){line(ctx,t.x-30,h*.31+i*34,t.x-18,h*.31+i*34,'#8097a7',1);txt(ctx,String(i+1),t.x-48,h*.315+i*34,11,'#9fb4c9','center')}
      ctx.fillStyle=t.col;ctx.fillRect(t.x-6,h*.43,12,h*.20);
      txt(ctx,t.label,t.x,h*.17,15,'#eef7ff','center');
      if(filled){
        const baseY=h*.64;
        const gh=Math.min(4,t.g)*34;
        ctx.fillStyle='rgba(255,255,255,.68)';
        ctx.fillRect(t.x-31,baseY-gh,62,gh);
      }
    });

    // rear funnel and stopper
    rr(ctx,w*.72,h*.30,36,58,6,'#b33b35','#d9c5bd');
    line(ctx,w*.76,h*.30,w*.83,h*.19,'#c8d8e2',5);
    ctx.strokeStyle='#c8d8e2';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(w*.80,h*.20);ctx.lineTo(w*.86,h*.20);ctx.lineTo(w*.83,h*.26);ctx.stroke();
    txt(ctx,'ろうと',w*.85,h*.17,12,'#9fb4c9','center');

    if(filled){
      ctx.fillStyle='rgba(115,185,235,.18)';
      ctx.fillRect(w*.28,h*.42,w*.44,h*.29);
    }
    if(!airPurged&&filled){
      ctx.fillStyle='rgba(255,255,255,.30)';
      ctx.fillRect(w*.28,h*.36,w*.44,h*.06);
      txt(ctx,'空気が残っている',w*.50,h*.39,12,'#ffd36a','center');
    }
    if(on&&airPurged){
      for(let i=0;i<14;i++){
        circ(ctx,w*.39+(i%2?4:-4),h*.59-((performance.now()/15+i*19)%90),2.5,'rgba(255,255,255,.78)');
        circ(ctx,w*.61+(i%2?4:-4),h*.59-((performance.now()/18+i*23)%90),2.3,'rgba(230,255,190,.68)');
      }
    }
    if(test) txt(ctx,test,w/2,h*.88,16,test.includes('水素')?'#64e2c4':'#ffd36a','center');

    hgas.textContent=gasH.toFixed(1)+'目盛';
    clgas.textContent=gasCl.toFixed(1)+'目盛';
  }

  function loop(){
    if(on&&filled&&airPurged){
      gasH+=.0034*voltage;
      gasCl+=.0022*voltage; // 塩素は水に溶けやすく、管にたまりにくい
      if(gasH>=4||gasCl>=4){
        gasH=Math.min(4,gasH); gasCl=Math.min(4,gasCl);
        on=false; hpower.textContent='6 Vで電流を流す'; setStatus('4目盛でスイッチを切った');
      }
    }
    draw();raf=requestAnimationFrame(loop);
  }

  fill.onclick=()=>{
    filled=true;airPurged=false;gasH=gasCl=0;test='';
    setStatus('背面の穴から100 cm³入れた',true);
  };
  purge.onclick=()=>{
    if(!filled){setStatus('先に塩酸を入れる');return}
    airPurged=true;setStatus('前面を液で満たした',true);
  };
  hpower.onclick=()=>{
    if(!filled){setStatus('先に塩酸を100 cm³入れる');return}
    if(!airPurged){setStatus('空気が残らないよう前面を液で満たす');return}
    on=!on;hpower.textContent=on?'スイッチを切る':'6 Vで電流を流す';setStatus(on?'通電中':'停止',on);
  };
  testH.onclick=()=>{
    if(gasH<.7){test='陰極側：まだ気体が少ない';return}
    test='陰極側：一瞬「ポン」と音を立てて燃える → 水素';
  };
  testCl.onclick=()=>{
    if(gasCl<.4){test='陽極側：まだ気体が少ない';return}
    test='陽極側：プールを消毒したようなにおい・赤インクを脱色 → 塩素';
  };
  raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);off()}
},
metals(){
  const ms=['Mg','Zn','Cu'];
  const ss=['Mg2','Zn2','Cu2'];
  const ionMetal={Mg2:'Mg',Zn2:'Zn',Cu2:'Cu'};
  const rank={Mg:3,Zn:2,Cu:1};
  let selectedMetal='Mg', selectedSol='Zn2';
  const done={};
  controls.innerHTML=
    ctl('金属片',`<div class="chiprow">${ms.map(m=>`<button class="chip metal" data-v="${m}">${m==='Mg'?'マグネシウム':m==='Zn'?'亜鉛':'銅'}</button>`).join('')}</div>`)+
    ctl('水溶液',`<div class="chiprow">${ss.map(s=>`<button class="chip solution" data-v="${s}">${s==='Mg2'?'硫酸マグネシウム':s==='Zn2'?'硫酸亜鉛':'硫酸銅'}</button>`).join('')}</div>`)+
    ctl('',btn('react','選んだ組み合わせを試す'))+
    ctl('',`<div class="note">同じ金属とそのイオンの組み合わせは除外し、6通りを比較します。</div>`);
  const {c,ctx,off}=canvas();
  function reaction(m,s){
    const im=ionMetal[s];
    if(m===im) return {react:false,text:'同じ種類'};
    if(rank[m]>rank[im]) return {react:true,text:`${m}が変化し、${im}が析出`};
    return {react:false,text:'変化なし'};
  }
  function draw(){
    const w=W(c),h=H(c);
    ctx.clearRect(0,0,w,h);
    txt(ctx,'マイクロプレート',w/2,55,21,'#eef7ff','center');
    const xs=[w*.30,w*.50,w*.70],ys=[h*.30,h*.50,h*.70];
    ss.forEach((s,j)=>txt(ctx,s==='Mg2'?'Mg²⁺':s==='Zn2'?'Zn²⁺':'Cu²⁺',xs[j],h*.17,14,'#9fb4c9','center'));
    ms.forEach((m,i)=>txt(ctx,m,w*.13,ys[i]+5,15,'#9fb4c9','center'));
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        const m=ms[i],s=ss[j],same=m===ionMetal[s];
        circ(ctx,xs[j],ys[i],48,s==='Cu2'?'rgba(44,132,214,.32)':'rgba(190,220,235,.14)','#8095a6');
        if(same){
          line(ctx,xs[j]-30,ys[i]-30,xs[j]+30,ys[i]+30,'rgba(255,255,255,.3)',3);
          continue;
        }
        const k=m+'|'+s;
        if(done[k]){
          const r=reaction(m,s);
          const plate=m==='Cu'?'#c98656':m==='Zn'?'#c4c9cc':'#9aa4a9';
          rr(ctx,xs[j]-22,ys[i]-10,44,20,5,plate);
          if(r.react){
            const deposit=ionMetal[s]==='Cu'?'#b55f36':'#aeb7bd';
            for(let q=0;q<12;q++) circ(ctx,xs[j]-27+(q*19%54),ys[i]-25+(q*13%50),3,deposit);
          }
        }else{
          rr(ctx,xs[j]-22,ys[i]-10,44,20,5,m==='Cu'?'#d08b5f':m==='Zn'?'#c4c9cc':'#9aa4a9');
        }
      }
    }
    txt(ctx,'変化する組み合わせを比較する',w/2,h*.91,15,'#64e2c4','center');
  }
  function active(){
    document.querySelectorAll('.metal').forEach(b=>b.classList.toggle('active',b.dataset.v===selectedMetal));
    document.querySelectorAll('.solution').forEach(b=>b.classList.toggle('active',b.dataset.v===selectedSol));
  }
  document.querySelectorAll('.metal').forEach(b=>b.onclick=()=>{selectedMetal=b.dataset.v;active()});
  document.querySelectorAll('.solution').forEach(b=>b.onclick=()=>{selectedSol=b.dataset.v;active()});
  react.onclick=()=>{
    if(selectedMetal===ionMetal[selectedSol]){setStatus('同じ金属どうしは除外');return;}
    done[selectedMetal+'|'+selectedSol]=true;
    const r=reaction(selectedMetal,selectedSol);
    setStatus(r.text,r.react);
    draw();
  };
  active();draw();return off;
},
daniel(){
  let method='A',step=0,connected='',reverse=false,t=0,raf;
  const stepsA=['セロハンをアクリル容器にOリングで固定','容器内に14%硫酸銅水溶液40 cm³','ビーカー側に5%硫酸亜鉛水溶液40 cm³','Cu板をCuSO₄、Zn板をZnSO₄に差し込む'];
  const stepsB=['Cu板上にCuSO₄で湿らせたろ紙','その上にセロハン','ZnSO₄で湿らせたろ紙を重ねる','Zn板を重ね、クリップで固定'];
  controls.innerHTML=
    select('method','教科書の方法',[['A','A アクリル容器＋セロハン'],['B','B ろ紙＋セロハン']])+
    ctl('組み立て',`<div id="dsteps" class="steps"></div><div style="height:8px"></div>${btn('dnext','次の操作')}</div>`)+
    ctl('電気エネルギーを取り出す',
      buttons(btn('music','電子オルゴールをつなぐ'),btn('motor','プロペラモーターをつなぐ','secondary'))
    )+
    ctl('',buttons(btn('reverse','＋−を逆につなぐ','secondary'),btn('disconnect','外す','secondary')))+
    `<div class="readout">${meter('回路','dcircuit','未接続')}${meter('極','dpoles','—')}</div>`+
    ctl('',`<div class="note">電子オルゴールは＋極と−極を正しくつながないと鳴りません。長くつなぐと、亜鉛板はぼろぼろになり、銅板には新しい銅が付着します。</div>`);
  const {c,ctx,off}=canvas();

  function listSteps(){
    const arr=method==='A'?stepsA:stepsB;
    dsteps.innerHTML=arr.map((x,i)=>`<div class="step ${i<step?'done':''}">${i+1}. ${x}</div>`).join('');
    dnext.disabled=step>=arr.length;
  }
  function assembled(){return step>=(method==='A'?stepsA.length:stepsB.length)}

  function draw(){
    const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);
    txt(ctx,'ダニエル電池',w/2,44,22,'#eef7ff','center');

    if(method==='A'){
      // beaker and inner acrylic container
      beaker(ctx,w*.24,h*.31,w*.52,h*.43,'rgba(168,210,235,.14)');
      rr(ctx,w*.48,h*.34,w*.22,h*.34,10,'rgba(45,126,210,.23)','#a8c0d0');
      if(step>=1){line(ctx,w*.48,h*.34,w*.48,h*.68,'#e8c86b',5);txt(ctx,'セロハン',w*.50,h*.72,12,'#e8c86b','center')}
      if(step>=2){ctx.fillStyle='rgba(35,126,210,.30)';ctx.fillRect(w*.50,h*.47,w*.18,h*.19);txt(ctx,'14% CuSO₄',w*.59,h*.80,13,'#9fb4c9','center')}
      if(step>=3){ctx.fillStyle='rgba(195,220,235,.20)';ctx.fillRect(w*.27,h*.47,w*.19,h*.19);txt(ctx,'5% ZnSO₄',w*.36,h*.80,13,'#9fb4c9','center')}
      if(step>=4){rr(ctx,w*.31,h*.28,26,h*.37,3,'#aeb6ba');rr(ctx,w*.62,h*.28,26,h*.37,3,'#b86c43');txt(ctx,'Zn',w*.323,h*.24,13,'#eef7ff','center');txt(ctx,'Cu',w*.633,h*.24,13,'#eef7ff','center')}
    }else{
      // stacked paper method
      rr(ctx,w*.20,h*.60,w*.60,48,8,'#b87045'); if(step>=1)rr(ctx,w*.20,h*.54,w*.60,34,3,'rgba(65,135,210,.72)');
      if(step>=2)rr(ctx,w*.20,h*.48,w*.60,26,3,'rgba(235,245,250,.82)');
      if(step>=3)rr(ctx,w*.20,h*.42,w*.60,34,3,'rgba(210,225,235,.82)');
      if(step>=4)rr(ctx,w*.20,h*.34,w*.60,48,8,'#aeb6ba');
      txt(ctx,'Cu板',w*.12,h*.63,12,'#9fb4c9','right');txt(ctx,'Zn板',w*.12,h*.38,12,'#9fb4c9','right');
    }

    if(assembled()){
      const zx=method==='A'?w*.323:w*.32,cx=method==='A'?w*.633:w*.68;
      line(ctx,zx,h*.28,zx,105,'#111',4); line(ctx,cx,h*.28,cx,105,'#e04c4c',4);
      if(connected){
        const devX=w*.50,devY=105;
        circ(ctx,devX,devY,48,connected==='music'?'#1c2832':'#263642','#75838d');
        if(connected==='music'){txt(ctx,reverse?'…':'♪',devX,devY+10,34,reverse?'#788894':'#ffd36a','center')}
        else{
          for(let i=0;i<3;i++){ctx.save();ctx.translate(devX,devY);ctx.rotate((reverse?-1:1)*t/22+i*2.09);rr(ctx,-4,-42,8,37,3,'#64e2c4');ctx.restore()}
        }
        for(let i=0;i<8;i++) circ(ctx,zx+((t+i*45)%300)/300*(cx-zx),100,4,'#64e2c4');
        txt(ctx,'電子：Zn → Cu',w*.50,170,13,'#64e2c4','center');
        if(t>250){
          // electrode changes
          for(let i=0;i<10;i++)circ(ctx,zx-6+(i%3)*6,h*.58+(i%4)*10,2,'#7d8588');
          for(let i=0;i<12;i++)circ(ctx,cx-8+(i%4)*5,h*.52+(i%5)*9,2.2,'#d2875a');
        }
      }
    }

    dcircuit.textContent=!connected?'未接続':connected==='music'?(reverse?'鳴らない':'オルゴールが鳴る'):'モーター回転';
    dpoles.textContent=assembled()?'Zn − / Cu ＋':'—';
  }

  function loop(){if(connected)t++;draw();raf=requestAnimationFrame(loop)}
  method.onchange=()=>{method=method.value;step=0;connected='';reverse=false;t=0;listSteps();draw()};
  dnext.onclick=()=>{step++;listSteps();setStatus(assembled()?'電池完成':'組み立て中',assembled());draw()};
  music.onclick=()=>{if(!assembled()){setStatus('先に電池を完成させる');return}connected='music';t=0;setStatus(reverse?'極性が逆で鳴らない':'電子オルゴールが鳴った',!reverse)};
  motor.onclick=()=>{if(!assembled()){setStatus('先に電池を完成させる');return}connected='motor';t=0;setStatus('モーター回転',true)};
  reverse.onclick=()=>{reverse=!reverse;setStatus(reverse?'＋−を逆につないだ':'正しい極性に戻した');draw()};
  disconnect.onclick=()=>{connected='';setStatus('回路を外した');draw()};
  listSteps();raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);off()}
},
acidprop(){const liquids={hcl:{n:'2.5%塩酸',type:'acid',ph:1.2},h2so4:{n:'2.5%硫酸',type:'acid',ph:1},acetic:{n:'2.5%酢酸',type:'acid',ph:2.5},naoh:{n:'2.5%水酸化Na',type:'base',ph:13},baoh:{n:'2.5%水酸化Ba',type:'base',ph:12.5},nh3:{n:'2.5%アンモニア水',type:'base',ph:11.5}};let liq='hcl',test='BTB',obs='';controls.innerHTML=select('aliq','水溶液',Object.entries(liquids).map(([k,v])=>[k,v.n]))+select('atest','試すもの',[['BTB','BTB溶液'],['PP','フェノールフタレイン'],['PH','pH試験紙'],['Mg','マグネシウムリボン']])+ctl('',btn('atestBtn','試す'))+`<div class="readout">${meter('観察','aobs','—')}${meter('pH','aph','—')}</div>`;const {c,ctx,off}=canvas();function color(v){if(test==='BTB')return v.type==='acid'?'#f3d85c':'#3c7edb';if(test==='PP')return v.type==='base'?'#ee5f9a':'rgba(220,235,245,.2)';if(test==='PH'){const hue=240-(v.ph/14)*240;return `hsl(${hue} 70% 55%)`}return 'rgba(150,190,220,.2)'}function draw(){const w=W(c),h=H(c),v=liquids[liq];ctx.clearRect(0,0,w,h);txt(ctx,'マイクロプレートで性質を比較',w/2,62,22,'#eef7ff','center');for(let i=0;i<4;i++)for(let j=0;j<3;j++)circ(ctx,w*.30+j*w*.20,h*.30+i*h*.15,42,'rgba(180,210,230,.08)','#8197a7');const x=w*.50,y=h*.45;circ(ctx,x,y,46,obs?color(v):'rgba(180,210,230,.1)','#9ab0bf');if(obs&&test==='Mg'&&v.type==='acid')for(let i=0;i<16;i++)circ(ctx,x-20+(i*17%40),y+22-(i*19%70),3,'rgba(255,255,255,.75)');txt(ctx,v.n,w/2,h*.83,17,'#eef7ff','center');txt(ctx,test==='Mg'?'マグネシウムリボン':test,w/2,h*.88,14,'#9fb4c9','center');aobs.textContent=obs||'—';aph.textContent=obs?String(v.ph):'—'}aliq.onchange=()=>{liq=aliq.value;obs='';draw()};atest.onchange=()=>{test=atest.value;obs='';draw()};atestBtn.onclick=()=>{const v=liquids[liq];if(test==='BTB')obs=v.type==='acid'?'黄色':'青色';if(test==='PP')obs=v.type==='base'?'赤色':'無色';if(test==='PH')obs=v.type==='acid'?'酸性の色':'アルカリ性の色';if(test==='Mg')obs=v.type==='acid'?'気体が発生':'ほぼ変化なし';setStatus('観察中',true);draw()};draw();return off},
ionmove(){let kind='hcl',on=false,t=0,raf;controls.innerHTML=select('ikind','中央にしみこませる液',[['hcl','2.5%塩酸'],['naoh','2.5%水酸化ナトリウム水溶液']])+ctl('',btn('ionPower','9 Vを加える'))+ctl('',`<div class="note">pH試験紙とろ紙は2%硝酸カリウム水溶液で湿らせ、両端をクリップで電源につなぎます。</div>`)+`<div class="readout">${meter('色の広がり','idir','中央')}${meter('示す粒子','ionR','—')}</div>`;const {c,ctx,off}=canvas();function draw(){const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);rr(ctx,w*.12,h*.40,w*.76,90,8,'#e5d49a','#b4aa84');txt(ctx,'陰極 −',w*.12,h*.34,16,'#72a7ff','center');txt(ctx,'陽極 ＋',w*.88,h*.34,16,'#ff7e8e','center');line(ctx,w*.12,h*.37,w*.12,h*.48,'#111',14);line(ctx,w*.88,h*.37,w*.88,h*.48,'#df4a4a',14);const max=w*.31*Math.min(1,t/300),cx=w*.50;ctx.fillStyle=kind==='hcl'?'rgba(235,80,75,.75)':'rgba(65,105,220,.7)';if(kind==='hcl')ctx.fillRect(cx-max,h*.40,max,90);else ctx.fillRect(cx,h*.40,max,90);txt(ctx,kind==='hcl'?'塩酸':'NaOH',cx,h*.56,15,'#0b1720','center');idir.textContent=t<10?'中央':kind==='hcl'?'陰極側へ':'陽極側へ';ionR.textContent=t<10?'—':kind==='hcl'?'H⁺':'OH⁻'}function loop(){if(on)t+=1;draw();raf=requestAnimationFrame(loop)}ikind.onchange=()=>{kind=ikind.value;t=0;draw()};ionPower.onclick=()=>{on=!on;ionPower.textContent=on?'電源を切る':'9 Vを加える';setStatus(on?'通電中':'停止',on)};raf=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(raf);off()}},
neutral(){
  let measured=false,pp=0,acidDrops=0,slide=false,evap=0,microscope=false,raf;
  const endpointDrops=22;
  controls.innerHTML=
    ctl('1. アルカリを量る',btn('measure','メスシリンダーでNaOH 10 cm³を量る'))+
    ctl('2. 指示薬',btn('pp','フェノールフタレインを2〜3滴'))+
    ctl('3. 塩酸を少しずつ加える',
      buttons(btn('acidDrop','塩酸を1滴'),btn('stir','ガラス棒でかき混ぜる','secondary'))
    )+
    ctl('4. 水を蒸発させる',
      buttons(btn('toSlide','一部をスライドガラスへ','secondary'),btn('evaporate','水を蒸発させる','secondary'))
    )+
    ctl('',btn('microscope','出てきた物質を顕微鏡で見る','secondary'))+
    `<div class="readout">${meter('塩酸','acidVol','0滴')}${meter('状態','neutralR','準備')}</div>`+
    ctl('',`<div class="note">赤色が消えそうになったら、塩酸を1滴加えるたびにガラス棒でかき混ぜます。赤色が消えたら、その液の一部をスライドガラスに取り、水を蒸発させます。</div>`);
  const {c,ctx,off}=canvas();
  let stirredAt=-1;

  function redStrength(){
    if(!measured||!pp) return 0;
    return Math.max(0,1-acidDrops/endpointDrops);
  }

  function draw(){
    const w=W(c),h=H(c);ctx.clearRect(0,0,w,h);
    txt(ctx,'酸とアルカリを混ぜたときの変化',w/2,45,21,'#eef7ff','center');

    if(!slide){
      // beaker
      beaker(ctx,w*.32,h*.33,w*.36,h*.39, measured ? `rgba(235,80,150,${.12+.45*redStrength()})` : 'rgba(0,0,0,0)');
      txt(ctx,measured?'NaOH水溶液 10 cm³':'まだ入っていない',w*.50,h*.80,15,'#eef7ff','center');
      // phenolphthalein bottle
      rr(ctx,w*.12,h*.28,48,74,8,'#6a3b25','#a26647');rr(ctx,w*.18,h*.25,20,22,4,'#c43b32');
      txt(ctx,'フェノール',w*.145,h*.42,10,'#eef7ff','center');txt(ctx,'フタレイン',w*.145,h*.45,10,'#eef7ff','center');
      // acid dropper
      line(ctx,w*.76,h*.20,w*.63,h*.43,'#c5d7e2',7);circ(ctx,w*.77,h*.18,13,'#8b99a1');
      txt(ctx,'塩酸',w*.79,h*.28,13,'#9fb4c9','center');
      // glass rod
      line(ctx,w*.55,h*.22,w*.49,h*.63,'#bfcbd2',5);txt(ctx,'ガラス棒',w*.59,h*.20,12,'#9fb4c9');
      if(pp&&acidDrops===0)txt(ctx,'赤色',w*.50,h*.27,17,'#ff7fb0','center');
      if(pp&&acidDrops>0&&acidDrops<endpointDrops)txt(ctx,redStrength()<.25?'うすい赤色':'赤色',w*.50,h*.27,17,'#ff7fb0','center');
      if(acidDrops>=endpointDrops)txt(ctx,'赤色が消えた',w*.50,h*.27,18,'#64e2c4','center');
      if(acidDrops>stirredAt&&redStrength()<.30&&acidDrops<endpointDrops)txt(ctx,'1滴ごとにかき混ぜる',w*.50,h*.89,13,'#ffd36a','center');
    } else if(!microscope){
      // slide glass evaporation
      rr(ctx,w*.18,h*.56,w*.64,24,3,'rgba(215,238,250,.46)','#b7c8d2');
      if(evap<100){
        const r=Math.max(8,34-evap*.25);circ(ctx,w*.50,h*.54,r,'rgba(160,205,235,.42)');
        for(let i=0;i<5;i++)txt(ctx,'~',w*.44+i*22,h*.45-(evap%18),18,'rgba(255,255,255,.35)');
        txt(ctx,'水を蒸発中',w*.50,h*.38,16,'#9fb4c9','center');
      } else {
        for(let i=0;i<20;i++){
          ctx.save();ctx.translate(w*.42+(i%5)*32,h*.50+Math.floor(i/5)*13);ctx.rotate((i%4)*.55);rr(ctx,-9,-2,18,4,1,'#e9e5d6');ctx.restore();
        }
        txt(ctx,'白い結晶状の物質',w*.50,h*.38,17,'#64e2c4','center');
      }
    } else {
      const cx=w/2,cy=h*.50,r=Math.min(w,h)*.33;
      ctx.fillStyle='#f6f0dc';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.clip();
      for(let i=0;i<28;i++){
        const x=cx-r+30+(i*73%(r*2-60)),y=cy-r+25+(i*47%(r*2-50));
        ctx.save();ctx.translate(x,y);ctx.rotate((i%7)*.45);rr(ctx,-15,-3,30,6,1,'#e7e1c8','#c9c1a8');ctx.restore();
      }
      ctx.restore();ctx.strokeStyle='#d7e7f2';ctx.lineWidth=7;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
      txt(ctx,'顕微鏡で結晶を観察',cx,h*.90,15,'#64e2c4','center');
    }

    acidVol.textContent=acidDrops+'滴';
    neutralR.textContent=!measured?'準備':!pp?'無色':acidDrops<endpointDrops?'赤色':!slide?'無色':evap<100?'蒸発中':'結晶';
  }

  function loop(){if(slide&&evap>0&&evap<100)evap+=.22;draw();raf=requestAnimationFrame(loop)}
  measure.onclick=()=>{measured=true;setStatus('NaOH 10 cm³を量り取った',true)};
  pp.onclick=()=>{if(!measured){setStatus('先にNaOHを10 cm³量る');return}pp=3;setStatus('赤色になった',true)};
  acidDrop.onclick=()=>{
    if(!pp){setStatus('先にフェノールフタレインを加える');return}
    if(acidDrops>=endpointDrops){setStatus('赤色はすでに消えている');return}
    acidDrops++;
    if(acidDrops>=endpointDrops)setStatus('赤色が消えた',true);
    else if(redStrength()<.30)setStatus('赤色がうすい。1滴ごとにかき混ぜる');
    else setStatus('塩酸を少しずつ加えた',true);
  };
  stir.onclick=()=>{if(acidDrops===0){setStatus('まだ塩酸を加えていない');return}stirredAt=acidDrops;setStatus('ガラス棒でかき混ぜた',true)};
  toSlide.onclick=()=>{if(acidDrops<endpointDrops){setStatus('赤色が消えるまで塩酸を加える');return}slide=true;setStatus('一部をスライドガラスへ移した')};
  evaporate.onclick=()=>{if(!slide){setStatus('先に液をスライドガラスへ');return}evap=1;setStatus('水を蒸発させている',true)};
  microscope.onclick=()=>{if(evap<100){setStatus('物質が出てくるまで水を蒸発させる');return}microscope=true;setStatus('顕微鏡で観察中',true)};
  raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);off()}
},
buoyancy(){let mass=100,depth=0;controls.innerHTML=range('bmass','おもり',50,200,50,100,' g')+range('depth','水への沈み方',0,100,1,0,'%')+`<div class="readout">${meter('ばねばかり','springR','0.98 N')}${meter('浮力','buoyR','0.00 N')}</div>`+ctl('',`<div class="note">0〜50%は一部が水中。50%以上で全体が水中に入った後は、さらに深くしても浮力は変わりません。</div>`);const {c,ctx,off}=canvas();function draw(){const w=W(c),h=H(c),weight=mass/1000*9.8,frac=Math.min(1,depth/50),volume=(mass/7800),buoy=1000*9.8*volume*frac,reading=Math.max(0,weight-buoy);ctx.clearRect(0,0,w,h);line(ctx,w*.50,60,w*.50,h*.28,'#d8e5ee',5);rr(ctx,w*.45,85,w*.10,120,12,'#eef2e5','#7c8a96');for(let i=0;i<10;i++)line(ctx,w*.46,100+i*9,w*.48,100+i*9,'#4b5964',1);txt(ctx,reading.toFixed(2)+' N',w*.50,160,14,'#27333b','center');beaker(ctx,w*.29,h*.47,w*.42,h*.38,'rgba(78,153,214,.3)');const waterY=h*.60,top=waterY-45+(1-depth/100)*150;rr(ctx,w*.46,top,70,70,5,'#a3aaad');line(ctx,w*.50,h*.28,w*.50,top,'#d6dde2',2);txt(ctx,`${mass} g`,w*.495,top+42,14,'#152029','center');springR.textContent=reading.toFixed(2)+' N';buoyR.textContent=buoy.toFixed(2)+' N'}el('#bmass').oninput=()=>{mass=+el('#bmass').value;el('#bmassVal').textContent=mass+' g';draw()};el('#depth').oninput=()=>{depth=+el('#depth').value;el('#depthVal').textContent=depth+'%';draw()};draw();return off},
vectors(){let angle=60,weight=1;controls.innerHTML=range('vangle','2本のばねばかりの間の角度',20,140,5,60,'°')+range('vweight','おもりにはたらく力',.5,2,.1,1,' N')+`<div class="readout">${meter('ばねばかり F₁','f1R','0.58 N')}${meter('ばねばかり F₂','f2R','0.58 N')}</div>`+ctl('',`<div class="note">リングが点Oに重なるように、左右のばねばかりで対称に引いた場合を再現します。1本で引くと合力はおもりを引く力と同じになります。</div>`);const {c,ctx,off}=canvas();function draw(){const w=W(c),h=H(c),cx=w*.54,cy=h*.52,a=angle*Math.PI/180/2,F=weight/(2*Math.cos(a));ctx.clearRect(0,0,w,h);rr(ctx,w*.14,h*.18,w*.72,h*.64,15,'#a9885d','#c5aa7e');rr(ctx,w*.18,h*.22,w*.64,h*.56,8,'#efe8d8');circ(ctx,cx,cy,11,'none','#333');txt(ctx,'O',cx,cy+4,12,'#222','center');const len=180;const x1=cx+Math.sin(a)*len,y1=cy-Math.cos(a)*len,x2=cx-Math.sin(a)*len,y2=y1;line(ctx,cx,cy,x1,y1,'#e05252',5);line(ctx,cx,cy,x2,y2,'#72a7ff',5);line(ctx,cx,cy,cx,cy+180,'#3a4147',4);circ(ctx,cx,cy+190,24,'#9aa4aa');txt(ctx,'F₁',x1,y1-10,15,'#ff7e8e','center');txt(ctx,'F₂',x2,y2-10,15,'#72a7ff','center');txt(ctx,`${weight.toFixed(1)} N`,cx,cy+235,15,'#9fb4c9','center');f1R.textContent=F.toFixed(2)+' N';f2R.textContent=F.toFixed(2)+' N'}el('#vangle').oninput=()=>{angle=+el('#vangle').value;el('#vangleVal').textContent=angle+'°';draw()};el('#vweight').oninput=()=>{weight=+el('#vweight').value;el('#vweightVal').textContent=weight+' N';draw()};draw();return off},
cartforce(){
  let mass=50,setup=0,run=false,t=0,dots=[],segments=[],raf,last=performance.now();
  const cartMass=.50;
  controls.innerHTML=
    range('hang','つるすおもり',50,100,10,50,' g')+
    select('hz','記録タイマー',[['60','西日本 60 Hz（0.1秒＝6打点）'],['50','東日本 50 Hz（0.1秒＝5打点）']])+
    ctl('装置を組み立てる',
      `<div id="csteps" class="steps"></div><div style="height:8px"></div>${btn('cnext','次の操作')}</div>`
    )+
    ctl('記録',buttons(btn('cartStart','記録タイマーON→台車を放す'),btn('cartStop','滑車の前で止める','secondary')))+
    ctl('記録テープを処理',buttons(btn('cutTape','0.1秒ごとに切る','secondary'),btn('cartReset','リセット','secondary')))+
    `<div class="readout">${meter('経過時間','ctR','0.00 s')}${meter('台車の速さ','cvR','0.00 m/s')}</div>`+
    ctl('',`<div class="note">教科書の手順どおり、テープを記録タイマーに通して台車につけ、糸をクランプ付き滑車にかけておもりをつるします。西日本60 Hzでは0.1秒ごとに6打点ずつ切ります。</div>`);
  const {c,ctx,off}=canvas();
  const cstepsText=['記録テープを水平面に固定した記録タイマーへ通す','テープを力学台車に取りつける','台車の糸をクランプ付き滑車にかける','糸の先におもりをつるす'];

  function stepList(){
    csteps.innerHTML=cstepsText.map((x,i)=>`<div class="step ${i<setup?'done':''}">${i+1}. ${x}</div>`).join('');
    cnext.disabled=setup>=4;
  }
  function acceleration(){const mh=mass/1000;return (mh*9.8)/(cartMass+mh)}

  function draw(){
    const w=W(c),h=H(c),a=acceleration();
    const x=Math.min(w*.23+.5*a*t*t*105,w*.70);
    ctx.clearRect(0,0,w,h);
    txt(ctx,'水平面上で一定の力を受ける台車',w/2,44,21,'#eef7ff','center');

    // bench, timer, tape
    line(ctx,w*.09,h*.60,w*.84,h*.60,'#a67b54',18);
    rr(ctx,w*.10,h*.45,86,75,8,'#bfc6c9','#75838b');txt(ctx,'記録',w*.145,h*.49,12,'#26343d','center');txt(ctx,'タイマー',w*.145,h*.52,12,'#26343d','center');
    if(setup>=1){line(ctx,w*.12,h*.34,x+18,h*.34,'#f4f0df',10);txt(ctx,'記録テープ',w*.18,h*.29,12,'#9fb4c9','center')}

    // cart
    rr(ctx,x,h*.50,92,40,6,'#62e6c7');circ(ctx,x+20,h*.59,11,'#18232b');circ(ctx,x+72,h*.59,11,'#18232b');txt(ctx,'力学台車',x+46,h*.48,12,'#eef7ff','center');

    // pulley and hanging mass
    if(setup>=3){circ(ctx,w*.83,h*.54,28,'rgba(0,0,0,0)','#acb9c3');line(ctx,x+92,h*.53,w*.83,h*.54,'#d7dde2',2)}
    if(setup>=4){line(ctx,w*.83,h*.54,w*.83,h*.79,'#d7dde2',2);rr(ctx,w*.805,h*.78,50,42,4,'#aeb5ba');txt(ctx,mass+' g',w*.83,h*.85,12,'#17212a','center')}

    // tape dots: true timer spacing
    if(dots.length){
      const baseY=h*.26;
      dots.forEach((d,i)=>circ(ctx,w*.11+Math.min(d*88,w*.70),baseY,2.3,'#ffd36a'));
      txt(ctx,el('#hz').value==='60'?'60 Hz：6打点で0.1秒':'50 Hz：5打点で0.1秒',w*.46,h*.20,13,'#9fb4c9','center');
    }

    // cut segments / bar-like placement
    if(segments.length){
      const y0=h*.73,scale=55;
      segments.forEach((len,i)=>{
        const yy=y0+i*24;
        line(ctx,w*.16,yy,w*.16+len*scale,yy,'#f1e8ce',10);
        txt(ctx,`${(i*.1).toFixed(1)}〜${((i+1)*.1).toFixed(1)} s`,w*.14,yy+4,10,'#9fb4c9','right');
      });
      txt(ctx,'0.1秒ごとのテープを左端をそろえて並べる',w*.55,h*.95,12,'#64e2c4','center');
    }

    ctR.textContent=t.toFixed(2)+' s';
    cvR.textContent=(a*t).toFixed(2)+' m/s';
  }

  function loop(now){
    const dt=Math.min(.03,(now-last)/1000);last=now;
    if(run&&setup>=4){
      const old=t;t+=dt;const hz=+el('#hz').value,step=1/hz;
      let k=Math.floor(old/step)+1;
      while(k*step<=t){
        const tt=k*step;dots.push(.5*acceleration()*tt*tt);k++;
      }
      if(t>1.15){run=false;cartStart.textContent='記録タイマーON→台車を放す';setStatus('滑車の直前で停止')}
    }
    draw();raf=requestAnimationFrame(loop);
  }

  cnext.onclick=()=>{setup=Math.min(4,setup+1);stepList();setStatus(setup===4?'装置完成':'組み立て中',setup===4)};
  el('#hang').oninput=()=>{mass=+el('#hang').value;el('#hangVal').textContent=mass+' g';if(!run){t=0;dots=[];segments=[]}};
  cartStart.onclick=()=>{
    if(setup<4){setStatus('先に装置を最後まで組み立てる');return}
    if(t>0&&!run){t=0;dots=[];segments=[]}
    run=true;last=performance.now();setStatus('記録タイマーON・台車を放した',true);
  };
  cartStop.onclick=()=>{run=false;setStatus('手で台車を止めた')};
  cutTape.onclick=()=>{
    if(dots.length<4){setStatus('先に運動を記録する');return}
    const hz=+el('#hz').value,n=Math.round(hz*.1);
    segments=[];
    for(let i=0;i+n<dots.length;i+=n)segments.push(dots[i+n]-dots[i]);
    setStatus(`0.1秒ごとに${n}打点で切った`,true);
  };
  cartReset.onclick=()=>{run=false;t=0;dots=[];segments=[];setup=0;stepList();setStatus('準備')};
  stepList();raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);off()}
},
incline(){let ang=10,run=false,t=0,dots=[],raf,last=performance.now();controls.innerHTML=range('iang','斜面の角度',5,25,1,10,'°')+select('ihz','記録タイマー',[['60','西日本 60 Hz'],['50','東日本 50 Hz']])+ctl('',buttons(btn('iStart','台車をはなす'),btn('iReset','リセット','secondary')))+`<div class="readout">${meter('経過','itR','0.00 s')}${meter('速さ','ivR','0.00 m/s')}</div>`;const {c,ctx,off}=canvas();function draw(){const w=W(c),h=H(c),a=9.8*Math.sin(ang*Math.PI/180),len=w*.64,sx=w*.16,sy=h*.72,dx=len*Math.cos(ang*Math.PI/180),dy=-len*Math.sin(ang*Math.PI/180),dist=Math.min(.5*a*t*t*70,len-80),x=sx+dx-dist*Math.cos(ang*Math.PI/180),y=sy+dy+dist*Math.sin(ang*Math.PI/180);ctx.clearRect(0,0,w,h);line(ctx,sx,sy,sx+dx,sy+dy,'#a98761',18);ctx.save();ctx.translate(x,y-28);ctx.rotate(-ang*Math.PI/180);rr(ctx,-45,-20,90,40,7,'#64e2c4');circ(ctx,-28,22,10,'#17232b');circ(ctx,28,22,10,'#17232b');ctx.restore();txt(ctx,'記録タイマー',w*.08,h*.22,14,'#9fb4c9');dots.forEach(d=>circ(ctx,w*.10+d*45,h*.30,2.5,'#ffd36a'));itR.textContent=t.toFixed(2)+' s';ivR.textContent=(a*t).toFixed(2)+' m/s'}function loop(now){const dt=Math.min(.03,(now-last)/1000);last=now;if(run){const old=t;t+=dt;const hz=+el('#ihz').value,step=1/hz;let k=Math.floor(old/step)+1;while(k*step<=t){const tt=k*step,a=9.8*Math.sin(ang*Math.PI/180);dots.push(.5*a*tt*tt);k++}if(t>1.25)run=false}draw();raf=requestAnimationFrame(loop)}el('#iang').oninput=()=>{ang=+el('#iang').value;el('#iangVal').textContent=ang+'°';t=0;dots=[]};iStart.onclick=()=>{run=!run;last=performance.now();setStatus(run?'記録中':'停止',run)};iReset.onclick=()=>{run=false;t=0;dots=[];setStatus('準備')};raf=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(raf);off()}},
work(){let mode='direct',pull=0,mass=.5;controls.innerHTML=select('wmode','方法',[['direct','直接持ち上げる'],['pulley','動滑車を使う'],['slope','斜面を使う']])+range('wmass','物体の質量',300,800,100,500,' g')+range('pull','引いた距離',0,50,1,0,' cm')+`<div class="readout">${meter('ばねばかり','wfR','4.90 N')}${meter('仕事','wwR','0.00 J')}</div>`+ctl('',`<div class="note">物体の高さを10 cm上げるところまで比較します。理想化して摩擦は無視しています。</div>`);const {c,ctx,off}=canvas();function vals(){const Wt=mass*9.8;let F,dNeed;if(mode==='direct'){F=Wt;dNeed=.1}else if(mode==='pulley'){F=Wt/2;dNeed=.2}else{dNeed=.4;F=Wt*.1/dNeed}const d=Math.min(pull/100,dNeed),rise=d/dNeed*.1;return{F,dNeed,d,rise}}function draw(){const w=W(c),h=H(c),v=vals();ctx.clearRect(0,0,w,h);line(ctx,w*.12,h*.75,w*.88,h*.75,'#9a7954',14);const y=h*.72-v.rise/.1*h*.35;rr(ctx,w*.46,y-70,90,70,8,'#64e2c4');txt(ctx,mode==='direct'?'直接':mode==='pulley'?'動滑車':'斜面',w*.50,80,22,'#eef7ff','center');if(mode==='pulley'){circ(ctx,w*.51,y-95,30,'none','#b9c8d2');line(ctx,w*.51,y-125,w*.30,160,'#d9e1e6',3);line(ctx,w*.51,y-125,w*.72,160,'#d9e1e6',3)}if(mode==='slope')line(ctx,w*.25,h*.75,w*.72,h*.35,'#a98761',16);line(ctx,w*.51,y-70,w*.80,h*.28,'#d9e1e6',2);txt(ctx,'10 cm',w*.23,h*.56,14,'#9fb4c9');wfR.textContent=v.F.toFixed(2)+' N';wwR.textContent=(v.F*v.d).toFixed(2)+' J'}wmode.onchange=()=>{mode=wmode.value;pull=0;el('#pull').value=0;el('#pullVal').textContent='0 cm';draw()};el('#wmass').oninput=()=>{mass=+el('#wmass').value/1000;el('#wmassVal').textContent=el('#wmass').value+' g';draw()};el('#pull').oninput=()=>{pull=+el('#pull').value;el('#pullVal').textContent=pull+' cm';draw()};draw();return off},
potential(){let mass=.1,height=.5,dropped=false,depth=0,raf;controls.innerHTML=range('pmass','おもりの質量',50,200,50,100,' g')+range('pheight','落とす高さ',20,100,10,50,' cm')+ctl('',buttons(btn('drop','おもりを落とす'),btn('pReset','くいを戻す','secondary')))+`<div class="readout">${meter('位置エネルギー','peR','0.49 J')}${meter('くいの移動量','stakeR','0 mm')}</div>`;const {c,ctx,off}=canvas();function draw(){const w=W(c),h=H(c),E=mass*9.8*height,target=Math.min(90,E*80);ctx.clearRect(0,0,w,h);line(ctx,w*.50,70,w*.50,h*.38,'#d9e1e6',3);const wy=dropped?h*.39:90+(1-height)*170;rr(ctx,w*.46,wy,70,55,7,'#9ea7ac');txt(ctx,`${Math.round(mass*1000)} g`,w*.495,wy+34,13,'#1a252c','center');ctx.fillStyle='#7a5a37';ctx.fillRect(0,h*.72,w,h*.28);rr(ctx,w*.47,h*.48+depth,55,h*.31-depth,3,'#c79a59');txt(ctx,'くい',w*.495,h*.67+depth/2,13,'#2b241d','center');peR.textContent=E.toFixed(2)+' J';stakeR.textContent=Math.round(depth)+' mm'}function loop(){if(dropped&&depth<Math.min(90,mass*9.8*height*80))depth+=1.1;draw();raf=requestAnimationFrame(loop)}el('#pmass').oninput=()=>{mass=+el('#pmass').value/1000;el('#pmassVal').textContent=el('#pmass').value+' g';dropped=false};el('#pheight').oninput=()=>{height=+el('#pheight').value/100;el('#pheightVal').textContent=el('#pheight').value+' cm';dropped=false};drop.onclick=()=>{dropped=true;setStatus('落下',true)};pReset.onclick=()=>{dropped=false;depth=0;setStatus('準備')};raf=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(raf);off()}}
};
if(location.hash){const l=labs.find(x=>'#'+x.id===location.hash);if(l)setTimeout(()=>openLab(l),80)}