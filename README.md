#Readme documentation to run art-api-exam

This file will teach you how to get this api up and running

This will run through how to:

1.  Clone this repo
2.  install all required dependecies
3.  establish .env file
4.  upload database to couchdb
5.  start up the api

## Cloning repo

1.  copy like to repo here: https://github.com/jchethcox/art-api-exam.git
2.  use the following commands in your console
3.  git clone "repo link" "desired file name"
4.  cd "file name" ('to enter directory')

##Installing dependecies

1.  use the following commands in your console
2.  npm install
3.  Be sure you installed all of the following in your dependencies portion
    of your package.json file :
    body-parser":
    "dotenv"
    "express"
    "node-http-error"
    "pouchdb-adapter-http"
    "pouchdb-core"
    "ramda"
    "nodemon"

##Establishing .env file for your environment variables

1.  create a .env file in you art-api-exam directory
2.  set your PORT to "5007"
3.  set COUCH_HOSTNAME to http://admin:dAn6CGT4AGNW@jch.jrscode.cloud
4.  set COUCHDB_NAME to joshart to view my database

##Uploading database to COUCH

1.  add the following commands to your load-data.js file

```
require('dotenv').config()
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)
```

2.  Copy the array of objects from the intstructions.md file into const = joshart
    in the load-data.js
3.  in the console run "node load-data.js"

##Starting up the api

1.  be sure that in your package.json file you have a start script for
    nodemon app.js
2.  run "npm start" in the console to intialize the api

##Notes

1.  include all necessary ramda and local functions for app and dal files
2.  Be sure you have dotenv files required in both your app and dal files
3.  make sure your dal includes the following:

```
const PouchDB = require('pouchdb-core')
PouchDB.plugin(require('pouchdb-adapter-http'))
const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)
```

4.  make sure your app includes the following:

```
const port = process.env.PORT || 5007
const express = require('express')
const app = express()
const port = process.env.PORT || 5007
const bodyParser = require('body-parser')
const NodeHTTPError = require('node-http-error')
app.use(bodyParser.json())
```
