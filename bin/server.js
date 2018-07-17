/* eslint no-console:  ["error", { allow: ["log"] }] */
// eslint-disable-line global-require

const path = require('path')
const mockServer = require('../app')

const localPath = process.cwd()
const { cacheOnly = false, mockServerConfigName = 'mock-server.conf.js' } = process.env
const configFile = path.join(localPath, mockServerConfigName)

try {
  // eslint-disable-next-line
  const config = require(configFile)
  const app = mockServer(config, cacheOnly === 'true')
  const port = config.port || 3001

  app.set('port', port)
  app.listen(port, err => {
    if (err) console.log(err)
    console.log('\n> Server Start\n')
  })
} catch (e) {
  console.log('Error', e)
}
