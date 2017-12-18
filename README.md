# mock-server

## Create a config ecosystem

Renomeie o arquivo ecosystem.config.sample.js para ecosystem.config.js e adicione as urls que deseja mockar

```
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
  }]
}
```

Para rodar em desenvolvimento utilize 

```
npm run dev
```