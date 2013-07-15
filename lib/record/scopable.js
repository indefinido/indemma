var $, builders, defaults, extend, merge, model, record, rest, scopable, stampit,
  __slice = [].slice;

require('./restfulable');

require('./resource');

stampit = require('../../vendor/stampit');

extend = require('assimilate');

merge = extend.withStrategy('deep');

$ = require('jquery');

rest = require('./rest');

scopable = {
  builder: stampit().enclose(function() {
    return stampit.mixIn(function(name, type) {
      var builder;

      if ($.type(type) === 'function') {
        this[name] = new type;
        type = $.type(this[name]);
      }
      if ($.type(type) !== 'string') {
        type = $.type(type);
      }
      builder = builders[type];
      if (builder == null) {
        throw "Unknown scope type " + type + " for model with resource " + model.resource;
      }
      return this[name] = builder({
        name: name
      });
    }, {
      data: {},
      then: [],
      fail: [],
      clear: function() {
        this.data = {};
        return this.callbacks = [];
      }
    });
  }),
  base: stampit().state({
    name: 'unamed_scope'
  }),
  record: {},
  model: {
    fetch: function() {
      var callbacks, data;

      data = arguments[0], callbacks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      rest.get.call(this, extend(this.scope.data, data)).done(this.scope.then.concat(callbacks)).fail(this.scope.fail);
      return this.scope.clear();
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
  boolean: stampit().enclose(function() {
    var base;

    base = scopable.base(this);
    return stampit.mixIn(function() {
      var callbacks, value, _base, _name;

      value = arguments[0], callbacks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      callbacks.length && (this.scope.then = this.scope.then.concat(callbacks));
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = value != null ? value : this["$" + name] || defaults.boolean);
      return this;
    });
  }),
  array: stampit().enclose(function() {
    var base;

    base = scopable.base(this);
    return stampit.mixIn(function() {
      var values, _base, _name;

      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = values != null ? values : this["$" + name] || defaults.array);
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
