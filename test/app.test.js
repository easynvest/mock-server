// const request = require('supertest')
// const configureApp = require('../app')

// const config = {
//   port: '3001',
//   uriApi: 'swapi.co',
//   rewriteRoutes: './mock-server/rewriteRoutes.js'
// }

// const CONTRACT = ['type', 'method', 'url', 'status', 'response', 'query', 'id']
// const MOCK_CONTRACT = {
//   type: 'default',
//   method: 'GET',
//   url: 'swapi.co',
//   status: 200,
//   response: {},
//   query: {}
// }

// const app = configureApp(config, false, false)
// const validContract = (fields, body) => fields.every(field => field in body)

describe('GET /', () => {
  it.skip('Try get mock-server info', async () => {
    //     const response = await request(app).get('/')
    //     expect(response.statusCode).toBe(200)
  })
})

// describe('GET /request-api', () => {
//   it.skip('Try change request-api', async () => {
//     const response = await request(app).get('/request-api')
//     expect(response.statusCode).toBe(200)
//   })
// })

// describe('GET /scenarios', () => {
//   it.skip('Try get list of scenarios', async () => {
//     const response = await request(app).get('/scenarios')
//     expect(response.statusCode).toBe(200)
//     expect(Array.isArray(response.body)).toBeTruthy()
//   })
// })

// describe('GET /requests', () => {
//   it.skip('check if body is Array', async () => {
//     const response = await request(app).get('/requests')
//     expect(response.statusCode).toBe(200)
//     expect(Array.isArray(response.body)).toBeTruthy()
//   })

//   it.skip('check the contract of request', async () => {
//     const mockRequest = await request(app)
//       .post('/requests')
//       .send(MOCK_CONTRACT)
//       .set('Accept', 'application/json')

//     expect(mockRequest.statusCode).toBe(200)

//     const response = await request(app).get('/requests')

//     expect(response.statusCode).toBe(200)
//     expect(Array.isArray(response.body)).toBeTruthy()
//     expect(response.body.length > 0).toBeTruthy()
//     expect(validContract(CONTRACT, response.body.pop())).toBeTruthy()
//   })
// })

// describe('GET /requests/:id', () => {
//   it.skip('try get request with invalid id', async () => {
//     const response = await request(app).get('/requests/10')
//     expect(response.statusCode).toBe(404)
//   })

//   it.skip('try get request with valid id', async () => {
//     const mockRequest = await request(app)
//       .post('/requests')
//       .send(MOCK_CONTRACT)
//       .set('Accept', 'application/json')

//     const { id } = mockRequest.body.pop()
//     const response = await request(app).get(`/requests/${id}`)

//     expect(response.statusCode).toBe(200)
//     expect(validContract(CONTRACT, response.body)).toBeTruthy()
//   })
// })

// describe('POST /requests', () => {
//   it.skip('try with valid payload', async () => {
//     const response = await request(app)
//       .post('/requests')
//       .send(MOCK_CONTRACT)
//       .set('Accept', 'application/json')

//     expect(response.statusCode).toBe(200)
//     expect(Array.isArray(response.body)).toBeTruthy()
//     expect(response.body.length > 0).toBeTruthy()

//     const body = response.body.pop()
//     const isValidContract = validContract([...CONTRACT, 'id'], body)

//     expect(isValidContract).toBeTruthy()
//     expect(body).toEqual({ ...MOCK_CONTRACT, id: body.id })
//   })

//   it.skip('try with invalid payload', async () => {
//     const response = await request(app)
//       .post('/requests')
//       .send({ url: MOCK_CONTRACT.url })
//       .set('Accept', 'application/json')

//     expect(response.statusCode).toBe(400)
//   })
// })

// describe('PUT /requests', () => {
//   it.skip('try update with valid payload', async () => {
//     const response = await request(app)
//       .post('/requests')
//       .send(MOCK_CONTRACT)
//       .set('Accept', 'application/json')

//     const body = response.body.pop()
//     const update = await request(app)
//       .put(`/requests/${body.id}`)
//       .send({ type: 'custom' })

//     expect(update.statusCode).toBe(200)
//     expect(update.body).toEqual({ ...body, type: 'custom' })
//   })

//   it.skip('try update with invalid id', async () => {
//     const update = await request(app)
//       .put('/requests/10')
//       .send({ type: 'custom' })

//     expect(update.statusCode).toBe(404)
//   })

//   it.skip('try update with invalid payload', async () => {
//     const response = await request(app)
//       .post('/requests')
//       .send(MOCK_CONTRACT)
//       .set('Accept', 'application/json')

//     const body = response.body.pop()

//     const update = await request(app)
//       .put(`/requests/${body.id}`)
//       .send({ custom: 'custom' })

//     expect(update.statusCode).toBe(400)
//   })
// })

// describe('DELETE /requests', () => {
//   it.skip('try delete with valid id', async () => {
//     const response = await request(app)
//       .post('/requests')
//       .send(MOCK_CONTRACT)
//       .set('Accept', 'application/json')

//     const body = response.body.pop()
//     const deleteResponse = await request(app).delete(`/requests/${body.id}`)
//     expect(deleteResponse.statusCode).toBe(200)

//     const getDeletedRequest = await request(app).get(`/requests/${body.id}`)
//     expect(getDeletedRequest.statusCode).toBe(404)
//   })

//   it.skip('try delete with invalid id', async () => {
//     const deleteResponse = await request(app).delete('/requests/10')
//     expect(deleteResponse.statusCode).toBe(404)
//   })
// })
