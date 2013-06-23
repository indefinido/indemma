var root;

root = typeof exports !== "undefined" && exports !== null ? exports : this;

model.rivets = function() {
  var model_extensions;

  model_extensions = {
    record: {
      tie: function(element) {
        var lasso;

        lasso = {};
        lasso[this.resource] = this;
        return rivets.bind(element, lasso);
      }
    },
    preloadData: true
  };
  return model.mix(function(modelable) {
    return $.extend(true, modelable, model_extensions);
  });
};
