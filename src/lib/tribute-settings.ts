import {z} from 'zod';
export const DEFAULT_PARAGRAPHS = [
'Some people teach us lessons, while some teach us how to live. You have been both in our lives.',
'Throughout this beautiful year, you have been more than just a teacher to us. You have been our guide, inspiration, mentor, and a constant source of encouragement. Every lesson, every word of advice, and every moment spent guiding us has become a precious part of our memories.',
'We may forget some chapters of our textbooks, but we will never forget the lessons of life you taught us. Your patience, kindness, dedication, and belief in us have made a difference that words can hardly express.',
'As our Class 8 journey comes to an end, we look back with countless memories and grateful hearts. Classrooms may change and paths may separate, but your influence will remain with us forever.',
'This little tribute is a humble expression of our immense gratitude. No gift could ever measure the value of your guidance or repay the kindness you have shown us.'
];
export const DEFAULT_ORGANIZERS=['Moshiur','Sabit','Bappi','Siam','Al-Rafi','Nahid','Rohan','Sohan'];
export const DEFAULT_SETTINGS={classLabel:'CLASS VIII',year:'2026',team:'FSD TEAM',website:'THAMJJ13.TOP',tagline:'A GUIDING LIGHT IN OUR JOURNEY',paragraphs:DEFAULT_PARAGRAPHS,closing:'You will always be a cherished part of our story.',quote:'“The memories we make today become the treasures we carry forever.”',organizers:DEFAULT_ORGANIZERS,defaultTemplate:'floral' as const, enabledTemplates:['floral','premium','navy-gold','boxed'] as ('floral'|'premium'|'navy-gold'|'boxed')[],showTeachersPublicly:false};
const short=z.string().trim().min(1).max(40);
// Strip removed organizer names (and cap at the new count) so previously stored settings/backups stay valid.
const stripRemovedOrganizers=(v:unknown)=>Array.isArray(v)?v.filter((n)=>typeof n==='string'&&!['huzaifa','tanvir'].includes(n.trim().toLowerCase())).slice(0,8):v;
export const tributeSettingsSchema=z.object({classLabel:short,year:z.string().trim().min(1).max(10),team:short,website:short,tagline:z.string().trim().min(1).max(75),paragraphs:z.array(z.string().trim().min(1).max(350)).length(5).refine(p=>p.join(' ').length<=1200,'Message is too long for one page'),closing:z.string().trim().min(1).max(90),quote:z.string().trim().min(1).max(120),organizers:z.preprocess(stripRemovedOrganizers,z.array(short).length(8)),defaultTemplate:z.enum(['floral','premium','navy-gold','boxed']),enabledTemplates:z.array(z.enum(['floral','premium','navy-gold','boxed'])).min(1),showTeachersPublicly:z.boolean()}).refine(s=>s.enabledTemplates.includes(s.defaultTemplate),{message:'Default template must be enabled',path:['defaultTemplate']});
export type TributeSettings=z.infer<typeof tributeSettingsSchema>;
