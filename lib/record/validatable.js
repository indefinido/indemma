var errorsable, extensions, initializers, manager, messages, observable, root, stampit, type;

require('./translationable');

root = typeof exports !== "undefined" && exports !== null ? exports : this;

stampit = require('../../vendor/stampit');

observable = require('observable');

type = require('type');

messages = {
  blank: function(attribute_name) {
    attribute_name = this.human_attribute_name(attribute_name);
    return "O campo " + attribute_name + " não pode ficar em branco.";
  },
  cpf: function(attribute_name) {
    attribute_name = this.human_attribute_name(attribute_name);
    return "O campo " + attribute_name + " não está válido.";
  },
  confirmation: function(attribute_name) {
    var confirmation_attribute_name;

    confirmation_attribute_name = this.human_attribute_name(attribute_name);
    attribute_name = this.human_attribute_name(attribute_name.replace('_confirmation', ''));
    return "O campo " + attribute_name + " não está de acordo com o campo " + confirmation_attribute_name + ".";
  },
  associated: function(attribute_name) {
    attribute_name = this.human_attribute_name(attribute_name);
    return "O registro associado " + attribute_name + " não é válido.";
  },
  server: function(attribute_name, options) {
    if (attribute_name === 'base') {
      return options.server_message;
    } else {
      attribute_name = this.human_attribute_name(attribute_name);
      return "" + attribute_name + " " + options.server_message + ".";
    }
  },
  type: function(attribute_name, options) {
    attribute_name = this.human_attribute_name(attribute_name);
    return "O campo " + attribute_name + " não está válido.";
  }
};

errorsable = stampit({
  add: function(attribute_name, message_key, options) {
    var translator;

    this.push([attribute_name, message_key, options]);
    this.messages[attribute_name] = '';
    translator = messages[message_key];
    if (translator != null) {
      return this.messages[attribute_name] += translator.call(this.model, attribute_name, options);
    } else {
      return this.messages[attribute_name] += message_key;
    }
  },
  clear: function() {
    var attribute_name, _results;

    if (this.length) {
      this.length = 0;
      _results = [];
      for (attribute_name in this.messages) {
        _results.push(this.messages[attribute_name] = null);
      }
      return _results;
    }
  },
  push: Array.prototype.push,
  splice: Array.prototype.splice,
  indexOf: Array.prototype.indexOf
}, {
  model: null,
  messages: null,
  length: 0
}, function() {
  this.messages = {};
  return this;
});

initializers = {
  ignores: ['dirty', 'resource', 'route', 'initial_route', 'after_initialize', 'before_initialize', 'parent_resource', 'nested_attributes', 'reloading', 'ready', 'saving', 'salvation', 'sustained', 'element', 'default', 'lock', 'validated', 'validation', 'errors', 'dirty'],
  reserved_filter: function(name) {
    return this.ignores.indexOf(name) === -1;
  },
  define_triggers: function() {
    var original_validate;

    this.errors = errorsable({
      model: model[this.resource]
    });
    this.before('save', function() {
      if (this.save) {
        return this.validate();
      }
    });
    this.validated = false;
    this.validation = null;
    this.subscribe(function(added, removed, changed) {
      var modified;

      modified = !!Object.keys($.extend(added, removed, changed)).filter(initializers.reserved_filter, initializers).length;
      return modified && (this.validated = false);
    });
    Object.defineProperty(this, 'valid', {
      get: function() {
        var _ref;

        if (((_ref = this.validation) != null ? _ref.state() : void 0) === 'pending') {
          this.validation.done(function() {
            if (this.dirty || !this.validated) {
              return this.valid;
            }
          });
          return null;
        }
        this.validate();
        if (this.validation.state() === 'resolved') {
          return !this.errors.length;
        } else {
          return null;
        }
      },
      set: function() {
        throw new TypeError("You can't set the value for the valid property.");
      },
      enumerable: false
    });
    original_validate = this.validate;
    this.validate = function() {};
    this.validation = $.Deferred();
    this.observation.deliver(true);
    this.validation = null;
    return this.validate = original_validate;
  },
  create_validators: function(definitions) {
    var definition, name, validator, validator_options, _ref, _results;

    this.validators = [];
    _ref = manager.validators;
    _results = [];
    for (name in _ref) {
      validator = _ref[name];
      definition = definitions[validator.definition_key];
      if (definition) {
        if (type(definition) !== 'array') {
          definition = [definition];
        }
        _results.push((function() {
          var _i, _len, _results1;

          _results1 = [];
          for (_i = 0, _len = definition.length; _i < _len; _i++) {
            validator_options = definition[_i];
            if (type(validator_options) !== 'object') {
              validator_options = {
                attribute_name: validator_options
              };
            }
            validator_options.model = this;
            this.validators.push(validator(validator_options));
            _results1.push(delete definitions[validator.definition_key]);
          }
          return _results1;
        }).call(this));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
};

extensions = {
  model: {
    validators: null
  },
  record: {
    validate_attribute: function(attribute, doned, failed) {
      var results, validation, validator, _i, _len, _ref;

      this.errors.messages[attribute] = null;
      results = [this, attribute];
      _ref = model[this.resource.toString()].validators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validator = _ref[_i];
        if (validator.attribute_name === attribute) {
          results.push(validator.validate_each(this, validator.attribute_name, this[validator.attribute_name]));
        }
      }
      validation = jQuery.when.apply(jQuery, results);
      validation.done(doned);
      validation.fail(failed);
      return validation;
    },
    validate: function(doned, failed) {
      var results, validator, _i, _len, _ref;

      if (this.validated) {
        return this.validation;
      }
      this.errors.clear();
      results = [this];
      _ref = model[this.resource.toString()].validators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validator = _ref[_i];
        results.push(validator.validate_each(this, validator.attribute_name, this[validator.attribute_name]));
      }
      this.validation = jQuery.when.apply(jQuery, results);
      this.validation.done(doned);
      this.validation.fail(failed);
      return this.validation.done(function(record) {
        return record.validated || (record.validated = true);
      });
    }
  }
};

manager = {
  validators: {}
};

model.mix(function(modelable) {
  if (modelable.record.validate) {
    return;
  }
  jQuery.extend(modelable, extensions.model);
  jQuery.extend(modelable.record, extensions.record);
  modelable.after_mix.unshift(initializers.create_validators);
  modelable.record.after_initialize.push(initializers.define_triggers);
  return model.validators = manager.validators;
});

manager.validators.confirmation = require('./validations/confirmation');

manager.validators.associated = require('./validations/associated');

manager.validators.presence = require('./validations/presence');

manager.validators.remote = require('./validations/remote');

manager.validators.type = require('./validations/type');

manager.validators.cpf = require('./validations/cpf');
