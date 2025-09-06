const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Marketing Platform...');

// Start the backend server
const backend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env }
});

backend.on('error', (err) => {
  console.error('Backend error:', err);
  process.exit(1);
});

backend.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  backend.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  backend.kill('SIGINT');
});
