import * as T from 'three';

/** Teaching shell around the original cavity, not measured myocardium.
 * Expand in the section plane only, so the inner/outer intersection contours
 * correspond exactly and the cut rim has no arbitrary filled-in cavity. */
export function createChamberWall(inner:T.BufferGeometry,id:string){
 inner.computeBoundingBox();
 const size=inner.boundingBox!.getSize(new T.Vector3());
 const thickness=id==='FJ2422'?.12:id==='FJ2423'?.065:.035;
 const sx=1+2*thickness/Math.max(size.x,.1),sy=1+2*thickness/Math.max(size.y,.1);
 const outerGeometry=inner.clone();outerGeometry.scale(sx,sy,1);outerGeometry.computeVertexNormals();
 const outer=new T.Mesh(outerGeometry,new T.MeshStandardMaterial({color:'#a95851',roughness:.62,side:T.FrontSide}));
 const positions=inner.getAttribute('position'),indices=inner.getIndex()!;
 const rimPositions:number[]=[];
 for(let i=0;i<indices.count;i+=3){
  const vertices=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(positions,indices.getX(i+j)));
  const crossings:T.Vector3[]=[];
  for(let j=0;j<3;j++){
   const a=vertices[j],b=vertices[(j+1)%3];
   if((a.z<=0&&b.z>0)||(b.z<=0&&a.z>0))crossings.push(a.clone().lerp(b,-a.z/(b.z-a.z)));
  }
  if(crossings.length!==2||crossings[0].distanceToSquared(crossings[1])<1e-16)continue;
  const [a,b]=crossings,oa=new T.Vector3(a.x*sx,a.y*sy,0),ob=new T.Vector3(b.x*sx,b.y*sy,0);
  for(const p of [a,oa,b,b,oa,ob])rimPositions.push(p.x,p.y,0);
 }
 const rimGeometry=new T.BufferGeometry();rimGeometry.setAttribute('position',new T.Float32BufferAttribute(rimPositions,3));rimGeometry.computeVertexNormals();
 const rim=new T.Mesh(rimGeometry,new T.MeshStandardMaterial({color:'#df9a87',roughness:.8,side:T.DoubleSide}));
 // Rim is already on the section plane: don't clip it again (avoids flicker).
 return {outer,rim,dispose(){outerGeometry.dispose();outer.material.dispose();rimGeometry.dispose();rim.material.dispose();}};
}
