var maid, model;

maid = {
  model: function() {
    if (this.washing != null) {
      return this.record.after_initialize.push(maid.record);
    }
  },
  record: function() {
    return this.subscribe('dirty', function(dirty) {
      var _this = this;

      return dirty && setTimeout(function() {
        return _this.save();
      }, 500);
    });
  }
};

model = window.model;

model.mix(function(modelable) {
  return modelable.after_mix.unshift(maid.model);
});
