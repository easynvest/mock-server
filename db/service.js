class ScenariosService {
  constructor(db, mockApplication) {
    this._ = db._
    this.mockApplication = mockApplication
    this.scenaries = db.get('scenaries')
  }

  allScenaries() {
    return this.scenaries.value()
  }

  activeByName(name) {
    const scenario = this.scenaries.find({ active: true })

    if (scenario.size().value() === 0) {
      return
    }

    const scenarieRequests = scenario.value().requests

    this._.each(scenarieRequests, request => { request.status = 0 })

    scenario.set('active', false).set('requests', scenarieRequests).write()

    this.scenaries.find({ name }).assign({ active: true }).write()
  }

  active(id) {
    const scenario = this.scenaries.find({ active: true })

    if (scenario.size().value() === 0) {
      return
    }

    const scenarieRequests = scenario.value().requests

    this._.each(scenarieRequests, request => { request.status = 0 })

    scenario.set('active', false).set('requests', scenarieRequests).write()

    this.scenaries.getById(id).assign({ active: true }).write()
  }

  getNextRequest({ method, url }) {
    const _ = this._

    const scenarie = this.scenaries.find({ active: true })

    if (scenarie.size().value() === 0) {
      return undefined
    }

    const scenarieRequests = scenarie.value().requests

    const verifyRequestActive = _.first(_.orderBy(_.uniq(_.map(scenarieRequests, 'status')))) === 0

    if (!verifyRequestActive) {
      _.each(scenarieRequests, request => { request.status = 0 })

      scenarie.set('active', false).set('requests', scenarieRequests).write()

      return undefined
    }

    const nextScenarieRequest = _.find(scenarieRequests, { method, url, status: 0 })

    if (!nextScenarieRequest) {
      return undefined
    }

    const requestId = nextScenarieRequest.requestId

    nextScenarieRequest.status = 1

    const request = this.mockApplication.onRequests.getById(requestId)

    request.set({ requests: scenarieRequests }).write()

    return request.value()
  }

  create({ name, active = false, requests = [] }) {

    const scenarie = this.scenaries
      .pushIfNotExists({ name, active, requests }, ['name', 'active', 'requests'])
      .write()

    return scenarie
  }

  addRequest({ id, url, method, requestId }) {
    const newRequest = { url, requestId, method: method.toUpperCase(), status: 0 }

    const scenarie = this.scenaries.getById(id)
    const requests = scenarie.value().requests
    requests.push(newRequest)

    scenarie.set('requests', requests).write()

    return scenarie.value()
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
