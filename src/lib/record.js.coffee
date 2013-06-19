# TODO = advisable = require indefinido-advisable
extend = require 'extend'
type   = require 'type'
bind   = require 'bind'

# TODO support other type of associations
@model = do -> # mixin
  modelable =
    after_mix: []
    record:
      # TODO usar deferred
      after_initialize: []
    all: ->
      # TODO transform model in a array like object and store cache in root
      @cache
    # TODO better find support
    create: (params...) ->
      @(attributes).save for attributes in params # TODO move to restful and after_create
    find: (id) ->
      @where id: id, true
    where: (conditions, first = false) ->
      results = []
      conditions.id = [conditions.id] if type(conditions.id) != 'array'
      # TODO transform model in a array like object and store cache in root
      for record in @cache when conditions.id.indexOf(record._id) isnt -1
        if first
          return record
        else
          results.push record

      if first then null else results

  initialize_record = (data = {resource: @resource, parent_resource: @parent_resource}) ->
    data.resource          ||= @resource
    data.parent_resource   ||= @parent_resource
    data.route             ||= @route
    data.nested_attributes   = @nested_attributes || []

    # instance = record.call extend data, @record # TODO remove @record from outside scop
    after_initialize = (data.after_initialize || []).concat(@record.after_initialize)
    instance = record.call extend {}, @record, data, after_initialize: after_initialize # TODO remove @record from outside scope

    # Call and remove used callbacks
    callback.call instance, instance for callback in instance.after_initialize
    delete instance.after_initialize

    instance


  mixer = (options) ->
    mixer.stale = true unless mixer.stale # Prevent model changes

    instance = bind @, initialize_record

    extend instance, extend true, @, modelable

    callback.call instance, instance for callback in modelable.after_mix

    # Store model for later use
    mixer[@resource] = instance

  mixer.mix = (blender) ->
    throw "Trying to change model mixin with #{object} but model already used.\nCheck your configuration order" if @stale

    blender modelable


  # window.model
  mixer

@record = do -> # mixin

  callbacks =
    dirtify: ->
      @subscribe (prop, value, old) ->
        if prop isnt 'dirty' and not @dirty and value isnt old
          console.groupCollapsed "◉ Property '#{prop}' dirtied a #{@resource}"
          console.log old, "→", value
          console.log @
          console.groupEnd()
          @dirty = true

  recordable =
    # TODO usar deferred
    dirty: false
    after_initialize: [ callbacks.dirtify ]

  that = (data) ->
    throw "Mixin called incorrectly, call mixin with call method: record.call(object, data)" if @ == window

    data ||= {}
    after_initialize = @after_initialize.concat(data.after_initialize || []).concat(recordable.after_initialize)
    extend @, recordable, advisable.call(observable.call data), after_initialize: after_initialize


  that.mix = (blender) ->
    blender recordable

  that
