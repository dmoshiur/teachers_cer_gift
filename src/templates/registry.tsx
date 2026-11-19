'use client';
import React, { useId } from 'react';
import floral from './floral.json';
import premium from './premium.json';
import navy from './navy-gold.json';
import boxed from './boxed.json';
import { DEFAULT_SETTINGS, DEFAULT_PARAGRAPHS, DEFAULT_ORGANIZERS, type TributeSettings } from '@/lib/tribute-settings';
export type { TributeSettings } from '@/lib/tribute-settings';

export type TemplateId = 'floral'|'premium'|'navy-gold'|'boxed';
export type Teacher = { id?: string; name:string; role:string; photoUrl?:string|null; templateId:TemplateId };
export type TemplateProps = { teacher:Teacher; settings?:TributeSettings };
export type TemplateDef = { id:TemplateId; name:string; description:string; palette:string[]; tags:string[]; Component:React.FC<TemplateProps> };
const escape = (s:string) => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
const create = (id:TemplateId, data:{css:string;html:string}):React.FC<TemplateProps> => function Template({teacher,settings=DEFAULT_SETTINGS}) {
 const unique = useId().replace(/[^a-zA-Z0-9]/g,'');
 let html = data.html.replaceAll('{{NAME}}',escape(teacher.name)).replaceAll('{{ROLE}}',escape(teacher.role)).replaceAll('{{PHOTO_IMG}}',teacher.photoUrl ? `<img class="pimg" src="${escape(teacher.photoUrl)}" alt="" />` : '');
 // SVG paint servers are document-global: make them unique for every live preview.
 const ids = [...html.matchAll(/\bid="([\w-]+)"/g)].map(m=>m[1]);
 for (const old of ids) { html=html.replaceAll(`id="${old}"`,`id="${unique}-${old}"`).replaceAll(`url(#${old})`,`url(#${unique}-${old})`); }
 // Only replace literal template text. All editable content is escaped before insertion.
 if(id==='boxed' && settings.classLabel!==DEFAULT_SETTINGS.classLabel) html=html.replace(/(<div class="cv">)[\s\S]*?(<\/div>)/,(_,start,end)=>`${start}${escape(settings.classLabel)}${end}`);
 html=html.replaceAll('CLASS VIII',escape(settings.classLabel)).replaceAll('2026',escape(settings.year)).replaceAll('FSD TEAM',escape(settings.team)).replaceAll('THAMJJ13.TOP',escape(settings.website)).replaceAll('THAMJJ13. TOP',escape(settings.website)).replaceAll('A GUIDING LIGHT IN OUR JOURNEY',escape(settings.tagline));
 for(let i=0;i<DEFAULT_PARAGRAPHS.length;i++) html=html.replaceAll(DEFAULT_PARAGRAPHS[i],escape(settings.paragraphs[i]));
 html=html.replaceAll(DEFAULT_SETTINGS.closing,escape(settings.closing)).replace('You will always be a cherished part <b>of our story.</b>',escape(settings.closing));
 html=html.replaceAll(DEFAULT_SETTINGS.quote,escape(settings.quote));
 DEFAULT_ORGANIZERS.forEach((name,i)=>{html=html.replaceAll(`>${name}<`,`>${escape(settings.organizers[i])}<`)});
 const size = teacher.name.length > 36 ? '12pt' : teacher.name.length > 25 ? '16pt' : undefined;
 const css=data.css+`.tpl-${id} .name,.tpl-${id} .nm{font-family:${id==='navy-gold'?"Poppins,'Hind Siliguri',sans-serif":"Lora,'Hind Siliguri',serif"};overflow-wrap:anywhere}.tpl-${id} .role{font-family:Poppins,'Hind Siliguri',sans-serif;overflow-wrap:anywhere;max-width:85%;text-align:center}${size ? `.tpl-${id}[data-instance="${unique}"] .name,.tpl-${id}[data-instance="${unique}"] .nm{font-size:${size}}` : ''}`;
 return <div className={`tpl-${id}`} data-instance={unique}><style dangerouslySetInnerHTML={{__html:css}}/><div dangerouslySetInnerHTML={{__html:html}} /></div>;
};
export const TEMPLATES:TemplateDef[] = [
 {id:'floral',name:'The Floral',description:'A heartfelt classic, framed in flowers and joy.',palette:['#d3217b','#f2b71b','#0e9aa0','#5a2a9b'],tags:['MOST LOVED','FLORAL'],Component:create('floral',floral)},
 {id:'premium',name:'The Celebration',description:'A colorful tribute for a truly colorful impact.',palette:['#d3217b','#f28a1b','#0e9aa0','#5a2a9b'],tags:['COLORFUL'],Component:create('premium',premium)},
 {id:'navy-gold',name:'The Scholar',description:'A timeless, distinguished design in navy and gold.',palette:['#17336b','#e5a91a','#0e9aa0','#a9c9ed'],tags:['CLASSIC'],Component:create('navy-gold',navy)},
 {id:'boxed',name:'The Keepsake',description:'A vibrant frame for words worth keeping forever.',palette:['#5a2a9b','#d3217b','#f28a1b','#0e9aa0'],tags:['VIBRANT'],Component:create('boxed',boxed)},
];
export const SAMPLE:Teacher={name:'Mohammad Rahim Uddin',role:'Assistant Teacher (English)',templateId:'floral'};
export function TemplateFrame({id,teacher=SAMPLE,scale=.3,settings}:{id:TemplateId;teacher?:Teacher;scale?:number;settings?:TributeSettings}) { const Component=TEMPLATES.find(t=>t.id===id)?.Component || TEMPLATES[0].Component; return <div style={{width:`${793.7*scale}px`,height:`${1122.5*scale}px`,overflow:'hidden',flexShrink:0}}><div style={{transform:`scale(${scale})`,transformOrigin:'top left',width:'210mm',height:'297mm'}}><Component teacher={teacher} settings={settings}/></div></div> }
