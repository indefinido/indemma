root   = window
$      = require 'jquery'
extend = require 'assimilate'

require './resource'

# Store association methods
# TODO Implement setter for route
plural = # has_many ## TODO embeds_many
  add   : (params...) ->
    # TODO check for id and instantly add resource
    # TODO Set foreign keys?
    @push @build attributes for attributes in params

  create: (params...) ->
    for attributes in params
      record = @build attributes
      @push record
      record.save()
  build: (data = {}) ->
    data.parent_resource = @parent_resource

    # TODO Setup a before save callback to generate route when there is no id
    data.route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource.toString()}" if @parent?
    throw "associable.has_many: cannot redefine route of association #{@parent_resource}.#{@resource} from #{@route} to #{data.route}" if @route isnt data.route and @route
    # Adds parent record to children side of association, if not set
    # TODO check if this reference is unmade on instance elimination
    data[@parent_resource] ||= @parent

    # TODO store a singular copy of the resource for better performace
    model[model.singularize @resource] data
  push    : ->
    console.warn "#{@resource}.push is deprecated and will be removed, please use add instead"
    Array.prototype.push.apply @, arguments
    arguments[0]

  length : 0
  json   : (methods, omissions) -> record.json(methods, omissions) for record in @

  find   : (id) -> return resource for resource in @ when resource._id is id

  # TODO better support searching
  filter   :  Array.prototype.filter || _?.filter


singular = # belongs_to, has_one ## TODO embeds_one, embedded_in
  # @ = record
  create: (data) -> model[@resource].create extend {}, @, data
  # @ = record
  # TODO convert to association proxy
  build : (data) ->
    # Adds child record of association to parent, and returns new
    # record
    @owner[@resource.toString()] = model[@resource.toString()] extend {}, @, data

descriptors =
  belongs_to:
    # TODO store association observer in association proxy, also
    # update observable to support creating empty observers on object
    # attributes
    resource_id:
      getter: -> @owner.observed[@resource + '_id']
      setter: (resource_id) ->
        # TODO check for association name in association proxy
        association_name = @resource.toString()

        # TODO faster nullifing association check
        # TODO check if its usefull to only allow disassociating with null
        # TODO notify nullification of associations
        unless resource_id?
          # If there is anything to nullify, undefine or falsify, do it
          if @owner[association_name] or @owner[association_name + '_id']
            @dirty = true
            @owner[association_name] = null
            
          return resource_id

        # TODO Discover and update inverse side of association
        # associated[@owner.resource.toString()] = @owner
        current_resource_id = @owner.observed[association_name]?._id
        if resource_id != current_resource_id

          # For getter to read, we store conveniently on observable
          # repository
          @owner.observed[association_name + '_id'] = resource_id

          # Nullify associated object, so next time user accesses it,
          # association loader loads the new object
          @owner.observed[association_name] = null

          # If we have any listener associated with this property,
          # notify it
          # TODO implement notification api on observable
          unless Object.observe
            @owner.observation.observers[association_name + '_id']?.check_()
          else
            change = oldValue: current_resource_id, type: 'update', name: association_name + '_id', object: @owner
            Object.getNotifier(@owner).notify change

        resource_id

    resource:
      # TODO Use Auto build and Auto load as association options
      getter: ->
        # TODO allow custom association names
        association_name = @resource.toString()
        associated       = @owner.observed[association_name]
        associated_id    = @owner.observed[association_name + '_id']

        # Returns null depending on sustained state of resource and on
        # retrievability of the resource
        return associated || null unless associated?._id? or associated_id

        # Returns imediatelly for resources on storage
        # TODO make this extensible
        return associated if associated?.sustained

        # Auto build
        resource = model[association_name]
        unless resource
          console.warn "descriptors.belongs_to.resource.getter: associated factory not found for model '#{association_name}' belonging to '#{@owner.resource}'"
          return associated

        # Search through stored resources to see if it is stored
        associated   = resource.find associated_id || associated._id

        # Found associated in storage, update this model and return associated
        return @owner.observed[association_name] = associated if associated

        # Auto load
        # Not found associated in storage
        # TODO remote find or local find automatically, and implement find_or_initialize_by
        associated ||= resource _id: associated_id  # initialize and store a new record
        associated.reload()                         # fetch resource

        # Store temporary unloaded resource in this model
        @owner.observed[association_name] = associated

      # Called when associated record changes, so we can silently update the id
      # TODO Get observer and notify through them
      setter: (associated) ->
        association_name = @resource.toString()
        current_value    = @owner.observed[association_name]

        # Do nothing if the values are not changing
        return if current_value == associated and !(current_value || associated)

        @owner.observed[association_name] = associated
        @owner.observed[association_name + '_id'] = if associated then associated._id else null

        # TODO implement notification api on observable
        unless Object.observe
          @owner.observation.observers[association_name]?.check_()
        else
          change = oldValue: current_value, type: 'update', name: association_name, object: @owner
          Object.getNotifier(@owner).notify change

          change = oldValue: associated?._id, type: 'update', name: association_name + '_id', object: @owner
          Object.getNotifier(@owner).notify change

        associated


callbacks =
  has_many:
    # Forward association nested attributes
    # TODO write attribute setter, and remove this code
    nest_attributes: ->
      # TODO only nest specified nested attributes on model definition
      # TODO remove associations iteration, and pass throught parameter
      # TODO DO not support '_attributes' property on instantiating!
      association_names = model[@resource].has_many
      if association_names
        for association_name in association_names

          # Instantiate new records for the association attributes
          # TODO DO not support '_attributes' property on instantiating!
          # TODO define setter for attributes
          associations_attributes = @["#{association_name}_attributes"]
          association = @[model.pluralize association_name]

          if associations_attributes and associations_attributes.length

            unless association
              message  = "has_many.nest_attributes: Association not found for #{association_name}. \n"
              message += "did you set it on model declaration? \n  has_many: #{association_name} "
              throw message

            # TODO store a singular copy of the resource for better performace
            association.resource = model.singularize association.resource
            association.add.apply association, associations_attributes
            association.resource = model.pluralize   association.resource

          delete @["#{association_name}_attributes"]

    # TODO Update route after setting the id
    # TODO Update route association only once for each associated record
    update_association: (data) ->
      id = @_id || data && (data._id || data.id)

       # Keep trying until we have a id
      return unless id

      for association_name in model[@resource.toString()].has_many
        pluralized_association = model.pluralize association_name
        association = @[pluralized_association]
        # TODO setter of association.route
        # to automatically update associated records
        unless association.route
          association.route = "/#{model.pluralize @resource.toString()}/#{id}/#{model.pluralize association.resource}"

          for associated in association when not associated.route and associated.parent?
            associated.route = "/#{model.pluralize @resource.toString()}/#{id}/#{model.pluralize association.resource}"

      true
    autosave: ->
      throw 'Not implemented yet'
      # @save()

  has_one:
    # Forward association nested attributes
    # TODO write attribute setter, and remove this code
    nest_attributes: ->
      # TODO only nest specified nested attributes on model definition
      # TODO convert to associations instead of association name
      # TODO remove associations iteration, and pass throught parameter
      # TODO DO not support '_attributes' property on instantiating!
      association_names = model[@resource].has_one
      if association_names
        for association_name in association_names
          associations_attributes = @["#{association_name}_attributes"]
          if associations_attributes
            @[association_name] = @["build_#{association_name}"] associations_attributes
            delete @["#{association_name}_attributes"]


# TODO Better association segregation
associable =
  model:

    # @ = model instance
    # param definition modable
    blender: (definition) ->
      {model} = associable

      @create_after_hooks  = model.create_after_hooks
      @create_before_hooks = model.create_before_hooks

      # TODO better default definition of associations
      @has_many   = [@has_many  ] if @has_many   and $.type(@has_many)   != 'array'
      @has_one    = [@has_one   ] if @has_one    and $.type(@has_one)    != 'array'
      @belongs_to = [@belongs_to] if @belongs_to and $.type(@belongs_to) != 'array'

      @has_many   ||= []
      @has_one    ||= []
      @belongs_to ||= []

      true


    # TODO better organisation of this code
    # inside this function: @ = record (running on after_initialize)
    create_after_hooks: (definition) ->

      # TODO Rename options to definition
      options = model[@resource.name || @resource.toString()]

      # Create association methods
      # Setup one to many association in model
      if options.has_many

        # TODO accept more options on has_many association creation
        for resource in options.has_many
          # unless model[resource]
          # throw "Model not found for association with resource '#{resource}', on association 'has_many' "

          # TODO instantiate default resources in has_many association
          # @resource = model[resource].resource

          # TODO Remember to clear association proxy when object is destroyed
          association_proxy      = resource: resource, parent_resource: @resource, parent: @
          association_name       = model.pluralize resource

          # When deserializing has many associated resources from
          # server, it is common to send as the association without
          # attributes suffix
          association_attributes = @[association_name] ||  []
          @["#{association_name}_attributes"]          ||= []
          @["#{association_name}_attributes"]            = @["#{association_name}_attributes"].concat association_attributes if association_attributes.length

          # Create or Override sent attributes by the association proxy
          @[association_name]    = $.extend association_proxy, plural


        # Update association attribute
        @after 'saved', callbacks.has_many.update_association

        # Remove nested attributes and convert them into actual records
        callbacks.has_many.nest_attributes.call @

      if options.has_one
        for resource in options.has_one
          # unless model[resource]
            # throw "Model not found for association with resource '#{resource}', on association 'has_one' "

          # TODO deprecate parent_resource
          association_proxy = resource: resource, parent_resource: @resource, owner: @
          association_proxy[@resource.toString()] = @

          @["build_#{resource}" ] = $.proxy singular.build , association_proxy
          @["create_#{resource}"] = $.proxy singular.create, association_proxy


          # When deserializing has one associated resources from
          # server, it is common to send as the association without
          # attributes suffix
          @["#{association_name}_attributes"] = $.extend @[association_name], @["#{association_name}_attributes"]

          # Update association attribute
          # TODO @after 'saved', callbacks.has_one.update_association

        # Remove nested attributes and convert them into actual records
        callbacks.has_one.nest_attributes.call @

      # Externalize this to a file
      if options.belongs_to
        # TODO implement association reflection!
        for resource in options.belongs_to
          # unless model[resource]
            # throw "Model not found for association with resource '#{resource}', on association 'belongs_to' "

          # TODO put deprecation warning on parent key
          association_proxy = resource: resource, parent_resource: @resource, parent: @, owner: @

          # TODO see why this code is here, since we have the owner key
          association_proxy[@resource.toString()] = @

          @["build_#{resource}"]  = $.proxy singular.build , association_proxy
          @["create_#{resource}"] = $.proxy singular.create, association_proxy

          # TODO copy from active record and better modularization of
          # this internals
          # To prevent association loading request we must nullify the
          # association when subscribing
          old_resource_id     = @["#{resource}_id"]
          old_dirty           = @dirty
          @["#{resource}_id"] = null

          # TODO implement as a class
          Object.defineProperty @, "#{resource}_id",
            get: $.proxy descriptors.belongs_to.resource_id.getter, association_proxy
            set: $.proxy descriptors.belongs_to.resource_id.setter, association_proxy
            configurable: true

          # Restore id after loader prevention has passed
          @["#{resource}_id"] = old_resource_id
          @dirty              = old_dirty

          # Execute relation attributes binding
          # TODO validate bindings! When @resource._id != @["#{resource}_id"]
          # TODO write test for this case
          # if @["#{resource}_id"] and not @[resource]
          #   @publish "#{resource}_id", @["#{resource}_id"]

    # TODO better organization of this code, probably transforming the
    # association into a composable object inside this function: @ =
    # record (running on before_initialize) Beware there is no
    # advisable or observable features
    # @ = model
    # param record = record instance
    create_before_hooks: (record) ->
      definition = @

      # TODO Externalize this to a file
      if definition.belongs_to

        # TODO implement association reflection!
        for resource in definition.belongs_to
          # unless model[resource]
            # throw "Model not found for association with resource '#{resource}', on association 'belongs_to' "

          # TODO put deprecation warning on parent key
          association_proxy = resource: resource, parent_resource: @resource, owner: record

          old_resource         = record[resource]
          old_resource_id      = record[resource + '_id']

          Object.defineProperty record, resource.toString(),
            get: $.proxy descriptors.belongs_to.resource.getter, association_proxy
            set: $.proxy descriptors.belongs_to.resource.setter, association_proxy
            configurable: true

          # Execute setter in order to do the apropriate actions to
          # the previoulsy stored value in the association property
          # TODO fix the prototype chain and remove this code
          record.after_initialize.push (-> (@[resource] = old_resource) or (@[resource + '_id'] = old_resource_id))

  # @ = record
  record:
    after_initialize: (attributes) ->
      throw new Error 'resource must be defined in order to associate' unless @resource?
      model[@resource.name || @resource.toString()].create_after_hooks.call @

    before_initialize: (creation) ->
      throw new Error 'resource must be defined in order to associate' unless @resource
      model[@resource.name || @resource.toString()].create_before_hooks creation


# Extend indemma
model  = root.model     # TODO better way to get parent
model.mix (modelable) ->
  modelable.after_mix.push associable.model.blender
  modelable.record.before_initialize.push associable.record.before_initialize
  modelable.record.after_initialize.push  associable.record.after_initialize

# This allows to extendind the associable mixin
model.associable =
  mix : (blender) ->
    blender singular, plural
