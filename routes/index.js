module.exports = ({ server, router, dbService }) => {
  server.get('/request-api', (req, res) => {
    server.locals.requestApi = !server.locals.requestApi
    res.status(200).json(server.locals.requestApi)
  })

  server.get('/requests', (req, res) => {
    res.status(200).json(dbService.onRequests.requests.value())
  })

  server.get('/scenarios', (req, res) => {
    res.status(200).json(dbService.onScenarios.scenarios.value())
  })
}
