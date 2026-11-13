/** Teaching colors, not photographic tissue colors. Match only identified anatomy. */
export function observationColor(name:string):string|undefined{
 const n=name.toLowerCase();
 if(/^(left|right) sclera$/.test(n))return '#e8e3dc';
 if(/^(left|right) iris$/.test(n))return '#78614d';
 if(/^(left|right) cornea$/.test(n))return '#b9d5d2';
 if(/^(left|right) lens$/.test(n))return '#d7e8e4';
 if(/^(left|right) vitreous body$/.test(n))return '#d6e4df';
 if(/^optic part of (left|right) retina$/.test(n))return '#d9907b';
 if(/^(left|right) optic nerve$/.test(n))return '#d5bf85';
 if(/^(left|right) choroid$/.test(n))return '#9e665c';
 // BodyParts3D's liver surface is divided into hepatovenous segments, some
 // classified as veins. Color the tissue itself rather than its system label.
 if(/^hepatovenous segment\b/.test(n)||n==='caudate lobe of liver')return '#a45f50';
 if(/^(left|right) kidney$/.test(n))return '#ad685d';
 if(n==='stomach')return '#c88980';
 if(n==='urinary bladder')return '#d0a195';
 return undefined;
}
