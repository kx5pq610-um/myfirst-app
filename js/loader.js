(async()=>{
  const parts=[
    'js/chunks/part01.txt',
    'js/chunks/part02.txt',
    'js/chunks/part03.txt',
    'js/chunks/part04.txt',
    'js/chunks/part05.txt',
    'js/chunks/part06.txt',
    'js/chunks/part07.txt',
    'js/chunks/part08.txt',
    'js/chunks/part09.txt',
    'js/chunks/part10.txt',
    'js/chunks/part11.txt'
  ];
  const code=(await Promise.all(parts.map(p=>fetch(p).then(r=>{if(!r.ok)throw new Error('load '+p);return r.text()})))).join('');
  (0,eval)(code);
})().catch(err=>{console.error(err);document.body.insertAdjacentHTML('beforeend',`<pre style="color:#fff;background:#600;padding:12px">Game load error: ${err.message}</pre>`);});
