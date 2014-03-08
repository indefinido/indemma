$          = require 'jquery'
type       = require 'type'
bind       = require 'bind'
observable = require('observable').mixin
advisable  = require('advisable' ).mixin
extend     = require 'assimilate'
merge      = require('assimilate').withStrategy 'deep'

# TODO support other type of associations
@model = do -> # mixin
  modelable =
    after_mix: []
    record:
      # TODO usar deferred
      after_initialize: []
      # TODO usar deferred
      before_initialize: []
    every: ->
      # TODO transform model in a array like object and store cache in root
      @cache
    # TODO better find support
    create: (params...) ->
      # Implementat non restful model creation
      throw 'model.create not implemented yet, try using the restful.model.create method'
#    find: (id) ->
#      @where id: id, true
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
    data.parent_resource   ||= @resource.parent || @parent_resource
    data.route             ||= @route
    data.nested_attributes   = @nested_attributes || []

    # instance = record.call extend data, @record # TODO remove @record from outside scop
    after_initialize = (data.after_initialize || []).concat(@record.after_initialize)

    # TODO only shim in older browsers
    # TODO try to remove _shim need
    creation = extend Object.create(data, {_shim: {}}), @record, creation, after_initialize: after_initialize

    # TODO use deferred instead of before_initialize array
    for callback, index in @record.before_initialize
      callback.call @, creation

    instance = record.call creation # TODO remove @record from outside scope


    # Call and remove used callbacks
    # TODO use deferred instead of after_initialize array
    for callback, index in instance.after_initialize
      callback.call instance, instance

    delete instance.after_initialize

    instance


  # Create model
  mixer = (options) ->
    throw 'Model mixin called incorrectly call with model.call {} instead of model({})' if @ == window
    mixer.stale = true unless mixer.stale # Prevent model changes

    # TODO Use stampit and solve this mess!!
    if @record and @record.after_initialize
      after_initialize = @record.after_initialize.splice 0
    else
      after_initialize = []

    instance = bind @, initialize_record

    extend instance, merge @, modelable

    @record =  instance.record  = merge {}, instance.record, modelable.record
    @record.after_initialize    = instance.record.after_initialize = instance.record.after_initialize.concat after_initialize

    @record.before_initialize   = instance.record.before_initialize.concat []

    callback.call instance, instance for callback in modelable.after_mix

    # Store model for later use

    # TODO implement correctly stampit usage, and remove the need for
    # direct storage
    mixer[@resource.name || @resource.toString()] = instance

  mixer.mix = (blender) ->
    throw "Trying to change model mixin with #{object} but model already used.\nCheck your configuration order" if @stale

    blender modelable

  # window.model
  mixer

@record = do -> # mixin

  callbacks =
    # TODO search for a existing word and rename method, 'smudge' perhaps?
    dirtify: ->
# TODO add suport to subscribe to any property
#      @subscribe (prop, value, old) ->
#        if prop isnt 'dirty' and not @dirty and value isnt old
#          console.groupCollapsed "◉ Property '#{prop}' dirtied a #{@resource}"
#          console.log old, "→", value
#          console.log @
#          console.groupEnd()
#          @dirty = true

  recordable =
    # TODO usar deferred
    dirty: false
    after_initialize: [ callbacks.dirtify ]

  that = (data) ->
    throw "Mixin called incorrectly, call mixin with call method: record.call(object, data)" if @ == window

    data ||= {}
    after_initialize  = (@after_initialize || []).concat(data.after_initialize || []).concat(recordable.after_initialize)
    advisable observable(extend(@, recordable, data, after_initialize: after_initialize))


  that.mix = (blender) ->
    blender recordable

  that

exports.record = @record
exports.model  = @model