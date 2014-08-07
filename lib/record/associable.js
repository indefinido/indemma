var $, associable, callbacks, descriptors, extend, model, plural, root, singular,
  __slice = [].slice;

root = window;

$ = require('jquery');

extend = require('assimilate');

require('./resource');

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
    var _name;

    if (data == null) {
      data = {};
    }
    data.parent_resource = this.parent_resource;
    if (this.parent != null) {
      data.route || (data.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource.toString())));
    }
    if (this.route !== data.route && this.route) {
      throw "associable.has_many: cannot redefine route of association " + this.parent_resource + "." + this.resource + " from " + this.route + " to " + data.route;
    }
    data[_name = this.parent_resource] || (data[_name] = this.parent);
    return model[model.singularize(this.resource)](data);
  },
  push: function() {
    console.warn("" + this.resource + ".push is deprecated and will be removed, please use add instead");
    Array.prototype.push.apply(this, arguments);
    return arguments[0];
  },
  length: 0,
  json: function(methods, omissions) {
    var record, _i, _len, _results;

    _results = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      record = this[_i];
      _results.push(record.json(methods, omissions));
    }
    return _results;
  },
  find: function(id) {
    var resource, _i, _len;

    for (_i = 0, _len = this.length; _i < _len; _i++) {
      resource = this[_i];
      if (resource._id === id) {
        return resource;
      }
    }
  },
  filter: Array.prototype.filter || (typeof _ !== "undefined" && _ !== null ? _.filter : void 0)
};

singular = {
  create: function(data) {
    return model[this.resource].create(extend({}, this, data));
  },
  build: function(data) {
    return this.owner[this.resource.toString()] = model[this.resource.toString()](extend({}, this, data));
  }
};

descriptors = {
  belongs_to: {
    resource_id: {
      getter: function() {
        return this.owner.observed[this.resource + '_id'];
      },
      setter: function(resource_id) {
        var association_name, change, current_resource_id, _ref, _ref1;

        association_name = this.resource.toString();
        if (resource_id == null) {
          this.dirty = true;
          this.owner[association_name] = null;
          return resource_id;
        }
        current_resource_id = (_ref = this.owner.observed[association_name]) != null ? _ref._id : void 0;
        if (resource_id !== current_resource_id) {
          this.owner.observed[association_name + '_id'] = resource_id;
          this.owner.observed[association_name] = null;
          if (!Object.observe) {
            if ((_ref1 = this.owner.observation.observers[association_name + '_id']) != null) {
              _ref1.check_();
            }
          } else {
            change = {
              oldValue: current_resource_id,
              type: 'update',
              name: association_name + '_id',
              object: this.owner
            };
            Object.getNotifier(this.owner).notify(change);
          }
        }
        return resource_id;
      }
    },
    resource: {
      getter: function() {
        var associated, associated_id, association_name, resource;

        association_name = this.resource.toString();
        associated = this.owner.observed[association_name];
        associated_id = this.owner.observed[association_name + '_id'];
        if (!(((associated != null ? associated._id : void 0) != null) || associated_id)) {
          return associated || null;
        }
        if (associated != null ? associated.sustained : void 0) {
          return associated;
        }
        resource = model[association_name];
        if (!resource) {
          console.warn("descriptors.belongs_to.resource.getter: associated factory not found for model '" + association_name + "' belonging to '" + this.owner.resource + "'");
          return associated;
        }
        associated = resource.find(associated_id || associated._id);
        if (associated) {
          return this.owner.observed[association_name] = associated;
        }
        associated || (associated = resource({
          _id: associated_id
        }));
        associated.reload();
        return this.owner.observed[association_name] = associated;
      },
      setter: function(associated) {
        var association_name, change, current_value, _ref;

        association_name = this.resource.toString();
        current_value = this.owner.observed[association_name];
        if (current_value === associated) {
          return;
        }
        this.owner.observed[association_name] = associated;
        this.owner.observed[association_name + '_id'] = associated ? associated._id : null;
        if (!Object.observe) {
          if ((_ref = this.owner.observation.observers[association_name]) != null) {
            _ref.check_();
          }
        } else {
          change = {
            oldValue: current_value,
            type: 'update',
            name: association_name,
            object: this.owner
          };
          Object.getNotifier(this.owner).notify(change);
        }
        return associated;
      }
    }
  }
};

callbacks = {
  has_many: {
    nest_attributes: function() {
      var association, association_name, association_names, associations_attributes, message, _i, _len, _results;

      association_names = model[this.resource].has_many;
      if (association_names) {
        _results = [];
        for (_i = 0, _len = association_names.length; _i < _len; _i++) {
          association_name = association_names[_i];
          associations_attributes = this["" + association_name + "_attributes"];
          association = this[model.pluralize(association_name)];
          if (associations_attributes && associations_attributes.length) {
            if (!association) {
              message = "has_many.nest_attributes: Association not found for " + association_name + ". \n";
              message += "did you set it on model declaration? \n  has_many: " + association_name + " ";
              throw message;
            }
            association.resource = model.singularize(association.resource);
            association.add.apply(association, associations_attributes);
            association.resource = model.pluralize(association.resource);
          }
          _results.push(delete this["" + association_name + "_attributes"]);
        }
        return _results;
      }
    },
    update_association: function(data) {
      var associated, association, association_name, id, pluralized_association, _i, _j, _len, _len1, _ref;

      id = this._id || data && (data._id || data.id);
      if (!id) {
        return;
      }
      _ref = model[this.resource.toString()].has_many;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        association_name = _ref[_i];
        pluralized_association = model.pluralize(association_name);
        association = this[pluralized_association];
        if (!association.route) {
          association.route = "/" + (model.pluralize(this.resource.toString())) + "/" + id + "/" + (model.pluralize(association.resource));
          for (_j = 0, _len1 = association.length; _j < _len1; _j++) {
            associated = association[_j];
            if (!associated.route && (associated.parent != null)) {
              associated.route = "/" + (model.pluralize(this.resource.toString())) + "/" + id + "/" + (model.pluralize(association.resource));
            }
          }
        }
      }
      return true;
    },
    autosave: function() {
      throw 'Not implemented yet';
    }
  },
  has_one: {
    nest_attributes: function() {
      var association_name, association_names, associations_attributes, _i, _len, _results;

      association_names = model[this.resource].has_one;
      if (association_names) {
        _results = [];
        for (_i = 0, _len = association_names.length; _i < _len; _i++) {
          association_name = association_names[_i];
          associations_attributes = this["" + association_name + "_attributes"];
          if (associations_attributes) {
            this[association_name] = this["build_" + association_name](associations_attributes);
            _results.push(delete this["" + association_name + "_attributes"]);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  }
};

associable = {
  model: {
    blender: function(definition) {
      var model;

      model = associable.model;
      this.create_after_hooks = model.create_after_hooks;
      this.create_before_hooks = model.create_before_hooks;
      if (this.has_many && $.type(this.has_many) !== 'array') {
        this.has_many = [this.has_many];
      }
      if (this.has_one && $.type(this.has_one) !== 'array') {
        this.has_one = [this.has_one];
      }
      if (this.belongs_to && $.type(this.belongs_to) !== 'array') {
        this.belongs_to = [this.belongs_to];
      }
      this.has_many || (this.has_many = []);
      this.has_one || (this.has_one = []);
      this.belongs_to || (this.belongs_to = []);
      return true;
    },
    create_after_hooks: function(definition) {
      var association_attributes, association_name, association_proxy, old_dirty, old_resource_id, options, resource, _i, _j, _k, _len, _len1, _len2, _name, _ref, _ref1, _ref2, _results;

      options = model[this.resource.name || this.resource.toString()];
      if (options.has_many) {
        _ref = options.has_many;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resource = _ref[_i];
          association_proxy = {
            resource: resource,
            parent_resource: this.resource,
            parent: this
          };
          association_name = model.pluralize(resource);
          association_attributes = this[association_name] || [];
          this[_name = "" + association_name + "_attributes"] || (this[_name] = []);
          if (association_attributes.length) {
            this["" + association_name + "_attributes"] = this["" + association_name + "_attributes"].concat(association_attributes);
          }
          this[association_name] = $.extend(association_proxy, plural);
        }
        this.after('saved', callbacks.has_many.update_association);
        callbacks.has_many.nest_attributes.call(this);
      }
      if (options.has_one) {
        _ref1 = options.has_one;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          resource = _ref1[_j];
          association_proxy = {
            resource: resource,
            parent_resource: this.resource,
            owner: this
          };
          association_proxy[this.resource.toString()] = this;
          this["build_" + resource] = $.proxy(singular.build, association_proxy);
          this["create_" + resource] = $.proxy(singular.create, association_proxy);
          this["" + association_name + "_attributes"] = $.extend(this[association_name], this["" + association_name + "_attributes"]);
        }
        callbacks.has_one.nest_attributes.call(this);
      }
      if (options.belongs_to) {
        _ref2 = options.belongs_to;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          resource = _ref2[_k];
          association_proxy = {
            resource: resource,
            parent_resource: this.resource,
            parent: this,
            owner: this
          };
          association_proxy[this.resource.toString()] = this;
          this["build_" + resource] = $.proxy(singular.build, association_proxy);
          this["create_" + resource] = $.proxy(singular.create, association_proxy);
          old_resource_id = this["" + resource + "_id"];
          old_dirty = this.dirty;
          this["" + resource + "_id"] = null;
          Object.defineProperty(this, "" + resource + "_id", {
            get: $.proxy(descriptors.belongs_to.resource_id.getter, association_proxy),
            set: $.proxy(descriptors.belongs_to.resource_id.setter, association_proxy),
            configurable: true
          });
          this["" + resource + "_id"] = old_resource_id;
          _results.push(this.dirty = old_dirty);
        }
        return _results;
      }
    },
    create_before_hooks: function(record) {
      var association_proxy, definition, old_resource, resource, _i, _len, _ref, _results;

      definition = this;
      if (definition.belongs_to) {
        _ref = definition.belongs_to;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          resource = _ref[_i];
          association_proxy = {
            resource: resource,
            parent_resource: this.resource,
            owner: record
          };
          old_resource = record[resource];
          Object.defineProperty(record, resource.toString(), {
            get: $.proxy(descriptors.belongs_to.resource.getter, association_proxy),
            set: $.proxy(descriptors.belongs_to.resource.setter, association_proxy),
            configurable: true
          });
          _results.push(record.after_initialize.push((function() {
            return this[resource] = old_resource;
          })));
        }
        return _results;
      }
    }
  },
  record: {
    after_initialize: function(attributes) {
      if (this.resource == null) {
        throw new Error('resource must be defined in order to associate');
      }
      return model[this.resource.name || this.resource.toString()].create_after_hooks.call(this);
    },
    before_initialize: function(creation) {
      if (!this.resource) {
        throw new Error('resource must be defined in order to associate');
      }
      return model[this.resource.name || this.resource.toString()].create_before_hooks(creation);
    }
  }
};

model = root.model;

model.mix(function(modelable) {
  modelable.after_mix.push(associable.model.blender);
  modelable.record.before_initialize.push(associable.record.before_initialize);
  return modelable.record.after_initialize.push(associable.record.after_initialize);
});

model.associable = {
  mix: function(blender) {
    return blender(singular, plural);
  }
};
