var validator;

model.validators = function() {
  return model.mix(function(modelable) {
    return modelable.after_mix.unshift(validator.model);
  });
};

validator = {
  model: function() {},
  record: function() {}
};
