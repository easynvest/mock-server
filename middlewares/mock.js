const fetch = require('node-fetch')
const url = require('url')

const URI_API = process.env.API_URI

const cache = {}

module.exports = server => async (req, res, next) => {
  const parsedUrl = url.parse(req.originalUrl)
  const method = req.method
  const authorization = req.headers.authorization
  const uri = `http://${URI_API}${parsedUrl.pathname}`

  if (parsedUrl.pathname === '/request-api') {
    next()
    return
  }

  if (!server.locals.requestApi) {
    res.append('x-request-mock', 'true')
    next()
    return
  }

  if (cache[`${uri}-${method}`]) {
    res.append('x-request-mock', 'true')
    res.set('Content-Type', 'text/xml')
    res.status(200).send(cache[`${uri}-${method}`])
    return
  }
  
  const request = await fetch(uri, { method, headers: { authorization, 'content-type': 'text/xml' }, body: req.body })
  const body = await request.clone().text()

  if (request.status === 2 && body) {
    cache[`${uri}-${method}`] = body
  }
  
  // if (!server.locals.requestApi || [200, 400, 204].indexOf(request.status) === -1) {
  //   res.append('x-request-mock', 'true')
  //   next()
  //   return
  // }

  // let body
  // try {
  //   body = await request.clone().json()
  // } catch (err) {
  //   body = await request.clone().text()
  // }
  res.set('Content-Type', 'text/xml')
  res.status(request.status).send(body)
}
