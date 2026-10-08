import type {Atlas,Concept,SystemId} from './anatomy';

/** Use source organ membership, including internal walls and vessels. */
const ORGAN_NAMES=[
 'heart','right lung','left lung','liver','brain','right eye','left eye',
 'right kidney','left kidney','stomach','small intestine','large intestine',
 'pancreas','spleen','urinary bladder','esophagus','trachea','diaphragm',
 'right ureter','left ureter','urethra','spinal cord','external ear',
 'aorta','superior vena cava','inferior vena cava',
 'skull','vertebral column','rib cage','right hand','left hand','right foot','left foot',
];

// Some rendered meshes use a combined name absent from the source organ hierarchy.
const EXTRA_PARTS:Record<string,string[]>={
 heart:['wall of ventricle'],
 brain:['interventricular foramen','choroid plexus of cerebral hemisphere'],
 'right eye':['optic part of right retina','right corona ciliaris','right common tendinous ring','anterior chamber of right eyeball','right optic nerve'],
 'left eye':['optic part of left retina','left corona ciliaris','left common tendinous ring','anterior chamber of left eyeball','left optic nerve'],
 'large intestine':['appendix'],
 liver:['left duct of caudate lobe of liver'],
};

export function learningSelections(atlas:Atlas):Map<string,Concept>{
 const concepts=new Map(atlas.concepts.map(c=>[c.name.toLowerCase(),c]));
 const partIds=new Set(atlas.parts.map(p=>p.id));
 const lookup=new Map<string,Concept>();
 for(const name of ORGAN_NAMES){
  const source=concepts.get(name);
  const extras=atlas.parts.filter(p=>EXTRA_PARTS[name]?.includes(p.name.toLowerCase())).map(p=>p.id);
  const concept=source?{...source,elements:[...new Set([...source.elements,...extras])].filter(id=>partIds.has(id)&&!lookup.has(id))}:undefined;
  if(concept)for(const id of concept.elements)if(!lookup.has(id))lookup.set(id,concept);
 }
 const byId=new Map(atlas.concepts.map(c=>[c.id,c]));
 for(const part of atlas.parts)if(!lookup.has(part.id))lookup.set(part.id,byId.get(part.conceptId)??{id:part.conceptId,name:part.name,elements:[part.id]});
 return lookup;
}

export function toggleGroup(selected:string[],elements:string[]):string[]{
 const group=new Set(elements);
 return elements.every(id=>selected.includes(id))?selected.filter(id=>!group.has(id)):[...new Set([...selected,...elements])];
}

export function learningSystem(name:string|undefined,fallback:SystemId):SystemId{
 const n=name?.toLowerCase();
 if(n==='heart')return 'cardiac';
 if(['right lung','left lung','trachea'].includes(n??''))return 'respiratory';
 if(['liver','stomach','small intestine','large intestine','pancreas','esophagus'].includes(n??''))return 'digestive';
 if(['brain','spinal cord'].includes(n??''))return 'nervous';
 if(['right eye','left eye','external ear'].includes(n??''))return 'sensory';
 if(['skull','vertebral column','rib cage','right hand','left hand','right foot','left foot'].includes(n??''))return 'skeletal';
 return fallback;
}
