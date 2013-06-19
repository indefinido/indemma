model  = window.model     # TODO window
extend = require 'extend'
type   = require 'type'


model.restfulable = ->
  resource =
    save: () ->
      return unless @dirty
      promise = rest[if @_id then 'put' else 'post'].call @
      promise.done @saved
      promise.fail @failed

      # Bind one time save callbacks
      promise.done argument for argument in arguments when type(argument) is 'function'

      @lock = JSON.stringify(@json())

      promise

    saved: (data) ->

      if @lock == JSON.stringify(@json())
        @dirty = false
        delete @lock
      # Delayed optimistic lock
      else
        @save()

      # parsear resposta do servidor e popular dados no modelo atual
      # dispatchar evento de registro salvo, usando o nome do resource
      throw "Not supported after_save callback: " + callback for callback in @after_save if @after_save
    failed: ->
      throw "#{@resource}.save: Failed to save record: #{@}\n"
    toString: ->
      serialized = {}
      serialized[@resource] = @json()
      JSON.stringify serialized
    json: ->
      json = {}

      for name, value of @ when type(value) isnt 'function'
        continue unless value?  # Bypass null, and undefined values

        if type(value) == 'object'
          # TODO move nested attributes to model definition
          json["#{name}_attributes"] = value.json() for attribute in @nested_attributes when attribute == name
        else
          json[name] = value

      observable.unobserve json

      # TODO Store reserved words in a array
      # TODO User _.omit functions
      # Remove model reserved words
      delete json.dirty
      delete json.resource
      delete json.route
      delete json.parent_resource
      delete json.nested_attributes
      delete json.on_save
      delete json.element
      delete json.default
      delete json.lock

      json


  record.mix (recordable) ->
    extend true, recordable, resource

  model.associable && model.associable.mix (singular_association,  plural_association) ->
    plural_association.post = ->
      @route ||= "#{@parent.route}/#{@parent._id}/#{model.pluralize @resource}" if @parent?
      rest.post.apply @, arguments


rest =
  put : -> rest.request.call @, 'put' , "#{@route}/#{@_id}", arguments...
  post: -> rest.request.call @, 'post', @route, arguments...
  request: (method, url, data) ->
    unless data
     data = {}
     data[@resource] = @json()

    $.ajax
      url    : url
      data   : data
      type   : method
      context: @