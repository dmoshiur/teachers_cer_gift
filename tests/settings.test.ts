import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {TEMPLATES,SAMPLE} from '../src/templates/registry';
import {DEFAULT_SETTINGS,tributeSettingsSchema} from '../src/lib/tribute-settings';

describe('editable tribute content',()=>{
 it('applies editable content to every design, while escaping text',()=>{for(const t of TEMPLATES){const html=renderToStaticMarkup(createElement(t.Component,{teacher:SAMPLE,settings:{...DEFAULT_SETTINGS,classLabel:'CLASS IX',year:'2027',team:'NEW TEAM',website:'SCHOOL.EXAMPLE',tagline:'A NEW JOURNEY',closing:'Thank you, <teacher>!',paragraphs:DEFAULT_SETTINGS.paragraphs.map((v,i)=>i===0?'A custom opening.':v),organizers:DEFAULT_SETTINGS.organizers.map((v,i)=>i===0?'A Student':v)}}));expect(html,t.id).toContain('CLASS IX');expect(html,t.id).toContain('2027');expect(html,t.id).toContain('NEW TEAM');expect(html,t.id).toContain('SCHOOL.EXAMPLE');expect(html,t.id).toContain('A custom opening.');expect(html,t.id).toContain('Thank you, &lt;teacher&gt;!');expect(html,t.id).toContain('A Student')}});
 it('rejects messages too large for the design',()=>{expect(tributeSettingsSchema.safeParse({...DEFAULT_SETTINGS,paragraphs:Array(5).fill('a'.repeat(350))}).success).toBe(false)});
});
