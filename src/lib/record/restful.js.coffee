merge      = require('assimilate').withStrategy 'deep'
type       = require 'type'
observable = require('observable').mixin
$          = require 'jquery'

resource =
  save: () ->
    # TODO remove jquery dependency
    unless @dirty
      return $.Deferred().resolve()

    promise = rest[if @_id then 'put' else 'post'].call @
    promise.done @saved
    promise.fail @failed

    # Bind one time save callbacks
    promise.done argument for argument in arguments when type(argument) is 'function'

    @lock = JSON.stringify(@json())

    promise

  saved: (data) ->

    if @lock == JSON.stringify(@json())
      @dirty = false
      delete @lock
    # Delayed optimistic lock
    else
      @save()

    # TODO parsear de forma melhor a resposta do servidor e popular dados no modelo atual
    @[property] = data[property] for property of data

    throw "Not supported after_save callback: " + callback for callback in @after_save if @after_save

  # Parse error json if any
  failed: (xhr, error, status) ->
    payload       = xhr.responseJSON
    try payload ||= JSON.parse(xhr.responseText) catch e
    payload     ||= xhr.responseText

    message  = "Fail in #{@resource}.save:\n"
    message += "Record: #{@}\n"
    message += "Status: #{status} (#{payload.status || xhr.status})\n"
    message += "Error : #{payload.error || payload.message || payload}"

    console.error message
  toString: ->
    serialized = {}
    serialized[@resource] = @json()
    JSON.stringify serialized
  json: ->
    json = {}

    for name, value of @ when type(value) isnt 'function'
      continue unless value?  # Bypass null, and undefined values

      if type(value) == 'object'
        # TODO move nested attributes to model definition
        json["#{name}_attributes"] = value.json() for attribute in @nested_attributes when attribute == name
      else
        json[name] = value

    observable.unobserve json

    # TODO Store reserved words in a array
    # TODO User _.omit functions
    # Remove model reserved words
    delete json.dirty
    delete json.resource
    delete json.route
    delete json.after_initialize
    delete json.parent_resource
    delete json.nested_attributes
    delete json.on_save
    delete json.element
    delete json.default
    delete json.lock

    json

rest =
  put : -> rest.request.call @, 'put' , "#{@route}/#{@_id}", arguments...
  post: -> rest.request.call @, 'post', @route, arguments...
  request: (method, url, data) ->
    unless data
     data = {}
     data[@resource] = @json()

    $.ajax
      url     : url
      data    : data
      type    : method
      dataType: 'json'
      context : @

# Extend indemma
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.restfulable = true

record.mix (recordable) ->
  merge recordable, resource

model.associable && model.associable.mix (singular_association,  plural_association) ->
  plural_association.post = ->
    @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?
    rest.post.apply @, arguments
