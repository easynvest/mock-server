module.exports = (server, services, router) => {
  router.get('/scenarios', (req, res) => {
    res.status(200).json(services.onScenarios.scenarios.value())
  })

  router.post('/scenarios', (req, res) => {
    const { body } = req
    services.onScenarios.create(body)
    const scenario = services.onScenarios.getBy(body)
    res.status(200).json(scenario)
  })

  router.get('/scenarios/:id', (req, res) => {
    const scenario = services.onScenarios.getById(req.params.id).value()

    if (scenario) {
      res.status(200).json(scenario)
    } else {
      res.status(404).json()
    }
  })

  router.get('/scenarios/:id/active', (req, res) => {
    services.onScenarios.active(req.params.id)
    res.status(200).json()
  })

  router.get('/scenarios/:id/disable', (req, res) => {
    services.onScenarios.disable(req.params.id)
    res.status(200).json()
  })

  router.put('/scenarios/:id', (req, res) => {
    services.onScenarios.update(req.params.id, req.body)
    res.status(200).json()
  })

  router.post('/scenarios/:id/requests', (req, res) => {
    const {
      body,
      params: { id },
    } = req
    if (Array.isArray(body)) {
      const requests = body.map(request => services.onScenarios.addRequest(id, request))
      res.status(200).json(requests)
    } else {
      const request = services.onScenarios.addRequest(id, body)
      res.status(200).json(request)
    }
  })

  router.get('/scenarios/:id/requests', (req, res) => {
    const scenario = services.onScenarios.getById(req.params.id).value()

    if (scenario) {
      res.status(200).json(scenario.requests)
    } else {
      res.status(404).json()
    }
  })

  router.get('/scenarios/:id/requests/:requestId', (req, res) => {
    const {
      params: { id, requestId },
    } = req
    const scenario = services.onScenarios.getById(id).value()
    if (scenario) {
      const request = scenario.requests.find(item => item.id === requestId)
      if (request) {
        res.status(200).json(request)
        return
      }
    }
    res.status(404).json()
  })

  router.put('/scenarios/:id/requests/:requestId', (req, res) => {
    const {
      body,
      params: { id, requestId },
    } = req
    const scenario = services.onScenarios.getById(id).value()
    if (scenario) {
      const requests = scenario.requests.map(item => {
        if (item.id === requestId) return { ...item, ...body }
        return item
      })

      services.onScenarios.update(id, { requests })
      res.status(200).json()
    } else {
      res.status(404).json()
    }
  })

  router.delete('/scenarios/:id/requests/:requestId', (req, res) => {
    const {
      params: { id, requestId },
    } = req

    const scenario = services.onScenarios.getById(id).value()
    if (scenario) {
      const requests = scenario.requests.filter(item => item.id !== requestId)
      services.onScenarios.update(id, { requests })
      res.status(200).json()
    } else {
      res.status(404).json()
    }
  })
}
