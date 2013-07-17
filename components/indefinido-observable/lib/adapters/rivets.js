exports.adapter = {
  subscribe: function(record, attribute_path, callback) {
    return record.subscribe(attribute_path, callback);
  },
  unsubscribe: function(record, attribute_path, callback) {
    return record.unsubscribe(attribute_path, callback);
  },
  read: function(record, attribute_path) {
    return record[attribute_path];
  },
  publish: function(record, attribute_path, value) {
    return record[attribute_path] = value;
  }
};
