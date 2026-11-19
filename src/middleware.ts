import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
export async function middleware(req:NextRequest){const token=req.cookies.get('tribute_session')?.value;const secret=process.env.SESSION_SECRET || (process.env.NODE_ENV==='production'?'':'local-development-secret-change-me-12345');let ok=false;if(token&&secret.length>=32){try{const {payload}=await jwtVerify(token,new TextEncoder().encode(secret),{algorithms:['HS256']});ok=payload.admin===true}catch{}}
 if(!ok){if(req.nextUrl.pathname.startsWith('/api/'))return NextResponse.json({error:'Unauthorized'},{status:401});return NextResponse.redirect(new URL('/login',req.url))}return NextResponse.next()}
export const config={matcher:['/admin/:path*','/api/admin/:path*']};
