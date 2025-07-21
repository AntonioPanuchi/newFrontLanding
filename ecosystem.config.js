module.exports = {
  apps: [
    {
      name: 'rox-vpn',
      script: './backend/server.js',
      cwd: './',
      node_args: '--enable-source-maps',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT || 3000,
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',

        GERMANY_API_URL: process.env.GERMANY_API_URL,
        USA_API_URL: process.env.USA_API_URL,
        FINLAND_API_URL: process.env.FINLAND_API_URL,
        USERNAME: process.env.USERNAME,
        PASSWORD: process.env.PASSWORD,


        JWT_SECRET: process.env.JWT_SECRET,

        PINGHOST1: process.env.PINGHOST1,
        PINGHOST2: process.env.PINGHOST2,
        PINGHOST3: process.env.PINGHOST3,

        ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,

        CACHE_DURATION: process.env.CACHE_DURATION || 60000,
        COOKIE_CACHE_DURATION: process.env.COOKIE_CACHE_DURATION || 3300000,

        RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 60000,
        RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 3000,

        LOGIN_TIMEOUT: process.env.LOGIN_TIMEOUT || 10000,
        PING_TIMEOUT: process.env.PING_TIMEOUT || 5000,
        FETCH_TIMEOUT: process.env.FETCH_TIMEOUT || 10000,

        LOG_FILE_MAX_SIZE: process.env.LOG_FILE_MAX_SIZE || 10485760
      }
    }
  ]
}
