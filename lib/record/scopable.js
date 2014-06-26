var $, builders, defaults, extend, merge, model, observable, record, rest, scopable, stampit, util,
  __slice = [].slice;

require('./restfulable');

require('./resource');

stampit = require('../../vendor/stampit');

extend = require('assimilate');

observable = require('observable').mixin;

merge = extend.withStrategy('deep');

$ = require('jquery');

rest = require('./rest');

util = {
  model: {
    map: function(records) {
      var index, record, _i, _len, _results;

      _results = [];
      for (index = _i = 0, _len = records.length; _i < _len; index = ++_i) {
        record = records[index];
        _results.push((this.build || this).call(this, record));
      }
      return _results;
    }
  }
};

scopable = {
  builder: stampit().enclose(function() {
    return stampit.mixIn(function(name, type) {
      var builder;

      if ($.type(type) === 'function') {
        this["$" + name] = type() || new type;
        type = $.type(this["$" + name]);
      } else {
        this["$" + name] = defaults[type] || type;
      }
      if ($.type(type) !== 'string' || type.toString() === '') {
        type = $.type(type);
      }
      builder = builders[type];
      if (builder == null) {
        throw "Unknown scope type: '" + type + "', For model with resource: '" + this.resource + "'";
      }
      this.scope.declared.push(name);
      return this[name] = builder({
        name: name
      });
    }, {
      data: {},
      then: [],
      fail: [],
      declared: [],
      fetch: function(data, done, fail) {
        var deferred, method, scope;

        if (typeof data === 'function') {
          done = data;
          data = {};
        }
        scope = extend({}, this.scope.data);
        for (method in observable.methods) {
          delete scope[method];
        }
        if (scope.noned != null) {
          deferred = $.Deferred();
          deferred.resolveWith(this, [[]]);
        } else {
          deferred = rest.get.call(this, extend(scope, data));
        }
        deferred.then(util.model.map).done(this.scope.then.concat([done])).fail(this.scope.fail.concat([fail]));
        this.scope.clear();
        return deferred;
      },
      clear: function() {
        this.data = {};
        return this.callbacks = [];
      }
    });
  }),
  base: stampit().state({
    name: 'unamed_scope'
  }),
  record: {
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
      }
      return console.error(message);
    }
  },
  model: {
    none: function() {
      this.scope.data.noned = true;
      return this;
    },
    fetch: function(data, done, fail) {
      if (typeof data === 'function') {
        done = data;
        data = null;
      }
      return this.scope.fetch.call(this, data, done, fail);
    },
    forward_scopes_to_associations: function() {
      var associated_factory, associated_resource, association, association_name, factory, scope, _i, _j, _len, _len1, _ref, _ref1;

      factory = model[this.resource.name];
      _ref = factory.has_many;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        association_name = _ref[_i];
        associated_resource = model.singularize(association_name);
        associated_factory = model[associated_resource];
        if (!model[associated_resource]) {
          console.warn("Associated factory not found for associated resource: " + associated_resource);
          continue;
        }
        association = this[association_name];
        association.scope = scopable.builder(association);
        _ref1 = associated_factory.scope.declared;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          scope = _ref1[_j];
          association.scope(scope, associated_factory["$" + scope]);
        }
      }
      return true;
    }
  },
  after_mix: function() {
    var name, property, type, _results;

    this.scope = scopable.builder(this);
    _results = [];
    for (property in this) {
      type = this[property];
      if (property.charAt(0) === '$') {
        name = property.substring(1);
        _results.push(this.scope(name, type));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
};

builders = {
  string: stampit().enclose(function() {
    var base;

    base = scopable.base(this);
    return stampit.mixIn(function() {
      var callbacks, value, _base, _name;

      value = arguments[0], callbacks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      callbacks.length && (this.scope.then = this.scope.then.concat(callbacks));
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = value != null ? value : this["$" + base.name]);
      return this;
    });
  }),
  boolean: stampit().enclose(function() {
    var base;

    base = scopable.base(this);
    return stampit.mixIn(function() {
      var callbacks, value, _base, _name;

      value = arguments[0], callbacks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      callbacks.length && (this.scope.then = this.scope.then.concat(callbacks));
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = value != null ? value : this["$" + base.name]);
      return this;
    });
  }),
  array: stampit().enclose(function() {
    var base;

    base = scopable.base(this);
    return stampit.mixIn(function() {
      var values, _base, _name;

      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = values != null ? values : this["$" + base.name]);
      return this;
    });
  })
};

defaults = {
  boolean: true,
  array: []
};

model = window.model;

record = window.record;

model.scopable = true;

model.mix(function(modelable) {
  merge(modelable, scopable.model);
  return modelable.after_mix.push(scopable.after_mix);
});

if (model.associable) {
  model.mix(function(modelable) {
    return modelable.record.after_initialize.push(function() {
      return scopable.model.forward_scopes_to_associations.call(this);
    });
  });
  model.associable.mix(function(singular_association, plural_association) {
    plural_association.every = plural_association.reload = function(data, done, fail) {
      var promises, reload;

      if (this.parent != null) {
        this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
      }
      promises = [];
      if (typeof data === 'function') {
        done = data;
        data = void 0;
      }
      promises.push(this.scope.fetch.call(this, data, null, scopable.record.failed));
      reload = $.when.apply(jQuery, promises);
      reload.done(function(records, status) {
        var association_name, create, index, singular_resource, target, _i, _j, _k, _len, _len1, _len2, _ref;

        if (!records.length) {
          if (this.length) {
            Array.prototype.splice.call(this, 0);
          }
          return true;
        }
        singular_resource = model.singularize(this.resource);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          _ref = model[singular_resource].has_many;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            association_name = _ref[_j];
            record["" + association_name + "_attributes"] = record[association_name];
            delete record[association_name];
          }
        }
        create = [];
        for (index = _k = 0, _len2 = records.length; _k < _len2; index = ++_k) {
          record = records[index];
          if (target = this.find(record._id)) {
            target.assign_attributes(record);
          } else {
            create.push(record);
          }
        }
        this.add.apply(this, create);
        records.splice(0);
        return records.push.apply(records, this);
      });
      reload.done(done);
      reload.fail(fail);
      return reload;
    };
    return plural_association.each = function(callback) {
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
  });
}
