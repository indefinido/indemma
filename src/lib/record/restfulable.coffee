merge      = require('assimilate').withStrategy 'deep'
type       = require 'type'
observable = require('observable').mixin
$          = require 'jquery' # TODO remove jquery dependency and use simple promises implementation
rest       = require './rest.js'

util =
  model:
    map: (models) ->
      @ model for model in models


restful =
  model:
    # returns an array of promises
    create: (params..., callback) ->
      throw new TypeError("No arguments provided for #{@resource}.create") unless arguments.length
      unless typeof callback == 'function'
        params.push callback
        callback = undefined

      params.unshift {} unless params.length

      savings = []
      for attributes in params
        # TODO accept dirty as attribute on record creation
        record       = @ attributes
        record.dirty = true
        savings.push record.save callback

      $.when savings...

    # returns a promise
    # TODO move to scopable
    all: (conditions = {}, callback) ->
      if typeof conditions == 'function'
        callback   = conditions
        conditions = {}

      # TODO Consider parent resources
      # if @parent and not @parent._id
      #   return callback.call @model, []


      $.when(rest.get.call @, conditions)
       .then(util.model.map             )
       .done callback

    first: (conditions = {}, callback) ->
      if typeof conditions == 'function'
        callback   = conditions
        conditions = {}

      namespaced       = conditions[@resource] || {}
      namespaced.limit = 1
      namespaced.order = 'desc'

      # TODO should fail when server returns more then one record
      @all conditions, callback

    get: (action, data) ->
      # TODO better way to override route
      old_route = @route
      @route    = "/#{model.pluralize @resource.name}/#{action}"
      resource  = data.resource
      data      = data.json() if data and data.json

      if resource?
        payload        = data
        data           = {}
        data[resource] = payload

      promise = rest.get.call @, data

      route   = old_route

      promise

    put: rest.put

  record:
    reload: ->
      promise = rest.get.call @
      promise.done @assign_attributes
      promise.fail @failed

      # Bind one time save callbacks
      promise.done argument for argument in arguments when type(argument) is 'function'

      promise

    assign_attributes: (attributes) ->

      # TODO only set associations on nested attributes!
      # First assign has_many associations
      # TODO implement setter on has_many association and move this code there
      for association_name in model[@resource.toString()].has_many
        associations_attributes = attributes[association_name]
        delete attributes[association_name] # Remove loaded json data

        # Clear current stored cache on this association
        # TODO implement setter on this association and let user to set
        # it to an empty array
        association = @[association_name]

        unless association?
          message  = "Association '#{association_name}' not found. \n"
          message += "For record with resource #{@resource}. \n"
          message += "Probably defined on server side but not on client side.\n"
          message += "Skipping association assignment!"
          console.warn message
          continue

        # TODO implement association.clear
        Array.prototype.splice.call association, 0 if association.length

        # continue if no associations_attributes were found by the server
        continue unless associations_attributes? and associations_attributes.length

        singular_resource = model.singularize association_name

        # Normalize json data for building on association
        for association_attributes in associations_attributes

          # TODO only nest specified nested attributes on model definition
          # TODO create special deserialization method no plural association
          # TODO check if we need to nest attributes in other association tipes
          for association_name in model[singular_resource].has_many
            association_attributes["#{association_name}_attributes"] = association_attributes[association_name]
            delete association_attributes[association_name]

        # Load new associations_attributes on this association
        association.add associations_attributes...


      # Nested attributes
      # TODO implement setter on has_one association and move this code there
      for association_name in model[@resource.toString()].has_one
        association_attributes = attributes[association_name]
        delete attributes[association_name]

        @[association_name] = @["build_#{association_name}"] association_attributes if association_attributes


      # Assign remaining attributes
      @[attribute] = attributes[attribute] for attribute of attributes

    destroy: (doned, failed, data) ->
      throw new Error 'Can\'t delete record without id!' unless @id? or @_id?

      promise = rest.delete.call @, data
      promise.done @destroyed
      promise.fail @failed

      # Bind one time save callbacks
      promise.done doned
      promise.fail failed

      promise

    saving: false
    salvation: null
    save: (doned, failed, data) ->
      return @salvation if @saving

      # TODO better lock generation
      @lock = JSON.stringify @json()

      # TODO remove jquery dependency
      # TODO think with wich value makes more sense to resolve the
      # absence of need to save the model
      salvation   = $.Deferred().resolveWith @, null unless @dirty
      salvation ||= rest[if @_id then 'put' else 'post'].call @, data
      @salvation  = salvation
      @saving     = true

      salvation.done @saved
      salvation.fail @failed
      salvation.always -> @saving = false

      # Bind one time save callbacks
      salvation.done doned
      salvation.fail failed

      salvation

    saved: (data) ->

      # TODO better lock generation
      if @lock == JSON.stringify(@json())
        @dirty = false
        delete @lock
      # Delayed optimistic lock
      else
        return @save()

      @assign_attributes data if data?

      throw "Not supported after_save callback: " + callback for callback in @after_save if @after_save

    # Parse error json if any
    failed: (xhr, error, status) ->
      payload       = xhr.responseJSON
      try payload ||= JSON.parse(xhr.responseText) catch e
      payload     ||= xhr.responseText

      # When client fail
      switch xhr.status
        # move to validatable
        when 422

          definition = model[@resource]

          for attribute_name, messages of payload.errors

            # Only add errors to existing attributes
            unless @hasOwnProperty(attribute_name) or definition.hasOwnProperty(attribute_name)
              message  = "Server returned an validation error message for a attribute that is not defined in your model.\n"
              message += "The attribute was '#{attribute_name}', the model resource was '#{@resource}'.\n"
              message += "The model definition keys were '#{JSON.stringify Object.keys definition }'.\n"
              message += "Please remove server validation, or update your model definition."
              throw new TypeError message

            for message in messages
              @errors.add attribute_name, 'server', server_message: message

        # Unknown fail
        else
          message  = "Fail in #{@resource}.save:\n"
          message += "Record: #{@}\n"
          message += "Status: #{status} (#{payload.status || xhr.status})\n"
          message += "Error : #{payload.error || payload.message || payload}"


    toString: ->
      serialized = {}
      serialized[@resource] = @json()
      JSON.stringify serialized

    json: (methods = {}) ->
      json = {}

      for name, value of @ when type(value) isnt 'function'
        continue unless value?  # Bypass null, and undefined values

        if type(value) == 'object'

          if value.toJSON?

            json[name] = value.toJSON(methods[name])

          else

            # TODO move nested attributes to model definition
            # TODO and implement toJSON there
            for attribute in @nested_attributes when attribute == name
              json["#{name}_attributes"] = value.json(methods[name])

        else

          json[name] = value

      observable.unobserve json

      # TODO Store reserved words in a array
      # TODO Use _.omit function
      # TODO Use object.defineProperty to not need to delete this properties
      # Remove model reserved words
      delete json.dirty
      delete json.resource
      delete json.route
      delete json.initial_route # TODO implement better initial_route and remove attribute from here
      delete json.after_initialize
      delete json.parent_resource
      delete json.nested_attributes
      delete json.saving
      delete json.salvation
      delete json.element
      delete json.default
      delete json.lock
      delete json.validated
      delete json.validation

      json

# TODO put deprecation warning on json method
# TODO rename json method to toJSON
restful.toJSON = restful.json


# Extend indemma
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.restfulable = true

record.mix (recordable) ->
  merge recordable, restful.record


model.mix  (modelable ) ->
  merge modelable , restful.model


model.associable && model.associable.mix (singular_association,  plural_association) ->

  # TODO move route setting to plural_association.after_mix
  plural_association.get = ->
    @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource.name}" if @parent?
    rest.get.apply @, arguments

  plural_association.post = ->
    @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource.name}" if @parent?
    rest.post.apply @, arguments