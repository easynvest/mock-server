const https = require('https')
const fetch = require('node-fetch')
const url = require('url')

const URI_API = process.env.API_URI

module.exports = server => async (req, res, next) => {
  const parsedUrl = url.parse(req.originalUrl)
  const method = req.method
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

  const { authorization, 'content-type': contentType } = req.headers

  try {
    const config = {
      method,
      body: req.body,
      headers: {
        'content-type': contentType,
        authorization
      }
    }

    const request = await fetch(uri, config)

    let body
    try {
      body = await request.clone().json()
    } catch (err) {
      body = await request.clone().text()
    }

    if (!server.locals.requestApi || [200, 400, 204].indexOf(request.status) === -1) {
      res.append('x-request-mock', 'true')
      next()
      return
    }

    res.set('Content-Type', request.headers.get('content-type'))
    res.status(request.status).send(body)
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 1 })
  }
}
