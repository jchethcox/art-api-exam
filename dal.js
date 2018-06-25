//our data access layer for accessing the database and changing as is required
//by app.js

//connecting dal to the database and importing some required functions
require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
const pkgen = require('./pkgen')
const { merge, map, prop } = require('ramda')
const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

//displays information on one painting from database using _id parameter
const getPainting = (id, callback) => db.get(id, callback)

//changes on paintings information in database using _id parameter
const replacePainting = (painting, cb) => db.put(painting, cb)

//posts a new painting to the database
const addPainting = (painting, cb) => {
  const newPainting = merge(painting, {
    type: 'painting',
    _id: pkgen('painting', '_', `${painting.name}`)
  })
  db.put(newPainting, cb)
}

//displays up 2 five paintings at a time using changeable limit and start_key
const listPaintings = (limit, paginate) =>
  db
    .allDocs(
      paginate
        ? { include_docs: true, start_key: `${paginate}\ufff0` }
        : { include_docs: true, limit }
    )
    .then(response => map(prop('doc'), response.rows))

//removes one painting from database
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

// allows these functions to be used in the app.js file
const dal = {
  getPainting,
  addPainting,
  deletePainting,
  replacePainting,
  listPaintings
}

//exporting functions
module.exports = dal
