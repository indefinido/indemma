extend  = require 'assimilate'
merge   = extend.withStrategy 'deep'
stampit = require '../../vendor/stampit'

storable = stampit
  store: (keypath, value, options) ->
    collection = @database
    keypath = keypath.toString().split '.'
    key     = keypath.pop()

    for entry in keypath
      collection[entry] ||= {}
      collection = collection[entry]

    if arguments.length == 1
      @reads++
      collection[key]
    else
      @writes++

      # TODO use object.defineProperty
      value.sustained = true
      collection[key] = value

  values: ->
    Object.values @database
  ,
    type: 'object'
    writes: 0
    reads: 0
  , ->
    @database ||= {}
    @


# Extend indemma
# TODO use stampit to extend record and model
model  = window.model     # TODO better way to get parent
record = window.record     # TODO better way to get parent

model.storable = true
module.exports = storable
#model.mix (modelable) ->
#  merge modelable, storable.model


