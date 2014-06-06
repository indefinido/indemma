'use strict'

dirtyable =
  # TODO move ignored diryifing properties to the record
  ignores: ['dirty', 'resource', 'route', 'initial_route', 'after_initialize', 'before_initialize', 'parent_resource', 'nested_attributes', 'reloading', 'ready', 'saving', 'salvation', 'sustained', 'element', 'default', 'lock', 'validated', 'validation', 'errors', 'dirty']
  change: (name) -> dirtyable.ignores.indexOf(name) == -1
  descriptor:
    get:         -> @observed.dirty
    set: (value) ->
      @observed.dirty = value
      @observation.scheduler.schedule()
      value
  record:
    after_initialize: ->
      Object.defineProperty @, 'dirty', dirtyable.descriptor

      # TODO rename _id to id
      @observed.dirty = !!@_id

      @subscribe (added, removed, changed, past) ->
        @dirty ||= !!Object.keys(changed).filter(dirtyable.change).length



# Extend indemma
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.dirtyable = true

record.mix (recordable) ->
  recordable.after_initialize.push dirtyable.record.after_initialize

model.mix  (modelable ) ->
  # merge modelable , restful.model

`export default dirtyable`
