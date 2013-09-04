var $, advisable, bind, extend, merge, observable, type,
  __slice = [].slice;

$ = require('jquery');

type = require('type');

bind = require('bind');

observable = require('observable').mixin;

advisable = require('advisable').mixin;

extend = require('assimilate');

merge = require('assimilate').withStrategy('deep');

this.model = (function() {
  var initialize_record, mixer, modelable;

  modelable = {
    after_mix: [],
    record: {
      after_initialize: []
    },
    all: function() {
      return this.cache;
    },
    create: function() {
      var params;

      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      throw 'model.create not implemented yet, try using the restful.model.create method';
    },
    find: function(id) {
      return this.where({
        id: id
      }, true);
    },
    where: function(conditions, first) {
      var record, results, _i, _len, _ref;

      if (first == null) {
        first = false;
      }
      results = [];
      if (type(conditions.id) !== 'array') {
        conditions.id = [conditions.id];
      }
      _ref = this.cache;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        if (conditions.id.indexOf(record._id) !== -1) {
          if (first) {
            return record;
          } else {
            results.push(record);
          }
        }
      }
      if (first) {
        return null;
      } else {
        return results;
      }
    }
  };
  initialize_record = function(data) {
    var after_initialize, callback, instance, _i, _len, _ref;

    if (data == null) {
      data = {
        resource: this.resource,
        parent_resource: this.parent_resource
      };
    }
    data.resource || (data.resource = this.resource);
    data.parent_resource || (data.parent_resource = this.resource.parent || this.parent_resource);
    data.route || (data.route = this.route);
    data.nested_attributes = this.nested_attributes || [];
    after_initialize = (data.after_initialize || []).concat(this.record.after_initialize);
    instance = record.call(extend(Object.create(data), this.record, {
      after_initialize: after_initialize
    }));
    _ref = instance.after_initialize;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      callback.call(instance, instance);
    }
    delete instance.after_initialize;
    return instance;
  };
  mixer = function(options) {
    var after_initialize, callback, instance, _i, _len, _ref;

    if (this === window) {
      throw 'Model mixin called incorrectly call with model.call {} instead of model({})';
    }
    if (!mixer.stale) {
      mixer.stale = true;
    }
    if (this.record && this.record.after_initialize) {
      after_initialize = this.record.after_initialize.splice(0);
    } else {
      after_initialize = [];
    }
    instance = bind(this, initialize_record);
    extend(instance, merge(this, modelable));
    this.record = instance.record = merge({}, instance.record, modelable.record);
    this.record.after_initialize = instance.record.after_initialize = instance.record.after_initialize.concat(after_initialize);
    _ref = modelable.after_mix;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      callback.call(instance, instance);
    }
    return mixer[this.resource.name || this.resource.toString()] = instance;
  };
  mixer.mix = function(blender) {
    if (this.stale) {
      throw "Trying to change model mixin with " + object + " but model already used.\nCheck your configuration order";
    }
    return blender(modelable);
  };
  return mixer;
})();

this.record = (function() {
  var callbacks, recordable, that;

  callbacks = {
    dirtify: function() {
      return this.subscribe(function(prop, value, old) {
        if (prop !== 'dirty' && !this.dirty && value !== old) {
          console.groupCollapsed("◉ Property '" + prop + "' dirtied a " + this.resource);
          console.log(old, "→", value);
          console.log(this);
          console.groupEnd();
          return this.dirty = true;
        }
      });
    }
  };
  recordable = {
    dirty: false,
    after_initialize: [callbacks.dirtify]
  };
  that = function(data) {
    var after_initialize;

    if (this === window) {
      throw "Mixin called incorrectly, call mixin with call method: record.call(object, data)";
    }
    data || (data = {});
    after_initialize = (this.after_initialize || []).concat(data.after_initialize || []).concat(recordable.after_initialize);
    return advisable(observable(extend(this, recordable, data, {
      after_initialize: after_initialize
    })));
  };
  that.mix = function(blender) {
    return blender(recordable);
  };
  return that;
})();

exports.record = this.record;

exports.model = this.model;
