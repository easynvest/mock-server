const mock = require('./mock')

module.exports = ({ server, router, dbService }) => {
  server.use('/proxy', mock({ server, router, dbService }))
}
