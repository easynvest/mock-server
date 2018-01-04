const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const chalk = require('chalk')
const resources = require('./resources')
const customMiddlewares = require('./middlewares')
const customRoutes = require('./routes')
const path = require('path')
const { setConfig } = require('./config')

module.exports = (config, cacheOnly) => {
  setConfig(config)
  const { port: PORT = 3000, uriApi: URI_API } = config
  const rules = require(path.join(process.cwd(), config.rewriteRoutes))
  const server = jsonServer.create()
  const router = jsonServer.router(resources(config))
  const middlewares = jsonServer.defaults()

  server.locals.requestApi = !cacheOnly
  // Rewrite routes
  server.use(jsonServer.rewriter(rules))

  // Set default middlewares (logger, static, cors and no-cache)
  server.use(middlewares)
  server.use(jsonServer.bodyParser)
  server.use(bodyParser.text({ type: '*/xml' }))

  // Custom middlewares
  customMiddlewares({ server, router })

  // Custom routes
  customRoutes({ server, router })

  // Use default router
  server.use(router)

  server.listen(PORT, () => {
    console.log(chalk.bold('Routes Rules:'))

    Object.keys(rules).forEach(key => console.log(`${key} -> ${rules[key]}`))

    console.log()
    console.log(`JSON Server is running: http://localhost:${PORT}/ point to => ${URI_API}`)
  })
}
