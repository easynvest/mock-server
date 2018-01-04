module.exports = ({ server, router }) => {
  server.get('/request-api', (req, res) => {
    server.locals.requestApi = !server.locals.requestApi
    res.status(200).json(server.locals.requestApi)
  })
}
