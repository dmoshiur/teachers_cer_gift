import {loadEnvConfig} from '@next/env';
loadEnvConfig(process.cwd());
import {createClient} from '@libsql/client'; import {readFileSync} from 'node:fs';
const client=createClient({url:process.env.TURSO_DATABASE_URL||'file:local.db',authToken:process.env.TURSO_AUTH_TOKEN});
async function main(){const sql=readFileSync('drizzle/0000_initial.sql','utf8');for(const statement of sql.split(';').map(s=>s.trim()).filter(Boolean))await client.execute(statement);console.log('Migration complete');client.close()};main().catch(e=>{console.error(e);process.exit(1)});
