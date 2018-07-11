const debug = require('debug')('mock-server:middleware:findDB')
const url = require('url')

module.exports = ({ services }) => async (req, res, next) => {
  debug('findDB')
  const parsedUrl = url.parse(req.originalUrl.replace(/^\/proxy/, ''))
  const { method } = req
  req.mockRequest = services.onRequests.getTo({ method, url: parsedUrl.pathname })
  next()
}
