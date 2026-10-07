import * as T from 'three';

/** Share geometry and state textures: opacity never needs 2,234 separate meshes. */
export function configureAtlasMaterial(material:T.MeshStandardMaterial,partTexture:T.DataTexture,selectionTexture:T.DataTexture,width:number,faded:boolean){
 material.customProgramCacheKey=()=>`atlas-parts-${faded?'faded':'solid'}`;
 material.onBeforeCompile=shader=>{
  shader.uniforms.partState={value:partTexture};shader.uniforms.selectionState={value:selectionTexture};shader.uniforms.stateWidth={value:width};
  shader.vertexShader='attribute float partIndex; uniform sampler2D partState; uniform sampler2D selectionState; uniform float stateWidth; varying float partVisible; varying float partSelected; varying float partFaded;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec2 stateUv = vec2((partIndex + 0.5) / stateWidth, 0.5); vec4 state = texture2D(partState, stateUv); vec4 selection = texture2D(selectionState, stateUv); transformed += state.xyz; partVisible = state.w; partSelected = selection.r; partFaded = selection.g;');
  shader.fragmentShader='varying float partVisible; varying float partSelected; varying float partFaded;\n'+shader.fragmentShader;
  const reject=faded?'partFaded < 0.5':'partFaded > 0.5';
  shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>\nif (partVisible < 0.5 || ${reject}) discard;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.85, 0.78), partSelected * 0.75);');
 };
}
