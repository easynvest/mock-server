class ScenariosService {
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

    this._.each(scenarioRequests, request => { request.status = 0 })

    scenario.set('active', false).set('requests', scenarioRequests).write()

    this.scenarios.find({ name }).assign({ active: true }).write()
  }

  active(id) {
    const scenario = this.scenarios.find({ active: true })

    if (scenario.size().value() === 0) {
      return
    }

    const scenarioRequests = scenario.value().requests

    this._.each(scenarioRequests, request => { request.status = 0 })

    scenario.set('active', false).set('requests', scenarioRequests).write()

    this.scenarios.getById(id).assign({ active: true }).write()
  }

  getNextRequest({ method, url }) {
    const _ = this._

    const scenario = this.scenarios.find({ active: true })

    if (scenario.size().value() === 0) {
      return undefined
    }

    const scenarioRequests = scenario.value().requests

    const verifyRequestActive = _.first(_.orderBy(_.uniq(_.map(scenarioRequests, 'status')))) === 0

    if (!verifyRequestActive) {
      _.each(scenarioRequests, request => { request.status = 0 })

      scenario.set('active', false).set('requests', scenarioRequests).write()

      return undefined
    }

    const nextScenarioRequest = _.find(scenarioRequests, { method, url, status: 0 })

    if (!nextScenarioRequest) {
      return undefined
    }

    const requestId = nextScenarioRequest.requestId

    nextScenarioRequest.status = 1

    const request = this.mockApplication.onRequests.getById(requestId)

    request.set({ requests: scenarioRequests }).write()

    return request.value()
  }

  create({ name, active = false, requests = [] }) {

    const scenario = this.scenarios
      .pushIfNotExists({ name, active, requests }, ['name', 'active', 'requests'])
      .write()

    return scenario
  }

  addRequest({ id, url, method, requestId }) {
    const newRequest = { url, requestId, method: method.toUpperCase(), status: 0 }

    const scenario = this.scenarios.getById(id)
    const requests = scenario.value().requests
    requests.push(newRequest)

    scenario.set('requests', requests).write()

    return scenario.value()
  }
}

class RequestsService {
  constructor(db, mockApplication) {
    this._ = db._
    this.mockApplication = mockApplication
    this.requests = db.get('requests')
  }

  all() {
    return this.requests.map(i => `${i.method} -> ${i.url}`).sortBy('url').uniq().value()
  }

  getById(id) {
    return this.requests.getById(id)
  }

  getTo({ method, url }) {
    const nextRequestScenario = this.mockApplication.onScenarios.getNextRequest({ method, url })

    if (nextRequestScenario) {
      return nextRequestScenario
    }

    const request = this.requests.find({ method, url, type: 'default' })

    return request.value()
  }

  allResponses({ method, url }) {
    const request = this.requests.filter({ method, url })

    return request.value()
  }

  create({ type = 'custom', method = 'GET', url, status = 200, response }) {
    const request = this.requests
      .pushIfNotExists({
        type,
        method: method.toUpperCase(),
        url,
        status,
        response
      }, ['method', 'url', 'status', 'response'])
      .write()

    return request
  }

  defineDefaut(id) {
    const request = this.requests.getById(id)

    const { method, url } = request.value()

    this.requests.find({ type: 'default', method, url }).assign({ type: 'custom' }).write()

    request.assign({ type: 'default' }).write()
  }
}


const mockApplication = db => {
  const api = {}
  const onRequests = new RequestsService(db, api)
  const onScenarios = new ScenariosService(db, api)

  api.onRequests = onRequests
  api.onScenarios = onScenarios

  return api
}

module.exports = mockApplication
