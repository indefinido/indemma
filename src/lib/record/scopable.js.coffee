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

  record: {}
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
    promises[0].fail restful.record.failed

    reload = $.when.apply jQuery, promises

    # Update association with data sent from the server
    reload.done (records, status) ->
      singular_resource = model.singularize(this.resource)

      for record, index in records
        record.resource        = singular_resource
        record.parent          = this.parent
        record.parent_resource = this.parent_resource
        records[index]         = plural_association.build.call({resource: singular_resource}, record);

      # Clear current stored cache on this association
      Array.prototype.splice.call @, 0

      # Load new records on this association
      Array.prototype.push.apply  @, records


    reload.done done
    reload.fail fail

    reload

  plural_association.each = (callback) ->
    @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?

    # TODO cache models
    @get().done (records) =>
      for record in @
        callback record