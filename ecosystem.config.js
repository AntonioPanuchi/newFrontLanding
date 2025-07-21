module.exports = {
  apps: [
    {
      name: 'rox-vpn',
      script: './backend/server.js',
      cwd: './',
      node_args: '--enable-source-maps',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        LOG_LEVEL: 'info',

        GERMANY_API_URL: 'https://rvpn.rox-net.ru:33000/Y2u3mwGrRKU3aeh',
        USA_API_URL: 'https://rvpn2.rox-net.ru:33000/Y2u3mwGrRKU3aeh',
        FINLAND_API_URL: 'https://rvpn3.rox-net.ru:33000/Y2u3mwGrRKU3aeh',
        USERNAME: 'aw775hats0on',
        PASSWORD: 'fbhWjpZWw9a6TmaeRKP4YV98K8Rcmm3BSPHs1ujXGkJEK6bYC1IkBuK0hECiLtHV',

        TELEGRAM_BOT_TOKEN: '7779535899:AAFjDu4elpu9hWKsywbEIO9oL7zIWK1K5nY',
        TELEGRAM_BOT_USERNAME: 'rx_test_ru_bot',

        JWT_SECRET: 'BJZGPmQHDuV4TgZwuFuaoB6oyQc5W4AB9CS4j80yfcrd',

        PINGHOST1: '103.7.55.165',
        PINGHOST2: '167.224.64.248',
        PINGHOST3: '46.8.71.6',

        ALLOWED_ORIGIN: 'https://rx-test.ru',

        CACHE_DURATION: 60000,
        COOKIE_CACHE_DURATION: 3300000,

        RATE_LIMIT_WINDOW_MS: 60000,
        RATE_LIMIT_MAX_REQUESTS: 3000,

        LOGIN_TIMEOUT: 10000,
        PING_TIMEOUT: 5000,
        FETCH_TIMEOUT: 10000,

        LOG_FILE_MAX_SIZE: 10485760
      }
    }
  ]
}
