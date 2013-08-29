# TODO externalize errorsable from validatable
# errorsable = stampit
#   add: (attribute, message_key, options) ->
#
#       @push [attribute, message_key, options]
#       @messages[attribute_name] messages[message_key](attribute_name)
#
#   clear: ->
#     if @length
#       @length   = 0
#       @messages = {}
#
#   push: Array.prototype.push
#   splice: Array.prototype.splice
# ,
#   messages: {}
#   length: 0
# , ->
#   @messages = []
#   @
