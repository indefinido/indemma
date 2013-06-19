(function() {
  var model, resource;

  model = window.model;

  model.resourceable = function() {
    model.mix(function(modelable) {
      modelable.record.after_initialize.unshift(resource.initialize);
      return modelable.after_mix.unshift(resource.initialize);
    });
    return model.pluralize = resource.pluralize;
  };

  resource = {
    pluralize: function(word) {
      return word + 's';
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

}).call(this);
