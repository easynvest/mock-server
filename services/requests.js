class Requests {
  constructor(db, mockApplication) {
    this._ = db._
    this.mockApplication = mockApplication
    this.requests = db.get('requests')
  }

  all() {
    return this.requests.value()
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

  create({
    type = 'custom', method = 'GET', url, status = 200, response, query = {},
  }) {
    const request = this.requests
      .pushIfNotExists(
        {
          type,
          query,
          method: method.toUpperCase(),
          url,
          status,
          response,
        },
        ['method', 'url', 'status', 'response', 'query'],
      )
      .write()

    return request
  }

  saveIfHasDiff(mockRequest = {}, request) {
    const { _ } = this
    const attrsCompare = ['method', 'url', 'status', 'query']

    if (_.isEqual(_.pick(mockRequest, attrsCompare), _.pick(request, attrsCompare))) {
      return
    }

    if (!_.isEmpty(mockRequest)) {
      this.create({ ...request, type: 'custom' })
    }
  }

  defineDefault(id) {
    const request = this.requests.getById(id)
    if (request && request.value()) {
      const { method, url } = request.value()

      this.requests
        .find({ type: 'default', method, url })
        .assign({ type: 'custom' })
        .write()

      request.assign({ type: 'default' }).write()
    }
  }

  remove(id) {
    const request = this.requests.value().find(item => item.id === id)
    this.requests.remove(request).write()
  }
}

module.exports = Requests
