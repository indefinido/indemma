maid =

  model : ->
    @record.after_initialize.push maid.record if @washing?

  record: ->
    self = @
    @subscribe 'dirty', (prop, dirty) ->
      dirty && setTimeout ->
        self.save()
      , 500

# Extend indemma
model = window.model
model.mix (modelable) ->
  modelable.after_mix.unshift maid.model
