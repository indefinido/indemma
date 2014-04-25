merge      = require('assimilate').withStrategy 'deep'
type       = require 'type'
observable = require('observable').mixin
$          = require 'jquery' # TODO remove jquery dependency and use simple promises implementation
rest       = require './rest.js'
root       = exports ? @

util =
  model:
    map: (records) ->
      @ record for record in records


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
    every: (conditions = {}, doned, failed) ->
      if typeof conditions == 'function'
        doned      = conditions
        conditions = {}

      # TODO Consider parent resources
      # if @parent and not @parent._id
      #   return callback.call @model, []

      $.when(rest.get.call @, conditions)
       .then(util.model.map             )
       .done(doned                      )
       .fail failed

    first: (conditions = {}, callback) ->
      if typeof conditions == 'function'
        callback   = conditions
        conditions = {}

      namespaced       = conditions[@resource] || {}
      namespaced.limit = 1
      namespaced.order = 'desc'

      # TODO should fail when server returns more then one record
      @every conditions, callback

    # TODO better treating of arguments
    get: (action, data = {}) ->
      # TODO better way to override route
      old_route     = @route
      default_route = "/#{model.pluralize @resource.name}"
      @route        = default_route unless default_route == @route

      if action
        # TODO Get own property descriptor, or better way do override route
        Object.defineProperty @, 'route',
          value: "#{default_route}/#{action}"
          configurable: true

      # TODO not allow resource overriding
      resource   = data.resource
      data       = data.json() if data and data.json

      if resource?
        payload        = data
        data           = {}
        data[resource] = payload

      promise = rest.get.call @, data

      # TODO Get own property descriptor, or better way do override route
      Object.defineProperty @, 'route',
        value: old_route
        configurable: true

      promise

    put: rest.put
    delete: rest.delete

  record:
    ready: (callback) -> callback.call @
    reload: (params...) ->

      # TODO better signature implementation
      data = params.pop()
      params.push data if type(data) != 'object'

      promise = rest.get.call @, data || {}
      promise.done @assign_attributes
      promise.fail @failed

      @reloading = promise
      # Assign ready callback before, to allow promise override
      @ready = ->
        console.warn "resource.ready was deprecated, please use resource.reloading.done"
        promise.done arguments...

      # Bind one time save callbacks
      promise.done param for param in params

      promise

    assign_attributes: (attributes) ->

      # TODO only set associations on nested attributes!
      # First assign has_many associations
      # TODO implement setter on has_many association and move this code there
      for association_name in model[@resource.toString()].has_many
        associations_attributes = attributes[association_name]

        # TODO copy attributes object and don't change it inside the assignment method
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
          # TODO check if we need to nest attributes in other association types
          for association_name in model[singular_resource].has_many
            association_attributes["#{association_name}_attributes"] = association_attributes[association_name]

            # TODO copy attributes object and don't change it inside
            # the assignment method
            delete association_attributes[association_name]

        # Load new associations_attributes on this association
        association.add associations_attributes...


      # Nested attributes
      # TODO implement setter on has_one association and move this
      # code there
      for association_name in model[@resource.toString()].has_one
        association_attributes = attributes[association_name]

        # TODO copy attributes object and don't change it inside the
        # assignment method
        delete attributes[association_name]
        delete attributes[association_name + "_attributes"]
        @[association_name] = @["build_#{association_name}"] association_attributes if association_attributes


      # Nested attributes
      # TODO implement setter on belongs_to association and move this
      # code there
      for association_name in model[@resource.toString()].belongs_to
        association_attributes = attributes[association_name].json?() ? attributes[association_name]

        # TODO copy attributes object and don't change it inside the
        # assignment method
        delete attributes[association_name]
        delete attributes[association_name + "_attributes"]
        @[association_name] = @["build_#{association_name}"] association_attributes if association_attributes


      # Assign remaining attributes
      # TODO see if it is a best practice not overriding unchanged attributes
      # TODO rename attributes for properties
      for name, attribute of attributes when attribute isnt @[name]
        # TODO faster object property assignment, get from model definition, instead of checking every attribute
        # TODO implement custom comparator for each object when es7 is out
        if type(attribute) == 'object'
          @[name] = attributes[name] if JSON.stringify(attribute) != JSON.stringify @[name]
        else
          @[name] = attributes[name]

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
      lock = JSON.stringify @json()

      # When saving and receive save command again check if the model
      # has changed, then abort the salvation operation and send a new
      # save request
      # TODO check dirty property instead of lock!
      if @saving
        if @lock == lock
          return @salvation
        else
          @salvation.abort()

      # TODO better lock generation
      @lock = lock

      # TODO remove jquery dependency
      # TODO think with wich value makes more sense to resolve the
      # absence of need to save the model
      salvation   = $.Deferred().resolveWith @, null unless @dirty
      @saving     = true
      salvation ||= rest[if @_id then 'put' else 'post'].call @, data
      @salvation  = salvation

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

      @assign_attributes data if data?

      throw "Not supported after_save callback: " + callback for callback in @after_save if @after_save

    # Parse error json if any
    failed: (xhr, error, status) ->
      payload       = xhr.responseJSON
      try payload ||= JSON.parse(xhr.responseText) catch e
      payload     ||= xhr.responseText

      # When client fail
      switch xhr.status
        # TODO move to validatable
        when 0
          message = status or xhr.statusText
          switch message
            when 'abort'
              console.info "salvation probably aborted"
            when 'error'
              console.info "server probably unreachable"
            else
              throw new Error 'Unhandled status code for xhr'

        when 422

          definition = model[@resource.toString()]

          for attribute_name, messages of payload.errors

            # TODO add support for error checking message introspection
            # Check for association errors
            if (!definition.associations)
              # TODO update this attribute when associations are dinamically changed
              definition.associations = definition.has_one.concat(definition.has_many.concat(definition.belongs_to))

            # Only add errors to existing attributes
            # TODO shorten this verification
            unless @hasOwnProperty(attribute_name) or definition.hasOwnProperty(attribute_name) or definition.associations.indexOf(attribute_name) != -1 or attribute_name == 'base'

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
          message += "Status: #{status} (#{(payload || xhr).status})\n"
          message += "Error : #{payload.error || payload.message || payload}"
          console.log message

      # Finish saving
      @saving = false

    # TODO move to record.coffee
    toString: ->
      serialized = {}
      serialized[@resource] = @json()

      try
        # TODO figure out why it throws circular references sometines
        JSON.stringify serialized
      catch e
        console.warn "restfulable.toString: Failed to stringify record: #{e.message}. retrying..."

        for name, property of serialized
          delete serialized[name] if typeof property == 'object'

        JSON.stringify serialized

    # TODO move this to serializable module
    # TODO figure out why sometimes is rendering a circular referenced json
    # TODO rename to toJSON
    json: (options = {}) ->
      json = {}

      definition = model[@resource.toString()]

      for name of @
        # TODO smarter way to ignore Dom node fix properties
        continue if observable.ignores.indexOf(name) != -1

        # TODO treat other associations to!
        # TODO create association reflection for god sake!
        nested = @nested_attributes.indexOf(name) != -1

        # Skip association attributes that are note nested TODO create
        # an associations array
        continue if not nested and (definition.belongs_to.indexOf(name) != -1 or definition.has_one.indexOf(name) != -1 or definition.has_many.indexOf(name) != -1)

        # TODO Bypass only undefined values so we can erase data on server
        value = @[name]
        continue unless value?

        nature = type value
        continue if nature == 'function'

        if nature == 'object' or nature == 'element'

          if nested
            unless value.json
              console.warn "json: Tryied to serialize nested attribute '#{name}' without serialization method!"
              continue

            # TODO move nested attributes to model definition and
            # implement toJSON there
            json["#{name}_attributes"] = value.json options[name]

          # Serialize complex type values
          else if value.toJSON? || value.json?
            # FIXME sometimes wrong pluralization occurs and we cannot
            # skip association objects, so detect them and skip here
            continue if value.resource

            # TODO rename json to toJSON
            if value.json?
              json[name] = value.json options[name]
            else
              json[name] = value.toJSON options[name]

          # It is a complex type value without serializtion support so
          # we just ignore it
          else
            # TODO maybe log warning based on debug or info flag here?
            continue

        else

          # Serialize primitive type values
          json[name] = value

      # Remove observable options and dom node properties
      json = observable.unobserve json

      for name, value of options.methods ? {}
        method = @[name]
        if typeof method  == 'function'
          json[name] = method()
        else
          json[name] = method

      # TODO Store reserved words in a array
      # TODO Use _.omit function
      # TODO Use object.defineProperty to not need to delete this properties
      # Remove model reserved words
      delete json.dirty
      delete json.resource
      delete json.route
      delete json.initial_route # TODO implement better initial_route and remove attribute from here

      delete json.after_initialize
      delete json.before_initialize
      delete json.parent_resource
      delete json.nested_attributes

      delete json.reloading
      delete json.ready

      delete json.saving
      delete json.salvation
      delete json.sustained

      delete json.element
      delete json.default
      delete json.lock

      delete json.validated
      delete json.validation
      delete json.errors

      json


# TODO pt udeprecation warning on json method
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