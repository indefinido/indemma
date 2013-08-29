var errorsable, extensions, initializers, manager, messages, observable, root, stampit, type, validatable;

require('./translationable');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

stampit = require('../../vendor/stampit');

observable = require('observable').mixin;

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

    confirmation_attribute_name = this.human_attribute_name("" + attribute_name + "_confirmation");
    attribute_name = this.human_attribute_name(attribute_name);
    return "O campo " + attribute_name + " não está diacordo com a confirmação " + confirmation_attribute_name + ".";
  },
  associated: function(attribute_name) {
    attribute_name = this.human_attribute_name(attribute_name);
    return "O registro associado " + attribute_name + " não é válido";
  },
  server: function(attribute_name, options) {
    return "" + (this.human_attribute_name(attribute_name)) + " " + options.server_message + " ";
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
  splice: Array.prototype.splice
}, {
  model: null,
  messages: {},
  length: 0
});

initializers = {
  define_triggers: function() {
    this.errors = errorsable({
      model: model[this.resource]
    });
    this.before('save', function() {
      if (this.save) {
        return this.validate();
      }
    });
    this.validated = false;
    this.subscribe('dirty', function() {
      return this.validated = false;
    });
    return Object.defineProperty(this, 'valid', {
      get: function() {
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
  },
  create_validators: function(definitions) {
    var definition, name, validator, validator_options, _ref, _results;

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
    validators: []
  },
  record: {
    validate_attribute: function(attribute, doned, failed) {
      var results, validation, validator, _i, _len, _ref;

      this.errors.messages[attribute] = null;
      results = [this, attribute];
      _ref = model[this.resource].validators;
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
      _ref = model[this.resource].validators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validator = _ref[_i];
        results.push(validator.validate_each(this, validator.attribute_name, this[validator.attribute_name]));
      }
      this.validation = jQuery.when.apply(jQuery, results);
      this.validation.done(doned);
      this.validation.fail(failed);
      this.validation.then(function(record) {
        return record.validated = true;
      });
      return this.validation;
    }
  }
};

manager = {
  validators: {}
};

validatable = stampit({
  validate: function() {
    throw new Error('Composed factory must override the validate method');
  },
  validate_each: function() {
    throw new Error('Composed factory must override the validate each method');
  }
});

model.mix(function(modelable) {
  jQuery.extend(modelable, extensions.model);
  jQuery.extend(modelable.record, extensions.record);
  modelable.after_mix.unshift(initializers.create_validators);
  modelable.record.after_initialize.push(initializers.define_triggers);
  return model.validators = manager.validators;
});

root.validatable = validatable;

root.manager = manager;

require('./validations/confirmation');

require('./validations/associated');

require('./validations/presence');

require('./validations/remote');

require('./validations/cpf');
