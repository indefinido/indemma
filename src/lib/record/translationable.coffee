root       = exports ? window

# TODO better way to get core model definition
# model = require ...

# TODO implement method
# model[resource].validators_on 'field' # Get all validators related to this field

extend      = require('assimilate')

extensions =
  model:
    human_attribute_name: (attribute_name) ->
      @translation?.attributes?[attribute_name] or attribute_name

model.mix (modelable) ->
  extend modelable, extensions.model

