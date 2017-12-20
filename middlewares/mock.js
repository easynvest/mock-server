const https = require('https')
const fetch = require('node-fetch')
const url = require('url')
const fs = require('fs')
const routes = require('../rewriteRoutes')

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
  const uri = `http://${URI_API}${parsedUrl.path}`
  const existRoute = routes[parsedUrl.path]

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
        authorization,
        'content-type': contentType
      }
    }

    const request = await fetch(uri, config)

    if (!server.locals.requestApi || [200, 400, 204].indexOf(request.status) === -1) {
      res.append('x-request-mock', 'true')
      next()
      return
    }

    let fileName = parsedUrl.path.replace(/[^a-zA-Z0-9-]/g, '')
    if (existRoute) {
      fileName = existRoute.replace('/', '')
    } else {
      routes[parsedUrl.path] = `/${fileName}`

      toFile(`${__dirname}/../rewriteRoutes.js`, JSON.stringify(routes, null, 2).replace(/'/g, '`').replace(/"/g, "'"))
    }

    let closeFile = '\n'
    const fileStream = fs.createWriteStream(`./resources/${fileName}.js`, { encoding: 'utf-8' });
    fileStream.write('module.exports = ');

    res.set('Content-Type', 'application/json')

    if (request.headers.get('content-type').includes('xml')) {
      res.set('Content-Type', 'application/xml')
      fileStream.write('{ type: \'xml\', content: \'');
      closeFile = '\'}\n'
    }

    res.status(request.status)
    request.body.pipe(res)
    request.body.pipe(fileStream, { end: false })
    
    request.body.on('end', function () {
      fileStream.end(closeFile)
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 1 })
  }
}
