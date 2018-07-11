#!/usr/bin/env node

const program = require('commander')
const { prompt } = require('inquirer')
const fs = require('fs')
const path = require('path')
const http = require('http')
const mockServer = require('../app')

const localPath = process.cwd()

const questions = [
  {
    type: 'input',
    name: 'mockPath',
    message: 'Deseja criar uma pasta para o mock-server...',
    default: './mock-server',
  },
  {
    type: 'input',
    name: 'port',
    message: 'Informe a porta que deseja utiliar o mock...',
    default: '3001',
  },
  {
    type: 'input',
    name: 'api',
    message: 'Informe a url da api...',
  },
  {
    type: 'input',
    name: 'resourcesPath',
    message: 'Informa o local onde deseja armazenar os resources...',
    default: './mock-server/resources',
  },
]

program
  .command('init')
  .alias('i')
  .description('Generate a mock config')
  .action(() => {
    prompt(questions).then(respostas => {
      const mockPath = path.join(localPath, respostas.mockPath)
      const resourcesPath = path.join(localPath, respostas.resourcesPath)

      if (!fs.existsSync(mockPath)) {
        fs.mkdirSync(mockPath)
      }

      if (!fs.existsSync(resourcesPath)) {
        fs.mkdirSync(resourcesPath)
      }

      const mockConfigFile = fs.createWriteStream(path.join(localPath, './mock-server.conf.js'), {
        flags: 'w',
        encoding: 'utf-8',
      })
      const rewriteRoutesFile = fs.createWriteStream(path.join(mockPath, './rewriteRoutes.js'), {
        flags: 'w',
        encoding: 'utf-8',
      })

      mockConfigFile.end(
        `module.exports = {\n  port: '${respostas.port}',\n  uriApi: '${
          respostas.api
        }',\n  rewriteRoutes: '${respostas.mockPath}/rewriteRoutes.js',\n  resourcesPath: '${
          respostas.resourcesPath
        }'\n}\n`,
      )
      rewriteRoutesFile.end("module.exports = {\n  '/api/*': '/$1'\n}\n")
    })
  })

program
  .command('start')
  .alias('s')
  .description('Inicia mock-server')
  .action(mockServerConfigName => {
    const cacheOnly = program.cacheOnly || false
    let newMockServerConfigName = ''

    if (typeof mockServerConfigName === 'object') {
      newMockServerConfigName = 'mock-server.conf.js'
    }

    const configFile = path.join(process.cwd(), newMockServerConfigName)

    if (!fs.existsSync(configFile)) {
      process.stdout.write(
        `Não foi possivel encontrar o arquivo de configuração:\nArquivo: "${configFile}"`,
      )
      return
    }

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
      const port = parseInt(val, 10)

      // eslint-disable-next-line
      if (isNaN(port)) {
        // named pipe
        return val
      }

      if (port >= 0) {
        // port number
        return port
      }

      return false
    }
    const config = require(configFile) //eslint-disable-line
    const app = mockServer(config, cacheOnly)
    const port = normalizePort(config.port)
    app.set('port', port)

    const server = http.createServer(app)

    server.listen(port, () => {
      process.stdout.write(
        `JSON Server is running: http://localhost:${port}/ point to => ${config.uriApi}`,
      )
    })

    server.on('error', onError) //eslint-disable-line
    server.on('listening', onListening) //eslint-disable-line

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error
      }

      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          process.stdout.write(`${bind} requires elevated privileges`)
          process.exit(1)
          break
        case 'EADDRINUSE':
          process.stdout.write(`${bind} is already in use`)
          process.exit(1)
          break
        default:
          throw error
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      const addr = server.address()
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      process.stdout.write(`Listening on ${bind}`)
    }
  })

program
  .version('0.1.0')
  .option('--cache-only', 'Inicia mock sem fazer proxy para api')
  .parse(process.argv)
