var handlers, model, persistable, record;

require('./queryable');

handlers = {
  store_after_saved: function() {
    var storage;

    storage = model[this.resource.toString()].storage;
    if (this._id) {
      return storage.store(this._id, this);
    }
  }
};

persistable = {
  record: {
    after_initialize: function() {
      return this.after('saved', handlers.store_after_saved);
    }
  }
};

model = window.model;

record = window.record;

model.persistable = true;

model.mix(function(modelable) {
  return modelable.record.after_initialize.push(persistable.record.after_initialize);
});
