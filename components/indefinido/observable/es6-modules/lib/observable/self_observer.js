import {ObjectObserver} from '../../vendor/observe-js/observe.js';
import {Callbacks} from 'jquery';
var SelfObserver,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SelfObserver = (function(_super) {
  __extends(SelfObserver, _super);

  function SelfObserver(object) {
    _super.call(this, object);
    this.callbacks = Callbacks();
    this.open((function() {
      return this.fireWith(object, arguments);
    }), this.callbacks);
  }

  SelfObserver.prototype.add = function(callback) {
    return this.callbacks.add(callback);
  };

  SelfObserver.prototype.remove = function() {
    var _ref;

    return (_ref = this.callbacks).remove.apply(_ref, arguments);
  };

  SelfObserver.prototype.close = function() {
    SelfObserver.__super__.close.apply(this, arguments);
    this.callbacks.empty();
    return delete this.callbacks;
  };

  return SelfObserver;

})(ObjectObserver);

export default SelfObserver;
