module.exports = {
  apps: [{
    name: 'mock-1',
    script: './index.js',
    watch: true,
    env: {
      PORT: 3001,
      NODE_ENV: 'development',
      API_URI: 'google.com'
    }
  },
  {
    name: 'mock-2',
    script: './index.js',
    watch: true,
    env: {
      PORT: 3002,
      NODE_ENV: 'development',
      API_URI: 'sample.com.br'
    }
  }]
}