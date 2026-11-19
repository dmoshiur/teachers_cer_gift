import {test,expect} from '@playwright/test';
import {launchBrowser} from './browser';
import {PDFDocument} from 'pdf-lib';

test('all designs print exactly one A4 page for short, long and Bangla names',async()=>{
 const browser=await launchBrowser();
 const page=await browser.newPage();
 try{
  await page.goto('http://localhost:3100/login');
  await page.getByLabel('Admin password').fill('tribute2026');
  await page.getByRole('button',{name:'Sign in to studio'}).click();
  await expect(page).toHaveURL(/\/admin/, {timeout:30000});
  for(const design of ['floral','premium','navy-gold','boxed']) for(const name of ['A Teacher','Mohammad Abdul Rahim Uddin Choudhury Al Mamun Chowdhury','মোহাম্মদ আব্দুর রহমান চৌধুরী']){
   const teacher=await page.evaluate(async({name,design})=>{const r=await fetch('/api/admin/teachers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,role:'Assistant Teacher (English)',templateId:design})});return r.json()},{name,design});
   expect(teacher.id).toBeTruthy();await page.reload();await page.getByRole('button',{name:'Teachers',exact:false}).first().click();
   await page.getByRole('button',{name:`Print ${name}`}).click();
   await page.emulateMedia({media:'print'});const pdf=await page.pdf({format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});
   const doc=await PDFDocument.load(pdf);expect(doc.getPageCount(),`${design}: ${name}`).toBe(1);await page.emulateMedia({media:'screen'});
   await page.getByRole('button',{name:'Close',exact:true}).click();await page.evaluate(async id=>{await fetch(`/api/admin/teachers/${id}`,{method:'DELETE'})},teacher.id);
  }
 }finally{await browser.close()}
});
