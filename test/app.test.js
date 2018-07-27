const request = require('supertest')
const configureApp = require('../app')

const config = {
  port: '3001',
  uriApi: 'swapi.co',
  rewriteRoutes: './mock-server/rewriteRoutes.js',
}

const app = configureApp(config, false)

describe('GET /requests', () => {
  it('respond with json', done => {
    request(app)
      .get('/requests')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(100, done)

    expect(true).toBe(false)
  })
})
