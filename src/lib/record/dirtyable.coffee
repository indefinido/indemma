'use strict'

dirtyable =
  # TODO move ignored diryifing properties to the record
  ignores: ['dirty', 'resource', 'route', 'initial_route', 'after_initialize', 'before_initialize', 'parent_resource', 'nested_attributes', 'reloading', 'ready', 'saving', 'saved', 'failed', 'salvation', 'sustained', 'element', 'default', 'lock', 'validate', 'validated', 'validation', 'errors', 'dirty', 'json']
  reserved_filter: (name) -> @ignores.indexOf(name) == -1
  record:
    after_initialize: [ ->
      @subscribe (added, removed, changed, past) ->
        @dirty ||= !!Object.keys($.extend {}, added, removed, changed).filter(dirtyable.reserved_filter, dirtyable).length
    ]
    
# Shim browsers without Object.observe
unless Object.observe

  $.extend dirtyable,
    descriptor:
      get:         -> @observed.dirty
      set: (value) ->
        @observed.dirty = value
        @observation.scheduler.schedule()
        value

  dirtyable.record.after_initialize.push ->
    Object.defineProperty @, 'dirty', dirtyable.descriptor

# Automatically dirt records without id
# FIXME
dirtyable.record.after_initialize.push ->
   # TODO rename _id to id
   @dirty = !!@_id



# Extend indemma
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.dirtyable = true

record.mix (recordable) ->
  recordable.after_initialize = recordable.after_initialize.concat dirtyable.record.after_initialize

model.mix  (modelable ) ->
  # merge modelable , restful.model

`export default dirtyable`
