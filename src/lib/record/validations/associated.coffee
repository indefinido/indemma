# TODO Add base settings to validation
# model = window.model
# TODO implement method

# model[resource].validators_on 'field' # Get all validators related to this field

stampit     = require '../../../vendor/stampit'

associationable = stampit
  validate_each: (record, attribute, value) ->
    # TODO figure out why this method is being called twice
    if record[attribute]

      # TODO detect association type, and then validate
      # current we only support has_one associations
      unless model[record.resource].has_one.indexOf(attribute) != -1
        throw new Error 'Only has_one associations are supported to validates_associated'

      associated_validation = record[attribute].validate()

      associated_validation.done  ->
        if record[attribute].errors.length
          record.errors.add attribute, 'associated', @options

      associated_validation


composed = stampit.compose(require('./validatorable'), associationable)
composed.definition_key = 'validates_associated'
module.exports = composed