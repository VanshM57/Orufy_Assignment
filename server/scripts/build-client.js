const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, '..', '..', 'client');
const outDir = path.join(__dirname, '..', 'public');

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  if (res.status !== 0) process.exit(res.status);
}

// Install and build client
console.log('Building client...');
run('npm', ['ci'], { cwd: clientDir });
run('npm', ['run', 'build'], { cwd: clientDir });

const distDir = path.join(clientDir, 'dist');

// Remove existing public folder
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}

// Copy dist to server/public
console.log('Copying client dist to server/public...');
fs.cpSync(distDir, outDir, { recursive: true });

console.log('Client build copied to server/public');
