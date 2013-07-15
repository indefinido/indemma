var model, resource;

resource = {
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
    if (word.indexOf('s') === word.length - 1) {
      return word.substring(0, word.length - 1);
    } else {
      return word;
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
    if (this.route && this.route.indexOf('/') !== 0) {
      this.route = "/" + this.route;
    }
    if (this.parent_resource) {
      Object.defineProperty(this, "" + this.parent_resource + "_id", resource.parent_id);
      if (!this.route && this["" + this.parent_resource + "_id"]) {
        this.route = '/' + resource.pluralize(this.parent_resource) + '/' + this["" + this.parent_resource + "_id"] + '/' + resource.pluralize(this.resource);
      }
    }
    if (!this.route) {
      return this.route = '/' + resource.pluralize(this.resource);
    }
  }
};

model = window.model;

model.mix(function(modelable) {
  modelable.record.after_initialize.unshift(resource.initialize);
  return modelable.after_mix.unshift(resource.initialize);
});

model.singularize = resource.singularize;

model.pluralize = resource.pluralize;
