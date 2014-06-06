var $, merge, model, observable, record, rest, restful, root, type, util,
  __slice = [].slice;

merge = require('assimilate').withStrategy('deep');

type = require('type');

observable = require('observable').mixin;

$ = require('jquery');

rest = require('./rest.js');

root = typeof exports !== "undefined" && exports !== null ? exports : this;

import './dirtyable.js';

util = {
  model: {
    map: function(records) {
      var record, _i, _len, _results;

      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        _results.push(this(record));
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
    every: function(conditions, doned, failed) {
      if (conditions == null) {
        conditions = {};
      }
      if (typeof conditions === 'function') {
        doned = conditions;
        conditions = {};
      }
      return $.when(rest.get.call(this, conditions)).then(util.model.map).done(doned).fail(failed);
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
      return this.every(conditions, callback);
    },
    get: function(action, data) {
      var default_route, old_route, payload, promise, resource;

      if (data == null) {
        data = {};
      }
      old_route = this.route;
      default_route = '/';
      if (this.resource.scope != null) {
        default_route += this.resource.scope + '/';
      }
      default_route += this.resource.singular ? this.resource.name : model.pluralize(this.resource.name);
      if (default_route !== this.route) {
        this.route = default_route;
      }
      if (action) {
        Object.defineProperty(this, 'route', {
          value: "" + default_route + "/" + action,
          configurable: true
        });
      }
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
      Object.defineProperty(this, 'route', {
        value: old_route,
        configurable: true
      });
      return promise;
    },
    put: rest.put,
    "delete": rest["delete"]
  },
  record: {
    ready: function(callback) {
      return callback.call(this);
    },
    reload: function() {
      var data, param, params, promise, _i, _len;

      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      data = params.pop();
      if (type(data) !== 'object') {
        params.push(data);
      }
      promise = rest.get.call(this, data || {});
      promise.done(this.assign_attributes);
      promise.fail(this.failed);
      this.reloading = promise;
      this.ready = function() {
        console.warn("resource.ready was deprecated, please use resource.reloading.done");
        return promise.done.apply(promise, arguments);
      };
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        param = params[_i];
        promise.done(param);
      }
      return promise;
    },
    assign_attributes: function(attributes) {
      var associated, association, association_attributes, association_name, associations_attributes, attribute, message, name, singular_resource, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;

      _ref = model[this.resource.toString()].has_many;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        association_name = _ref[_i];
        associations_attributes = attributes[association_name + "_attributes"] || attributes[association_name];
        delete attributes[association_name];
        delete attributes[association_name + '_attributes'];
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
        delete attributes[association_name + "_attributes"];
        if (association_attributes) {
          associated = this[association_name] || this["build_" + association_name]();
          associated.assign_attributes(association_attributes);
          this[association_name] = associated;
        }
      }
      _ref3 = model[this.resource.toString()].belongs_to;
      for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {
        association_name = _ref3[_m];
        association_attributes = (_ref4 = (_ref5 = attributes[association_name]) != null ? typeof _ref5.json === "function" ? _ref5.json() : void 0 : void 0) != null ? _ref4 : attributes[association_name];
        delete attributes[association_name];
        delete attributes[association_name + "_attributes"];
        if (association_attributes) {
          associated = this[association_name] || this["build_" + association_name]();
          associated.assign_attributes(association_attributes);
          this[association_name] = associated;
        }
      }
      _results = [];
      for (name in attributes) {
        attribute = attributes[name];
        if (attribute !== this[name]) {
          if (type(attribute) === 'object') {
            if (JSON.stringify(attribute) !== JSON.stringify(this[name])) {
              _results.push(this[name] = attributes[name]);
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(this[name] = attributes[name]);
          }
        }
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
      var lock, salvation;

      lock = JSON.stringify(this.json());
      if (this.saving) {
        if (this.lock === lock) {
          return this.salvation;
        } else {
          this.salvation.abort();
        }
      }
      this.lock = lock;
      if (!this.dirty) {
        salvation = $.Deferred().resolveWith(this, null);
      }
      this.saving = true;
      salvation || (salvation = rest[this._id ? 'put' : 'post'].call(this, data));
      this.salvation = salvation;
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
      var attribute_name, definition, e, message, messages, payload, _i, _len, _ref;

      payload = xhr.responseJSON;
      try {
        payload || (payload = JSON.parse(xhr.responseText));
      } catch (_error) {
        e = _error;
      }
      payload || (payload = xhr.responseText);
      switch (xhr.status) {
        case 0:
          message = status || xhr.statusText;
          switch (message) {
            case 'abort':
              console.info("salvation probably aborted");
              break;
            case 'error':
              console.info("server probably unreachable");
              break;
            default:
              throw new Error('Unhandled status code for xhr');
          }
          break;
        case 422:
          definition = model[this.resource.toString()];
          _ref = payload.errors;
          for (attribute_name in _ref) {
            messages = _ref[attribute_name];
            if (!definition.associations) {
              definition.associations = definition.has_one.concat(definition.has_many.concat(definition.belongs_to));
            }
            if (!(this.hasOwnProperty(attribute_name) || definition.hasOwnProperty(attribute_name) || definition.associations.indexOf(attribute_name) !== -1 || attribute_name === 'base')) {
              message = "Server returned an validation error message for a attribute that is not defined in your model.\n";
              message += "The attribute was '" + attribute_name + "', the model resource was '" + this.resource + "'.\n";
              message += "The model definition keys were '" + (JSON.stringify(Object.keys(definition))) + "'.\n";
              message += "Please remove server validation, or update your model definition.";
              throw new TypeError(message);
            }
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              message = messages[_i];
              this.errors.add(attribute_name, 'server', {
                server_message: message
              });
            }
          }
          break;
        default:
          message = "Fail in " + this.resource + ".save:\n";
          message += "Record: " + this + "\n";
          message += "Status: " + status + " (" + (payload || xhr).status + ")\n";
          message += "Error : " + (payload.error || payload.message || payload);
          console.log(message);
      }
      return this.saving = false;
    },
    toString: function() {
      var e, name, property, serialized;

      serialized = {};
      serialized[this.resource] = this.json();
      try {
        return JSON.stringify(serialized);
      } catch (_error) {
        e = _error;
        console.warn("restfulable.toString: Failed to stringify record: " + e.message + ". retrying...");
        for (name in serialized) {
          property = serialized[name];
          if (typeof property === 'object') {
            delete serialized[name];
          }
        }
        return JSON.stringify(serialized);
      }
    },
    json: function(options) {
      var definition, json, method, name, nature, nested, value, _ref, _ref1;

      if (options == null) {
        options = {};
      }
      json = {};
      definition = model[this.resource.toString()];
      for (name in this) {
        if (observable.ignores.indexOf(name) !== -1) {
          continue;
        }
        nested = this.nested_attributes.indexOf(name) !== -1;
        if (!nested && (definition.belongs_to.indexOf(name) !== -1 || definition.has_one.indexOf(name) !== -1 || definition.has_many.indexOf(name) !== -1)) {
          continue;
        }
        value = this[name];
        if (value == null) {
          continue;
        }
        nature = type(value);
        if (nature === 'function') {
          continue;
        }
        if (nature === 'object' || nature === 'element') {
          if (nested) {
            if (!value.json) {
              console.warn("json: Tryied to serialize nested attribute '" + name + "' without serialization method!");
              continue;
            }
            json["" + name + "_attributes"] = value.json(options[name]);
          } else if ((value.toJSON != null) || (value.json != null)) {
            if (value.resource) {
              continue;
            }
            if (value.json != null) {
              json[name] = value.json(options[name]);
            } else {
              json[name] = value.toJSON(options[name]);
            }
          } else {
            continue;
          }
        } else {
          json[name] = value;
        }
      }
      json = observable.unobserve(json);
      _ref1 = (_ref = options.methods) != null ? _ref : {};
      for (name in _ref1) {
        value = _ref1[name];
        method = this[name];
        if (typeof method === 'function') {
          json[name] = method();
        } else {
          json[name] = method;
        }
      }
      delete json.dirty;
      delete json.resource;
      delete json.route;
      delete json.initial_route;
      delete json.after_initialize;
      delete json.before_initialize;
      delete json.parent_resource;
      delete json.nested_attributes;
      delete json.reloading;
      delete json.ready;
      delete json.saving;
      delete json.salvation;
      delete json.sustained;
      delete json.element;
      delete json["default"];
      delete json.lock;
      delete json.validated;
      delete json.validation;
      delete json.errors;
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
