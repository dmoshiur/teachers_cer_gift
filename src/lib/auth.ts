import { SignJWT,jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import {eq} from 'drizzle-orm';
import {db} from '@/lib/db';
import {settings} from '@/lib/db/schema';
const secret=()=>new TextEncoder().encode(process.env.SESSION_SECRET || (process.env.NODE_ENV==='production' ? '' : 'local-development-secret-change-me-12345'));
export async function sessionVersion(){const row=await db.select().from(settings).where(eq(settings.key,'session_version'));return Number(row[0]?.value||0)}
export async function signSession(version:number){if(secret().length<32)throw new Error('SESSION_SECRET must be at least 32 characters');return new SignJWT({admin:true,version}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret())}
export async function validSession(token?:string){if(!token||secret().length<32)return false;try{const {payload}=await jwtVerify(token,secret(),{algorithms:['HS256']});return payload.admin===true&&typeof payload.version==='number'&&payload.version===await sessionVersion()}catch{return false}}
export async function requireSession(){return validSession((await cookies()).get('tribute_session')?.value)}
export async function sameOrigin(){const h=await headers();const origin=h.get('origin');const host=h.get('x-forwarded-host')||h.get('host');if(!origin||!host)return false;try{const url=new URL(origin);return (url.protocol==='https:'||url.protocol==='http:')&&url.host===host}catch{return false}}
