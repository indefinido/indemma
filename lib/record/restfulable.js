var $, merge, model, observable, record, rest, restful, type, util,
  __slice = [].slice;

merge = require('assimilate').withStrategy('deep');

type = require('type');

observable = require('observable').mixin;

$ = require('jquery');

rest = require('./rest.js');

util = {
  model: {
    map: function(models) {
      var model, _i, _len, _results;

      _results = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        _results.push(this(model));
      }
      return _results;
    }
  }
};

restful = {
  model: {
    create: function() {
      var attributes, callback, params, record, savings, _i, _j, _len;

      params = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
      if (!arguments.length) {
        throw new TypeError("No arguments provided for " + this.resource + ".create");
      }
      if (typeof callback !== 'function') {
        params.push(callback);
        callback = void 0;
      }
      if (!params.length) {
        params.unshift({});
      }
      savings = [];
      for (_j = 0, _len = params.length; _j < _len; _j++) {
        attributes = params[_j];
        record = this(attributes);
        record.dirty = true;
        savings.push(record.save(callback));
      }
      return $.when.apply($, savings);
    },
    all: function(conditions, callback) {
      if (conditions == null) {
        conditions = {};
      }
      if (typeof conditions === 'function') {
        callback = conditions;
        conditions = {};
      }
      return $.when(rest.get.call(this, conditions)).then(util.model.map).done(callback);
    },
    first: function(conditions, callback) {
      var namespaced;

      if (conditions == null) {
        conditions = {};
      }
      if (typeof conditions === 'function') {
        callback = conditions;
        conditions = {};
      }
      namespaced = conditions[this.resource] || {};
      namespaced.limit = 1;
      namespaced.order = 'desc';
      return this.all(conditions, callback);
    },
    get: function(action, data) {
      var old_route, payload, promise, resource, route;

      old_route = this.route;
      this.route = "/" + (model.pluralize(this.resource.name)) + "/" + action;
      resource = data.resource;
      if (data && data.json) {
        data = data.json();
      }
      if (resource != null) {
        payload = data;
        data = {};
        data[resource] = payload;
      }
      promise = rest.get.call(this, data);
      route = old_route;
      return promise;
    },
    put: rest.put
  },
  record: {
    reload: function() {
      var argument, promise, _i, _len;

      promise = rest.get.call(this);
      promise.done(this.assign_attributes);
      promise.fail(this.failed);
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        argument = arguments[_i];
        if (type(argument) === 'function') {
          promise.done(argument);
        }
      }
      return promise;
    },
    assign_attributes: function(attributes) {
      var association, association_attributes, association_name, associations_attributes, attribute, message, singular_resource, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _results;

      _ref = model[this.resource.toString()].has_many;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        association_name = _ref[_i];
        associations_attributes = attributes[association_name];
        delete attributes[association_name];
        association = this[association_name];
        if (association == null) {
          message = "Association '" + association_name + "' not found. \n";
          message += "For record with resource " + this.resource + ". \n";
          message += "Probably defined on server side but not on client side.\n";
          message += "Skipping association assignment!";
          console.warn(message);
          continue;
        }
        if (association.length) {
          Array.prototype.splice.call(association, 0);
        }
        if (!((associations_attributes != null) && associations_attributes.length)) {
          continue;
        }
        singular_resource = model.singularize(association_name);
        for (_j = 0, _len1 = associations_attributes.length; _j < _len1; _j++) {
          association_attributes = associations_attributes[_j];
          _ref1 = model[singular_resource].has_many;
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            association_name = _ref1[_k];
            association_attributes["" + association_name + "_attributes"] = association_attributes[association_name];
            delete association_attributes[association_name];
          }
        }
        association.add.apply(association, associations_attributes);
      }
      _ref2 = model[this.resource.toString()].has_one;
      for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
        association_name = _ref2[_l];
        association_attributes = attributes[association_name];
        delete attributes[association_name];
        if (association_attributes) {
          this[association_name] = this["build_" + association_name](association_attributes);
        }
      }
      _results = [];
      for (attribute in attributes) {
        _results.push(this[attribute] = attributes[attribute]);
      }
      return _results;
    },
    destroy: function(doned, failed, data) {
      var promise;

      if (!((this.id != null) || (this._id != null))) {
        throw new Error('Can\'t delete record without id!');
      }
      promise = rest["delete"].call(this, data);
      promise.done(this.destroyed);
      promise.fail(this.failed);
      promise.done(doned);
      promise.fail(failed);
      return promise;
    },
    saving: false,
    salvation: null,
    save: function(doned, failed, data) {
      var salvation;

      if (this.saving) {
        return this.salvation;
      }
      this.lock = JSON.stringify(this.json());
      if (!this.dirty) {
        salvation = $.Deferred().resolveWith(this, null);
      }
      salvation || (salvation = rest[this._id ? 'put' : 'post'].call(this, data));
      this.salvation = salvation;
      this.saving = true;
      salvation.done(this.saved);
      salvation.fail(this.failed);
      salvation.always(function() {
        return this.saving = false;
      });
      salvation.done(doned);
      salvation.fail(failed);
      return salvation;
    },
    saved: function(data) {
      var callback, _i, _len, _ref, _results;

      if (this.lock === JSON.stringify(this.json())) {
        this.dirty = false;
        delete this.lock;
      } else {
        return this.save();
      }
      if (data != null) {
        this.assign_attributes(data);
      }
      if (this.after_save) {
        _ref = this.after_save;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          throw "Not supported after_save callback: " + callback;
        }
        return _results;
      }
    },
    failed: function(xhr, error, status) {
      var attribute_name, definition, e, message, messages, payload, _ref, _results;

      payload = xhr.responseJSON;
      try {
        payload || (payload = JSON.parse(xhr.responseText));
      } catch (_error) {
        e = _error;
      }
      payload || (payload = xhr.responseText);
      switch (xhr.status) {
        case 422:
          definition = model[this.resource];
          _ref = payload.errors;
          _results = [];
          for (attribute_name in _ref) {
            messages = _ref[attribute_name];
            if (!(this.hasOwnProperty(attribute_name) || definition.hasOwnProperty(attribute_name))) {
              message = "Server returned an validation error message for a attribute that is not defined in your model.\n";
              message += "The attribute was '" + attribute_name + "', the model resource was '" + this.resource + "'.\n";
              message += "The model definition keys were '" + (JSON.stringify(Object.keys(definition))) + "'.\n";
              message += "Please remove server validation, or update your model definition.";
              throw new TypeError(message);
            }
            _results.push((function() {
              var _i, _len, _results1;

              _results1 = [];
              for (_i = 0, _len = messages.length; _i < _len; _i++) {
                message = messages[_i];
                _results1.push(this.errors.add(attribute_name, 'server', {
                  server_message: message
                }));
              }
              return _results1;
            }).call(this));
          }
          return _results;
          break;
        default:
          message = "Fail in " + this.resource + ".save:\n";
          message += "Record: " + this + "\n";
          message += "Status: " + status + " (" + (payload.status || xhr.status) + ")\n";
          return message += "Error : " + (payload.error || payload.message || payload);
      }
    },
    toString: function() {
      var serialized;

      serialized = {};
      serialized[this.resource] = this.json();
      return JSON.stringify(serialized);
    },
    json: function(methods) {
      var attribute, json, name, value, _i, _len, _ref;

      if (methods == null) {
        methods = {};
      }
      json = {};
      for (name in this) {
        value = this[name];
        if (!(type(value) !== 'function')) {
          continue;
        }
        if (value == null) {
          continue;
        }
        if (type(value) === 'object') {
          if (value.toJSON != null) {
            json[name] = value.toJSON(methods[name]);
          } else {
            _ref = this.nested_attributes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              attribute = _ref[_i];
              if (attribute === name) {
                json["" + name + "_attributes"] = value.json(methods[name]);
              }
            }
          }
        } else {
          json[name] = value;
        }
      }
      observable.unobserve(json);
      delete json.dirty;
      delete json.resource;
      delete json.route;
      delete json.initial_route;
      delete json.after_initialize;
      delete json.parent_resource;
      delete json.nested_attributes;
      delete json.saving;
      delete json.salvation;
      delete json.element;
      delete json["default"];
      delete json.lock;
      delete json.validated;
      delete json.validation;
      return json;
    }
  }
};

restful.toJSON = restful.json;

model = window.model;

record = window.record;

model.restfulable = true;

record.mix(function(recordable) {
  return merge(recordable, restful.record);
});

model.mix(function(modelable) {
  return merge(modelable, restful.model);
});

model.associable && model.associable.mix(function(singular_association, plural_association) {
  plural_association.get = function() {
    if (this.parent != null) {
      this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource.name)));
    }
    return rest.get.apply(this, arguments);
  };
  return plural_association.post = function() {
    if (this.parent != null) {
      this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource.name)));
    }
    return rest.post.apply(this, arguments);
  };
});
