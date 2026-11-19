import chromiumBinary from '@sparticuz/chromium';
import {chromium} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
// The serverless Chromium package supplies NSS libraries for minimal Linux hosts.
export async function launchBrowser(){const binary=await chromiumBinary.executablePath();let libraryPath=process.env.LD_LIBRARY_PATH||'';if(process.platform==='linux'){const dir=join(tmpdir(),'tribute-chromium-libs');mkdirSync(dir,{recursive:true});const archive=join(dir,'libs.tar');writeFileSync(archive,brotliDecompressSync(readFileSync(join(require.resolve('@sparticuz/chromium'),'../../../bin/al2023.tar.br'))));execFileSync('tar',['-xf',archive,'-C',dir]);libraryPath=`${dir}/lib:${libraryPath}`;}return chromium.launch({executablePath:binary,args:chromiumBinary.args.filter(arg=>arg!=='--disable-web-security'),headless:true,env:{...process.env,LD_LIBRARY_PATH:libraryPath}})}
