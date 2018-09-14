const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const addMixins = require('./addMixins')

const resourcesPathLocal = path.join(process.cwd(), './mock-server')

const configDB = (
  adapter = new FileSync(path.join(resourcesPathLocal, './db.json')),
  defaultData = { requests: [], scenarios: [] },
  database = low,
) => {
  const db = database(adapter)
  addMixins(db)
  db.defaults(defaultData).write()

  return db
}

module.exports = configDB
