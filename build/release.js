

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("segmentio-extend/index.js", function(exports, require, module){

module.exports = function extend (object) {
    // Takes an unlimited number of extenders.
    var args = Array.prototype.slice.call(arguments, 1);

    // For each extender, copy their properties on our object.
    for (var i = 0, source; source = args[i]; i++) {
        if (!source) continue;
        for (var property in source) {
            object[property] = source[property];
        }
    }

    return object;
};
});
require.register("component-type/index.js", function(exports, require, module){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});
require.register("component-bind/index.js", function(exports, require, module){

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = [].slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

});


require.register("observable/components/cjohansen-sinon.js/sinon.js", function(exports, require, module){
/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/
/*global module, require, __dirname, document*/
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = (function (buster) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;

    function isDOMNode(obj) {
        var success = false;

        try {
            obj.appendChild(div);
            success = div.parentNode == obj;
        } catch (e) {
            return false;
        } finally {
            try {
                obj.removeChild(div);
            } catch (e) {
                // Remove failed, not much we can do about that
            }
        }

        return success;
    }

    function isElement(obj) {
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }

    function isFunction(obj) {
        return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function mirrorProperties(target, source) {
        for (var prop in source) {
            if (!hasOwn.call(target, prop)) {
                target[prop] = source[prop];
            }
        }
    }

    function isRestorable (obj) {
        return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
    }

    var sinon = {
        wrapMethod: function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function") {
                throw new TypeError("Method wrapper should be function");
            }

            var wrappedMethod = object[property];

            if (!isFunction(wrappedMethod)) {
                throw new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                    property + " as function");
            }

            if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
                throw new TypeError("Attempted to wrap " + property + " which is already wrapped");
            }

            if (wrappedMethod.calledBefore) {
                var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
                throw new TypeError("Attempted to wrap " + property + " which is already " + verb);
            }

            // IE 8 does not support hasOwnProperty on the window object.
            var owned = hasOwn.call(object, property);
            object[property] = method;
            method.displayName = property;

            method.restore = function () {
                // For prototype properties try to reset by delete first.
                // If this fails (ex: localStorage on mobile safari) then force a reset
                // via direct assignment.
                if (!owned) {
                    delete object[property];
                }
                if (object[property] === method) {
                    object[property] = wrappedMethod;
                }
            };

            method.restore.sinon = true;
            mirrorProperties(method, wrappedMethod);

            return method;
        },

        extend: function extend(target) {
            for (var i = 1, l = arguments.length; i < l; i += 1) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop];
                    }

                    // DONT ENUM bug, only care about toString
                    if (arguments[i].hasOwnProperty("toString") &&
                        arguments[i].toString != target.toString) {
                        target.toString = arguments[i].toString;
                    }
                }
            }

            return target;
        },

        create: function create(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        },

        deepEqual: function deepEqual(a, b) {
            if (sinon.match && sinon.match.isMatcher(a)) {
                return a.test(b);
            }
            if (typeof a != "object" || typeof b != "object") {
                return a === b;
            }

            if (isElement(a) || isElement(b)) {
                return a === b;
            }

            if (a === b) {
                return true;
            }

            if ((a === null && b !== null) || (a !== null && b === null)) {
                return false;
            }

            var aString = Object.prototype.toString.call(a);
            if (aString != Object.prototype.toString.call(b)) {
                return false;
            }

            if (aString == "[object Array]") {
                if (a.length !== b.length) {
                    return false;
                }

                for (var i = 0, l = a.length; i < l; i += 1) {
                    if (!deepEqual(a[i], b[i])) {
                        return false;
                    }
                }

                return true;
            }

            var prop, aLength = 0, bLength = 0;

            for (prop in a) {
                aLength += 1;

                if (!deepEqual(a[prop], b[prop])) {
                    return false;
                }
            }

            for (prop in b) {
                bLength += 1;
            }

            return aLength == bLength;
        },

        functionName: function functionName(func) {
            var name = func.displayName || func.name;

            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            if (!name) {
                var matches = func.toString().match(/function ([^\s\(]+)/);
                name = matches && matches[1];
            }

            return name;
        },

        functionToString: function toString() {
            if (this.getCall && this.callCount) {
                var thisValue, prop, i = this.callCount;

                while (i--) {
                    thisValue = this.getCall(i).thisValue;

                    for (prop in thisValue) {
                        if (thisValue[prop] === this) {
                            return prop;
                        }
                    }
                }
            }

            return this.displayName || "sinon fake";
        },

        getConfig: function (custom) {
            var config = {};
            custom = custom || {};
            var defaults = sinon.defaultConfig;

            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
                }
            }

            return config;
        },

        format: function (val) {
            return "" + val;
        },

        defaultConfig: {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        },

        timesInWords: function timesInWords(count) {
            return count == 1 && "once" ||
                count == 2 && "twice" ||
                count == 3 && "thrice" ||
                (count || 0) + " times";
        },

        calledInOrder: function (spies) {
            for (var i = 1, l = spies.length; i < l; i++) {
                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
                    return false;
                }
            }

            return true;
        },

        orderByFirstCall: function (spies) {
            return spies.sort(function (a, b) {
                // uuid, won't ever be equal
                var aCall = a.getCall(0);
                var bCall = b.getCall(0);
                var aId = aCall && aCall.callId || -1;
                var bId = bCall && bCall.callId || -1;

                return aId < bId ? -1 : 1;
            });
        },

        log: function () {},

        logError: function (label, err) {
            var msg = label + " threw exception: "
            sinon.log(msg + "[" + err.name + "] " + err.message);
            if (err.stack) { sinon.log(err.stack); }

            setTimeout(function () {
                err.message = msg + err.message;
                throw err;
            }, 0);
        },

        typeOf: function (value) {
            if (value === null) {
                return "null";
            }
            else if (value === undefined) {
                return "undefined";
            }
            var string = Object.prototype.toString.call(value);
            return string.substring(8, string.length - 1).toLowerCase();
        },

        createStubInstance: function (constructor) {
            if (typeof constructor !== "function") {
                throw new TypeError("The constructor should be a function.");
            }
            return sinon.stub(sinon.create(constructor.prototype));
        },

        restore: function (object) {
            if (object !== null && typeof object === "object") {
                for (var prop in object) {
                    if (isRestorable(object[prop])) {
                        object[prop].restore();
                    }
                }
            }
            else if (isRestorable(object)) {
                object.restore();
            }
        }
    };

    var isNode = typeof module == "object" && typeof require == "function";

    if (isNode) {
        try {
            buster = { format: require("buster-format") };
        } catch (e) {}
        module.exports = sinon;
        module.exports.spy = require("./sinon/spy");
        module.exports.spyCall = require("./sinon/call");
        module.exports.stub = require("./sinon/stub");
        module.exports.mock = require("./sinon/mock");
        module.exports.collection = require("./sinon/collection");
        module.exports.assert = require("./sinon/assert");
        module.exports.sandbox = require("./sinon/sandbox");
        module.exports.test = require("./sinon/test");
        module.exports.testCase = require("./sinon/test_case");
        module.exports.assert = require("./sinon/assert");
        module.exports.match = require("./sinon/match");
    }

    if (buster) {
        var formatter = sinon.create(buster.format);
        formatter.quoteStrings = false;
        sinon.format = function () {
            return formatter.ascii.apply(formatter, arguments);
        };
    } else if (isNode) {
        try {
            var util = require("util");
            sinon.format = function (value) {
                return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
            };
        } catch (e) {
            /* Node, but no util module - would be very old, but better safe than
             sorry */
        }
    }

    return sinon;
}(typeof buster == "object" && buster));

});
require.register("observable/index.js", function(exports, require, module){
module.exports = require('./lib/observable');

});
require.register("observable/lib/observable.js", function(exports, require, module){
(function() {

  // TODO Better keypath support
  this.observable = (function ($) {

	var mixer = function() {
	  return $.extend(this, mixin);
	},

	check = function (keypath, value) {
	  this.observed[keypath] = value;
	  return true;
	},

	// TODO implement Object.getOwnPropertyDescriptor
	lookup = {
	  setter: Object.prototype.__lookupSetter__ || function (property) {
		return this.observed && this.observed[property + '_setter'];
	  },
	  getter: Object.prototype.__lookupGetter__ || function (property) {
		return this.observed && this.observed[property + '_getter'] || lookup.default_getter;
	  },
	  types: {
		'undefined': undefined,
		'null': null,
		'true': true,
		'false': false,
		'NaN': NaN
	  },
	  overrides: [Object.prototype.toString, String.prototype.toString, Array.prototype.toString, Number.prototype.toString],
	  basic_types: [undefined, null],
	  default_getter: function (property) {
		value = this[property] && (this[property].toString.call(this)) || this[property] + '';
		if (value in lookup.types) return lookup.types[value];
		return value;
	  }
	},

	mixin = {
	  subscribe: function observable_subscribe (keypath, callback) {
		if (keypath == 'observed') throw new TypeError('observable.subscribe: cannot observe reserved property observed');
		if (!this.observed) generator.observable_for(this);

		Object.defineProperty(this, keypath, {
		  get: generator.getter.call(this, keypath),
		  set: generator.setter.call(this, keypath, callback)
		});

		if ($.isArray(this[keypath])) generator.mutations.call(this, keypath);
	  },
	  unsubscribe: function (object, keypath, callback) {
		return function() {
		  return console.log(object, keypath, callback);
		};
	  },
	  publish: function observable_publish (keypath, value) {
		return object[keypath] = value;
	  }
	},
	generator = {
	  observable_for: function (object) {
		return Object.defineProperty(object, 'observed', {
		  configurable: true,
		  enumerable: false,
		  value: {}
		});
	  },
	  setter: function subscribed_setter (keypath, callback) {
		var setter = lookup.setter.call(this, keypath), current, getter;

		// Set value
		this.observed[keypath] = lookup.getter.call(this, keypath) && lookup.getter.call(this, keypath)() || this[keypath];

		// First time subscribing
		if (!setter) {
		  setter = function setter (value) {
			check.call(this, keypath, value) !== false && setter.callback_thread.call(this, value);
		  }
		}

		current = setter.callback_thread || $.noop;

		setter.callback_thread = function thread (value) {
		  current.call(this, value) !== false && callback.call(this, value);
		}

		if ($.browser.msie && $.browser.version <= 8) this.observed[keypath + '_setter'] = setter;

		return setter;
	  },
	  getter: function subscribed_getter (keypath) {
		var object = this, getter;

		getter = lookup.getter.call(this, keypath) || function root_getter () {
		  return object.observed[keypath];
		};

		if ($.browser.msie && $.browser.version <= 8) this.observed[keypath + '_getter'] = getter;

		return getter;
	  },
	  mutations: function (keypath) {
        var setter = lookup.setter.call(this, keypath), array = this[keypath];
        // TODO Transform this code to define property
        array.thread = setter.callback_thread;
        array.object = this;

        // Override default array methods
        $.extend(array, mutations.overrides);

        if (!this.observed.mutate) this.observed.mutate = mutations.mutate;
      }
	},
	 mutations = {
      mutate: function (thread, method, array) {
        thread.apply(this, array, method);
      },
      overrides: {}
    };

	if ($.browser.msie && $.browser.version <= 8) {

	  mixer = function() {
//		if (!jQuery.isReady) throw new Error('observable.call: For compatibility reasons, observable can only be called when dom is loaded.');

		var fix = document.createElement('fix');

		if (!jQuery.isReady) $(function () {document.body.appendChild(fix);});
		else document.body.appendChild(fix);

		return $.extend(fix, this, mixin);
	  };

	  (function () {
		var fix = document.createElement('fix'),
		fix_ignores = [], property;

		for (property in fix) {
		  fix_ignores.push(property)
		}

		mixer.fix_ignores = fix_ignores;
	  })();
	}

	mixer.fix_ignores = mixer.fix_ignores || [];

	$('push pop shift unshift'.split(' ')).each(function (i, method) {
      mutations.overrides[method] = function () {
        Array.prototype[method].apply(this, arguments);
        this.object.observed.mutate.call(this.object, this.thread, method, this);
      };
    });

    return mixer;
  })(jQuery);

}).call(this);

});
require.register("observable/lib/adapters/rivets.js", function(exports, require, module){
(function() {
  var exports;

  exports = {
    adapter: {
      subscribe: function(record, attribute_path, callback) {
        return record.subscribe(attribute_path, callback);
      },
      unsubscribe: function(record, attribute_path, callback) {
        return record.unsubscribe(attribute_path, callback);
      },
      read: function(record, attribute_path) {
        return record[attribute_path];
      },
      publish: function(record, attribute_path, value) {
        return record[attribute_path] = value;
      }
    }
  };

}).call(this);

});
require.register("indemma/components/cjohansen-sinon.js/sinon.js", function(exports, require, module){
/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/
/*global module, require, __dirname, document*/
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = (function (buster) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;

    function isDOMNode(obj) {
        var success = false;

        try {
            obj.appendChild(div);
            success = div.parentNode == obj;
        } catch (e) {
            return false;
        } finally {
            try {
                obj.removeChild(div);
            } catch (e) {
                // Remove failed, not much we can do about that
            }
        }

        return success;
    }

    function isElement(obj) {
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }

    function isFunction(obj) {
        return typeof obj === "function" || !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function mirrorProperties(target, source) {
        for (var prop in source) {
            if (!hasOwn.call(target, prop)) {
                target[prop] = source[prop];
            }
        }
    }

    function isRestorable (obj) {
        return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
    }

    var sinon = {
        wrapMethod: function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function") {
                throw new TypeError("Method wrapper should be function");
            }

            var wrappedMethod = object[property];

            if (!isFunction(wrappedMethod)) {
                throw new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                    property + " as function");
            }

            if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
                throw new TypeError("Attempted to wrap " + property + " which is already wrapped");
            }

            if (wrappedMethod.calledBefore) {
                var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
                throw new TypeError("Attempted to wrap " + property + " which is already " + verb);
            }

            // IE 8 does not support hasOwnProperty on the window object.
            var owned = hasOwn.call(object, property);
            object[property] = method;
            method.displayName = property;

            method.restore = function () {
                // For prototype properties try to reset by delete first.
                // If this fails (ex: localStorage on mobile safari) then force a reset
                // via direct assignment.
                if (!owned) {
                    delete object[property];
                }
                if (object[property] === method) {
                    object[property] = wrappedMethod;
                }
            };

            method.restore.sinon = true;
            mirrorProperties(method, wrappedMethod);

            return method;
        },

        extend: function extend(target) {
            for (var i = 1, l = arguments.length; i < l; i += 1) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop];
                    }

                    // DONT ENUM bug, only care about toString
                    if (arguments[i].hasOwnProperty("toString") &&
                        arguments[i].toString != target.toString) {
                        target.toString = arguments[i].toString;
                    }
                }
            }

            return target;
        },

        create: function create(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        },

        deepEqual: function deepEqual(a, b) {
            if (sinon.match && sinon.match.isMatcher(a)) {
                return a.test(b);
            }
            if (typeof a != "object" || typeof b != "object") {
                return a === b;
            }

            if (isElement(a) || isElement(b)) {
                return a === b;
            }

            if (a === b) {
                return true;
            }

            if ((a === null && b !== null) || (a !== null && b === null)) {
                return false;
            }

            var aString = Object.prototype.toString.call(a);
            if (aString != Object.prototype.toString.call(b)) {
                return false;
            }

            if (aString == "[object Array]") {
                if (a.length !== b.length) {
                    return false;
                }

                for (var i = 0, l = a.length; i < l; i += 1) {
                    if (!deepEqual(a[i], b[i])) {
                        return false;
                    }
                }

                return true;
            }

            var prop, aLength = 0, bLength = 0;

            for (prop in a) {
                aLength += 1;

                if (!deepEqual(a[prop], b[prop])) {
                    return false;
                }
            }

            for (prop in b) {
                bLength += 1;
            }

            return aLength == bLength;
        },

        functionName: function functionName(func) {
            var name = func.displayName || func.name;

            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            if (!name) {
                var matches = func.toString().match(/function ([^\s\(]+)/);
                name = matches && matches[1];
            }

            return name;
        },

        functionToString: function toString() {
            if (this.getCall && this.callCount) {
                var thisValue, prop, i = this.callCount;

                while (i--) {
                    thisValue = this.getCall(i).thisValue;

                    for (prop in thisValue) {
                        if (thisValue[prop] === this) {
                            return prop;
                        }
                    }
                }
            }

            return this.displayName || "sinon fake";
        },

        getConfig: function (custom) {
            var config = {};
            custom = custom || {};
            var defaults = sinon.defaultConfig;

            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
                }
            }

            return config;
        },

        format: function (val) {
            return "" + val;
        },

        defaultConfig: {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        },

        timesInWords: function timesInWords(count) {
            return count == 1 && "once" ||
                count == 2 && "twice" ||
                count == 3 && "thrice" ||
                (count || 0) + " times";
        },

        calledInOrder: function (spies) {
            for (var i = 1, l = spies.length; i < l; i++) {
                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {
                    return false;
                }
            }

            return true;
        },

        orderByFirstCall: function (spies) {
            return spies.sort(function (a, b) {
                // uuid, won't ever be equal
                var aCall = a.getCall(0);
                var bCall = b.getCall(0);
                var aId = aCall && aCall.callId || -1;
                var bId = bCall && bCall.callId || -1;

                return aId < bId ? -1 : 1;
            });
        },

        log: function () {},

        logError: function (label, err) {
            var msg = label + " threw exception: "
            sinon.log(msg + "[" + err.name + "] " + err.message);
            if (err.stack) { sinon.log(err.stack); }

            setTimeout(function () {
                err.message = msg + err.message;
                throw err;
            }, 0);
        },

        typeOf: function (value) {
            if (value === null) {
                return "null";
            }
            else if (value === undefined) {
                return "undefined";
            }
            var string = Object.prototype.toString.call(value);
            return string.substring(8, string.length - 1).toLowerCase();
        },

        createStubInstance: function (constructor) {
            if (typeof constructor !== "function") {
                throw new TypeError("The constructor should be a function.");
            }
            return sinon.stub(sinon.create(constructor.prototype));
        },

        restore: function (object) {
            if (object !== null && typeof object === "object") {
                for (var prop in object) {
                    if (isRestorable(object[prop])) {
                        object[prop].restore();
                    }
                }
            }
            else if (isRestorable(object)) {
                object.restore();
            }
        }
    };

    var isNode = typeof module == "object" && typeof require == "function";

    if (isNode) {
        try {
            buster = { format: require("buster-format") };
        } catch (e) {}
        module.exports = sinon;
        module.exports.spy = require("./sinon/spy");
        module.exports.spyCall = require("./sinon/call");
        module.exports.stub = require("./sinon/stub");
        module.exports.mock = require("./sinon/mock");
        module.exports.collection = require("./sinon/collection");
        module.exports.assert = require("./sinon/assert");
        module.exports.sandbox = require("./sinon/sandbox");
        module.exports.test = require("./sinon/test");
        module.exports.testCase = require("./sinon/test_case");
        module.exports.assert = require("./sinon/assert");
        module.exports.match = require("./sinon/match");
    }

    if (buster) {
        var formatter = sinon.create(buster.format);
        formatter.quoteStrings = false;
        sinon.format = function () {
            return formatter.ascii.apply(formatter, arguments);
        };
    } else if (isNode) {
        try {
            var util = require("util");
            sinon.format = function (value) {
                return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
            };
        } catch (e) {
            /* Node, but no util module - would be very old, but better safe than
             sorry */
        }
    }

    return sinon;
}(typeof buster == "object" && buster));

});
require.register("indemma/index.js", function(exports, require, module){
module.exports = require('./lib/record');

});
require.register("indemma/lib/record.js", function(exports, require, module){
(function() {
  var bind, extend, type,
    __slice = [].slice;

  extend = require('extend');

  type = require('type');

  bind = require('bind');

  this.model = (function() {
    var initialize_record, mixer, modelable;

    modelable = {
      after_mix: [],
      record: {
        after_initialize: []
      },
      all: function() {
        return this.cache;
      },
      create: function() {
        var attributes, params, _i, _len, _results;

        params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _results = [];
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          attributes = params[_i];
          _results.push(this(attributes).save);
        }
        return _results;
      },
      find: function(id) {
        return this.where({
          id: id
        }, true);
      },
      where: function(conditions, first) {
        var record, results, _i, _len, _ref;

        if (first == null) {
          first = false;
        }
        results = [];
        if (type(conditions.id) !== 'array') {
          conditions.id = [conditions.id];
        }
        _ref = this.cache;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          record = _ref[_i];
          if (conditions.id.indexOf(record._id) !== -1) {
            if (first) {
              return record;
            } else {
              results.push(record);
            }
          }
        }
        if (first) {
          return null;
        } else {
          return results;
        }
      }
    };
    initialize_record = function(data) {
      var after_initialize, callback, instance, _i, _len, _ref;

      if (data == null) {
        data = {
          resource: this.resource,
          parent_resource: this.parent_resource
        };
      }
      data.resource || (data.resource = this.resource);
      data.parent_resource || (data.parent_resource = this.parent_resource);
      data.route || (data.route = this.route);
      data.nested_attributes = this.nested_attributes || [];
      after_initialize = (data.after_initialize || []).concat(this.record.after_initialize);
      instance = record.call(extend({}, this.record, data, {
        after_initialize: after_initialize
      }));
      _ref = instance.after_initialize;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback.call(instance, instance);
      }
      delete instance.after_initialize;
      return instance;
    };
    mixer = function(options) {
      var callback, instance, _i, _len, _ref;

      if (!mixer.stale) {
        mixer.stale = true;
      }
      instance = bind(this, initialize_record);
      extend(instance, extend(true, this, modelable));
      _ref = modelable.after_mix;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback.call(instance, instance);
      }
      return mixer[this.resource] = instance;
    };
    mixer.mix = function(blender) {
      if (this.stale) {
        throw "Trying to change model mixin with " + object + " but model already used.\nCheck your configuration order";
      }
      return blender(modelable);
    };
    return mixer;
  })();

  this.record = (function() {
    var callbacks, recordable, that;

    callbacks = {
      dirtify: function() {
        return this.subscribe(function(prop, value, old) {
          if (prop !== 'dirty' && !this.dirty && value !== old) {
            console.groupCollapsed("◉ Property '" + prop + "' dirtied a " + this.resource);
            console.log(old, "→", value);
            console.log(this);
            console.groupEnd();
            return this.dirty = true;
          }
        });
      }
    };
    recordable = {
      dirty: false,
      after_initialize: [callbacks.dirtify]
    };
    that = function(data) {
      var after_initialize;

      if (this === window) {
        throw "Mixin called incorrectly, call mixin with call method: record.call(object, data)";
      }
      data || (data = {});
      after_initialize = this.after_initialize.concat(data.after_initialize || []).concat(recordable.after_initialize);
      return extend(this, recordable, advisable.call(observable.call(data)), {
        after_initialize: after_initialize
      });
    };
    that.mix = function(blender) {
      return blender(recordable);
    };
    return that;
  })();

}).call(this);

});
require.register("indemma/lib/record/associations.js", function(exports, require, module){
(function() {
  var associable, model, plural, singular,
    __slice = [].slice;

  model = window.model;

  model.associable = function() {
    return model.mix(function(modelable) {
      modelable.after_mix.unshift(associable.model);
      return modelable.record.after_initialize.unshift(associable.record);
    });
  };

  model.associable.mix = function(blender) {
    return blender(singular, plural);
  };

  plural = {
    add: function() {
      var attributes, params, _i, _len, _results;

      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        attributes = params[_i];
        _results.push(this.push(this.build(attributes)));
      }
      return _results;
    },
    create: function() {
      var attributes, params, record, _i, _len, _results;

      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        attributes = params[_i];
        record = this.build(attributes);
        this.push(record);
        _results.push(record.save());
      }
      return _results;
    },
    build: function(data) {
      if (data == null) {
        data = {};
      }
      data.parent_resource = this.parent_resource;
      if (this.parent != null) {
        data.route || (data.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
      }
      if (this.route !== data.route && this.route) {
        throw "associable.has_many: cannot redefine route of association " + this.parent_resource + "." + this.resource + " from " + this.route + " to " + data.route;
      }
      return model[this.resource](data);
    },
    push: Array.prototype.push,
    length: 0
  };

  singular = {
    create: function(data) {
      return model[this.resource].create($.extend({}, this, data));
    },
    build: function(data) {
      return model[this.resource]($.extend({}, this, data));
    }
  };

  associable = {
    model: function(options) {
      var callbacks;

      if (this.resource == null) {
        console.error('resource must be defined in order to associate');
      }
      callbacks = {
        has_many: {
          nest_attributes: function() {
            var association, association_name, association_names, message, _i, _len, _results;

            association_names = model[this.resource].has_many;
            if (association_names) {
              _results = [];
              for (_i = 0, _len = association_names.length; _i < _len; _i++) {
                association_name = association_names[_i];
                if (this["" + association_name + "_attributes"]) {
                  association = this[model.pluralize(association_name)];
                  if (!association) {
                    message = "has_many.nest_attributes: Association not found for " + association_name + ". \n";
                    message += "did you set it on model declaration? \n  has_many: " + association_name + " ";
                    throw message;
                  }
                  _results.push(association.add(this["" + association_name + "_attributes"]));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          },
          update_association: function(data) {
            var associated, association, association_name, id, pluralized_association, _i, _j, _len, _len1, _ref;

            id = this._id || data._id || data.id;
            if (!id) {
              return;
            }
            _ref = model[this.resource].has_many;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              association_name = _ref[_i];
              pluralized_association = model.pluralize(association_name);
              association = this[pluralized_association];
              if (!association.route) {
                association.route = "/" + this.resource + "/" + id + "/" + association.resource;
                for (_j = 0, _len1 = association.length; _j < _len1; _j++) {
                  associated = association[_j];
                  if (!associated.route && (associated.parent != null)) {
                    associated.route = "/" + this.resource + "/" + id + "/" + association.resource;
                  }
                }
              }
            }
            return true;
          },
          autosave: function() {
            return this.save();
          }
        }
      };
      if ($.type(this.has_many) !== 'array') {
        this.has_many = [this.has_many];
      }
      if ($.type(this.has_one) !== 'array') {
        this.has_one = [this.has_one];
      }
      if ($.type(this.belongs_to) !== 'array') {
        this.belongs_to = [this.belongs_to];
      }
      return this.create_associations = function() {
        var association_proxy, resource, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;

        if (options.has_many) {
          if ($.type(options.has_many) !== 'array') {
            options.has_many = [options.has_many];
          }
          _ref = options.has_many;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            resource = _ref[_i];
            association_proxy = {
              resource: resource,
              parent_resource: this.resource,
              parent: this
            };
            this[model.pluralize(resource)] = $.extend(association_proxy, plural);
          }
          this.after('saved', callbacks.has_many.update_association);
          callbacks.has_many.nest_attributes.call(this);
        }
        if (options.has_one) {
          if ($.type(options.has_one) !== 'array') {
            options.has_one = [options.has_one];
          }
          _ref1 = options.has_one;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            resource = _ref1[_j];
            association_proxy = {
              resource: resource,
              parent_resource: this.resource
            };
            association_proxy[this.resource] = this;
            this["build_" + resource] = $.proxy(singular.build, association_proxy);
            this["create_" + resource] = $.proxy(singular.create, association_proxy);
          }
        }
        if (options.belongs_to) {
          if ($.type(options.belongs_to) !== 'array') {
            options.belongs_to = [options.belongs_to];
          }
          _ref2 = options.belongs_to;
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            resource = _ref2[_k];
            association_proxy = {
              resource: resource,
              parent_resource: this.resource
            };
            association_proxy[this.resource] = this;
            this["build_" + resource] = $.proxy(singular.build, association_proxy);
            _results.push(this["create_" + resource] = $.proxy(singular.create, association_proxy));
          }
          return _results;
        }
      };
    },
    record: function(options) {
      if (this.resource == null) {
        console.error('resource must be defined in order to associate');
      }
      return model[this.resource].create_associations.call(this);
    }
  };

}).call(this);

});
require.register("indemma/lib/record/resource.js", function(exports, require, module){
(function() {
  var model, resource;

  model = window.model;

  model.resourceable = function() {
    model.mix(function(modelable) {
      modelable.record.after_initialize.unshift(resource.initialize);
      return modelable.after_mix.unshift(resource.initialize);
    });
    return model.pluralize = resource.pluralize;
  };

  resource = {
    pluralize: function(word) {
      return word + 's';
    },
    parent_id: {
      get: function() {
        return this[this.parent_resource]._id;
      },
      set: function() {
        return console.error('Warning changing associations throught parent_id not allowed for security and style guide purposes');
      }
    },
    initialize: function() {
      if (this.route && this.route.indexOf('/') !== 0) {
        this.route = "/" + this.route;
      }
      if (this.parent_resource) {
        Object.defineProperty(this, "" + this.parent_resource + "_id", resource.parent_id);
        if (!this.route && this["" + this.parent_resource + "_id"]) {
          this.route = '/' + resource.pluralize(this.parent_resource) + '/' + this["" + this.parent_resource + "_id"] + '/' + resource.pluralize(this.resource);
        }
      }
      if (!this.route) {
        return this.route = '/' + resource.pluralize(this.resource);
      }
    }
  };

}).call(this);

});
require.register("indemma/lib/record/restful.js", function(exports, require, module){
(function() {
  var extend, model, rest, type,
    __slice = [].slice;

  model = window.model;

  extend = require('extend');

  type = require('type');

  model.restfulable = function() {
    var resource;

    resource = {
      save: function() {
        var argument, promise, _i, _len;

        if (!this.dirty) {
          return;
        }
        promise = rest[this._id ? 'put' : 'post'].call(this);
        promise.done(this.saved);
        promise.fail(this.failed);
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          argument = arguments[_i];
          if (type(argument) === 'function') {
            promise.done(argument);
          }
        }
        this.lock = JSON.stringify(this.json());
        return promise;
      },
      saved: function(data) {
        var callback, _i, _len, _ref, _results;

        if (this.lock === JSON.stringify(this.json())) {
          this.dirty = false;
          delete this.lock;
        } else {
          this.save();
        }
        if (this.after_save) {
          _ref = this.after_save;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            throw "Not supported after_save callback: " + callback;
          }
          return _results;
        }
      },
      failed: function() {
        throw "" + this.resource + ".save: Failed to save record: " + this + "\n";
      },
      toString: function() {
        var serialized;

        serialized = {};
        serialized[this.resource] = this.json();
        return JSON.stringify(serialized);
      },
      json: function() {
        var attribute, json, name, value, _i, _len, _ref;

        json = {};
        for (name in this) {
          value = this[name];
          if (!(type(value) !== 'function')) {
            continue;
          }
          if (value == null) {
            continue;
          }
          if (type(value) === 'object') {
            _ref = this.nested_attributes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              attribute = _ref[_i];
              if (attribute === name) {
                json["" + name + "_attributes"] = value.json();
              }
            }
          } else {
            json[name] = value;
          }
        }
        observable.unobserve(json);
        delete json.dirty;
        delete json.resource;
        delete json.route;
        delete json.parent_resource;
        delete json.nested_attributes;
        delete json.on_save;
        delete json.element;
        delete json["default"];
        delete json.lock;
        return json;
      }
    };
    record.mix(function(recordable) {
      return extend(true, recordable, resource);
    });
    return model.associable && model.associable.mix(function(singular_association, plural_association) {
      return plural_association.post = function() {
        if (this.parent != null) {
          this.route || (this.route = "" + this.parent.route + "/" + this.parent._id + "/" + (model.pluralize(this.resource)));
        }
        return rest.post.apply(this, arguments);
      };
    });
  };

  rest = {
    put: function() {
      var _ref;

      return (_ref = rest.request).call.apply(_ref, [this, 'put', "" + this.route + "/" + this._id].concat(__slice.call(arguments)));
    },
    post: function() {
      var _ref;

      return (_ref = rest.request).call.apply(_ref, [this, 'post', this.route].concat(__slice.call(arguments)));
    },
    request: function(method, url, data) {
      if (!data) {
        data = {};
        data[this.resource] = this.json();
      }
      return $.ajax({
        url: url,
        data: data,
        type: method,
        context: this
      });
    }
  };

}).call(this);

});
require.register("indemma/lib/record/maid.js", function(exports, require, module){
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

});
require.register("indemma/lib/record/validators/base.js", function(exports, require, module){
(function() {
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

}).call(this);

});
require.register("indemma/lib/extensions/rivets.js", function(exports, require, module){
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  model.rivets = function() {
    var model_extensions;

    model_extensions = {
      record: {
        tie: function(element) {
          var lasso;

          lasso = {};
          lasso[this.resource] = this;
          return rivets.bind(element, lasso);
        }
      },
      preloadData: true
    };
    return model.mix(function(modelable) {
      return $.extend(true, modelable, model_extensions);
    });
  };

}).call(this);

});
require.alias("segmentio-extend/index.js", "indemma/deps/extend/index.js");

require.alias("component-type/index.js", "indemma/deps/type/index.js");

require.alias("component-bind/index.js", "indemma/deps/bind/index.js");

require.alias("observable/components/cjohansen-sinon.js/sinon.js", "indemma/deps/observable/components/cjohansen-sinon.js/sinon.js");
require.alias("observable/index.js", "indemma/deps/observable/index.js");
require.alias("observable/lib/observable.js", "indemma/deps/observable/lib/observable.js");
require.alias("observable/lib/adapters/rivets.js", "indemma/deps/observable/lib/adapters/rivets.js");


