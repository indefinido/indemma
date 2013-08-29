var extend, extensions, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

extend = require('assimilate');

extensions = {
  model: {
    human_attribute_name: function(attribute_name) {
      var _ref, _ref1;

      return ((_ref = this.translation) != null ? (_ref1 = _ref.attributes) != null ? _ref1[attribute_name] : void 0 : void 0) || attribute_name;
    }
  }
};

model.mix(function(modelable) {
  return extend(modelable, extensions.model);
});
