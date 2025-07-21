module.exports = {
  apps: [
    {
      name: 'rox-vpn',
      script: './server.js',
      cwd: __dirname,
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Лучше использовать dotenv, но можно задать здесь напрямую
        JWT_SECRET: process.env.JWT_SECRET || 'secret123'
      }
    }
  ]
}
