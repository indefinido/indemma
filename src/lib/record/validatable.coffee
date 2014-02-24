require './translationable'

root       = exports ? @
stampit    = require '../../vendor/stampit'
observable = require('observable').mixin
type       = require 'type'

# TODO better model require
# model = require ...

# TODO Add base settings to validation
# TODO implement method
# model[resource].validators_on 'field' # Get all validators related to this field

# TODO use http://validatejs.org for internal handling

messages =
  blank:  (attribute_name) ->
    attribute_name = @human_attribute_name attribute_name
    "O campo #{attribute_name} não pode ficar em branco."

  cpf:  (attribute_name) ->
    attribute_name = @human_attribute_name attribute_name
    "O campo #{attribute_name} não está válido."

  confirmation:  (attribute_name) ->
    confirmation_attribute_name = @human_attribute_name attribute_name
    attribute_name              = @human_attribute_name attribute_name.replace '_confirmation', ''
    "O campo #{attribute_name} não está de acordo com o campo #{confirmation_attribute_name}."

  associated:  (attribute_name) ->
    attribute_name = @human_attribute_name attribute_name
    "O registro associado #{attribute_name} não é válido."

  server:  (attribute_name, options) ->
    # TODO Better checking of base attribute case, better yet remove
    # checking from here, just like active record
    if attribute_name == 'base'
      options.server_message
    else
      attribute_name = @human_attribute_name attribute_name
      "#{attribute_name} #{options.server_message}."

  type:  (attribute_name, options) ->
    attribute_name = @human_attribute_name attribute_name
    "O campo #{attribute_name} não está válido."

# TODO move to errorsable.coffee
errorsable = stampit
  add: (attribute_name, message_key, options) ->

    @push [attribute_name, message_key, options]
    # TODO Also push to attribute named
    # @[attribute_name].push message_key, message, options

    @messages[attribute_name] = ''

    translator = messages[message_key]

    if translator?
      @messages[attribute_name] += translator.call @model, attribute_name, options
    else
      @messages[attribute_name] += message_key

  clear: ->
    if @length
      @length   = 0
      @messages[attribute_name] = null for attribute_name of @messages

  push: Array.prototype.push
  splice: Array.prototype.splice
  indexOf: Array.prototype.indexOf
,
  model: null
  messages: null
  length: 0
, ->
  @messages = {}
  @


initializers =
  define_triggers: ->

    # TODO remove the extra inheritance level of model[@resource]
    @errors = errorsable model: model[@resource]

    # TODO only add after save when resourceable is included
    # TODO @after_initialize validate_field_types
    # TODO only execute save operation if record is valid
    @before 'save', -> @validate() if @save

    # TODO move this functionality control to validatable
    @validated = false
    @subscribe 'dirty', (value) -> value and @validated = false

    Object.defineProperty @, 'valid',
      get: ->

        @validate()

        if @validation.state() == 'resolved'
          !@errors.length
        else
          null

      set: -> throw new TypeError "You can't set the value for the valid property."
      enumerable: false

  create_validators: (definitions) ->

    @validators = []

    for name, validator of manager.validators
      definition = definitions[validator.definition_key]

      if definition
        definition = [definition] unless type(definition) == 'array'

        for validator_options in definition

          # Parse validation definition
          validator_options = attribute_name: validator_options unless type(validator_options) == 'object'
          validator_options.model = @

          # Instantiate validator
          @validators.push validator validator_options

          # Clear out definition to prevent validators from becoming
          # attributes
          delete definitions[validator.definition_key]

# Model and Record extensions
# TODO Use stampit!
extensions =
  model:
    validators: null

  record:

    validate_attribute: (attribute, doned, failed) ->
      # TODO better clearing of single attribute error message
      @errors.messages[attribute] = null

      results = [@, attribute]

      # TODO copy validators reference from model object to record object
      # TODO update json serializer
      # TODO filter validators for attribute
      for validator in model[@resource.toString()].validators
        if validator.attribute_name is attribute
          results.push validator.validate_each @, validator.attribute_name, @[validator.attribute_name]

      validation = jQuery.when.apply jQuery, results
      validation.done doned
      validation.fail failed

      validation

    validate: (doned, failed) ->
      return @validation if @validated and not @dirty

      @errors.clear()
      results  = [@]

      # TODO copy validators reference from model object to record object
      # TODO update json serializer
      for validator in model[@resource.toString()].validators
        results.push validator.validate_each @, validator.attribute_name, @[validator.attribute_name]

      @validation = jQuery.when results...
      @validation.done doned
      @validation.fail failed

      # TODO store this callback
      @validation.then (record) ->
        # Disable dirty checking to prevent validation believe that
        # the model values has changed
        old_dirty        = record.dirty
        record.dirty     = null

        record.validated ||= true

        # Restore dirty state
        record.dirty     = old_dirty

      @validation


# Validators management
manager =

  validators: {}

  # TODO async validator loading
  # for: (name) ->
  #   builder = @validators[name] ||= require "validations/#{name}"


# TODO better stampit integration
model.mix (modelable) ->
  jQuery.extend modelable, extensions.model

  jQuery.extend modelable.record, extensions.record

  modelable.after_mix.unshift initializers.create_validators
  modelable.record.after_initialize.push initializers.define_triggers

  model.validators = manager.validators

# TODO async validator loading
manager.validators.confirmation = require './validations/confirmation'
manager.validators.associated   = require './validations/associated'
manager.validators.presence     = require './validations/presence'
manager.validators.remote       = require './validations/remote'
manager.validators.type         = require './validations/type'
manager.validators.cpf          = require './validations/cpf'

