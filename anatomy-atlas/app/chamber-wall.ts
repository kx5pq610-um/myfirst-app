import * as T from 'three';

/** A thin teaching shell following the actual BodyParts3D cavity.
 * It is a rim, not a cap: no triangles span or fill the cavity opening.
 * Wall thickness is illustrative, never a measured myocardium thickness. */
export function createChamberWall(inner:T.BufferGeometry,id:string,cutZ=0){
 inner.computeBoundingBox();
 const size=inner.boundingBox!.getSize(new T.Vector3());
 const thickness=id==='FJ2422'?.095:id==='FJ2423'?.05:.025;
 const sx=1+2*thickness/Math.max(size.x,.1),sy=1+2*thickness/Math.max(size.y,.1);
 const outerGeometry=inner.clone();outerGeometry.scale(sx,sy,1);outerGeometry.computeVertexNormals();
 const outer=new T.Mesh(outerGeometry,new T.MeshStandardMaterial({color:'#ac5851',roughness:.56,side:T.FrontSide}));
 const positions=inner.getAttribute('position'),indices=inner.getIndex()!;
 const rimPositions:number[]=[];
 for(let i=0;i<indices.count;i+=3){
  const vertices=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(positions,indices.getX(i+j)));
  const crossings:T.Vector3[]=[];
  for(let j=0;j<3;j++){
   const a=vertices[j],b=vertices[(j+1)%3];
   if((a.z<=cutZ&&b.z>cutZ)||(b.z<=cutZ&&a.z>cutZ))crossings.push(a.clone().lerp(b,(cutZ-a.z)/(b.z-a.z)));
  }
  if(crossings.length!==2||crossings[0].distanceToSquared(crossings[1])<1e-16)continue;
  const [a,b]=crossings,oa=new T.Vector3(a.x*sx,a.y*sy,cutZ),ob=new T.Vector3(b.x*sx,b.y*sy,cutZ);
  for(const p of [a,oa,b,b,oa,ob])rimPositions.push(p.x,p.y,p.z);
 }
 const rimGeometry=new T.BufferGeometry();rimGeometry.setAttribute('position',new T.Float32BufferAttribute(rimPositions,3));rimGeometry.computeVertexNormals();
 const rim=new T.Mesh(rimGeometry,new T.MeshStandardMaterial({color:'#edab8e',roughness:.72,side:T.DoubleSide}));
 return {outer,rim,dispose(){outerGeometry.dispose();outer.material.dispose();rimGeometry.dispose();rim.material.dispose();}};
}
