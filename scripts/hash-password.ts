import {hashPassword} from '../src/lib/password';
const password=process.argv[2];if(!password){console.error('Usage: npm run hash-password -- "your password"');process.exit(1)}hashPassword(password).then(console.log);
