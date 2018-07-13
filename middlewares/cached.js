const debug = require('debug')('mock-server:middleware:cached')
const URL = require('url')

const getLikeURL = (acc, char, key, currentUrl) => {
  const str = acc.str + char
  const list = acc.list.filter(({ url }) => url.startsWith(str))
  if (list.length === 0) {
    if (currentUrl.length / 2 <= str.length) return acc
    return { list: [], str }
  }
  return { list, str }
}

module.exports = ({ server, services }) => async (req, res, next) => {
  debug('cached')
  const { mockRequest } = req

  if (!server.locals.requestApi) {
    if (mockRequest) {
      res.append('x-request-mock', 'true')
      res.status(mockRequest.status)
      res.send(mockRequest.response)
      return
    }

    const { pathname } = URL.parse(req.url)
    const barsNumber = pathname.split('/').length + 1
    const cached = services.onRequests.requests
      .value()
      .filter(
        request => request.method === req.method && request.url.split('/').length === barsNumber,
      )

    const like = Array.prototype.reduce.call(pathname, getLikeURL, { list: cached, str: '' })
    const likeSorted = like.list.sort((a, b) => {
      if (a.url.length > b.url.length) return 1
      if (a.url.length === b.url.length) return 0
      return -1
    })

    if (likeSorted.length > 0) {
      const [cachedReponse] = likeSorted
      res.append('x-request-mock', 'true')
      res.status(cachedReponse.status)
      res.send(cachedReponse.response)
      return
    }

    res.append('x-request-mock', 'true')
    res.append('x-request-mock-status', 404)
    res.status(200)
    res.send()
    return
  }

  next()
}
