const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const chalk = require('chalk')

const customMiddlewares = require('./middlewares')
const customRoutes = require('./routes')
const { setConfig } = require('./config')
const dbService = require('./db')

module.exports = (config, cacheOnly) => {
  setConfig(config)
  const { port: PORT = 3000, uriApi: URI_API } = config
  const server = jsonServer.create()
  const router = jsonServer.router()
  const middlewares = jsonServer.defaults()

  server.locals.requestApi = !cacheOnly
  // Rewrite routes
  server.use(jsonServer.rewriter({
    '/api/*': '/$1'
  }))

  // Set default middlewares (logger, static, cors and no-cache)
  server.use(middlewares)
  server.use(jsonServer.bodyParser)
  server.use(bodyParser.text({ type: '*/xml' }))

  // Custom middlewares
  customMiddlewares({ server, router, dbService })

  // Custom routes
  customRoutes({ server, router, dbService })

  // Use default router
  server.use(router)

  server.listen(PORT, () => {
    console.log(chalk.bold('Routes Rules:'))

    dbService.onRequests.all().forEach(url => console.log(url))

    console.log()
    console.log(`JSON Server is running: http://localhost:${PORT}/ point to => ${URI_API}`)
  })
}
