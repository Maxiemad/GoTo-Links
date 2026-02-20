const { spawn } = require('child_process');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
console.log(`Starting Next.js from ${rootDir}`);
const child = spawn('yarn', ['dev'], { cwd: rootDir, stdio: 'inherit', shell: true });
child.on('error', (err) => { console.error('Failed:', err); process.exit(1); });
child.on('close', (code) => { process.exit(code); });
