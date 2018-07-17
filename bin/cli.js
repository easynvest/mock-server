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
    type: 'input',
    name: 'mockPath',
    message: 'Inform the folder name you want use',
    default: './mock-server',
  },
  {
    type: 'input',
    name: 'port',
    message: 'Please tell which port you want to use',
    default: '3001',
  },
  {
    type: 'input',
    name: 'api',
    validate: input => {
      // eslint-disable-next-line no-useless-escape, max-len
      const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      return !!input.trim() && regex.test(input)
    },
    message: 'Enter with the url API',
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
    sourceDir: path.join(localPath, '/node_modules/@easynvest/mock-server/bin/'),
  })
}

function infinitPrompt(props) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const { port, uriApi } = require(path.join(localPath, props.configFile))
  kill(port)

  const message = chalk.green.bold('\n> Mock-Server is running: ')
    + chalk.white(`http://localhost:${port}/proxy point to => ${uriApi}`)
  const state = {
    ...props,
    silent: true,
    message,
    server: startServer(props.cacheOnly, true, props.configFile),
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
      chalk.white.bold('\n> Cache-only: ')
        + chalk.yellow.bold(state.cacheOnly ? 'active' : 'disable'),
      `${chalk.white.bold('\n> Show log:   ')
        + chalk.yellow.bold(!state.silent ? 'active' : 'disable')}\n`,
    )

    const options = [
      {
        type: 'list',
        name: 'option',
        message: 'Options',
        choices: [
          {
            value: 'd',
            name: chalk.hex('#888b8d')(
              ` Select to${state.cacheOnly ? ' Disable ' : ' Enable '}cache-only`,
            ),
          },
          {
            value: 'r',
            name: chalk.hex('#888b8d')(' Select to Restart mock-server'),
          },
          {
            value: 's',
            name: chalk.hex('#888b8d')(
              ` Select to${state.silent ? ' Enable log' : ' Disable log'}`,
            ),
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
          kill(port)
          process.exit(0)
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
        const mockPath = path.join(localPath, responses.mockPath)

        if (!fs.existsSync(mockPath)) {
          fs.mkdirSync(mockPath)
        }

        const mockConfigPath = path.join(localPath, './mock-server.conf.js')
        const mockConfigFile = fs.createWriteStream(mockConfigPath, {
          flags: 'w',
          encoding: 'utf-8',
        })
        const rewriteRoutesPath = path.join(mockPath, './rewriteRoutes.js')
        const rewriteRoutesFile = fs.createWriteStream(rewriteRoutesPath, {
          flags: 'w',
          encoding: 'utf-8',
        })

        const jsonConfig = {
          port: responses.port,
          uriApi: 'swapi.co',
          rewriteRoutes: `${responses.mockPath}/rewriteRoutes.js`,
        }

        mockConfigFile.end(`module.exports = ${JSON.stringify(jsonConfig, null, 2)}`)
        rewriteRoutesFile.end("module.exports = {\n  '/api/*': '/$1'\n}\n")
      }
    })
  })

program
  .command('start')
  .alias('s')
  .description('Start mock-server')
  .action(file => {
    const configFile = typeof file === 'object' ? 'mock-server.conf.js' : file
    infinitPrompt({ cacheOnly: program.cacheOnly, configFile })
  })

program
  .version('0.1.0')
  .option('--cache-only', 'Start mock-server without proxy')
  .parse(process.argv)
