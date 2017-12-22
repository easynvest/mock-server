const path = require('path')
const fs = require('fs')

module.exports = config => {
  const { uriApi: URI_API } = config

  const resourcesPath = path.join(process.cwd(), config.resourcesPath)

  const normalizedPath = path.join(resourcesPath, URI_API)

  const exportResources = {}

  if (!fs.existsSync(resourcesPath)) {
    fs.mkdirSync(resourcesPath)
  }

  if (!fs.existsSync(normalizedPath)) {
    fs.mkdirSync(normalizedPath)
  }

  console.log(normalizedPath)
  require('fs').readdirSync(normalizedPath).forEach(function (file) {
    if (['index.js', '.gitignore', '.DS_Store'].includes(file)) {
      return
    }

    exportResources[file.replace('.js', '')] = require(`${normalizedPath}/${file}`)
  })

  return exportResources
}
