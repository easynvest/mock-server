const url = require('url')
const request = require('supertest')

const configureApp = require('../../app')
const { getRequestBody, transformResponse } = require('../../middlewares/request')

const config = {
  port: '3001',
  uriApi: 'http://swapi.co/api',
  rewriteRoutes: './mock-server/rewriteRoutes.js',
}

describe('Request middleware', () => {
  it('getRequestBody JSON', () => {
    const mockRequest = { body: { name: 'TESTE' }, contentType: 'json' }
    const response = getRequestBody(mockRequest)
    expect(response).toEqual(JSON.stringify(mockRequest.body))
  })

  it('getRequestBody x-www-form-urlencoded', () => {
    const mockRequest = { body: { name: 'TESTE' }, contentType: 'x-www-form-urlencoded' }
    const response = getRequestBody(mockRequest)
    expect(response instanceof url.URLSearchParams).toBeTruthy()
  })

  it('getRequestBody', () => {
    const mockRequest = { body: { name: 'TESTE' }, contentType: '' }
    const response = getRequestBody(mockRequest)
    expect(response).toBeNull()
  })

  it('transformResponse with text/plain', async () => {
    const headers = {
      'content-type': 'text/plain',
      get: key => headers[key],
    }

    const options = {
      method: 'POST',
      url: '/users/42',
      headers,
      body: 'options with text plain',
      text: () => options.body,
    }

    const res = await transformResponse(options)
    expect(res).toBe(options.body)
  })

  it('transformResponse with json', async () => {
    const headers = {
      'content-type': 'json',
      get: key => headers[key],
    }

    const options = {
      method: 'POST',
      url: '/users/42',
      headers,
      body: { name: 'user', id: 10 },
      json: () => options.body,
    }

    const res = await transformResponse(options)
    expect(res).toBe(options.body)
  })

  it('test middleware', async () => {
    const app = configureApp(config, false, false)
    const response = await request(app).get('/proxy/people/1')
    expect(response.status).toBe(200)
  })

  it('test middleware with uriApi without http', async () => {
    const app = configureApp({ ...config, uriApi: 'swapi.co/api' }, false, false)
    const response = await request(app).get('/proxy/people/1')
    expect(response.status).toBe(200)
  })

  it('test middleware with not found', async () => {
    const app = configureApp({ ...config, uriApi: 'swapi.co/api' }, false, false)
    const response = await request(app).get('/proxy/peoples/1')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({})
  })
})
