var extend, merge, model, record, stampit, storable;

extend = require('assimilate');

merge = extend.withStrategy('deep');

stampit = require('../../vendor/stampit');

storable = stampit({
  store: function(keypath, value, options) {
    var collection, entry, key, _i, _len;

    collection = this.database;
    keypath = keypath.toString().split('.');
    key = keypath.pop();
    for (_i = 0, _len = keypath.length; _i < _len; _i++) {
      entry = keypath[_i];
      collection[entry] || (collection[entry] = {});
      collection = collection[entry];
    }
    if (arguments.length === 1) {
      this.reads++;
      return collection[key];
    } else {
      this.writes++;
      value.sustained || (value.sustained = true);
      return collection[key] = value;
    }
  },
  values: function() {
    return Object.values(this.database);
  }
}, {
  type: 'object',
  writes: 0,
  reads: 0
}, function() {
  this.database || (this.database = {});
  return this;
});

model = window.model;

record = window.record;

model.storable = true;

module.exports = storable;
