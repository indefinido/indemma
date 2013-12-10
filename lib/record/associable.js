var $, associable, callbacks, extend, model, modifiers, plural, root, singular, subscribers,
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
    return Array.prototype.push.apply(this, arguments);
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
  }
};

singular = {
  create: function(data) {
    return model[this.resource].create(extend({}, this, data));
  },
  build: function(data) {
    return this.owner[this.resource.toString()] = model[this.resource.toString()](extend({}, this, data));
  }
};

subscribers = {
  belongs_to: {
    foreign_key: function(resource_id) {
      var associated, association_name, current_resource_id, resource, _ref;

      association_name = this.resource.toString();
      if (resource_id === null || resource_id === void 0) {
        this.dirty = true;
        this.owner[association_name] = resource_id;
        return resource_id;
      }
      current_resource_id = (_ref = this.owner[association_name]) != null ? _ref._id : void 0;
      if (resource_id !== current_resource_id) {
        resource = model[association_name];
        if (!resource) {
          console.warn("subscribers.belongs_to.foreign_key: associated factory not found for model: " + association_name);
          return resource_id;
        }
        associated = resource.find(resource_id);
        associated || (associated = resource({
          _id: resource_id
        }));
        this.owner.observed[association_name] = associated;
      }
      return resource_id;
    },
    associated_changed: function(associated) {
      return this.owner.observed["" + (this.resource.toString()) + "_id"] = associated ? associated._id : null;
    }
  }
};

modifiers = {
  belongs_to: {
    associated_loader: function() {
      var association_name,
        _this = this;

      association_name = this.resource.toString();
      return Object.defineProperty(this.owner, association_name, {
        set: function(associated) {
          return this.observed[association_name] = associated;
        },
        get: function() {
          var associated, associated_id, resource;

          associated = _this.owner.observed[association_name];
          associated_id = _this.owner.observed[association_name + '_id'];
          if (!(((associated != null ? associated._id : void 0) != null) || associated_id)) {
            return associated;
          }
          if (associated != null ? associated.sustained : void 0) {
            return associated;
          }
          resource = model[association_name];
          if (!resource) {
            console.warn("subscribers.belongs_to.foreign_key: associated factory not found for model: " + association_name);
            return associated;
          }
          associated = resource.find(associated_id || associated._id);
          associated || (associated = resource({
            _id: associated_id
          }));
          resource.storage.store(associated._id, associated);
          associated.reload();
          return _this.owner.observed[association_name] = associated;
        },
        configurable: true,
        enumerable: true
      });
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
          if (associations_attributes && associations_attributes.length) {
            association = this[model.pluralize(association_name)];
            if (!association) {
              message = "has_many.nest_attributes: Association not found for " + association_name + ". \n";
              message += "did you set it on model declaration? \n  has_many: " + association_name + " ";
              throw message;
            }
            association.resource = model.singularize(association.resource);
            association.add.apply(association, associations_attributes);
            _results.push(association.resource = model.pluralize(association.resource));
          } else {
            _results.push(void 0);
          }
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
      var association_name, association_proxy, old_resource_id, options, resource, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;

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
          this["" + resource + "_id"] = null;
          this.subscribe("" + resource + "_id", $.proxy(subscribers.belongs_to.foreign_key, association_proxy));
          this.subscribe(resource.toString(), $.proxy(subscribers.belongs_to.associated_changed, association_proxy));
          this.resource_id = old_resource_id;
          if (this["" + resource + "_id"] && !this[resource]) {
            _results.push(this.publish("" + resource + "_id", this["" + resource + "_id"]));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    create_before_hooks: function(record) {
      var association_proxy, definition, resource, _i, _len, _ref, _results;

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
          _results.push(modifiers.belongs_to.associated_loader.call(association_proxy));
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
