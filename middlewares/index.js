const mock = require('./mock')

module.exports = server => {
  server.use(mock(server))
}
