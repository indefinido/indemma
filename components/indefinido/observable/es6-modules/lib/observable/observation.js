var observation, observationable;

observation = {
  add: function(keypath, callback) {
    return this.observers[keypath].add(callback);
  },
  remove: function(keypath, callback) {
    return this.observers[keypath].remove(callback);
  },
  mute: function(keypath) {
    this.observers[keypath].close();
    return delete this.observers[keypath];
  },
  destroy: function(keypath) {
    var observer, _ref;

    _ref = this.observers;
    for (keypath in _ref) {
      observer = _ref[keypath];
      observer.close();
    }
    return delete this.observers;
  }
};

observationable = function(object) {
  return Object.create(observation, {
    observers: {
      value: {}
    }
  });
};

export default observationable;
