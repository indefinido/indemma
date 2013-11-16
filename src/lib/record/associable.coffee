
root = window
$    = require 'jquery'

require './resource'

# Store association methods
# TODO Implement setter for route
plural = # has_many ## TODO embeds_many
  add   : (params...) -> @push @build attributes for attributes in params
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
  push    : Array.prototype.push

  length : 0
  json   : (methods, omissions) -> record.json(methods, omissions) for record in @


singular = # belongs_to, has_one ## TODO embeds_one, embedded_in
  create: (data) ->                  model[@resource].create $.extend {}, @, data
  build : (data) ->
    # Adds child record of association to parent, and returns new
    # record
    @[@parent_resource][@resource] = model[@resource]        $.extend {}, @, data

# TODO Better association segregation
associable =
  # @ = model
  model: (options) ->
    console.error 'resource must be defined in order to associate' unless @resource?

    callbacks =
      # Forward association nested attributes
      has_many:
        nest_attributes: ->
          # TODO only nest specified nested attributes on model definition
          association_names = model[@resource].has_many
          if association_names
            for association_name in association_names
              associations_attributes = @["#{association_name}_attributes"]
              if associations_attributes and associations_attributes.length
                association = @[model.pluralize association_name]

                unless association
                  message  = "has_many.nest_attributes: Association not found for #{association_name}. \n"
                  message += "did you set it on model declaration? \n  has_many: #{association_name} "
                  throw message

                # TODO store a singular copy of the resource for better performace
                association.resource = model.singularize association.resource
                association.add.apply association, associations_attributes
                association.resource = model.pluralize   association.resource

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

              for associated in association
                if not associated.route and associated.parent?
                  associated.route = "/#{model.pluralize @resource.toString()}/#{id}/#{model.pluralize association.resource}"

          true
        autosave: ->
          @save()

    # TODO autosave
    # @after_save.push ->
    #   model[@resource] =
    #
    @has_many   = [@has_many  ] if @has_many   and $.type(@has_many)   != 'array'
    @has_one    = [@has_one   ] if @has_one    and $.type(@has_one)    != 'array'
    @belongs_to = [@belongs_to] if @belongs_to and $.type(@belongs_to) != 'array'

    @has_many   ||= []
    @has_one    ||= []
    @belongs_to ||= []

    # TODO better organisation of this code
    # inside this function: @ = record (running on after_initialize)
    @create_associations = ->
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
          association_proxy   = resource: resource, parent_resource: @resource, parent: @
          association_name    = model.pluralize resource
          @[association_name] = $.extend association_proxy, plural

        # Update association attribute
        @after 'saved', callbacks.has_many.update_association

        # Forward nested attributes
        callbacks.has_many.nest_attributes.call @

      if options.has_one
        for resource in options.has_one
          # unless model[resource]
            # throw "Model not found for association with resource '#{resource}', on association 'has_one' "

          association_proxy = resource: resource, parent_resource: @resource
          association_proxy[@resource] = @

          @["build_#{resource}" ] = $.proxy singular.build , association_proxy
          @["create_#{resource}"] = $.proxy singular.create, association_proxy

      if options.belongs_to

        for resource in options.belongs_to
          # unless model[resource]
            # throw "Model not found for association with resource '#{resource}', on association 'belongs_to' "

          association_proxy = resource: resource, parent_resource: @resource

          # TODO override default setter to set resource_id from parent resource FTW!
          association_proxy[@resource] = @

          @["build_#{resource}" ] = $.proxy singular.build , association_proxy
          @["create_#{resource}"] = $.proxy singular.create, association_proxy

  # @ = record
  record: (options) ->
    console.error 'resource must be defined in order to associate' unless @resource?
    model[@resource.name || @resource.toString()].create_associations.call @


# Extend indemma
model  = root.model     # TODO better way to get parent
model.mix (modelable) ->
  modelable.after_mix.push associable.model
  modelable.record.after_initialize.push associable.record

# This allows to extendind the associable mixin
model.associable =
  mix : (blender) ->
    blender singular, plural
