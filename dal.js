require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
const pkgen = require('./pkgen')
const { merge } = require('ramda')

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const getPainting = (id, callback) => db.get(id, callback)

const addPainting = (painting, cb) => {
  const newPainting = merge(painting, {
    type: 'painting',
    _id: pkgen('painting', '_', `${painting.name}`)
  })
  db.put(newPainting, cb)
}

const dal = {
  getPainting,
  addPainting
}

module.exports = dal
