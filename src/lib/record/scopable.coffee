require './restfulable'
require './resource'

stampit = require '../../vendor/stampit'
extend  = require 'assimilate'
merge   = extend.withStrategy 'deep'
$       = require 'jquery'
rest    = require './rest'


scopable =
  builder: stampit().enclose ->

    # Builds a given scope
    # {param} name Scope name also, the name of method used to invoke it
    # {param} type Default value for scope, or base class to derive default for default type

    stampit.mixIn (name, type) ->
      if $.type(type) == 'function'
        @[name]  = new type
        type     = $.type @[name]

      type    = $.type type unless $.type(type) == 'string'
      builder = builders[type]

      throw "Unknown scope type #{type} for model with resource #{model.resource}" unless builder?

      @[name] = builder name: name
    ,
      data: {}
      then: []
      fail: []
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
    fetch: (data, callbacks...) ->
      rest.get.call(@, extend(@scope.data, data))
        .done(@scope.then.concat callbacks)
        .fail @scope.fail

      @scope.clear()

  after_mix: ->
    @scope = scopable.builder @

    for property, type of @
      if property.charAt(0) == '$'
        name = property.substring 1
        @scope name, type

builders =
  # Builds a boolean scope builder
  boolean: stampit().enclose ->
    base = scopable.base @

    stampit.mixIn (value, callbacks...) ->
      callbacks.length and @scope.then = @scope.then.concat callbacks
      @scope.data[base.name] ||= value ? (@["$#{name}"] || defaults.boolean)
      @

  # Builds a array scope builder
  array: stampit().enclose ->
    base = scopable.base @

    stampit.mixIn (values...) ->
      @scope.data[base.name] ||= values ? (@["$#{name}"] || defaults.array)
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
model.associable && model.associable.mix (singular_association,  plural_association) ->

  # reload (done callbacks...)
  plural_association.all = plural_association.reload = (done, fail) ->
    # TODO move route discovery to plural_association.after_mix
    @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?

    dirty    = 0
    promises = []

    for record in @
      dirty++ if record.dirty

    # TODO better calculate fetch settings
    # if more than 5 records are dirty, we reftech all
    #    if dirty < 5
    #      for record in @
    #        promises.push record.reload()
    # else we reload everthing!
    #    else
    promises.push rest.get.call @
    promises[0].fail scopable.record.failed

    reload = $.when.apply jQuery, promises

    # Update association with data sent from the server
    reload.done (records, status) ->

      # Clear current stored cache on this association
      # TODO implement setter on this association and let user to set
      # it to an empty array
      Array.prototype.splice.call @, 0

      # return if there's nothing else to do
      return unless records.length

      singular_resource = model.singularize @resource

      # Normalize json data for building on association
      for record in records

        # TODO only nest specified nested attributes on model definition
        # TODO create special deserialization method no plural association
        # TODO check if we need to nest attributes in other association tipes
        for association_name in model[singular_resource].has_many
          record["#{association_name}_attributes"] = record[association_name]
          delete record[association_name]

      # Load new records on this association
      @add.apply @, records

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
      for record in @
        callback record