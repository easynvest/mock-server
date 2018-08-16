const request = require('supertest')
const configureApp = require('../../app')

const config = {
  port: '3001',
  uriApi: 'swapi.co/api',
  rewriteRoutes: './mock-server/rewriteRoutes.js',
}

const CONTRACT = ['type', 'method', 'url', 'status', 'response', 'query', 'id']
const MOCK_CONTRACT = {
  type: 'default',
  method: 'GET',
  url: '/people/1/',
  status: 200,
  response: {},
  query: {},
}

const app = configureApp(config, false, false)
const appCached = configureApp(config, true, false)

describe('Cached', () => {
  it('Should return 200', async () => {
    const response = await request(app)
      .post('/requests')
      .send(MOCK_CONTRACT)
      .set('Accept', 'application/json')

    const getCache = await request(appCached).get('/proxy/people/5')

    expect(true).toBeFalsy()
  })
})
