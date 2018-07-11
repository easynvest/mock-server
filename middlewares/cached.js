const debug = require('debug')('mock-server:middleware:cached')

module.exports = ({ server }) => async (req, res, next) => {
  debug('cached')
  const { mockRequest } = req

  if (!server.locals.requestApi && mockRequest) {
    res.append('x-request-mock', 'true')

    res.status(mockRequest.status)
    res.send(mockRequest.response)
    return
  }

  next()
}
