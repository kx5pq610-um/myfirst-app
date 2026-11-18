import type { Atlas } from './anatomy';

export const HEART_VESSEL_IDS = ['FJ2966', 'FJ3413', 'FJ3441', 'FJ3645', 'FJ2925', 'FJ2933', 'FJ2944', 'FJ2950', 'FJ2955', 'FJ3020', 'FJ3040'];

export function organParts(atlas: Atlas, kind: 'heart' | 'eye') {
 const names = kind === 'heart' ? ['heart', 'wall of ventricle'] : ['right eye', 'right optic nerve'];
 const ids = new Set(atlas.concepts.filter(concept => names.includes(concept.name.toLowerCase())).flatMap(concept => concept.elements));
 if (kind === 'heart') {
  for (const id of HEART_VESSEL_IDS) ids.add(id);
  return atlas.parts.filter(part => ids.has(part.id));
 }
 const opticId = atlas.parts.find(part => part.name.toLowerCase() === 'right optic nerve')?.id;
 return atlas.parts.filter(part =>
  (ids.has(part.id) || /right (retina|sclera|choroid|vitreous)/i.test(part.name)) &&
  !/eyelid|tarsal|lacrimal|conjunctiva|rectus|oblique|levator|eyelash|skin|vessel/i.test(part.name) &&
  (part.name.toLowerCase() !== 'right optic nerve' || part.id === opticId));
}
