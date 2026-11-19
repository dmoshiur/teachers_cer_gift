import { NextResponse } from 'next/server';import {sameOrigin} from '@/lib/auth';
export async function POST(){if(!await sameOrigin())return NextResponse.json({error:'Invalid origin'},{status:403});const r=NextResponse.json({ok:true});r.cookies.delete('tribute_session');return r}
