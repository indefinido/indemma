(function() {
  var extend, model, rest, type,
    __slice = [].slice;

  model = window.model;

  extend = require('extend');

  type = require('type');

  model.restfulable = function() {
    var resource;

    resource = {
      save: function() {
        var argument, promise, _i, _len;

        if (!this.dirty) {
          return;
        }
        promise = rest[this._id ? 'put' : 'post'].call(this);
        promise.done(this.saved);
        promise.fail(this.failed);
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          argument = arguments[_i];
          if (type(argument) === 'function') {
            promise.done(argument);
          }
        }
        this.lock = JSON.stringify(this.json());
        return promise;
      },
      saved: function(data) {
        var callback, _i, _len, _ref, _results;

        if (this.lock === JSON.stringify(this.json())) {
          this.dirty = false;
          delete this.lock;
        } else {
          this.save();
        }
        if (this.after_save) {
          _ref = this.after_save;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            throw "Not supported after_save callback: " + callback;
          }
          return _results;
        }
      },
      failed: function() {
        throw "" + this.resource + ".save: Failed to save record: " + this + "\n";
      },
      toString: function() {
        var serialized;

        serialized = {};
        serialized[this.resource] = this.json();
        return JSON.stringify(serialized);
      },
      json: function() {
        var attribute, json, name, value, _i, _len, _ref;

        json = {};
        for (name in this) {
          value = this[name];
          if (!(type(value) !== 'function')) {
            continue;
          }
          if (value == null) {
            continue;
          }
          if (type(value) === 'object') {
            _ref = this.nested_attributes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              attribute = _ref[_i];
              if (attribute === name) {
                json["" + name + "_attributes"] = value.json();
              }
            }
          } else {
            json[name] = value;
          }
        }
        observable.unobserve(json);
        delete json.dirty;
        delete json.resource;
        delete json.route;
        delete json.parent_resource;
        delete json.nested_attributes;
        delete json.on_save;
        delete json.element;
        delete json["default"];
        delete json.lock;
        return json;
      }
    };
    record.mix(function(recordable) {
      return extend(true, recordable, resource);
    });
    return model.associable && model.associable.mix(function(singular_association, plural_association) {
      return plural_association.post = function() {
        if (this.parent != null) {
          this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
        }
        return rest.post.apply(this, arguments);
      };
    });
  };

  rest = {
    put: function() {
      var _ref;

      return (_ref = rest.request).call.apply(_ref, [this, 'put', "" + this.route + "/" + this._id].concat(__slice.call(arguments)));
    },
    post: function() {
      var _ref;

      return (_ref = rest.request).call.apply(_ref, [this, 'post', this.route].concat(__slice.call(arguments)));
    },
    request: function(method, url, data) {
      if (!data) {
        data = {};
        data[this.resource] = this.json();
      }
      return $.ajax({
        url: url,
        data: data,
        type: method,
        context: this
      });
    }
  };

}).call(this);
