const mock = require('./mock')

module.exports = ({ server, dbService }) => {
  server.use('/proxy', mock({ server, dbService }))
}
