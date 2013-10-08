# TODO Add base settings to validation
# model = window.model

# TODO implement method
# model[resource].validators_on 'field' # Get all validators related to this field

validations = require '../validatable'
stampit     = require '../../../vendor/stampit'

typeable = stampit
  validate_each: (record, attribute, value) ->
    # TODO store type on validator instantiation
    @type ||= model[record.resource.toString()][attribute]

    if value

      if value instanceof @type

        # TODO store type_name on costructor
        @type_name ||= @type.name

        unless value.valid # Will trigger validation
          record.errors.add attribute, 'type', type_name: @type_name?

      else
        throw new Error "Invalid attribute value type! Found #{typeof value} expected #{@type.name}"


composed = stampit.compose(validations.validatable, typeable)
composed.definition_key = 'validates_type_of'

validations.manager.validators.type = composed