const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');

function setup(lab) {
  const nodes = new Map(), frames = new Map(), texts = [], rectangles = [];
  let serial = 0, now = 0;
  const drawing = new Proxy({
    fillText: text => texts.push(text),
    fillRect: (...args) => rectangles.push(args),
    roundRect: (...args) => rectangles.push(args),
    createLinearGradient: () => ({ addColorStop() {} }),
  }, { get: (target, key) => target[key] || (() => {}) });
  let box;
  class Element {
    constructor() {
      this.value = ''; this.textContent = ''; this.clientWidth = 800; this.clientHeight = 600;
      this.classList = { toggle() {}, add() {}, remove() {} };
    }
    set innerHTML(html) {
      this.html = html;
      for (const match of html.matchAll(/<(input|select|button|b|span|div)[^>]*\bid="([^"]+)"[^>]*>/g)) {
        const item = get('#' + match[2]);
        item.value = /\bvalue="([^"]*)"/.exec(match[0])?.[1] || '';
        if (match[1] === 'select') item.value = /<option value="([^"]+)"/.exec(html.slice(match.index))?.[1] || '';
        box[match[2]] = item;
      }
    }
    get innerHTML() { return this.html; }
    append() {} scrollIntoView() {} setPointerCapture() {}
    getBoundingClientRect() { return { width: 800, height: 600, left: 0, top: 0 }; }
    querySelector() { return get('canvas'); }
    getContext() { return drawing; }
  }
  function get(id) { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); }
  box = {
    document: { querySelector: get, querySelectorAll: () => [], createElement: () => new Element() },
    window: { addEventListener() {}, removeEventListener() {} },
    history: { replaceState() {} }, location: { hash: '', pathname: '/' },
    performance: { now: () => now }, devicePixelRatio: 1, setTimeout() {},
    requestAnimationFrame(callback) { const id = ++serial; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  vm.createContext(box);
  vm.runInContext(source + `;renderers.${lab}()`, box);
  function action(id, event = 'onclick', value) {
    const item = get('#' + id);
    if (value !== undefined) item.value = String(value);
    assert.equal(typeof item[event], 'function', `${lab}: ${id}.${event} missing`);
    texts.length = rectangles.length = 0;
    item[event]();
  }
  function frame(ms = 16) {
    now += ms; const pending = [...frames.values()]; frames.clear();
    texts.length = rectangles.length = 0; pending.forEach(callback => callback(now));
  }
  return { get, action, frame, texts, rectangles };
}

const labs = ['cell','sunspot','sunpath','starpath','venus','conduct','hcl','metals','daniel','acidprop','ionmove','neutral','buoyancy','vectors','cartforce','incline','work','potential'];
for (const lab of labs) { const sim = setup(lab); sim.frame(); }

{
  const sim = setup('neutral');
  sim.action('pp'); assert.match(sim.get('#status').textContent, /先に/);
  sim.action('measure'); sim.action('pp'); assert.equal(sim.get('#neutralR').textContent, '赤色');
  for (let i = 0; i < 19; i++) sim.action('acidSlow');
  sim.action('toSlide'); assert.match(sim.get('#status').textContent, /かき混ぜ/);
  sim.action('stirNeutral'); assert.equal(sim.get('#neutralR').textContent, '無色');
  sim.action('toSlide'); sim.action('evaporate');
  for (let i = 0; i < 60; i++) sim.frame(100);
  assert.equal(sim.get('#neutralR').textContent, '結晶');
  sim.action('neutralReset'); assert.equal(sim.get('#acidVol').textContent, '0.00 mL');
}
{
  const sim = setup('starpath'); assert.equal(sim.get('#dir').value, '南');
  for (const direction of ['東','西','北','南']) {
    sim.action('dir', 'onchange', direction);
    assert(sim.texts.includes(`${direction}の空　0分後`));
  }
}
{
  const sim = setup('daniel'); sim.action('method','onchange','B'); sim.frame();
  assert(sim.texts.includes('CuSO₄で湿らせたろ紙'));
  sim.action('assemble'); sim.action('connect'); sim.frame();
  assert.equal(sim.get('#dmotor').textContent, '回転');
  sim.action('method','onchange','A'); sim.frame();
  assert.equal(sim.get('#dmotor').textContent, '停止');
  assert.equal(sim.get('#connect').textContent, 'モーターをつなぐ');
}
{
  const sim = setup('buoyancy');
  const readings = [];
  for (const depth of [0,25,50,100]) {
    sim.action('depth','oninput',depth); readings.push(sim.get('#springR').textContent);
    const block = sim.rectangles.find(r => r[2] === 70 && r[3] === 70);
    const surface = 600 * (.47 + .38 * .35);
    const fraction = Math.max(0, Math.min(1, (block[1] + 70 - surface) / 70));
    assert(Math.abs(fraction - Math.min(1, depth / 50)) < 1e-9);
  }
  assert.notEqual(readings[0], readings[1]); assert.equal(readings[2], readings[3]);
}
{
  const sim = setup('conduct');
  sim.action('sol','onchange','hcl'); sim.action('lower'); sim.action('power'); sim.frame();
  assert.equal(sim.get('#motorR').textContent,'回転');
  sim.action('sol','onchange','water'); assert.equal(sim.get('#sol').value,'hcl');
  sim.action('power'); sim.action('lower'); sim.action('sol','onchange','water');
  sim.action('lower'); sim.action('power'); sim.frame(); assert.equal(sim.get('#motorR').textContent,'回転');
  sim.action('power'); sim.action('lower'); sim.action('rinse');
  sim.action('lower'); sim.action('power'); sim.frame(); assert.equal(sim.get('#motorR').textContent,'停止');
}
{
  const sim = setup('work'); assert.equal(sim.get('#pull').max,10);
  sim.action('wmode','onchange','pulley'); assert.equal(sim.get('#pull').max,20);
  sim.action('wmode','onchange','slope'); assert.equal(sim.get('#pull').max,40);
}
{
  const sim = setup('potential'); sim.action('drop'); for(let i=0;i<30;i++) sim.frame();
  assert.notEqual(sim.get('#stakeR').textContent,'0 mm');
  sim.action('pheight','oninput',20); sim.frame(); assert.equal(sim.get('#stakeR').textContent,'0 mm');
}
for(const [lab, start, condition, value, readout] of [
  ['cartforce','cartStart','hang',100,'ctR'], ['incline','iStart','iang',20,'itR'],
]) {
  const sim=setup(lab);sim.action(start);sim.frame(25);assert.notEqual(sim.get('#'+readout).textContent,'0.00 s');
  sim.action(condition,'oninput',value);sim.frame();assert.equal(sim.get('#'+readout).textContent,'0.00 s');
}
console.log('PASS: 18 renderers initialize; regression checks for neutralization, directions, battery methods, buoyancy geometry, washing, work distance and trial resets.');
