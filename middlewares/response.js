const debug = require('debug')('mock-server:middleware:response')

module.exports = () => async (req, res) => {
  debug('response')
  const {
    requestHttp: { request, response },
  } = req
  const { status } = request

  res.status(status).send(response)
}
