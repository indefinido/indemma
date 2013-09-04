stampit = require '../../vendor/stampit'

# TODO Think of a better name
resource = stampit
    toString: -> @name
    # TODO move resourceable.route() to here
  ,
    name    : 'unknown'
    scope   : null
    singular: false
  , ->
    @param_name ||= @name
    @

resourceable =
  pluralize: (word) ->
    throw new TypeError "Invalid string passed to pluralize '#{word}'" unless word and word.length

    unless word.indexOf('s') == word.length - 1
      word + 's'
    else
      word

  singularize: (word) ->
    throw new TypeError "Invalid string passed to singularize '#{word}'" unless word and word.length

    if word.indexOf('s') == word.length - 1
      word.substring 0, word.length - 1
    else
      word

  # TODO move to resourceable method
  route:
    get: ->
      return @initial_route if @initial_route?

      # TODO use resource object on associations!
      @resource = name: @resource if typeof @resource == 'string'

      route  = '/'
      route += "#{@parent.route}/#{@parent._id}/" if @parent?
      route += @resource.scope + '/' if @resource.scope?

      route += if @resource.singular then @resource.name else model.pluralize @resource.name
      @initial_route = route

      route

    set: (value) -> @initial_route = value

  parent_id:
    get: -> @[@parent_resource]._id
    set: -> console.error 'Warning changing associations throught parent_id not allowed for security and style guide purposes' # TODO

  initialize: ->
    # Set parent attribute and default nested route
    if @parent_resource
      Object.defineProperty @, "#{@parent_resource}_id", resourceable.parent_id

    # Setup resource
    resource_definition = {}
    resource_definition = name: @resource if typeof @resource == 'string'
    resource_definition = @resource       if typeof @resource == 'object'

    # TODO remove mentions of @parent_resource and use only resource: {parent: ...}
    resource_definition.parent = @parent_resource


    @resource = resource resource_definition

    # TODO Support route parsing, and change route to /parents/:id/childrens
    @route ? Object.defineProperty @, 'route', resourceable.route


# Extend indemma
model = window.model # TODO better way to get parent

model.mix (modelable) ->
  modelable.record.after_initialize.unshift resourceable.initialize
  modelable.after_mix.unshift resourceable.initialize

model.singularize = resourceable.singularize
model.pluralize = resourceable.pluralize
