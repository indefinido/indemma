/*
 * Xccessors Legacy: Cross-browser legacy non-standard accessors
 * http://github.com/eligrey/Xccessors
 *
 * 2010-03-21
 *
 * By Elijah Grey, http://eligrey.com
 *
 * A shim that implements __defineGetter__, __defineSetter__, __lookupGetter__,
 * and __lookupSetter__
 * in browsers that have ECMAScript 5 accessor support but not the legacy methods.
 *
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

/*global Element, Window, HTMLDocument */

/*jslint white: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true,
  strict: true, newcap: true, immed: true, maxlen: 90 */

/*! @source http://purl.eligrey.com/github/Xccessors/blob/master/xccessors-legacy.js*/

"use strict";

(function () {
    var
    defineProp = Object.defineProperty,
    getProp    = Object.getOwnPropertyDescriptor,

    // methods being implemented
    methods    = [
        "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"
    ],

    // objects to implement legacy methods onto their prototypes
    // Object.prototype[method] doesn't work on everything for IE
    extend     = [Object, String, Array, Function, Boolean, Number,
                 RegExp, Date, Error],
    len        = extend.length,
    proto      = "prototype",
    extendMethod = function (method, fun) {
        var i = len;
        if (!(method in {})) {
            while (i--) {
              defineProp(extend[i][proto], method, {value: fun, enumerable: false})
            }
        }
    };

    // IE8 Does not support enumerable key so we abort!
    // TODO Fix this without cluttering the prototype
    try {defineProp({}, 'domo', {value: true, enumerable: false})} catch (e) {return;}

    // IE7 Does not have Element, Window defined, so we check here
    if (typeof Element != 'undefined') extend.push(Element);
    if (typeof Window != 'undefined') extend.push(Window);

    // IE9 Does not have html document defined, so we check here
    if (typeof HTMLDocument != 'undefined') extend.push(HTMLDocument);


    if (defineProp) {
        extendMethod(methods[0], function (prop, fun) { // __defineGetter__
            defineProp(this, prop, { get: fun });
        });

        extendMethod(methods[1], function (prop, fun) { // __defineSetter__
            defineProp(this, prop, { set: fun });
        });
    }

    if (getProp && !defineProp.requiresDomElement) {
      extendMethod(methods[2], function (prop) { // __lookupGetter__
        var descriptor = getProp(this, prop);
        if (descriptor && descriptor.get) return descriptor.get;

         // look in prototype too
        descriptor = getProp(this.constructor[proto], prop);
        if (descriptor && descriptor.get) return descriptor.get;
      });

      extendMethod(methods[3], function (prop) { // __lookupSetter__
        var descriptor = getProp(this, prop);
        if (descriptor && descriptor.set) return descriptor.set;

        // look in prototype too
        descriptor = getProp(this.constructor[proto], prop);
        if (descriptor && descriptor.set) return descriptor.set;
      });
    }
}());
