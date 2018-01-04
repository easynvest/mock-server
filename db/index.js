const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const addMixins = require('./addMixins')
const initService = require('./service')
const { getConfig } = require('../config')

const resourcesPathLocal = path.join(process.cwd(), './mock-server')

const adapter = new FileSync(path.join(resourcesPathLocal, './db.json'))
const db = low(adapter)
addMixins(db)
const service = initService(db)

db.defaults({ requests: [], scenaries: [] }).write()

module.exports = service
