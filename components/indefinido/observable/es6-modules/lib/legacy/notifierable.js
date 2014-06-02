import jQuery from 'jquery';
var mutations, notifierable, subscribed_getter;

notifierable = {
  observe: function(object, keypath, callback) {
    return Object.defineProperty(object, keypath, {
      get: this.getter(object, keypath),
      set: this.setter(object, keypath, callback),
      enumerable: true
    });
  },
  storage_for: function(object) {
    var toJSON;

    toJSON = void 0;
    Object.defineProperty(object, "observed", {
      configurable: true,
      enumerable: false,
      value: {}
    });
    toJSON = object.json || object.toJSON;
    if (toJSON) {
      return Object.defineProperty(object, "toJSON", {
        enumerable: false,
        value: function() {
          var json;

          json = void 0;
          json = toJSON.apply(this, arguments);
          return observable.unobserve(_.omit(json, observable.ignores, ["toJSON", "observed"]));
        }
      });
    }
  },
  setter: function(object, keypath, callback) {
    var current, old_setter, setter, thread;

    setter = lookup.setter.call(object, keypath);
    this.observed[keypath] = lookup.getter.call(object, keypath) && lookup.getter.call(object, keypath)() || object[keypath];
    if (!setter) {
      setter = function(value) {
        return check.call(object, keypath, value) !== false && setter.callback_thread.call(object, value);
      };
    } else if (!setter.callback_thread) {
      old_setter = setter;
      setter = function(value) {
        return check.call(object, keypath, value) !== false && setter.callback_thread.call(object, value);
      };
      setter.callback_thread = old_setter;
    }
    current = setter.callback_thread || $.noop;
    setter.callback_thread = thread = function(value) {
      return current.call(object, value) !== false && callback.call(object, value);
    };
    if (requiresDomElement) {
      this.observed[keypath + "_setter"] = setter;
    }
    return setter;
  },
  getter: subscribed_getter = function(object, keypath) {
    var getter, root_getter;

    getter = lookup.getter.call(object, keypath) || (root_getter = function() {
      return object.observed[keypath];
    });
    if (requiresDomElement) {
      this.observed[keypath + "_getter"] = getter;
    }
    return getter;
  },
  mutations: function(keypath) {
    var array, setter;

    setter = lookup.setter.call(this, keypath);
    array = this[keypath];
    if (!setter) {
      this.observe.call(this, keypath, function(new_array) {
        var i, j, type;

        i = void 0;
        type = void 0;
        j = void 0;
        if ($.type(new_array) !== "array") {
          return;
        }
        if (new_array.object === array.object && new_array.thread === array.thread) {
          return;
        }
        i = new_array.length;
        j = new_array.length;
        new_array.thread = array.thread;
        new_array.object = array.object;
        new_array.key = keypath;
        while (i--) {
          type = $.type(new_array[i]);
          if (!new_array[i].observed && (type === "object" || type === "array")) {
            new_array[i] = observable(new_array[i]);
          }
        }
        new_array.length = j;
        $.extend(new_array, mutations.overrides);
      });
      setter = lookup.setter.call(this, keypath);
    }
    array.thread = setter.callback_thread;
    array.object = this;
    array.key = keypath;
    $.extend(array, mutations.overrides);
    if (!this.observed.mutate) {
      this.observed.mutate = mutations.mutate;
    }
  }
};

mutations = {
  mutate: function(thread, method, array) {
    array.method = method;
    thread.call(this, array);
    this.publish(array.key, array);
    delete array.method;
  },
  overrides: {
    push: function() {
      var i, operation;

      i = arguments.length;
      operation = void 0;
      while (i--) {
        !arguments[i].observed && $.type(arguments[i]) === "object" && (arguments[i] = observable(arguments[i]));
      }
      operation = Array.prototype.push.apply(this, arguments);
      this.object.observed.mutate.call(this.object, this.thread, "push", this);
      return operation;
    }
  }
};

jQuery("pop shift unshift".split(" ")).each(function(i, method) {
  return mutations.overrides[method] = function() {
    Array.prototype[method].apply(this, arguments);
    return this.object.observed.mutate.call(this.object, this.thread, method, this);
  };
});

export default notifierable;
