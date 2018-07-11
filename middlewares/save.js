const debug = require('debug')('mock-server:middleware:save')
const URL = require('url')

module.exports = ({ services }) => async (req, res, next) => {
  debug('save')
  const {
    mockRequest,
    requestHttp: { request, response },
    method,
  } = req
  const { url, status } = request
  const parsedUrl = URL.parse(url, true)

  services.onRequests.saveIfHasDiff(
    { mockRequest },
    {
      type: 'default',
      method,
      url: parsedUrl.pathname.replace('/api', ''),
      query: parsedUrl.query,
      status,
      response,
    },
  )

  next()
}
