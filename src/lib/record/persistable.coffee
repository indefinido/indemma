require './queryable'

handlers =
  store_after_save: ->
    # TODO remove global model usage
    {storage} = model[@resource.toString()]
    storage.store @_id, @


persistable =
  record:
    after_initialize: ->
      @after 'saved', handlers.store_after_save

# Extend indemma
# TODO use stampit to extend record and model
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.persistable = true

model.mix (modelable) ->
  modelable.record.after_initialize.push persistable.record.after_initialize
