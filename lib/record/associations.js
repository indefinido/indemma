var associable, model, plural, singular,
  __slice = [].slice;

plural = {
  add: function() {
    var attributes, params, _i, _len, _results;

    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      attributes = params[_i];
      _results.push(this.push(this.build(attributes)));
    }
    return _results;
  },
  create: function() {
    var attributes, params, record, _i, _len, _results;

    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      attributes = params[_i];
      record = this.build(attributes);
      this.push(record);
      _results.push(record.save());
    }
    return _results;
  },
  build: function(data) {
    if (data == null) {
      data = {};
    }
    data.parent_resource = this.parent_resource;
    if (this.parent != null) {
      data.route || (data.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
    }
    if (this.route !== data.route && this.route) {
      throw "associable.has_many: cannot redefine route of association " + this.parent_resource + "." + this.resource + " from " + this.route + " to " + data.route;
    }
    return model[this.resource](data);
  },
  push: Array.prototype.push,
  length: 0
};

singular = {
  create: function(data) {
    return model[this.resource].create($.extend({}, this, data));
  },
  build: function(data) {
    return model[this.resource]($.extend({}, this, data));
  }
};

associable = {
  model: function(options) {
    var callbacks;

    if (this.resource == null) {
      console.error('resource must be defined in order to associate');
    }
    callbacks = {
      has_many: {
        nest_attributes: function() {
          var association, association_name, association_names, message, _i, _len, _results;

          association_names = model[this.resource].has_many;
          if (association_names) {
            _results = [];
            for (_i = 0, _len = association_names.length; _i < _len; _i++) {
              association_name = association_names[_i];
              if (this["" + association_name + "_attributes"]) {
                association = this[model.pluralize(association_name)];
                if (!association) {
                  message = "has_many.nest_attributes: Association not found for " + association_name + ". \n";
                  message += "did you set it on model declaration? \n  has_many: " + association_name + " ";
                  throw message;
                }
                _results.push(association.add(this["" + association_name + "_attributes"]));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        },
        update_association: function(data) {
          var associated, association, association_name, id, pluralized_association, _i, _j, _len, _len1, _ref;

          id = this._id || data._id || data.id;
          if (!id) {
            return;
          }
          _ref = model[this.resource].has_many;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            association_name = _ref[_i];
            pluralized_association = model.pluralize(association_name);
            association = this[pluralized_association];
            if (!association.route) {
              association.route = "/" + this.resource + "/" + id + "/" + association.resource;
              for (_j = 0, _len1 = association.length; _j < _len1; _j++) {
                associated = association[_j];
                if (!associated.route && (associated.parent != null)) {
                  associated.route = "/" + this.resource + "/" + id + "/" + association.resource;
                }
              }
            }
          }
          return true;
        },
        autosave: function() {
          return this.save();
        }
      }
    };
    if ($.type(this.has_many) !== 'array') {
      this.has_many = [this.has_many];
    }
    if ($.type(this.has_one) !== 'array') {
      this.has_one = [this.has_one];
    }
    if ($.type(this.belongs_to) !== 'array') {
      this.belongs_to = [this.belongs_to];
    }
    return this.create_associations = function() {
      var association_proxy, resource, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;

      if (options.has_many) {
        if ($.type(options.has_many) !== 'array') {
          options.has_many = [options.has_many];
        }
        _ref = options.has_many;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resource = _ref[_i];
          association_proxy = {
            resource: resource,
            parent_resource: this.resource,
            parent: this
          };
          this[model.pluralize(resource)] = $.extend(association_proxy, plural);
        }
        this.after('saved', callbacks.has_many.update_association);
        callbacks.has_many.nest_attributes.call(this);
      }
      if (options.has_one) {
        if ($.type(options.has_one) !== 'array') {
          options.has_one = [options.has_one];
        }
        _ref1 = options.has_one;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          resource = _ref1[_j];
          association_proxy = {
            resource: resource,
            parent_resource: this.resource
          };
          association_proxy[this.resource] = this;
          this["build_" + resource] = $.proxy(singular.build, association_proxy);
          this["create_" + resource] = $.proxy(singular.create, association_proxy);
        }
      }
      if (options.belongs_to) {
        if ($.type(options.belongs_to) !== 'array') {
          options.belongs_to = [options.belongs_to];
        }
        _ref2 = options.belongs_to;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          resource = _ref2[_k];
          association_proxy = {
            resource: resource,
            parent_resource: this.resource
          };
          association_proxy[this.resource] = this;
          this["build_" + resource] = $.proxy(singular.build, association_proxy);
          _results.push(this["create_" + resource] = $.proxy(singular.create, association_proxy));
        }
        return _results;
      }
    };
  },
  record: function(options) {
    if (this.resource == null) {
      console.error('resource must be defined in order to associate');
    }
    return model[this.resource].create_associations.call(this);
  }
};

model = window.model;

model.mix(function(modelable) {
  modelable.after_mix.unshift(associable.model);
  return modelable.record.after_initialize.unshift(associable.record);
});