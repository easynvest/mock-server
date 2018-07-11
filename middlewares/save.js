const debug = require('debug')('mock-server:middleware:save')

module.exports = ({ services }) => async (req, res, next) => {
  debug('save')
  const {
    mockRequest,
    requestHttp: { request, response },
    method,
  } = req

  const { url, status } = request

  services.onRequests.saveIfHasDiff(
    { mockRequest },
    {
      type: 'default',
      method,
      url,
      status,
      response,
    },
  )

  next()
}
