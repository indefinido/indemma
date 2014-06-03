var descriptors, model, resource, resourceable, stampit;

stampit = require('../../vendor/stampit');

require('../../vendor/owl/pluralize');

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

descriptors = {
  route: {
    get: function() {
      var route;

      if (typeof this.resource === 'string') {
        this.resource = {
          name: this.resource
        };
      }
      route = '/';
      if (this.parent != null) {
        route += ("" + this.parent.route + "/" + this.parent._id) + "/";
      }
      if (this.resource.scope != null) {
        route += this.resource.scope + '/';
      }
      route += this.resource.singular ? this.resource.name : model.pluralize(this.resource.name);
      return this.route = route;
    },
    configurable: true
  }
};

resourceable = {
  pluralize: function(word, count, plural) {
    if (!(word && word.length)) {
      throw new TypeError("Invalid string passed to pluralize '" + word + "'");
    }
    if (word.indexOf('s') !== word.length - 1) {
      return owl.pluralize(word, count, plural);
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
  initialize: function() {
    var resource_definition, _ref;

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
    return (_ref = this.route) != null ? _ref : Object.defineProperty(this, 'route', descriptors.route);
  }
};

model = window.model;

model.mix(function(modelable) {
  modelable.record.after_initialize.unshift(resourceable.initialize);
  return modelable.after_mix.unshift(resourceable.initialize);
});

model.singularize = resourceable.singularize;

model.pluralize = resourceable.pluralize;
