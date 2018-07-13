const debug = require('debug')('mock-server:middleware:response')
const propPath = require('crocks/Maybe/propPath')

module.exports = () => async (req, res) => {
  debug('response')
  const status = propPath(['requestHttp', 'request', 'status'])(req).option(200)
  const response = propPath(['requestHttp', 'response'])(req).option({})

  res.status(status).send(response)
}
