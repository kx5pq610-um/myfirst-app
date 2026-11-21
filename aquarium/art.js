'use strict';

const aquariumArt = (() => {
  const assetRoot = new URL('assets/', document.currentScript.src);
  const columns = 5;
  const frames = 20;
  const fishSprites = {
    guppy: { width: 192, height: 108, tankWidth: 77, anchorX: .624, anchorY: .4723 },
    betta: { width: 208, height: 156, tankWidth: 100, anchorX: .6252, anchorY: .4554 },
    discus: { width: 208, height: 192, tankWidth: 105, anchorX: .5447, anchorY: .4974 },
    medaka: { width: 176, height: 62, tankWidth: 75, anchorX: .5787, anchorY: .4768 },
    newt: { width: 240, height: 80, tankWidth: 173, anchorX: .5908, anchorY: .4725 },
  };
  const decorTypes = {
    anubias: { name: 'アヌビアス', size: 116, top: 53 },
    grass: { name: 'バリスネリア', size: 170, top: 9 },
    wood: { name: '流木', size: 196, top: 97 },
    rock: { name: '青龍石', size: 132, top: 72 },
    cave: { name: '素焼きの隠れ家', size: 125, top: 80 },
    air: { name: 'エアストーン', size: 55, top: 53 },
  };
  const decorKeys = Object.keys(decorTypes);
  const foodColumns = ['flake', 'pellet', 'tablet', 'bloodworm', 'brine'];
  const foodWobble = [.75, .16, .32, .48, .58];
  const facing = new WeakMap();
  const shoreImages = {};
  let tintedShore;
  let shoreTintKey;

  function loadImage(path) {
    const image = new Image();
    image.src = new URL(path, assetRoot).href;
    return image;
  }

  const foodSheet = loadImage('food.webp');
  const decorSheet = loadImage('decor.webp');
  let aquascape, stream, substrateSheet;
  function preload(kinds, habitat) {
    for (const kind of kinds) {
      const sprite = fishSprites[kind];
      if (sprite) sprite.swim ??= loadImage(`fish/${kind}-swim.webp`);
    }
    if (habitat === 'newt') {
      stream ??= loadImage('stream.webp');
      fishSprites.newt.motion ??= loadImage('fish/newt-motion.webp');
      fishSprites.newt.walk ??= loadImage('fish/newt-walk.webp');
      for(const material of ['moss','wood','cork']){
        shoreImages[material] ??= loadImage(`shore/${material}.webp`);
      }
    }
    else aquascape ??= loadImage('aquascape.webp');
  }

  function drawRiparium(ctx, image, width, height, aspect, waterline, backdrop, time) {
    const sw = Math.min(image.naturalWidth, image.naturalHeight * aspect);
    const sx = (image.naturalWidth - sw) / 2;
    const bankEdge = Math.round(image.naturalHeight * .183);
    const underwater = Math.round(image.naturalHeight * .219);
    const bed = Math.round(image.naturalHeight * .723);
    const ground = height * .723;
    const airWidth=Math.min(sw,bankEdge*aspect*height/waterline*1.55);
    ctx.drawImage(image,(image.naturalWidth-airWidth)/2,0,airWidth,bankEdge,0,0,width,waterline);
    if (backdrop) {
      ctx.drawImage(image, sx, underwater, sw, bed - underwater, 0, waterline, width, ground - waterline);
      ctx.drawImage(image, sx, bed, sw, image.naturalHeight - bed, 0, ground, width, height - ground);
    }
    ctx.save();
    const reflection = ctx.createLinearGradient(0, waterline - 2, 0, waterline + 23);
    reflection.addColorStop(0,'transparent');
    reflection.addColorStop(.14,'#a4d0ad80');
    reflection.addColorStop(1,'transparent');
    ctx.fillStyle=reflection;
    ctx.fillRect(0,waterline-2,width,25);
    ctx.lineWidth=1.2;
    ctx.strokeStyle='#c0dfbb4d';
    ctx.beginPath();
    for(let x=0;x<=width;x+=12){
      const y=waterline+Math.sin(x*.029-time*.0017)*1.25+Math.sin(x*.061+time*.0027)*.5;
      ctx.lineTo(x,y);
    }
    ctx.stroke();ctx.restore();
  }

  function drawScene(ctx, width, height, pixelAspect, lit, t, habitat, backdrop, waterline) {
    const image = habitat === 'newt' ? stream : aquascape;
    const aspect = width / height * pixelAspect;
    if (habitat !== 'newt' && backdrop && !image?.naturalWidth) return false;
    if (habitat !== 'newt' && backdrop) {
      const sw = Math.min(image.naturalWidth, image.naturalHeight * aspect);
      const sh = Math.min(image.naturalHeight, image.naturalWidth / aspect);
      const sy = (image.naturalHeight - sh) * .85;
      ctx.drawImage(image, (image.naturalWidth - sw) / 2, sy, sw, sh, 0, 0, width, height);
    } else {
      const water = ctx.createLinearGradient(0, 0, 0, height);
      water.addColorStop(0, '#19494c');
      water.addColorStop(.64, '#0c292b');
      water.addColorStop(1, '#091a20');
      ctx.fillStyle = water;
      ctx.fillRect(0, 0, width, height);
      if (habitat === 'newt' && image?.naturalWidth) drawRiparium(ctx,image,width,height,aspect,waterline,backdrop,t);
      else if (habitat === 'newt') {
        ctx.fillStyle='#34453a';
        ctx.fillRect(0,0,width,waterline);
        ctx.fillStyle='#a4d0ad70';
        ctx.fillRect(0,waterline,width,2);
      }
    }

    ctx.save();
    if (!lit) {
      ctx.fillStyle = 'rgba(1, 13, 25, .57)';
      ctx.fillRect(0, 0, width, height);
    }
    const glow = ctx.createRadialGradient(width * (.47 + Math.sin(t * .00032) * .15),
      0, 6, width * .52, height * .14, width * .51);
    glow.addColorStop(0, lit ? '#bed9af26' : '#739eb814');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = lit ? '#cae4d340' : '#8eb8c520';
    for (let i = 0; i < 25; i++) {
      const x = (i * 141.37 + t * (.0015 + i % 3 * .0009)) % width;
      const top = habitat === 'newt' ? waterline : 0;
      const y = top + (i * 97.41 + 10 + Math.sin(t * .00064 + i) * 10) % (height - top - 45);
      ctx.fillRect(x, y, 1.3 + i % 3 * .42, 1.3 * pixelAspect);
    }
    ctx.restore();
    return true;
  }

  function drawFish(ctx, fish, adultSize, pixelAspect, pose) {
    const sprite = fishSprites[fish.kind];
    const animation = pose && ['walk','wait','bankWalk','hide'].includes(pose.mode) ? sprite?.walk : sprite?.motion;
    const image = animation?.naturalWidth ? animation : sprite?.swim;
    if (!image?.naturalWidth) return false;

    const previous = facing.get(fish);
    const phaseChange = previous ? Math.max(0, fish.tail - previous.phase) : 0;
    const yaw = pose?.yaw ?? (previous
      ? previous.yaw + (fish.direction - previous.yaw) * (1 - Math.exp(-2.3 * phaseChange))
      : fish.direction);
    if (!pose) facing.set(fish, { yaw, phase: fish.tail });
    const turn = Math.sign(yaw) || fish.direction;
    const depthScale = pose?.scale ?? (.91 + .19 * fish.y / 620);
    const width = sprite.tankWidth * fish.size / adultSize * depthScale;
    const height = width * sprite.height / sprite.width;
    const frame = Math.floor(fish.tail / (Math.PI * 2) * frames) % frames;
    const pitch = pose?.pitch ?? Math.max(-.18, Math.min(.18, fish.vy * .022 / pixelAspect));

    ctx.save();
    ctx.translate(fish.x, fish.y);
    const headOn=pose ? .42 : .2;
    ctx.scale(turn * (headOn + (1-headOn) * Math.abs(yaw)), pixelAspect);
    ctx.rotate(pitch);
    ctx.globalAlpha = Math.max(.45, Math.min(1, fish.health / 85)) * (pose?.opacity ?? 1);
    ctx.drawImage(image, (frame % columns) * sprite.width,
      Math.floor(frame / columns) * sprite.height, sprite.width, sprite.height,
      -width * sprite.anchorX, -height * sprite.anchorY, width, height);
    ctx.restore();
    return true;
  }

  function drawPortrait(ctx, kind, width, height) {
    const sprite = fishSprites[kind];
    if (!sprite) return false;
    // The high-resolution image is only needed when a fish is inspected.
    sprite.portrait ??= loadImage(`fish/${kind}.webp`);
    const image = sprite.portrait;
    if (!image.naturalWidth) return false;
    const scale = Math.min(width * .91 / image.naturalWidth, height * .88 / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
    return true;
  }

  function drawFood(ctx, food, pixelAspect) {
    if (!foodSheet.naturalWidth) return false;
    const index = Math.max(0, foodColumns.indexOf(food.kind));
    const angle = food.y >= 539 ? 0 : Math.sin(food.age * .075 + food.r * 8) * foodWobble[index];
    const size = food.r * (index === 2 || index === 3 ? 4.5 : 3.3);
    ctx.save();
    ctx.translate(food.x, food.y);
    ctx.scale(1, pixelAspect);
    ctx.rotate(angle);
    ctx.drawImage(foodSheet, index * 64, 0, 64, 64, -size / 2, -size / 2, size, size);
    ctx.restore();
    return true;
  }

  function drawSubstrate(ctx, kind, width, height, lit) {
    if (kind === 'natural') return;
    substrateSheet ??= loadImage('substrate.webp');
    if (!substrateSheet.naturalWidth) return;
    ctx.save();
    ctx.globalAlpha = lit ? 1 : .55;
    ctx.drawImage(substrateSheet, kind === 'gravel' ? 640 : 0, 0, 640, 240,
      0, height - 96, width, 96);
    ctx.restore();
  }

  function decorBounds(item, pixelAspect) {
    const { size, top } = decorTypes[item.kind];
    const left = item.x - size / 2;
    const y = item.y - size * pixelAspect * (197 - top) / 200;
    return { left, top: y, width: size, height: item.y - y };
  }

  function drawDecor(ctx, item, pixelAspect, lit, time) {
    if (!decorSheet.naturalWidth) return;
    const { size } = decorTypes[item.kind];
    const height = size * pixelAspect;
    ctx.save();
    ctx.translate(item.x, item.y);
    if (item.kind === 'grass' || item.kind === 'anubias') {
      ctx.transform(1, 0, Math.sin(time * .0015 + item.x * .024) * .065 / pixelAspect, 1, 0, 0);
    }
    ctx.globalAlpha = lit ? 1 : .65;
    ctx.drawImage(decorSheet, decorKeys.indexOf(item.kind) * 200, 0, 200, 200,
      -size / 2, -height * .985, size, height);
    ctx.restore();
  }

  function drawShore(ctx, bank, pixelAspect, lit) {
    if(bank.style==='slate') shoreImages.slate ??= loadImage('shore/slate.webp');
    const image=shoreImages[bank.style];
    ctx.save();
    ctx.globalAlpha=lit?1:.63;
    if(image?.naturalWidth){
      const key=bank.style+bank.waterline;
      if(shoreTintKey!==key){
        tintedShore ??= document.createElement('canvas');
        tintedShore.width=image.naturalWidth;
        tintedShore.height=image.naturalHeight;
        const scratch=tintedShore.getContext('2d');
        scratch.drawImage(image,0,0);
        const y=Math.max(0,(bank.waterline-bank.top)/bank.height*tintedShore.height);
        if(y<tintedShore.height){
          scratch.globalCompositeOperation='source-atop';
          scratch.fillStyle='#153c4470';
          scratch.fillRect(0,y,tintedShore.width,tintedShore.height-y);
        }
        shoreTintKey=key;
      }
      ctx.save();
      ctx.translate(bank.edge,bank.top);
      ctx.scale(bank.direction,1);
      ctx.drawImage(tintedShore,0,0,bank.width,bank.height);
      ctx.restore();
    }else{
      ctx.fillStyle=bank.style==='slate'?'#72756e':bank.style==='moss'?'#546348':'#685043';
      ctx.beginPath();
      ctx.moveTo(bank.edge,bank.top+bank.height);
      for(let i=0;i<=20;i++) ctx.lineTo(bank.atX(i/20),bank.atY(i/20));
      ctx.lineTo(bank.atX(1),bank.top+bank.height);
      ctx.fill();
    }
    if(bank.hide){
      const {x,y,width}=bank.hide;
      const height=width*.45*pixelAspect;
      const cork=shoreImages.cork;
      if(cork?.naturalWidth) ctx.drawImage(cork,x-width/2,y-height,width,height);
      else {
        ctx.fillStyle='#594535';ctx.beginPath();
        ctx.ellipse(x,y,width*.5,height,0,Math.PI,Math.PI*2);ctx.fill();
        ctx.fillStyle='#241e17';ctx.beginPath();
        ctx.ellipse(x,y,width*.34,height*.60,0,Math.PI,Math.PI*2);ctx.fill();
      }
    }
    ctx.restore();
  }

  return { preload, drawScene, drawFish, drawPortrait, drawFood, drawSubstrate, drawDecor, drawShore, decorBounds, decorTypes };
})();
