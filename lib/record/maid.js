(function() {
  var maid, model;

  model = window.model;

  model.maid = function() {
    return model.mix(function(modelable) {
      return modelable.after_mix.unshift(maid.model);
    });
  };

  maid = {
    model: function() {
      if (this.washing != null) {
        return this.record.after_initialize.push(maid.record);
      }
    },
    record: function() {
      var self;

      self = this;
      return this.subscribe('dirty', function(prop, dirty) {
        return dirty && setTimeout(function() {
          return self.save();
        }, 500);
      });
    }
  };

}).call(this);
