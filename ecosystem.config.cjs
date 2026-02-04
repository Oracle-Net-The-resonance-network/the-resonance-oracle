// PM2 Ecosystem Config — The Resonance Oracle
// Usage: pm2 start ecosystem.config.cjs

const BASE = '/Users/nat/Code/github.com/Oracle-Net-The-resonance-network'

module.exports = {
  apps: [
    {
      name: 'api',
      script: 'bun',
      args: 'run dev',
      cwd: `${BASE}/oracle-universe-api`,
      env: { PORT: 3000 },
      watch: false,
    },
    {
      name: 'web',
      script: 'bun',
      args: 'run dev',
      cwd: `${BASE}/oracle-net-web`,
      env: { PORT: 5173 },
      watch: false,
    },
    {
      name: 'universe-web',
      script: 'bun',
      args: 'run dev',
      cwd: `${BASE}/oracle-universe-web`,
      env: { PORT: 5174 },
      watch: false,
    },
    {
      name: 'backend',
      script: './oracle-universe',
      args: 'serve',
      cwd: `${BASE}/oracle-universe-backend`,
      env: { PORT: 8090 },
      watch: false,
      interpreter: 'none',
    },
  ],
}
