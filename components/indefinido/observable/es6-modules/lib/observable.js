import './platform.js';
import jQuery          from 'jquery';
import observation     from './observable/observation.js';
import selection       from './observable/selection.js';
import KeypathObserver from './observable/keypath_observer.js';
import SelfObserver    from './observable/self_observer.js';
var observable;

observable = function() {
  var object;

  object = observable.select.apply(this, arguments);
  if (object.observation) {
    return object;
  }
  return jQuery.extend(observable.observe(object), observable.methods);
};

jQuery.extend(observable, {
  select: selection(observable),
  observe: function(object) {
    Object.defineProperty(object, "observation", {
      configurable: true,
      enumerable: false,
      value: observation(object)
    });
    return Object.defineProperty(object, "observed", {
      configurable: true,
      enumerable: false,
      value: {}
    });
  },
  self: function(object) {
    var observer, observers;

    observers = object.observation.observers;
    return observer = observers.self || (observers.self = new SelfObserver(object));
  },
  keypath: function(object, keypath) {
    var observer, observers;

    observers = object.observation.observers;
    return observer = observers[keypath] || (observers[keypath] = new KeypathObserver(object, keypath));
  },
  unobserve: function(object) {
    var name;

    if (!object.observation) {
      return object;
    }
    for (name in observable.methods) {
      delete object[name];
    }
    object.observation.destroy();
    delete object.observation;
    delete object.observed;
    return object;
  },
  methods: {
    subscribe: function(keypath_or_callback, callback) {
      var observer;

      switch (arguments.length) {
        case 1:
          observer = observable.self(this);
          return this.observation.add('self', keypath_or_callback);
        case 2:
          observable.keypath(this, keypath_or_callback);
          return this.observation.add(keypath_or_callback, callback);
      }
    },
    unsubscribe: function(keypath, callback) {
      return this.observation[callback ? 'remove' : 'mute'](keypath, callback);
    },
    publish: function(keypath, value) {
      return this[keypath] = value;
    }
  },
  ignores: []
});

if (!Object.observe) {
  import schedulerable from './legacy/schedulerable.js';
  observable = schedulerable(observable);
}

observable.mixin = observable;

export default observable;
