require './queryable'

handlers =
  store_after_saved: ->
    # TODO remove global model usage
    {storage} = model[@resource.toString()]

    # TODO check persistable configuration before attaching handlers
    # and remove the @_id presence check
    storage.store @_id, @ if @_id


persistable =
  record:
    # TODO better caching check after resource initialization
    # TODO think how to retrieve already stored resources
    after_initialize: ->
      if @_id
        # TODO remove global model usage
        {storage} = model[@resource.toString()]
        storage.store @_id, @
      else
        # TODO check persistable configuration before attaching handlers
        @after 'saved', handlers.store_after_saved

# Extend indemma
# TODO use stampit to extend record and model
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.persistable = true

model.mix (modelable) ->
  modelable.record.after_initialize.push persistable.record.after_initialize
