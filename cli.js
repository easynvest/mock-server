#!/usr/bin/env node

const program = require('commander')
const { prompt } = require('inquirer')
const fs = require('fs')
const path = require('path')
const mockServer = require('./index')

const localPath = process.cwd()

const questions = [
  {
    type: 'input',
    name: 'mockPath',
    message: 'Deseja criar uma pasta para o mock-server...',
    default: './mock-server'
  },
  {
    type: 'input',
    name: 'port',
    message: 'Informe a porta que deseja utiliar o mock...',
    default: '3001'
  },
  {
    type: 'input',
    name: 'api',
    message: 'Informe a url da api...'
  },
  {
    type: 'input',
    name: 'resourcesPath',
    message: 'Informa o local onde deseja armazenar os resources...',
    default: './mock-server/resources'
  }
];

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

      const mockConfigFile = fs.createWriteStream(path.join(localPath, './mock-server.conf.js'), { flags: 'w', encoding: 'utf-8' });
      const rewriteRoutesFile = fs.createWriteStream(path.join(mockPath, './rewriteRoutes.js'), { flags: 'w', encoding: 'utf-8' });

      mockConfigFile.end(`module.exports = {\n  port: '${respostas.port}',\n  uriApi: '${respostas.api}',\n  rewriteRoutes: '${respostas.mockPath}/rewriteRoutes.js',\n  resourcesPath: '${respostas.resourcesPath}'\n}\n`)
      rewriteRoutesFile.end(`module.exports = {\n  '/api/*': '/$1'\n}\n`)

    })
  })

program
  .command('start')
  .alias('s')
  .description('Inicia mock-server')
  .action(mockServerConfigName => {
    const cacheOnly = program.cacheOnly || false

    if (typeof mockServerConfigName === 'object') {
      mockServerConfigName = 'mock-server.conf.js'
    }

    let configFile = path.join(process.cwd(), mockServerConfigName)

    if (!fs.existsSync(configFile)) {
      console.error(`Não foi possivel encontrar o arquivo de configuração:\nArquivo: "${configFile}"`)
      return
    }

    const config = require(configFile)
    mockServer(config, cacheOnly)
  })

program
  .version('0.1.0')
  .option('--cache-only', 'Inicia mock sem fazer proxy para api')
  .parse(process.argv);