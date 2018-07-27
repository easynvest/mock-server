const express = require('express')

const router = express.Router()

const validateBody = (fields, body) => fields.every(field => field in body)
const hasOne = (fields, body) => fields.some(field => field in body)
const REQUEST_CONTRACT = ['type', 'method', 'url', 'status', 'response', 'query']

const configureRoutes = ({ server, services }) => {
  router.get('/', (req, res) => {
    res.status(200).send(`
  *************** MOCK SERVER CLI ***************
  ** Run in your terminal
  ** $ npm install @easynvest/mock-server
  ** $ mock-server init
  ** $ mock-server start
  ** or
  ** $ mock-server --help
  *************** MOCK SERVER CLI ***************\n`)
  })

  router.get('/request-api', (req, res) => {
    server.locals.requestApi = !server.locals.requestApi //eslint-disable-line
    res.status(200).json(server.locals.requestApi)
  })

  router.get('/requests', (req, res) => {
    res.status(200).json(services.onRequests.requests.value())
  })

  router.get('/requests/:id', (req, res) => {
    try {
      const request = services.onRequests.requests.getById(req.params.id).value()
      if (request) {
        res.status(200).json(request)
      } else {
        res.status(404).json()
      }
    } catch (e) {
      res.status(500).json()
    }
  })

  router.post('/requests', (req, res) => {
    const isValid = validateBody(REQUEST_CONTRACT, req.body)
    if (isValid) {
      try {
        const request = services.onRequests.create(req.body)
        res.status(200).json(request)
        return
      } catch (e) {
        res.status(500).json()
      }
    } else {
      res.status(400).json()
    }
  })

  router.put('/requests/:id', (req, res) => {
    const request = services.onRequests.requests.getById(req.params.id).value()
    if (request) {
      try {
        const validBody = hasOne(REQUEST_CONTRACT, req.body)
        if (validBody) {
          const newRequest = { ...request, ...req.body }
          services.onRequests.saveIfHasDiff(request, newRequest)
          res.status(200).json(newRequest)
          return
        }
        res.status(400).json()
      } catch (e) {
        res.status(500).json()
      }
    }

    res.status(404).json()
  })

  router.delete('/requests/:id', (req, res) => {
    const request = services.onRequests.requests.getById(req.params.id).value()
    try {
      if (request) {
        services.onRequests.remove(req.params.id)
        res.status(200).json()
      } else {
        res.status(404).json()
      }
    } catch (e) {
      res.status(500).json()
    }
  })

  router.get('/scenarios', (req, res) => {
    res.status(200).json(services.onScenarios.scenarios.value())
  })

  return router
}

module.exports = configureRoutes
