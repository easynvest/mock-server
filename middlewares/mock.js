const https = require('https')
const fetch = require('node-fetch')
const url = require('url')
const fs = require('fs')
const routes = require('../rewriteRoutes')
const FormData = require('form-data')

const URI_API = process.env.API_URI

const toFile = (file, content) => {
  fs.writeFile(file, `module.exports = ${content}\n`, 'utf8', err => {
    if (err) { return 'Error' }
    console.log(`Rewirte file resource ${file}`)
  })
}

module.exports = server => async (req, res, next) => {
  const parsedUrl = url.parse(req.originalUrl)
  const method = req.method
  const uri = `http://${URI_API}${parsedUrl.pathname}`
  const existRoute = routes[parsedUrl.pathname]

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
    let reqBody = req.body
    if (contentType.includes('json')) {
      reqBody = JSON.stringify(reqBody)
    }

    if (contentType.includes('x-www-form-urlencoded')) {
      const form = new url.URLSearchParams();
      Object.keys(req.body).forEach(key => {
        form.append(key, req.body[key])
      })

      reqBody = form
    }

    const config = {
      method,
      body: reqBody,
      headers: {
        'content-type': contentType
      }
    }

    console.log(config)
    const request = await fetch(uri, config)

    let body
    try {
      body = await request.clone().json()
    } catch (err) {
      body = await request.clone().text()
    }
    console.log(body)

    if (!server.locals.requestApi || [200, 400, 204].indexOf(request.status) === -1) {
      res.append('x-request-mock', 'true')
      next()
      return
    }

    let fileName = parsedUrl.pathname.replace(/[^a-zA-Z0-9-]/g, '')
    if (existRoute) {
      fileName = existRoute.replace('/', '')
    } else {
      routes[parsedUrl.pathname] = `/${fileName}`

      toFile(`${__dirname}/../rewriteRoutes.js`, JSON.stringify(routes, null, 2).replace(/'/g, '`').replace(/"/g, "'"))
    }

    let content = ''
    if (request.headers.get('content-type').includes('xml')) {
      content = JSON.stringify({ type: 'xml', content: body }, null, 2).replace(/"(.+)":/gi, '$1:').replace(/'/g, '`').replace(/"/g, "'")
    } else {
      content = JSON.stringify(body, null, 2).replace(/"(.+)":/gi, '$1:').replace(/'/g, '`').replace(/"/g, "'")
    }

    toFile(`./resources/${fileName}.js`, content)


    res.set('Content-Type', request.headers.get('content-type'))
    res.status(request.status).send(body)
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 1 })
  }
}
