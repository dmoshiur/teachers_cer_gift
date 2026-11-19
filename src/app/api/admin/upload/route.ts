import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import { requireSession,sameOrigin } from '@/lib/auth';
export const runtime='nodejs';
export async function POST(req:Request){
 if(!await requireSession())return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!await sameOrigin())return NextResponse.json({error:'Invalid origin'},{status:403});
 const form=await req.formData().catch(()=>null);const file=form?.get('photo');
 if(!(file instanceof File)||file.size>150*1024||file.size<12)return NextResponse.json({error:'Upload must be a WebP image no larger than 150 KB'},{status:400});
 const bytes=Buffer.from(await file.arrayBuffer());
 if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')return NextResponse.json({error:'Invalid WebP image'},{status:400});
 if(process.env.BLOB_READ_WRITE_TOKEN){try{const blob=await put(`teachers/${nanoid()}.webp`,bytes,{access:'public',contentType:'image/webp',addRandomSuffix:true});return NextResponse.json({url:blob.url})}catch(e){console.error('Blob upload failed',e);return NextResponse.json({error:'Image storage unavailable'},{status:503})}}
 return NextResponse.json({url:`data:image/webp;base64,${bytes.toString('base64')}`});
}
