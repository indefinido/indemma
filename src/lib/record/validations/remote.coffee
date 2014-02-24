# TODO Add base settings to validation
# model = window.model

# TODO implement method
# model[resource].validators_on 'field' # Get all validators related to this field

rest        = require '../rest'
stampit     = require '../../../vendor/stampit'

remoteable = stampit
  validate_each: (record, attribute, value) ->
    data = @json record

    # TODO best partial application
    # @post(data).done(_.partial @succeeded, record)
    @post(data).done((json) => @succeeded(json, record))

  json: (record) ->
    param = @resource.param_name || @resource.toString()

    data = {}
    data[param] = record.json()

    # TODO stop renaming id field, lol
    data[param].id ||= data[param]._id
    delete data[param]._id

    data

  # TODO Use rest.post
  post: (data) ->

    jQuery.ajax
      url     : @route
      data    : data
      type    : 'post'
      dataType: 'json'
      context : @

  succeeded: (json, record) ->
    error_messages = json[@attribute_name]

    return unless error_messages

    for error_message in error_messages
      record.errors.add @attribute_name, 'server', server_message: error_message
,
  message: "Remote validation failed"
  route: null
, ->
  # TODO discover why @model.route is coming null!
  # Desglobalize model constant
  pluralized_resource  = model.pluralize @model.resource.toString()
  @resource            = @model.resource
  @route             ||= "/#{pluralized_resource}/validate"
  @


composed = stampit.compose require('./validatorable'), remoteable
composed.definition_key = 'validates_remotely'
module.exports = composed