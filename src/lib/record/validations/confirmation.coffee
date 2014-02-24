# TODO Add base settings to validation
# model = window.model

# TODO implement method
# model[resource].validators_on 'field' # Get all validators related to this field

stampit     = require '../../../vendor/stampit'

confirmationable = stampit
  validate_each: (record, attribute, value) ->
    if record[attribute] != record["#{attribute}_confirmation"]
      record.errors.add "#{attribute}_confirmation", 'confirmation', @options


composed = stampit.compose require('./validatorable'), confirmationable
composed.definition_key = 'validates_confirmation_of'
module.exports = composed