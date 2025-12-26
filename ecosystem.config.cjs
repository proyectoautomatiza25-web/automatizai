module.exports = {
  apps: [
    {
      name: 'automatizai-api',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=automatizai-production --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'automatizai-worker',
      script: 'node',
      args: 'workers/publisher.js',
      env: {
        NODE_ENV: 'development',
        REDIS_URL: 'redis://localhost:6379',
        ENCRYPTION_KEY: '4dbc6cbf17e76aeac99e96043ad0d2ed8d52ce0f1134a37a44edae1e90d37332',
        INTERNAL_API_SECRET: 'a89db0a30a110d893f579cc72026d8f5804f987a076527c08161cbb8834a8f96',
        API_BASE_URL: 'http://localhost:3000'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '500M'
    }
  ]
}
