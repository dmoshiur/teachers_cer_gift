import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';return ['','/templates/floral','/templates/premium','/templates/navy-gold','/templates/boxed'].map(path=>({url:`${base}${path}`}))}
