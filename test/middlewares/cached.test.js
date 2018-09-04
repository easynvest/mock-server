/* eslint no-underscore-dangle: 0 */
const httpMocks = require('node-mocks-http')
const cached = require('../../middlewares/cached')

const requestList = [
  {
    method: 'GET',
    url: '/mock/1',
    status: 200,
    response: { id: 1, name: 'mock 1' },
  },
  {
    method: 'GET',
    url: '/mock/51',
    status: 200,
    response: { id: 51, name: 'mock 51' },
  },
]

const requests = {
  value: () => requestList,
}

describe('Middleware: Cached', () => {
  it('should call next() when the requestApi flag is true', async () => {
    const server = { locals: { requestApi: true } }
    const services = {}
    const middleware = cached({ server, services })
    const nextMock = jest.fn()
    await middleware(null, null, nextMock)
    expect(nextMock).toHaveBeenCalledTimes(1)
  })

  it('should return the MOCKED request when requestApi flag is false and has mock', async () => {
    const server = { locals: { requestApi: false } }
    const services = {}
    const middleware = cached({ server, services })
    const req = httpMocks.createRequest()
    req.mockRequest = { status: 200, response: 'mock' }
    const res = httpMocks.createResponse()
    const nextMock = jest.fn()
    await middleware(req, res, nextMock)
    expect(nextMock).not.toHaveBeenCalled()
    expect(res._isEndCalled()).toBe(true)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBe('mock')
  })

  it('should return the CACHED request when requestApi flag is false', async () => {
    const server = { locals: { requestApi: false } }
    const services = { onRequests: { requests } }
    const middleware = cached({ server, services })
    const req = httpMocks.createRequest({
      url: '/mock/2',
      method: 'GET',
    })
    const res = httpMocks.createResponse()
    await middleware(req, res, jest.fn())
    expect(res._isEndCalled()).toBe(true)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual({ id: 1, name: 'mock 1' })
    expect(res._getHeaders()).toEqual({ 'x-request-mock': 'true' })
  })
  it('should handle when no CACHED requests are found', async () => {
    const server = { locals: { requestApi: false } }
    const services = { onRequests: { requests: { value: () => [] } } }
    const middleware = cached({ server, services })
    const req = httpMocks.createRequest({
      url: '/mock/2',
      method: 'GET',
    })
    const res = httpMocks.createResponse()
    await middleware(req, res, jest.fn())
    expect(res._isEndCalled()).toBe(true)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual('')
    expect(res._getHeaders()).toEqual({ 'x-request-mock': 'true', 'x-request-mock-status': '404' })
  })
  it('should handle similar requests when evaluating the cached responses', async () => {
    const server = { locals: { requestApi: false } }
    const withSimilarRequest = [
      {
        method: 'GET',
        url: '/mock/1',
        status: 200,
        response: { id: 2, name: 'mock 2' },
      },
    ].concat(requestList)

    const services = { onRequests: { requests: { value: () => withSimilarRequest } } }
    const middleware = cached({ server, services })
    const req = httpMocks.createRequest({
      url: '/mock/2',
      method: 'GET',
    })
    const res = httpMocks.createResponse()
    await middleware(req, res, jest.fn())
    expect(res._isEndCalled()).toBe(true)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual({ id: 2, name: 'mock 2' })
    expect(res._getHeaders()).toEqual({ 'x-request-mock': 'true' })
  })
  it('should handle multiple similar requests when evaluating the cached responses', async () => {
    const server = { locals: { requestApi: false } }
    const withSimilarRequest = [
      {
        method: 'GET',
        url: '/mock/1?fake=param',
        status: 200,
        response: { id: 2, name: 'mock 2' },
      },
    ].concat(requestList)

    const services = { onRequests: { requests: { value: () => withSimilarRequest } } }
    const middleware = cached({ server, services })
    const req = httpMocks.createRequest({
      url: '/mock/2',
      method: 'GET',
    })
    const res = httpMocks.createResponse()
    await middleware(req, res, jest.fn())
    expect(res._isEndCalled()).toBe(true)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual({ id: 1, name: 'mock 1' })
    expect(res._getHeaders()).toEqual({ 'x-request-mock': 'true' })
  })
})
