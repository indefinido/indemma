var composed, remoteable, rest, root, stampit, validations;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

validations = require('../validatable');

rest = require('../rest');

stampit = require('../../../vendor/stampit');

remoteable = stampit({
  validate_each: function(record, attribute, value) {
    var data,
      _this = this;

    data = this.json(record);
    return this.post(data).done(function(json) {
      return _this.succeeded(json, record);
    });
  },
  json: function(record) {
    var data, _base;

    data = {};
    data[this.resource] = record.json();
    (_base = data[this.resource]).id || (_base.id = data[this.resource]._id);
    delete data[this.resource]._id;
    return data;
  },
  post: function(data) {
    return jQuery.ajax({
      url: this.route,
      data: data,
      type: 'post',
      dataType: 'json',
      context: this
    });
  },
  succeeded: function(json, record) {
    var error_message, error_messages, _i, _len, _results;

    error_messages = json[this.attribute_name];
    if (!error_messages) {
      return;
    }
    _results = [];
    for (_i = 0, _len = error_messages.length; _i < _len; _i++) {
      error_message = error_messages[_i];
      _results.push(record.errors.add(this.attribute_name, 'server', {
        server_message: error_message
      }));
    }
    return _results;
  }
}, {
  message: "Remote validation failed",
  route: null
}, function() {
  var pluralized_resource;

  pluralized_resource = model.pluralize(this.model.resource);
  this.resource = this.model.resource;
  this.route || (this.route = "/" + pluralized_resource + "/validate");
  return this;
});

composed = stampit.compose(validations.validatable, remoteable);

composed.definition_key = 'validates_remotely';

validations.manager.validators.remote = composed;
