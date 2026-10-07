import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {localizeAnatomyName, anatomyNameHint} from '../app/anatomy.ts';
import {atlasTools} from '../app/agent-tools.ts';

const atlas=JSON.parse(readFileSync(new URL('../public/models/atlas.json',import.meta.url)));
const dictionary=JSON.parse(readFileSync(new URL('../app/anatomy-names-ja.json',import.meta.url)));
for(const entry of [...atlas.parts,...atlas.concepts]){
 const key=entry.name.trim().toLowerCase();
 assert.ok(dictionary[key],`${entry.id}: missing dictionary entry ${entry.name}`);
 const label=localizeAnatomyName(entry.name);
 assert.ok(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(label),entry.name);
 assert.ok(!/[a-zA-Z]|未登録|\|/.test(label),`${entry.name}: ${label}`);
}
const examples={
 'Left femur':'左大腿骨',
 'right infraspinatus muscle':'右棘下筋',
 'right common carotid artery':'右総頸動脈',
 'left optic nerve':'左視神経',
 'trunk of left coronary artery':'左冠状動脈の幹',
 'long head of left biceps femoris':'左大腿二頭筋の長頭',
 'cavity of left ventricle':'左心室',
 'left side of heart':'心臓の左側',
};
for(const [source,expected] of Object.entries(examples))assert.equal(localizeAnatomyName(source),expected);
assert.ok(atlas.concepts.some(c=>localizeAnatomyName(c.name).includes('大腿骨')));
assert.ok(anatomyNameHint('medial head of left gastrocnemius').includes('ふくらはぎ'));
assert.ok(anatomyNameHint('left optic nerve').includes('人体自身'));
let selected;
const [find,inspect]=atlasTools(atlas,c=>{selected=c;});
const japaneseResults=find.execute({query:'大腿骨'});
assert.ok(japaneseResults.length>0);
assert.ok(japaneseResults.every(r=>!/[a-zA-Z]/.test(r.name)));
assert.equal(inspect.execute({id:japaneseResults[0].id}).name,japaneseResults[0].name);
assert.equal(selected.id,japaneseResults[0].id);
console.log(`PASS: Japanese names for all ${atlas.parts.length} selectable parts and ${atlas.concepts.length} searchable structures; representative labels and learning hints.`);
