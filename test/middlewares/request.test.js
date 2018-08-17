const url = require('url')
const { getRequestBody } = require('../../middlewares/request')

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
})
