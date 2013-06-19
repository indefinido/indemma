# TODO Add base settings to validation
# model = window.model

# TODO implement method
# model[resource].validators_on 'field' # Get all validators related to this field

model.validators = ->
  model.mix (modelable) ->
    modelable.after_mix.unshift validator.model

validator =

  model : ->
    # 
    # @record.after_initialize.push validator.record

  record: ->
    # @after_initialize validate_types
    # @before 'save', validate