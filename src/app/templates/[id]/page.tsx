import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FullPreview } from '@/components/full-preview';
import type { TemplateId } from '@/templates/registry';
const names:Record<string,string>={floral:'The Floral',premium:'The Celebration','navy-gold':'The Scholar',boxed:'The Keepsake'};
export function generateStaticParams(){return Object.keys(names).map(id=>({id}))}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!names[id])notFound();return <main className="full-page"><div className="full-header"><Link href="/">← Back to collection</Link><strong>{names[id]}</strong><Link href="/login">Admin login ↗</Link></div><FullPreview id={id as TemplateId} teacher={{name:'Mohammad Rahim Uddin',role:'Assistant Teacher (English)',templateId:'floral'}}/></main>}
