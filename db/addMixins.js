const lodashId = require('lodash-id')

module.exports = function (db) {

  const _ = db._

  _.mixin(lodashId)

  _.mixin({
    pushIfNotExists: function (array, data, verifyKeys) {
      const dataOriginal = _.cloneDeep(data)

      const exists = array.filter(item => {
        if (verifyKeys) {
          item = _.pick(item, verifyKeys)
          data = _.pick(data, verifyKeys)
        }

        const valuesItem = _.valuesIn(item)
        const valuesData = _.valuesIn(data)

        return _.isEqual(valuesItem, valuesData)
      })

      if (exists.length === 0) {
        _.insert(array, dataOriginal)
      }

      return array
    }
  })

}
