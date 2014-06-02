'use strict';

(function () {
  // Cache native objects for better performacy and easy to use
  // references
  var ObjectProto = Object.prototype,
  hasOwnProp = ObjectProto.hasOwnProperty,
  getProp    = Object.getOwnPropertyDescriptor,
  defineProp = Object.defineProperty,
  objectCreate = Object.create,
  toStrings = [],
  features = null,
  stack = [], detach,
  fixedOwnProperty,
   prototypeBase = [Object, String, Array, Function, Boolean, Number, RegExp, Date, Error];

  // IE7 Does not have Element and Window defined, so only add them if
  // they exists check here
  if (typeof Element != 'undefined') prototypeBase.push(Element);
  if (typeof Window  != 'undefined') prototypeBase.push(Window);

  features = {
    allowsNonEnumerableProperty: function () {
      var broken = false;
      try {
        defineProp({}, 'x', {})
      } catch(e) {
        broken = true;
      }

      return (!broken) && (!!defineProp);
    },
    supportsOnPropertyChangeEvent: function () {
      var test = document.createElement('domo');
      return 'onpropertychange' in test
    }
  }

  if (!features.allowsNonEnumerableProperty() && features.supportsOnPropertyChangeEvent()) {

    // Check if node is on document
    var inDocument = function inDocument (node) {
      var curr = node;
      while (curr != null) {
        curr = curr.parentNode;
        if (curr == document) return true;
      }
      return false;
    },

    // Generate property event handler for setting some property
    generate_setter = function generate_setter (object, property, descriptor) {
      var setter = function object_define_property_shim_change_listener (event) {
        var current_value, changed_value;
        if (
          // if we are setting this property
          event.propertyName == property

          // prevent firing setters again
          // by checking callstack
          && stack.indexOf(property) === -1
        ) {
          // Remove the event so it doesn't fire again and
          // create a loop
          object.detachEvent("onpropertychange", setter);

          // If detaching the current setter
          // just remove the event listener
          if (detach) return;

          // get the changed value, run it through the set function
          changed_value = object[property];
          descriptor.set.call(object, changed_value);

          // Restore get function if:
          //  it was mentioned on definition
          //  there's no falsey value, in that case we just need to return falsey value
          //  current toString is not the getter, to prevent further unecessary redefinitions
          if (descriptor.get && descriptor.value && descriptor.value.toString != descriptor.bound_getter) {
            // TODO if (descriptor.get + '' === 'undefined') descriptor.get = '';        // Handle undefined getter
            descriptor.value.toString = descriptor.bound_getter
          }

          // Update stored values
          object[property] = descriptor.value = changed_value;

          // restore the event handler
          object.attachEvent("onpropertychange", setter);

          // stack.pop();
          return false;
        }
      }

      return setter;
    };

    // Shim define property with apropriated fail cases exceptions
    Object.defineProperty = function (obj, prop, descriptor) {
      var fix;

      if (!prop)

      if (descriptor.set) {
        if (!obj.attachEvent) throw new TypeError('Object.defineProperty: First parameter must be a dom element. When descriptor has \'set\' property.');

        if (!fix && !inDocument(obj)) throw new TypeError('Object.defineProperty: Dom element must be attached in document.');
      }

      if (!descriptor) throw new TypeError('Object.defineProperty (object, property, descriptor): Descriptor must be an object, was \'' + descriptor + '\'.');

      // Store current value in descriptor
      // TODO only try to set descriptor value if it was passed as parameter
      descriptor.value = descriptor.value || (descriptor.get && descriptor.get.call(obj)) || obj[prop];

      if (descriptor.set) {
        // Detach old listeners if any
        detach = true;
        obj[prop] = 'detaching';
        detach = false;

        if (descriptor.get) {
          // TODO remove jquery dependency
          descriptor.bound_getter   = $.extend($.proxy(descriptor.get, obj), descriptor.get);

          // Why? we only bind the getter when we have a non falsey value
          if (descriptor.value) descriptor.value.toString = descriptor.bound_getter;

          // Although its not allowed for convention to have getters
          // and setters with the descriptor value, here we just reuse
          // the descriptor stored value
          obj[prop] = descriptor.value;
        }

        (fix || obj).attachEvent("onpropertychange", generate_setter(obj, prop, descriptor));

      } else if (descriptor.get) {
        descriptor.bound_getter   = $.extend($.proxy(descriptor.get, obj), descriptor.get);

        // Why? we only bind the getter when we have a non falsey value
        if (descriptor.value) descriptor.value.toString = descriptor.bound_getter;

        // Although its not allowed for convention to have getters
        // and setters with the descriptor value, here we just reuse
        // the descriptor stored value
        obj[prop] = descriptor.value;
      } else {
        obj[prop] = descriptor.value;
      }

      return obj;
    }

    // Allow others to check requirements for define property
    Object.defineProperty.requiresDomElement = true
  }


  // Since we shimed define property, we can also shim defineProperties
  if (!Object.defineProperties) {
    Object.defineProperties = function (obj, props) {
      for (var prop in props) {
        if (hasOwnProp.call(props, prop)) {
          Object.defineProperty(obj, prop, props[prop]);
        }
      }
    };

    baseElement      = document.createElement('fix');
    fixedOwnProperty = function (name) {
      if (name in baseElement) return false;
      return hasOwnProp.call(this, name);
    };


    Object.create = function (prototype, properties) {
      var complexDescriptor, fix, descriptor, name;

      for (name in properties) {
        descriptor = properties[name]
        if (descriptor instanceof Object) {
          complexDescriptor = !!(descriptor.get || descriptor.set)

          if (complexDescriptor) {
            break;
          }
        }
      }

      if (complexDescriptor || prototype.nodeName === 'fix' || properties && properties._shim) {
        properties && delete properties._shim;

        if (typeof object != 'function') {
          fix = document.createElement('fix');
          document.appendChild(fix);

          // Copy over prototype properties
          for (name in prototype) {
            try {
              if (name in baseElement) continue;
              fix[name] = prototype[name];
            } catch (e) {
              console.warn("Object.create: Invalid shimmed property: " + name + ", with error " + e);
            }
          }

          // Ensure most normalized for loops to work property, by
          // skiping the dom element properties on own property
          // checking.
          //
          // TODO ensure other own property methods checking
          fix.hasOwnProperty = fixedOwnProperty

          Object.defineProperties(fix, properties);
        } else {
          throw new TypeError('Functions with complex descriptors not implemented yet');
        }
        return fix;
      } else {
        return objectCreate(prototype, properties)
      }
    }
  };


  /* TODO Use define Property, and only define if
     non-enumerable properties are allowed

     also define __defineGetter__ and __defineSetter__
  if (!Object.defineProperty.requiresDomElement) {
    if (!Object.prototype.__lookupGetter__) {
      Object.__lookupGetter__ = function () {
      console && console.log('__lookupGetter__ not implemented yet');
        return null;
    }
  }

  if (!Object.__lookupSetter__) {
    Object.prototype.__lookupSetter__ = function () {
      console && console.log('__lookupSetter__ not implemented yet');
      return null;
      }
      }
    }
  */

})();

