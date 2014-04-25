extend   = require 'assimilate'
storable = require './storable'
# merge    = extend.withStrategy 'deep'
stampit  = require '../../vendor/stampit'

queryable =
  # FIXME don't let everyone use the same storage instance! or let it?
  storage: storable()
  find: (key) ->
    throw new TypeError "InvalidFind: resource.find was called with a falsey value" unless key
    @storage.store key
  every: -> @storage.values()
  where: ->
    throw new Error 'queryable.where: Not implemented yet'

# Extend indemma
# TODO use stampit to extend record and model
model  = window.model      # TODO better way to get parent
record = window.record     # TODO better way to get parent

# queryable = stampit.compose queryable, storable


model.queryable = true
module.exports = queryable

model.mix (modelable) ->
  # TODO use stampit to extend record and model
  extend modelable, queryable
