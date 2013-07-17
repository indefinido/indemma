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
      var attributes, callback, params, record, _i, _len, _results;

      callback = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!arguments.length) {
        throw new TypeError("No arguments provided for " + this.resource + ".create");
      }
      if (typeof callback !== 'function') {
        params.unshift(callback && (callback = null));
      }
      if (!params.length) {
        params.unshift({});
      }
      _results = [];
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        attributes = params[_i];
        record = this(attributes);
        record.dirty = true;
        _results.push(record.save(callback));
      }
      return _results;
    },
    all: function(callback, conditions) {
      if (conditions == null) {
        conditions = {};
      }
      return $.when(rest.get.call(this, conditions)).then(util.model.map).done(callback);
    }
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
      var attribute, _results;

      _results = [];
      for (attribute in attributes) {
        _results.push(this[attribute] = attributes[attribute]);
      }
      return _results;
    },
    save: function() {
      var argument, promise, _i, _len;

      if (!this.dirty) {
        return $.Deferred().resolve();
      }
      promise = rest[this._id ? 'put' : 'post'].call(this);
      promise.done(this.saved);
      promise.fail(this.failed);
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        argument = arguments[_i];
        if (type(argument) === 'function') {
          promise.done(argument);
        }
      }
      this.lock = JSON.stringify(this.json());
      return promise;
    },
    saved: function(data) {
      var callback, _i, _len, _ref, _results;

      if (this.lock === JSON.stringify(this.json())) {
        this.dirty = false;
        delete this.lock;
      } else {
        this.save();
      }
      this.assign_attributes(data);
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
      var e, message, payload;

      payload = xhr.responseJSON;
      try {
        payload || (payload = JSON.parse(xhr.responseText));
      } catch (_error) {
        e = _error;
      }
      payload || (payload = xhr.responseText);
      switch (xhr.status) {
        case 422:
          this.valid = false;
          return this.errors = payload.errors;
        default:
          message = "Fail in " + this.resource + ".save:\n";
          message += "Record: " + this + "\n";
          message += "Status: " + status + " (" + (payload.status || xhr.status) + ")\n";
          message += "Error : " + (payload.error || payload.message || payload);
          return console.error(message);
      }
    },
    toString: function() {
      var serialized;

      serialized = {};
      serialized[this.resource] = this.json();
      return JSON.stringify(serialized);
    },
    json: function() {
      var attribute, json, name, value, _i, _len, _ref;

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
          _ref = this.nested_attributes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attribute = _ref[_i];
            if (attribute === name) {
              json["" + name + "_attributes"] = value.json();
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
      delete json.after_initialize;
      delete json.parent_resource;
      delete json.nested_attributes;
      delete json.on_save;
      delete json.element;
      delete json["default"];
      delete json.lock;
      return json;
    }
  }
};

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
  plural_association.all = plural_association.reload = function(done, fail) {
    var dirty, promises, reload, _i, _len;

    if (this.parent != null) {
      this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
    }
    dirty = 0;
    promises = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      record = this[_i];
      if (record.dirty) {
        dirty++;
      }
    }
    promises.push(rest.get.call(this));
    promises[0].fail(restful.record.failed);
    reload = $.when.apply(jQuery, promises);
    reload.done(function(records, status) {
      Array.prototype.splice.call(this, 0);
      return Array.prototype.push.apply(this, records);
    });
    reload.done(done);
    reload.fail(fail);
    return reload;
  };
  plural_association.each = function(callback) {
    var _this = this;

    if (this.parent != null) {
      this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
    }
    return this.get().done(function(records) {
      var _i, _len, _results;

      _results = [];
      for (_i = 0, _len = _this.length; _i < _len; _i++) {
        record = _this[_i];
        _results.push(callback(record));
      }
      return _results;
    });
  };
  plural_association.get = function() {
    if (this.parent != null) {
      this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
    }
    return rest.get.apply(this, arguments);
  };
  return plural_association.post = function() {
    if (this.parent != null) {
      this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
    }
    return rest.post.apply(this, arguments);
  };
});