import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Polygon Akindo Backend Services...\n');

// Start the AI Agent server
const agentServer = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start the x402 Proxy server
const proxyServer = spawn('node', ['proxy-server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all servers...');
  agentServer.kill();
  proxyServer.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  agentServer.kill();
  proxyServer.kill();
  process.exit();
});

agentServer.on('exit', (code) => {
  console.log(`⚠️  Agent server exited with code ${code}`);
  proxyServer.kill();
  process.exit(code);
});

proxyServer.on('exit', (code) => {
  console.log(`⚠️  Proxy server exited with code ${code}`);
  agentServer.kill();
  process.exit(code);
});

