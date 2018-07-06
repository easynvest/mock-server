const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const addMixins = require("./addMixins");
const { getConfig } = require("../config");

const resourcesPathLocal = path.join(process.cwd(), "./mock-server");

const configDB = (
  adapter = new FileSync(path.join(resourcesPathLocal, "./db.json")),
  defaultData = { requests: [], scenarios: [] }
) => {
  const db = low(adapter);
  addMixins(db);
  db.defaults(defaultData).write();

  return db;
};

module.exports = configDB;
