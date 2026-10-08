import type {Part} from './anatomy';
import type {Concept} from './anatomy';
export interface LayoutCell {x:number;y:number;width:number;height:number}
/** Pack only visible source meshes. Every projected bounding box gets its own cell. */
export function createExplosionLayout(parts:Part[],aspect=1){
 const cards=parts.map(p=>({id:p.id,system:p.system,width:Math.max(.035,p.bounds[1][0]-p.bounds[0][0])+.04,height:Math.max(.035,p.bounds[1][1]-p.bounds[0][1])+.04}));
 const area=cards.reduce((n,c)=>n+c.width*c.height,0),maxWidth=Math.max(.3,...cards.map(c=>c.width));
 const targetWidth=Math.max(maxWidth,Math.sqrt(area*Math.max(.5,Math.min(1.5,aspect)))*1.18);
 cards.sort((a,b)=>b.height-a.height||a.id.localeCompare(b.id));
 const cells=new Map<string,LayoutCell>();let x=0,y=0,row=0,usedWidth=0;
 for(const c of cards){if(x>0&&x+c.width>targetWidth){x=0;y+=row;row=0;}cells.set(c.id,{x:x+c.width/2,y:-y-c.height/2,width:c.width,height:c.height});x+=c.width;usedWidth=Math.max(usedWidth,x);row=Math.max(row,c.height);}
 const height=y+row;
 cells.forEach(c=>{c.x-=usedWidth/2;c.y+=height/2;});
 return {cells,width:usedWidth,height};
}

/** Pack organs as units; every mesh keeps its original position within its organ. */
export function createOrganExplosionLayout(parts:Part[],groups:Map<string,Concept>,aspect=1){
 const organs=new Map<string,Part[]>();
 for(const part of parts){const id=groups.get(part.id)?.id??part.id;const list=organs.get(id)??[];list.push(part);organs.set(id,list);}
 const proxies=[...organs].map(([id,meshes])=>({...meshes[0],id,bounds:[
  [0,1,2].map(axis=>Math.min(...meshes.map(p=>p.bounds[0][axis]))),
  [0,1,2].map(axis=>Math.max(...meshes.map(p=>p.bounds[1][axis])))
 ] as [number[],number[]]}));
 const layout=createExplosionLayout(proxies,aspect),offsets=new Map<string,number[]>();
 for(const proxy of proxies){const cell=layout.cells.get(proxy.id)!;const center=[0,1,2].map(axis=>(proxy.bounds[0][axis]+proxy.bounds[1][axis])/2);for(const part of organs.get(proxy.id)!)offsets.set(part.id,[cell.x-center[0],cell.y+.85-center[1],-center[2]]);}
 return {...layout,offsets};
}
