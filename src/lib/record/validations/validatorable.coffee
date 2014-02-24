stampit     = require '../../../vendor/stampit'

module.exports = stampit
  validate: -> throw new Error 'Composed factory must override the validate method'
  validate_each: -> throw new Error 'Composed factory must override the validate each method'
