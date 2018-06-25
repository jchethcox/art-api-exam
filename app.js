const port = process.env.PORT || 5007
require('dotenv').config()
const express = require('express')
const app = express()

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

const { addPainting, getPainting } = require('./dal')

const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
const checkRequiredFields = require('./checkRequiredFields')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

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

app.put('/paintings/:id', function(req, res, next) {
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

  if (not(propEq('id', req.params.id, modPainting))) {
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

app.listen(port, () => console.log('API is up', port))
