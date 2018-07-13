const lodashId = require('lodash-id')

module.exports = db => {
  const { _ } = db

  _.mixin(lodashId)

  _.mixin({
    pushIfNotExists(array, data, verifyKeys) {
      const dataOriginal = _.cloneDeep(data)

      const exists = array.filter(item => {
        let verifiedItem = item
        let verifiedData = data

        if (verifyKeys) {
          verifiedItem = _.pick(verifiedItem, verifyKeys)
          verifiedData = _.pick(verifiedData, verifyKeys)
        }

        const valuesItem = _.valuesIn(verifiedItem)
        const valuesData = _.valuesIn(verifiedData)

        return _.isEqual(valuesItem, valuesData)
      })

      if (exists.length === 0) {
        _.insert(array, dataOriginal)
      }

      return array
    },
  })
}
