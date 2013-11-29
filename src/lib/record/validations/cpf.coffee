# TODO Add base settings to validation
# model = window.model

# TODO implement method
# model[resource].validators_on 'field' # Get all validators related to this field

validations = require '../validatable'
stampit     = require '../../../vendor/stampit'

cpfable = stampit
  validate_format: (value) ->
    value = value.replace /[\.\-]/g, ""

    # Wrong cpf size
    return false if value.length < 11

    # Dummy but valid values (000.000.000-00, 111.111.111-11, ...)
    return false if value.match /^(0+|1+|2+|3+|4+|5+|6+|7+|8+|9+)$/

    # Mod 11 validation
    c  = value.substr 0, 9
    dv = value.substr 9, 2
    d1 = 0
    v  = false
    i  = 0

    for i in [1..9]
      d1 += c.charAt(i) * (10 - i)

    return false if d1 == 0

    d1 = 11 - (d1 % 11)
    d1 = 0 if (d1 > 9 )

    return false if +dv.charAt(0) != d1

    d1 *= 2
    for i in [1..9]
      d1 += c.charAt(i) * (11 - i)


    d1 = 11 - (d1 % 11)
    d1 = 0 if (d1 > 9 )

    return false if +dv.charAt(1) != d1

    true


  validate_each: (record, attribute, value) ->
    record.errors.add attribute, 'cpf', @options if value and not @validate_format value




composed = stampit.compose validations.validatable, cpfable
composed.definition_key = 'validates_cpf_format'
validations.manager.validators.cpf = composed