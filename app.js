const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const services = require('./services')()
const index = require('./routes/index')
const customMiddlewares = require('./middlewares')
const { setConfig } = require('./config')

const configureApp = (config, cacheOnly) => {
  setConfig(config)
  const app = express()

  app.locals.requestApi = !cacheOnly

  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, 'public')))

  app.use('/', index({ server: app, services }))

  customMiddlewares({ server: app, services })

  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  app.use((err, req, res) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
  })

  return app
}

module.exports = configureApp
