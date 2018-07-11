const debug = require('debug')('mock-server:middleware:request')
const fetch = require('node-fetch')
const url = require('url')
const { getConfig } = require('../config')

const transformResponse = async request => {
  const contentType = request.headers.get('content-type')
  if (contentType.includes('text/plain')) {
    return request.text()
  }
  return request.json()
}

module.exports = () => async (req, res, next) => {
  debug('request')
  const { uriApi: URI_API } = getConfig()
  const parsedUrl = url.parse(req.originalUrl.replace(/^\/proxy/, ''))
  const { method } = req
  const uri = `http://${URI_API}${parsedUrl.path}`
  const { authorization, 'content-type': contentType = '' } = req.headers

  try {
    let reqBody = req.body
    if (contentType.includes('json')) {
      reqBody = JSON.stringify(reqBody)
    }

    if (contentType.includes('x-www-form-urlencoded')) {
      const form = new url.URLSearchParams()
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
        'content-type': contentType,
      },
    }

    const request = await fetch(uri, config)

    let response
    try {
      response = await transformResponse(request)

      req.requestHttp = { request, response }
    } catch (e) {
      debug(e)
    }
  } catch (e) {
    debug(e)
  }
  next()
}
