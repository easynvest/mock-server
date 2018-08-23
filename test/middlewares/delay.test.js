const delay = require('../../middlewares/delay')

const middleware = delay()
describe('delay middleware', () => {
  it('Should wait delay', async () => {
    const next = jest.fn()
    const mock = {
      mockRequest: { delay: 2000 },
    }

    jest.useFakeTimers()
    middleware(mock, null, next)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), mock.mockRequest.delay)
  })

  it('Should pass without delay', async () => {
    const next = jest.fn()
    const mock = {
      mockRequest: {},
    }

    jest.useFakeTimers()
    middleware(mock, null, next)

    expect(setTimeout).toHaveBeenCalledTimes(0)
    expect(next).toHaveBeenCalled()
  })
})
