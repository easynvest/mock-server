let globalConfig = {
  port: '',
  uriApi: '',
}

const getConfig = () => globalConfig

const setConfig = config => {
  globalConfig = { ...config }
}

module.exports = {
  getConfig,
  setConfig,
}
