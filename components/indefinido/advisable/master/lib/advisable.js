var $, advice, mixin;

$ = require('jquery');

advice = {
  around: function(base, wrapped) {
    return function() {
      var args;

      args = $.makeArray(arguments);
      return wrapped.apply(this, [$.proxy(base, this)].concat(args));
    };
  },
  before: function(base, before) {
    return this.around(base, function() {
      var args, orig;

      args = $.makeArray(arguments);
      orig = args.shift();
      before.apply(this, args);
      return orig.apply(this, args);
    });
  },
  after: function(base, after) {
    return this.around(base, function() {
      var args, orig, res;

      args = $.makeArray(arguments);
      orig = args.shift();
      res = orig.apply(this, args);
      after.apply(this, args);
      return res;
    });
  }
};

mixin = {
  before: function(method, advicer) {
    if (typeof this[method] === 'function') {
      return this[method] = advice.before(this[method], advicer);
    }
    throw new TypeError("Can only advice functions, attribute " + method + " of " + this + " is of type " + (typeof this[method]));
  },
  after: function(method, advicer) {
    if (typeof this[method] === 'function') {
      return this[method] = advice.after(this[method], advicer);
    }
    throw new TypeError("Can only advice functions, attribute " + method + " of " + this + " is of type " + (typeof this[method]));
  },
  around: function(method, advicer) {
    if (typeof this[method] === 'function') {
      return this[method] = advice.around(this[method], advicer);
    }
    throw new TypeError("Can only advice functions, attribute " + method + " of " + this + " is of type " + (typeof this[method]));
  }
};

exports.mixin = function(object) {
  return $.extend(object, mixin);
};
