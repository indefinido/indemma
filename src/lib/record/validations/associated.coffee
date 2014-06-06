# TODO Add base settings to validation
# model = window.model
# TODO implement method

# model[resource].validators_on 'field' # Get all validators related to this field

stampit     = require '../../../vendor/stampit'

associationable = stampit
  validate_each: (record, attribute, value) ->
    associated = record[attribute]

    # TODO figure out why this method is being called twice
    if associated

      # TODO detect association type, and then validate
      # current we only support has_one associations
      # TODO better way to getting access to the global 'model' definition
      unless model[record.resource].has_one.indexOf(attribute) != -1
        throw new Error 'Only has_one associations are supported to validates_associated'

      associated_validation = associated.validate()

      # To have a complete view in parent record of associated errors,
      # forward the messages to record
      associated_validation.done  ->
        record.errors.add attribute, 'associated', @options if associated.errors.length

      associated_validation


composed = stampit.compose(require('./validatorable'), associationable)
composed.definition_key = 'validates_associated'
module.exports = composed
