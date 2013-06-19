root = exports ? this

model.rivets = ->

  model_extensions =
    record:
      tie: (element) ->
        lasso = {}
        lasso[@resource] = @
        rivets.bind element, lasso

    # Always preload data into the template
    preloadData: true

  model.mix (modelable) ->
    # TODO remove jquery dependency
    $.extend true, modelable, model_extensions
