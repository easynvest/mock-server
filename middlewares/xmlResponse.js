const url = require('url')

module.exports = (server, router) => async (req, res, next) => {
  const parsedUrl = url.parse(req.originalUrl)

  const routes = require('../rewriteRoutes')

  const resource = routes[parsedUrl.pathname]
  
  if (server.locals.requestApi) {
    next()
    return
  }
  
  if(!resource) {
    next()
    return
  }

  const result = router.db.get(resource.replace('/', '')).value()

  if(result.type === 'xml') {
    res.set('Content-Type', 'text/xml')
    res.send(result.content)
    return
  }

  next()
}
