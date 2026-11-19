import {z} from 'zod';
const photo=z.string().max(210000).refine(value=>{
 if(value.startsWith('data:image/webp;base64,')){const data=value.slice('data:image/webp;base64,'.length);if(!/^[A-Za-z0-9+/]+={0,2}$/.test(data))return false;const bytes=Buffer.from(data,'base64');return bytes.length<=150*1024&&bytes.length>=12&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'}
 try{const url=new URL(value);return url.protocol==='https:'&&url.hostname.endsWith('.public.blob.vercel-storage.com')}catch{return false}
},'Invalid photo');
export const teacherSchema=z.object({name:z.string().trim().min(1).max(80),role:z.string().trim().min(1).max(80),templateId:z.enum(['floral','premium','navy-gold','boxed']),photoUrl:photo.nullable().optional()});
