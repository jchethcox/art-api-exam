const { curry, difference, keys } = require('ramda')

module.exports = curry((arrProps, obj) => difference(arrProps, keys(obj)))

//simple program for making sure an object that is being add has all necesasry
//properties
