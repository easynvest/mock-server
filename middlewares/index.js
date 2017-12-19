const mock = require('./mock')
const xmlResponse = require('./xmlResponse')

module.exports = (server, router) => {
  server.use(mock(server, router))
  server.use(xmlResponse(server, router))
}
