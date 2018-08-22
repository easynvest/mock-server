const uuid = require('uuid/v4')

class Scenarios {
  constructor(db, api) {
    this._ = db._
    this.requests = api.onRequests
    this.scenarios = db.get('scenarios')
  }

  all() {
    return this.scenarios.value()
  }

  getById(id) {
    return this.scenarios.getById(id)
  }

  getBy(props) {
    return this.scenarios.find(props).value()
  }

  active(id) {
    this.getById(id)
      .assign({ active: true, index: 0 })
      .write()
  }

  disable(id) {
    this.getById(id)
      .assign({ active: false, index: 0 })
      .write()
  }

  getActiveByRequest(props) {
    const scenarios = this.all()

    return scenarios.reduce((acc, item) => {
      const hasEqualRequest = item.requests.find(
        ({ method, url }) => props.method === method && props.url === url,
      )

      if (item.active && hasEqualRequest) return item
      return acc
    }, undefined)
  }

  getNextRequest({ method, url }) {
    const scenario = this.getActiveByRequest({ method, url })

    if (scenario) {
      if (scenario.requests.length > scenario.index) {
        const request = scenario.requests[scenario.index]

        this.getById(scenario.id)
          .assign({ index: scenario.index + 1 })
          .write()
        return request
      }

      this.disable(scenario.id)
    }
    return undefined
  }

  create(scenario) {
    const data = {
      index: 0,
      active: false,
      ...scenario,
      requests: scenario.requests.map(request => ({ id: uuid(), ...request })),
    }

    return this.scenarios
      .pushIfNotExists(data, ['active', 'requests', 'index', 'description'])
      .write()
  }

  update(id, props) {
    this.scenarios
      .getById(id)
      .assign(props)
      .write()
  }

  addRequest(id, request) {
    const scenario = this.getById(id)
    const value = scenario.value()
    const data = { id: uuid(), ...request }
    const requests = value.requests.concat(data)

    scenario.assign({ requests }).write()
    return data
  }

  remove(id) {
    const scenario = this.scenarios.value().find(item => item.id === id)
    this.scenarios.remove(scenario).write()
  }
}

module.exports = Scenarios
