const url = require('url')
const path = require('path')
const { getConfig } = require('../config')

module.exports = ({ server, router }) => async (req, res, next) => {
  const { uriApi: URI_API, rewriteRoutes, resourcesPath } = getConfig()
  const rewriteRoutesPath = path.join(process.cwd(), rewriteRoutes)
  const routes = require(rewriteRoutesPath)
  const parsedUrl = url.parse(req.originalUrl)

  const resource = routes[parsedUrl.pathname]

  if (server.locals.requestApi) {
    next()
    return
  }

  if (!resource) {
    next()
    return
  }

  const result = router.db.get(resource.replace('/', '')).value()

  if (result) {
    if (result.type === 'xml') {
      res.set('Content-Type', 'text/xml')
      res.send(result.content)
      return
    } else {
      res.status(200).json(result)
      return
    }
  }

  next()
}
