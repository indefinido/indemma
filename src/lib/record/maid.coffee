maid =

  model : ->
    @record.after_initialize.push maid.record if @washing?

  record: ->

    @subscribe 'dirty', (dirty) ->
      dirty && setTimeout =>
        @save()
      , 500

# Extend indemma
model = window.model
model.mix (modelable) ->
  modelable.after_mix.unshift maid.model
