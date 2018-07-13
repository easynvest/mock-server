class Scenarios {
  constructor(db, mockApplication) {
    this._ = db._
    this.mockApplication = mockApplication
    this.scenarios = db.get('scenarios')
  }

  allscenarios() {
    return this.scenarios.value()
  }

  activeByName(name) {
    const scenario = this.scenarios.find({ active: true })

    if (scenario.size().value() === 0) {
      return
    }

    const scenarioRequests = scenario.value().requests

    this._.each(scenarioRequests, request => {
      request.status = 0
    })

    scenario
      .set('active', false)
      .set('requests', scenarioRequests)
      .write()

    this.scenarios
      .find({ name })
      .assign({ active: true })
      .write()
  }

  active(id) {
    const scenario = this.scenarios.find({ active: true })

    if (scenario.size().value() === 0) {
      return
    }

    const scenarioRequests = scenario.value().requests

    this._.each(scenarioRequests, request => {
      request.status = 0
    })

    scenario
      .set('active', false)
      .set('requests', scenarioRequests)
      .write()

    this.scenarios
      .getById(id)
      .assign({ active: true })
      .write()
  }

  getNextRequest({ method, url }) {
    const { _ } = this

    const scenario = this.scenarios.find({ active: true })

    if (scenario.size().value() === 0) {
      return undefined
    }

    const scenarioRequests = scenario.value().requests

    const verifyRequestActive = _.first(_.orderBy(_.uniq(_.map(scenarioRequests, 'status')))) === 0

    if (!verifyRequestActive) {
      _.each(scenarioRequests, request => {
        request.status = 0
      })

      scenario
        .set('active', false)
        .set('requests', scenarioRequests)
        .write()

      return undefined
    }

    const nextScenarioRequest = _.find(scenarioRequests, { method, url, status: 0 })

    if (!nextScenarioRequest) {
      return undefined
    }

    const newRequestId = nextScenarioRequest.requestId

    nextScenarioRequest.status = 1

    const request = this.mockApplication.onRequests.getById(newRequestId)

    request.set({ requests: scenarioRequests }).write()

    return request.value()
  }

  create({ name, active = false, requests = [] }) {
    const scenario = this.scenarios
      .pushIfNotExists({ name, active, requests }, ['name', 'active', 'requests'])
      .write()

    return scenario
  }

  addRequest({
    id, url, method, requestId,
  }) {
    const newRequest = {
      url,
      requestId,
      method: method.toUpperCase(),
      status: 0,
    }

    const scenario = this.scenarios.getById(id)
    const requestsList = scenario.value().requests
    requestsList.push(newRequest)

    scenario.set('requests', requestsList).write()

    return scenario.value()
  }
}

module.exports = Scenarios
