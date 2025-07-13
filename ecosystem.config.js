module.exports = {
  apps: [{
    name: 'rox-vpn-api',
    script: './backend/server.js',
    cwd: '/var/www/rx_test_ru_usr/data/www/rx-test.ru/newFrontLanding',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true
  }]
}; 