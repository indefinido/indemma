merge      = require('assimilate').withStrategy 'deep'
type       = require 'type'
observable = require('observable').mixin
$          = require 'jquery'
rest       = require './rest.js'

util =
  model:
    map: (models) ->
      @ model for model in models

restful =
  model:
    # return an array of promises
    create: (params..., callback) ->
      throw new TypeError("No arguments provided for #{@resource}.create") unless arguments.length
      params.push callback unless typeof callback == 'function'
      params.unshift {} unless params.length

      for attributes in params
        # TODO accept dirty as attribute on record creation
        record       = @ attributes
        record.dirty = true
        record.save callback

    # return a promise
    # TODO move to scopable
    all: (conditions = {}, callback) ->
      if typeof conditions == 'function'
        callback   = conditions
        conditions = {}

      $.when(rest.get.call @, conditions)
       .then(util.model.map             )
       .done callback

  record:
    reload: ->
      promise = rest.get.call @
      promise.done @assign_attributes
      promise.fail @failed

      # Bind one time save callbacks
      promise.done argument for argument in arguments when type(argument) is 'function'

      promise

    assign_attributes: (attributes) ->
      # TODO parsear de forma melhor a resposta do servidor e popular dados no modelo atual
      @[attribute] = attributes[attribute] for attribute of attributes

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

      @assign_attributes data

      throw "Not supported after_save callback: " + callback for callback in @after_save if @after_save

    # Parse error json if any
    failed: (xhr, error, status) ->
      payload       = xhr.responseJSON
      try payload ||= JSON.parse(xhr.responseText) catch e
      payload     ||= xhr.responseText

      # When client fail
      switch xhr.status
        when 422
          @valid = false
          return @errors = payload.errors
        # Unknown fail
        else
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
      # TODO User _.omit function

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


# Extend indemma
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.restfulable = true

record.mix (recordable) ->
  merge recordable, restful.record

model.mix  (modelable) ->
  merge modelable , restful.model

model.associable && model.associable.mix (singular_association,  plural_association) ->

  # TODO move route setting to plural_association.after_mix
  plural_association.get = ->
    @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?
    rest.get.apply @, arguments

  plural_association.post = ->
    @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?
    rest.post.apply @, arguments