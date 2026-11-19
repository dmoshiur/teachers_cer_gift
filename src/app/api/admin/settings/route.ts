import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { settings, auditLogs } from '@/lib/db/schema';
import { requireSession, sameOrigin } from '@/lib/auth';
import { DEFAULT_SETTINGS, tributeSettingsSchema } from '@/lib/tribute-settings';
import { nanoid } from 'nanoid';
export async function GET(){if(!await requireSession())return NextResponse.json({error:'Unauthorized'},{status:401});const rows=await db.select().from(settings).where(eq(settings.key,'tribute'));try{return NextResponse.json(rows[0]?tributeSettingsSchema.parse(JSON.parse(rows[0].value)):DEFAULT_SETTINGS)}catch{return NextResponse.json({error:'Stored settings are invalid'}, {status:500})}}
export async function PUT(req:Request){if(!await requireSession())return NextResponse.json({error:'Unauthorized'},{status:401});if(!await sameOrigin())return NextResponse.json({error:'Invalid origin'},{status:403});const parsed=tributeSettingsSchema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||'Invalid settings'},{status:400});await db.insert(settings).values({key:'tribute',value:JSON.stringify(parsed.data)}).onConflictDoUpdate({target:settings.key,set:{value:JSON.stringify(parsed.data)}});await db.insert(auditLogs).values({id:nanoid(),action:'update',entity:'settings',createdAt:new Date().toISOString()});return NextResponse.json(parsed.data)}
