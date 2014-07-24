'use strict';
var dirtyable, model, record;

dirtyable = {
  ignores: ['dirty', 'resource', 'route', 'initial_route', 'after_initialize', 'before_initialize', 'parent_resource', 'nested_attributes', 'reloading', 'ready', 'saving', 'salvation', 'sustained', 'element', 'default', 'lock', 'validated', 'validation', 'errors', 'dirty'],
  reserved_filter: function(name) {
    return this.ignores.indexOf(name) === -1;
  },
  record: {
    after_initialize: [
      function() {
        return this.subscribe(function(added, removed, changed, past) {
          return this.dirty || (this.dirty = !!Object.keys($.extend({}, added, removed, changed)).filter(dirtyable.reserved_filter, dirtyable).length);
        });
      }
    ]
  }
};

if (!Object.observe) {
  $.extend(dirtyable, {
    descriptor: {
      get: function() {
        return this.observed.dirty;
      },
      set: function(value) {
        this.observed.dirty = value;
        this.observation.scheduler.schedule();
        return value;
      }
    }
  });
  dirtyable.record.after_initialize.push(function() {
    return Object.defineProperty(this, 'dirty', dirtyable.descriptor);
  });
}

dirtyable.record.after_initialize.push(function() {
  return this.dirty = !!this._id;
});

model = window.model;

record = window.record;

model.dirtyable = true;

record.mix(function(recordable) {
  return recordable.after_initialize = recordable.after_initialize.concat(dirtyable.record.after_initialize);
});

model.mix(function(modelable) {});

export default dirtyable;
