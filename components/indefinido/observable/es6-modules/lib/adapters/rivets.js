exports.adapter = {
  subscribe: function(record, attribute_path, callback) {
    if (record == null) {
      throw new TypeError('observable.adapters.rivets.subscribe: No record provided for subscription');
    }
    if (attribute_path) {
      return record.subscribe(attribute_path, callback);
    }
  },
  unsubscribe: function(record, attribute_path, callback) {
    if (record == null) {
      throw new TypeError('observable.adapters.rivets.unsubscribe: No record provided for subscription');
    }
    return record.unsubscribe(attribute_path, callback);
  },
  read: function(record, attribute_path) {
    if (record == null) {
      throw new TypeError('observable.adapters.rivets.read: No record provided for subscription');
    }
    return record[attribute_path];
  },
  publish: function(record, attribute_path, value) {
    if (record == null) {
      throw new TypeError('observable.adapters.rivets.publish: No record provided for subscription');
    }
    return record[attribute_path] = value;
  }
};
