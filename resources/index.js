const path = require('path')
const fs = require('fs')

const URI_API = process.env.API_URI
const normalizedPath = path.join(__dirname, `./${URI_API}`)

const exportResources = {}

if (!fs.existsSync(normalizedPath)) {
  fs.mkdirSync(normalizedPath)
}

console.log(normalizedPath)
require('fs').readdirSync(normalizedPath).forEach(function (file) {
  if (['index.js', '.gitignore', '.DS_Store'].includes(file)) {
    return
  }

  exportResources[file.replace('.js', '')] = require(`./${URI_API}/${file}`)
})

module.exports = exportResources