require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
const pkgen = require('./pkgen')
const { merge, map, prop } = require('ramda')
const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const getPainting = (id, callback) => db.get(id, callback)

const replacePainting = (painting, cb) => db.put(paintng, cb)

const addPainting = (painting, cb) => {
  const newPainting = merge(painting, {
    type: 'painting',
    _id: pkgen('painting', '_', `${painting.name}`)
  })
  db.put(newPainting, cb)
}

const listPaintings = (limit, paginate) =>
  db
    .allDocs(
      paginate
        ? { include_docs: true, start_key: `${paginate}\ufff0` }
        : { include_docs: true, limit }
    )
    .then(response => map(prop('doc'), response.rows))

const deletePainting = (paintingID, callback) => {
  db.get(paintingID, function(err, doc) {
    if (err) {
      callback(err)
      return
    }
    db.remove(doc, function(err, deleter) {
      if (err) {
        callback(err)
        return
      }
      callback(null, deleter)
    })
  })
}

// const listDocs = (options, cb) =>
//   db.allDocs(options, function(err, result) {
//     if (err) cb(err)
//     cb(null, map(row => row.doc.name, result.rows))
//   })

const dal = {
  getPainting,
  addPainting,
  deletePainting,
  replacePainting,
  listPaintings
}

module.exports = dal
