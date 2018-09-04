const Memory = require('lowdb/adapters/Memory')
const configDB = require('../../db')
const servicesConfig = require('../../services')

let services
let db

beforeAll(() => {
  db = configDB(new Memory(), {
    requests: [
      {
        url: 'http://swapi.co/api/planets/3',
        method: 'POST',
        type: 'default',
      },
    ],
    scenarios: [
      {
        id: 0,
        index: 0,
        requests: [
          { method: 'POST', url: '/users/2' },
          { method: 'POST', url: '/users/1' },
          { method: 'POST', url: '/users/3' },
        ],
        active: true,
        description: '',
      },
    ],
  })
  services = servicesConfig(db)
})

describe('Service', () => {
  it('should create a request', () => {
    const url = 'http://swapi.co/api/people/1'
    const response = { name: 'Luke' }
    const requests = services.onRequests.create({
      url,
      response,
    })

    const request = requests[1]

    expect(request.id).toEqual(expect.anything())
    expect(request.method).toBe('GET')
    expect(request.response).toEqual(response)
    expect(request.status).toBe(200)
    expect(request.type).toBe('custom')
    expect(request.url).toBe(url)
  })

  it('should save with a empty mock request', () => {
    const request = {
      url: 'http://swapi.co/api/users/1',
      response: { name: 'Luke' },
      method: 'POST',
    }

    services.onRequests.saveIfHasDiff({ ...request, method: 'GET' }, request)
    const requests = services.onRequests.allResponses(request).pop()

    expect(requests).toMatchObject(request)
  })

  it('should save with a empty mock request', () => {
    const request = {
      url: 'http://swapi.co/api/users/3',
      response: { name: 'Luke' },
      method: 'POST',
    }

    services.onRequests.saveIfHasDiff({}, request)

    const requests = services.onRequests.allResponses(request)
    expect(requests.length).toBe(0)
  })

  it('should define default', () => {
    const request = services.onRequests.all()[1]

    services.onRequests.defineDefault(request.id)

    const { type } = services.onRequests.getById(request.id).value()
    expect(type).toBe('default')
  })

  it('should return mock-request', () => {
    const request = {
      url: 'http://swapi.co/api/planets/3',
      method: 'POST',
    }

    const response = services.onRequests.getTo(request)
    expect(response).toMatchObject(request)
  })

  it('should return with scenario mock-request', () => {
    const request = { method: 'POST', url: '/users/2' }

    const response = services.onRequests.getTo(request)
    expect(response).toMatchObject(request)
  })
})
