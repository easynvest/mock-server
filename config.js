let globalConfig = {
  port: '',
  uriApi: '',
  rewriteRoutes: '',
  resourcesPath: ''
}

const getConfig = () => globalConfig

const setConfig = config => {
  globalConfig = { ...config }
}

module.exports = {
  getConfig,
  setConfig
}
