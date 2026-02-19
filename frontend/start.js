// Start script that runs Next.js from the root app directory
const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';

const command = isProduction ? 'start' : 'dev';

console.log(`Starting Next.js (${command}) from ${rootDir}`);

const child = spawn('yarn', [command], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});
