require './restfulable'
require './resource'

stampit    = require '../../vendor/stampit'
extend     = require 'assimilate'
observable = require('observable').mixin
merge      = extend.withStrategy 'deep'
$          = require 'jquery'
rest       = require './rest'

# TODO merge all with fetch and remove this util object
util =
  model:
    map: (records) ->
      (@build or @).call @, record for record, index in records

# TODO better responsibilty division for this code
scopable =
  builder: stampit().enclose ->

    # Builds a given scope
    # {param} name Scope name also, the name of method used to invoke it
    # {param} type Default value for scope, or base class to derive default for default type

    stampit.mixIn (name, type) ->
      if $.type(type) == 'function'
        @["$#{name}"] = type() || new type
        type          = $.type @["$#{name}"]
      else
        @["$#{name}"] = defaults[type] || type

      type    = $.type type unless $.type(type) == 'string'
      builder = builders[type]

      throw "Unknown scope type: '#{type}', For model with resource: '#{@resource}'" unless builder?

      @scope.declared.push name
      @[name] = builder name: name
    ,
      data:     {}
      then:     []
      fail:     []
      declared: []
      fetch: (data, done, fail) ->

        if typeof data == 'function'
          done = data
          data = {}

        scope = extend {}, @scope.data
        observable.unobserve scope

        if scope.noned?
          deferred = $.Deferred()
          deferred.resolveWith @, [[]]
        else
          deferred = rest.get.call(@, extend scope, data)

        deferred
          .then(util.model.map)
          .done(@scope.then.concat [done])
          .fail(@scope.fail.concat [fail])

        @scope.clear()

        deferred

      clear: ->
        @data      = {}
        @callbacks = []

  # Shared scope stuff
  base: stampit().state
    name: 'unamed_scope'

  record:
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
  model:
    # TODO implement getter for none property!
    none: ->
      @scope.data.noned = true
      @

    # TODO merge with all object
    fetch: (data, done, fail) ->
      if typeof data == 'function'
        done = data
        data = null

      @scope.fetch.call @, data, done, fail

    # TODO optmize this iterations or add support for stampit on associable and merge factories
    # TODO rename this method to forward extensions to association, and store extensions on has_many definitions
    # @ = record instance
    forward_scopes_to_associations: ->
      factory = model[@resource.name]

      for association_name in factory.has_many
        associated_resource = model.singularize association_name
        associated_factory  = model[associated_resource]

        # TODO change this warn message into a exception when
        # associations are renamable
        unless model[associated_resource]
          console.warn("Associated factory not found for associated resource: #{associated_resource}")
          continue

        association         = @[association_name]
        association.scope   = scopable.builder association


        for scope in associated_factory.scope.declared
          association.scope scope, associated_factory["$#{scope}"]

        # TODO improve associable inner workings to stampit objects
      # if factory.belongs_to.length
      #   generate_forwarder = (associated_resource) ->
      #     associated_factory = model[associated_resource]

      #     # TODO change this warn message into a exception when
      #     # associations are renamable
      #     return console.warn("Associated factory not found for associated resource: #{associated_resource}") unless associated_factory

      #     declared_scopes    = associated_factory.scope.declared

      #     ->
      #       for scope in declared_scopes
      #         @[associated_resource][scope] = associated_factory[scope]

      #   for associated_resource in factory.belongs_to
      #     forwarder = generate_forwarder associated_resource
      #     @after "build_#{associated_resource}", forwarder

      true
  # @ = model instance
  after_mix: ->
    @scope = scopable.builder @

    for property, type of @
      if property.charAt(0) == '$'
        name = property.substring 1
        @scope name, type

builders =
  # Builds a string scope builder
  string: stampit().enclose ->
    base = scopable.base @

    stampit.mixIn (value, callbacks...) ->
      callbacks.length and @scope.then = @scope.then.concat callbacks
      @scope.data[base.name] ||= value ? @["$#{base.name}"]
      @

  # Builds a boolean scope builder
  boolean: stampit().enclose ->
    base = scopable.base @

    stampit.mixIn (value, callbacks...) ->
      callbacks.length and @scope.then = @scope.then.concat callbacks
      @scope.data[base.name] ||= value ? @["$#{base.name}"]
      @

  # Builds a array scope builder
  array: stampit().enclose ->
    base = scopable.base @

    stampit.mixIn (values...) ->
      @scope.data[base.name] ||= values ? @["$#{base.name}"]
      @

defaults =
  boolean: true
  array: []

# Extend indemma
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.scopable = true

# TODO use stampit to extend record and model
#record.mix (recordable) ->
#  merge recordable, scopable.record

model.mix (modelable) ->
  merge modelable, scopable.model

  modelable.after_mix.push scopable.after_mix


# TODO create a deferred to better mix models
if model.associable
  model.mix (modelable) ->
    modelable.record.after_initialize.push ->
      scopable.model.forward_scopes_to_associations.call @

  model.associable.mix (singular_association,  plural_association) ->

    # reload (done callbacks...)
    plural_association.every = plural_association.reload = (data, done, fail) ->
      # TODO move route discovery to plural_association.after_mix
      @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?
      promises = []

      # TODO better calculate fetch settings
      # dirty    = 0
      # if more than 5 records are dirty, we reftech all
      #    if dirty < 5
      #      for record in @
      #        promises.push record.reload()
      # else we reload everthing!
      #    else
      #
      # for record in @
      #   dirty++ if record.dirty

      if typeof data == 'function'
        done = data
        data = undefined

      promises.push @scope.fetch.call @, data, null, scopable.record.failed

      reload = $.when.apply jQuery, promises

      # Update association with data sent from the server
      # TODO implement setter on this association and let user to set
      reload.done (records, status) ->

        # if no records were found by the server on this association
        unless records.length
          # Clear current stored cache on this association
          # it to an empty array
          Array.prototype.splice.call @, 0 if @length

          return true


        singular_resource = model.singularize @resource

        # Normalize json data for building on association
        for record in records

          # TODO only nest specified nested attributes on model definition
          # TODO create special deserialization method no plural association
          # TODO check if we need to nest attributes in other association tipes
          for association_name in model[singular_resource].has_many
            record["#{association_name}_attributes"] = record[association_name]
            delete record[association_name]

        # Update found records
        # TODO create update method
        create = []
        for record, index in records
          if target = @find record._id
            target.assign_attributes record
          else
            create.push record

        # Load new records on this association
        @add.apply @, create

        # Override the response records object with added to association records
        records.splice 0
        records.push.apply records, @


      reload.done done
      reload.fail fail

      reload

    plural_association.each = (callback) ->
      @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?

      # TODO cache models
      @get().done (records) =>
        callback record for record in @
