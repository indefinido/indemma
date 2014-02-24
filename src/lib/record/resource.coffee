stampit = require '../../vendor/stampit'
require '../../vendor/owl/pluralize'

# TODO Think of a better name
resource = stampit
    toString: -> @name
    # TODO move resourceable.route() to here
  ,
    name    : 'unknown'
    scope   : null
    singular: false
  , ->

    # TODO better integration with record.coffee, and stop storing
    # original reference
    if @original_reference
      stampit.mixIn @original_reference, @
      @original_reference.toString     = @toString
      @original_reference.param_name ||= @name

      return @original_reference

    @param_name ||= @name

    @

# TODO Think of a better name, and move to a composable stampit item
descriptors =
  route:
    get: ->
       # TODO use resource object on associations!
      @resource = name: @resource if typeof @resource == 'string'

      route  = '/'
      route += "#{@parent.route}/#{@parent._id}/" if @parent?
      route += @resource.scope + '/' if @resource.scope?

      route += if @resource.singular then @resource.name else model.pluralize @resource.name

      @route = route

    configurable: true
#    set: (value) -> @initial_route = value

  # TODO Deprecated! Remove on 15/02/2014
  # parent_id:
  #   get: -> @[@parent_resource]._id if @[@parent_resource]
  #   set: -> console.error 'Warning changing associations throught parent_id not allowed for security and style guide purposes' # TODO
  #   configurable: true
  #   enumerable: true

# TODO Think of a better name, and move to a composable stampit item
resourceable =
  pluralize: (word, count, plural) ->
    throw new TypeError "Invalid string passed to pluralize '#{word}'" unless word and word.length

    unless word.indexOf('s') == word.length - 1
      owl.pluralize word, count, plural
    else
      word

  singularize: (word) ->
    throw new TypeError "Invalid string passed to singularize '#{word}'" unless word and word.length

    if word.lastIndexOf('s') == word.length - 1
      word.substring 0, word.length - 1
    else
      word

  initialize: ->

    # Deprecated! Remove on 15/02/2014
    # Set parent attribute and default nested route
    # If you're using the associable plugin, this getter and setter will be overwritten!
    # if @parent_resource
    #   Object.defineProperty @, "#{@parent_resource}_id", descriptors.parent_id

    # Setup resource
    resource_definition = {}
    resource_definition = name: @resource if typeof @resource == 'string'
    if typeof @resource == 'object'
      # TODO deeper resource integration with record.coffee, and remove original reference
      # To prevent reference lost and allow dinamic modification of resources
      # we need to preserve the original reference
      @resource.original_reference = @resource

      resource_definition = @resource

    # TODO remove mentions of @parent_resource and use only resource: {parent: ...}
    resource_definition.parent = @parent_resource

    @resource = resource resource_definition

    # TODO Support route parsing, and change route to /parents/:id/childrens
    @route ? Object.defineProperty @, 'route', descriptors.route


# Extend indemma
model = window.model # TODO better way to get parent

model.mix (modelable) ->
  modelable.record.after_initialize.unshift resourceable.initialize
  modelable.after_mix.unshift resourceable.initialize

model.singularize = resourceable.singularize
model.pluralize = resourceable.pluralize
