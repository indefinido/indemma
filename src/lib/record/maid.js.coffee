model = window.model

model.maid = ->
  model.mix (modelable) ->
    modelable.after_mix.unshift maid.model



maid =

  model : ->
    @record.after_initialize.push maid.record if @washing?

  record: ->
    self = @
    @subscribe 'dirty', (prop, dirty) ->
      dirty && setTimeout ->
        self.save()
      , 500