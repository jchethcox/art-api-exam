//Intializing the app and establishing the port
const port = process.env.PORT || 5007
require('dotenv').config()
const express = require('express')
const app = express()

//adding necessary ramda functions
const {
  find,
  isEmpty,
  propOr,
  append,
  merge,
  not,
  isNil,
  filter,
  compose,
  reject,
  propEq,
  map,
  pathOr,
  split,
  path
} = require('ramda')

//importing functions created and used in the dal for speaking to database
const {
  addPainting,
  getPainting,
  deletePainting,
  replacePainting,
  listPaintings
} = require('./dal')

//a few more necessary functions
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const checkRequiredFields = require('./checkRequiredFields')

//Intializing body parser
app.use(bodyParser.json())

//First get simple message when contacting outermost webpage
app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

//command to get paintings one at a time by id
app.get('/paintings/:paintingID', function(req, res, next) {
  const paintingID = req.params.paintingID
  getPainting(paintingID, function(err, result) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(result)
  })
})

//command for grabbing a list of 5 paintings as a list can use limit or start_key
app.get('/paintings', function(req, res, next) {
  const limit = Number(pathOr(5, ['query', 'limit'], req))
  const paginate = pathOr(null, ['query', 'start_key'], req)

  listPaintings(limit, paginate)
    .then(paintings => res.status(200).send(paintings))
    .catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

//command to add new painting to database
app.post('/paintings', function(req, res, next) {
  const newPainting = propOr({}, 'body', req)
  if (isEmpty(newPainting)) {
    next(new NodeHTTPError(400, 'Did not include painting.'))
    return
  }

  const missingFields = checkRequiredFields(
    ['name', 'movement', 'artist', 'yearCreated', 'museum'],
    newPainting
  )

  if (not(isEmpty(missingFields))) {
    next(new NodeHTTPError(err.status, err.message, err))
    return
  }

  addPainting(newPainting, function(err, data) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message))
    }
    res.status(201).send(data)
  })
})

//command to modify information about a painting already in the database
app.put('/paintings/:_id', function(req, res, next) {
  const modPainting = propOr({}, 'body', req)

  if (isEmpty(modPainting)) {
    next(new NodeHTTPError(400, 'You did not include and instrument.'))
    return
  }

  const missingFields = checkRequiredFields(
    ['name', 'movement', 'artist', 'yearCreated', 'museum'],
    modPainting
  )

  if (not(isEmpty(missingFields))) {
    next(new NodeHTTPError(400, `You're missing some fields`))
    return
  }

  if (not(propEq('_id', req.params._id, modPainting))) {
    next(new NodeHTTPError(400, 'This id doesnt match the URI path id value'))
    return
  }

  replacePainting(modPainting, function(err, data) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(data)
  })
})

//command to remove a painting from the database
app.delete('/paintings/:_id', function(req, res, next) {
  const paintingID = req.params._id
  console.log(('paintingID: ', paintingID))

  deletePainting(paintingID, function(err, data) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(data)
  })
})

//middleware for helping diagnose issues in code
app.use(function(err, req, res, next) {
  console.log(
    'ERROR! ',
    'METHOD: ',
    req.method,
    ' PATH',
    req.path,
    ' error:',
    JSON.stringify(err)
  )
  res.status(err.status || 500)
  res.send(err)
})

//making sure the app is listening for commands
app.listen(port, () => console.log('API is up', port))
