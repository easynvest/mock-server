const mock = require('./mock')
const xmlResponse = require('./xmlResponse')

module.exports = ({ server, router, dbService }) => {
  server.use(mock({ server, router, dbService }))
  server.use(xmlResponse({ server, router, dbService }))
}
