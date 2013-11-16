var model, resource, resourceable, stampit;

stampit = require('../../vendor/stampit');

resource = stampit({
  toString: function() {
    return this.name;
  }
}, {
  name: 'unknown',
  scope: null,
  singular: false
}, function() {
  var _base;

  if (this.original_reference) {
    stampit.mixIn(this.original_reference, this);
    this.original_reference.toString = this.toString;
    (_base = this.original_reference).param_name || (_base.param_name = this.name);
    return this.original_reference;
  }
  this.param_name || (this.param_name = this.name);
  return this;
});

resourceable = {
  pluralize: function(word) {
    if (!(word && word.length)) {
      throw new TypeError("Invalid string passed to pluralize '" + word + "'");
    }
    if (word.indexOf('s') !== word.length - 1) {
      return word + 's';
    } else {
      return word;
    }
  },
  singularize: function(word) {
    if (!(word && word.length)) {
      throw new TypeError("Invalid string passed to singularize '" + word + "'");
    }
    if (word.lastIndexOf('s') === word.length - 1) {
      return word.substring(0, word.length - 1);
    } else {
      return word;
    }
  },
  route: {
    get: function() {
      var route;

      if (this.initial_route != null) {
        return this.initial_route;
      }
      if (typeof this.resource === 'string') {
        this.resource = {
          name: this.resource
        };
      }
      route = '/';
      if (this.parent != null) {
        route += "" + this.parent.route + "/" + this.parent._id + "/";
      }
      if (this.resource.scope != null) {
        route += this.resource.scope + '/';
      }
      route += this.resource.singular ? this.resource.name : model.pluralize(this.resource.name);
      this.initial_route = route;
      return route;
    },
    set: function(value) {
      return this.initial_route = value;
    }
  },
  parent_id: {
    get: function() {
      return this[this.parent_resource]._id;
    },
    set: function() {
      return console.error('Warning changing associations throught parent_id not allowed for security and style guide purposes');
    }
  },
  initialize: function() {
    var resource_definition, _ref;

    if (this.parent_resource) {
      Object.defineProperty(this, "" + this.parent_resource + "_id", resourceable.parent_id);
    }
    resource_definition = {};
    if (typeof this.resource === 'string') {
      resource_definition = {
        name: this.resource
      };
    }
    if (typeof this.resource === 'object') {
      this.resource.original_reference = this.resource;
      resource_definition = this.resource;
    }
    resource_definition.parent = this.parent_resource;
    this.resource = resource(resource_definition);
    return (_ref = this.route) != null ? _ref : Object.defineProperty(this, 'route', resourceable.route);
  }
};

model = window.model;

model.mix(function(modelable) {
  modelable.record.after_initialize.unshift(resourceable.initialize);
  return modelable.after_mix.unshift(resourceable.initialize);
});

model.singularize = resourceable.singularize;

model.pluralize = resourceable.pluralize;
