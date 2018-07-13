#!/usr/bin/env node
/* eslint no-console:  ["error", { allow: ["log"] }] */

const program = require('commander')
const { prompt } = require('inquirer')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const kill = require('kill-port')
const forever = require('forever-monitor')

const localPath = process.cwd()

const questions = [
  {
    type: 'confirm',
    name: 'mockPath',
    message: 'Deseja criar uma pasta para o mock-server...',
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
    validate: input => {
      const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      return !!input.trim() && regex.test(input)
    },
    message: 'Informe a url da api...',
  },
  {
    type: 'input',
    name: 'resourcesPath',
    message: 'Informa o local onde deseja armazenar os resources...',
    default: './mock-server/resources',
  },
]

function startServer(cache = false, silent = false, fileName) {
  return forever.start('server.js', {
    uid: 'server',
    watch: false,
    silent,
    env: {
      cacheOnly: cache,
      mockServerConfigName: fileName,
    },
    sourceDir: './bin/',
  })
}

function infinitPrompt(props) {
  // eslint-disable-next-line
  const { port, uriApi } = require(path.join(localPath, props.configFile))
  kill(port)

  const message = chalk.green.bold('\n> Mock-Server is running: ') + chalk.white(`http://localhost:${port}/proxy point to => ${uriApi}`)
  const state = {
    ...props,
    silent: true,
    message,
    server: startServer(props.cacheOnly, props.configFile),
  }

  const killServer = () => {
    if (state.server) state.server.stop()
    kill(port)
    process.exit(0)
  }

  const events = ['SIGINT', 'SIGTERM', 'exit']
  events.forEach(event => {
    process.on(event, killServer)
  })

  const startPrompt = () => {
    console.log(
      state.message,
      chalk.white.bold('\n> Cache-only: ') + chalk.yellow.bold(state.cacheOnly ? 'active' : 'disable'),
      `${chalk.white.bold('\n> Show log:   ') + chalk.yellow.bold(!state.silent ? 'active' : 'disable')}\n`,
    )

    const options = [
      {
        type: 'list',
        name: 'option',
        message: 'Options',
        choices: [
          {
            value: 'd',
            name: chalk.hex('#888b8d')(` Select to${state.cacheOnly ? ' Disable ' : ' Enable '}cache-only`),
          },
          {
            value: 'r',
            name: chalk.hex('#888b8d')(' Select to Restart mock-server'),
          },
          {
            value: 's',
            name: chalk.hex('#888b8d')(` Select to${state.silent ? ' Enable log' : ' Disable log'}`),
          },
          {
            value: 'c',
            name: chalk.hex('#888b8d')(' Select to close mock-server'),
          },
        ],
      },
    ]

    prompt(options).then(response => {
      process.stdout.write('\x1B[2J\x1B[0f')

      switch (response.option) {
        case 'r':
          state.server.stop()
          state.server = startServer(state.cacheOnly, state.silent, state.configFile)
          break
        case 'd':
          state.cacheOnly = !state.cacheOnly
          state.server.stop()
          state.server = startServer(state.cacheOnly, state.silent, state.configFile)
          break
        case 's':
          state.silent = !state.silent
          state.server.stop()
          state.server = startServer(state.cacheOnly, state.silent, state.configFile)
          break
        case 'c':
          state.server.stop()
          process.exit(2)
          process.stdout.write('\x1B[2J\x1B[0f')
          return
        default:
          return
      }

      startPrompt()
    })

    if (!state.silent) console.log('\n')
  }
  startPrompt()
}

program
  .command('init')
  .alias('i')
  .description('Generate a mock config')
  .action(() => {
    prompt(questions).then(responses => {
      if (responses.mockPath) {
        const mockPath = path.join(localPath, './mock-server')
        const resourcesPath = path.join(localPath, responses.resourcesPath)

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
          `module.exports = {\n  port: '${responses.port}',\n  uriApi: '${responses.api}',\n  rewriteRoutes: '${
            responses.mockPath
          }/rewriteRoutes.js',\n  resourcesPath: '${responses.resourcesPath}'\n}\n`,
        )
        rewriteRoutesFile.end("module.exports = {\n  '/api/*': '/$1'\n}\n")
      }
    })
  })

program
  .command('start')
  .alias('s')
  .description('Start mock-server')
  .action(mockServerConfigName => {
    const configFile = typeof mockServerConfigName === 'object' ? 'mock-server.conf.js' : mockServerConfigName

    infinitPrompt({ cacheOnly: program.cacheOnly, configFile })
  })

program
  .version('0.1.0')
  .option('--cache-only', 'Start mock-server without proxy')
  .parse(process.argv)
