module.exports = (server, services, router) => {
  router.get('/scenarios', (req, res) => {
    res.status(200).json(services.onScenarios.scenarios.value())
  })

  router.get('/scenarios/:id', (req, res) => {
    const scenario = services.onScenarios.scenarios.getById(req.params.id).value()
    if (scenario) {
      res.status(200).json(scenario)
    } else {
      res.status(404).json()
    }
  })

  router.post('/scenarios', (req, res) => {
    res.status(500).json()
  })

  router.put('/scenarios/:id', (req, res) => {
    res.status(500).json()
  })

  router.post('/scenarios/:id/requests', (req, res) => {
    res.status(500).json()
  })

  router.put('/scenarios/:id/request/:requestId', (req, res) => {
    res.status(500).json()
  })
}
