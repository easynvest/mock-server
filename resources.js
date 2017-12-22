const path = require('path')
const fs = require('fs')
const { getConfig } = require('./config')

module.exports = () => {
  const config = getConfig()
  const { uriApi: URI_API } = config

  const resourcesPath = path.join(process.cwd(), config.resourcesPath)

  const apiPath = path.join(resourcesPath, URI_API)

  const exportResources = {}

  if (!fs.existsSync(resourcesPath)) {
    fs.mkdirSync(resourcesPath)
  }

  if (!fs.existsSync(apiPath)) {
    fs.mkdirSync(apiPath)
  }

  require('fs').readdirSync(apiPath).forEach(function (file) {
    if (!/\.js$/.test(file)) {
      return
    }

    exportResources[file.replace('.js', '')] = require(`${apiPath}/${file}`)
  })

  return exportResources
}
