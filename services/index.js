const configDB = require('../db')
const Requests = require('./requests')
const Scenarios = require('./scenarios')

const services = (db = configDB()) => {
  const api = {}
  const onRequests = new Requests(db, api)
  const onScenarios = new Scenarios(db, api)

  api.onRequests = onRequests
  api.onScenarios = onScenarios

  return api
}

module.exports = services
