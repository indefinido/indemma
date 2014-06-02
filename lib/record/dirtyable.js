'use strict';
var dirtyable, model, record;

dirtyable = {
  ignores: ['dirty', 'resource', 'route', 'initial_route', 'after_initialize', 'before_initialize', 'parent_resource', 'nested_attributes', 'reloading', 'ready', 'saving', 'salvation', 'sustained', 'element', 'default', 'lock', 'validated', 'validation', 'errors', 'dirty'],
  change: function(name) {
    return dirtyable.ignores.indexOf(name) === -1;
  },
  descriptor: {
    get: function() {
      return this.observed.dirty;
    },
    set: function(value) {
      return this.observed.dirty = value;
    }
  },
  record: {
    after_initialize: function() {
      Object.defineProperty(this, 'dirty', dirtyable.descriptor);
      this.observed.dirty = !!this._id;
      return this.subscribe(function(added, removed, changed, past) {
        return this.dirty || (this.dirty = !!Object.keys(changed).filter(dirtyable.change).length);
      });
    }
  }
};

model = window.model;

record = window.record;

model.dirtyable = true;

record.mix(function(recordable) {
  return recordable.after_initialize.push(dirtyable.record.after_initialize);
});

model.mix(function(modelable) {});

export default dirtyable;
