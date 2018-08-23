const request = require('supertest')
const configureApp = require('../app')

const config = {
  port: '3001',
  uriApi: 'swapi.co',
  rewriteRoutes: './mock-server/rewriteRoutes.js',
}

const CONTRACT = ['type', 'method', 'url', 'status', 'response', 'query', 'id']
const MOCK_CONTRACT = {
  type: 'default',
  method: 'GET',
  url: 'swapi.co',
  status: 200,
  response: {},
  query: {},
}

const MOCK_SCENARIO = {
  index: 0,
  requests: [
    { method: 'GET', url: '/people/2' },
    { method: 'GET', url: '/people/1' },
    { method: 'GET', url: '/people/3' },
  ],
  active: false,
  description: '',
}

const app = configureApp(config, false, false)
const validContract = (fields, body) => fields.every(field => field in body)

describe('GET /', () => {
  it('Try get mock-server info', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })
})

describe('GET /request-api', () => {
  it('Try change request-api', async () => {
    const response = await request(app).get('/request-api')
    expect(response.statusCode).toBe(200)
  })
})

describe('GET /scenarios', () => {
  it('Try get list of scenarios', async () => {
    const response = await request(app).get('/scenarios')
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
  })
})

describe('GET /requests', () => {
  it('check if body is Array', async () => {
    const response = await request(app).get('/requests')
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
  })

  it('check the contract of request', async () => {
    const mockRequest = await request(app)
      .post('/requests')
      .send(MOCK_CONTRACT)
      .set('Accept', 'application/json')

    expect(mockRequest.statusCode).toBe(200)

    const response = await request(app).get('/requests')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length > 0).toBeTruthy()
    expect(validContract(CONTRACT, response.body.pop())).toBeTruthy()
  })
})

describe('GET /requests/:id', () => {
  it('try get request with invalid id', async () => {
    const response = await request(app).get('/requests/10')
    expect(response.statusCode).toBe(404)
  })

  it('try get request with valid id', async () => {
    const mockRequest = await request(app)
      .post('/requests')
      .send(MOCK_CONTRACT)
      .set('Accept', 'application/json')

    const { id } = mockRequest.body.pop()
    const response = await request(app).get(`/requests/${id}`)

    expect(response.statusCode).toBe(200)
    expect(validContract(CONTRACT, response.body)).toBeTruthy()
  })
})

describe('POST /requests', () => {
  it('try with valid payload', async () => {
    const response = await request(app)
      .post('/requests')
      .send(MOCK_CONTRACT)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length > 0).toBeTruthy()

    const body = response.body.pop()
    const isValidContract = validContract([...CONTRACT, 'id'], body)

    expect(isValidContract).toBeTruthy()
    expect(body).toEqual({ ...MOCK_CONTRACT, id: body.id })
  })

  it('try with invalid payload', async () => {
    const response = await request(app)
      .post('/requests')
      .send({ url: MOCK_CONTRACT.url })
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(400)
  })
})

describe('PUT /requests', () => {
  it('try update with valid payload', async () => {
    const response = await request(app)
      .post('/requests')
      .send(MOCK_CONTRACT)
      .set('Accept', 'application/json')

    const body = response.body.pop()
    const update = await request(app)
      .put(`/requests/${body.id}`)
      .send({ type: 'custom' })

    expect(update.statusCode).toBe(200)
    expect(update.body).toEqual({ ...body, type: 'custom' })
  })

  it('try update with invalid id', async () => {
    const update = await request(app)
      .put('/requests/10')
      .send({ type: 'custom' })

    expect(update.statusCode).toBe(404)
  })

  it('try update with invalid payload', async () => {
    const response = await request(app)
      .post('/requests')
      .send(MOCK_CONTRACT)
      .set('Accept', 'application/json')

    const body = response.body.pop()

    const update = await request(app)
      .put(`/requests/${body.id}`)
      .send({ custom: 'custom' })

    expect(update.statusCode).toBe(400)
  })
})

describe('DELETE /requests', () => {
  it('try delete with valid id', async () => {
    const response = await request(app)
      .post('/requests')
      .send(MOCK_CONTRACT)
      .set('Accept', 'application/json')

    const body = response.body.pop()
    const deleteResponse = await request(app).delete(`/requests/${body.id}`)
    expect(deleteResponse.statusCode).toBe(200)

    const getDeletedRequest = await request(app).get(`/requests/${body.id}`)
    expect(getDeletedRequest.statusCode).toBe(404)
  })

  it('try delete with invalid id', async () => {
    const deleteResponse = await request(app).delete('/requests/10')
    expect(deleteResponse.statusCode).toBe(404)
  })
})

describe('/scenarios', () => {
  it('try create a scenario', async () => {
    const response = await request(app)
      .post('/scenarios')
      .set('Accept', 'application/json')
      .send(MOCK_SCENARIO)

    expect(response.status).toBe(200)
  })

  it('try get scenarios', async () => {
    const response = await request(app)
      .get('/scenarios')
      .send()

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })
  it('try get scenario by id', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()
    const { id } = scenarios.body.pop()

    const response = await request(app)
      .get(`/scenarios/${id}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body.id).toEqual(id)
  })

  it('try get scenario by id without id', async () => {
    const id = 0
    const response = await request(app)
      .get(`/scenarios/${id}`)
      .send()

    expect(response.status).toBe(404)
  })

  it('try active scenario by id', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()

    const { id } = scenarios.body.pop()
    const response = await request(app)
      .get(`/scenarios/${id}/enable`)
      .send()

    expect(response.status).toBe(200)

    const scenario = await request(app)
      .get(`/scenarios/${id}`)
      .send()

    expect(scenario.status).toBe(200)
    expect(scenario.body.active).toBeTruthy()
    expect(scenario.body.index).toEqual(0)
  })

  it('try disable scenario by id', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()

    const { id } = scenarios.body.pop()
    const response = await request(app)
      .get(`/scenarios/${id}/disable`)
      .send()

    expect(response.status).toBe(200)

    const scenario = await request(app)
      .get(`/scenarios/${id}`)
      .send()

    expect(scenario.status).toBe(200)
    expect(scenario.body.active).toBeFalsy()
    expect(scenario.body.index).toEqual(0)
  })

  it('try update scenario by id', async () => {
    const mock = { active: true, description: 'my-description' }
    const scenarios = await request(app)
      .get('/scenarios')
      .send()

    const { id } = scenarios.body.pop()
    const response = await request(app)
      .put(`/scenarios/${id}`)
      .send(mock)
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)

    const scenario = await request(app)
      .get(`/scenarios/${id}`)
      .send()

    expect(scenario.status).toBe(200)
    expect(scenario.body).toMatchObject(mock)
  })

  it('try get scenarios request by id', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()

    const { id } = scenarios.body.pop()
    const requests = await request(app)
      .get(`/scenarios/${id}/requests`)
      .send()

    expect(requests.status).toBe(200)
    expect(Array.isArray(requests.body)).toBeTruthy()
  })

  it('try get scenarios request with wrong id', async () => {
    const id = '123'
    const requests = await request(app)
      .get(`/scenarios/${id}/requests`)
      .send()

    expect(requests.status).toBe(404)
  })

  it('try add request on a scenario', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()

    const mock = { url: '/users/1', method: 'post' }
    const { id } = scenarios.body.pop()
    const requests = await request(app)
      .post(`/scenarios/${id}/requests`)
      .send(mock)
      .set('Accept', 'application/json')

    expect(requests.status).toBe(200)

    const scenario = await request(app).get(`/scenarios/${id}/requests/${requests.body.id}`)
    expect(scenario.status).toBe(200)
    expect(scenario.body).toMatchObject(mock)
    expect(scenario.body.id).not.toBeNull()
  })

  it('try add request on a scenario', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()

    const mock = [{ url: '/users/1', method: 'post' }, { url: '/users/2', method: 'post' }]
    const { id } = scenarios.body.pop()
    const requests = await request(app)
      .post(`/scenarios/${id}/requests`)
      .send(mock)
      .set('Accept', 'application/json')

    expect(Array.isArray(requests.body)).toBeTruthy()

    expect(requests.status).toBe(200)

    requests.body.map(async req => {
      const scenario = await request(app).get(`/scenarios/${id}/requests/${req.id}`)
      expect(scenario.status).toBe(200)
    })
  })

  it('try get scenario request without id', async () => {
    const id = 200
    const reqId = 0
    const scenario = await request(app).get(`/scenarios/${id}/requests/${reqId}`)
    expect(scenario.status).toBe(404)
  })

  it('try update scenario request', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()
    const { id, requests } = scenarios.body.pop()
    const req = requests.pop()
    const scenario = await request(app)
      .put(`/scenarios/${id}/requests/${req.id}`)
      .send({ ...req, method: 'GET' })
    expect(scenario.status).toBe(200)

    const updated = await request(app)
      .get(`/scenarios/${id}/requests/${req.id}`)
      .send()

    expect(updated.body.method).toBe('GET')
  })

  it('try update scenario request without id', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()

    const id = 200
    const { requests } = scenarios.body.pop()
    const req = requests.pop()
    const scenario = await request(app)
      .put(`/scenarios/${id}/requests/${req.id}`)
      .send({ ...req, method: 'GET' })

    expect(scenario.status).toBe(404)
  })

  it('try remove scenario request', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()
    const { id, requests } = scenarios.body.pop()
    const req = requests.pop()

    const scenario = await request(app).delete(`/scenarios/${id}/requests/${req.id}`)
    expect(scenario.status).toBe(200)

    const updated = await request(app)
      .get(`/scenarios/${id}/requests/${req.id}`)
      .send()
    expect(updated.status).toBe(404)
  })

  it('try remove scenario request without id', async () => {
    const scenarios = await request(app)
      .get('/scenarios')
      .send()
    const { requests } = scenarios.body.pop()
    const id = 200
    const req = requests.pop()

    const scenario = await request(app).delete(`/scenarios/${id}/requests/${req.id}`)
    expect(scenario.status).toBe(404)
  })
})
