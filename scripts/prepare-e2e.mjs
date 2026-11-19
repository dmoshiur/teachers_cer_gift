import {rmSync} from 'node:fs';
// Only the dedicated, disposable Playwright database is removed.
for (const path of ['playwright.db','playwright.db-shm','playwright.db-wal']) rmSync(path,{force:true});
