const normalizedPath = require("path").join(__dirname, './')

const exportResources = {}

require('fs').readdirSync(normalizedPath).forEach(function (file) {
  if (['index.js', '.gitignore'].includes(file) ) {
    return
  }

  exportResources[file.replace('.js', '')] = require(`./${file}`)
})

module.exports = exportResources