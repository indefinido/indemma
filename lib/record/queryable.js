var extend, model, queryable, record, stampit, storable;

extend = require('assimilate');

storable = require('./storable');

stampit = require('../../vendor/stampit');

queryable = {
  storage: storable(),
  find: function(key) {
    if (!key) {
      throw new TypeError("InvalidFind: " + (this.resource.toString()) + ".find was called with a falsey value");
    }
    return this.storage.store(key);
  },
  every: function(callback) {
    return callback(this.storage.values());
  },
  where: function() {
    throw new Error('queryable.where: Not implemented yet');
  }
};

model = window.model;

record = window.record;

model.queryable = true;

module.exports = queryable;

model.mix(function(modelable) {
  return extend(modelable, queryable);
});
