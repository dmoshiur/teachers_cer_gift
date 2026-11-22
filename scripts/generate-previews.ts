import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {launchBrowser} from '../e2e/browser';

const root=process.cwd();
const MIME:Record<string,string>={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.png':'image/png','.json':'application/json','.js':'text/javascript; charset=utf-8'};
const FONT_LINKS=['@fontsource/poppins/400.css','@fontsource/poppins/500.css','@fontsource/poppins/600.css','@fontsource/poppins/700.css','@fontsource/lora/400.css','@fontsource/lora/700.css','@fontsource/hind-siliguri/400.css'].map(p=>`<link rel="stylesheet" href="/node_modules/${p}">`).join('\n');

function serve():Promise<{server:http.Server;port:number}>{
 const server=http.createServer((req,res)=>{
  const url=decodeURIComponent((req.url||'/').split('?')[0]);
  const rel=url==='/'?'/.preview-gen.html':url;
  const file=path.join(root,path.normalize(rel).replace(/^([/\\])+/, ''));
  if(!file.startsWith(root)){res.writeHead(403);res.end();return}
  fs.readFile(file,(err,data)=>{
   if(err){res.writeHead(404);res.end('not found');return}
   res.writeHead(200,{'Content-Type':MIME[path.extname(file)]||'application/octet-stream'});
   res.end(data);
  });
 });
 return new Promise(resolve=>{
  server.listen(0,'127.0.0.1',()=>{
   const addr=server.address();
   resolve({server,port:typeof addr==='object'&&addr?addr.port:0});
  });
 });
}

async function main(){
 const ids=['floral','premium','navy-gold','boxed'];
 const {server,port}=await serve();
 const browser=await launchBrowser();
 try{
  const page=await browser.newPage({viewport:{width:909,height:1287},deviceScaleFactor:1});
  for(const id of ids){
   const data=JSON.parse(fs.readFileSync(path.join(root,`src/templates/${id}.json`),'utf8'));
   const html=data.html.replaceAll('{{NAME}}','Mohammad Rahim Uddin').replaceAll('{{ROLE}}','Assistant Teacher (English)').replaceAll('{{PHOTO_IMG}}','');
   // A4 at 96dpi is 793.7x1122.5px; scale uniformly to the reference 909x1287 canvas.
   const sx=909/(210*96/25.4),sy=1287/(297*96/25.4);
   const doc=`<!doctype html><html><head><meta charset="utf-8">${FONT_LINKS}<style>
html,body{margin:0;padding:0;background:#fff;overflow:hidden}
.stage{width:909px;height:1287px;overflow:hidden}
.sheet{width:210mm;height:297mm;transform:scale(${sx},${sy});transform-origin:top left}
${data.css}</style></head><body><div class="stage"><div class="sheet"><div class="tpl-${id}">${html}</div></div></div></body></html>`;
   fs.writeFileSync(path.join(root,'.preview-gen.html'),doc);
   await page.goto(`http://127.0.0.1:${port}/.preview-gen.html`,{waitUntil:'load'});
   await page.evaluate(()=>(document as unknown as {fonts:FontFaceSet}).fonts.ready.then(()=>undefined));
   await page.screenshot({path:path.join(root,`public/previews/${id}.png`),clip:{x:0,y:0,width:909,height:1287}});
   console.log(`public/previews/${id}.png regenerated`);
  }
 }finally{
  await browser.close();
  server.close();
  fs.rmSync(path.join(root,'.preview-gen.html'),{force:true});
 }
}
main().catch(e=>{console.error(e);process.exit(1)});
