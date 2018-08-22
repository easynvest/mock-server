const Memory = require('lowdb/adapters/Memory')
const configDB = require('../../db')
const servicesConfig = require('../../services')

let services
const MOCK_DATA = {
  requests: [],
  scenarios: [
    {
      id: 0,
      index: 0,
      requests: [
        { method: 'GET', url: '/planets/2' },
        { method: 'POST', url: '/planets/1' },
        { method: 'PUT', url: '/planets/3' },
      ],
      active: false,
      description: '',
    },
    {
      id: 1,
      index: 0,
      requests: [
        { method: 'GET', url: '/people/2' },
        { method: 'GET', url: '/people/1' },
        { method: 'GET', url: '/people/3' },
      ],
      active: false,
      description: '',
    },
    {
      id: 2,
      index: 0,
      requests: [
        { method: 'GET', url: '/users/2' },
        { method: 'POST', url: '/users/1' },
        { method: 'PUT', url: '/users/3' },
      ],
      active: false,
      description: '',
    },
  ],
}
const db = configDB(new Memory(), MOCK_DATA)

beforeAll(() => {
  services = servicesConfig(db)
})

describe('Scenarios', () => {
  it('should verify create default data', () => {
    expect(services.onRequests.requests.value()).toEqual([])
    expect(services.onScenarios.scenarios.value()).toEqual(MOCK_DATA.scenarios)
  })

  it('should get all scenarios', () => {
    const all = services.onScenarios.all()
    expect(all).toEqual(MOCK_DATA.scenarios)
  })

  it('should get all scenarios', () => {
    const scenario = services.onScenarios.getById(1)
    expect(scenario.value()).toEqual(MOCK_DATA.scenarios[1])
  })

  it('should active scenario', () => {
    services.onScenarios.active(1)
    const scenario = services.onScenarios.getById(1)
    expect(scenario.value()).toEqual({ ...MOCK_DATA.scenarios[1], active: true, index: 0 })
  })

  it('should getNextRequest scenario with disable scenario', () => {
    const id = 1
    services.onScenarios.disable(id)
    expect(services.onScenarios.getNextRequest({ method: 'GET', url: '/people/2' })).toBeUndefined()
  })

  it('should getNextRequest scenario with active scenario', () => {
    const id = 1
    services.onScenarios.active(id)

    const [request1, request2, request3] = MOCK_DATA.scenarios[1].requests

    expect(services.onScenarios.getNextRequest(request1)).toEqual(request1)
    expect(services.onScenarios.getNextRequest(request2)).toEqual(request2)
    expect(services.onScenarios.getNextRequest(request3)).toEqual(request3)
    expect(services.onScenarios.getNextRequest(request3)).toBeUndefined()
  })

  it('should getActiveByRequest scenario with active scenario', () => {
    const id = 1
    services.onScenarios.active(id)
    const scenario = services.onScenarios.getById(id).value()
    const [request1] = MOCK_DATA.scenarios[1].requests

    expect(services.onScenarios.getActiveByRequest(request1)).toEqual(scenario)
  })

  it('should create a scenario', () => {
    const scenario = {
      index: 0,
      requests: [],
      active: false,
      description: 'my-scenario',
    }

    services.onScenarios.create(scenario)
    expect(services.onScenarios.getBy(scenario)).toMatchObject(scenario)
  })

  it('should addRequest a scenario', () => {
    const id = 1
    const request = {
      method: 'POST',
      url: '/people/1',
    }

    services.onScenarios.addRequest(id, request)
    const { requests } = services.onScenarios.getById(1).value()
    expect(requests.pop()).toMatchObject(request)
  })

  it('should remove by id', () => {
    const id = 1
    services.onScenarios.remove(id)
    const response = services.onScenarios.getById(id).value()
    expect(response).toBeUndefined()
  })
})
