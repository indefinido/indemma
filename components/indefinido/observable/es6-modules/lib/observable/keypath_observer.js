import {PathObserver} from '../../vendor/observe-js/observe.js';
import {Callbacks} from 'jquery';
var KeypathObserver,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

KeypathObserver = (function(_super) {
  __extends(KeypathObserver, _super);

  function KeypathObserver(object, keypath) {
    _super.call(this, object, keypath);
    this.callbacks = Callbacks();
    this.open((function() {
      return this.fireWith(object, arguments);
    }), this.callbacks);
  }

  KeypathObserver.prototype.add = function(callback) {
    return this.callbacks.add(callback);
  };

  KeypathObserver.prototype.remove = function() {
    var _ref;

    return (_ref = this.callbacks).remove.apply(_ref, arguments);
  };

  KeypathObserver.prototype.close = function() {
    KeypathObserver.__super__.close.apply(this, arguments);
    this.callbacks.empty();
    return delete this.callbacks;
  };

  return KeypathObserver;

})(PathObserver);

export default KeypathObserver;
