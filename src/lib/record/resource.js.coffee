resource =
  pluralize: (word) ->
    return word + 's'
  parent_id:
    get: -> @[@parent_resource]._id
    set: -> console.error 'Warning changing associations throught parent_id not allowed for security and style guide purposes' # TODO
  initialize: ->
    # TODO route parsing
    @route = "/" + @route if @route and @route.indexOf('/') != 0

    # Set parent attribute and default nested route
    if @parent_resource
      Object.defineProperty @, "#{@parent_resource}_id", resource.parent_id

      # TODO Support route parsing, and change route to /parents/:id/childrens
      if not @route and @["#{@parent_resource}_id"]
        @route = '/' + resource.pluralize(@parent_resource) + '/' + @["#{@parent_resource}_id"] + '/' + resource.pluralize(@resource)

    unless @route
      @route = '/' + resource.pluralize @resource

# Extend indemma
model = window.model # TODO better way to get parent
model.mix (modelable) ->
  modelable.record.after_initialize.unshift resource.initialize
  modelable.after_mix.unshift resource.initialize

model.pluralize = resource.pluralize
