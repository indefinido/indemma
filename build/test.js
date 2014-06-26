/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~type@1.0.0", Function("exports, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
\n\
//# sourceURL=components/component/type/1.0.0/index.js"
));

require.modules["component-type"] = require.modules["component~type@1.0.0"];
require.modules["component~type"] = require.modules["component~type@1.0.0"];
require.modules["type"] = require.modules["component~type@1.0.0"];


require.register("component~bind@0.0.1", Function("exports, module",
"\n\
/**\n\
 * Slice reference.\n\
 */\n\
\n\
var slice = [].slice;\n\
\n\
/**\n\
 * Bind `obj` to `fn`.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function|String} fn or string\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn){\n\
  if ('string' == typeof fn) fn = obj[fn];\n\
  if ('function' != typeof fn) throw new Error('bind() requires a function');\n\
  var args = [].slice.call(arguments, 2);\n\
  return function(){\n\
    return fn.apply(obj, args.concat(slice.call(arguments)));\n\
  }\n\
};\n\
\n\
//# sourceURL=components/component/bind/0.0.1/index.js"
));

require.modules["component-bind"] = require.modules["component~bind@0.0.1"];
require.modules["component~bind"] = require.modules["component~bind@0.0.1"];
require.modules["bind"] = require.modules["component~bind@0.0.1"];


require.register("component~jquery@1.9.1", Function("exports, module",
"/*!\n\
 * jQuery JavaScript Library v1.9.1\n\
 * http://jquery.com/\n\
 *\n\
 * Includes Sizzle.js\n\
 * http://sizzlejs.com/\n\
 *\n\
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors\n\
 * Released under the MIT license\n\
 * http://jquery.org/license\n\
 *\n\
 * Date: 2013-2-4\n\
 */\n\
(function( window, undefined ) {\n\
\n\
// Can't do this because several apps including ASP.NET trace\n\
// the stack via arguments.caller.callee and Firefox dies if\n\
// you try to trace through \"use strict\" call chains. (#13335)\n\
// Support: Firefox 18+\n\
//\"use strict\";\n\
var\n\
\t// The deferred used on DOM ready\n\
\treadyList,\n\
\n\
\t// A central reference to the root jQuery(document)\n\
\trootjQuery,\n\
\n\
\t// Support: IE<9\n\
\t// For `typeof node.method` instead of `node.method !== undefined`\n\
\tcore_strundefined = typeof undefined,\n\
\n\
\t// Use the correct document accordingly with window argument (sandbox)\n\
\tdocument = window.document,\n\
\tlocation = window.location,\n\
\n\
\t// Map over jQuery in case of overwrite\n\
\t_jQuery = window.jQuery,\n\
\n\
\t// Map over the $ in case of overwrite\n\
\t_$ = window.$,\n\
\n\
\t// [[Class]] -> type pairs\n\
\tclass2type = {},\n\
\n\
\t// List of deleted data cache ids, so we can reuse them\n\
\tcore_deletedIds = [],\n\
\n\
\tcore_version = \"1.9.1\",\n\
\n\
\t// Save a reference to some core methods\n\
\tcore_concat = core_deletedIds.concat,\n\
\tcore_push = core_deletedIds.push,\n\
\tcore_slice = core_deletedIds.slice,\n\
\tcore_indexOf = core_deletedIds.indexOf,\n\
\tcore_toString = class2type.toString,\n\
\tcore_hasOwn = class2type.hasOwnProperty,\n\
\tcore_trim = core_version.trim,\n\
\n\
\t// Define a local copy of jQuery\n\
\tjQuery = function( selector, context ) {\n\
\t\t// The jQuery object is actually just the init constructor 'enhanced'\n\
\t\treturn new jQuery.fn.init( selector, context, rootjQuery );\n\
\t},\n\
\n\
\t// Used for matching numbers\n\
\tcore_pnum = /[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)/.source,\n\
\n\
\t// Used for splitting on whitespace\n\
\tcore_rnotwhite = /\\S+/g,\n\
\n\
\t// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)\n\
\trtrim = /^[\\s\\uFEFF\\xA0]+|[\\s\\uFEFF\\xA0]+$/g,\n\
\n\
\t// A simple way to check for HTML strings\n\
\t// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)\n\
\t// Strict HTML recognition (#11290: must start with <)\n\
\trquickExpr = /^(?:(<[\\w\\W]+>)[^>]*|#([\\w-]*))$/,\n\
\n\
\t// Match a standalone tag\n\
\trsingleTag = /^<(\\w+)\\s*\\/?>(?:<\\/\\1>|)$/,\n\
\n\
\t// JSON RegExp\n\
\trvalidchars = /^[\\],:{}\\s]*$/,\n\
\trvalidbraces = /(?:^|:|,)(?:\\s*\\[)+/g,\n\
\trvalidescape = /\\\\(?:[\"\\\\\\/bfnrt]|u[\\da-fA-F]{4})/g,\n\
\trvalidtokens = /\"[^\"\\\\\\r\\n\
]*\"|true|false|null|-?(?:\\d+\\.|)\\d+(?:[eE][+-]?\\d+|)/g,\n\
\n\
\t// Matches dashed string for camelizing\n\
\trmsPrefix = /^-ms-/,\n\
\trdashAlpha = /-([\\da-z])/gi,\n\
\n\
\t// Used by jQuery.camelCase as callback to replace()\n\
\tfcamelCase = function( all, letter ) {\n\
\t\treturn letter.toUpperCase();\n\
\t},\n\
\n\
\t// The ready event handler\n\
\tcompleted = function( event ) {\n\
\n\
\t\t// readyState === \"complete\" is good enough for us to call the dom ready in oldIE\n\
\t\tif ( document.addEventListener || event.type === \"load\" || document.readyState === \"complete\" ) {\n\
\t\t\tdetach();\n\
\t\t\tjQuery.ready();\n\
\t\t}\n\
\t},\n\
\t// Clean-up method for dom ready events\n\
\tdetach = function() {\n\
\t\tif ( document.addEventListener ) {\n\
\t\t\tdocument.removeEventListener( \"DOMContentLoaded\", completed, false );\n\
\t\t\twindow.removeEventListener( \"load\", completed, false );\n\
\n\
\t\t} else {\n\
\t\t\tdocument.detachEvent( \"onreadystatechange\", completed );\n\
\t\t\twindow.detachEvent( \"onload\", completed );\n\
\t\t}\n\
\t};\n\
\n\
jQuery.fn = jQuery.prototype = {\n\
\t// The current version of jQuery being used\n\
\tjquery: core_version,\n\
\n\
\tconstructor: jQuery,\n\
\tinit: function( selector, context, rootjQuery ) {\n\
\t\tvar match, elem;\n\
\n\
\t\t// HANDLE: $(\"\"), $(null), $(undefined), $(false)\n\
\t\tif ( !selector ) {\n\
\t\t\treturn this;\n\
\t\t}\n\
\n\
\t\t// Handle HTML strings\n\
\t\tif ( typeof selector === \"string\" ) {\n\
\t\t\tif ( selector.charAt(0) === \"<\" && selector.charAt( selector.length - 1 ) === \">\" && selector.length >= 3 ) {\n\
\t\t\t\t// Assume that strings that start and end with <> are HTML and skip the regex check\n\
\t\t\t\tmatch = [ null, selector, null ];\n\
\n\
\t\t\t} else {\n\
\t\t\t\tmatch = rquickExpr.exec( selector );\n\
\t\t\t}\n\
\n\
\t\t\t// Match html or make sure no context is specified for #id\n\
\t\t\tif ( match && (match[1] || !context) ) {\n\
\n\
\t\t\t\t// HANDLE: $(html) -> $(array)\n\
\t\t\t\tif ( match[1] ) {\n\
\t\t\t\t\tcontext = context instanceof jQuery ? context[0] : context;\n\
\n\
\t\t\t\t\t// scripts is true for back-compat\n\
\t\t\t\t\tjQuery.merge( this, jQuery.parseHTML(\n\
\t\t\t\t\t\tmatch[1],\n\
\t\t\t\t\t\tcontext && context.nodeType ? context.ownerDocument || context : document,\n\
\t\t\t\t\t\ttrue\n\
\t\t\t\t\t) );\n\
\n\
\t\t\t\t\t// HANDLE: $(html, props)\n\
\t\t\t\t\tif ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {\n\
\t\t\t\t\t\tfor ( match in context ) {\n\
\t\t\t\t\t\t\t// Properties of context are called as methods if possible\n\
\t\t\t\t\t\t\tif ( jQuery.isFunction( this[ match ] ) ) {\n\
\t\t\t\t\t\t\t\tthis[ match ]( context[ match ] );\n\
\n\
\t\t\t\t\t\t\t// ...and otherwise set as attributes\n\
\t\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\t\tthis.attr( match, context[ match ] );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\treturn this;\n\
\n\
\t\t\t\t// HANDLE: $(#id)\n\
\t\t\t\t} else {\n\
\t\t\t\t\telem = document.getElementById( match[2] );\n\
\n\
\t\t\t\t\t// Check parentNode to catch when Blackberry 4.6 returns\n\
\t\t\t\t\t// nodes that are no longer in the document #6963\n\
\t\t\t\t\tif ( elem && elem.parentNode ) {\n\
\t\t\t\t\t\t// Handle the case where IE and Opera return items\n\
\t\t\t\t\t\t// by name instead of ID\n\
\t\t\t\t\t\tif ( elem.id !== match[2] ) {\n\
\t\t\t\t\t\t\treturn rootjQuery.find( selector );\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t// Otherwise, we inject the element directly into the jQuery object\n\
\t\t\t\t\t\tthis.length = 1;\n\
\t\t\t\t\t\tthis[0] = elem;\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\tthis.context = document;\n\
\t\t\t\t\tthis.selector = selector;\n\
\t\t\t\t\treturn this;\n\
\t\t\t\t}\n\
\n\
\t\t\t// HANDLE: $(expr, $(...))\n\
\t\t\t} else if ( !context || context.jquery ) {\n\
\t\t\t\treturn ( context || rootjQuery ).find( selector );\n\
\n\
\t\t\t// HANDLE: $(expr, context)\n\
\t\t\t// (which is just equivalent to: $(context).find(expr)\n\
\t\t\t} else {\n\
\t\t\t\treturn this.constructor( context ).find( selector );\n\
\t\t\t}\n\
\n\
\t\t// HANDLE: $(DOMElement)\n\
\t\t} else if ( selector.nodeType ) {\n\
\t\t\tthis.context = this[0] = selector;\n\
\t\t\tthis.length = 1;\n\
\t\t\treturn this;\n\
\n\
\t\t// HANDLE: $(function)\n\
\t\t// Shortcut for document ready\n\
\t\t} else if ( jQuery.isFunction( selector ) ) {\n\
\t\t\treturn rootjQuery.ready( selector );\n\
\t\t}\n\
\n\
\t\tif ( selector.selector !== undefined ) {\n\
\t\t\tthis.selector = selector.selector;\n\
\t\t\tthis.context = selector.context;\n\
\t\t}\n\
\n\
\t\treturn jQuery.makeArray( selector, this );\n\
\t},\n\
\n\
\t// Start with an empty selector\n\
\tselector: \"\",\n\
\n\
\t// The default length of a jQuery object is 0\n\
\tlength: 0,\n\
\n\
\t// The number of elements contained in the matched element set\n\
\tsize: function() {\n\
\t\treturn this.length;\n\
\t},\n\
\n\
\ttoArray: function() {\n\
\t\treturn core_slice.call( this );\n\
\t},\n\
\n\
\t// Get the Nth element in the matched element set OR\n\
\t// Get the whole matched element set as a clean array\n\
\tget: function( num ) {\n\
\t\treturn num == null ?\n\
\n\
\t\t\t// Return a 'clean' array\n\
\t\t\tthis.toArray() :\n\
\n\
\t\t\t// Return just the object\n\
\t\t\t( num < 0 ? this[ this.length + num ] : this[ num ] );\n\
\t},\n\
\n\
\t// Take an array of elements and push it onto the stack\n\
\t// (returning the new matched element set)\n\
\tpushStack: function( elems ) {\n\
\n\
\t\t// Build a new jQuery matched element set\n\
\t\tvar ret = jQuery.merge( this.constructor(), elems );\n\
\n\
\t\t// Add the old object onto the stack (as a reference)\n\
\t\tret.prevObject = this;\n\
\t\tret.context = this.context;\n\
\n\
\t\t// Return the newly-formed element set\n\
\t\treturn ret;\n\
\t},\n\
\n\
\t// Execute a callback for every element in the matched set.\n\
\t// (You can seed the arguments with an array of args, but this is\n\
\t// only used internally.)\n\
\teach: function( callback, args ) {\n\
\t\treturn jQuery.each( this, callback, args );\n\
\t},\n\
\n\
\tready: function( fn ) {\n\
\t\t// Add the callback\n\
\t\tjQuery.ready.promise().done( fn );\n\
\n\
\t\treturn this;\n\
\t},\n\
\n\
\tslice: function() {\n\
\t\treturn this.pushStack( core_slice.apply( this, arguments ) );\n\
\t},\n\
\n\
\tfirst: function() {\n\
\t\treturn this.eq( 0 );\n\
\t},\n\
\n\
\tlast: function() {\n\
\t\treturn this.eq( -1 );\n\
\t},\n\
\n\
\teq: function( i ) {\n\
\t\tvar len = this.length,\n\
\t\t\tj = +i + ( i < 0 ? len : 0 );\n\
\t\treturn this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );\n\
\t},\n\
\n\
\tmap: function( callback ) {\n\
\t\treturn this.pushStack( jQuery.map(this, function( elem, i ) {\n\
\t\t\treturn callback.call( elem, i, elem );\n\
\t\t}));\n\
\t},\n\
\n\
\tend: function() {\n\
\t\treturn this.prevObject || this.constructor(null);\n\
\t},\n\
\n\
\t// For internal use only.\n\
\t// Behaves like an Array's method, not like a jQuery method.\n\
\tpush: core_push,\n\
\tsort: [].sort,\n\
\tsplice: [].splice\n\
};\n\
\n\
// Give the init function the jQuery prototype for later instantiation\n\
jQuery.fn.init.prototype = jQuery.fn;\n\
\n\
jQuery.extend = jQuery.fn.extend = function() {\n\
\tvar src, copyIsArray, copy, name, options, clone,\n\
\t\ttarget = arguments[0] || {},\n\
\t\ti = 1,\n\
\t\tlength = arguments.length,\n\
\t\tdeep = false;\n\
\n\
\t// Handle a deep copy situation\n\
\tif ( typeof target === \"boolean\" ) {\n\
\t\tdeep = target;\n\
\t\ttarget = arguments[1] || {};\n\
\t\t// skip the boolean and the target\n\
\t\ti = 2;\n\
\t}\n\
\n\
\t// Handle case when target is a string or something (possible in deep copy)\n\
\tif ( typeof target !== \"object\" && !jQuery.isFunction(target) ) {\n\
\t\ttarget = {};\n\
\t}\n\
\n\
\t// extend jQuery itself if only one argument is passed\n\
\tif ( length === i ) {\n\
\t\ttarget = this;\n\
\t\t--i;\n\
\t}\n\
\n\
\tfor ( ; i < length; i++ ) {\n\
\t\t// Only deal with non-null/undefined values\n\
\t\tif ( (options = arguments[ i ]) != null ) {\n\
\t\t\t// Extend the base object\n\
\t\t\tfor ( name in options ) {\n\
\t\t\t\tsrc = target[ name ];\n\
\t\t\t\tcopy = options[ name ];\n\
\n\
\t\t\t\t// Prevent never-ending loop\n\
\t\t\t\tif ( target === copy ) {\n\
\t\t\t\t\tcontinue;\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Recurse if we're merging plain objects or arrays\n\
\t\t\t\tif ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {\n\
\t\t\t\t\tif ( copyIsArray ) {\n\
\t\t\t\t\t\tcopyIsArray = false;\n\
\t\t\t\t\t\tclone = src && jQuery.isArray(src) ? src : [];\n\
\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\tclone = src && jQuery.isPlainObject(src) ? src : {};\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Never move original objects, clone them\n\
\t\t\t\t\ttarget[ name ] = jQuery.extend( deep, clone, copy );\n\
\n\
\t\t\t\t// Don't bring in undefined values\n\
\t\t\t\t} else if ( copy !== undefined ) {\n\
\t\t\t\t\ttarget[ name ] = copy;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\t// Return the modified object\n\
\treturn target;\n\
};\n\
\n\
jQuery.extend({\n\
\tnoConflict: function( deep ) {\n\
\t\tif ( window.$ === jQuery ) {\n\
\t\t\twindow.$ = _$;\n\
\t\t}\n\
\n\
\t\tif ( deep && window.jQuery === jQuery ) {\n\
\t\t\twindow.jQuery = _jQuery;\n\
\t\t}\n\
\n\
\t\treturn jQuery;\n\
\t},\n\
\n\
\t// Is the DOM ready to be used? Set to true once it occurs.\n\
\tisReady: false,\n\
\n\
\t// A counter to track how many items to wait for before\n\
\t// the ready event fires. See #6781\n\
\treadyWait: 1,\n\
\n\
\t// Hold (or release) the ready event\n\
\tholdReady: function( hold ) {\n\
\t\tif ( hold ) {\n\
\t\t\tjQuery.readyWait++;\n\
\t\t} else {\n\
\t\t\tjQuery.ready( true );\n\
\t\t}\n\
\t},\n\
\n\
\t// Handle when the DOM is ready\n\
\tready: function( wait ) {\n\
\n\
\t\t// Abort if there are pending holds or we're already ready\n\
\t\tif ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).\n\
\t\tif ( !document.body ) {\n\
\t\t\treturn setTimeout( jQuery.ready );\n\
\t\t}\n\
\n\
\t\t// Remember that the DOM is ready\n\
\t\tjQuery.isReady = true;\n\
\n\
\t\t// If a normal DOM Ready event fired, decrement, and wait if need be\n\
\t\tif ( wait !== true && --jQuery.readyWait > 0 ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// If there are functions bound, to execute\n\
\t\treadyList.resolveWith( document, [ jQuery ] );\n\
\n\
\t\t// Trigger any bound ready events\n\
\t\tif ( jQuery.fn.trigger ) {\n\
\t\t\tjQuery( document ).trigger(\"ready\").off(\"ready\");\n\
\t\t}\n\
\t},\n\
\n\
\t// See test/unit/core.js for details concerning isFunction.\n\
\t// Since version 1.3, DOM methods and functions like alert\n\
\t// aren't supported. They return false on IE (#2968).\n\
\tisFunction: function( obj ) {\n\
\t\treturn jQuery.type(obj) === \"function\";\n\
\t},\n\
\n\
\tisArray: Array.isArray || function( obj ) {\n\
\t\treturn jQuery.type(obj) === \"array\";\n\
\t},\n\
\n\
\tisWindow: function( obj ) {\n\
\t\treturn obj != null && obj == obj.window;\n\
\t},\n\
\n\
\tisNumeric: function( obj ) {\n\
\t\treturn !isNaN( parseFloat(obj) ) && isFinite( obj );\n\
\t},\n\
\n\
\ttype: function( obj ) {\n\
\t\tif ( obj == null ) {\n\
\t\t\treturn String( obj );\n\
\t\t}\n\
\t\treturn typeof obj === \"object\" || typeof obj === \"function\" ?\n\
\t\t\tclass2type[ core_toString.call(obj) ] || \"object\" :\n\
\t\t\ttypeof obj;\n\
\t},\n\
\n\
\tisPlainObject: function( obj ) {\n\
\t\t// Must be an Object.\n\
\t\t// Because of IE, we also have to check the presence of the constructor property.\n\
\t\t// Make sure that DOM nodes and window objects don't pass through, as well\n\
\t\tif ( !obj || jQuery.type(obj) !== \"object\" || obj.nodeType || jQuery.isWindow( obj ) ) {\n\
\t\t\treturn false;\n\
\t\t}\n\
\n\
\t\ttry {\n\
\t\t\t// Not own constructor property must be Object\n\
\t\t\tif ( obj.constructor &&\n\
\t\t\t\t!core_hasOwn.call(obj, \"constructor\") &&\n\
\t\t\t\t!core_hasOwn.call(obj.constructor.prototype, \"isPrototypeOf\") ) {\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\t\t} catch ( e ) {\n\
\t\t\t// IE8,9 Will throw exceptions on certain host objects #9897\n\
\t\t\treturn false;\n\
\t\t}\n\
\n\
\t\t// Own properties are enumerated firstly, so to speed up,\n\
\t\t// if last one is own, then all properties are own.\n\
\n\
\t\tvar key;\n\
\t\tfor ( key in obj ) {}\n\
\n\
\t\treturn key === undefined || core_hasOwn.call( obj, key );\n\
\t},\n\
\n\
\tisEmptyObject: function( obj ) {\n\
\t\tvar name;\n\
\t\tfor ( name in obj ) {\n\
\t\t\treturn false;\n\
\t\t}\n\
\t\treturn true;\n\
\t},\n\
\n\
\terror: function( msg ) {\n\
\t\tthrow new Error( msg );\n\
\t},\n\
\n\
\t// data: string of html\n\
\t// context (optional): If specified, the fragment will be created in this context, defaults to document\n\
\t// keepScripts (optional): If true, will include scripts passed in the html string\n\
\tparseHTML: function( data, context, keepScripts ) {\n\
\t\tif ( !data || typeof data !== \"string\" ) {\n\
\t\t\treturn null;\n\
\t\t}\n\
\t\tif ( typeof context === \"boolean\" ) {\n\
\t\t\tkeepScripts = context;\n\
\t\t\tcontext = false;\n\
\t\t}\n\
\t\tcontext = context || document;\n\
\n\
\t\tvar parsed = rsingleTag.exec( data ),\n\
\t\t\tscripts = !keepScripts && [];\n\
\n\
\t\t// Single tag\n\
\t\tif ( parsed ) {\n\
\t\t\treturn [ context.createElement( parsed[1] ) ];\n\
\t\t}\n\
\n\
\t\tparsed = jQuery.buildFragment( [ data ], context, scripts );\n\
\t\tif ( scripts ) {\n\
\t\t\tjQuery( scripts ).remove();\n\
\t\t}\n\
\t\treturn jQuery.merge( [], parsed.childNodes );\n\
\t},\n\
\n\
\tparseJSON: function( data ) {\n\
\t\t// Attempt to parse using the native JSON parser first\n\
\t\tif ( window.JSON && window.JSON.parse ) {\n\
\t\t\treturn window.JSON.parse( data );\n\
\t\t}\n\
\n\
\t\tif ( data === null ) {\n\
\t\t\treturn data;\n\
\t\t}\n\
\n\
\t\tif ( typeof data === \"string\" ) {\n\
\n\
\t\t\t// Make sure leading/trailing whitespace is removed (IE can't handle it)\n\
\t\t\tdata = jQuery.trim( data );\n\
\n\
\t\t\tif ( data ) {\n\
\t\t\t\t// Make sure the incoming data is actual JSON\n\
\t\t\t\t// Logic borrowed from http://json.org/json2.js\n\
\t\t\t\tif ( rvalidchars.test( data.replace( rvalidescape, \"@\" )\n\
\t\t\t\t\t.replace( rvalidtokens, \"]\" )\n\
\t\t\t\t\t.replace( rvalidbraces, \"\")) ) {\n\
\n\
\t\t\t\t\treturn ( new Function( \"return \" + data ) )();\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\tjQuery.error( \"Invalid JSON: \" + data );\n\
\t},\n\
\n\
\t// Cross-browser xml parsing\n\
\tparseXML: function( data ) {\n\
\t\tvar xml, tmp;\n\
\t\tif ( !data || typeof data !== \"string\" ) {\n\
\t\t\treturn null;\n\
\t\t}\n\
\t\ttry {\n\
\t\t\tif ( window.DOMParser ) { // Standard\n\
\t\t\t\ttmp = new DOMParser();\n\
\t\t\t\txml = tmp.parseFromString( data , \"text/xml\" );\n\
\t\t\t} else { // IE\n\
\t\t\t\txml = new ActiveXObject( \"Microsoft.XMLDOM\" );\n\
\t\t\t\txml.async = \"false\";\n\
\t\t\t\txml.loadXML( data );\n\
\t\t\t}\n\
\t\t} catch( e ) {\n\
\t\t\txml = undefined;\n\
\t\t}\n\
\t\tif ( !xml || !xml.documentElement || xml.getElementsByTagName( \"parsererror\" ).length ) {\n\
\t\t\tjQuery.error( \"Invalid XML: \" + data );\n\
\t\t}\n\
\t\treturn xml;\n\
\t},\n\
\n\
\tnoop: function() {},\n\
\n\
\t// Evaluates a script in a global context\n\
\t// Workarounds based on findings by Jim Driscoll\n\
\t// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context\n\
\tglobalEval: function( data ) {\n\
\t\tif ( data && jQuery.trim( data ) ) {\n\
\t\t\t// We use execScript on Internet Explorer\n\
\t\t\t// We use an anonymous function so that context is window\n\
\t\t\t// rather than jQuery in Firefox\n\
\t\t\t( window.execScript || function( data ) {\n\
\t\t\t\twindow[ \"eval\" ].call( window, data );\n\
\t\t\t} )( data );\n\
\t\t}\n\
\t},\n\
\n\
\t// Convert dashed to camelCase; used by the css and data modules\n\
\t// Microsoft forgot to hump their vendor prefix (#9572)\n\
\tcamelCase: function( string ) {\n\
\t\treturn string.replace( rmsPrefix, \"ms-\" ).replace( rdashAlpha, fcamelCase );\n\
\t},\n\
\n\
\tnodeName: function( elem, name ) {\n\
\t\treturn elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();\n\
\t},\n\
\n\
\t// args is for internal usage only\n\
\teach: function( obj, callback, args ) {\n\
\t\tvar value,\n\
\t\t\ti = 0,\n\
\t\t\tlength = obj.length,\n\
\t\t\tisArray = isArraylike( obj );\n\
\n\
\t\tif ( args ) {\n\
\t\t\tif ( isArray ) {\n\
\t\t\t\tfor ( ; i < length; i++ ) {\n\
\t\t\t\t\tvalue = callback.apply( obj[ i ], args );\n\
\n\
\t\t\t\t\tif ( value === false ) {\n\
\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\tfor ( i in obj ) {\n\
\t\t\t\t\tvalue = callback.apply( obj[ i ], args );\n\
\n\
\t\t\t\t\tif ( value === false ) {\n\
\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t// A special, fast, case for the most common use of each\n\
\t\t} else {\n\
\t\t\tif ( isArray ) {\n\
\t\t\t\tfor ( ; i < length; i++ ) {\n\
\t\t\t\t\tvalue = callback.call( obj[ i ], i, obj[ i ] );\n\
\n\
\t\t\t\t\tif ( value === false ) {\n\
\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\tfor ( i in obj ) {\n\
\t\t\t\t\tvalue = callback.call( obj[ i ], i, obj[ i ] );\n\
\n\
\t\t\t\t\tif ( value === false ) {\n\
\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn obj;\n\
\t},\n\
\n\
\t// Use native String.trim function wherever possible\n\
\ttrim: core_trim && !core_trim.call(\"\\uFEFF\\xA0\") ?\n\
\t\tfunction( text ) {\n\
\t\t\treturn text == null ?\n\
\t\t\t\t\"\" :\n\
\t\t\t\tcore_trim.call( text );\n\
\t\t} :\n\
\n\
\t\t// Otherwise use our own trimming functionality\n\
\t\tfunction( text ) {\n\
\t\t\treturn text == null ?\n\
\t\t\t\t\"\" :\n\
\t\t\t\t( text + \"\" ).replace( rtrim, \"\" );\n\
\t\t},\n\
\n\
\t// results is for internal usage only\n\
\tmakeArray: function( arr, results ) {\n\
\t\tvar ret = results || [];\n\
\n\
\t\tif ( arr != null ) {\n\
\t\t\tif ( isArraylike( Object(arr) ) ) {\n\
\t\t\t\tjQuery.merge( ret,\n\
\t\t\t\t\ttypeof arr === \"string\" ?\n\
\t\t\t\t\t[ arr ] : arr\n\
\t\t\t\t);\n\
\t\t\t} else {\n\
\t\t\t\tcore_push.call( ret, arr );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn ret;\n\
\t},\n\
\n\
\tinArray: function( elem, arr, i ) {\n\
\t\tvar len;\n\
\n\
\t\tif ( arr ) {\n\
\t\t\tif ( core_indexOf ) {\n\
\t\t\t\treturn core_indexOf.call( arr, elem, i );\n\
\t\t\t}\n\
\n\
\t\t\tlen = arr.length;\n\
\t\t\ti = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;\n\
\n\
\t\t\tfor ( ; i < len; i++ ) {\n\
\t\t\t\t// Skip accessing in sparse arrays\n\
\t\t\t\tif ( i in arr && arr[ i ] === elem ) {\n\
\t\t\t\t\treturn i;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn -1;\n\
\t},\n\
\n\
\tmerge: function( first, second ) {\n\
\t\tvar l = second.length,\n\
\t\t\ti = first.length,\n\
\t\t\tj = 0;\n\
\n\
\t\tif ( typeof l === \"number\" ) {\n\
\t\t\tfor ( ; j < l; j++ ) {\n\
\t\t\t\tfirst[ i++ ] = second[ j ];\n\
\t\t\t}\n\
\t\t} else {\n\
\t\t\twhile ( second[j] !== undefined ) {\n\
\t\t\t\tfirst[ i++ ] = second[ j++ ];\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\tfirst.length = i;\n\
\n\
\t\treturn first;\n\
\t},\n\
\n\
\tgrep: function( elems, callback, inv ) {\n\
\t\tvar retVal,\n\
\t\t\tret = [],\n\
\t\t\ti = 0,\n\
\t\t\tlength = elems.length;\n\
\t\tinv = !!inv;\n\
\n\
\t\t// Go through the array, only saving the items\n\
\t\t// that pass the validator function\n\
\t\tfor ( ; i < length; i++ ) {\n\
\t\t\tretVal = !!callback( elems[ i ], i );\n\
\t\t\tif ( inv !== retVal ) {\n\
\t\t\t\tret.push( elems[ i ] );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn ret;\n\
\t},\n\
\n\
\t// arg is for internal usage only\n\
\tmap: function( elems, callback, arg ) {\n\
\t\tvar value,\n\
\t\t\ti = 0,\n\
\t\t\tlength = elems.length,\n\
\t\t\tisArray = isArraylike( elems ),\n\
\t\t\tret = [];\n\
\n\
\t\t// Go through the array, translating each of the items to their\n\
\t\tif ( isArray ) {\n\
\t\t\tfor ( ; i < length; i++ ) {\n\
\t\t\t\tvalue = callback( elems[ i ], i, arg );\n\
\n\
\t\t\t\tif ( value != null ) {\n\
\t\t\t\t\tret[ ret.length ] = value;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t// Go through every key on the object,\n\
\t\t} else {\n\
\t\t\tfor ( i in elems ) {\n\
\t\t\t\tvalue = callback( elems[ i ], i, arg );\n\
\n\
\t\t\t\tif ( value != null ) {\n\
\t\t\t\t\tret[ ret.length ] = value;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Flatten any nested arrays\n\
\t\treturn core_concat.apply( [], ret );\n\
\t},\n\
\n\
\t// A global GUID counter for objects\n\
\tguid: 1,\n\
\n\
\t// Bind a function to a context, optionally partially applying any\n\
\t// arguments.\n\
\tproxy: function( fn, context ) {\n\
\t\tvar args, proxy, tmp;\n\
\n\
\t\tif ( typeof context === \"string\" ) {\n\
\t\t\ttmp = fn[ context ];\n\
\t\t\tcontext = fn;\n\
\t\t\tfn = tmp;\n\
\t\t}\n\
\n\
\t\t// Quick check to determine if target is callable, in the spec\n\
\t\t// this throws a TypeError, but we will just return undefined.\n\
\t\tif ( !jQuery.isFunction( fn ) ) {\n\
\t\t\treturn undefined;\n\
\t\t}\n\
\n\
\t\t// Simulated bind\n\
\t\targs = core_slice.call( arguments, 2 );\n\
\t\tproxy = function() {\n\
\t\t\treturn fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );\n\
\t\t};\n\
\n\
\t\t// Set the guid of unique handler to the same of original handler, so it can be removed\n\
\t\tproxy.guid = fn.guid = fn.guid || jQuery.guid++;\n\
\n\
\t\treturn proxy;\n\
\t},\n\
\n\
\t// Multifunctional method to get and set values of a collection\n\
\t// The value/s can optionally be executed if it's a function\n\
\taccess: function( elems, fn, key, value, chainable, emptyGet, raw ) {\n\
\t\tvar i = 0,\n\
\t\t\tlength = elems.length,\n\
\t\t\tbulk = key == null;\n\
\n\
\t\t// Sets many values\n\
\t\tif ( jQuery.type( key ) === \"object\" ) {\n\
\t\t\tchainable = true;\n\
\t\t\tfor ( i in key ) {\n\
\t\t\t\tjQuery.access( elems, fn, i, key[i], true, emptyGet, raw );\n\
\t\t\t}\n\
\n\
\t\t// Sets one value\n\
\t\t} else if ( value !== undefined ) {\n\
\t\t\tchainable = true;\n\
\n\
\t\t\tif ( !jQuery.isFunction( value ) ) {\n\
\t\t\t\traw = true;\n\
\t\t\t}\n\
\n\
\t\t\tif ( bulk ) {\n\
\t\t\t\t// Bulk operations run against the entire set\n\
\t\t\t\tif ( raw ) {\n\
\t\t\t\t\tfn.call( elems, value );\n\
\t\t\t\t\tfn = null;\n\
\n\
\t\t\t\t// ...except when executing function values\n\
\t\t\t\t} else {\n\
\t\t\t\t\tbulk = fn;\n\
\t\t\t\t\tfn = function( elem, key, value ) {\n\
\t\t\t\t\t\treturn bulk.call( jQuery( elem ), value );\n\
\t\t\t\t\t};\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\tif ( fn ) {\n\
\t\t\t\tfor ( ; i < length; i++ ) {\n\
\t\t\t\t\tfn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn chainable ?\n\
\t\t\telems :\n\
\n\
\t\t\t// Gets\n\
\t\t\tbulk ?\n\
\t\t\t\tfn.call( elems ) :\n\
\t\t\t\tlength ? fn( elems[0], key ) : emptyGet;\n\
\t},\n\
\n\
\tnow: function() {\n\
\t\treturn ( new Date() ).getTime();\n\
\t}\n\
});\n\
\n\
jQuery.ready.promise = function( obj ) {\n\
\tif ( !readyList ) {\n\
\n\
\t\treadyList = jQuery.Deferred();\n\
\n\
\t\t// Catch cases where $(document).ready() is called after the browser event has already occurred.\n\
\t\t// we once tried to use readyState \"interactive\" here, but it caused issues like the one\n\
\t\t// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15\n\
\t\tif ( document.readyState === \"complete\" ) {\n\
\t\t\t// Handle it asynchronously to allow scripts the opportunity to delay ready\n\
\t\t\tsetTimeout( jQuery.ready );\n\
\n\
\t\t// Standards-based browsers support DOMContentLoaded\n\
\t\t} else if ( document.addEventListener ) {\n\
\t\t\t// Use the handy event callback\n\
\t\t\tdocument.addEventListener( \"DOMContentLoaded\", completed, false );\n\
\n\
\t\t\t// A fallback to window.onload, that will always work\n\
\t\t\twindow.addEventListener( \"load\", completed, false );\n\
\n\
\t\t// If IE event model is used\n\
\t\t} else {\n\
\t\t\t// Ensure firing before onload, maybe late but safe also for iframes\n\
\t\t\tdocument.attachEvent( \"onreadystatechange\", completed );\n\
\n\
\t\t\t// A fallback to window.onload, that will always work\n\
\t\t\twindow.attachEvent( \"onload\", completed );\n\
\n\
\t\t\t// If IE and not a frame\n\
\t\t\t// continually check to see if the document is ready\n\
\t\t\tvar top = false;\n\
\n\
\t\t\ttry {\n\
\t\t\t\ttop = window.frameElement == null && document.documentElement;\n\
\t\t\t} catch(e) {}\n\
\n\
\t\t\tif ( top && top.doScroll ) {\n\
\t\t\t\t(function doScrollCheck() {\n\
\t\t\t\t\tif ( !jQuery.isReady ) {\n\
\n\
\t\t\t\t\t\ttry {\n\
\t\t\t\t\t\t\t// Use the trick by Diego Perini\n\
\t\t\t\t\t\t\t// http://javascript.nwbox.com/IEContentLoaded/\n\
\t\t\t\t\t\t\ttop.doScroll(\"left\");\n\
\t\t\t\t\t\t} catch(e) {\n\
\t\t\t\t\t\t\treturn setTimeout( doScrollCheck, 50 );\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t// detach all dom ready events\n\
\t\t\t\t\t\tdetach();\n\
\n\
\t\t\t\t\t\t// and execute any waiting functions\n\
\t\t\t\t\t\tjQuery.ready();\n\
\t\t\t\t\t}\n\
\t\t\t\t})();\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\treturn readyList.promise( obj );\n\
};\n\
\n\
// Populate the class2type map\n\
jQuery.each(\"Boolean Number String Function Array Date RegExp Object Error\".split(\" \"), function(i, name) {\n\
\tclass2type[ \"[object \" + name + \"]\" ] = name.toLowerCase();\n\
});\n\
\n\
function isArraylike( obj ) {\n\
\tvar length = obj.length,\n\
\t\ttype = jQuery.type( obj );\n\
\n\
\tif ( jQuery.isWindow( obj ) ) {\n\
\t\treturn false;\n\
\t}\n\
\n\
\tif ( obj.nodeType === 1 && length ) {\n\
\t\treturn true;\n\
\t}\n\
\n\
\treturn type === \"array\" || type !== \"function\" &&\n\
\t\t( length === 0 ||\n\
\t\ttypeof length === \"number\" && length > 0 && ( length - 1 ) in obj );\n\
}\n\
\n\
// All jQuery objects should point back to these\n\
rootjQuery = jQuery(document);\n\
// String to Object options format cache\n\
var optionsCache = {};\n\
\n\
// Convert String-formatted options into Object-formatted ones and store in cache\n\
function createOptions( options ) {\n\
\tvar object = optionsCache[ options ] = {};\n\
\tjQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {\n\
\t\tobject[ flag ] = true;\n\
\t});\n\
\treturn object;\n\
}\n\
\n\
/*\n\
 * Create a callback list using the following parameters:\n\
 *\n\
 *\toptions: an optional list of space-separated options that will change how\n\
 *\t\t\tthe callback list behaves or a more traditional option object\n\
 *\n\
 * By default a callback list will act like an event callback list and can be\n\
 * \"fired\" multiple times.\n\
 *\n\
 * Possible options:\n\
 *\n\
 *\tonce:\t\t\twill ensure the callback list can only be fired once (like a Deferred)\n\
 *\n\
 *\tmemory:\t\t\twill keep track of previous values and will call any callback added\n\
 *\t\t\t\t\tafter the list has been fired right away with the latest \"memorized\"\n\
 *\t\t\t\t\tvalues (like a Deferred)\n\
 *\n\
 *\tunique:\t\t\twill ensure a callback can only be added once (no duplicate in the list)\n\
 *\n\
 *\tstopOnFalse:\tinterrupt callings when a callback returns false\n\
 *\n\
 */\n\
jQuery.Callbacks = function( options ) {\n\
\n\
\t// Convert options from String-formatted to Object-formatted if needed\n\
\t// (we check in cache first)\n\
\toptions = typeof options === \"string\" ?\n\
\t\t( optionsCache[ options ] || createOptions( options ) ) :\n\
\t\tjQuery.extend( {}, options );\n\
\n\
\tvar // Flag to know if list is currently firing\n\
\t\tfiring,\n\
\t\t// Last fire value (for non-forgettable lists)\n\
\t\tmemory,\n\
\t\t// Flag to know if list was already fired\n\
\t\tfired,\n\
\t\t// End of the loop when firing\n\
\t\tfiringLength,\n\
\t\t// Index of currently firing callback (modified by remove if needed)\n\
\t\tfiringIndex,\n\
\t\t// First callback to fire (used internally by add and fireWith)\n\
\t\tfiringStart,\n\
\t\t// Actual callback list\n\
\t\tlist = [],\n\
\t\t// Stack of fire calls for repeatable lists\n\
\t\tstack = !options.once && [],\n\
\t\t// Fire callbacks\n\
\t\tfire = function( data ) {\n\
\t\t\tmemory = options.memory && data;\n\
\t\t\tfired = true;\n\
\t\t\tfiringIndex = firingStart || 0;\n\
\t\t\tfiringStart = 0;\n\
\t\t\tfiringLength = list.length;\n\
\t\t\tfiring = true;\n\
\t\t\tfor ( ; list && firingIndex < firingLength; firingIndex++ ) {\n\
\t\t\t\tif ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {\n\
\t\t\t\t\tmemory = false; // To prevent further calls using add\n\
\t\t\t\t\tbreak;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\tfiring = false;\n\
\t\t\tif ( list ) {\n\
\t\t\t\tif ( stack ) {\n\
\t\t\t\t\tif ( stack.length ) {\n\
\t\t\t\t\t\tfire( stack.shift() );\n\
\t\t\t\t\t}\n\
\t\t\t\t} else if ( memory ) {\n\
\t\t\t\t\tlist = [];\n\
\t\t\t\t} else {\n\
\t\t\t\t\tself.disable();\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t},\n\
\t\t// Actual Callbacks object\n\
\t\tself = {\n\
\t\t\t// Add a callback or a collection of callbacks to the list\n\
\t\t\tadd: function() {\n\
\t\t\t\tif ( list ) {\n\
\t\t\t\t\t// First, we save the current length\n\
\t\t\t\t\tvar start = list.length;\n\
\t\t\t\t\t(function add( args ) {\n\
\t\t\t\t\t\tjQuery.each( args, function( _, arg ) {\n\
\t\t\t\t\t\t\tvar type = jQuery.type( arg );\n\
\t\t\t\t\t\t\tif ( type === \"function\" ) {\n\
\t\t\t\t\t\t\t\tif ( !options.unique || !self.has( arg ) ) {\n\
\t\t\t\t\t\t\t\t\tlist.push( arg );\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t} else if ( arg && arg.length && type !== \"string\" ) {\n\
\t\t\t\t\t\t\t\t// Inspect recursively\n\
\t\t\t\t\t\t\t\tadd( arg );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t});\n\
\t\t\t\t\t})( arguments );\n\
\t\t\t\t\t// Do we need to add the callbacks to the\n\
\t\t\t\t\t// current firing batch?\n\
\t\t\t\t\tif ( firing ) {\n\
\t\t\t\t\t\tfiringLength = list.length;\n\
\t\t\t\t\t// With memory, if we're not firing then\n\
\t\t\t\t\t// we should call right away\n\
\t\t\t\t\t} else if ( memory ) {\n\
\t\t\t\t\t\tfiringStart = start;\n\
\t\t\t\t\t\tfire( memory );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t\treturn this;\n\
\t\t\t},\n\
\t\t\t// Remove a callback from the list\n\
\t\t\tremove: function() {\n\
\t\t\t\tif ( list ) {\n\
\t\t\t\t\tjQuery.each( arguments, function( _, arg ) {\n\
\t\t\t\t\t\tvar index;\n\
\t\t\t\t\t\twhile( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {\n\
\t\t\t\t\t\t\tlist.splice( index, 1 );\n\
\t\t\t\t\t\t\t// Handle firing indexes\n\
\t\t\t\t\t\t\tif ( firing ) {\n\
\t\t\t\t\t\t\t\tif ( index <= firingLength ) {\n\
\t\t\t\t\t\t\t\t\tfiringLength--;\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t\tif ( index <= firingIndex ) {\n\
\t\t\t\t\t\t\t\t\tfiringIndex--;\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t});\n\
\t\t\t\t}\n\
\t\t\t\treturn this;\n\
\t\t\t},\n\
\t\t\t// Check if a given callback is in the list.\n\
\t\t\t// If no argument is given, return whether or not list has callbacks attached.\n\
\t\t\thas: function( fn ) {\n\
\t\t\t\treturn fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );\n\
\t\t\t},\n\
\t\t\t// Remove all callbacks from the list\n\
\t\t\tempty: function() {\n\
\t\t\t\tlist = [];\n\
\t\t\t\treturn this;\n\
\t\t\t},\n\
\t\t\t// Have the list do nothing anymore\n\
\t\t\tdisable: function() {\n\
\t\t\t\tlist = stack = memory = undefined;\n\
\t\t\t\treturn this;\n\
\t\t\t},\n\
\t\t\t// Is it disabled?\n\
\t\t\tdisabled: function() {\n\
\t\t\t\treturn !list;\n\
\t\t\t},\n\
\t\t\t// Lock the list in its current state\n\
\t\t\tlock: function() {\n\
\t\t\t\tstack = undefined;\n\
\t\t\t\tif ( !memory ) {\n\
\t\t\t\t\tself.disable();\n\
\t\t\t\t}\n\
\t\t\t\treturn this;\n\
\t\t\t},\n\
\t\t\t// Is it locked?\n\
\t\t\tlocked: function() {\n\
\t\t\t\treturn !stack;\n\
\t\t\t},\n\
\t\t\t// Call all callbacks with the given context and arguments\n\
\t\t\tfireWith: function( context, args ) {\n\
\t\t\t\targs = args || [];\n\
\t\t\t\targs = [ context, args.slice ? args.slice() : args ];\n\
\t\t\t\tif ( list && ( !fired || stack ) ) {\n\
\t\t\t\t\tif ( firing ) {\n\
\t\t\t\t\t\tstack.push( args );\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\tfire( args );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t\treturn this;\n\
\t\t\t},\n\
\t\t\t// Call all the callbacks with the given arguments\n\
\t\t\tfire: function() {\n\
\t\t\t\tself.fireWith( this, arguments );\n\
\t\t\t\treturn this;\n\
\t\t\t},\n\
\t\t\t// To know if the callbacks have already been called at least once\n\
\t\t\tfired: function() {\n\
\t\t\t\treturn !!fired;\n\
\t\t\t}\n\
\t\t};\n\
\n\
\treturn self;\n\
};\n\
jQuery.extend({\n\
\n\
\tDeferred: function( func ) {\n\
\t\tvar tuples = [\n\
\t\t\t\t// action, add listener, listener list, final state\n\
\t\t\t\t[ \"resolve\", \"done\", jQuery.Callbacks(\"once memory\"), \"resolved\" ],\n\
\t\t\t\t[ \"reject\", \"fail\", jQuery.Callbacks(\"once memory\"), \"rejected\" ],\n\
\t\t\t\t[ \"notify\", \"progress\", jQuery.Callbacks(\"memory\") ]\n\
\t\t\t],\n\
\t\t\tstate = \"pending\",\n\
\t\t\tpromise = {\n\
\t\t\t\tstate: function() {\n\
\t\t\t\t\treturn state;\n\
\t\t\t\t},\n\
\t\t\t\talways: function() {\n\
\t\t\t\t\tdeferred.done( arguments ).fail( arguments );\n\
\t\t\t\t\treturn this;\n\
\t\t\t\t},\n\
\t\t\t\tthen: function( /* fnDone, fnFail, fnProgress */ ) {\n\
\t\t\t\t\tvar fns = arguments;\n\
\t\t\t\t\treturn jQuery.Deferred(function( newDefer ) {\n\
\t\t\t\t\t\tjQuery.each( tuples, function( i, tuple ) {\n\
\t\t\t\t\t\t\tvar action = tuple[ 0 ],\n\
\t\t\t\t\t\t\t\tfn = jQuery.isFunction( fns[ i ] ) && fns[ i ];\n\
\t\t\t\t\t\t\t// deferred[ done | fail | progress ] for forwarding actions to newDefer\n\
\t\t\t\t\t\t\tdeferred[ tuple[1] ](function() {\n\
\t\t\t\t\t\t\t\tvar returned = fn && fn.apply( this, arguments );\n\
\t\t\t\t\t\t\t\tif ( returned && jQuery.isFunction( returned.promise ) ) {\n\
\t\t\t\t\t\t\t\t\treturned.promise()\n\
\t\t\t\t\t\t\t\t\t\t.done( newDefer.resolve )\n\
\t\t\t\t\t\t\t\t\t\t.fail( newDefer.reject )\n\
\t\t\t\t\t\t\t\t\t\t.progress( newDefer.notify );\n\
\t\t\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\t\t\tnewDefer[ action + \"With\" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t});\n\
\t\t\t\t\t\t});\n\
\t\t\t\t\t\tfns = null;\n\
\t\t\t\t\t}).promise();\n\
\t\t\t\t},\n\
\t\t\t\t// Get a promise for this deferred\n\
\t\t\t\t// If obj is provided, the promise aspect is added to the object\n\
\t\t\t\tpromise: function( obj ) {\n\
\t\t\t\t\treturn obj != null ? jQuery.extend( obj, promise ) : promise;\n\
\t\t\t\t}\n\
\t\t\t},\n\
\t\t\tdeferred = {};\n\
\n\
\t\t// Keep pipe for back-compat\n\
\t\tpromise.pipe = promise.then;\n\
\n\
\t\t// Add list-specific methods\n\
\t\tjQuery.each( tuples, function( i, tuple ) {\n\
\t\t\tvar list = tuple[ 2 ],\n\
\t\t\t\tstateString = tuple[ 3 ];\n\
\n\
\t\t\t// promise[ done | fail | progress ] = list.add\n\
\t\t\tpromise[ tuple[1] ] = list.add;\n\
\n\
\t\t\t// Handle state\n\
\t\t\tif ( stateString ) {\n\
\t\t\t\tlist.add(function() {\n\
\t\t\t\t\t// state = [ resolved | rejected ]\n\
\t\t\t\t\tstate = stateString;\n\
\n\
\t\t\t\t// [ reject_list | resolve_list ].disable; progress_list.lock\n\
\t\t\t\t}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );\n\
\t\t\t}\n\
\n\
\t\t\t// deferred[ resolve | reject | notify ]\n\
\t\t\tdeferred[ tuple[0] ] = function() {\n\
\t\t\t\tdeferred[ tuple[0] + \"With\" ]( this === deferred ? promise : this, arguments );\n\
\t\t\t\treturn this;\n\
\t\t\t};\n\
\t\t\tdeferred[ tuple[0] + \"With\" ] = list.fireWith;\n\
\t\t});\n\
\n\
\t\t// Make the deferred a promise\n\
\t\tpromise.promise( deferred );\n\
\n\
\t\t// Call given func if any\n\
\t\tif ( func ) {\n\
\t\t\tfunc.call( deferred, deferred );\n\
\t\t}\n\
\n\
\t\t// All done!\n\
\t\treturn deferred;\n\
\t},\n\
\n\
\t// Deferred helper\n\
\twhen: function( subordinate /* , ..., subordinateN */ ) {\n\
\t\tvar i = 0,\n\
\t\t\tresolveValues = core_slice.call( arguments ),\n\
\t\t\tlength = resolveValues.length,\n\
\n\
\t\t\t// the count of uncompleted subordinates\n\
\t\t\tremaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,\n\
\n\
\t\t\t// the master Deferred. If resolveValues consist of only a single Deferred, just use that.\n\
\t\t\tdeferred = remaining === 1 ? subordinate : jQuery.Deferred(),\n\
\n\
\t\t\t// Update function for both resolve and progress values\n\
\t\t\tupdateFunc = function( i, contexts, values ) {\n\
\t\t\t\treturn function( value ) {\n\
\t\t\t\t\tcontexts[ i ] = this;\n\
\t\t\t\t\tvalues[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;\n\
\t\t\t\t\tif( values === progressValues ) {\n\
\t\t\t\t\t\tdeferred.notifyWith( contexts, values );\n\
\t\t\t\t\t} else if ( !( --remaining ) ) {\n\
\t\t\t\t\t\tdeferred.resolveWith( contexts, values );\n\
\t\t\t\t\t}\n\
\t\t\t\t};\n\
\t\t\t},\n\
\n\
\t\t\tprogressValues, progressContexts, resolveContexts;\n\
\n\
\t\t// add listeners to Deferred subordinates; treat others as resolved\n\
\t\tif ( length > 1 ) {\n\
\t\t\tprogressValues = new Array( length );\n\
\t\t\tprogressContexts = new Array( length );\n\
\t\t\tresolveContexts = new Array( length );\n\
\t\t\tfor ( ; i < length; i++ ) {\n\
\t\t\t\tif ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {\n\
\t\t\t\t\tresolveValues[ i ].promise()\n\
\t\t\t\t\t\t.done( updateFunc( i, resolveContexts, resolveValues ) )\n\
\t\t\t\t\t\t.fail( deferred.reject )\n\
\t\t\t\t\t\t.progress( updateFunc( i, progressContexts, progressValues ) );\n\
\t\t\t\t} else {\n\
\t\t\t\t\t--remaining;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// if we're not waiting on anything, resolve the master\n\
\t\tif ( !remaining ) {\n\
\t\t\tdeferred.resolveWith( resolveContexts, resolveValues );\n\
\t\t}\n\
\n\
\t\treturn deferred.promise();\n\
\t}\n\
});\n\
jQuery.support = (function() {\n\
\n\
\tvar support, all, a,\n\
\t\tinput, select, fragment,\n\
\t\topt, eventName, isSupported, i,\n\
\t\tdiv = document.createElement(\"div\");\n\
\n\
\t// Setup\n\
\tdiv.setAttribute( \"className\", \"t\" );\n\
\tdiv.innerHTML = \"  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>\";\n\
\n\
\t// Support tests won't run in some limited or non-browser environments\n\
\tall = div.getElementsByTagName(\"*\");\n\
\ta = div.getElementsByTagName(\"a\")[ 0 ];\n\
\tif ( !all || !a || !all.length ) {\n\
\t\treturn {};\n\
\t}\n\
\n\
\t// First batch of tests\n\
\tselect = document.createElement(\"select\");\n\
\topt = select.appendChild( document.createElement(\"option\") );\n\
\tinput = div.getElementsByTagName(\"input\")[ 0 ];\n\
\n\
\ta.style.cssText = \"top:1px;float:left;opacity:.5\";\n\
\tsupport = {\n\
\t\t// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)\n\
\t\tgetSetAttribute: div.className !== \"t\",\n\
\n\
\t\t// IE strips leading whitespace when .innerHTML is used\n\
\t\tleadingWhitespace: div.firstChild.nodeType === 3,\n\
\n\
\t\t// Make sure that tbody elements aren't automatically inserted\n\
\t\t// IE will insert them into empty tables\n\
\t\ttbody: !div.getElementsByTagName(\"tbody\").length,\n\
\n\
\t\t// Make sure that link elements get serialized correctly by innerHTML\n\
\t\t// This requires a wrapper element in IE\n\
\t\thtmlSerialize: !!div.getElementsByTagName(\"link\").length,\n\
\n\
\t\t// Get the style information from getAttribute\n\
\t\t// (IE uses .cssText instead)\n\
\t\tstyle: /top/.test( a.getAttribute(\"style\") ),\n\
\n\
\t\t// Make sure that URLs aren't manipulated\n\
\t\t// (IE normalizes it by default)\n\
\t\threfNormalized: a.getAttribute(\"href\") === \"/a\",\n\
\n\
\t\t// Make sure that element opacity exists\n\
\t\t// (IE uses filter instead)\n\
\t\t// Use a regex to work around a WebKit issue. See #5145\n\
\t\topacity: /^0.5/.test( a.style.opacity ),\n\
\n\
\t\t// Verify style float existence\n\
\t\t// (IE uses styleFloat instead of cssFloat)\n\
\t\tcssFloat: !!a.style.cssFloat,\n\
\n\
\t\t// Check the default checkbox/radio value (\"\" on WebKit; \"on\" elsewhere)\n\
\t\tcheckOn: !!input.value,\n\
\n\
\t\t// Make sure that a selected-by-default option has a working selected property.\n\
\t\t// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)\n\
\t\toptSelected: opt.selected,\n\
\n\
\t\t// Tests for enctype support on a form (#6743)\n\
\t\tenctype: !!document.createElement(\"form\").enctype,\n\
\n\
\t\t// Makes sure cloning an html5 element does not cause problems\n\
\t\t// Where outerHTML is undefined, this still works\n\
\t\thtml5Clone: document.createElement(\"nav\").cloneNode( true ).outerHTML !== \"<:nav></:nav>\",\n\
\n\
\t\t// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode\n\
\t\tboxModel: document.compatMode === \"CSS1Compat\",\n\
\n\
\t\t// Will be defined later\n\
\t\tdeleteExpando: true,\n\
\t\tnoCloneEvent: true,\n\
\t\tinlineBlockNeedsLayout: false,\n\
\t\tshrinkWrapBlocks: false,\n\
\t\treliableMarginRight: true,\n\
\t\tboxSizingReliable: true,\n\
\t\tpixelPosition: false\n\
\t};\n\
\n\
\t// Make sure checked status is properly cloned\n\
\tinput.checked = true;\n\
\tsupport.noCloneChecked = input.cloneNode( true ).checked;\n\
\n\
\t// Make sure that the options inside disabled selects aren't marked as disabled\n\
\t// (WebKit marks them as disabled)\n\
\tselect.disabled = true;\n\
\tsupport.optDisabled = !opt.disabled;\n\
\n\
\t// Support: IE<9\n\
\ttry {\n\
\t\tdelete div.test;\n\
\t} catch( e ) {\n\
\t\tsupport.deleteExpando = false;\n\
\t}\n\
\n\
\t// Check if we can trust getAttribute(\"value\")\n\
\tinput = document.createElement(\"input\");\n\
\tinput.setAttribute( \"value\", \"\" );\n\
\tsupport.input = input.getAttribute( \"value\" ) === \"\";\n\
\n\
\t// Check if an input maintains its value after becoming a radio\n\
\tinput.value = \"t\";\n\
\tinput.setAttribute( \"type\", \"radio\" );\n\
\tsupport.radioValue = input.value === \"t\";\n\
\n\
\t// #11217 - WebKit loses check when the name is after the checked attribute\n\
\tinput.setAttribute( \"checked\", \"t\" );\n\
\tinput.setAttribute( \"name\", \"t\" );\n\
\n\
\tfragment = document.createDocumentFragment();\n\
\tfragment.appendChild( input );\n\
\n\
\t// Check if a disconnected checkbox will retain its checked\n\
\t// value of true after appended to the DOM (IE6/7)\n\
\tsupport.appendChecked = input.checked;\n\
\n\
\t// WebKit doesn't clone checked state correctly in fragments\n\
\tsupport.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;\n\
\n\
\t// Support: IE<9\n\
\t// Opera does not clone events (and typeof div.attachEvent === undefined).\n\
\t// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()\n\
\tif ( div.attachEvent ) {\n\
\t\tdiv.attachEvent( \"onclick\", function() {\n\
\t\t\tsupport.noCloneEvent = false;\n\
\t\t});\n\
\n\
\t\tdiv.cloneNode( true ).click();\n\
\t}\n\
\n\
\t// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)\n\
\t// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php\n\
\tfor ( i in { submit: true, change: true, focusin: true }) {\n\
\t\tdiv.setAttribute( eventName = \"on\" + i, \"t\" );\n\
\n\
\t\tsupport[ i + \"Bubbles\" ] = eventName in window || div.attributes[ eventName ].expando === false;\n\
\t}\n\
\n\
\tdiv.style.backgroundClip = \"content-box\";\n\
\tdiv.cloneNode( true ).style.backgroundClip = \"\";\n\
\tsupport.clearCloneStyle = div.style.backgroundClip === \"content-box\";\n\
\n\
\t// Run tests that need a body at doc ready\n\
\tjQuery(function() {\n\
\t\tvar container, marginDiv, tds,\n\
\t\t\tdivReset = \"padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;\",\n\
\t\t\tbody = document.getElementsByTagName(\"body\")[0];\n\
\n\
\t\tif ( !body ) {\n\
\t\t\t// Return for frameset docs that don't have a body\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\tcontainer = document.createElement(\"div\");\n\
\t\tcontainer.style.cssText = \"border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px\";\n\
\n\
\t\tbody.appendChild( container ).appendChild( div );\n\
\n\
\t\t// Support: IE8\n\
\t\t// Check if table cells still have offsetWidth/Height when they are set\n\
\t\t// to display:none and there are still other visible table cells in a\n\
\t\t// table row; if so, offsetWidth/Height are not reliable for use when\n\
\t\t// determining if an element has been hidden directly using\n\
\t\t// display:none (it is still safe to use offsets if a parent element is\n\
\t\t// hidden; don safety goggles and see bug #4512 for more information).\n\
\t\tdiv.innerHTML = \"<table><tr><td></td><td>t</td></tr></table>\";\n\
\t\ttds = div.getElementsByTagName(\"td\");\n\
\t\ttds[ 0 ].style.cssText = \"padding:0;margin:0;border:0;display:none\";\n\
\t\tisSupported = ( tds[ 0 ].offsetHeight === 0 );\n\
\n\
\t\ttds[ 0 ].style.display = \"\";\n\
\t\ttds[ 1 ].style.display = \"none\";\n\
\n\
\t\t// Support: IE8\n\
\t\t// Check if empty table cells still have offsetWidth/Height\n\
\t\tsupport.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );\n\
\n\
\t\t// Check box-sizing and margin behavior\n\
\t\tdiv.innerHTML = \"\";\n\
\t\tdiv.style.cssText = \"box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;\";\n\
\t\tsupport.boxSizing = ( div.offsetWidth === 4 );\n\
\t\tsupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );\n\
\n\
\t\t// Use window.getComputedStyle because jsdom on node.js will break without it.\n\
\t\tif ( window.getComputedStyle ) {\n\
\t\t\tsupport.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== \"1%\";\n\
\t\t\tsupport.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: \"4px\" } ).width === \"4px\";\n\
\n\
\t\t\t// Check if div with explicit width and no margin-right incorrectly\n\
\t\t\t// gets computed margin-right based on width of container. (#3333)\n\
\t\t\t// Fails in WebKit before Feb 2011 nightlies\n\
\t\t\t// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right\n\
\t\t\tmarginDiv = div.appendChild( document.createElement(\"div\") );\n\
\t\t\tmarginDiv.style.cssText = div.style.cssText = divReset;\n\
\t\t\tmarginDiv.style.marginRight = marginDiv.style.width = \"0\";\n\
\t\t\tdiv.style.width = \"1px\";\n\
\n\
\t\t\tsupport.reliableMarginRight =\n\
\t\t\t\t!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );\n\
\t\t}\n\
\n\
\t\tif ( typeof div.style.zoom !== core_strundefined ) {\n\
\t\t\t// Support: IE<8\n\
\t\t\t// Check if natively block-level elements act like inline-block\n\
\t\t\t// elements when setting their display to 'inline' and giving\n\
\t\t\t// them layout\n\
\t\t\tdiv.innerHTML = \"\";\n\
\t\t\tdiv.style.cssText = divReset + \"width:1px;padding:1px;display:inline;zoom:1\";\n\
\t\t\tsupport.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );\n\
\n\
\t\t\t// Support: IE6\n\
\t\t\t// Check if elements with layout shrink-wrap their children\n\
\t\t\tdiv.style.display = \"block\";\n\
\t\t\tdiv.innerHTML = \"<div></div>\";\n\
\t\t\tdiv.firstChild.style.width = \"5px\";\n\
\t\t\tsupport.shrinkWrapBlocks = ( div.offsetWidth !== 3 );\n\
\n\
\t\t\tif ( support.inlineBlockNeedsLayout ) {\n\
\t\t\t\t// Prevent IE 6 from affecting layout for positioned elements #11048\n\
\t\t\t\t// Prevent IE from shrinking the body in IE 7 mode #12869\n\
\t\t\t\t// Support: IE<8\n\
\t\t\t\tbody.style.zoom = 1;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\tbody.removeChild( container );\n\
\n\
\t\t// Null elements to avoid leaks in IE\n\
\t\tcontainer = div = tds = marginDiv = null;\n\
\t});\n\
\n\
\t// Null elements to avoid leaks in IE\n\
\tall = select = fragment = opt = a = input = null;\n\
\n\
\treturn support;\n\
})();\n\
\n\
var rbrace = /(?:\\{[\\s\\S]*\\}|\\[[\\s\\S]*\\])$/,\n\
\trmultiDash = /([A-Z])/g;\n\
\n\
function internalData( elem, name, data, pvt /* Internal Use Only */ ){\n\
\tif ( !jQuery.acceptData( elem ) ) {\n\
\t\treturn;\n\
\t}\n\
\n\
\tvar thisCache, ret,\n\
\t\tinternalKey = jQuery.expando,\n\
\t\tgetByName = typeof name === \"string\",\n\
\n\
\t\t// We have to handle DOM nodes and JS objects differently because IE6-7\n\
\t\t// can't GC object references properly across the DOM-JS boundary\n\
\t\tisNode = elem.nodeType,\n\
\n\
\t\t// Only DOM nodes need the global jQuery cache; JS object data is\n\
\t\t// attached directly to the object so GC can occur automatically\n\
\t\tcache = isNode ? jQuery.cache : elem,\n\
\n\
\t\t// Only defining an ID for JS objects if its cache already exists allows\n\
\t\t// the code to shortcut on the same path as a DOM node with no cache\n\
\t\tid = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;\n\
\n\
\t// Avoid doing any more work than we need to when trying to get data on an\n\
\t// object that has no data at all\n\
\tif ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {\n\
\t\treturn;\n\
\t}\n\
\n\
\tif ( !id ) {\n\
\t\t// Only DOM nodes need a new unique ID for each element since their data\n\
\t\t// ends up in the global cache\n\
\t\tif ( isNode ) {\n\
\t\t\telem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;\n\
\t\t} else {\n\
\t\t\tid = internalKey;\n\
\t\t}\n\
\t}\n\
\n\
\tif ( !cache[ id ] ) {\n\
\t\tcache[ id ] = {};\n\
\n\
\t\t// Avoids exposing jQuery metadata on plain JS objects when the object\n\
\t\t// is serialized using JSON.stringify\n\
\t\tif ( !isNode ) {\n\
\t\t\tcache[ id ].toJSON = jQuery.noop;\n\
\t\t}\n\
\t}\n\
\n\
\t// An object can be passed to jQuery.data instead of a key/value pair; this gets\n\
\t// shallow copied over onto the existing cache\n\
\tif ( typeof name === \"object\" || typeof name === \"function\" ) {\n\
\t\tif ( pvt ) {\n\
\t\t\tcache[ id ] = jQuery.extend( cache[ id ], name );\n\
\t\t} else {\n\
\t\t\tcache[ id ].data = jQuery.extend( cache[ id ].data, name );\n\
\t\t}\n\
\t}\n\
\n\
\tthisCache = cache[ id ];\n\
\n\
\t// jQuery data() is stored in a separate object inside the object's internal data\n\
\t// cache in order to avoid key collisions between internal data and user-defined\n\
\t// data.\n\
\tif ( !pvt ) {\n\
\t\tif ( !thisCache.data ) {\n\
\t\t\tthisCache.data = {};\n\
\t\t}\n\
\n\
\t\tthisCache = thisCache.data;\n\
\t}\n\
\n\
\tif ( data !== undefined ) {\n\
\t\tthisCache[ jQuery.camelCase( name ) ] = data;\n\
\t}\n\
\n\
\t// Check for both converted-to-camel and non-converted data property names\n\
\t// If a data property was specified\n\
\tif ( getByName ) {\n\
\n\
\t\t// First Try to find as-is property data\n\
\t\tret = thisCache[ name ];\n\
\n\
\t\t// Test for null|undefined property data\n\
\t\tif ( ret == null ) {\n\
\n\
\t\t\t// Try to find the camelCased property\n\
\t\t\tret = thisCache[ jQuery.camelCase( name ) ];\n\
\t\t}\n\
\t} else {\n\
\t\tret = thisCache;\n\
\t}\n\
\n\
\treturn ret;\n\
}\n\
\n\
function internalRemoveData( elem, name, pvt ) {\n\
\tif ( !jQuery.acceptData( elem ) ) {\n\
\t\treturn;\n\
\t}\n\
\n\
\tvar i, l, thisCache,\n\
\t\tisNode = elem.nodeType,\n\
\n\
\t\t// See jQuery.data for more information\n\
\t\tcache = isNode ? jQuery.cache : elem,\n\
\t\tid = isNode ? elem[ jQuery.expando ] : jQuery.expando;\n\
\n\
\t// If there is already no cache entry for this object, there is no\n\
\t// purpose in continuing\n\
\tif ( !cache[ id ] ) {\n\
\t\treturn;\n\
\t}\n\
\n\
\tif ( name ) {\n\
\n\
\t\tthisCache = pvt ? cache[ id ] : cache[ id ].data;\n\
\n\
\t\tif ( thisCache ) {\n\
\n\
\t\t\t// Support array or space separated string names for data keys\n\
\t\t\tif ( !jQuery.isArray( name ) ) {\n\
\n\
\t\t\t\t// try the string as a key before any manipulation\n\
\t\t\t\tif ( name in thisCache ) {\n\
\t\t\t\t\tname = [ name ];\n\
\t\t\t\t} else {\n\
\n\
\t\t\t\t\t// split the camel cased version by spaces unless a key with the spaces exists\n\
\t\t\t\t\tname = jQuery.camelCase( name );\n\
\t\t\t\t\tif ( name in thisCache ) {\n\
\t\t\t\t\t\tname = [ name ];\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\tname = name.split(\" \");\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\t// If \"name\" is an array of keys...\n\
\t\t\t\t// When data is initially created, via (\"key\", \"val\") signature,\n\
\t\t\t\t// keys will be converted to camelCase.\n\
\t\t\t\t// Since there is no way to tell _how_ a key was added, remove\n\
\t\t\t\t// both plain key and camelCase key. #12786\n\
\t\t\t\t// This will only penalize the array argument path.\n\
\t\t\t\tname = name.concat( jQuery.map( name, jQuery.camelCase ) );\n\
\t\t\t}\n\
\n\
\t\t\tfor ( i = 0, l = name.length; i < l; i++ ) {\n\
\t\t\t\tdelete thisCache[ name[i] ];\n\
\t\t\t}\n\
\n\
\t\t\t// If there is no data left in the cache, we want to continue\n\
\t\t\t// and let the cache object itself get destroyed\n\
\t\t\tif ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {\n\
\t\t\t\treturn;\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\t// See jQuery.data for more information\n\
\tif ( !pvt ) {\n\
\t\tdelete cache[ id ].data;\n\
\n\
\t\t// Don't destroy the parent cache unless the internal data object\n\
\t\t// had been the only thing left in it\n\
\t\tif ( !isEmptyDataObject( cache[ id ] ) ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\t}\n\
\n\
\t// Destroy the cache\n\
\tif ( isNode ) {\n\
\t\tjQuery.cleanData( [ elem ], true );\n\
\n\
\t// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)\n\
\t} else if ( jQuery.support.deleteExpando || cache != cache.window ) {\n\
\t\tdelete cache[ id ];\n\
\n\
\t// When all else fails, null\n\
\t} else {\n\
\t\tcache[ id ] = null;\n\
\t}\n\
}\n\
\n\
jQuery.extend({\n\
\tcache: {},\n\
\n\
\t// Unique for each copy of jQuery on the page\n\
\t// Non-digits removed to match rinlinejQuery\n\
\texpando: \"jQuery\" + ( core_version + Math.random() ).replace( /\\D/g, \"\" ),\n\
\n\
\t// The following elements throw uncatchable exceptions if you\n\
\t// attempt to add expando properties to them.\n\
\tnoData: {\n\
\t\t\"embed\": true,\n\
\t\t// Ban all objects except for Flash (which handle expandos)\n\
\t\t\"object\": \"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\",\n\
\t\t\"applet\": true\n\
\t},\n\
\n\
\thasData: function( elem ) {\n\
\t\telem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];\n\
\t\treturn !!elem && !isEmptyDataObject( elem );\n\
\t},\n\
\n\
\tdata: function( elem, name, data ) {\n\
\t\treturn internalData( elem, name, data );\n\
\t},\n\
\n\
\tremoveData: function( elem, name ) {\n\
\t\treturn internalRemoveData( elem, name );\n\
\t},\n\
\n\
\t// For internal use only.\n\
\t_data: function( elem, name, data ) {\n\
\t\treturn internalData( elem, name, data, true );\n\
\t},\n\
\n\
\t_removeData: function( elem, name ) {\n\
\t\treturn internalRemoveData( elem, name, true );\n\
\t},\n\
\n\
\t// A method for determining if a DOM node can handle the data expando\n\
\tacceptData: function( elem ) {\n\
\t\t// Do not set data on non-element because it will not be cleared (#8335).\n\
\t\tif ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {\n\
\t\t\treturn false;\n\
\t\t}\n\
\n\
\t\tvar noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];\n\
\n\
\t\t// nodes accept data unless otherwise specified; rejection can be conditional\n\
\t\treturn !noData || noData !== true && elem.getAttribute(\"classid\") === noData;\n\
\t}\n\
});\n\
\n\
jQuery.fn.extend({\n\
\tdata: function( key, value ) {\n\
\t\tvar attrs, name,\n\
\t\t\telem = this[0],\n\
\t\t\ti = 0,\n\
\t\t\tdata = null;\n\
\n\
\t\t// Gets all values\n\
\t\tif ( key === undefined ) {\n\
\t\t\tif ( this.length ) {\n\
\t\t\t\tdata = jQuery.data( elem );\n\
\n\
\t\t\t\tif ( elem.nodeType === 1 && !jQuery._data( elem, \"parsedAttrs\" ) ) {\n\
\t\t\t\t\tattrs = elem.attributes;\n\
\t\t\t\t\tfor ( ; i < attrs.length; i++ ) {\n\
\t\t\t\t\t\tname = attrs[i].name;\n\
\n\
\t\t\t\t\t\tif ( !name.indexOf( \"data-\" ) ) {\n\
\t\t\t\t\t\t\tname = jQuery.camelCase( name.slice(5) );\n\
\n\
\t\t\t\t\t\t\tdataAttr( elem, name, data[ name ] );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\tjQuery._data( elem, \"parsedAttrs\", true );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\treturn data;\n\
\t\t}\n\
\n\
\t\t// Sets multiple values\n\
\t\tif ( typeof key === \"object\" ) {\n\
\t\t\treturn this.each(function() {\n\
\t\t\t\tjQuery.data( this, key );\n\
\t\t\t});\n\
\t\t}\n\
\n\
\t\treturn jQuery.access( this, function( value ) {\n\
\n\
\t\t\tif ( value === undefined ) {\n\
\t\t\t\t// Try to fetch any internally stored data first\n\
\t\t\t\treturn elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;\n\
\t\t\t}\n\
\n\
\t\t\tthis.each(function() {\n\
\t\t\t\tjQuery.data( this, key, value );\n\
\t\t\t});\n\
\t\t}, null, value, arguments.length > 1, null, true );\n\
\t},\n\
\n\
\tremoveData: function( key ) {\n\
\t\treturn this.each(function() {\n\
\t\t\tjQuery.removeData( this, key );\n\
\t\t});\n\
\t}\n\
});\n\
\n\
function dataAttr( elem, key, data ) {\n\
\t// If nothing was found internally, try to fetch any\n\
\t// data from the HTML5 data-* attribute\n\
\tif ( data === undefined && elem.nodeType === 1 ) {\n\
\n\
\t\tvar name = \"data-\" + key.replace( rmultiDash, \"-$1\" ).toLowerCase();\n\
\n\
\t\tdata = elem.getAttribute( name );\n\
\n\
\t\tif ( typeof data === \"string\" ) {\n\
\t\t\ttry {\n\
\t\t\t\tdata = data === \"true\" ? true :\n\
\t\t\t\t\tdata === \"false\" ? false :\n\
\t\t\t\t\tdata === \"null\" ? null :\n\
\t\t\t\t\t// Only convert to a number if it doesn't change the string\n\
\t\t\t\t\t+data + \"\" === data ? +data :\n\
\t\t\t\t\trbrace.test( data ) ? jQuery.parseJSON( data ) :\n\
\t\t\t\t\t\tdata;\n\
\t\t\t} catch( e ) {}\n\
\n\
\t\t\t// Make sure we set the data so it isn't changed later\n\
\t\t\tjQuery.data( elem, key, data );\n\
\n\
\t\t} else {\n\
\t\t\tdata = undefined;\n\
\t\t}\n\
\t}\n\
\n\
\treturn data;\n\
}\n\
\n\
// checks a cache object for emptiness\n\
function isEmptyDataObject( obj ) {\n\
\tvar name;\n\
\tfor ( name in obj ) {\n\
\n\
\t\t// if the public data object is empty, the private is still empty\n\
\t\tif ( name === \"data\" && jQuery.isEmptyObject( obj[name] ) ) {\n\
\t\t\tcontinue;\n\
\t\t}\n\
\t\tif ( name !== \"toJSON\" ) {\n\
\t\t\treturn false;\n\
\t\t}\n\
\t}\n\
\n\
\treturn true;\n\
}\n\
jQuery.extend({\n\
\tqueue: function( elem, type, data ) {\n\
\t\tvar queue;\n\
\n\
\t\tif ( elem ) {\n\
\t\t\ttype = ( type || \"fx\" ) + \"queue\";\n\
\t\t\tqueue = jQuery._data( elem, type );\n\
\n\
\t\t\t// Speed up dequeue by getting out quickly if this is just a lookup\n\
\t\t\tif ( data ) {\n\
\t\t\t\tif ( !queue || jQuery.isArray(data) ) {\n\
\t\t\t\t\tqueue = jQuery._data( elem, type, jQuery.makeArray(data) );\n\
\t\t\t\t} else {\n\
\t\t\t\t\tqueue.push( data );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\treturn queue || [];\n\
\t\t}\n\
\t},\n\
\n\
\tdequeue: function( elem, type ) {\n\
\t\ttype = type || \"fx\";\n\
\n\
\t\tvar queue = jQuery.queue( elem, type ),\n\
\t\t\tstartLength = queue.length,\n\
\t\t\tfn = queue.shift(),\n\
\t\t\thooks = jQuery._queueHooks( elem, type ),\n\
\t\t\tnext = function() {\n\
\t\t\t\tjQuery.dequeue( elem, type );\n\
\t\t\t};\n\
\n\
\t\t// If the fx queue is dequeued, always remove the progress sentinel\n\
\t\tif ( fn === \"inprogress\" ) {\n\
\t\t\tfn = queue.shift();\n\
\t\t\tstartLength--;\n\
\t\t}\n\
\n\
\t\thooks.cur = fn;\n\
\t\tif ( fn ) {\n\
\n\
\t\t\t// Add a progress sentinel to prevent the fx queue from being\n\
\t\t\t// automatically dequeued\n\
\t\t\tif ( type === \"fx\" ) {\n\
\t\t\t\tqueue.unshift( \"inprogress\" );\n\
\t\t\t}\n\
\n\
\t\t\t// clear up the last queue stop function\n\
\t\t\tdelete hooks.stop;\n\
\t\t\tfn.call( elem, next, hooks );\n\
\t\t}\n\
\n\
\t\tif ( !startLength && hooks ) {\n\
\t\t\thooks.empty.fire();\n\
\t\t}\n\
\t},\n\
\n\
\t// not intended for public consumption - generates a queueHooks object, or returns the current one\n\
\t_queueHooks: function( elem, type ) {\n\
\t\tvar key = type + \"queueHooks\";\n\
\t\treturn jQuery._data( elem, key ) || jQuery._data( elem, key, {\n\
\t\t\tempty: jQuery.Callbacks(\"once memory\").add(function() {\n\
\t\t\t\tjQuery._removeData( elem, type + \"queue\" );\n\
\t\t\t\tjQuery._removeData( elem, key );\n\
\t\t\t})\n\
\t\t});\n\
\t}\n\
});\n\
\n\
jQuery.fn.extend({\n\
\tqueue: function( type, data ) {\n\
\t\tvar setter = 2;\n\
\n\
\t\tif ( typeof type !== \"string\" ) {\n\
\t\t\tdata = type;\n\
\t\t\ttype = \"fx\";\n\
\t\t\tsetter--;\n\
\t\t}\n\
\n\
\t\tif ( arguments.length < setter ) {\n\
\t\t\treturn jQuery.queue( this[0], type );\n\
\t\t}\n\
\n\
\t\treturn data === undefined ?\n\
\t\t\tthis :\n\
\t\t\tthis.each(function() {\n\
\t\t\t\tvar queue = jQuery.queue( this, type, data );\n\
\n\
\t\t\t\t// ensure a hooks for this queue\n\
\t\t\t\tjQuery._queueHooks( this, type );\n\
\n\
\t\t\t\tif ( type === \"fx\" && queue[0] !== \"inprogress\" ) {\n\
\t\t\t\t\tjQuery.dequeue( this, type );\n\
\t\t\t\t}\n\
\t\t\t});\n\
\t},\n\
\tdequeue: function( type ) {\n\
\t\treturn this.each(function() {\n\
\t\t\tjQuery.dequeue( this, type );\n\
\t\t});\n\
\t},\n\
\t// Based off of the plugin by Clint Helfers, with permission.\n\
\t// http://blindsignals.com/index.php/2009/07/jquery-delay/\n\
\tdelay: function( time, type ) {\n\
\t\ttime = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;\n\
\t\ttype = type || \"fx\";\n\
\n\
\t\treturn this.queue( type, function( next, hooks ) {\n\
\t\t\tvar timeout = setTimeout( next, time );\n\
\t\t\thooks.stop = function() {\n\
\t\t\t\tclearTimeout( timeout );\n\
\t\t\t};\n\
\t\t});\n\
\t},\n\
\tclearQueue: function( type ) {\n\
\t\treturn this.queue( type || \"fx\", [] );\n\
\t},\n\
\t// Get a promise resolved when queues of a certain type\n\
\t// are emptied (fx is the type by default)\n\
\tpromise: function( type, obj ) {\n\
\t\tvar tmp,\n\
\t\t\tcount = 1,\n\
\t\t\tdefer = jQuery.Deferred(),\n\
\t\t\telements = this,\n\
\t\t\ti = this.length,\n\
\t\t\tresolve = function() {\n\
\t\t\t\tif ( !( --count ) ) {\n\
\t\t\t\t\tdefer.resolveWith( elements, [ elements ] );\n\
\t\t\t\t}\n\
\t\t\t};\n\
\n\
\t\tif ( typeof type !== \"string\" ) {\n\
\t\t\tobj = type;\n\
\t\t\ttype = undefined;\n\
\t\t}\n\
\t\ttype = type || \"fx\";\n\
\n\
\t\twhile( i-- ) {\n\
\t\t\ttmp = jQuery._data( elements[ i ], type + \"queueHooks\" );\n\
\t\t\tif ( tmp && tmp.empty ) {\n\
\t\t\t\tcount++;\n\
\t\t\t\ttmp.empty.add( resolve );\n\
\t\t\t}\n\
\t\t}\n\
\t\tresolve();\n\
\t\treturn defer.promise( obj );\n\
\t}\n\
});\n\
var nodeHook, boolHook,\n\
\trclass = /[\\t\\r\\n\
]/g,\n\
\trreturn = /\\r/g,\n\
\trfocusable = /^(?:input|select|textarea|button|object)$/i,\n\
\trclickable = /^(?:a|area)$/i,\n\
\trboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,\n\
\truseDefault = /^(?:checked|selected)$/i,\n\
\tgetSetAttribute = jQuery.support.getSetAttribute,\n\
\tgetSetInput = jQuery.support.input;\n\
\n\
jQuery.fn.extend({\n\
\tattr: function( name, value ) {\n\
\t\treturn jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );\n\
\t},\n\
\n\
\tremoveAttr: function( name ) {\n\
\t\treturn this.each(function() {\n\
\t\t\tjQuery.removeAttr( this, name );\n\
\t\t});\n\
\t},\n\
\n\
\tprop: function( name, value ) {\n\
\t\treturn jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );\n\
\t},\n\
\n\
\tremoveProp: function( name ) {\n\
\t\tname = jQuery.propFix[ name ] || name;\n\
\t\treturn this.each(function() {\n\
\t\t\t// try/catch handles cases where IE balks (such as removing a property on window)\n\
\t\t\ttry {\n\
\t\t\t\tthis[ name ] = undefined;\n\
\t\t\t\tdelete this[ name ];\n\
\t\t\t} catch( e ) {}\n\
\t\t});\n\
\t},\n\
\n\
\taddClass: function( value ) {\n\
\t\tvar classes, elem, cur, clazz, j,\n\
\t\t\ti = 0,\n\
\t\t\tlen = this.length,\n\
\t\t\tproceed = typeof value === \"string\" && value;\n\
\n\
\t\tif ( jQuery.isFunction( value ) ) {\n\
\t\t\treturn this.each(function( j ) {\n\
\t\t\t\tjQuery( this ).addClass( value.call( this, j, this.className ) );\n\
\t\t\t});\n\
\t\t}\n\
\n\
\t\tif ( proceed ) {\n\
\t\t\t// The disjunction here is for better compressibility (see removeClass)\n\
\t\t\tclasses = ( value || \"\" ).match( core_rnotwhite ) || [];\n\
\n\
\t\t\tfor ( ; i < len; i++ ) {\n\
\t\t\t\telem = this[ i ];\n\
\t\t\t\tcur = elem.nodeType === 1 && ( elem.className ?\n\
\t\t\t\t\t( \" \" + elem.className + \" \" ).replace( rclass, \" \" ) :\n\
\t\t\t\t\t\" \"\n\
\t\t\t\t);\n\
\n\
\t\t\t\tif ( cur ) {\n\
\t\t\t\t\tj = 0;\n\
\t\t\t\t\twhile ( (clazz = classes[j++]) ) {\n\
\t\t\t\t\t\tif ( cur.indexOf( \" \" + clazz + \" \" ) < 0 ) {\n\
\t\t\t\t\t\t\tcur += clazz + \" \";\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\telem.className = jQuery.trim( cur );\n\
\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn this;\n\
\t},\n\
\n\
\tremoveClass: function( value ) {\n\
\t\tvar classes, elem, cur, clazz, j,\n\
\t\t\ti = 0,\n\
\t\t\tlen = this.length,\n\
\t\t\tproceed = arguments.length === 0 || typeof value === \"string\" && value;\n\
\n\
\t\tif ( jQuery.isFunction( value ) ) {\n\
\t\t\treturn this.each(function( j ) {\n\
\t\t\t\tjQuery( this ).removeClass( value.call( this, j, this.className ) );\n\
\t\t\t});\n\
\t\t}\n\
\t\tif ( proceed ) {\n\
\t\t\tclasses = ( value || \"\" ).match( core_rnotwhite ) || [];\n\
\n\
\t\t\tfor ( ; i < len; i++ ) {\n\
\t\t\t\telem = this[ i ];\n\
\t\t\t\t// This expression is here for better compressibility (see addClass)\n\
\t\t\t\tcur = elem.nodeType === 1 && ( elem.className ?\n\
\t\t\t\t\t( \" \" + elem.className + \" \" ).replace( rclass, \" \" ) :\n\
\t\t\t\t\t\"\"\n\
\t\t\t\t);\n\
\n\
\t\t\t\tif ( cur ) {\n\
\t\t\t\t\tj = 0;\n\
\t\t\t\t\twhile ( (clazz = classes[j++]) ) {\n\
\t\t\t\t\t\t// Remove *all* instances\n\
\t\t\t\t\t\twhile ( cur.indexOf( \" \" + clazz + \" \" ) >= 0 ) {\n\
\t\t\t\t\t\t\tcur = cur.replace( \" \" + clazz + \" \", \" \" );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\telem.className = value ? jQuery.trim( cur ) : \"\";\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn this;\n\
\t},\n\
\n\
\ttoggleClass: function( value, stateVal ) {\n\
\t\tvar type = typeof value,\n\
\t\t\tisBool = typeof stateVal === \"boolean\";\n\
\n\
\t\tif ( jQuery.isFunction( value ) ) {\n\
\t\t\treturn this.each(function( i ) {\n\
\t\t\t\tjQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );\n\
\t\t\t});\n\
\t\t}\n\
\n\
\t\treturn this.each(function() {\n\
\t\t\tif ( type === \"string\" ) {\n\
\t\t\t\t// toggle individual class names\n\
\t\t\t\tvar className,\n\
\t\t\t\t\ti = 0,\n\
\t\t\t\t\tself = jQuery( this ),\n\
\t\t\t\t\tstate = stateVal,\n\
\t\t\t\t\tclassNames = value.match( core_rnotwhite ) || [];\n\
\n\
\t\t\t\twhile ( (className = classNames[ i++ ]) ) {\n\
\t\t\t\t\t// check each className given, space separated list\n\
\t\t\t\t\tstate = isBool ? state : !self.hasClass( className );\n\
\t\t\t\t\tself[ state ? \"addClass\" : \"removeClass\" ]( className );\n\
\t\t\t\t}\n\
\n\
\t\t\t// Toggle whole class name\n\
\t\t\t} else if ( type === core_strundefined || type === \"boolean\" ) {\n\
\t\t\t\tif ( this.className ) {\n\
\t\t\t\t\t// store className if set\n\
\t\t\t\t\tjQuery._data( this, \"__className__\", this.className );\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// If the element has a class name or if we're passed \"false\",\n\
\t\t\t\t// then remove the whole classname (if there was one, the above saved it).\n\
\t\t\t\t// Otherwise bring back whatever was previously saved (if anything),\n\
\t\t\t\t// falling back to the empty string if nothing was stored.\n\
\t\t\t\tthis.className = this.className || value === false ? \"\" : jQuery._data( this, \"__className__\" ) || \"\";\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\thasClass: function( selector ) {\n\
\t\tvar className = \" \" + selector + \" \",\n\
\t\t\ti = 0,\n\
\t\t\tl = this.length;\n\
\t\tfor ( ; i < l; i++ ) {\n\
\t\t\tif ( this[i].nodeType === 1 && (\" \" + this[i].className + \" \").replace(rclass, \" \").indexOf( className ) >= 0 ) {\n\
\t\t\t\treturn true;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn false;\n\
\t},\n\
\n\
\tval: function( value ) {\n\
\t\tvar ret, hooks, isFunction,\n\
\t\t\telem = this[0];\n\
\n\
\t\tif ( !arguments.length ) {\n\
\t\t\tif ( elem ) {\n\
\t\t\t\thooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];\n\
\n\
\t\t\t\tif ( hooks && \"get\" in hooks && (ret = hooks.get( elem, \"value\" )) !== undefined ) {\n\
\t\t\t\t\treturn ret;\n\
\t\t\t\t}\n\
\n\
\t\t\t\tret = elem.value;\n\
\n\
\t\t\t\treturn typeof ret === \"string\" ?\n\
\t\t\t\t\t// handle most common string cases\n\
\t\t\t\t\tret.replace(rreturn, \"\") :\n\
\t\t\t\t\t// handle cases where value is null/undef or number\n\
\t\t\t\t\tret == null ? \"\" : ret;\n\
\t\t\t}\n\
\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\tisFunction = jQuery.isFunction( value );\n\
\n\
\t\treturn this.each(function( i ) {\n\
\t\t\tvar val,\n\
\t\t\t\tself = jQuery(this);\n\
\n\
\t\t\tif ( this.nodeType !== 1 ) {\n\
\t\t\t\treturn;\n\
\t\t\t}\n\
\n\
\t\t\tif ( isFunction ) {\n\
\t\t\t\tval = value.call( this, i, self.val() );\n\
\t\t\t} else {\n\
\t\t\t\tval = value;\n\
\t\t\t}\n\
\n\
\t\t\t// Treat null/undefined as \"\"; convert numbers to string\n\
\t\t\tif ( val == null ) {\n\
\t\t\t\tval = \"\";\n\
\t\t\t} else if ( typeof val === \"number\" ) {\n\
\t\t\t\tval += \"\";\n\
\t\t\t} else if ( jQuery.isArray( val ) ) {\n\
\t\t\t\tval = jQuery.map(val, function ( value ) {\n\
\t\t\t\t\treturn value == null ? \"\" : value + \"\";\n\
\t\t\t\t});\n\
\t\t\t}\n\
\n\
\t\t\thooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];\n\
\n\
\t\t\t// If set returns undefined, fall back to normal setting\n\
\t\t\tif ( !hooks || !(\"set\" in hooks) || hooks.set( this, val, \"value\" ) === undefined ) {\n\
\t\t\t\tthis.value = val;\n\
\t\t\t}\n\
\t\t});\n\
\t}\n\
});\n\
\n\
jQuery.extend({\n\
\tvalHooks: {\n\
\t\toption: {\n\
\t\t\tget: function( elem ) {\n\
\t\t\t\t// attributes.value is undefined in Blackberry 4.7 but\n\
\t\t\t\t// uses .value. See #6932\n\
\t\t\t\tvar val = elem.attributes.value;\n\
\t\t\t\treturn !val || val.specified ? elem.value : elem.text;\n\
\t\t\t}\n\
\t\t},\n\
\t\tselect: {\n\
\t\t\tget: function( elem ) {\n\
\t\t\t\tvar value, option,\n\
\t\t\t\t\toptions = elem.options,\n\
\t\t\t\t\tindex = elem.selectedIndex,\n\
\t\t\t\t\tone = elem.type === \"select-one\" || index < 0,\n\
\t\t\t\t\tvalues = one ? null : [],\n\
\t\t\t\t\tmax = one ? index + 1 : options.length,\n\
\t\t\t\t\ti = index < 0 ?\n\
\t\t\t\t\t\tmax :\n\
\t\t\t\t\t\tone ? index : 0;\n\
\n\
\t\t\t\t// Loop through all the selected options\n\
\t\t\t\tfor ( ; i < max; i++ ) {\n\
\t\t\t\t\toption = options[ i ];\n\
\n\
\t\t\t\t\t// oldIE doesn't update selected after form reset (#2551)\n\
\t\t\t\t\tif ( ( option.selected || i === index ) &&\n\
\t\t\t\t\t\t\t// Don't return options that are disabled or in a disabled optgroup\n\
\t\t\t\t\t\t\t( jQuery.support.optDisabled ? !option.disabled : option.getAttribute(\"disabled\") === null ) &&\n\
\t\t\t\t\t\t\t( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, \"optgroup\" ) ) ) {\n\
\n\
\t\t\t\t\t\t// Get the specific value for the option\n\
\t\t\t\t\t\tvalue = jQuery( option ).val();\n\
\n\
\t\t\t\t\t\t// We don't need an array for one selects\n\
\t\t\t\t\t\tif ( one ) {\n\
\t\t\t\t\t\t\treturn value;\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t// Multi-Selects return an array\n\
\t\t\t\t\t\tvalues.push( value );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\treturn values;\n\
\t\t\t},\n\
\n\
\t\t\tset: function( elem, value ) {\n\
\t\t\t\tvar values = jQuery.makeArray( value );\n\
\n\
\t\t\t\tjQuery(elem).find(\"option\").each(function() {\n\
\t\t\t\t\tthis.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;\n\
\t\t\t\t});\n\
\n\
\t\t\t\tif ( !values.length ) {\n\
\t\t\t\t\telem.selectedIndex = -1;\n\
\t\t\t\t}\n\
\t\t\t\treturn values;\n\
\t\t\t}\n\
\t\t}\n\
\t},\n\
\n\
\tattr: function( elem, name, value ) {\n\
\t\tvar hooks, notxml, ret,\n\
\t\t\tnType = elem.nodeType;\n\
\n\
\t\t// don't get/set attributes on text, comment and attribute nodes\n\
\t\tif ( !elem || nType === 3 || nType === 8 || nType === 2 ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// Fallback to prop when attributes are not supported\n\
\t\tif ( typeof elem.getAttribute === core_strundefined ) {\n\
\t\t\treturn jQuery.prop( elem, name, value );\n\
\t\t}\n\
\n\
\t\tnotxml = nType !== 1 || !jQuery.isXMLDoc( elem );\n\
\n\
\t\t// All attributes are lowercase\n\
\t\t// Grab necessary hook if one is defined\n\
\t\tif ( notxml ) {\n\
\t\t\tname = name.toLowerCase();\n\
\t\t\thooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );\n\
\t\t}\n\
\n\
\t\tif ( value !== undefined ) {\n\
\n\
\t\t\tif ( value === null ) {\n\
\t\t\t\tjQuery.removeAttr( elem, name );\n\
\n\
\t\t\t} else if ( hooks && notxml && \"set\" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {\n\
\t\t\t\treturn ret;\n\
\n\
\t\t\t} else {\n\
\t\t\t\telem.setAttribute( name, value + \"\" );\n\
\t\t\t\treturn value;\n\
\t\t\t}\n\
\n\
\t\t} else if ( hooks && notxml && \"get\" in hooks && (ret = hooks.get( elem, name )) !== null ) {\n\
\t\t\treturn ret;\n\
\n\
\t\t} else {\n\
\n\
\t\t\t// In IE9+, Flash objects don't have .getAttribute (#12945)\n\
\t\t\t// Support: IE9+\n\
\t\t\tif ( typeof elem.getAttribute !== core_strundefined ) {\n\
\t\t\t\tret =  elem.getAttribute( name );\n\
\t\t\t}\n\
\n\
\t\t\t// Non-existent attributes return null, we normalize to undefined\n\
\t\t\treturn ret == null ?\n\
\t\t\t\tundefined :\n\
\t\t\t\tret;\n\
\t\t}\n\
\t},\n\
\n\
\tremoveAttr: function( elem, value ) {\n\
\t\tvar name, propName,\n\
\t\t\ti = 0,\n\
\t\t\tattrNames = value && value.match( core_rnotwhite );\n\
\n\
\t\tif ( attrNames && elem.nodeType === 1 ) {\n\
\t\t\twhile ( (name = attrNames[i++]) ) {\n\
\t\t\t\tpropName = jQuery.propFix[ name ] || name;\n\
\n\
\t\t\t\t// Boolean attributes get special treatment (#10870)\n\
\t\t\t\tif ( rboolean.test( name ) ) {\n\
\t\t\t\t\t// Set corresponding property to false for boolean attributes\n\
\t\t\t\t\t// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8\n\
\t\t\t\t\tif ( !getSetAttribute && ruseDefault.test( name ) ) {\n\
\t\t\t\t\t\telem[ jQuery.camelCase( \"default-\" + name ) ] =\n\
\t\t\t\t\t\t\telem[ propName ] = false;\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\telem[ propName ] = false;\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t// See #9699 for explanation of this approach (setting first, then removal)\n\
\t\t\t\t} else {\n\
\t\t\t\t\tjQuery.attr( elem, name, \"\" );\n\
\t\t\t\t}\n\
\n\
\t\t\t\telem.removeAttribute( getSetAttribute ? name : propName );\n\
\t\t\t}\n\
\t\t}\n\
\t},\n\
\n\
\tattrHooks: {\n\
\t\ttype: {\n\
\t\t\tset: function( elem, value ) {\n\
\t\t\t\tif ( !jQuery.support.radioValue && value === \"radio\" && jQuery.nodeName(elem, \"input\") ) {\n\
\t\t\t\t\t// Setting the type on a radio button after the value resets the value in IE6-9\n\
\t\t\t\t\t// Reset value to default in case type is set after value during creation\n\
\t\t\t\t\tvar val = elem.value;\n\
\t\t\t\t\telem.setAttribute( \"type\", value );\n\
\t\t\t\t\tif ( val ) {\n\
\t\t\t\t\t\telem.value = val;\n\
\t\t\t\t\t}\n\
\t\t\t\t\treturn value;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t},\n\
\n\
\tpropFix: {\n\
\t\ttabindex: \"tabIndex\",\n\
\t\treadonly: \"readOnly\",\n\
\t\t\"for\": \"htmlFor\",\n\
\t\t\"class\": \"className\",\n\
\t\tmaxlength: \"maxLength\",\n\
\t\tcellspacing: \"cellSpacing\",\n\
\t\tcellpadding: \"cellPadding\",\n\
\t\trowspan: \"rowSpan\",\n\
\t\tcolspan: \"colSpan\",\n\
\t\tusemap: \"useMap\",\n\
\t\tframeborder: \"frameBorder\",\n\
\t\tcontenteditable: \"contentEditable\"\n\
\t},\n\
\n\
\tprop: function( elem, name, value ) {\n\
\t\tvar ret, hooks, notxml,\n\
\t\t\tnType = elem.nodeType;\n\
\n\
\t\t// don't get/set properties on text, comment and attribute nodes\n\
\t\tif ( !elem || nType === 3 || nType === 8 || nType === 2 ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\tnotxml = nType !== 1 || !jQuery.isXMLDoc( elem );\n\
\n\
\t\tif ( notxml ) {\n\
\t\t\t// Fix name and attach hooks\n\
\t\t\tname = jQuery.propFix[ name ] || name;\n\
\t\t\thooks = jQuery.propHooks[ name ];\n\
\t\t}\n\
\n\
\t\tif ( value !== undefined ) {\n\
\t\t\tif ( hooks && \"set\" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {\n\
\t\t\t\treturn ret;\n\
\n\
\t\t\t} else {\n\
\t\t\t\treturn ( elem[ name ] = value );\n\
\t\t\t}\n\
\n\
\t\t} else {\n\
\t\t\tif ( hooks && \"get\" in hooks && (ret = hooks.get( elem, name )) !== null ) {\n\
\t\t\t\treturn ret;\n\
\n\
\t\t\t} else {\n\
\t\t\t\treturn elem[ name ];\n\
\t\t\t}\n\
\t\t}\n\
\t},\n\
\n\
\tpropHooks: {\n\
\t\ttabIndex: {\n\
\t\t\tget: function( elem ) {\n\
\t\t\t\t// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set\n\
\t\t\t\t// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/\n\
\t\t\t\tvar attributeNode = elem.getAttributeNode(\"tabindex\");\n\
\n\
\t\t\t\treturn attributeNode && attributeNode.specified ?\n\
\t\t\t\t\tparseInt( attributeNode.value, 10 ) :\n\
\t\t\t\t\trfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?\n\
\t\t\t\t\t\t0 :\n\
\t\t\t\t\t\tundefined;\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
});\n\
\n\
// Hook for boolean attributes\n\
boolHook = {\n\
\tget: function( elem, name ) {\n\
\t\tvar\n\
\t\t\t// Use .prop to determine if this attribute is understood as boolean\n\
\t\t\tprop = jQuery.prop( elem, name ),\n\
\n\
\t\t\t// Fetch it accordingly\n\
\t\t\tattr = typeof prop === \"boolean\" && elem.getAttribute( name ),\n\
\t\t\tdetail = typeof prop === \"boolean\" ?\n\
\n\
\t\t\t\tgetSetInput && getSetAttribute ?\n\
\t\t\t\t\tattr != null :\n\
\t\t\t\t\t// oldIE fabricates an empty string for missing boolean attributes\n\
\t\t\t\t\t// and conflates checked/selected into attroperties\n\
\t\t\t\t\truseDefault.test( name ) ?\n\
\t\t\t\t\t\telem[ jQuery.camelCase( \"default-\" + name ) ] :\n\
\t\t\t\t\t\t!!attr :\n\
\n\
\t\t\t\t// fetch an attribute node for properties not recognized as boolean\n\
\t\t\t\telem.getAttributeNode( name );\n\
\n\
\t\treturn detail && detail.value !== false ?\n\
\t\t\tname.toLowerCase() :\n\
\t\t\tundefined;\n\
\t},\n\
\tset: function( elem, value, name ) {\n\
\t\tif ( value === false ) {\n\
\t\t\t// Remove boolean attributes when set to false\n\
\t\t\tjQuery.removeAttr( elem, name );\n\
\t\t} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {\n\
\t\t\t// IE<8 needs the *property* name\n\
\t\t\telem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );\n\
\n\
\t\t// Use defaultChecked and defaultSelected for oldIE\n\
\t\t} else {\n\
\t\t\telem[ jQuery.camelCase( \"default-\" + name ) ] = elem[ name ] = true;\n\
\t\t}\n\
\n\
\t\treturn name;\n\
\t}\n\
};\n\
\n\
// fix oldIE value attroperty\n\
if ( !getSetInput || !getSetAttribute ) {\n\
\tjQuery.attrHooks.value = {\n\
\t\tget: function( elem, name ) {\n\
\t\t\tvar ret = elem.getAttributeNode( name );\n\
\t\t\treturn jQuery.nodeName( elem, \"input\" ) ?\n\
\n\
\t\t\t\t// Ignore the value *property* by using defaultValue\n\
\t\t\t\telem.defaultValue :\n\
\n\
\t\t\t\tret && ret.specified ? ret.value : undefined;\n\
\t\t},\n\
\t\tset: function( elem, value, name ) {\n\
\t\t\tif ( jQuery.nodeName( elem, \"input\" ) ) {\n\
\t\t\t\t// Does not return so that setAttribute is also used\n\
\t\t\t\telem.defaultValue = value;\n\
\t\t\t} else {\n\
\t\t\t\t// Use nodeHook if defined (#1954); otherwise setAttribute is fine\n\
\t\t\t\treturn nodeHook && nodeHook.set( elem, value, name );\n\
\t\t\t}\n\
\t\t}\n\
\t};\n\
}\n\
\n\
// IE6/7 do not support getting/setting some attributes with get/setAttribute\n\
if ( !getSetAttribute ) {\n\
\n\
\t// Use this for any attribute in IE6/7\n\
\t// This fixes almost every IE6/7 issue\n\
\tnodeHook = jQuery.valHooks.button = {\n\
\t\tget: function( elem, name ) {\n\
\t\t\tvar ret = elem.getAttributeNode( name );\n\
\t\t\treturn ret && ( name === \"id\" || name === \"name\" || name === \"coords\" ? ret.value !== \"\" : ret.specified ) ?\n\
\t\t\t\tret.value :\n\
\t\t\t\tundefined;\n\
\t\t},\n\
\t\tset: function( elem, value, name ) {\n\
\t\t\t// Set the existing or create a new attribute node\n\
\t\t\tvar ret = elem.getAttributeNode( name );\n\
\t\t\tif ( !ret ) {\n\
\t\t\t\telem.setAttributeNode(\n\
\t\t\t\t\t(ret = elem.ownerDocument.createAttribute( name ))\n\
\t\t\t\t);\n\
\t\t\t}\n\
\n\
\t\t\tret.value = value += \"\";\n\
\n\
\t\t\t// Break association with cloned elements by also using setAttribute (#9646)\n\
\t\t\treturn name === \"value\" || value === elem.getAttribute( name ) ?\n\
\t\t\t\tvalue :\n\
\t\t\t\tundefined;\n\
\t\t}\n\
\t};\n\
\n\
\t// Set contenteditable to false on removals(#10429)\n\
\t// Setting to empty string throws an error as an invalid value\n\
\tjQuery.attrHooks.contenteditable = {\n\
\t\tget: nodeHook.get,\n\
\t\tset: function( elem, value, name ) {\n\
\t\t\tnodeHook.set( elem, value === \"\" ? false : value, name );\n\
\t\t}\n\
\t};\n\
\n\
\t// Set width and height to auto instead of 0 on empty string( Bug #8150 )\n\
\t// This is for removals\n\
\tjQuery.each([ \"width\", \"height\" ], function( i, name ) {\n\
\t\tjQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {\n\
\t\t\tset: function( elem, value ) {\n\
\t\t\t\tif ( value === \"\" ) {\n\
\t\t\t\t\telem.setAttribute( name, \"auto\" );\n\
\t\t\t\t\treturn value;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t});\n\
\t});\n\
}\n\
\n\
\n\
// Some attributes require a special call on IE\n\
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx\n\
if ( !jQuery.support.hrefNormalized ) {\n\
\tjQuery.each([ \"href\", \"src\", \"width\", \"height\" ], function( i, name ) {\n\
\t\tjQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {\n\
\t\t\tget: function( elem ) {\n\
\t\t\t\tvar ret = elem.getAttribute( name, 2 );\n\
\t\t\t\treturn ret == null ? undefined : ret;\n\
\t\t\t}\n\
\t\t});\n\
\t});\n\
\n\
\t// href/src property should get the full normalized URL (#10299/#12915)\n\
\tjQuery.each([ \"href\", \"src\" ], function( i, name ) {\n\
\t\tjQuery.propHooks[ name ] = {\n\
\t\t\tget: function( elem ) {\n\
\t\t\t\treturn elem.getAttribute( name, 4 );\n\
\t\t\t}\n\
\t\t};\n\
\t});\n\
}\n\
\n\
if ( !jQuery.support.style ) {\n\
\tjQuery.attrHooks.style = {\n\
\t\tget: function( elem ) {\n\
\t\t\t// Return undefined in the case of empty string\n\
\t\t\t// Note: IE uppercases css property names, but if we were to .toLowerCase()\n\
\t\t\t// .cssText, that would destroy case senstitivity in URL's, like in \"background\"\n\
\t\t\treturn elem.style.cssText || undefined;\n\
\t\t},\n\
\t\tset: function( elem, value ) {\n\
\t\t\treturn ( elem.style.cssText = value + \"\" );\n\
\t\t}\n\
\t};\n\
}\n\
\n\
// Safari mis-reports the default selected property of an option\n\
// Accessing the parent's selectedIndex property fixes it\n\
if ( !jQuery.support.optSelected ) {\n\
\tjQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {\n\
\t\tget: function( elem ) {\n\
\t\t\tvar parent = elem.parentNode;\n\
\n\
\t\t\tif ( parent ) {\n\
\t\t\t\tparent.selectedIndex;\n\
\n\
\t\t\t\t// Make sure that it also works with optgroups, see #5701\n\
\t\t\t\tif ( parent.parentNode ) {\n\
\t\t\t\t\tparent.parentNode.selectedIndex;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\treturn null;\n\
\t\t}\n\
\t});\n\
}\n\
\n\
// IE6/7 call enctype encoding\n\
if ( !jQuery.support.enctype ) {\n\
\tjQuery.propFix.enctype = \"encoding\";\n\
}\n\
\n\
// Radios and checkboxes getter/setter\n\
if ( !jQuery.support.checkOn ) {\n\
\tjQuery.each([ \"radio\", \"checkbox\" ], function() {\n\
\t\tjQuery.valHooks[ this ] = {\n\
\t\t\tget: function( elem ) {\n\
\t\t\t\t// Handle the case where in Webkit \"\" is returned instead of \"on\" if a value isn't specified\n\
\t\t\t\treturn elem.getAttribute(\"value\") === null ? \"on\" : elem.value;\n\
\t\t\t}\n\
\t\t};\n\
\t});\n\
}\n\
jQuery.each([ \"radio\", \"checkbox\" ], function() {\n\
\tjQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {\n\
\t\tset: function( elem, value ) {\n\
\t\t\tif ( jQuery.isArray( value ) ) {\n\
\t\t\t\treturn ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );\n\
\t\t\t}\n\
\t\t}\n\
\t});\n\
});\n\
var rformElems = /^(?:input|select|textarea)$/i,\n\
\trkeyEvent = /^key/,\n\
\trmouseEvent = /^(?:mouse|contextmenu)|click/,\n\
\trfocusMorph = /^(?:focusinfocus|focusoutblur)$/,\n\
\trtypenamespace = /^([^.]*)(?:\\.(.+)|)$/;\n\
\n\
function returnTrue() {\n\
\treturn true;\n\
}\n\
\n\
function returnFalse() {\n\
\treturn false;\n\
}\n\
\n\
/*\n\
 * Helper functions for managing events -- not part of the public interface.\n\
 * Props to Dean Edwards' addEvent library for many of the ideas.\n\
 */\n\
jQuery.event = {\n\
\n\
\tglobal: {},\n\
\n\
\tadd: function( elem, types, handler, data, selector ) {\n\
\t\tvar tmp, events, t, handleObjIn,\n\
\t\t\tspecial, eventHandle, handleObj,\n\
\t\t\thandlers, type, namespaces, origType,\n\
\t\t\telemData = jQuery._data( elem );\n\
\n\
\t\t// Don't attach events to noData or text/comment nodes (but allow plain objects)\n\
\t\tif ( !elemData ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// Caller can pass in an object of custom data in lieu of the handler\n\
\t\tif ( handler.handler ) {\n\
\t\t\thandleObjIn = handler;\n\
\t\t\thandler = handleObjIn.handler;\n\
\t\t\tselector = handleObjIn.selector;\n\
\t\t}\n\
\n\
\t\t// Make sure that the handler has a unique ID, used to find/remove it later\n\
\t\tif ( !handler.guid ) {\n\
\t\t\thandler.guid = jQuery.guid++;\n\
\t\t}\n\
\n\
\t\t// Init the element's event structure and main handler, if this is the first\n\
\t\tif ( !(events = elemData.events) ) {\n\
\t\t\tevents = elemData.events = {};\n\
\t\t}\n\
\t\tif ( !(eventHandle = elemData.handle) ) {\n\
\t\t\teventHandle = elemData.handle = function( e ) {\n\
\t\t\t\t// Discard the second event of a jQuery.event.trigger() and\n\
\t\t\t\t// when an event is called after a page has unloaded\n\
\t\t\t\treturn typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?\n\
\t\t\t\t\tjQuery.event.dispatch.apply( eventHandle.elem, arguments ) :\n\
\t\t\t\t\tundefined;\n\
\t\t\t};\n\
\t\t\t// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events\n\
\t\t\teventHandle.elem = elem;\n\
\t\t}\n\
\n\
\t\t// Handle multiple events separated by a space\n\
\t\t// jQuery(...).bind(\"mouseover mouseout\", fn);\n\
\t\ttypes = ( types || \"\" ).match( core_rnotwhite ) || [\"\"];\n\
\t\tt = types.length;\n\
\t\twhile ( t-- ) {\n\
\t\t\ttmp = rtypenamespace.exec( types[t] ) || [];\n\
\t\t\ttype = origType = tmp[1];\n\
\t\t\tnamespaces = ( tmp[2] || \"\" ).split( \".\" ).sort();\n\
\n\
\t\t\t// If event changes its type, use the special event handlers for the changed type\n\
\t\t\tspecial = jQuery.event.special[ type ] || {};\n\
\n\
\t\t\t// If selector defined, determine special event api type, otherwise given type\n\
\t\t\ttype = ( selector ? special.delegateType : special.bindType ) || type;\n\
\n\
\t\t\t// Update special based on newly reset type\n\
\t\t\tspecial = jQuery.event.special[ type ] || {};\n\
\n\
\t\t\t// handleObj is passed to all event handlers\n\
\t\t\thandleObj = jQuery.extend({\n\
\t\t\t\ttype: type,\n\
\t\t\t\torigType: origType,\n\
\t\t\t\tdata: data,\n\
\t\t\t\thandler: handler,\n\
\t\t\t\tguid: handler.guid,\n\
\t\t\t\tselector: selector,\n\
\t\t\t\tneedsContext: selector && jQuery.expr.match.needsContext.test( selector ),\n\
\t\t\t\tnamespace: namespaces.join(\".\")\n\
\t\t\t}, handleObjIn );\n\
\n\
\t\t\t// Init the event handler queue if we're the first\n\
\t\t\tif ( !(handlers = events[ type ]) ) {\n\
\t\t\t\thandlers = events[ type ] = [];\n\
\t\t\t\thandlers.delegateCount = 0;\n\
\n\
\t\t\t\t// Only use addEventListener/attachEvent if the special events handler returns false\n\
\t\t\t\tif ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {\n\
\t\t\t\t\t// Bind the global event handler to the element\n\
\t\t\t\t\tif ( elem.addEventListener ) {\n\
\t\t\t\t\t\telem.addEventListener( type, eventHandle, false );\n\
\n\
\t\t\t\t\t} else if ( elem.attachEvent ) {\n\
\t\t\t\t\t\telem.attachEvent( \"on\" + type, eventHandle );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\tif ( special.add ) {\n\
\t\t\t\tspecial.add.call( elem, handleObj );\n\
\n\
\t\t\t\tif ( !handleObj.handler.guid ) {\n\
\t\t\t\t\thandleObj.handler.guid = handler.guid;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// Add to the element's handler list, delegates in front\n\
\t\t\tif ( selector ) {\n\
\t\t\t\thandlers.splice( handlers.delegateCount++, 0, handleObj );\n\
\t\t\t} else {\n\
\t\t\t\thandlers.push( handleObj );\n\
\t\t\t}\n\
\n\
\t\t\t// Keep track of which events have ever been used, for event optimization\n\
\t\t\tjQuery.event.global[ type ] = true;\n\
\t\t}\n\
\n\
\t\t// Nullify elem to prevent memory leaks in IE\n\
\t\telem = null;\n\
\t},\n\
\n\
\t// Detach an event or set of events from an element\n\
\tremove: function( elem, types, handler, selector, mappedTypes ) {\n\
\t\tvar j, handleObj, tmp,\n\
\t\t\torigCount, t, events,\n\
\t\t\tspecial, handlers, type,\n\
\t\t\tnamespaces, origType,\n\
\t\t\telemData = jQuery.hasData( elem ) && jQuery._data( elem );\n\
\n\
\t\tif ( !elemData || !(events = elemData.events) ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// Once for each type.namespace in types; type may be omitted\n\
\t\ttypes = ( types || \"\" ).match( core_rnotwhite ) || [\"\"];\n\
\t\tt = types.length;\n\
\t\twhile ( t-- ) {\n\
\t\t\ttmp = rtypenamespace.exec( types[t] ) || [];\n\
\t\t\ttype = origType = tmp[1];\n\
\t\t\tnamespaces = ( tmp[2] || \"\" ).split( \".\" ).sort();\n\
\n\
\t\t\t// Unbind all events (on this namespace, if provided) for the element\n\
\t\t\tif ( !type ) {\n\
\t\t\t\tfor ( type in events ) {\n\
\t\t\t\t\tjQuery.event.remove( elem, type + types[ t ], handler, selector, true );\n\
\t\t\t\t}\n\
\t\t\t\tcontinue;\n\
\t\t\t}\n\
\n\
\t\t\tspecial = jQuery.event.special[ type ] || {};\n\
\t\t\ttype = ( selector ? special.delegateType : special.bindType ) || type;\n\
\t\t\thandlers = events[ type ] || [];\n\
\t\t\ttmp = tmp[2] && new RegExp( \"(^|\\\\.)\" + namespaces.join(\"\\\\.(?:.*\\\\.|)\") + \"(\\\\.|$)\" );\n\
\n\
\t\t\t// Remove matching events\n\
\t\t\torigCount = j = handlers.length;\n\
\t\t\twhile ( j-- ) {\n\
\t\t\t\thandleObj = handlers[ j ];\n\
\n\
\t\t\t\tif ( ( mappedTypes || origType === handleObj.origType ) &&\n\
\t\t\t\t\t( !handler || handler.guid === handleObj.guid ) &&\n\
\t\t\t\t\t( !tmp || tmp.test( handleObj.namespace ) ) &&\n\
\t\t\t\t\t( !selector || selector === handleObj.selector || selector === \"**\" && handleObj.selector ) ) {\n\
\t\t\t\t\thandlers.splice( j, 1 );\n\
\n\
\t\t\t\t\tif ( handleObj.selector ) {\n\
\t\t\t\t\t\thandlers.delegateCount--;\n\
\t\t\t\t\t}\n\
\t\t\t\t\tif ( special.remove ) {\n\
\t\t\t\t\t\tspecial.remove.call( elem, handleObj );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// Remove generic event handler if we removed something and no more handlers exist\n\
\t\t\t// (avoids potential for endless recursion during removal of special event handlers)\n\
\t\t\tif ( origCount && !handlers.length ) {\n\
\t\t\t\tif ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {\n\
\t\t\t\t\tjQuery.removeEvent( elem, type, elemData.handle );\n\
\t\t\t\t}\n\
\n\
\t\t\t\tdelete events[ type ];\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Remove the expando if it's no longer used\n\
\t\tif ( jQuery.isEmptyObject( events ) ) {\n\
\t\t\tdelete elemData.handle;\n\
\n\
\t\t\t// removeData also checks for emptiness and clears the expando if empty\n\
\t\t\t// so use it instead of delete\n\
\t\t\tjQuery._removeData( elem, \"events\" );\n\
\t\t}\n\
\t},\n\
\n\
\ttrigger: function( event, data, elem, onlyHandlers ) {\n\
\t\tvar handle, ontype, cur,\n\
\t\t\tbubbleType, special, tmp, i,\n\
\t\t\teventPath = [ elem || document ],\n\
\t\t\ttype = core_hasOwn.call( event, \"type\" ) ? event.type : event,\n\
\t\t\tnamespaces = core_hasOwn.call( event, \"namespace\" ) ? event.namespace.split(\".\") : [];\n\
\n\
\t\tcur = tmp = elem = elem || document;\n\
\n\
\t\t// Don't do events on text and comment nodes\n\
\t\tif ( elem.nodeType === 3 || elem.nodeType === 8 ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// focus/blur morphs to focusin/out; ensure we're not firing them right now\n\
\t\tif ( rfocusMorph.test( type + jQuery.event.triggered ) ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\tif ( type.indexOf(\".\") >= 0 ) {\n\
\t\t\t// Namespaced trigger; create a regexp to match event type in handle()\n\
\t\t\tnamespaces = type.split(\".\");\n\
\t\t\ttype = namespaces.shift();\n\
\t\t\tnamespaces.sort();\n\
\t\t}\n\
\t\tontype = type.indexOf(\":\") < 0 && \"on\" + type;\n\
\n\
\t\t// Caller can pass in a jQuery.Event object, Object, or just an event type string\n\
\t\tevent = event[ jQuery.expando ] ?\n\
\t\t\tevent :\n\
\t\t\tnew jQuery.Event( type, typeof event === \"object\" && event );\n\
\n\
\t\tevent.isTrigger = true;\n\
\t\tevent.namespace = namespaces.join(\".\");\n\
\t\tevent.namespace_re = event.namespace ?\n\
\t\t\tnew RegExp( \"(^|\\\\.)\" + namespaces.join(\"\\\\.(?:.*\\\\.|)\") + \"(\\\\.|$)\" ) :\n\
\t\t\tnull;\n\
\n\
\t\t// Clean up the event in case it is being reused\n\
\t\tevent.result = undefined;\n\
\t\tif ( !event.target ) {\n\
\t\t\tevent.target = elem;\n\
\t\t}\n\
\n\
\t\t// Clone any incoming data and prepend the event, creating the handler arg list\n\
\t\tdata = data == null ?\n\
\t\t\t[ event ] :\n\
\t\t\tjQuery.makeArray( data, [ event ] );\n\
\n\
\t\t// Allow special events to draw outside the lines\n\
\t\tspecial = jQuery.event.special[ type ] || {};\n\
\t\tif ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// Determine event propagation path in advance, per W3C events spec (#9951)\n\
\t\t// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)\n\
\t\tif ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {\n\
\n\
\t\t\tbubbleType = special.delegateType || type;\n\
\t\t\tif ( !rfocusMorph.test( bubbleType + type ) ) {\n\
\t\t\t\tcur = cur.parentNode;\n\
\t\t\t}\n\
\t\t\tfor ( ; cur; cur = cur.parentNode ) {\n\
\t\t\t\teventPath.push( cur );\n\
\t\t\t\ttmp = cur;\n\
\t\t\t}\n\
\n\
\t\t\t// Only add window if we got to document (e.g., not plain obj or detached DOM)\n\
\t\t\tif ( tmp === (elem.ownerDocument || document) ) {\n\
\t\t\t\teventPath.push( tmp.defaultView || tmp.parentWindow || window );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Fire handlers on the event path\n\
\t\ti = 0;\n\
\t\twhile ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {\n\
\n\
\t\t\tevent.type = i > 1 ?\n\
\t\t\t\tbubbleType :\n\
\t\t\t\tspecial.bindType || type;\n\
\n\
\t\t\t// jQuery handler\n\
\t\t\thandle = ( jQuery._data( cur, \"events\" ) || {} )[ event.type ] && jQuery._data( cur, \"handle\" );\n\
\t\t\tif ( handle ) {\n\
\t\t\t\thandle.apply( cur, data );\n\
\t\t\t}\n\
\n\
\t\t\t// Native handler\n\
\t\t\thandle = ontype && cur[ ontype ];\n\
\t\t\tif ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {\n\
\t\t\t\tevent.preventDefault();\n\
\t\t\t}\n\
\t\t}\n\
\t\tevent.type = type;\n\
\n\
\t\t// If nobody prevented the default action, do it now\n\
\t\tif ( !onlyHandlers && !event.isDefaultPrevented() ) {\n\
\n\
\t\t\tif ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&\n\
\t\t\t\t!(type === \"click\" && jQuery.nodeName( elem, \"a\" )) && jQuery.acceptData( elem ) ) {\n\
\n\
\t\t\t\t// Call a native DOM method on the target with the same name name as the event.\n\
\t\t\t\t// Can't use an .isFunction() check here because IE6/7 fails that test.\n\
\t\t\t\t// Don't do default actions on window, that's where global variables be (#6170)\n\
\t\t\t\tif ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {\n\
\n\
\t\t\t\t\t// Don't re-trigger an onFOO event when we call its FOO() method\n\
\t\t\t\t\ttmp = elem[ ontype ];\n\
\n\
\t\t\t\t\tif ( tmp ) {\n\
\t\t\t\t\t\telem[ ontype ] = null;\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Prevent re-triggering of the same event, since we already bubbled it above\n\
\t\t\t\t\tjQuery.event.triggered = type;\n\
\t\t\t\t\ttry {\n\
\t\t\t\t\t\telem[ type ]();\n\
\t\t\t\t\t} catch ( e ) {\n\
\t\t\t\t\t\t// IE<9 dies on focus/blur to hidden element (#1486,#12518)\n\
\t\t\t\t\t\t// only reproducible on winXP IE8 native, not IE9 in IE8 mode\n\
\t\t\t\t\t}\n\
\t\t\t\t\tjQuery.event.triggered = undefined;\n\
\n\
\t\t\t\t\tif ( tmp ) {\n\
\t\t\t\t\t\telem[ ontype ] = tmp;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn event.result;\n\
\t},\n\
\n\
\tdispatch: function( event ) {\n\
\n\
\t\t// Make a writable jQuery.Event from the native event object\n\
\t\tevent = jQuery.event.fix( event );\n\
\n\
\t\tvar i, ret, handleObj, matched, j,\n\
\t\t\thandlerQueue = [],\n\
\t\t\targs = core_slice.call( arguments ),\n\
\t\t\thandlers = ( jQuery._data( this, \"events\" ) || {} )[ event.type ] || [],\n\
\t\t\tspecial = jQuery.event.special[ event.type ] || {};\n\
\n\
\t\t// Use the fix-ed jQuery.Event rather than the (read-only) native event\n\
\t\targs[0] = event;\n\
\t\tevent.delegateTarget = this;\n\
\n\
\t\t// Call the preDispatch hook for the mapped type, and let it bail if desired\n\
\t\tif ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// Determine handlers\n\
\t\thandlerQueue = jQuery.event.handlers.call( this, event, handlers );\n\
\n\
\t\t// Run delegates first; they may want to stop propagation beneath us\n\
\t\ti = 0;\n\
\t\twhile ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {\n\
\t\t\tevent.currentTarget = matched.elem;\n\
\n\
\t\t\tj = 0;\n\
\t\t\twhile ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {\n\
\n\
\t\t\t\t// Triggered event must either 1) have no namespace, or\n\
\t\t\t\t// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).\n\
\t\t\t\tif ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {\n\
\n\
\t\t\t\t\tevent.handleObj = handleObj;\n\
\t\t\t\t\tevent.data = handleObj.data;\n\
\n\
\t\t\t\t\tret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )\n\
\t\t\t\t\t\t\t.apply( matched.elem, args );\n\
\n\
\t\t\t\t\tif ( ret !== undefined ) {\n\
\t\t\t\t\t\tif ( (event.result = ret) === false ) {\n\
\t\t\t\t\t\t\tevent.preventDefault();\n\
\t\t\t\t\t\t\tevent.stopPropagation();\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Call the postDispatch hook for the mapped type\n\
\t\tif ( special.postDispatch ) {\n\
\t\t\tspecial.postDispatch.call( this, event );\n\
\t\t}\n\
\n\
\t\treturn event.result;\n\
\t},\n\
\n\
\thandlers: function( event, handlers ) {\n\
\t\tvar sel, handleObj, matches, i,\n\
\t\t\thandlerQueue = [],\n\
\t\t\tdelegateCount = handlers.delegateCount,\n\
\t\t\tcur = event.target;\n\
\n\
\t\t// Find delegate handlers\n\
\t\t// Black-hole SVG <use> instance trees (#13180)\n\
\t\t// Avoid non-left-click bubbling in Firefox (#3861)\n\
\t\tif ( delegateCount && cur.nodeType && (!event.button || event.type !== \"click\") ) {\n\
\n\
\t\t\tfor ( ; cur != this; cur = cur.parentNode || this ) {\n\
\n\
\t\t\t\t// Don't check non-elements (#13208)\n\
\t\t\t\t// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)\n\
\t\t\t\tif ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== \"click\") ) {\n\
\t\t\t\t\tmatches = [];\n\
\t\t\t\t\tfor ( i = 0; i < delegateCount; i++ ) {\n\
\t\t\t\t\t\thandleObj = handlers[ i ];\n\
\n\
\t\t\t\t\t\t// Don't conflict with Object.prototype properties (#13203)\n\
\t\t\t\t\t\tsel = handleObj.selector + \" \";\n\
\n\
\t\t\t\t\t\tif ( matches[ sel ] === undefined ) {\n\
\t\t\t\t\t\t\tmatches[ sel ] = handleObj.needsContext ?\n\
\t\t\t\t\t\t\t\tjQuery( sel, this ).index( cur ) >= 0 :\n\
\t\t\t\t\t\t\t\tjQuery.find( sel, this, null, [ cur ] ).length;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\tif ( matches[ sel ] ) {\n\
\t\t\t\t\t\t\tmatches.push( handleObj );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\tif ( matches.length ) {\n\
\t\t\t\t\t\thandlerQueue.push({ elem: cur, handlers: matches });\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Add the remaining (directly-bound) handlers\n\
\t\tif ( delegateCount < handlers.length ) {\n\
\t\t\thandlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });\n\
\t\t}\n\
\n\
\t\treturn handlerQueue;\n\
\t},\n\
\n\
\tfix: function( event ) {\n\
\t\tif ( event[ jQuery.expando ] ) {\n\
\t\t\treturn event;\n\
\t\t}\n\
\n\
\t\t// Create a writable copy of the event object and normalize some properties\n\
\t\tvar i, prop, copy,\n\
\t\t\ttype = event.type,\n\
\t\t\toriginalEvent = event,\n\
\t\t\tfixHook = this.fixHooks[ type ];\n\
\n\
\t\tif ( !fixHook ) {\n\
\t\t\tthis.fixHooks[ type ] = fixHook =\n\
\t\t\t\trmouseEvent.test( type ) ? this.mouseHooks :\n\
\t\t\t\trkeyEvent.test( type ) ? this.keyHooks :\n\
\t\t\t\t{};\n\
\t\t}\n\
\t\tcopy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;\n\
\n\
\t\tevent = new jQuery.Event( originalEvent );\n\
\n\
\t\ti = copy.length;\n\
\t\twhile ( i-- ) {\n\
\t\t\tprop = copy[ i ];\n\
\t\t\tevent[ prop ] = originalEvent[ prop ];\n\
\t\t}\n\
\n\
\t\t// Support: IE<9\n\
\t\t// Fix target property (#1925)\n\
\t\tif ( !event.target ) {\n\
\t\t\tevent.target = originalEvent.srcElement || document;\n\
\t\t}\n\
\n\
\t\t// Support: Chrome 23+, Safari?\n\
\t\t// Target should not be a text node (#504, #13143)\n\
\t\tif ( event.target.nodeType === 3 ) {\n\
\t\t\tevent.target = event.target.parentNode;\n\
\t\t}\n\
\n\
\t\t// Support: IE<9\n\
\t\t// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)\n\
\t\tevent.metaKey = !!event.metaKey;\n\
\n\
\t\treturn fixHook.filter ? fixHook.filter( event, originalEvent ) : event;\n\
\t},\n\
\n\
\t// Includes some event props shared by KeyEvent and MouseEvent\n\
\tprops: \"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which\".split(\" \"),\n\
\n\
\tfixHooks: {},\n\
\n\
\tkeyHooks: {\n\
\t\tprops: \"char charCode key keyCode\".split(\" \"),\n\
\t\tfilter: function( event, original ) {\n\
\n\
\t\t\t// Add which for key events\n\
\t\t\tif ( event.which == null ) {\n\
\t\t\t\tevent.which = original.charCode != null ? original.charCode : original.keyCode;\n\
\t\t\t}\n\
\n\
\t\t\treturn event;\n\
\t\t}\n\
\t},\n\
\n\
\tmouseHooks: {\n\
\t\tprops: \"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement\".split(\" \"),\n\
\t\tfilter: function( event, original ) {\n\
\t\t\tvar body, eventDoc, doc,\n\
\t\t\t\tbutton = original.button,\n\
\t\t\t\tfromElement = original.fromElement;\n\
\n\
\t\t\t// Calculate pageX/Y if missing and clientX/Y available\n\
\t\t\tif ( event.pageX == null && original.clientX != null ) {\n\
\t\t\t\teventDoc = event.target.ownerDocument || document;\n\
\t\t\t\tdoc = eventDoc.documentElement;\n\
\t\t\t\tbody = eventDoc.body;\n\
\n\
\t\t\t\tevent.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );\n\
\t\t\t\tevent.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );\n\
\t\t\t}\n\
\n\
\t\t\t// Add relatedTarget, if necessary\n\
\t\t\tif ( !event.relatedTarget && fromElement ) {\n\
\t\t\t\tevent.relatedTarget = fromElement === event.target ? original.toElement : fromElement;\n\
\t\t\t}\n\
\n\
\t\t\t// Add which for click: 1 === left; 2 === middle; 3 === right\n\
\t\t\t// Note: button is not normalized, so don't use it\n\
\t\t\tif ( !event.which && button !== undefined ) {\n\
\t\t\t\tevent.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );\n\
\t\t\t}\n\
\n\
\t\t\treturn event;\n\
\t\t}\n\
\t},\n\
\n\
\tspecial: {\n\
\t\tload: {\n\
\t\t\t// Prevent triggered image.load events from bubbling to window.load\n\
\t\t\tnoBubble: true\n\
\t\t},\n\
\t\tclick: {\n\
\t\t\t// For checkbox, fire native event so checked state will be right\n\
\t\t\ttrigger: function() {\n\
\t\t\t\tif ( jQuery.nodeName( this, \"input\" ) && this.type === \"checkbox\" && this.click ) {\n\
\t\t\t\t\tthis.click();\n\
\t\t\t\t\treturn false;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t},\n\
\t\tfocus: {\n\
\t\t\t// Fire native event if possible so blur/focus sequence is correct\n\
\t\t\ttrigger: function() {\n\
\t\t\t\tif ( this !== document.activeElement && this.focus ) {\n\
\t\t\t\t\ttry {\n\
\t\t\t\t\t\tthis.focus();\n\
\t\t\t\t\t\treturn false;\n\
\t\t\t\t\t} catch ( e ) {\n\
\t\t\t\t\t\t// Support: IE<9\n\
\t\t\t\t\t\t// If we error on focus to hidden element (#1486, #12518),\n\
\t\t\t\t\t\t// let .trigger() run the handlers\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t},\n\
\t\t\tdelegateType: \"focusin\"\n\
\t\t},\n\
\t\tblur: {\n\
\t\t\ttrigger: function() {\n\
\t\t\t\tif ( this === document.activeElement && this.blur ) {\n\
\t\t\t\t\tthis.blur();\n\
\t\t\t\t\treturn false;\n\
\t\t\t\t}\n\
\t\t\t},\n\
\t\t\tdelegateType: \"focusout\"\n\
\t\t},\n\
\n\
\t\tbeforeunload: {\n\
\t\t\tpostDispatch: function( event ) {\n\
\n\
\t\t\t\t// Even when returnValue equals to undefined Firefox will still show alert\n\
\t\t\t\tif ( event.result !== undefined ) {\n\
\t\t\t\t\tevent.originalEvent.returnValue = event.result;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t},\n\
\n\
\tsimulate: function( type, elem, event, bubble ) {\n\
\t\t// Piggyback on a donor event to simulate a different one.\n\
\t\t// Fake originalEvent to avoid donor's stopPropagation, but if the\n\
\t\t// simulated event prevents default then we do the same on the donor.\n\
\t\tvar e = jQuery.extend(\n\
\t\t\tnew jQuery.Event(),\n\
\t\t\tevent,\n\
\t\t\t{ type: type,\n\
\t\t\t\tisSimulated: true,\n\
\t\t\t\toriginalEvent: {}\n\
\t\t\t}\n\
\t\t);\n\
\t\tif ( bubble ) {\n\
\t\t\tjQuery.event.trigger( e, null, elem );\n\
\t\t} else {\n\
\t\t\tjQuery.event.dispatch.call( elem, e );\n\
\t\t}\n\
\t\tif ( e.isDefaultPrevented() ) {\n\
\t\t\tevent.preventDefault();\n\
\t\t}\n\
\t}\n\
};\n\
\n\
jQuery.removeEvent = document.removeEventListener ?\n\
\tfunction( elem, type, handle ) {\n\
\t\tif ( elem.removeEventListener ) {\n\
\t\t\telem.removeEventListener( type, handle, false );\n\
\t\t}\n\
\t} :\n\
\tfunction( elem, type, handle ) {\n\
\t\tvar name = \"on\" + type;\n\
\n\
\t\tif ( elem.detachEvent ) {\n\
\n\
\t\t\t// #8545, #7054, preventing memory leaks for custom events in IE6-8\n\
\t\t\t// detachEvent needed property on element, by name of that event, to properly expose it to GC\n\
\t\t\tif ( typeof elem[ name ] === core_strundefined ) {\n\
\t\t\t\telem[ name ] = null;\n\
\t\t\t}\n\
\n\
\t\t\telem.detachEvent( name, handle );\n\
\t\t}\n\
\t};\n\
\n\
jQuery.Event = function( src, props ) {\n\
\t// Allow instantiation without the 'new' keyword\n\
\tif ( !(this instanceof jQuery.Event) ) {\n\
\t\treturn new jQuery.Event( src, props );\n\
\t}\n\
\n\
\t// Event object\n\
\tif ( src && src.type ) {\n\
\t\tthis.originalEvent = src;\n\
\t\tthis.type = src.type;\n\
\n\
\t\t// Events bubbling up the document may have been marked as prevented\n\
\t\t// by a handler lower down the tree; reflect the correct value.\n\
\t\tthis.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||\n\
\t\t\tsrc.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;\n\
\n\
\t// Event type\n\
\t} else {\n\
\t\tthis.type = src;\n\
\t}\n\
\n\
\t// Put explicitly provided properties onto the event object\n\
\tif ( props ) {\n\
\t\tjQuery.extend( this, props );\n\
\t}\n\
\n\
\t// Create a timestamp if incoming event doesn't have one\n\
\tthis.timeStamp = src && src.timeStamp || jQuery.now();\n\
\n\
\t// Mark it as fixed\n\
\tthis[ jQuery.expando ] = true;\n\
};\n\
\n\
// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding\n\
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html\n\
jQuery.Event.prototype = {\n\
\tisDefaultPrevented: returnFalse,\n\
\tisPropagationStopped: returnFalse,\n\
\tisImmediatePropagationStopped: returnFalse,\n\
\n\
\tpreventDefault: function() {\n\
\t\tvar e = this.originalEvent;\n\
\n\
\t\tthis.isDefaultPrevented = returnTrue;\n\
\t\tif ( !e ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// If preventDefault exists, run it on the original event\n\
\t\tif ( e.preventDefault ) {\n\
\t\t\te.preventDefault();\n\
\n\
\t\t// Support: IE\n\
\t\t// Otherwise set the returnValue property of the original event to false\n\
\t\t} else {\n\
\t\t\te.returnValue = false;\n\
\t\t}\n\
\t},\n\
\tstopPropagation: function() {\n\
\t\tvar e = this.originalEvent;\n\
\n\
\t\tthis.isPropagationStopped = returnTrue;\n\
\t\tif ( !e ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\t\t// If stopPropagation exists, run it on the original event\n\
\t\tif ( e.stopPropagation ) {\n\
\t\t\te.stopPropagation();\n\
\t\t}\n\
\n\
\t\t// Support: IE\n\
\t\t// Set the cancelBubble property of the original event to true\n\
\t\te.cancelBubble = true;\n\
\t},\n\
\tstopImmediatePropagation: function() {\n\
\t\tthis.isImmediatePropagationStopped = returnTrue;\n\
\t\tthis.stopPropagation();\n\
\t}\n\
};\n\
\n\
// Create mouseenter/leave events using mouseover/out and event-time checks\n\
jQuery.each({\n\
\tmouseenter: \"mouseover\",\n\
\tmouseleave: \"mouseout\"\n\
}, function( orig, fix ) {\n\
\tjQuery.event.special[ orig ] = {\n\
\t\tdelegateType: fix,\n\
\t\tbindType: fix,\n\
\n\
\t\thandle: function( event ) {\n\
\t\t\tvar ret,\n\
\t\t\t\ttarget = this,\n\
\t\t\t\trelated = event.relatedTarget,\n\
\t\t\t\thandleObj = event.handleObj;\n\
\n\
\t\t\t// For mousenter/leave call the handler if related is outside the target.\n\
\t\t\t// NB: No relatedTarget if the mouse left/entered the browser window\n\
\t\t\tif ( !related || (related !== target && !jQuery.contains( target, related )) ) {\n\
\t\t\t\tevent.type = handleObj.origType;\n\
\t\t\t\tret = handleObj.handler.apply( this, arguments );\n\
\t\t\t\tevent.type = fix;\n\
\t\t\t}\n\
\t\t\treturn ret;\n\
\t\t}\n\
\t};\n\
});\n\
\n\
// IE submit delegation\n\
if ( !jQuery.support.submitBubbles ) {\n\
\n\
\tjQuery.event.special.submit = {\n\
\t\tsetup: function() {\n\
\t\t\t// Only need this for delegated form submit events\n\
\t\t\tif ( jQuery.nodeName( this, \"form\" ) ) {\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\n\
\t\t\t// Lazy-add a submit handler when a descendant form may potentially be submitted\n\
\t\t\tjQuery.event.add( this, \"click._submit keypress._submit\", function( e ) {\n\
\t\t\t\t// Node name check avoids a VML-related crash in IE (#9807)\n\
\t\t\t\tvar elem = e.target,\n\
\t\t\t\t\tform = jQuery.nodeName( elem, \"input\" ) || jQuery.nodeName( elem, \"button\" ) ? elem.form : undefined;\n\
\t\t\t\tif ( form && !jQuery._data( form, \"submitBubbles\" ) ) {\n\
\t\t\t\t\tjQuery.event.add( form, \"submit._submit\", function( event ) {\n\
\t\t\t\t\t\tevent._submit_bubble = true;\n\
\t\t\t\t\t});\n\
\t\t\t\t\tjQuery._data( form, \"submitBubbles\", true );\n\
\t\t\t\t}\n\
\t\t\t});\n\
\t\t\t// return undefined since we don't need an event listener\n\
\t\t},\n\
\n\
\t\tpostDispatch: function( event ) {\n\
\t\t\t// If form was submitted by the user, bubble the event up the tree\n\
\t\t\tif ( event._submit_bubble ) {\n\
\t\t\t\tdelete event._submit_bubble;\n\
\t\t\t\tif ( this.parentNode && !event.isTrigger ) {\n\
\t\t\t\t\tjQuery.event.simulate( \"submit\", this.parentNode, event, true );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t},\n\
\n\
\t\tteardown: function() {\n\
\t\t\t// Only need this for delegated form submit events\n\
\t\t\tif ( jQuery.nodeName( this, \"form\" ) ) {\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\n\
\t\t\t// Remove delegated handlers; cleanData eventually reaps submit handlers attached above\n\
\t\t\tjQuery.event.remove( this, \"._submit\" );\n\
\t\t}\n\
\t};\n\
}\n\
\n\
// IE change delegation and checkbox/radio fix\n\
if ( !jQuery.support.changeBubbles ) {\n\
\n\
\tjQuery.event.special.change = {\n\
\n\
\t\tsetup: function() {\n\
\n\
\t\t\tif ( rformElems.test( this.nodeName ) ) {\n\
\t\t\t\t// IE doesn't fire change on a check/radio until blur; trigger it on click\n\
\t\t\t\t// after a propertychange. Eat the blur-change in special.change.handle.\n\
\t\t\t\t// This still fires onchange a second time for check/radio after blur.\n\
\t\t\t\tif ( this.type === \"checkbox\" || this.type === \"radio\" ) {\n\
\t\t\t\t\tjQuery.event.add( this, \"propertychange._change\", function( event ) {\n\
\t\t\t\t\t\tif ( event.originalEvent.propertyName === \"checked\" ) {\n\
\t\t\t\t\t\t\tthis._just_changed = true;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t});\n\
\t\t\t\t\tjQuery.event.add( this, \"click._change\", function( event ) {\n\
\t\t\t\t\t\tif ( this._just_changed && !event.isTrigger ) {\n\
\t\t\t\t\t\t\tthis._just_changed = false;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\t// Allow triggered, simulated change events (#11500)\n\
\t\t\t\t\t\tjQuery.event.simulate( \"change\", this, event, true );\n\
\t\t\t\t\t});\n\
\t\t\t\t}\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\t\t\t// Delegated event; lazy-add a change handler on descendant inputs\n\
\t\t\tjQuery.event.add( this, \"beforeactivate._change\", function( e ) {\n\
\t\t\t\tvar elem = e.target;\n\
\n\
\t\t\t\tif ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, \"changeBubbles\" ) ) {\n\
\t\t\t\t\tjQuery.event.add( elem, \"change._change\", function( event ) {\n\
\t\t\t\t\t\tif ( this.parentNode && !event.isSimulated && !event.isTrigger ) {\n\
\t\t\t\t\t\t\tjQuery.event.simulate( \"change\", this.parentNode, event, true );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t});\n\
\t\t\t\t\tjQuery._data( elem, \"changeBubbles\", true );\n\
\t\t\t\t}\n\
\t\t\t});\n\
\t\t},\n\
\n\
\t\thandle: function( event ) {\n\
\t\t\tvar elem = event.target;\n\
\n\
\t\t\t// Swallow native change events from checkbox/radio, we already triggered them above\n\
\t\t\tif ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== \"radio\" && elem.type !== \"checkbox\") ) {\n\
\t\t\t\treturn event.handleObj.handler.apply( this, arguments );\n\
\t\t\t}\n\
\t\t},\n\
\n\
\t\tteardown: function() {\n\
\t\t\tjQuery.event.remove( this, \"._change\" );\n\
\n\
\t\t\treturn !rformElems.test( this.nodeName );\n\
\t\t}\n\
\t};\n\
}\n\
\n\
// Create \"bubbling\" focus and blur events\n\
if ( !jQuery.support.focusinBubbles ) {\n\
\tjQuery.each({ focus: \"focusin\", blur: \"focusout\" }, function( orig, fix ) {\n\
\n\
\t\t// Attach a single capturing handler while someone wants focusin/focusout\n\
\t\tvar attaches = 0,\n\
\t\t\thandler = function( event ) {\n\
\t\t\t\tjQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );\n\
\t\t\t};\n\
\n\
\t\tjQuery.event.special[ fix ] = {\n\
\t\t\tsetup: function() {\n\
\t\t\t\tif ( attaches++ === 0 ) {\n\
\t\t\t\t\tdocument.addEventListener( orig, handler, true );\n\
\t\t\t\t}\n\
\t\t\t},\n\
\t\t\tteardown: function() {\n\
\t\t\t\tif ( --attaches === 0 ) {\n\
\t\t\t\t\tdocument.removeEventListener( orig, handler, true );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t};\n\
\t});\n\
}\n\
\n\
jQuery.fn.extend({\n\
\n\
\ton: function( types, selector, data, fn, /*INTERNAL*/ one ) {\n\
\t\tvar type, origFn;\n\
\n\
\t\t// Types can be a map of types/handlers\n\
\t\tif ( typeof types === \"object\" ) {\n\
\t\t\t// ( types-Object, selector, data )\n\
\t\t\tif ( typeof selector !== \"string\" ) {\n\
\t\t\t\t// ( types-Object, data )\n\
\t\t\t\tdata = data || selector;\n\
\t\t\t\tselector = undefined;\n\
\t\t\t}\n\
\t\t\tfor ( type in types ) {\n\
\t\t\t\tthis.on( type, selector, data, types[ type ], one );\n\
\t\t\t}\n\
\t\t\treturn this;\n\
\t\t}\n\
\n\
\t\tif ( data == null && fn == null ) {\n\
\t\t\t// ( types, fn )\n\
\t\t\tfn = selector;\n\
\t\t\tdata = selector = undefined;\n\
\t\t} else if ( fn == null ) {\n\
\t\t\tif ( typeof selector === \"string\" ) {\n\
\t\t\t\t// ( types, selector, fn )\n\
\t\t\t\tfn = data;\n\
\t\t\t\tdata = undefined;\n\
\t\t\t} else {\n\
\t\t\t\t// ( types, data, fn )\n\
\t\t\t\tfn = data;\n\
\t\t\t\tdata = selector;\n\
\t\t\t\tselector = undefined;\n\
\t\t\t}\n\
\t\t}\n\
\t\tif ( fn === false ) {\n\
\t\t\tfn = returnFalse;\n\
\t\t} else if ( !fn ) {\n\
\t\t\treturn this;\n\
\t\t}\n\
\n\
\t\tif ( one === 1 ) {\n\
\t\t\torigFn = fn;\n\
\t\t\tfn = function( event ) {\n\
\t\t\t\t// Can use an empty set, since event contains the info\n\
\t\t\t\tjQuery().off( event );\n\
\t\t\t\treturn origFn.apply( this, arguments );\n\
\t\t\t};\n\
\t\t\t// Use same guid so caller can remove using origFn\n\
\t\t\tfn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );\n\
\t\t}\n\
\t\treturn this.each( function() {\n\
\t\t\tjQuery.event.add( this, types, fn, data, selector );\n\
\t\t});\n\
\t},\n\
\tone: function( types, selector, data, fn ) {\n\
\t\treturn this.on( types, selector, data, fn, 1 );\n\
\t},\n\
\toff: function( types, selector, fn ) {\n\
\t\tvar handleObj, type;\n\
\t\tif ( types && types.preventDefault && types.handleObj ) {\n\
\t\t\t// ( event )  dispatched jQuery.Event\n\
\t\t\thandleObj = types.handleObj;\n\
\t\t\tjQuery( types.delegateTarget ).off(\n\
\t\t\t\thandleObj.namespace ? handleObj.origType + \".\" + handleObj.namespace : handleObj.origType,\n\
\t\t\t\thandleObj.selector,\n\
\t\t\t\thandleObj.handler\n\
\t\t\t);\n\
\t\t\treturn this;\n\
\t\t}\n\
\t\tif ( typeof types === \"object\" ) {\n\
\t\t\t// ( types-object [, selector] )\n\
\t\t\tfor ( type in types ) {\n\
\t\t\t\tthis.off( type, selector, types[ type ] );\n\
\t\t\t}\n\
\t\t\treturn this;\n\
\t\t}\n\
\t\tif ( selector === false || typeof selector === \"function\" ) {\n\
\t\t\t// ( types [, fn] )\n\
\t\t\tfn = selector;\n\
\t\t\tselector = undefined;\n\
\t\t}\n\
\t\tif ( fn === false ) {\n\
\t\t\tfn = returnFalse;\n\
\t\t}\n\
\t\treturn this.each(function() {\n\
\t\t\tjQuery.event.remove( this, types, fn, selector );\n\
\t\t});\n\
\t},\n\
\n\
\tbind: function( types, data, fn ) {\n\
\t\treturn this.on( types, null, data, fn );\n\
\t},\n\
\tunbind: function( types, fn ) {\n\
\t\treturn this.off( types, null, fn );\n\
\t},\n\
\n\
\tdelegate: function( selector, types, data, fn ) {\n\
\t\treturn this.on( types, selector, data, fn );\n\
\t},\n\
\tundelegate: function( selector, types, fn ) {\n\
\t\t// ( namespace ) or ( selector, types [, fn] )\n\
\t\treturn arguments.length === 1 ? this.off( selector, \"**\" ) : this.off( types, selector || \"**\", fn );\n\
\t},\n\
\n\
\ttrigger: function( type, data ) {\n\
\t\treturn this.each(function() {\n\
\t\t\tjQuery.event.trigger( type, data, this );\n\
\t\t});\n\
\t},\n\
\ttriggerHandler: function( type, data ) {\n\
\t\tvar elem = this[0];\n\
\t\tif ( elem ) {\n\
\t\t\treturn jQuery.event.trigger( type, data, elem, true );\n\
\t\t}\n\
\t}\n\
});\n\
/*!\n\
 * Sizzle CSS Selector Engine\n\
 * Copyright 2012 jQuery Foundation and other contributors\n\
 * Released under the MIT license\n\
 * http://sizzlejs.com/\n\
 */\n\
(function( window, undefined ) {\n\
\n\
var i,\n\
\tcachedruns,\n\
\tExpr,\n\
\tgetText,\n\
\tisXML,\n\
\tcompile,\n\
\thasDuplicate,\n\
\toutermostContext,\n\
\n\
\t// Local document vars\n\
\tsetDocument,\n\
\tdocument,\n\
\tdocElem,\n\
\tdocumentIsXML,\n\
\trbuggyQSA,\n\
\trbuggyMatches,\n\
\tmatches,\n\
\tcontains,\n\
\tsortOrder,\n\
\n\
\t// Instance-specific data\n\
\texpando = \"sizzle\" + -(new Date()),\n\
\tpreferredDoc = window.document,\n\
\tsupport = {},\n\
\tdirruns = 0,\n\
\tdone = 0,\n\
\tclassCache = createCache(),\n\
\ttokenCache = createCache(),\n\
\tcompilerCache = createCache(),\n\
\n\
\t// General-purpose constants\n\
\tstrundefined = typeof undefined,\n\
\tMAX_NEGATIVE = 1 << 31,\n\
\n\
\t// Array methods\n\
\tarr = [],\n\
\tpop = arr.pop,\n\
\tpush = arr.push,\n\
\tslice = arr.slice,\n\
\t// Use a stripped-down indexOf if we can't use a native one\n\
\tindexOf = arr.indexOf || function( elem ) {\n\
\t\tvar i = 0,\n\
\t\t\tlen = this.length;\n\
\t\tfor ( ; i < len; i++ ) {\n\
\t\t\tif ( this[i] === elem ) {\n\
\t\t\t\treturn i;\n\
\t\t\t}\n\
\t\t}\n\
\t\treturn -1;\n\
\t},\n\
\n\
\n\
\t// Regular expressions\n\
\n\
\t// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace\n\
\twhitespace = \"[\\\\x20\\\\t\\\\r\\\\n\
\\\\f]\",\n\
\t// http://www.w3.org/TR/css3-syntax/#characters\n\
\tcharacterEncoding = \"(?:\\\\\\\\.|[\\\\w-]|[^\\\\x00-\\\\xa0])+\",\n\
\n\
\t// Loosely modeled on CSS identifier characters\n\
\t// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors\n\
\t// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier\n\
\tidentifier = characterEncoding.replace( \"w\", \"w#\" ),\n\
\n\
\t// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors\n\
\toperators = \"([*^$|!~]?=)\",\n\
\tattributes = \"\\\\[\" + whitespace + \"*(\" + characterEncoding + \")\" + whitespace +\n\
\t\t\"*(?:\" + operators + whitespace + \"*(?:(['\\\"])((?:\\\\\\\\.|[^\\\\\\\\])*?)\\\\3|(\" + identifier + \")|)|)\" + whitespace + \"*\\\\]\",\n\
\n\
\t// Prefer arguments quoted,\n\
\t//   then not containing pseudos/brackets,\n\
\t//   then attribute selectors/non-parenthetical expressions,\n\
\t//   then anything else\n\
\t// These preferences are here to reduce the number of selectors\n\
\t//   needing tokenize in the PSEUDO preFilter\n\
\tpseudos = \":(\" + characterEncoding + \")(?:\\\\(((['\\\"])((?:\\\\\\\\.|[^\\\\\\\\])*?)\\\\3|((?:\\\\\\\\.|[^\\\\\\\\()[\\\\]]|\" + attributes.replace( 3, 8 ) + \")*)|.*)\\\\)|)\",\n\
\n\
\t// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter\n\
\trtrim = new RegExp( \"^\" + whitespace + \"+|((?:^|[^\\\\\\\\])(?:\\\\\\\\.)*)\" + whitespace + \"+$\", \"g\" ),\n\
\n\
\trcomma = new RegExp( \"^\" + whitespace + \"*,\" + whitespace + \"*\" ),\n\
\trcombinators = new RegExp( \"^\" + whitespace + \"*([\\\\x20\\\\t\\\\r\\\\n\
\\\\f>+~])\" + whitespace + \"*\" ),\n\
\trpseudo = new RegExp( pseudos ),\n\
\tridentifier = new RegExp( \"^\" + identifier + \"$\" ),\n\
\n\
\tmatchExpr = {\n\
\t\t\"ID\": new RegExp( \"^#(\" + characterEncoding + \")\" ),\n\
\t\t\"CLASS\": new RegExp( \"^\\\\.(\" + characterEncoding + \")\" ),\n\
\t\t\"NAME\": new RegExp( \"^\\\\[name=['\\\"]?(\" + characterEncoding + \")['\\\"]?\\\\]\" ),\n\
\t\t\"TAG\": new RegExp( \"^(\" + characterEncoding.replace( \"w\", \"w*\" ) + \")\" ),\n\
\t\t\"ATTR\": new RegExp( \"^\" + attributes ),\n\
\t\t\"PSEUDO\": new RegExp( \"^\" + pseudos ),\n\
\t\t\"CHILD\": new RegExp( \"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\\\(\" + whitespace +\n\
\t\t\t\"*(even|odd|(([+-]|)(\\\\d*)n|)\" + whitespace + \"*(?:([+-]|)\" + whitespace +\n\
\t\t\t\"*(\\\\d+)|))\" + whitespace + \"*\\\\)|)\", \"i\" ),\n\
\t\t// For use in libraries implementing .is()\n\
\t\t// We use this for POS matching in `select`\n\
\t\t\"needsContext\": new RegExp( \"^\" + whitespace + \"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\\\(\" +\n\
\t\t\twhitespace + \"*((?:-\\\\d)?\\\\d*)\" + whitespace + \"*\\\\)|)(?=[^-]|$)\", \"i\" )\n\
\t},\n\
\n\
\trsibling = /[\\x20\\t\\r\\n\
\\f]*[+~]/,\n\
\n\
\trnative = /^[^{]+\\{\\s*\\[native code/,\n\
\n\
\t// Easily-parseable/retrievable ID or TAG or CLASS selectors\n\
\trquickExpr = /^(?:#([\\w-]+)|(\\w+)|\\.([\\w-]+))$/,\n\
\n\
\trinputs = /^(?:input|select|textarea|button)$/i,\n\
\trheader = /^h\\d$/i,\n\
\n\
\trescape = /'|\\\\/g,\n\
\trattributeQuotes = /\\=[\\x20\\t\\r\\n\
\\f]*([^'\"\\]]*)[\\x20\\t\\r\\n\
\\f]*\\]/g,\n\
\n\
\t// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters\n\
\trunescape = /\\\\([\\da-fA-F]{1,6}[\\x20\\t\\r\\n\
\\f]?|.)/g,\n\
\tfunescape = function( _, escaped ) {\n\
\t\tvar high = \"0x\" + escaped - 0x10000;\n\
\t\t// NaN means non-codepoint\n\
\t\treturn high !== high ?\n\
\t\t\tescaped :\n\
\t\t\t// BMP codepoint\n\
\t\t\thigh < 0 ?\n\
\t\t\t\tString.fromCharCode( high + 0x10000 ) :\n\
\t\t\t\t// Supplemental Plane codepoint (surrogate pair)\n\
\t\t\t\tString.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );\n\
\t};\n\
\n\
// Use a stripped-down slice if we can't use a native one\n\
try {\n\
\tslice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;\n\
} catch ( e ) {\n\
\tslice = function( i ) {\n\
\t\tvar elem,\n\
\t\t\tresults = [];\n\
\t\twhile ( (elem = this[i++]) ) {\n\
\t\t\tresults.push( elem );\n\
\t\t}\n\
\t\treturn results;\n\
\t};\n\
}\n\
\n\
/**\n\
 * For feature detection\n\
 * @param {Function} fn The function to test for native support\n\
 */\n\
function isNative( fn ) {\n\
\treturn rnative.test( fn + \"\" );\n\
}\n\
\n\
/**\n\
 * Create key-value caches of limited size\n\
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with\n\
 *\tproperty name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)\n\
 *\tdeleting the oldest entry\n\
 */\n\
function createCache() {\n\
\tvar cache,\n\
\t\tkeys = [];\n\
\n\
\treturn (cache = function( key, value ) {\n\
\t\t// Use (key + \" \") to avoid collision with native prototype properties (see Issue #157)\n\
\t\tif ( keys.push( key += \" \" ) > Expr.cacheLength ) {\n\
\t\t\t// Only keep the most recent entries\n\
\t\t\tdelete cache[ keys.shift() ];\n\
\t\t}\n\
\t\treturn (cache[ key ] = value);\n\
\t});\n\
}\n\
\n\
/**\n\
 * Mark a function for special use by Sizzle\n\
 * @param {Function} fn The function to mark\n\
 */\n\
function markFunction( fn ) {\n\
\tfn[ expando ] = true;\n\
\treturn fn;\n\
}\n\
\n\
/**\n\
 * Support testing using an element\n\
 * @param {Function} fn Passed the created div and expects a boolean result\n\
 */\n\
function assert( fn ) {\n\
\tvar div = document.createElement(\"div\");\n\
\n\
\ttry {\n\
\t\treturn fn( div );\n\
\t} catch (e) {\n\
\t\treturn false;\n\
\t} finally {\n\
\t\t// release memory in IE\n\
\t\tdiv = null;\n\
\t}\n\
}\n\
\n\
function Sizzle( selector, context, results, seed ) {\n\
\tvar match, elem, m, nodeType,\n\
\t\t// QSA vars\n\
\t\ti, groups, old, nid, newContext, newSelector;\n\
\n\
\tif ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {\n\
\t\tsetDocument( context );\n\
\t}\n\
\n\
\tcontext = context || document;\n\
\tresults = results || [];\n\
\n\
\tif ( !selector || typeof selector !== \"string\" ) {\n\
\t\treturn results;\n\
\t}\n\
\n\
\tif ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {\n\
\t\treturn [];\n\
\t}\n\
\n\
\tif ( !documentIsXML && !seed ) {\n\
\n\
\t\t// Shortcuts\n\
\t\tif ( (match = rquickExpr.exec( selector )) ) {\n\
\t\t\t// Speed-up: Sizzle(\"#ID\")\n\
\t\t\tif ( (m = match[1]) ) {\n\
\t\t\t\tif ( nodeType === 9 ) {\n\
\t\t\t\t\telem = context.getElementById( m );\n\
\t\t\t\t\t// Check parentNode to catch when Blackberry 4.6 returns\n\
\t\t\t\t\t// nodes that are no longer in the document #6963\n\
\t\t\t\t\tif ( elem && elem.parentNode ) {\n\
\t\t\t\t\t\t// Handle the case where IE, Opera, and Webkit return items\n\
\t\t\t\t\t\t// by name instead of ID\n\
\t\t\t\t\t\tif ( elem.id === m ) {\n\
\t\t\t\t\t\t\tresults.push( elem );\n\
\t\t\t\t\t\t\treturn results;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\treturn results;\n\
\t\t\t\t\t}\n\
\t\t\t\t} else {\n\
\t\t\t\t\t// Context is not a document\n\
\t\t\t\t\tif ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&\n\
\t\t\t\t\t\tcontains( context, elem ) && elem.id === m ) {\n\
\t\t\t\t\t\tresults.push( elem );\n\
\t\t\t\t\t\treturn results;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t// Speed-up: Sizzle(\"TAG\")\n\
\t\t\t} else if ( match[2] ) {\n\
\t\t\t\tpush.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );\n\
\t\t\t\treturn results;\n\
\n\
\t\t\t// Speed-up: Sizzle(\".CLASS\")\n\
\t\t\t} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {\n\
\t\t\t\tpush.apply( results, slice.call(context.getElementsByClassName( m ), 0) );\n\
\t\t\t\treturn results;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// QSA path\n\
\t\tif ( support.qsa && !rbuggyQSA.test(selector) ) {\n\
\t\t\told = true;\n\
\t\t\tnid = expando;\n\
\t\t\tnewContext = context;\n\
\t\t\tnewSelector = nodeType === 9 && selector;\n\
\n\
\t\t\t// qSA works strangely on Element-rooted queries\n\
\t\t\t// We can work around this by specifying an extra ID on the root\n\
\t\t\t// and working up from there (Thanks to Andrew Dupont for the technique)\n\
\t\t\t// IE 8 doesn't work on object elements\n\
\t\t\tif ( nodeType === 1 && context.nodeName.toLowerCase() !== \"object\" ) {\n\
\t\t\t\tgroups = tokenize( selector );\n\
\n\
\t\t\t\tif ( (old = context.getAttribute(\"id\")) ) {\n\
\t\t\t\t\tnid = old.replace( rescape, \"\\\\$&\" );\n\
\t\t\t\t} else {\n\
\t\t\t\t\tcontext.setAttribute( \"id\", nid );\n\
\t\t\t\t}\n\
\t\t\t\tnid = \"[id='\" + nid + \"'] \";\n\
\n\
\t\t\t\ti = groups.length;\n\
\t\t\t\twhile ( i-- ) {\n\
\t\t\t\t\tgroups[i] = nid + toSelector( groups[i] );\n\
\t\t\t\t}\n\
\t\t\t\tnewContext = rsibling.test( selector ) && context.parentNode || context;\n\
\t\t\t\tnewSelector = groups.join(\",\");\n\
\t\t\t}\n\
\n\
\t\t\tif ( newSelector ) {\n\
\t\t\t\ttry {\n\
\t\t\t\t\tpush.apply( results, slice.call( newContext.querySelectorAll(\n\
\t\t\t\t\t\tnewSelector\n\
\t\t\t\t\t), 0 ) );\n\
\t\t\t\t\treturn results;\n\
\t\t\t\t} catch(qsaError) {\n\
\t\t\t\t} finally {\n\
\t\t\t\t\tif ( !old ) {\n\
\t\t\t\t\t\tcontext.removeAttribute(\"id\");\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\t// All others\n\
\treturn select( selector.replace( rtrim, \"$1\" ), context, results, seed );\n\
}\n\
\n\
/**\n\
 * Detect xml\n\
 * @param {Element|Object} elem An element or a document\n\
 */\n\
isXML = Sizzle.isXML = function( elem ) {\n\
\t// documentElement is verified for cases where it doesn't yet exist\n\
\t// (such as loading iframes in IE - #4833)\n\
\tvar documentElement = elem && (elem.ownerDocument || elem).documentElement;\n\
\treturn documentElement ? documentElement.nodeName !== \"HTML\" : false;\n\
};\n\
\n\
/**\n\
 * Sets document-related variables once based on the current document\n\
 * @param {Element|Object} [doc] An element or document object to use to set the document\n\
 * @returns {Object} Returns the current document\n\
 */\n\
setDocument = Sizzle.setDocument = function( node ) {\n\
\tvar doc = node ? node.ownerDocument || node : preferredDoc;\n\
\n\
\t// If no document and documentElement is available, return\n\
\tif ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {\n\
\t\treturn document;\n\
\t}\n\
\n\
\t// Set our document\n\
\tdocument = doc;\n\
\tdocElem = doc.documentElement;\n\
\n\
\t// Support tests\n\
\tdocumentIsXML = isXML( doc );\n\
\n\
\t// Check if getElementsByTagName(\"*\") returns only elements\n\
\tsupport.tagNameNoComments = assert(function( div ) {\n\
\t\tdiv.appendChild( doc.createComment(\"\") );\n\
\t\treturn !div.getElementsByTagName(\"*\").length;\n\
\t});\n\
\n\
\t// Check if attributes should be retrieved by attribute nodes\n\
\tsupport.attributes = assert(function( div ) {\n\
\t\tdiv.innerHTML = \"<select></select>\";\n\
\t\tvar type = typeof div.lastChild.getAttribute(\"multiple\");\n\
\t\t// IE8 returns a string for some attributes even when not present\n\
\t\treturn type !== \"boolean\" && type !== \"string\";\n\
\t});\n\
\n\
\t// Check if getElementsByClassName can be trusted\n\
\tsupport.getByClassName = assert(function( div ) {\n\
\t\t// Opera can't find a second classname (in 9.6)\n\
\t\tdiv.innerHTML = \"<div class='hidden e'></div><div class='hidden'></div>\";\n\
\t\tif ( !div.getElementsByClassName || !div.getElementsByClassName(\"e\").length ) {\n\
\t\t\treturn false;\n\
\t\t}\n\
\n\
\t\t// Safari 3.2 caches class attributes and doesn't catch changes\n\
\t\tdiv.lastChild.className = \"e\";\n\
\t\treturn div.getElementsByClassName(\"e\").length === 2;\n\
\t});\n\
\n\
\t// Check if getElementById returns elements by name\n\
\t// Check if getElementsByName privileges form controls or returns elements by ID\n\
\tsupport.getByName = assert(function( div ) {\n\
\t\t// Inject content\n\
\t\tdiv.id = expando + 0;\n\
\t\tdiv.innerHTML = \"<a name='\" + expando + \"'></a><div name='\" + expando + \"'></div>\";\n\
\t\tdocElem.insertBefore( div, docElem.firstChild );\n\
\n\
\t\t// Test\n\
\t\tvar pass = doc.getElementsByName &&\n\
\t\t\t// buggy browsers will return fewer than the correct 2\n\
\t\t\tdoc.getElementsByName( expando ).length === 2 +\n\
\t\t\t// buggy browsers will return more than the correct 0\n\
\t\t\tdoc.getElementsByName( expando + 0 ).length;\n\
\t\tsupport.getIdNotName = !doc.getElementById( expando );\n\
\n\
\t\t// Cleanup\n\
\t\tdocElem.removeChild( div );\n\
\n\
\t\treturn pass;\n\
\t});\n\
\n\
\t// IE6/7 return modified attributes\n\
\tExpr.attrHandle = assert(function( div ) {\n\
\t\tdiv.innerHTML = \"<a href='#'></a>\";\n\
\t\treturn div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&\n\
\t\t\tdiv.firstChild.getAttribute(\"href\") === \"#\";\n\
\t}) ?\n\
\t\t{} :\n\
\t\t{\n\
\t\t\t\"href\": function( elem ) {\n\
\t\t\t\treturn elem.getAttribute( \"href\", 2 );\n\
\t\t\t},\n\
\t\t\t\"type\": function( elem ) {\n\
\t\t\t\treturn elem.getAttribute(\"type\");\n\
\t\t\t}\n\
\t\t};\n\
\n\
\t// ID find and filter\n\
\tif ( support.getIdNotName ) {\n\
\t\tExpr.find[\"ID\"] = function( id, context ) {\n\
\t\t\tif ( typeof context.getElementById !== strundefined && !documentIsXML ) {\n\
\t\t\t\tvar m = context.getElementById( id );\n\
\t\t\t\t// Check parentNode to catch when Blackberry 4.6 returns\n\
\t\t\t\t// nodes that are no longer in the document #6963\n\
\t\t\t\treturn m && m.parentNode ? [m] : [];\n\
\t\t\t}\n\
\t\t};\n\
\t\tExpr.filter[\"ID\"] = function( id ) {\n\
\t\t\tvar attrId = id.replace( runescape, funescape );\n\
\t\t\treturn function( elem ) {\n\
\t\t\t\treturn elem.getAttribute(\"id\") === attrId;\n\
\t\t\t};\n\
\t\t};\n\
\t} else {\n\
\t\tExpr.find[\"ID\"] = function( id, context ) {\n\
\t\t\tif ( typeof context.getElementById !== strundefined && !documentIsXML ) {\n\
\t\t\t\tvar m = context.getElementById( id );\n\
\n\
\t\t\t\treturn m ?\n\
\t\t\t\t\tm.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode(\"id\").value === id ?\n\
\t\t\t\t\t\t[m] :\n\
\t\t\t\t\t\tundefined :\n\
\t\t\t\t\t[];\n\
\t\t\t}\n\
\t\t};\n\
\t\tExpr.filter[\"ID\"] =  function( id ) {\n\
\t\t\tvar attrId = id.replace( runescape, funescape );\n\
\t\t\treturn function( elem ) {\n\
\t\t\t\tvar node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode(\"id\");\n\
\t\t\t\treturn node && node.value === attrId;\n\
\t\t\t};\n\
\t\t};\n\
\t}\n\
\n\
\t// Tag\n\
\tExpr.find[\"TAG\"] = support.tagNameNoComments ?\n\
\t\tfunction( tag, context ) {\n\
\t\t\tif ( typeof context.getElementsByTagName !== strundefined ) {\n\
\t\t\t\treturn context.getElementsByTagName( tag );\n\
\t\t\t}\n\
\t\t} :\n\
\t\tfunction( tag, context ) {\n\
\t\t\tvar elem,\n\
\t\t\t\ttmp = [],\n\
\t\t\t\ti = 0,\n\
\t\t\t\tresults = context.getElementsByTagName( tag );\n\
\n\
\t\t\t// Filter out possible comments\n\
\t\t\tif ( tag === \"*\" ) {\n\
\t\t\t\twhile ( (elem = results[i++]) ) {\n\
\t\t\t\t\tif ( elem.nodeType === 1 ) {\n\
\t\t\t\t\t\ttmp.push( elem );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\treturn tmp;\n\
\t\t\t}\n\
\t\t\treturn results;\n\
\t\t};\n\
\n\
\t// Name\n\
\tExpr.find[\"NAME\"] = support.getByName && function( tag, context ) {\n\
\t\tif ( typeof context.getElementsByName !== strundefined ) {\n\
\t\t\treturn context.getElementsByName( name );\n\
\t\t}\n\
\t};\n\
\n\
\t// Class\n\
\tExpr.find[\"CLASS\"] = support.getByClassName && function( className, context ) {\n\
\t\tif ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {\n\
\t\t\treturn context.getElementsByClassName( className );\n\
\t\t}\n\
\t};\n\
\n\
\t// QSA and matchesSelector support\n\
\n\
\t// matchesSelector(:active) reports false when true (IE9/Opera 11.5)\n\
\trbuggyMatches = [];\n\
\n\
\t// qSa(:focus) reports false when true (Chrome 21),\n\
\t// no need to also add to buggyMatches since matches checks buggyQSA\n\
\t// A support test would require too much code (would include document ready)\n\
\trbuggyQSA = [ \":focus\" ];\n\
\n\
\tif ( (support.qsa = isNative(doc.querySelectorAll)) ) {\n\
\t\t// Build QSA regex\n\
\t\t// Regex strategy adopted from Diego Perini\n\
\t\tassert(function( div ) {\n\
\t\t\t// Select is set to empty string on purpose\n\
\t\t\t// This is to test IE's treatment of not explictly\n\
\t\t\t// setting a boolean content attribute,\n\
\t\t\t// since its presence should be enough\n\
\t\t\t// http://bugs.jquery.com/ticket/12359\n\
\t\t\tdiv.innerHTML = \"<select><option selected=''></option></select>\";\n\
\n\
\t\t\t// IE8 - Some boolean attributes are not treated correctly\n\
\t\t\tif ( !div.querySelectorAll(\"[selected]\").length ) {\n\
\t\t\t\trbuggyQSA.push( \"\\\\[\" + whitespace + \"*(?:checked|disabled|ismap|multiple|readonly|selected|value)\" );\n\
\t\t\t}\n\
\n\
\t\t\t// Webkit/Opera - :checked should return selected option elements\n\
\t\t\t// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked\n\
\t\t\t// IE8 throws error here and will not see later tests\n\
\t\t\tif ( !div.querySelectorAll(\":checked\").length ) {\n\
\t\t\t\trbuggyQSA.push(\":checked\");\n\
\t\t\t}\n\
\t\t});\n\
\n\
\t\tassert(function( div ) {\n\
\n\
\t\t\t// Opera 10-12/IE8 - ^= $= *= and empty values\n\
\t\t\t// Should not select anything\n\
\t\t\tdiv.innerHTML = \"<input type='hidden' i=''/>\";\n\
\t\t\tif ( div.querySelectorAll(\"[i^='']\").length ) {\n\
\t\t\t\trbuggyQSA.push( \"[*^$]=\" + whitespace + \"*(?:\\\"\\\"|'')\" );\n\
\t\t\t}\n\
\n\
\t\t\t// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)\n\
\t\t\t// IE8 throws error here and will not see later tests\n\
\t\t\tif ( !div.querySelectorAll(\":enabled\").length ) {\n\
\t\t\t\trbuggyQSA.push( \":enabled\", \":disabled\" );\n\
\t\t\t}\n\
\n\
\t\t\t// Opera 10-11 does not throw on post-comma invalid pseudos\n\
\t\t\tdiv.querySelectorAll(\"*,:x\");\n\
\t\t\trbuggyQSA.push(\",.*:\");\n\
\t\t});\n\
\t}\n\
\n\
\tif ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||\n\
\t\tdocElem.mozMatchesSelector ||\n\
\t\tdocElem.webkitMatchesSelector ||\n\
\t\tdocElem.oMatchesSelector ||\n\
\t\tdocElem.msMatchesSelector) )) ) {\n\
\n\
\t\tassert(function( div ) {\n\
\t\t\t// Check to see if it's possible to do matchesSelector\n\
\t\t\t// on a disconnected node (IE 9)\n\
\t\t\tsupport.disconnectedMatch = matches.call( div, \"div\" );\n\
\n\
\t\t\t// This should fail with an exception\n\
\t\t\t// Gecko does not error, returns false instead\n\
\t\t\tmatches.call( div, \"[s!='']:x\" );\n\
\t\t\trbuggyMatches.push( \"!=\", pseudos );\n\
\t\t});\n\
\t}\n\
\n\
\trbuggyQSA = new RegExp( rbuggyQSA.join(\"|\") );\n\
\trbuggyMatches = new RegExp( rbuggyMatches.join(\"|\") );\n\
\n\
\t// Element contains another\n\
\t// Purposefully does not implement inclusive descendent\n\
\t// As in, an element does not contain itself\n\
\tcontains = isNative(docElem.contains) || docElem.compareDocumentPosition ?\n\
\t\tfunction( a, b ) {\n\
\t\t\tvar adown = a.nodeType === 9 ? a.documentElement : a,\n\
\t\t\t\tbup = b && b.parentNode;\n\
\t\t\treturn a === bup || !!( bup && bup.nodeType === 1 && (\n\
\t\t\t\tadown.contains ?\n\
\t\t\t\t\tadown.contains( bup ) :\n\
\t\t\t\t\ta.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16\n\
\t\t\t));\n\
\t\t} :\n\
\t\tfunction( a, b ) {\n\
\t\t\tif ( b ) {\n\
\t\t\t\twhile ( (b = b.parentNode) ) {\n\
\t\t\t\t\tif ( b === a ) {\n\
\t\t\t\t\t\treturn true;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\treturn false;\n\
\t\t};\n\
\n\
\t// Document order sorting\n\
\tsortOrder = docElem.compareDocumentPosition ?\n\
\tfunction( a, b ) {\n\
\t\tvar compare;\n\
\n\
\t\tif ( a === b ) {\n\
\t\t\thasDuplicate = true;\n\
\t\t\treturn 0;\n\
\t\t}\n\
\n\
\t\tif ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {\n\
\t\t\tif ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {\n\
\t\t\t\tif ( a === doc || contains( preferredDoc, a ) ) {\n\
\t\t\t\t\treturn -1;\n\
\t\t\t\t}\n\
\t\t\t\tif ( b === doc || contains( preferredDoc, b ) ) {\n\
\t\t\t\t\treturn 1;\n\
\t\t\t\t}\n\
\t\t\t\treturn 0;\n\
\t\t\t}\n\
\t\t\treturn compare & 4 ? -1 : 1;\n\
\t\t}\n\
\n\
\t\treturn a.compareDocumentPosition ? -1 : 1;\n\
\t} :\n\
\tfunction( a, b ) {\n\
\t\tvar cur,\n\
\t\t\ti = 0,\n\
\t\t\taup = a.parentNode,\n\
\t\t\tbup = b.parentNode,\n\
\t\t\tap = [ a ],\n\
\t\t\tbp = [ b ];\n\
\n\
\t\t// Exit early if the nodes are identical\n\
\t\tif ( a === b ) {\n\
\t\t\thasDuplicate = true;\n\
\t\t\treturn 0;\n\
\n\
\t\t// Parentless nodes are either documents or disconnected\n\
\t\t} else if ( !aup || !bup ) {\n\
\t\t\treturn a === doc ? -1 :\n\
\t\t\t\tb === doc ? 1 :\n\
\t\t\t\taup ? -1 :\n\
\t\t\t\tbup ? 1 :\n\
\t\t\t\t0;\n\
\n\
\t\t// If the nodes are siblings, we can do a quick check\n\
\t\t} else if ( aup === bup ) {\n\
\t\t\treturn siblingCheck( a, b );\n\
\t\t}\n\
\n\
\t\t// Otherwise we need full lists of their ancestors for comparison\n\
\t\tcur = a;\n\
\t\twhile ( (cur = cur.parentNode) ) {\n\
\t\t\tap.unshift( cur );\n\
\t\t}\n\
\t\tcur = b;\n\
\t\twhile ( (cur = cur.parentNode) ) {\n\
\t\t\tbp.unshift( cur );\n\
\t\t}\n\
\n\
\t\t// Walk down the tree looking for a discrepancy\n\
\t\twhile ( ap[i] === bp[i] ) {\n\
\t\t\ti++;\n\
\t\t}\n\
\n\
\t\treturn i ?\n\
\t\t\t// Do a sibling check if the nodes have a common ancestor\n\
\t\t\tsiblingCheck( ap[i], bp[i] ) :\n\
\n\
\t\t\t// Otherwise nodes in our document sort first\n\
\t\t\tap[i] === preferredDoc ? -1 :\n\
\t\t\tbp[i] === preferredDoc ? 1 :\n\
\t\t\t0;\n\
\t};\n\
\n\
\t// Always assume the presence of duplicates if sort doesn't\n\
\t// pass them to our comparison function (as in Google Chrome).\n\
\thasDuplicate = false;\n\
\t[0, 0].sort( sortOrder );\n\
\tsupport.detectDuplicates = hasDuplicate;\n\
\n\
\treturn document;\n\
};\n\
\n\
Sizzle.matches = function( expr, elements ) {\n\
\treturn Sizzle( expr, null, null, elements );\n\
};\n\
\n\
Sizzle.matchesSelector = function( elem, expr ) {\n\
\t// Set document vars if needed\n\
\tif ( ( elem.ownerDocument || elem ) !== document ) {\n\
\t\tsetDocument( elem );\n\
\t}\n\
\n\
\t// Make sure that attribute selectors are quoted\n\
\texpr = expr.replace( rattributeQuotes, \"='$1']\" );\n\
\n\
\t// rbuggyQSA always contains :focus, so no need for an existence check\n\
\tif ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {\n\
\t\ttry {\n\
\t\t\tvar ret = matches.call( elem, expr );\n\
\n\
\t\t\t// IE 9's matchesSelector returns false on disconnected nodes\n\
\t\t\tif ( ret || support.disconnectedMatch ||\n\
\t\t\t\t\t// As well, disconnected nodes are said to be in a document\n\
\t\t\t\t\t// fragment in IE 9\n\
\t\t\t\t\telem.document && elem.document.nodeType !== 11 ) {\n\
\t\t\t\treturn ret;\n\
\t\t\t}\n\
\t\t} catch(e) {}\n\
\t}\n\
\n\
\treturn Sizzle( expr, document, null, [elem] ).length > 0;\n\
};\n\
\n\
Sizzle.contains = function( context, elem ) {\n\
\t// Set document vars if needed\n\
\tif ( ( context.ownerDocument || context ) !== document ) {\n\
\t\tsetDocument( context );\n\
\t}\n\
\treturn contains( context, elem );\n\
};\n\
\n\
Sizzle.attr = function( elem, name ) {\n\
\tvar val;\n\
\n\
\t// Set document vars if needed\n\
\tif ( ( elem.ownerDocument || elem ) !== document ) {\n\
\t\tsetDocument( elem );\n\
\t}\n\
\n\
\tif ( !documentIsXML ) {\n\
\t\tname = name.toLowerCase();\n\
\t}\n\
\tif ( (val = Expr.attrHandle[ name ]) ) {\n\
\t\treturn val( elem );\n\
\t}\n\
\tif ( documentIsXML || support.attributes ) {\n\
\t\treturn elem.getAttribute( name );\n\
\t}\n\
\treturn ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?\n\
\t\tname :\n\
\t\tval && val.specified ? val.value : null;\n\
};\n\
\n\
Sizzle.error = function( msg ) {\n\
\tthrow new Error( \"Syntax error, unrecognized expression: \" + msg );\n\
};\n\
\n\
// Document sorting and removing duplicates\n\
Sizzle.uniqueSort = function( results ) {\n\
\tvar elem,\n\
\t\tduplicates = [],\n\
\t\ti = 1,\n\
\t\tj = 0;\n\
\n\
\t// Unless we *know* we can detect duplicates, assume their presence\n\
\thasDuplicate = !support.detectDuplicates;\n\
\tresults.sort( sortOrder );\n\
\n\
\tif ( hasDuplicate ) {\n\
\t\tfor ( ; (elem = results[i]); i++ ) {\n\
\t\t\tif ( elem === results[ i - 1 ] ) {\n\
\t\t\t\tj = duplicates.push( i );\n\
\t\t\t}\n\
\t\t}\n\
\t\twhile ( j-- ) {\n\
\t\t\tresults.splice( duplicates[ j ], 1 );\n\
\t\t}\n\
\t}\n\
\n\
\treturn results;\n\
};\n\
\n\
function siblingCheck( a, b ) {\n\
\tvar cur = b && a,\n\
\t\tdiff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );\n\
\n\
\t// Use IE sourceIndex if available on both nodes\n\
\tif ( diff ) {\n\
\t\treturn diff;\n\
\t}\n\
\n\
\t// Check if b follows a\n\
\tif ( cur ) {\n\
\t\twhile ( (cur = cur.nextSibling) ) {\n\
\t\t\tif ( cur === b ) {\n\
\t\t\t\treturn -1;\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\treturn a ? 1 : -1;\n\
}\n\
\n\
// Returns a function to use in pseudos for input types\n\
function createInputPseudo( type ) {\n\
\treturn function( elem ) {\n\
\t\tvar name = elem.nodeName.toLowerCase();\n\
\t\treturn name === \"input\" && elem.type === type;\n\
\t};\n\
}\n\
\n\
// Returns a function to use in pseudos for buttons\n\
function createButtonPseudo( type ) {\n\
\treturn function( elem ) {\n\
\t\tvar name = elem.nodeName.toLowerCase();\n\
\t\treturn (name === \"input\" || name === \"button\") && elem.type === type;\n\
\t};\n\
}\n\
\n\
// Returns a function to use in pseudos for positionals\n\
function createPositionalPseudo( fn ) {\n\
\treturn markFunction(function( argument ) {\n\
\t\targument = +argument;\n\
\t\treturn markFunction(function( seed, matches ) {\n\
\t\t\tvar j,\n\
\t\t\t\tmatchIndexes = fn( [], seed.length, argument ),\n\
\t\t\t\ti = matchIndexes.length;\n\
\n\
\t\t\t// Match elements found at the specified indexes\n\
\t\t\twhile ( i-- ) {\n\
\t\t\t\tif ( seed[ (j = matchIndexes[i]) ] ) {\n\
\t\t\t\t\tseed[j] = !(matches[j] = seed[j]);\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t});\n\
\t});\n\
}\n\
\n\
/**\n\
 * Utility function for retrieving the text value of an array of DOM nodes\n\
 * @param {Array|Element} elem\n\
 */\n\
getText = Sizzle.getText = function( elem ) {\n\
\tvar node,\n\
\t\tret = \"\",\n\
\t\ti = 0,\n\
\t\tnodeType = elem.nodeType;\n\
\n\
\tif ( !nodeType ) {\n\
\t\t// If no nodeType, this is expected to be an array\n\
\t\tfor ( ; (node = elem[i]); i++ ) {\n\
\t\t\t// Do not traverse comment nodes\n\
\t\t\tret += getText( node );\n\
\t\t}\n\
\t} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {\n\
\t\t// Use textContent for elements\n\
\t\t// innerText usage removed for consistency of new lines (see #11153)\n\
\t\tif ( typeof elem.textContent === \"string\" ) {\n\
\t\t\treturn elem.textContent;\n\
\t\t} else {\n\
\t\t\t// Traverse its children\n\
\t\t\tfor ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {\n\
\t\t\t\tret += getText( elem );\n\
\t\t\t}\n\
\t\t}\n\
\t} else if ( nodeType === 3 || nodeType === 4 ) {\n\
\t\treturn elem.nodeValue;\n\
\t}\n\
\t// Do not include comment or processing instruction nodes\n\
\n\
\treturn ret;\n\
};\n\
\n\
Expr = Sizzle.selectors = {\n\
\n\
\t// Can be adjusted by the user\n\
\tcacheLength: 50,\n\
\n\
\tcreatePseudo: markFunction,\n\
\n\
\tmatch: matchExpr,\n\
\n\
\tfind: {},\n\
\n\
\trelative: {\n\
\t\t\">\": { dir: \"parentNode\", first: true },\n\
\t\t\" \": { dir: \"parentNode\" },\n\
\t\t\"+\": { dir: \"previousSibling\", first: true },\n\
\t\t\"~\": { dir: \"previousSibling\" }\n\
\t},\n\
\n\
\tpreFilter: {\n\
\t\t\"ATTR\": function( match ) {\n\
\t\t\tmatch[1] = match[1].replace( runescape, funescape );\n\
\n\
\t\t\t// Move the given value to match[3] whether quoted or unquoted\n\
\t\t\tmatch[3] = ( match[4] || match[5] || \"\" ).replace( runescape, funescape );\n\
\n\
\t\t\tif ( match[2] === \"~=\" ) {\n\
\t\t\t\tmatch[3] = \" \" + match[3] + \" \";\n\
\t\t\t}\n\
\n\
\t\t\treturn match.slice( 0, 4 );\n\
\t\t},\n\
\n\
\t\t\"CHILD\": function( match ) {\n\
\t\t\t/* matches from matchExpr[\"CHILD\"]\n\
\t\t\t\t1 type (only|nth|...)\n\
\t\t\t\t2 what (child|of-type)\n\
\t\t\t\t3 argument (even|odd|\\d*|\\d*n([+-]\\d+)?|...)\n\
\t\t\t\t4 xn-component of xn+y argument ([+-]?\\d*n|)\n\
\t\t\t\t5 sign of xn-component\n\
\t\t\t\t6 x of xn-component\n\
\t\t\t\t7 sign of y-component\n\
\t\t\t\t8 y of y-component\n\
\t\t\t*/\n\
\t\t\tmatch[1] = match[1].toLowerCase();\n\
\n\
\t\t\tif ( match[1].slice( 0, 3 ) === \"nth\" ) {\n\
\t\t\t\t// nth-* requires argument\n\
\t\t\t\tif ( !match[3] ) {\n\
\t\t\t\t\tSizzle.error( match[0] );\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// numeric x and y parameters for Expr.filter.CHILD\n\
\t\t\t\t// remember that false/true cast respectively to 0/1\n\
\t\t\t\tmatch[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === \"even\" || match[3] === \"odd\" ) );\n\
\t\t\t\tmatch[5] = +( ( match[7] + match[8] ) || match[3] === \"odd\" );\n\
\n\
\t\t\t// other types prohibit arguments\n\
\t\t\t} else if ( match[3] ) {\n\
\t\t\t\tSizzle.error( match[0] );\n\
\t\t\t}\n\
\n\
\t\t\treturn match;\n\
\t\t},\n\
\n\
\t\t\"PSEUDO\": function( match ) {\n\
\t\t\tvar excess,\n\
\t\t\t\tunquoted = !match[5] && match[2];\n\
\n\
\t\t\tif ( matchExpr[\"CHILD\"].test( match[0] ) ) {\n\
\t\t\t\treturn null;\n\
\t\t\t}\n\
\n\
\t\t\t// Accept quoted arguments as-is\n\
\t\t\tif ( match[4] ) {\n\
\t\t\t\tmatch[2] = match[4];\n\
\n\
\t\t\t// Strip excess characters from unquoted arguments\n\
\t\t\t} else if ( unquoted && rpseudo.test( unquoted ) &&\n\
\t\t\t\t// Get excess from tokenize (recursively)\n\
\t\t\t\t(excess = tokenize( unquoted, true )) &&\n\
\t\t\t\t// advance to the next closing parenthesis\n\
\t\t\t\t(excess = unquoted.indexOf( \")\", unquoted.length - excess ) - unquoted.length) ) {\n\
\n\
\t\t\t\t// excess is a negative index\n\
\t\t\t\tmatch[0] = match[0].slice( 0, excess );\n\
\t\t\t\tmatch[2] = unquoted.slice( 0, excess );\n\
\t\t\t}\n\
\n\
\t\t\t// Return only captures needed by the pseudo filter method (type and argument)\n\
\t\t\treturn match.slice( 0, 3 );\n\
\t\t}\n\
\t},\n\
\n\
\tfilter: {\n\
\n\
\t\t\"TAG\": function( nodeName ) {\n\
\t\t\tif ( nodeName === \"*\" ) {\n\
\t\t\t\treturn function() { return true; };\n\
\t\t\t}\n\
\n\
\t\t\tnodeName = nodeName.replace( runescape, funescape ).toLowerCase();\n\
\t\t\treturn function( elem ) {\n\
\t\t\t\treturn elem.nodeName && elem.nodeName.toLowerCase() === nodeName;\n\
\t\t\t};\n\
\t\t},\n\
\n\
\t\t\"CLASS\": function( className ) {\n\
\t\t\tvar pattern = classCache[ className + \" \" ];\n\
\n\
\t\t\treturn pattern ||\n\
\t\t\t\t(pattern = new RegExp( \"(^|\" + whitespace + \")\" + className + \"(\" + whitespace + \"|$)\" )) &&\n\
\t\t\t\tclassCache( className, function( elem ) {\n\
\t\t\t\t\treturn pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute(\"class\")) || \"\" );\n\
\t\t\t\t});\n\
\t\t},\n\
\n\
\t\t\"ATTR\": function( name, operator, check ) {\n\
\t\t\treturn function( elem ) {\n\
\t\t\t\tvar result = Sizzle.attr( elem, name );\n\
\n\
\t\t\t\tif ( result == null ) {\n\
\t\t\t\t\treturn operator === \"!=\";\n\
\t\t\t\t}\n\
\t\t\t\tif ( !operator ) {\n\
\t\t\t\t\treturn true;\n\
\t\t\t\t}\n\
\n\
\t\t\t\tresult += \"\";\n\
\n\
\t\t\t\treturn operator === \"=\" ? result === check :\n\
\t\t\t\t\toperator === \"!=\" ? result !== check :\n\
\t\t\t\t\toperator === \"^=\" ? check && result.indexOf( check ) === 0 :\n\
\t\t\t\t\toperator === \"*=\" ? check && result.indexOf( check ) > -1 :\n\
\t\t\t\t\toperator === \"$=\" ? check && result.slice( -check.length ) === check :\n\
\t\t\t\t\toperator === \"~=\" ? ( \" \" + result + \" \" ).indexOf( check ) > -1 :\n\
\t\t\t\t\toperator === \"|=\" ? result === check || result.slice( 0, check.length + 1 ) === check + \"-\" :\n\
\t\t\t\t\tfalse;\n\
\t\t\t};\n\
\t\t},\n\
\n\
\t\t\"CHILD\": function( type, what, argument, first, last ) {\n\
\t\t\tvar simple = type.slice( 0, 3 ) !== \"nth\",\n\
\t\t\t\tforward = type.slice( -4 ) !== \"last\",\n\
\t\t\t\tofType = what === \"of-type\";\n\
\n\
\t\t\treturn first === 1 && last === 0 ?\n\
\n\
\t\t\t\t// Shortcut for :nth-*(n)\n\
\t\t\t\tfunction( elem ) {\n\
\t\t\t\t\treturn !!elem.parentNode;\n\
\t\t\t\t} :\n\
\n\
\t\t\t\tfunction( elem, context, xml ) {\n\
\t\t\t\t\tvar cache, outerCache, node, diff, nodeIndex, start,\n\
\t\t\t\t\t\tdir = simple !== forward ? \"nextSibling\" : \"previousSibling\",\n\
\t\t\t\t\t\tparent = elem.parentNode,\n\
\t\t\t\t\t\tname = ofType && elem.nodeName.toLowerCase(),\n\
\t\t\t\t\t\tuseCache = !xml && !ofType;\n\
\n\
\t\t\t\t\tif ( parent ) {\n\
\n\
\t\t\t\t\t\t// :(first|last|only)-(child|of-type)\n\
\t\t\t\t\t\tif ( simple ) {\n\
\t\t\t\t\t\t\twhile ( dir ) {\n\
\t\t\t\t\t\t\t\tnode = elem;\n\
\t\t\t\t\t\t\t\twhile ( (node = node[ dir ]) ) {\n\
\t\t\t\t\t\t\t\t\tif ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {\n\
\t\t\t\t\t\t\t\t\t\treturn false;\n\
\t\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t\t// Reverse direction for :only-* (if we haven't yet done so)\n\
\t\t\t\t\t\t\t\tstart = dir = type === \"only\" && !start && \"nextSibling\";\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\treturn true;\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\tstart = [ forward ? parent.firstChild : parent.lastChild ];\n\
\n\
\t\t\t\t\t\t// non-xml :nth-child(...) stores cache data on `parent`\n\
\t\t\t\t\t\tif ( forward && useCache ) {\n\
\t\t\t\t\t\t\t// Seek `elem` from a previously-cached index\n\
\t\t\t\t\t\t\touterCache = parent[ expando ] || (parent[ expando ] = {});\n\
\t\t\t\t\t\t\tcache = outerCache[ type ] || [];\n\
\t\t\t\t\t\t\tnodeIndex = cache[0] === dirruns && cache[1];\n\
\t\t\t\t\t\t\tdiff = cache[0] === dirruns && cache[2];\n\
\t\t\t\t\t\t\tnode = nodeIndex && parent.childNodes[ nodeIndex ];\n\
\n\
\t\t\t\t\t\t\twhile ( (node = ++nodeIndex && node && node[ dir ] ||\n\
\n\
\t\t\t\t\t\t\t\t// Fallback to seeking `elem` from the start\n\
\t\t\t\t\t\t\t\t(diff = nodeIndex = 0) || start.pop()) ) {\n\
\n\
\t\t\t\t\t\t\t\t// When found, cache indexes on `parent` and break\n\
\t\t\t\t\t\t\t\tif ( node.nodeType === 1 && ++diff && node === elem ) {\n\
\t\t\t\t\t\t\t\t\touterCache[ type ] = [ dirruns, nodeIndex, diff ];\n\
\t\t\t\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t// Use previously-cached element index if available\n\
\t\t\t\t\t\t} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {\n\
\t\t\t\t\t\t\tdiff = cache[1];\n\
\n\
\t\t\t\t\t\t// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)\n\
\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\t// Use the same loop as above to seek `elem` from the start\n\
\t\t\t\t\t\t\twhile ( (node = ++nodeIndex && node && node[ dir ] ||\n\
\t\t\t\t\t\t\t\t(diff = nodeIndex = 0) || start.pop()) ) {\n\
\n\
\t\t\t\t\t\t\t\tif ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {\n\
\t\t\t\t\t\t\t\t\t// Cache the index of each encountered element\n\
\t\t\t\t\t\t\t\t\tif ( useCache ) {\n\
\t\t\t\t\t\t\t\t\t\t(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];\n\
\t\t\t\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t\t\t\tif ( node === elem ) {\n\
\t\t\t\t\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t// Incorporate the offset, then check against cycle size\n\
\t\t\t\t\t\tdiff -= last;\n\
\t\t\t\t\t\treturn diff === first || ( diff % first === 0 && diff / first >= 0 );\n\
\t\t\t\t\t}\n\
\t\t\t\t};\n\
\t\t},\n\
\n\
\t\t\"PSEUDO\": function( pseudo, argument ) {\n\
\t\t\t// pseudo-class names are case-insensitive\n\
\t\t\t// http://www.w3.org/TR/selectors/#pseudo-classes\n\
\t\t\t// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters\n\
\t\t\t// Remember that setFilters inherits from pseudos\n\
\t\t\tvar args,\n\
\t\t\t\tfn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||\n\
\t\t\t\t\tSizzle.error( \"unsupported pseudo: \" + pseudo );\n\
\n\
\t\t\t// The user may use createPseudo to indicate that\n\
\t\t\t// arguments are needed to create the filter function\n\
\t\t\t// just as Sizzle does\n\
\t\t\tif ( fn[ expando ] ) {\n\
\t\t\t\treturn fn( argument );\n\
\t\t\t}\n\
\n\
\t\t\t// But maintain support for old signatures\n\
\t\t\tif ( fn.length > 1 ) {\n\
\t\t\t\targs = [ pseudo, pseudo, \"\", argument ];\n\
\t\t\t\treturn Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?\n\
\t\t\t\t\tmarkFunction(function( seed, matches ) {\n\
\t\t\t\t\t\tvar idx,\n\
\t\t\t\t\t\t\tmatched = fn( seed, argument ),\n\
\t\t\t\t\t\t\ti = matched.length;\n\
\t\t\t\t\t\twhile ( i-- ) {\n\
\t\t\t\t\t\t\tidx = indexOf.call( seed, matched[i] );\n\
\t\t\t\t\t\t\tseed[ idx ] = !( matches[ idx ] = matched[i] );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}) :\n\
\t\t\t\t\tfunction( elem ) {\n\
\t\t\t\t\t\treturn fn( elem, 0, args );\n\
\t\t\t\t\t};\n\
\t\t\t}\n\
\n\
\t\t\treturn fn;\n\
\t\t}\n\
\t},\n\
\n\
\tpseudos: {\n\
\t\t// Potentially complex pseudos\n\
\t\t\"not\": markFunction(function( selector ) {\n\
\t\t\t// Trim the selector passed to compile\n\
\t\t\t// to avoid treating leading and trailing\n\
\t\t\t// spaces as combinators\n\
\t\t\tvar input = [],\n\
\t\t\t\tresults = [],\n\
\t\t\t\tmatcher = compile( selector.replace( rtrim, \"$1\" ) );\n\
\n\
\t\t\treturn matcher[ expando ] ?\n\
\t\t\t\tmarkFunction(function( seed, matches, context, xml ) {\n\
\t\t\t\t\tvar elem,\n\
\t\t\t\t\t\tunmatched = matcher( seed, null, xml, [] ),\n\
\t\t\t\t\t\ti = seed.length;\n\
\n\
\t\t\t\t\t// Match elements unmatched by `matcher`\n\
\t\t\t\t\twhile ( i-- ) {\n\
\t\t\t\t\t\tif ( (elem = unmatched[i]) ) {\n\
\t\t\t\t\t\t\tseed[i] = !(matches[i] = elem);\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t}) :\n\
\t\t\t\tfunction( elem, context, xml ) {\n\
\t\t\t\t\tinput[0] = elem;\n\
\t\t\t\t\tmatcher( input, null, xml, results );\n\
\t\t\t\t\treturn !results.pop();\n\
\t\t\t\t};\n\
\t\t}),\n\
\n\
\t\t\"has\": markFunction(function( selector ) {\n\
\t\t\treturn function( elem ) {\n\
\t\t\t\treturn Sizzle( selector, elem ).length > 0;\n\
\t\t\t};\n\
\t\t}),\n\
\n\
\t\t\"contains\": markFunction(function( text ) {\n\
\t\t\treturn function( elem ) {\n\
\t\t\t\treturn ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;\n\
\t\t\t};\n\
\t\t}),\n\
\n\
\t\t// \"Whether an element is represented by a :lang() selector\n\
\t\t// is based solely on the element's language value\n\
\t\t// being equal to the identifier C,\n\
\t\t// or beginning with the identifier C immediately followed by \"-\".\n\
\t\t// The matching of C against the element's language value is performed case-insensitively.\n\
\t\t// The identifier C does not have to be a valid language name.\"\n\
\t\t// http://www.w3.org/TR/selectors/#lang-pseudo\n\
\t\t\"lang\": markFunction( function( lang ) {\n\
\t\t\t// lang value must be a valid identifider\n\
\t\t\tif ( !ridentifier.test(lang || \"\") ) {\n\
\t\t\t\tSizzle.error( \"unsupported lang: \" + lang );\n\
\t\t\t}\n\
\t\t\tlang = lang.replace( runescape, funescape ).toLowerCase();\n\
\t\t\treturn function( elem ) {\n\
\t\t\t\tvar elemLang;\n\
\t\t\t\tdo {\n\
\t\t\t\t\tif ( (elemLang = documentIsXML ?\n\
\t\t\t\t\t\telem.getAttribute(\"xml:lang\") || elem.getAttribute(\"lang\") :\n\
\t\t\t\t\t\telem.lang) ) {\n\
\n\
\t\t\t\t\t\telemLang = elemLang.toLowerCase();\n\
\t\t\t\t\t\treturn elemLang === lang || elemLang.indexOf( lang + \"-\" ) === 0;\n\
\t\t\t\t\t}\n\
\t\t\t\t} while ( (elem = elem.parentNode) && elem.nodeType === 1 );\n\
\t\t\t\treturn false;\n\
\t\t\t};\n\
\t\t}),\n\
\n\
\t\t// Miscellaneous\n\
\t\t\"target\": function( elem ) {\n\
\t\t\tvar hash = window.location && window.location.hash;\n\
\t\t\treturn hash && hash.slice( 1 ) === elem.id;\n\
\t\t},\n\
\n\
\t\t\"root\": function( elem ) {\n\
\t\t\treturn elem === docElem;\n\
\t\t},\n\
\n\
\t\t\"focus\": function( elem ) {\n\
\t\t\treturn elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);\n\
\t\t},\n\
\n\
\t\t// Boolean properties\n\
\t\t\"enabled\": function( elem ) {\n\
\t\t\treturn elem.disabled === false;\n\
\t\t},\n\
\n\
\t\t\"disabled\": function( elem ) {\n\
\t\t\treturn elem.disabled === true;\n\
\t\t},\n\
\n\
\t\t\"checked\": function( elem ) {\n\
\t\t\t// In CSS3, :checked should return both checked and selected elements\n\
\t\t\t// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked\n\
\t\t\tvar nodeName = elem.nodeName.toLowerCase();\n\
\t\t\treturn (nodeName === \"input\" && !!elem.checked) || (nodeName === \"option\" && !!elem.selected);\n\
\t\t},\n\
\n\
\t\t\"selected\": function( elem ) {\n\
\t\t\t// Accessing this property makes selected-by-default\n\
\t\t\t// options in Safari work properly\n\
\t\t\tif ( elem.parentNode ) {\n\
\t\t\t\telem.parentNode.selectedIndex;\n\
\t\t\t}\n\
\n\
\t\t\treturn elem.selected === true;\n\
\t\t},\n\
\n\
\t\t// Contents\n\
\t\t\"empty\": function( elem ) {\n\
\t\t\t// http://www.w3.org/TR/selectors/#empty-pseudo\n\
\t\t\t// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),\n\
\t\t\t//   not comment, processing instructions, or others\n\
\t\t\t// Thanks to Diego Perini for the nodeName shortcut\n\
\t\t\t//   Greater than \"@\" means alpha characters (specifically not starting with \"#\" or \"?\")\n\
\t\t\tfor ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {\n\
\t\t\t\tif ( elem.nodeName > \"@\" || elem.nodeType === 3 || elem.nodeType === 4 ) {\n\
\t\t\t\t\treturn false;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\treturn true;\n\
\t\t},\n\
\n\
\t\t\"parent\": function( elem ) {\n\
\t\t\treturn !Expr.pseudos[\"empty\"]( elem );\n\
\t\t},\n\
\n\
\t\t// Element/input types\n\
\t\t\"header\": function( elem ) {\n\
\t\t\treturn rheader.test( elem.nodeName );\n\
\t\t},\n\
\n\
\t\t\"input\": function( elem ) {\n\
\t\t\treturn rinputs.test( elem.nodeName );\n\
\t\t},\n\
\n\
\t\t\"button\": function( elem ) {\n\
\t\t\tvar name = elem.nodeName.toLowerCase();\n\
\t\t\treturn name === \"input\" && elem.type === \"button\" || name === \"button\";\n\
\t\t},\n\
\n\
\t\t\"text\": function( elem ) {\n\
\t\t\tvar attr;\n\
\t\t\t// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)\n\
\t\t\t// use getAttribute instead to test this case\n\
\t\t\treturn elem.nodeName.toLowerCase() === \"input\" &&\n\
\t\t\t\telem.type === \"text\" &&\n\
\t\t\t\t( (attr = elem.getAttribute(\"type\")) == null || attr.toLowerCase() === elem.type );\n\
\t\t},\n\
\n\
\t\t// Position-in-collection\n\
\t\t\"first\": createPositionalPseudo(function() {\n\
\t\t\treturn [ 0 ];\n\
\t\t}),\n\
\n\
\t\t\"last\": createPositionalPseudo(function( matchIndexes, length ) {\n\
\t\t\treturn [ length - 1 ];\n\
\t\t}),\n\
\n\
\t\t\"eq\": createPositionalPseudo(function( matchIndexes, length, argument ) {\n\
\t\t\treturn [ argument < 0 ? argument + length : argument ];\n\
\t\t}),\n\
\n\
\t\t\"even\": createPositionalPseudo(function( matchIndexes, length ) {\n\
\t\t\tvar i = 0;\n\
\t\t\tfor ( ; i < length; i += 2 ) {\n\
\t\t\t\tmatchIndexes.push( i );\n\
\t\t\t}\n\
\t\t\treturn matchIndexes;\n\
\t\t}),\n\
\n\
\t\t\"odd\": createPositionalPseudo(function( matchIndexes, length ) {\n\
\t\t\tvar i = 1;\n\
\t\t\tfor ( ; i < length; i += 2 ) {\n\
\t\t\t\tmatchIndexes.push( i );\n\
\t\t\t}\n\
\t\t\treturn matchIndexes;\n\
\t\t}),\n\
\n\
\t\t\"lt\": createPositionalPseudo(function( matchIndexes, length, argument ) {\n\
\t\t\tvar i = argument < 0 ? argument + length : argument;\n\
\t\t\tfor ( ; --i >= 0; ) {\n\
\t\t\t\tmatchIndexes.push( i );\n\
\t\t\t}\n\
\t\t\treturn matchIndexes;\n\
\t\t}),\n\
\n\
\t\t\"gt\": createPositionalPseudo(function( matchIndexes, length, argument ) {\n\
\t\t\tvar i = argument < 0 ? argument + length : argument;\n\
\t\t\tfor ( ; ++i < length; ) {\n\
\t\t\t\tmatchIndexes.push( i );\n\
\t\t\t}\n\
\t\t\treturn matchIndexes;\n\
\t\t})\n\
\t}\n\
};\n\
\n\
// Add button/input type pseudos\n\
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {\n\
\tExpr.pseudos[ i ] = createInputPseudo( i );\n\
}\n\
for ( i in { submit: true, reset: true } ) {\n\
\tExpr.pseudos[ i ] = createButtonPseudo( i );\n\
}\n\
\n\
function tokenize( selector, parseOnly ) {\n\
\tvar matched, match, tokens, type,\n\
\t\tsoFar, groups, preFilters,\n\
\t\tcached = tokenCache[ selector + \" \" ];\n\
\n\
\tif ( cached ) {\n\
\t\treturn parseOnly ? 0 : cached.slice( 0 );\n\
\t}\n\
\n\
\tsoFar = selector;\n\
\tgroups = [];\n\
\tpreFilters = Expr.preFilter;\n\
\n\
\twhile ( soFar ) {\n\
\n\
\t\t// Comma and first run\n\
\t\tif ( !matched || (match = rcomma.exec( soFar )) ) {\n\
\t\t\tif ( match ) {\n\
\t\t\t\t// Don't consume trailing commas as valid\n\
\t\t\t\tsoFar = soFar.slice( match[0].length ) || soFar;\n\
\t\t\t}\n\
\t\t\tgroups.push( tokens = [] );\n\
\t\t}\n\
\n\
\t\tmatched = false;\n\
\n\
\t\t// Combinators\n\
\t\tif ( (match = rcombinators.exec( soFar )) ) {\n\
\t\t\tmatched = match.shift();\n\
\t\t\ttokens.push( {\n\
\t\t\t\tvalue: matched,\n\
\t\t\t\t// Cast descendant combinators to space\n\
\t\t\t\ttype: match[0].replace( rtrim, \" \" )\n\
\t\t\t} );\n\
\t\t\tsoFar = soFar.slice( matched.length );\n\
\t\t}\n\
\n\
\t\t// Filters\n\
\t\tfor ( type in Expr.filter ) {\n\
\t\t\tif ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||\n\
\t\t\t\t(match = preFilters[ type ]( match ))) ) {\n\
\t\t\t\tmatched = match.shift();\n\
\t\t\t\ttokens.push( {\n\
\t\t\t\t\tvalue: matched,\n\
\t\t\t\t\ttype: type,\n\
\t\t\t\t\tmatches: match\n\
\t\t\t\t} );\n\
\t\t\t\tsoFar = soFar.slice( matched.length );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\tif ( !matched ) {\n\
\t\t\tbreak;\n\
\t\t}\n\
\t}\n\
\n\
\t// Return the length of the invalid excess\n\
\t// if we're just parsing\n\
\t// Otherwise, throw an error or return tokens\n\
\treturn parseOnly ?\n\
\t\tsoFar.length :\n\
\t\tsoFar ?\n\
\t\t\tSizzle.error( selector ) :\n\
\t\t\t// Cache the tokens\n\
\t\t\ttokenCache( selector, groups ).slice( 0 );\n\
}\n\
\n\
function toSelector( tokens ) {\n\
\tvar i = 0,\n\
\t\tlen = tokens.length,\n\
\t\tselector = \"\";\n\
\tfor ( ; i < len; i++ ) {\n\
\t\tselector += tokens[i].value;\n\
\t}\n\
\treturn selector;\n\
}\n\
\n\
function addCombinator( matcher, combinator, base ) {\n\
\tvar dir = combinator.dir,\n\
\t\tcheckNonElements = base && dir === \"parentNode\",\n\
\t\tdoneName = done++;\n\
\n\
\treturn combinator.first ?\n\
\t\t// Check against closest ancestor/preceding element\n\
\t\tfunction( elem, context, xml ) {\n\
\t\t\twhile ( (elem = elem[ dir ]) ) {\n\
\t\t\t\tif ( elem.nodeType === 1 || checkNonElements ) {\n\
\t\t\t\t\treturn matcher( elem, context, xml );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t} :\n\
\n\
\t\t// Check against all ancestor/preceding elements\n\
\t\tfunction( elem, context, xml ) {\n\
\t\t\tvar data, cache, outerCache,\n\
\t\t\t\tdirkey = dirruns + \" \" + doneName;\n\
\n\
\t\t\t// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching\n\
\t\t\tif ( xml ) {\n\
\t\t\t\twhile ( (elem = elem[ dir ]) ) {\n\
\t\t\t\t\tif ( elem.nodeType === 1 || checkNonElements ) {\n\
\t\t\t\t\t\tif ( matcher( elem, context, xml ) ) {\n\
\t\t\t\t\t\t\treturn true;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\twhile ( (elem = elem[ dir ]) ) {\n\
\t\t\t\t\tif ( elem.nodeType === 1 || checkNonElements ) {\n\
\t\t\t\t\t\touterCache = elem[ expando ] || (elem[ expando ] = {});\n\
\t\t\t\t\t\tif ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {\n\
\t\t\t\t\t\t\tif ( (data = cache[1]) === true || data === cachedruns ) {\n\
\t\t\t\t\t\t\t\treturn data === true;\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\tcache = outerCache[ dir ] = [ dirkey ];\n\
\t\t\t\t\t\t\tcache[1] = matcher( elem, context, xml ) || cachedruns;\n\
\t\t\t\t\t\t\tif ( cache[1] === true ) {\n\
\t\t\t\t\t\t\t\treturn true;\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t};\n\
}\n\
\n\
function elementMatcher( matchers ) {\n\
\treturn matchers.length > 1 ?\n\
\t\tfunction( elem, context, xml ) {\n\
\t\t\tvar i = matchers.length;\n\
\t\t\twhile ( i-- ) {\n\
\t\t\t\tif ( !matchers[i]( elem, context, xml ) ) {\n\
\t\t\t\t\treturn false;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t\treturn true;\n\
\t\t} :\n\
\t\tmatchers[0];\n\
}\n\
\n\
function condense( unmatched, map, filter, context, xml ) {\n\
\tvar elem,\n\
\t\tnewUnmatched = [],\n\
\t\ti = 0,\n\
\t\tlen = unmatched.length,\n\
\t\tmapped = map != null;\n\
\n\
\tfor ( ; i < len; i++ ) {\n\
\t\tif ( (elem = unmatched[i]) ) {\n\
\t\t\tif ( !filter || filter( elem, context, xml ) ) {\n\
\t\t\t\tnewUnmatched.push( elem );\n\
\t\t\t\tif ( mapped ) {\n\
\t\t\t\t\tmap.push( i );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\treturn newUnmatched;\n\
}\n\
\n\
function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {\n\
\tif ( postFilter && !postFilter[ expando ] ) {\n\
\t\tpostFilter = setMatcher( postFilter );\n\
\t}\n\
\tif ( postFinder && !postFinder[ expando ] ) {\n\
\t\tpostFinder = setMatcher( postFinder, postSelector );\n\
\t}\n\
\treturn markFunction(function( seed, results, context, xml ) {\n\
\t\tvar temp, i, elem,\n\
\t\t\tpreMap = [],\n\
\t\t\tpostMap = [],\n\
\t\t\tpreexisting = results.length,\n\
\n\
\t\t\t// Get initial elements from seed or context\n\
\t\t\telems = seed || multipleContexts( selector || \"*\", context.nodeType ? [ context ] : context, [] ),\n\
\n\
\t\t\t// Prefilter to get matcher input, preserving a map for seed-results synchronization\n\
\t\t\tmatcherIn = preFilter && ( seed || !selector ) ?\n\
\t\t\t\tcondense( elems, preMap, preFilter, context, xml ) :\n\
\t\t\t\telems,\n\
\n\
\t\t\tmatcherOut = matcher ?\n\
\t\t\t\t// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,\n\
\t\t\t\tpostFinder || ( seed ? preFilter : preexisting || postFilter ) ?\n\
\n\
\t\t\t\t\t// ...intermediate processing is necessary\n\
\t\t\t\t\t[] :\n\
\n\
\t\t\t\t\t// ...otherwise use results directly\n\
\t\t\t\t\tresults :\n\
\t\t\t\tmatcherIn;\n\
\n\
\t\t// Find primary matches\n\
\t\tif ( matcher ) {\n\
\t\t\tmatcher( matcherIn, matcherOut, context, xml );\n\
\t\t}\n\
\n\
\t\t// Apply postFilter\n\
\t\tif ( postFilter ) {\n\
\t\t\ttemp = condense( matcherOut, postMap );\n\
\t\t\tpostFilter( temp, [], context, xml );\n\
\n\
\t\t\t// Un-match failing elements by moving them back to matcherIn\n\
\t\t\ti = temp.length;\n\
\t\t\twhile ( i-- ) {\n\
\t\t\t\tif ( (elem = temp[i]) ) {\n\
\t\t\t\t\tmatcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\tif ( seed ) {\n\
\t\t\tif ( postFinder || preFilter ) {\n\
\t\t\t\tif ( postFinder ) {\n\
\t\t\t\t\t// Get the final matcherOut by condensing this intermediate into postFinder contexts\n\
\t\t\t\t\ttemp = [];\n\
\t\t\t\t\ti = matcherOut.length;\n\
\t\t\t\t\twhile ( i-- ) {\n\
\t\t\t\t\t\tif ( (elem = matcherOut[i]) ) {\n\
\t\t\t\t\t\t\t// Restore matcherIn since elem is not yet a final match\n\
\t\t\t\t\t\t\ttemp.push( (matcherIn[i] = elem) );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\tpostFinder( null, (matcherOut = []), temp, xml );\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Move matched elements from seed to results to keep them synchronized\n\
\t\t\t\ti = matcherOut.length;\n\
\t\t\t\twhile ( i-- ) {\n\
\t\t\t\t\tif ( (elem = matcherOut[i]) &&\n\
\t\t\t\t\t\t(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {\n\
\n\
\t\t\t\t\t\tseed[temp] = !(results[temp] = elem);\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t// Add elements to results, through postFinder if defined\n\
\t\t} else {\n\
\t\t\tmatcherOut = condense(\n\
\t\t\t\tmatcherOut === results ?\n\
\t\t\t\t\tmatcherOut.splice( preexisting, matcherOut.length ) :\n\
\t\t\t\t\tmatcherOut\n\
\t\t\t);\n\
\t\t\tif ( postFinder ) {\n\
\t\t\t\tpostFinder( null, results, matcherOut, xml );\n\
\t\t\t} else {\n\
\t\t\t\tpush.apply( results, matcherOut );\n\
\t\t\t}\n\
\t\t}\n\
\t});\n\
}\n\
\n\
function matcherFromTokens( tokens ) {\n\
\tvar checkContext, matcher, j,\n\
\t\tlen = tokens.length,\n\
\t\tleadingRelative = Expr.relative[ tokens[0].type ],\n\
\t\timplicitRelative = leadingRelative || Expr.relative[\" \"],\n\
\t\ti = leadingRelative ? 1 : 0,\n\
\n\
\t\t// The foundational matcher ensures that elements are reachable from top-level context(s)\n\
\t\tmatchContext = addCombinator( function( elem ) {\n\
\t\t\treturn elem === checkContext;\n\
\t\t}, implicitRelative, true ),\n\
\t\tmatchAnyContext = addCombinator( function( elem ) {\n\
\t\t\treturn indexOf.call( checkContext, elem ) > -1;\n\
\t\t}, implicitRelative, true ),\n\
\t\tmatchers = [ function( elem, context, xml ) {\n\
\t\t\treturn ( !leadingRelative && ( xml || context !== outermostContext ) ) || (\n\
\t\t\t\t(checkContext = context).nodeType ?\n\
\t\t\t\t\tmatchContext( elem, context, xml ) :\n\
\t\t\t\t\tmatchAnyContext( elem, context, xml ) );\n\
\t\t} ];\n\
\n\
\tfor ( ; i < len; i++ ) {\n\
\t\tif ( (matcher = Expr.relative[ tokens[i].type ]) ) {\n\
\t\t\tmatchers = [ addCombinator(elementMatcher( matchers ), matcher) ];\n\
\t\t} else {\n\
\t\t\tmatcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );\n\
\n\
\t\t\t// Return special upon seeing a positional matcher\n\
\t\t\tif ( matcher[ expando ] ) {\n\
\t\t\t\t// Find the next relative operator (if any) for proper handling\n\
\t\t\t\tj = ++i;\n\
\t\t\t\tfor ( ; j < len; j++ ) {\n\
\t\t\t\t\tif ( Expr.relative[ tokens[j].type ] ) {\n\
\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t\treturn setMatcher(\n\
\t\t\t\t\ti > 1 && elementMatcher( matchers ),\n\
\t\t\t\t\ti > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, \"$1\" ),\n\
\t\t\t\t\tmatcher,\n\
\t\t\t\t\ti < j && matcherFromTokens( tokens.slice( i, j ) ),\n\
\t\t\t\t\tj < len && matcherFromTokens( (tokens = tokens.slice( j )) ),\n\
\t\t\t\t\tj < len && toSelector( tokens )\n\
\t\t\t\t);\n\
\t\t\t}\n\
\t\t\tmatchers.push( matcher );\n\
\t\t}\n\
\t}\n\
\n\
\treturn elementMatcher( matchers );\n\
}\n\
\n\
function matcherFromGroupMatchers( elementMatchers, setMatchers ) {\n\
\t// A counter to specify which element is currently being matched\n\
\tvar matcherCachedRuns = 0,\n\
\t\tbySet = setMatchers.length > 0,\n\
\t\tbyElement = elementMatchers.length > 0,\n\
\t\tsuperMatcher = function( seed, context, xml, results, expandContext ) {\n\
\t\t\tvar elem, j, matcher,\n\
\t\t\t\tsetMatched = [],\n\
\t\t\t\tmatchedCount = 0,\n\
\t\t\t\ti = \"0\",\n\
\t\t\t\tunmatched = seed && [],\n\
\t\t\t\toutermost = expandContext != null,\n\
\t\t\t\tcontextBackup = outermostContext,\n\
\t\t\t\t// We must always have either seed elements or context\n\
\t\t\t\telems = seed || byElement && Expr.find[\"TAG\"]( \"*\", expandContext && context.parentNode || context ),\n\
\t\t\t\t// Use integer dirruns iff this is the outermost matcher\n\
\t\t\t\tdirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);\n\
\n\
\t\t\tif ( outermost ) {\n\
\t\t\t\toutermostContext = context !== document && context;\n\
\t\t\t\tcachedruns = matcherCachedRuns;\n\
\t\t\t}\n\
\n\
\t\t\t// Add elements passing elementMatchers directly to results\n\
\t\t\t// Keep `i` a string if there are no elements so `matchedCount` will be \"00\" below\n\
\t\t\tfor ( ; (elem = elems[i]) != null; i++ ) {\n\
\t\t\t\tif ( byElement && elem ) {\n\
\t\t\t\t\tj = 0;\n\
\t\t\t\t\twhile ( (matcher = elementMatchers[j++]) ) {\n\
\t\t\t\t\t\tif ( matcher( elem, context, xml ) ) {\n\
\t\t\t\t\t\t\tresults.push( elem );\n\
\t\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\tif ( outermost ) {\n\
\t\t\t\t\t\tdirruns = dirrunsUnique;\n\
\t\t\t\t\t\tcachedruns = ++matcherCachedRuns;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Track unmatched elements for set filters\n\
\t\t\t\tif ( bySet ) {\n\
\t\t\t\t\t// They will have gone through all possible matchers\n\
\t\t\t\t\tif ( (elem = !matcher && elem) ) {\n\
\t\t\t\t\t\tmatchedCount--;\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Lengthen the array for every element, matched or not\n\
\t\t\t\t\tif ( seed ) {\n\
\t\t\t\t\t\tunmatched.push( elem );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// Apply set filters to unmatched elements\n\
\t\t\tmatchedCount += i;\n\
\t\t\tif ( bySet && i !== matchedCount ) {\n\
\t\t\t\tj = 0;\n\
\t\t\t\twhile ( (matcher = setMatchers[j++]) ) {\n\
\t\t\t\t\tmatcher( unmatched, setMatched, context, xml );\n\
\t\t\t\t}\n\
\n\
\t\t\t\tif ( seed ) {\n\
\t\t\t\t\t// Reintegrate element matches to eliminate the need for sorting\n\
\t\t\t\t\tif ( matchedCount > 0 ) {\n\
\t\t\t\t\t\twhile ( i-- ) {\n\
\t\t\t\t\t\t\tif ( !(unmatched[i] || setMatched[i]) ) {\n\
\t\t\t\t\t\t\t\tsetMatched[i] = pop.call( results );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Discard index placeholder values to get only actual matches\n\
\t\t\t\t\tsetMatched = condense( setMatched );\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Add matches to results\n\
\t\t\t\tpush.apply( results, setMatched );\n\
\n\
\t\t\t\t// Seedless set matches succeeding multiple successful matchers stipulate sorting\n\
\t\t\t\tif ( outermost && !seed && setMatched.length > 0 &&\n\
\t\t\t\t\t( matchedCount + setMatchers.length ) > 1 ) {\n\
\n\
\t\t\t\t\tSizzle.uniqueSort( results );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// Override manipulation of globals by nested matchers\n\
\t\t\tif ( outermost ) {\n\
\t\t\t\tdirruns = dirrunsUnique;\n\
\t\t\t\toutermostContext = contextBackup;\n\
\t\t\t}\n\
\n\
\t\t\treturn unmatched;\n\
\t\t};\n\
\n\
\treturn bySet ?\n\
\t\tmarkFunction( superMatcher ) :\n\
\t\tsuperMatcher;\n\
}\n\
\n\
compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {\n\
\tvar i,\n\
\t\tsetMatchers = [],\n\
\t\telementMatchers = [],\n\
\t\tcached = compilerCache[ selector + \" \" ];\n\
\n\
\tif ( !cached ) {\n\
\t\t// Generate a function of recursive functions that can be used to check each element\n\
\t\tif ( !group ) {\n\
\t\t\tgroup = tokenize( selector );\n\
\t\t}\n\
\t\ti = group.length;\n\
\t\twhile ( i-- ) {\n\
\t\t\tcached = matcherFromTokens( group[i] );\n\
\t\t\tif ( cached[ expando ] ) {\n\
\t\t\t\tsetMatchers.push( cached );\n\
\t\t\t} else {\n\
\t\t\t\telementMatchers.push( cached );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Cache the compiled function\n\
\t\tcached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );\n\
\t}\n\
\treturn cached;\n\
};\n\
\n\
function multipleContexts( selector, contexts, results ) {\n\
\tvar i = 0,\n\
\t\tlen = contexts.length;\n\
\tfor ( ; i < len; i++ ) {\n\
\t\tSizzle( selector, contexts[i], results );\n\
\t}\n\
\treturn results;\n\
}\n\
\n\
function select( selector, context, results, seed ) {\n\
\tvar i, tokens, token, type, find,\n\
\t\tmatch = tokenize( selector );\n\
\n\
\tif ( !seed ) {\n\
\t\t// Try to minimize operations if there is only one group\n\
\t\tif ( match.length === 1 ) {\n\
\n\
\t\t\t// Take a shortcut and set the context if the root selector is an ID\n\
\t\t\ttokens = match[0] = match[0].slice( 0 );\n\
\t\t\tif ( tokens.length > 2 && (token = tokens[0]).type === \"ID\" &&\n\
\t\t\t\t\tcontext.nodeType === 9 && !documentIsXML &&\n\
\t\t\t\t\tExpr.relative[ tokens[1].type ] ) {\n\
\n\
\t\t\t\tcontext = Expr.find[\"ID\"]( token.matches[0].replace( runescape, funescape ), context )[0];\n\
\t\t\t\tif ( !context ) {\n\
\t\t\t\t\treturn results;\n\
\t\t\t\t}\n\
\n\
\t\t\t\tselector = selector.slice( tokens.shift().value.length );\n\
\t\t\t}\n\
\n\
\t\t\t// Fetch a seed set for right-to-left matching\n\
\t\t\ti = matchExpr[\"needsContext\"].test( selector ) ? 0 : tokens.length;\n\
\t\t\twhile ( i-- ) {\n\
\t\t\t\ttoken = tokens[i];\n\
\n\
\t\t\t\t// Abort if we hit a combinator\n\
\t\t\t\tif ( Expr.relative[ (type = token.type) ] ) {\n\
\t\t\t\t\tbreak;\n\
\t\t\t\t}\n\
\t\t\t\tif ( (find = Expr.find[ type ]) ) {\n\
\t\t\t\t\t// Search, expanding context for leading sibling combinators\n\
\t\t\t\t\tif ( (seed = find(\n\
\t\t\t\t\t\ttoken.matches[0].replace( runescape, funescape ),\n\
\t\t\t\t\t\trsibling.test( tokens[0].type ) && context.parentNode || context\n\
\t\t\t\t\t)) ) {\n\
\n\
\t\t\t\t\t\t// If seed is empty or no tokens remain, we can return early\n\
\t\t\t\t\t\ttokens.splice( i, 1 );\n\
\t\t\t\t\t\tselector = seed.length && toSelector( tokens );\n\
\t\t\t\t\t\tif ( !selector ) {\n\
\t\t\t\t\t\t\tpush.apply( results, slice.call( seed, 0 ) );\n\
\t\t\t\t\t\t\treturn results;\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\t// Compile and execute a filtering function\n\
\t// Provide `match` to avoid retokenization if we modified the selector above\n\
\tcompile( selector, match )(\n\
\t\tseed,\n\
\t\tcontext,\n\
\t\tdocumentIsXML,\n\
\t\tresults,\n\
\t\trsibling.test( selector )\n\
\t);\n\
\treturn results;\n\
}\n\
\n\
// Deprecated\n\
Expr.pseudos[\"nth\"] = Expr.pseudos[\"eq\"];\n\
\n\
// Easy API for creating new setFilters\n\
function setFilters() {}\n\
Expr.filters = setFilters.prototype = Expr.pseudos;\n\
Expr.setFilters = new setFilters();\n\
\n\
// Initialize with the default document\n\
setDocument();\n\
\n\
// Override sizzle attribute retrieval\n\
Sizzle.attr = jQuery.attr;\n\
jQuery.find = Sizzle;\n\
jQuery.expr = Sizzle.selectors;\n\
jQuery.expr[\":\"] = jQuery.expr.pseudos;\n\
jQuery.unique = Sizzle.uniqueSort;\n\
jQuery.text = Sizzle.getText;\n\
jQuery.isXMLDoc = Sizzle.isXML;\n\
jQuery.contains = Sizzle.contains;\n\
\n\
\n\
})( window );\n\
var runtil = /Until$/,\n\
\trparentsprev = /^(?:parents|prev(?:Until|All))/,\n\
\tisSimple = /^.[^:#\\[\\.,]*$/,\n\
\trneedsContext = jQuery.expr.match.needsContext,\n\
\t// methods guaranteed to produce a unique set when starting from a unique set\n\
\tguaranteedUnique = {\n\
\t\tchildren: true,\n\
\t\tcontents: true,\n\
\t\tnext: true,\n\
\t\tprev: true\n\
\t};\n\
\n\
jQuery.fn.extend({\n\
\tfind: function( selector ) {\n\
\t\tvar i, ret, self,\n\
\t\t\tlen = this.length;\n\
\n\
\t\tif ( typeof selector !== \"string\" ) {\n\
\t\t\tself = this;\n\
\t\t\treturn this.pushStack( jQuery( selector ).filter(function() {\n\
\t\t\t\tfor ( i = 0; i < len; i++ ) {\n\
\t\t\t\t\tif ( jQuery.contains( self[ i ], this ) ) {\n\
\t\t\t\t\t\treturn true;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}) );\n\
\t\t}\n\
\n\
\t\tret = [];\n\
\t\tfor ( i = 0; i < len; i++ ) {\n\
\t\t\tjQuery.find( selector, this[ i ], ret );\n\
\t\t}\n\
\n\
\t\t// Needed because $( selector, context ) becomes $( context ).find( selector )\n\
\t\tret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );\n\
\t\tret.selector = ( this.selector ? this.selector + \" \" : \"\" ) + selector;\n\
\t\treturn ret;\n\
\t},\n\
\n\
\thas: function( target ) {\n\
\t\tvar i,\n\
\t\t\ttargets = jQuery( target, this ),\n\
\t\t\tlen = targets.length;\n\
\n\
\t\treturn this.filter(function() {\n\
\t\t\tfor ( i = 0; i < len; i++ ) {\n\
\t\t\t\tif ( jQuery.contains( this, targets[i] ) ) {\n\
\t\t\t\t\treturn true;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\tnot: function( selector ) {\n\
\t\treturn this.pushStack( winnow(this, selector, false) );\n\
\t},\n\
\n\
\tfilter: function( selector ) {\n\
\t\treturn this.pushStack( winnow(this, selector, true) );\n\
\t},\n\
\n\
\tis: function( selector ) {\n\
\t\treturn !!selector && (\n\
\t\t\ttypeof selector === \"string\" ?\n\
\t\t\t\t// If this is a positional/relative selector, check membership in the returned set\n\
\t\t\t\t// so $(\"p:first\").is(\"p:last\") won't return true for a doc with two \"p\".\n\
\t\t\t\trneedsContext.test( selector ) ?\n\
\t\t\t\t\tjQuery( selector, this.context ).index( this[0] ) >= 0 :\n\
\t\t\t\t\tjQuery.filter( selector, this ).length > 0 :\n\
\t\t\t\tthis.filter( selector ).length > 0 );\n\
\t},\n\
\n\
\tclosest: function( selectors, context ) {\n\
\t\tvar cur,\n\
\t\t\ti = 0,\n\
\t\t\tl = this.length,\n\
\t\t\tret = [],\n\
\t\t\tpos = rneedsContext.test( selectors ) || typeof selectors !== \"string\" ?\n\
\t\t\t\tjQuery( selectors, context || this.context ) :\n\
\t\t\t\t0;\n\
\n\
\t\tfor ( ; i < l; i++ ) {\n\
\t\t\tcur = this[i];\n\
\n\
\t\t\twhile ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {\n\
\t\t\t\tif ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {\n\
\t\t\t\t\tret.push( cur );\n\
\t\t\t\t\tbreak;\n\
\t\t\t\t}\n\
\t\t\t\tcur = cur.parentNode;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );\n\
\t},\n\
\n\
\t// Determine the position of an element within\n\
\t// the matched set of elements\n\
\tindex: function( elem ) {\n\
\n\
\t\t// No argument, return index in parent\n\
\t\tif ( !elem ) {\n\
\t\t\treturn ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;\n\
\t\t}\n\
\n\
\t\t// index in selector\n\
\t\tif ( typeof elem === \"string\" ) {\n\
\t\t\treturn jQuery.inArray( this[0], jQuery( elem ) );\n\
\t\t}\n\
\n\
\t\t// Locate the position of the desired element\n\
\t\treturn jQuery.inArray(\n\
\t\t\t// If it receives a jQuery object, the first element is used\n\
\t\t\telem.jquery ? elem[0] : elem, this );\n\
\t},\n\
\n\
\tadd: function( selector, context ) {\n\
\t\tvar set = typeof selector === \"string\" ?\n\
\t\t\t\tjQuery( selector, context ) :\n\
\t\t\t\tjQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),\n\
\t\t\tall = jQuery.merge( this.get(), set );\n\
\n\
\t\treturn this.pushStack( jQuery.unique(all) );\n\
\t},\n\
\n\
\taddBack: function( selector ) {\n\
\t\treturn this.add( selector == null ?\n\
\t\t\tthis.prevObject : this.prevObject.filter(selector)\n\
\t\t);\n\
\t}\n\
});\n\
\n\
jQuery.fn.andSelf = jQuery.fn.addBack;\n\
\n\
function sibling( cur, dir ) {\n\
\tdo {\n\
\t\tcur = cur[ dir ];\n\
\t} while ( cur && cur.nodeType !== 1 );\n\
\n\
\treturn cur;\n\
}\n\
\n\
jQuery.each({\n\
\tparent: function( elem ) {\n\
\t\tvar parent = elem.parentNode;\n\
\t\treturn parent && parent.nodeType !== 11 ? parent : null;\n\
\t},\n\
\tparents: function( elem ) {\n\
\t\treturn jQuery.dir( elem, \"parentNode\" );\n\
\t},\n\
\tparentsUntil: function( elem, i, until ) {\n\
\t\treturn jQuery.dir( elem, \"parentNode\", until );\n\
\t},\n\
\tnext: function( elem ) {\n\
\t\treturn sibling( elem, \"nextSibling\" );\n\
\t},\n\
\tprev: function( elem ) {\n\
\t\treturn sibling( elem, \"previousSibling\" );\n\
\t},\n\
\tnextAll: function( elem ) {\n\
\t\treturn jQuery.dir( elem, \"nextSibling\" );\n\
\t},\n\
\tprevAll: function( elem ) {\n\
\t\treturn jQuery.dir( elem, \"previousSibling\" );\n\
\t},\n\
\tnextUntil: function( elem, i, until ) {\n\
\t\treturn jQuery.dir( elem, \"nextSibling\", until );\n\
\t},\n\
\tprevUntil: function( elem, i, until ) {\n\
\t\treturn jQuery.dir( elem, \"previousSibling\", until );\n\
\t},\n\
\tsiblings: function( elem ) {\n\
\t\treturn jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );\n\
\t},\n\
\tchildren: function( elem ) {\n\
\t\treturn jQuery.sibling( elem.firstChild );\n\
\t},\n\
\tcontents: function( elem ) {\n\
\t\treturn jQuery.nodeName( elem, \"iframe\" ) ?\n\
\t\t\telem.contentDocument || elem.contentWindow.document :\n\
\t\t\tjQuery.merge( [], elem.childNodes );\n\
\t}\n\
}, function( name, fn ) {\n\
\tjQuery.fn[ name ] = function( until, selector ) {\n\
\t\tvar ret = jQuery.map( this, fn, until );\n\
\n\
\t\tif ( !runtil.test( name ) ) {\n\
\t\t\tselector = until;\n\
\t\t}\n\
\n\
\t\tif ( selector && typeof selector === \"string\" ) {\n\
\t\t\tret = jQuery.filter( selector, ret );\n\
\t\t}\n\
\n\
\t\tret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;\n\
\n\
\t\tif ( this.length > 1 && rparentsprev.test( name ) ) {\n\
\t\t\tret = ret.reverse();\n\
\t\t}\n\
\n\
\t\treturn this.pushStack( ret );\n\
\t};\n\
});\n\
\n\
jQuery.extend({\n\
\tfilter: function( expr, elems, not ) {\n\
\t\tif ( not ) {\n\
\t\t\texpr = \":not(\" + expr + \")\";\n\
\t\t}\n\
\n\
\t\treturn elems.length === 1 ?\n\
\t\t\tjQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :\n\
\t\t\tjQuery.find.matches(expr, elems);\n\
\t},\n\
\n\
\tdir: function( elem, dir, until ) {\n\
\t\tvar matched = [],\n\
\t\t\tcur = elem[ dir ];\n\
\n\
\t\twhile ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {\n\
\t\t\tif ( cur.nodeType === 1 ) {\n\
\t\t\t\tmatched.push( cur );\n\
\t\t\t}\n\
\t\t\tcur = cur[dir];\n\
\t\t}\n\
\t\treturn matched;\n\
\t},\n\
\n\
\tsibling: function( n, elem ) {\n\
\t\tvar r = [];\n\
\n\
\t\tfor ( ; n; n = n.nextSibling ) {\n\
\t\t\tif ( n.nodeType === 1 && n !== elem ) {\n\
\t\t\t\tr.push( n );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn r;\n\
\t}\n\
});\n\
\n\
// Implement the identical functionality for filter and not\n\
function winnow( elements, qualifier, keep ) {\n\
\n\
\t// Can't pass null or undefined to indexOf in Firefox 4\n\
\t// Set to 0 to skip string check\n\
\tqualifier = qualifier || 0;\n\
\n\
\tif ( jQuery.isFunction( qualifier ) ) {\n\
\t\treturn jQuery.grep(elements, function( elem, i ) {\n\
\t\t\tvar retVal = !!qualifier.call( elem, i, elem );\n\
\t\t\treturn retVal === keep;\n\
\t\t});\n\
\n\
\t} else if ( qualifier.nodeType ) {\n\
\t\treturn jQuery.grep(elements, function( elem ) {\n\
\t\t\treturn ( elem === qualifier ) === keep;\n\
\t\t});\n\
\n\
\t} else if ( typeof qualifier === \"string\" ) {\n\
\t\tvar filtered = jQuery.grep(elements, function( elem ) {\n\
\t\t\treturn elem.nodeType === 1;\n\
\t\t});\n\
\n\
\t\tif ( isSimple.test( qualifier ) ) {\n\
\t\t\treturn jQuery.filter(qualifier, filtered, !keep);\n\
\t\t} else {\n\
\t\t\tqualifier = jQuery.filter( qualifier, filtered );\n\
\t\t}\n\
\t}\n\
\n\
\treturn jQuery.grep(elements, function( elem ) {\n\
\t\treturn ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;\n\
\t});\n\
}\n\
function createSafeFragment( document ) {\n\
\tvar list = nodeNames.split( \"|\" ),\n\
\t\tsafeFrag = document.createDocumentFragment();\n\
\n\
\tif ( safeFrag.createElement ) {\n\
\t\twhile ( list.length ) {\n\
\t\t\tsafeFrag.createElement(\n\
\t\t\t\tlist.pop()\n\
\t\t\t);\n\
\t\t}\n\
\t}\n\
\treturn safeFrag;\n\
}\n\
\n\
var nodeNames = \"abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|\" +\n\
\t\t\"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video\",\n\
\trinlinejQuery = / jQuery\\d+=\"(?:null|\\d+)\"/g,\n\
\trnoshimcache = new RegExp(\"<(?:\" + nodeNames + \")[\\\\s/>]\", \"i\"),\n\
\trleadingWhitespace = /^\\s+/,\n\
\trxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\\w:]+)[^>]*)\\/>/gi,\n\
\trtagName = /<([\\w:]+)/,\n\
\trtbody = /<tbody/i,\n\
\trhtml = /<|&#?\\w+;/,\n\
\trnoInnerhtml = /<(?:script|style|link)/i,\n\
\tmanipulation_rcheckableType = /^(?:checkbox|radio)$/i,\n\
\t// checked=\"checked\" or checked\n\
\trchecked = /checked\\s*(?:[^=]|=\\s*.checked.)/i,\n\
\trscriptType = /^$|\\/(?:java|ecma)script/i,\n\
\trscriptTypeMasked = /^true\\/(.*)/,\n\
\trcleanScript = /^\\s*<!(?:\\[CDATA\\[|--)|(?:\\]\\]|--)>\\s*$/g,\n\
\n\
\t// We have to close these tags to support XHTML (#13200)\n\
\twrapMap = {\n\
\t\toption: [ 1, \"<select multiple='multiple'>\", \"</select>\" ],\n\
\t\tlegend: [ 1, \"<fieldset>\", \"</fieldset>\" ],\n\
\t\tarea: [ 1, \"<map>\", \"</map>\" ],\n\
\t\tparam: [ 1, \"<object>\", \"</object>\" ],\n\
\t\tthead: [ 1, \"<table>\", \"</table>\" ],\n\
\t\ttr: [ 2, \"<table><tbody>\", \"</tbody></table>\" ],\n\
\t\tcol: [ 2, \"<table><tbody></tbody><colgroup>\", \"</colgroup></table>\" ],\n\
\t\ttd: [ 3, \"<table><tbody><tr>\", \"</tr></tbody></table>\" ],\n\
\n\
\t\t// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,\n\
\t\t// unless wrapped in a div with non-breaking characters in front of it.\n\
\t\t_default: jQuery.support.htmlSerialize ? [ 0, \"\", \"\" ] : [ 1, \"X<div>\", \"</div>\"  ]\n\
\t},\n\
\tsafeFragment = createSafeFragment( document ),\n\
\tfragmentDiv = safeFragment.appendChild( document.createElement(\"div\") );\n\
\n\
wrapMap.optgroup = wrapMap.option;\n\
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;\n\
wrapMap.th = wrapMap.td;\n\
\n\
jQuery.fn.extend({\n\
\ttext: function( value ) {\n\
\t\treturn jQuery.access( this, function( value ) {\n\
\t\t\treturn value === undefined ?\n\
\t\t\t\tjQuery.text( this ) :\n\
\t\t\t\tthis.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );\n\
\t\t}, null, value, arguments.length );\n\
\t},\n\
\n\
\twrapAll: function( html ) {\n\
\t\tif ( jQuery.isFunction( html ) ) {\n\
\t\t\treturn this.each(function(i) {\n\
\t\t\t\tjQuery(this).wrapAll( html.call(this, i) );\n\
\t\t\t});\n\
\t\t}\n\
\n\
\t\tif ( this[0] ) {\n\
\t\t\t// The elements to wrap the target around\n\
\t\t\tvar wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);\n\
\n\
\t\t\tif ( this[0].parentNode ) {\n\
\t\t\t\twrap.insertBefore( this[0] );\n\
\t\t\t}\n\
\n\
\t\t\twrap.map(function() {\n\
\t\t\t\tvar elem = this;\n\
\n\
\t\t\t\twhile ( elem.firstChild && elem.firstChild.nodeType === 1 ) {\n\
\t\t\t\t\telem = elem.firstChild;\n\
\t\t\t\t}\n\
\n\
\t\t\t\treturn elem;\n\
\t\t\t}).append( this );\n\
\t\t}\n\
\n\
\t\treturn this;\n\
\t},\n\
\n\
\twrapInner: function( html ) {\n\
\t\tif ( jQuery.isFunction( html ) ) {\n\
\t\t\treturn this.each(function(i) {\n\
\t\t\t\tjQuery(this).wrapInner( html.call(this, i) );\n\
\t\t\t});\n\
\t\t}\n\
\n\
\t\treturn this.each(function() {\n\
\t\t\tvar self = jQuery( this ),\n\
\t\t\t\tcontents = self.contents();\n\
\n\
\t\t\tif ( contents.length ) {\n\
\t\t\t\tcontents.wrapAll( html );\n\
\n\
\t\t\t} else {\n\
\t\t\t\tself.append( html );\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\twrap: function( html ) {\n\
\t\tvar isFunction = jQuery.isFunction( html );\n\
\n\
\t\treturn this.each(function(i) {\n\
\t\t\tjQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );\n\
\t\t});\n\
\t},\n\
\n\
\tunwrap: function() {\n\
\t\treturn this.parent().each(function() {\n\
\t\t\tif ( !jQuery.nodeName( this, \"body\" ) ) {\n\
\t\t\t\tjQuery( this ).replaceWith( this.childNodes );\n\
\t\t\t}\n\
\t\t}).end();\n\
\t},\n\
\n\
\tappend: function() {\n\
\t\treturn this.domManip(arguments, true, function( elem ) {\n\
\t\t\tif ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {\n\
\t\t\t\tthis.appendChild( elem );\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\tprepend: function() {\n\
\t\treturn this.domManip(arguments, true, function( elem ) {\n\
\t\t\tif ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {\n\
\t\t\t\tthis.insertBefore( elem, this.firstChild );\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\tbefore: function() {\n\
\t\treturn this.domManip( arguments, false, function( elem ) {\n\
\t\t\tif ( this.parentNode ) {\n\
\t\t\t\tthis.parentNode.insertBefore( elem, this );\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\tafter: function() {\n\
\t\treturn this.domManip( arguments, false, function( elem ) {\n\
\t\t\tif ( this.parentNode ) {\n\
\t\t\t\tthis.parentNode.insertBefore( elem, this.nextSibling );\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\t// keepData is for internal use only--do not document\n\
\tremove: function( selector, keepData ) {\n\
\t\tvar elem,\n\
\t\t\ti = 0;\n\
\n\
\t\tfor ( ; (elem = this[i]) != null; i++ ) {\n\
\t\t\tif ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {\n\
\t\t\t\tif ( !keepData && elem.nodeType === 1 ) {\n\
\t\t\t\t\tjQuery.cleanData( getAll( elem ) );\n\
\t\t\t\t}\n\
\n\
\t\t\t\tif ( elem.parentNode ) {\n\
\t\t\t\t\tif ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {\n\
\t\t\t\t\t\tsetGlobalEval( getAll( elem, \"script\" ) );\n\
\t\t\t\t\t}\n\
\t\t\t\t\telem.parentNode.removeChild( elem );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn this;\n\
\t},\n\
\n\
\tempty: function() {\n\
\t\tvar elem,\n\
\t\t\ti = 0;\n\
\n\
\t\tfor ( ; (elem = this[i]) != null; i++ ) {\n\
\t\t\t// Remove element nodes and prevent memory leaks\n\
\t\t\tif ( elem.nodeType === 1 ) {\n\
\t\t\t\tjQuery.cleanData( getAll( elem, false ) );\n\
\t\t\t}\n\
\n\
\t\t\t// Remove any remaining nodes\n\
\t\t\twhile ( elem.firstChild ) {\n\
\t\t\t\telem.removeChild( elem.firstChild );\n\
\t\t\t}\n\
\n\
\t\t\t// If this is a select, ensure that it displays empty (#12336)\n\
\t\t\t// Support: IE<9\n\
\t\t\tif ( elem.options && jQuery.nodeName( elem, \"select\" ) ) {\n\
\t\t\t\telem.options.length = 0;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn this;\n\
\t},\n\
\n\
\tclone: function( dataAndEvents, deepDataAndEvents ) {\n\
\t\tdataAndEvents = dataAndEvents == null ? false : dataAndEvents;\n\
\t\tdeepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;\n\
\n\
\t\treturn this.map( function () {\n\
\t\t\treturn jQuery.clone( this, dataAndEvents, deepDataAndEvents );\n\
\t\t});\n\
\t},\n\
\n\
\thtml: function( value ) {\n\
\t\treturn jQuery.access( this, function( value ) {\n\
\t\t\tvar elem = this[0] || {},\n\
\t\t\t\ti = 0,\n\
\t\t\t\tl = this.length;\n\
\n\
\t\t\tif ( value === undefined ) {\n\
\t\t\t\treturn elem.nodeType === 1 ?\n\
\t\t\t\t\telem.innerHTML.replace( rinlinejQuery, \"\" ) :\n\
\t\t\t\t\tundefined;\n\
\t\t\t}\n\
\n\
\t\t\t// See if we can take a shortcut and just use innerHTML\n\
\t\t\tif ( typeof value === \"string\" && !rnoInnerhtml.test( value ) &&\n\
\t\t\t\t( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&\n\
\t\t\t\t( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&\n\
\t\t\t\t!wrapMap[ ( rtagName.exec( value ) || [\"\", \"\"] )[1].toLowerCase() ] ) {\n\
\n\
\t\t\t\tvalue = value.replace( rxhtmlTag, \"<$1></$2>\" );\n\
\n\
\t\t\t\ttry {\n\
\t\t\t\t\tfor (; i < l; i++ ) {\n\
\t\t\t\t\t\t// Remove element nodes and prevent memory leaks\n\
\t\t\t\t\t\telem = this[i] || {};\n\
\t\t\t\t\t\tif ( elem.nodeType === 1 ) {\n\
\t\t\t\t\t\t\tjQuery.cleanData( getAll( elem, false ) );\n\
\t\t\t\t\t\t\telem.innerHTML = value;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\telem = 0;\n\
\n\
\t\t\t\t// If using innerHTML throws an exception, use the fallback method\n\
\t\t\t\t} catch(e) {}\n\
\t\t\t}\n\
\n\
\t\t\tif ( elem ) {\n\
\t\t\t\tthis.empty().append( value );\n\
\t\t\t}\n\
\t\t}, null, value, arguments.length );\n\
\t},\n\
\n\
\treplaceWith: function( value ) {\n\
\t\tvar isFunc = jQuery.isFunction( value );\n\
\n\
\t\t// Make sure that the elements are removed from the DOM before they are inserted\n\
\t\t// this can help fix replacing a parent with child elements\n\
\t\tif ( !isFunc && typeof value !== \"string\" ) {\n\
\t\t\tvalue = jQuery( value ).not( this ).detach();\n\
\t\t}\n\
\n\
\t\treturn this.domManip( [ value ], true, function( elem ) {\n\
\t\t\tvar next = this.nextSibling,\n\
\t\t\t\tparent = this.parentNode;\n\
\n\
\t\t\tif ( parent ) {\n\
\t\t\t\tjQuery( this ).remove();\n\
\t\t\t\tparent.insertBefore( elem, next );\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\n\
\tdetach: function( selector ) {\n\
\t\treturn this.remove( selector, true );\n\
\t},\n\
\n\
\tdomManip: function( args, table, callback ) {\n\
\n\
\t\t// Flatten any nested arrays\n\
\t\targs = core_concat.apply( [], args );\n\
\n\
\t\tvar first, node, hasScripts,\n\
\t\t\tscripts, doc, fragment,\n\
\t\t\ti = 0,\n\
\t\t\tl = this.length,\n\
\t\t\tset = this,\n\
\t\t\tiNoClone = l - 1,\n\
\t\t\tvalue = args[0],\n\
\t\t\tisFunction = jQuery.isFunction( value );\n\
\n\
\t\t// We can't cloneNode fragments that contain checked, in WebKit\n\
\t\tif ( isFunction || !( l <= 1 || typeof value !== \"string\" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {\n\
\t\t\treturn this.each(function( index ) {\n\
\t\t\t\tvar self = set.eq( index );\n\
\t\t\t\tif ( isFunction ) {\n\
\t\t\t\t\targs[0] = value.call( this, index, table ? self.html() : undefined );\n\
\t\t\t\t}\n\
\t\t\t\tself.domManip( args, table, callback );\n\
\t\t\t});\n\
\t\t}\n\
\n\
\t\tif ( l ) {\n\
\t\t\tfragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );\n\
\t\t\tfirst = fragment.firstChild;\n\
\n\
\t\t\tif ( fragment.childNodes.length === 1 ) {\n\
\t\t\t\tfragment = first;\n\
\t\t\t}\n\
\n\
\t\t\tif ( first ) {\n\
\t\t\t\ttable = table && jQuery.nodeName( first, \"tr\" );\n\
\t\t\t\tscripts = jQuery.map( getAll( fragment, \"script\" ), disableScript );\n\
\t\t\t\thasScripts = scripts.length;\n\
\n\
\t\t\t\t// Use the original fragment for the last item instead of the first because it can end up\n\
\t\t\t\t// being emptied incorrectly in certain situations (#8070).\n\
\t\t\t\tfor ( ; i < l; i++ ) {\n\
\t\t\t\t\tnode = fragment;\n\
\n\
\t\t\t\t\tif ( i !== iNoClone ) {\n\
\t\t\t\t\t\tnode = jQuery.clone( node, true, true );\n\
\n\
\t\t\t\t\t\t// Keep references to cloned scripts for later restoration\n\
\t\t\t\t\t\tif ( hasScripts ) {\n\
\t\t\t\t\t\t\tjQuery.merge( scripts, getAll( node, \"script\" ) );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\tcallback.call(\n\
\t\t\t\t\t\ttable && jQuery.nodeName( this[i], \"table\" ) ?\n\
\t\t\t\t\t\t\tfindOrAppend( this[i], \"tbody\" ) :\n\
\t\t\t\t\t\t\tthis[i],\n\
\t\t\t\t\t\tnode,\n\
\t\t\t\t\t\ti\n\
\t\t\t\t\t);\n\
\t\t\t\t}\n\
\n\
\t\t\t\tif ( hasScripts ) {\n\
\t\t\t\t\tdoc = scripts[ scripts.length - 1 ].ownerDocument;\n\
\n\
\t\t\t\t\t// Reenable scripts\n\
\t\t\t\t\tjQuery.map( scripts, restoreScript );\n\
\n\
\t\t\t\t\t// Evaluate executable scripts on first document insertion\n\
\t\t\t\t\tfor ( i = 0; i < hasScripts; i++ ) {\n\
\t\t\t\t\t\tnode = scripts[ i ];\n\
\t\t\t\t\t\tif ( rscriptType.test( node.type || \"\" ) &&\n\
\t\t\t\t\t\t\t!jQuery._data( node, \"globalEval\" ) && jQuery.contains( doc, node ) ) {\n\
\n\
\t\t\t\t\t\t\tif ( node.src ) {\n\
\t\t\t\t\t\t\t\t// Hope ajax is available...\n\
\t\t\t\t\t\t\t\tjQuery.ajax({\n\
\t\t\t\t\t\t\t\t\turl: node.src,\n\
\t\t\t\t\t\t\t\t\ttype: \"GET\",\n\
\t\t\t\t\t\t\t\t\tdataType: \"script\",\n\
\t\t\t\t\t\t\t\t\tasync: false,\n\
\t\t\t\t\t\t\t\t\tglobal: false,\n\
\t\t\t\t\t\t\t\t\t\"throws\": true\n\
\t\t\t\t\t\t\t\t});\n\
\t\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\t\tjQuery.globalEval( ( node.text || node.textContent || node.innerHTML || \"\" ).replace( rcleanScript, \"\" ) );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Fix #11809: Avoid leaking memory\n\
\t\t\t\tfragment = first = null;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn this;\n\
\t}\n\
});\n\
\n\
function findOrAppend( elem, tag ) {\n\
\treturn elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );\n\
}\n\
\n\
// Replace/restore the type attribute of script elements for safe DOM manipulation\n\
function disableScript( elem ) {\n\
\tvar attr = elem.getAttributeNode(\"type\");\n\
\telem.type = ( attr && attr.specified ) + \"/\" + elem.type;\n\
\treturn elem;\n\
}\n\
function restoreScript( elem ) {\n\
\tvar match = rscriptTypeMasked.exec( elem.type );\n\
\tif ( match ) {\n\
\t\telem.type = match[1];\n\
\t} else {\n\
\t\telem.removeAttribute(\"type\");\n\
\t}\n\
\treturn elem;\n\
}\n\
\n\
// Mark scripts as having already been evaluated\n\
function setGlobalEval( elems, refElements ) {\n\
\tvar elem,\n\
\t\ti = 0;\n\
\tfor ( ; (elem = elems[i]) != null; i++ ) {\n\
\t\tjQuery._data( elem, \"globalEval\", !refElements || jQuery._data( refElements[i], \"globalEval\" ) );\n\
\t}\n\
}\n\
\n\
function cloneCopyEvent( src, dest ) {\n\
\n\
\tif ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {\n\
\t\treturn;\n\
\t}\n\
\n\
\tvar type, i, l,\n\
\t\toldData = jQuery._data( src ),\n\
\t\tcurData = jQuery._data( dest, oldData ),\n\
\t\tevents = oldData.events;\n\
\n\
\tif ( events ) {\n\
\t\tdelete curData.handle;\n\
\t\tcurData.events = {};\n\
\n\
\t\tfor ( type in events ) {\n\
\t\t\tfor ( i = 0, l = events[ type ].length; i < l; i++ ) {\n\
\t\t\t\tjQuery.event.add( dest, type, events[ type ][ i ] );\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\t// make the cloned public data object a copy from the original\n\
\tif ( curData.data ) {\n\
\t\tcurData.data = jQuery.extend( {}, curData.data );\n\
\t}\n\
}\n\
\n\
function fixCloneNodeIssues( src, dest ) {\n\
\tvar nodeName, e, data;\n\
\n\
\t// We do not need to do anything for non-Elements\n\
\tif ( dest.nodeType !== 1 ) {\n\
\t\treturn;\n\
\t}\n\
\n\
\tnodeName = dest.nodeName.toLowerCase();\n\
\n\
\t// IE6-8 copies events bound via attachEvent when using cloneNode.\n\
\tif ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {\n\
\t\tdata = jQuery._data( dest );\n\
\n\
\t\tfor ( e in data.events ) {\n\
\t\t\tjQuery.removeEvent( dest, e, data.handle );\n\
\t\t}\n\
\n\
\t\t// Event data gets referenced instead of copied if the expando gets copied too\n\
\t\tdest.removeAttribute( jQuery.expando );\n\
\t}\n\
\n\
\t// IE blanks contents when cloning scripts, and tries to evaluate newly-set text\n\
\tif ( nodeName === \"script\" && dest.text !== src.text ) {\n\
\t\tdisableScript( dest ).text = src.text;\n\
\t\trestoreScript( dest );\n\
\n\
\t// IE6-10 improperly clones children of object elements using classid.\n\
\t// IE10 throws NoModificationAllowedError if parent is null, #12132.\n\
\t} else if ( nodeName === \"object\" ) {\n\
\t\tif ( dest.parentNode ) {\n\
\t\t\tdest.outerHTML = src.outerHTML;\n\
\t\t}\n\
\n\
\t\t// This path appears unavoidable for IE9. When cloning an object\n\
\t\t// element in IE9, the outerHTML strategy above is not sufficient.\n\
\t\t// If the src has innerHTML and the destination does not,\n\
\t\t// copy the src.innerHTML into the dest.innerHTML. #10324\n\
\t\tif ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {\n\
\t\t\tdest.innerHTML = src.innerHTML;\n\
\t\t}\n\
\n\
\t} else if ( nodeName === \"input\" && manipulation_rcheckableType.test( src.type ) ) {\n\
\t\t// IE6-8 fails to persist the checked state of a cloned checkbox\n\
\t\t// or radio button. Worse, IE6-7 fail to give the cloned element\n\
\t\t// a checked appearance if the defaultChecked value isn't also set\n\
\n\
\t\tdest.defaultChecked = dest.checked = src.checked;\n\
\n\
\t\t// IE6-7 get confused and end up setting the value of a cloned\n\
\t\t// checkbox/radio button to an empty string instead of \"on\"\n\
\t\tif ( dest.value !== src.value ) {\n\
\t\t\tdest.value = src.value;\n\
\t\t}\n\
\n\
\t// IE6-8 fails to return the selected option to the default selected\n\
\t// state when cloning options\n\
\t} else if ( nodeName === \"option\" ) {\n\
\t\tdest.defaultSelected = dest.selected = src.defaultSelected;\n\
\n\
\t// IE6-8 fails to set the defaultValue to the correct value when\n\
\t// cloning other types of input fields\n\
\t} else if ( nodeName === \"input\" || nodeName === \"textarea\" ) {\n\
\t\tdest.defaultValue = src.defaultValue;\n\
\t}\n\
}\n\
\n\
jQuery.each({\n\
\tappendTo: \"append\",\n\
\tprependTo: \"prepend\",\n\
\tinsertBefore: \"before\",\n\
\tinsertAfter: \"after\",\n\
\treplaceAll: \"replaceWith\"\n\
}, function( name, original ) {\n\
\tjQuery.fn[ name ] = function( selector ) {\n\
\t\tvar elems,\n\
\t\t\ti = 0,\n\
\t\t\tret = [],\n\
\t\t\tinsert = jQuery( selector ),\n\
\t\t\tlast = insert.length - 1;\n\
\n\
\t\tfor ( ; i <= last; i++ ) {\n\
\t\t\telems = i === last ? this : this.clone(true);\n\
\t\t\tjQuery( insert[i] )[ original ]( elems );\n\
\n\
\t\t\t// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()\n\
\t\t\tcore_push.apply( ret, elems.get() );\n\
\t\t}\n\
\n\
\t\treturn this.pushStack( ret );\n\
\t};\n\
});\n\
\n\
function getAll( context, tag ) {\n\
\tvar elems, elem,\n\
\t\ti = 0,\n\
\t\tfound = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || \"*\" ) :\n\
\t\t\ttypeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || \"*\" ) :\n\
\t\t\tundefined;\n\
\n\
\tif ( !found ) {\n\
\t\tfor ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {\n\
\t\t\tif ( !tag || jQuery.nodeName( elem, tag ) ) {\n\
\t\t\t\tfound.push( elem );\n\
\t\t\t} else {\n\
\t\t\t\tjQuery.merge( found, getAll( elem, tag ) );\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\treturn tag === undefined || tag && jQuery.nodeName( context, tag ) ?\n\
\t\tjQuery.merge( [ context ], found ) :\n\
\t\tfound;\n\
}\n\
\n\
// Used in buildFragment, fixes the defaultChecked property\n\
function fixDefaultChecked( elem ) {\n\
\tif ( manipulation_rcheckableType.test( elem.type ) ) {\n\
\t\telem.defaultChecked = elem.checked;\n\
\t}\n\
}\n\
\n\
jQuery.extend({\n\
\tclone: function( elem, dataAndEvents, deepDataAndEvents ) {\n\
\t\tvar destElements, node, clone, i, srcElements,\n\
\t\t\tinPage = jQuery.contains( elem.ownerDocument, elem );\n\
\n\
\t\tif ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( \"<\" + elem.nodeName + \">\" ) ) {\n\
\t\t\tclone = elem.cloneNode( true );\n\
\n\
\t\t// IE<=8 does not properly clone detached, unknown element nodes\n\
\t\t} else {\n\
\t\t\tfragmentDiv.innerHTML = elem.outerHTML;\n\
\t\t\tfragmentDiv.removeChild( clone = fragmentDiv.firstChild );\n\
\t\t}\n\
\n\
\t\tif ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&\n\
\t\t\t\t(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {\n\
\n\
\t\t\t// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2\n\
\t\t\tdestElements = getAll( clone );\n\
\t\t\tsrcElements = getAll( elem );\n\
\n\
\t\t\t// Fix all IE cloning issues\n\
\t\t\tfor ( i = 0; (node = srcElements[i]) != null; ++i ) {\n\
\t\t\t\t// Ensure that the destination node is not null; Fixes #9587\n\
\t\t\t\tif ( destElements[i] ) {\n\
\t\t\t\t\tfixCloneNodeIssues( node, destElements[i] );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Copy the events from the original to the clone\n\
\t\tif ( dataAndEvents ) {\n\
\t\t\tif ( deepDataAndEvents ) {\n\
\t\t\t\tsrcElements = srcElements || getAll( elem );\n\
\t\t\t\tdestElements = destElements || getAll( clone );\n\
\n\
\t\t\t\tfor ( i = 0; (node = srcElements[i]) != null; i++ ) {\n\
\t\t\t\t\tcloneCopyEvent( node, destElements[i] );\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\tcloneCopyEvent( elem, clone );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Preserve script evaluation history\n\
\t\tdestElements = getAll( clone, \"script\" );\n\
\t\tif ( destElements.length > 0 ) {\n\
\t\t\tsetGlobalEval( destElements, !inPage && getAll( elem, \"script\" ) );\n\
\t\t}\n\
\n\
\t\tdestElements = srcElements = node = null;\n\
\n\
\t\t// Return the cloned set\n\
\t\treturn clone;\n\
\t},\n\
\n\
\tbuildFragment: function( elems, context, scripts, selection ) {\n\
\t\tvar j, elem, contains,\n\
\t\t\ttmp, tag, tbody, wrap,\n\
\t\t\tl = elems.length,\n\
\n\
\t\t\t// Ensure a safe fragment\n\
\t\t\tsafe = createSafeFragment( context ),\n\
\n\
\t\t\tnodes = [],\n\
\t\t\ti = 0;\n\
\n\
\t\tfor ( ; i < l; i++ ) {\n\
\t\t\telem = elems[ i ];\n\
\n\
\t\t\tif ( elem || elem === 0 ) {\n\
\n\
\t\t\t\t// Add nodes directly\n\
\t\t\t\tif ( jQuery.type( elem ) === \"object\" ) {\n\
\t\t\t\t\tjQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );\n\
\n\
\t\t\t\t// Convert non-html into a text node\n\
\t\t\t\t} else if ( !rhtml.test( elem ) ) {\n\
\t\t\t\t\tnodes.push( context.createTextNode( elem ) );\n\
\n\
\t\t\t\t// Convert html into DOM nodes\n\
\t\t\t\t} else {\n\
\t\t\t\t\ttmp = tmp || safe.appendChild( context.createElement(\"div\") );\n\
\n\
\t\t\t\t\t// Deserialize a standard representation\n\
\t\t\t\t\ttag = ( rtagName.exec( elem ) || [\"\", \"\"] )[1].toLowerCase();\n\
\t\t\t\t\twrap = wrapMap[ tag ] || wrapMap._default;\n\
\n\
\t\t\t\t\ttmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, \"<$1></$2>\" ) + wrap[2];\n\
\n\
\t\t\t\t\t// Descend through wrappers to the right content\n\
\t\t\t\t\tj = wrap[0];\n\
\t\t\t\t\twhile ( j-- ) {\n\
\t\t\t\t\t\ttmp = tmp.lastChild;\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Manually add leading whitespace removed by IE\n\
\t\t\t\t\tif ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {\n\
\t\t\t\t\t\tnodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Remove IE's autoinserted <tbody> from table fragments\n\
\t\t\t\t\tif ( !jQuery.support.tbody ) {\n\
\n\
\t\t\t\t\t\t// String was a <table>, *may* have spurious <tbody>\n\
\t\t\t\t\t\telem = tag === \"table\" && !rtbody.test( elem ) ?\n\
\t\t\t\t\t\t\ttmp.firstChild :\n\
\n\
\t\t\t\t\t\t\t// String was a bare <thead> or <tfoot>\n\
\t\t\t\t\t\t\twrap[1] === \"<table>\" && !rtbody.test( elem ) ?\n\
\t\t\t\t\t\t\t\ttmp :\n\
\t\t\t\t\t\t\t\t0;\n\
\n\
\t\t\t\t\t\tj = elem && elem.childNodes.length;\n\
\t\t\t\t\t\twhile ( j-- ) {\n\
\t\t\t\t\t\t\tif ( jQuery.nodeName( (tbody = elem.childNodes[j]), \"tbody\" ) && !tbody.childNodes.length ) {\n\
\t\t\t\t\t\t\t\telem.removeChild( tbody );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\tjQuery.merge( nodes, tmp.childNodes );\n\
\n\
\t\t\t\t\t// Fix #12392 for WebKit and IE > 9\n\
\t\t\t\t\ttmp.textContent = \"\";\n\
\n\
\t\t\t\t\t// Fix #12392 for oldIE\n\
\t\t\t\t\twhile ( tmp.firstChild ) {\n\
\t\t\t\t\t\ttmp.removeChild( tmp.firstChild );\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Remember the top-level container for proper cleanup\n\
\t\t\t\t\ttmp = safe.lastChild;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Fix #11356: Clear elements from fragment\n\
\t\tif ( tmp ) {\n\
\t\t\tsafe.removeChild( tmp );\n\
\t\t}\n\
\n\
\t\t// Reset defaultChecked for any radios and checkboxes\n\
\t\t// about to be appended to the DOM in IE 6/7 (#8060)\n\
\t\tif ( !jQuery.support.appendChecked ) {\n\
\t\t\tjQuery.grep( getAll( nodes, \"input\" ), fixDefaultChecked );\n\
\t\t}\n\
\n\
\t\ti = 0;\n\
\t\twhile ( (elem = nodes[ i++ ]) ) {\n\
\n\
\t\t\t// #4087 - If origin and destination elements are the same, and this is\n\
\t\t\t// that element, do not do anything\n\
\t\t\tif ( selection && jQuery.inArray( elem, selection ) !== -1 ) {\n\
\t\t\t\tcontinue;\n\
\t\t\t}\n\
\n\
\t\t\tcontains = jQuery.contains( elem.ownerDocument, elem );\n\
\n\
\t\t\t// Append to fragment\n\
\t\t\ttmp = getAll( safe.appendChild( elem ), \"script\" );\n\
\n\
\t\t\t// Preserve script evaluation history\n\
\t\t\tif ( contains ) {\n\
\t\t\t\tsetGlobalEval( tmp );\n\
\t\t\t}\n\
\n\
\t\t\t// Capture executables\n\
\t\t\tif ( scripts ) {\n\
\t\t\t\tj = 0;\n\
\t\t\t\twhile ( (elem = tmp[ j++ ]) ) {\n\
\t\t\t\t\tif ( rscriptType.test( elem.type || \"\" ) ) {\n\
\t\t\t\t\t\tscripts.push( elem );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\ttmp = null;\n\
\n\
\t\treturn safe;\n\
\t},\n\
\n\
\tcleanData: function( elems, /* internal */ acceptData ) {\n\
\t\tvar elem, type, id, data,\n\
\t\t\ti = 0,\n\
\t\t\tinternalKey = jQuery.expando,\n\
\t\t\tcache = jQuery.cache,\n\
\t\t\tdeleteExpando = jQuery.support.deleteExpando,\n\
\t\t\tspecial = jQuery.event.special;\n\
\n\
\t\tfor ( ; (elem = elems[i]) != null; i++ ) {\n\
\n\
\t\t\tif ( acceptData || jQuery.acceptData( elem ) ) {\n\
\n\
\t\t\t\tid = elem[ internalKey ];\n\
\t\t\t\tdata = id && cache[ id ];\n\
\n\
\t\t\t\tif ( data ) {\n\
\t\t\t\t\tif ( data.events ) {\n\
\t\t\t\t\t\tfor ( type in data.events ) {\n\
\t\t\t\t\t\t\tif ( special[ type ] ) {\n\
\t\t\t\t\t\t\t\tjQuery.event.remove( elem, type );\n\
\n\
\t\t\t\t\t\t\t// This is a shortcut to avoid jQuery.event.remove's overhead\n\
\t\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\t\tjQuery.removeEvent( elem, type, data.handle );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Remove cache only if it was not already removed by jQuery.event.remove\n\
\t\t\t\t\tif ( cache[ id ] ) {\n\
\n\
\t\t\t\t\t\tdelete cache[ id ];\n\
\n\
\t\t\t\t\t\t// IE does not allow us to delete expando properties from nodes,\n\
\t\t\t\t\t\t// nor does it have a removeAttribute function on Document nodes;\n\
\t\t\t\t\t\t// we must handle all of these cases\n\
\t\t\t\t\t\tif ( deleteExpando ) {\n\
\t\t\t\t\t\t\tdelete elem[ internalKey ];\n\
\n\
\t\t\t\t\t\t} else if ( typeof elem.removeAttribute !== core_strundefined ) {\n\
\t\t\t\t\t\t\telem.removeAttribute( internalKey );\n\
\n\
\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\telem[ internalKey ] = null;\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\tcore_deletedIds.push( id );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
});\n\
var iframe, getStyles, curCSS,\n\
\tralpha = /alpha\\([^)]*\\)/i,\n\
\tropacity = /opacity\\s*=\\s*([^)]*)/,\n\
\trposition = /^(top|right|bottom|left)$/,\n\
\t// swappable if display is none or starts with table except \"table\", \"table-cell\", or \"table-caption\"\n\
\t// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display\n\
\trdisplayswap = /^(none|table(?!-c[ea]).+)/,\n\
\trmargin = /^margin/,\n\
\trnumsplit = new RegExp( \"^(\" + core_pnum + \")(.*)$\", \"i\" ),\n\
\trnumnonpx = new RegExp( \"^(\" + core_pnum + \")(?!px)[a-z%]+$\", \"i\" ),\n\
\trrelNum = new RegExp( \"^([+-])=(\" + core_pnum + \")\", \"i\" ),\n\
\telemdisplay = { BODY: \"block\" },\n\
\n\
\tcssShow = { position: \"absolute\", visibility: \"hidden\", display: \"block\" },\n\
\tcssNormalTransform = {\n\
\t\tletterSpacing: 0,\n\
\t\tfontWeight: 400\n\
\t},\n\
\n\
\tcssExpand = [ \"Top\", \"Right\", \"Bottom\", \"Left\" ],\n\
\tcssPrefixes = [ \"Webkit\", \"O\", \"Moz\", \"ms\" ];\n\
\n\
// return a css property mapped to a potentially vendor prefixed property\n\
function vendorPropName( style, name ) {\n\
\n\
\t// shortcut for names that are not vendor prefixed\n\
\tif ( name in style ) {\n\
\t\treturn name;\n\
\t}\n\
\n\
\t// check for vendor prefixed names\n\
\tvar capName = name.charAt(0).toUpperCase() + name.slice(1),\n\
\t\torigName = name,\n\
\t\ti = cssPrefixes.length;\n\
\n\
\twhile ( i-- ) {\n\
\t\tname = cssPrefixes[ i ] + capName;\n\
\t\tif ( name in style ) {\n\
\t\t\treturn name;\n\
\t\t}\n\
\t}\n\
\n\
\treturn origName;\n\
}\n\
\n\
function isHidden( elem, el ) {\n\
\t// isHidden might be called from jQuery#filter function;\n\
\t// in that case, element will be second argument\n\
\telem = el || elem;\n\
\treturn jQuery.css( elem, \"display\" ) === \"none\" || !jQuery.contains( elem.ownerDocument, elem );\n\
}\n\
\n\
function showHide( elements, show ) {\n\
\tvar display, elem, hidden,\n\
\t\tvalues = [],\n\
\t\tindex = 0,\n\
\t\tlength = elements.length;\n\
\n\
\tfor ( ; index < length; index++ ) {\n\
\t\telem = elements[ index ];\n\
\t\tif ( !elem.style ) {\n\
\t\t\tcontinue;\n\
\t\t}\n\
\n\
\t\tvalues[ index ] = jQuery._data( elem, \"olddisplay\" );\n\
\t\tdisplay = elem.style.display;\n\
\t\tif ( show ) {\n\
\t\t\t// Reset the inline display of this element to learn if it is\n\
\t\t\t// being hidden by cascaded rules or not\n\
\t\t\tif ( !values[ index ] && display === \"none\" ) {\n\
\t\t\t\telem.style.display = \"\";\n\
\t\t\t}\n\
\n\
\t\t\t// Set elements which have been overridden with display: none\n\
\t\t\t// in a stylesheet to whatever the default browser style is\n\
\t\t\t// for such an element\n\
\t\t\tif ( elem.style.display === \"\" && isHidden( elem ) ) {\n\
\t\t\t\tvalues[ index ] = jQuery._data( elem, \"olddisplay\", css_defaultDisplay(elem.nodeName) );\n\
\t\t\t}\n\
\t\t} else {\n\
\n\
\t\t\tif ( !values[ index ] ) {\n\
\t\t\t\thidden = isHidden( elem );\n\
\n\
\t\t\t\tif ( display && display !== \"none\" || !hidden ) {\n\
\t\t\t\t\tjQuery._data( elem, \"olddisplay\", hidden ? display : jQuery.css( elem, \"display\" ) );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\t// Set the display of most of the elements in a second loop\n\
\t// to avoid the constant reflow\n\
\tfor ( index = 0; index < length; index++ ) {\n\
\t\telem = elements[ index ];\n\
\t\tif ( !elem.style ) {\n\
\t\t\tcontinue;\n\
\t\t}\n\
\t\tif ( !show || elem.style.display === \"none\" || elem.style.display === \"\" ) {\n\
\t\t\telem.style.display = show ? values[ index ] || \"\" : \"none\";\n\
\t\t}\n\
\t}\n\
\n\
\treturn elements;\n\
}\n\
\n\
jQuery.fn.extend({\n\
\tcss: function( name, value ) {\n\
\t\treturn jQuery.access( this, function( elem, name, value ) {\n\
\t\t\tvar len, styles,\n\
\t\t\t\tmap = {},\n\
\t\t\t\ti = 0;\n\
\n\
\t\t\tif ( jQuery.isArray( name ) ) {\n\
\t\t\t\tstyles = getStyles( elem );\n\
\t\t\t\tlen = name.length;\n\
\n\
\t\t\t\tfor ( ; i < len; i++ ) {\n\
\t\t\t\t\tmap[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );\n\
\t\t\t\t}\n\
\n\
\t\t\t\treturn map;\n\
\t\t\t}\n\
\n\
\t\t\treturn value !== undefined ?\n\
\t\t\t\tjQuery.style( elem, name, value ) :\n\
\t\t\t\tjQuery.css( elem, name );\n\
\t\t}, name, value, arguments.length > 1 );\n\
\t},\n\
\tshow: function() {\n\
\t\treturn showHide( this, true );\n\
\t},\n\
\thide: function() {\n\
\t\treturn showHide( this );\n\
\t},\n\
\ttoggle: function( state ) {\n\
\t\tvar bool = typeof state === \"boolean\";\n\
\n\
\t\treturn this.each(function() {\n\
\t\t\tif ( bool ? state : isHidden( this ) ) {\n\
\t\t\t\tjQuery( this ).show();\n\
\t\t\t} else {\n\
\t\t\t\tjQuery( this ).hide();\n\
\t\t\t}\n\
\t\t});\n\
\t}\n\
});\n\
\n\
jQuery.extend({\n\
\t// Add in style property hooks for overriding the default\n\
\t// behavior of getting and setting a style property\n\
\tcssHooks: {\n\
\t\topacity: {\n\
\t\t\tget: function( elem, computed ) {\n\
\t\t\t\tif ( computed ) {\n\
\t\t\t\t\t// We should always get a number back from opacity\n\
\t\t\t\t\tvar ret = curCSS( elem, \"opacity\" );\n\
\t\t\t\t\treturn ret === \"\" ? \"1\" : ret;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t},\n\
\n\
\t// Exclude the following css properties to add px\n\
\tcssNumber: {\n\
\t\t\"columnCount\": true,\n\
\t\t\"fillOpacity\": true,\n\
\t\t\"fontWeight\": true,\n\
\t\t\"lineHeight\": true,\n\
\t\t\"opacity\": true,\n\
\t\t\"orphans\": true,\n\
\t\t\"widows\": true,\n\
\t\t\"zIndex\": true,\n\
\t\t\"zoom\": true\n\
\t},\n\
\n\
\t// Add in properties whose names you wish to fix before\n\
\t// setting or getting the value\n\
\tcssProps: {\n\
\t\t// normalize float css property\n\
\t\t\"float\": jQuery.support.cssFloat ? \"cssFloat\" : \"styleFloat\"\n\
\t},\n\
\n\
\t// Get and set the style property on a DOM Node\n\
\tstyle: function( elem, name, value, extra ) {\n\
\t\t// Don't set styles on text and comment nodes\n\
\t\tif ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\t// Make sure that we're working with the right name\n\
\t\tvar ret, type, hooks,\n\
\t\t\torigName = jQuery.camelCase( name ),\n\
\t\t\tstyle = elem.style;\n\
\n\
\t\tname = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );\n\
\n\
\t\t// gets hook for the prefixed version\n\
\t\t// followed by the unprefixed version\n\
\t\thooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];\n\
\n\
\t\t// Check if we're setting a value\n\
\t\tif ( value !== undefined ) {\n\
\t\t\ttype = typeof value;\n\
\n\
\t\t\t// convert relative number strings (+= or -=) to relative numbers. #7345\n\
\t\t\tif ( type === \"string\" && (ret = rrelNum.exec( value )) ) {\n\
\t\t\t\tvalue = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );\n\
\t\t\t\t// Fixes bug #9237\n\
\t\t\t\ttype = \"number\";\n\
\t\t\t}\n\
\n\
\t\t\t// Make sure that NaN and null values aren't set. See: #7116\n\
\t\t\tif ( value == null || type === \"number\" && isNaN( value ) ) {\n\
\t\t\t\treturn;\n\
\t\t\t}\n\
\n\
\t\t\t// If a number was passed in, add 'px' to the (except for certain CSS properties)\n\
\t\t\tif ( type === \"number\" && !jQuery.cssNumber[ origName ] ) {\n\
\t\t\t\tvalue += \"px\";\n\
\t\t\t}\n\
\n\
\t\t\t// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,\n\
\t\t\t// but it would mean to define eight (for every problematic property) identical functions\n\
\t\t\tif ( !jQuery.support.clearCloneStyle && value === \"\" && name.indexOf(\"background\") === 0 ) {\n\
\t\t\t\tstyle[ name ] = \"inherit\";\n\
\t\t\t}\n\
\n\
\t\t\t// If a hook was provided, use that value, otherwise just set the specified value\n\
\t\t\tif ( !hooks || !(\"set\" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {\n\
\n\
\t\t\t\t// Wrapped to prevent IE from throwing errors when 'invalid' values are provided\n\
\t\t\t\t// Fixes bug #5509\n\
\t\t\t\ttry {\n\
\t\t\t\t\tstyle[ name ] = value;\n\
\t\t\t\t} catch(e) {}\n\
\t\t\t}\n\
\n\
\t\t} else {\n\
\t\t\t// If a hook was provided get the non-computed value from there\n\
\t\t\tif ( hooks && \"get\" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {\n\
\t\t\t\treturn ret;\n\
\t\t\t}\n\
\n\
\t\t\t// Otherwise just get the value from the style object\n\
\t\t\treturn style[ name ];\n\
\t\t}\n\
\t},\n\
\n\
\tcss: function( elem, name, extra, styles ) {\n\
\t\tvar num, val, hooks,\n\
\t\t\torigName = jQuery.camelCase( name );\n\
\n\
\t\t// Make sure that we're working with the right name\n\
\t\tname = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );\n\
\n\
\t\t// gets hook for the prefixed version\n\
\t\t// followed by the unprefixed version\n\
\t\thooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];\n\
\n\
\t\t// If a hook was provided get the computed value from there\n\
\t\tif ( hooks && \"get\" in hooks ) {\n\
\t\t\tval = hooks.get( elem, true, extra );\n\
\t\t}\n\
\n\
\t\t// Otherwise, if a way to get the computed value exists, use that\n\
\t\tif ( val === undefined ) {\n\
\t\t\tval = curCSS( elem, name, styles );\n\
\t\t}\n\
\n\
\t\t//convert \"normal\" to computed value\n\
\t\tif ( val === \"normal\" && name in cssNormalTransform ) {\n\
\t\t\tval = cssNormalTransform[ name ];\n\
\t\t}\n\
\n\
\t\t// Return, converting to number if forced or a qualifier was provided and val looks numeric\n\
\t\tif ( extra === \"\" || extra ) {\n\
\t\t\tnum = parseFloat( val );\n\
\t\t\treturn extra === true || jQuery.isNumeric( num ) ? num || 0 : val;\n\
\t\t}\n\
\t\treturn val;\n\
\t},\n\
\n\
\t// A method for quickly swapping in/out CSS properties to get correct calculations\n\
\tswap: function( elem, options, callback, args ) {\n\
\t\tvar ret, name,\n\
\t\t\told = {};\n\
\n\
\t\t// Remember the old values, and insert the new ones\n\
\t\tfor ( name in options ) {\n\
\t\t\told[ name ] = elem.style[ name ];\n\
\t\t\telem.style[ name ] = options[ name ];\n\
\t\t}\n\
\n\
\t\tret = callback.apply( elem, args || [] );\n\
\n\
\t\t// Revert the old values\n\
\t\tfor ( name in options ) {\n\
\t\t\telem.style[ name ] = old[ name ];\n\
\t\t}\n\
\n\
\t\treturn ret;\n\
\t}\n\
});\n\
\n\
// NOTE: we've included the \"window\" in window.getComputedStyle\n\
// because jsdom on node.js will break without it.\n\
if ( window.getComputedStyle ) {\n\
\tgetStyles = function( elem ) {\n\
\t\treturn window.getComputedStyle( elem, null );\n\
\t};\n\
\n\
\tcurCSS = function( elem, name, _computed ) {\n\
\t\tvar width, minWidth, maxWidth,\n\
\t\t\tcomputed = _computed || getStyles( elem ),\n\
\n\
\t\t\t// getPropertyValue is only needed for .css('filter') in IE9, see #12537\n\
\t\t\tret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,\n\
\t\t\tstyle = elem.style;\n\
\n\
\t\tif ( computed ) {\n\
\n\
\t\t\tif ( ret === \"\" && !jQuery.contains( elem.ownerDocument, elem ) ) {\n\
\t\t\t\tret = jQuery.style( elem, name );\n\
\t\t\t}\n\
\n\
\t\t\t// A tribute to the \"awesome hack by Dean Edwards\"\n\
\t\t\t// Chrome < 17 and Safari 5.0 uses \"computed value\" instead of \"used value\" for margin-right\n\
\t\t\t// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels\n\
\t\t\t// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values\n\
\t\t\tif ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {\n\
\n\
\t\t\t\t// Remember the original values\n\
\t\t\t\twidth = style.width;\n\
\t\t\t\tminWidth = style.minWidth;\n\
\t\t\t\tmaxWidth = style.maxWidth;\n\
\n\
\t\t\t\t// Put in the new values to get a computed value out\n\
\t\t\t\tstyle.minWidth = style.maxWidth = style.width = ret;\n\
\t\t\t\tret = computed.width;\n\
\n\
\t\t\t\t// Revert the changed values\n\
\t\t\t\tstyle.width = width;\n\
\t\t\t\tstyle.minWidth = minWidth;\n\
\t\t\t\tstyle.maxWidth = maxWidth;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn ret;\n\
\t};\n\
} else if ( document.documentElement.currentStyle ) {\n\
\tgetStyles = function( elem ) {\n\
\t\treturn elem.currentStyle;\n\
\t};\n\
\n\
\tcurCSS = function( elem, name, _computed ) {\n\
\t\tvar left, rs, rsLeft,\n\
\t\t\tcomputed = _computed || getStyles( elem ),\n\
\t\t\tret = computed ? computed[ name ] : undefined,\n\
\t\t\tstyle = elem.style;\n\
\n\
\t\t// Avoid setting ret to empty string here\n\
\t\t// so we don't default to auto\n\
\t\tif ( ret == null && style && style[ name ] ) {\n\
\t\t\tret = style[ name ];\n\
\t\t}\n\
\n\
\t\t// From the awesome hack by Dean Edwards\n\
\t\t// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291\n\
\n\
\t\t// If we're not dealing with a regular pixel number\n\
\t\t// but a number that has a weird ending, we need to convert it to pixels\n\
\t\t// but not position css attributes, as those are proportional to the parent element instead\n\
\t\t// and we can't measure the parent instead because it might trigger a \"stacking dolls\" problem\n\
\t\tif ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {\n\
\n\
\t\t\t// Remember the original values\n\
\t\t\tleft = style.left;\n\
\t\t\trs = elem.runtimeStyle;\n\
\t\t\trsLeft = rs && rs.left;\n\
\n\
\t\t\t// Put in the new values to get a computed value out\n\
\t\t\tif ( rsLeft ) {\n\
\t\t\t\trs.left = elem.currentStyle.left;\n\
\t\t\t}\n\
\t\t\tstyle.left = name === \"fontSize\" ? \"1em\" : ret;\n\
\t\t\tret = style.pixelLeft + \"px\";\n\
\n\
\t\t\t// Revert the changed values\n\
\t\t\tstyle.left = left;\n\
\t\t\tif ( rsLeft ) {\n\
\t\t\t\trs.left = rsLeft;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn ret === \"\" ? \"auto\" : ret;\n\
\t};\n\
}\n\
\n\
function setPositiveNumber( elem, value, subtract ) {\n\
\tvar matches = rnumsplit.exec( value );\n\
\treturn matches ?\n\
\t\t// Guard against undefined \"subtract\", e.g., when used as in cssHooks\n\
\t\tMath.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || \"px\" ) :\n\
\t\tvalue;\n\
}\n\
\n\
function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {\n\
\tvar i = extra === ( isBorderBox ? \"border\" : \"content\" ) ?\n\
\t\t// If we already have the right measurement, avoid augmentation\n\
\t\t4 :\n\
\t\t// Otherwise initialize for horizontal or vertical properties\n\
\t\tname === \"width\" ? 1 : 0,\n\
\n\
\t\tval = 0;\n\
\n\
\tfor ( ; i < 4; i += 2 ) {\n\
\t\t// both box models exclude margin, so add it if we want it\n\
\t\tif ( extra === \"margin\" ) {\n\
\t\t\tval += jQuery.css( elem, extra + cssExpand[ i ], true, styles );\n\
\t\t}\n\
\n\
\t\tif ( isBorderBox ) {\n\
\t\t\t// border-box includes padding, so remove it if we want content\n\
\t\t\tif ( extra === \"content\" ) {\n\
\t\t\t\tval -= jQuery.css( elem, \"padding\" + cssExpand[ i ], true, styles );\n\
\t\t\t}\n\
\n\
\t\t\t// at this point, extra isn't border nor margin, so remove border\n\
\t\t\tif ( extra !== \"margin\" ) {\n\
\t\t\t\tval -= jQuery.css( elem, \"border\" + cssExpand[ i ] + \"Width\", true, styles );\n\
\t\t\t}\n\
\t\t} else {\n\
\t\t\t// at this point, extra isn't content, so add padding\n\
\t\t\tval += jQuery.css( elem, \"padding\" + cssExpand[ i ], true, styles );\n\
\n\
\t\t\t// at this point, extra isn't content nor padding, so add border\n\
\t\t\tif ( extra !== \"padding\" ) {\n\
\t\t\t\tval += jQuery.css( elem, \"border\" + cssExpand[ i ] + \"Width\", true, styles );\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\treturn val;\n\
}\n\
\n\
function getWidthOrHeight( elem, name, extra ) {\n\
\n\
\t// Start with offset property, which is equivalent to the border-box value\n\
\tvar valueIsBorderBox = true,\n\
\t\tval = name === \"width\" ? elem.offsetWidth : elem.offsetHeight,\n\
\t\tstyles = getStyles( elem ),\n\
\t\tisBorderBox = jQuery.support.boxSizing && jQuery.css( elem, \"boxSizing\", false, styles ) === \"border-box\";\n\
\n\
\t// some non-html elements return undefined for offsetWidth, so check for null/undefined\n\
\t// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285\n\
\t// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668\n\
\tif ( val <= 0 || val == null ) {\n\
\t\t// Fall back to computed then uncomputed css if necessary\n\
\t\tval = curCSS( elem, name, styles );\n\
\t\tif ( val < 0 || val == null ) {\n\
\t\t\tval = elem.style[ name ];\n\
\t\t}\n\
\n\
\t\t// Computed unit is not pixels. Stop here and return.\n\
\t\tif ( rnumnonpx.test(val) ) {\n\
\t\t\treturn val;\n\
\t\t}\n\
\n\
\t\t// we need the check for style in case a browser which returns unreliable values\n\
\t\t// for getComputedStyle silently falls back to the reliable elem.style\n\
\t\tvalueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );\n\
\n\
\t\t// Normalize \"\", auto, and prepare for extra\n\
\t\tval = parseFloat( val ) || 0;\n\
\t}\n\
\n\
\t// use the active box-sizing model to add/subtract irrelevant styles\n\
\treturn ( val +\n\
\t\taugmentWidthOrHeight(\n\
\t\t\telem,\n\
\t\t\tname,\n\
\t\t\textra || ( isBorderBox ? \"border\" : \"content\" ),\n\
\t\t\tvalueIsBorderBox,\n\
\t\t\tstyles\n\
\t\t)\n\
\t) + \"px\";\n\
}\n\
\n\
// Try to determine the default display value of an element\n\
function css_defaultDisplay( nodeName ) {\n\
\tvar doc = document,\n\
\t\tdisplay = elemdisplay[ nodeName ];\n\
\n\
\tif ( !display ) {\n\
\t\tdisplay = actualDisplay( nodeName, doc );\n\
\n\
\t\t// If the simple way fails, read from inside an iframe\n\
\t\tif ( display === \"none\" || !display ) {\n\
\t\t\t// Use the already-created iframe if possible\n\
\t\t\tiframe = ( iframe ||\n\
\t\t\t\tjQuery(\"<iframe frameborder='0' width='0' height='0'/>\")\n\
\t\t\t\t.css( \"cssText\", \"display:block !important\" )\n\
\t\t\t).appendTo( doc.documentElement );\n\
\n\
\t\t\t// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse\n\
\t\t\tdoc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;\n\
\t\t\tdoc.write(\"<!doctype html><html><body>\");\n\
\t\t\tdoc.close();\n\
\n\
\t\t\tdisplay = actualDisplay( nodeName, doc );\n\
\t\t\tiframe.detach();\n\
\t\t}\n\
\n\
\t\t// Store the correct default display\n\
\t\telemdisplay[ nodeName ] = display;\n\
\t}\n\
\n\
\treturn display;\n\
}\n\
\n\
// Called ONLY from within css_defaultDisplay\n\
function actualDisplay( name, doc ) {\n\
\tvar elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),\n\
\t\tdisplay = jQuery.css( elem[0], \"display\" );\n\
\telem.remove();\n\
\treturn display;\n\
}\n\
\n\
jQuery.each([ \"height\", \"width\" ], function( i, name ) {\n\
\tjQuery.cssHooks[ name ] = {\n\
\t\tget: function( elem, computed, extra ) {\n\
\t\t\tif ( computed ) {\n\
\t\t\t\t// certain elements can have dimension info if we invisibly show them\n\
\t\t\t\t// however, it must have a current display style that would benefit from this\n\
\t\t\t\treturn elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, \"display\" ) ) ?\n\
\t\t\t\t\tjQuery.swap( elem, cssShow, function() {\n\
\t\t\t\t\t\treturn getWidthOrHeight( elem, name, extra );\n\
\t\t\t\t\t}) :\n\
\t\t\t\t\tgetWidthOrHeight( elem, name, extra );\n\
\t\t\t}\n\
\t\t},\n\
\n\
\t\tset: function( elem, value, extra ) {\n\
\t\t\tvar styles = extra && getStyles( elem );\n\
\t\t\treturn setPositiveNumber( elem, value, extra ?\n\
\t\t\t\taugmentWidthOrHeight(\n\
\t\t\t\t\telem,\n\
\t\t\t\t\tname,\n\
\t\t\t\t\textra,\n\
\t\t\t\t\tjQuery.support.boxSizing && jQuery.css( elem, \"boxSizing\", false, styles ) === \"border-box\",\n\
\t\t\t\t\tstyles\n\
\t\t\t\t) : 0\n\
\t\t\t);\n\
\t\t}\n\
\t};\n\
});\n\
\n\
if ( !jQuery.support.opacity ) {\n\
\tjQuery.cssHooks.opacity = {\n\
\t\tget: function( elem, computed ) {\n\
\t\t\t// IE uses filters for opacity\n\
\t\t\treturn ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || \"\" ) ?\n\
\t\t\t\t( 0.01 * parseFloat( RegExp.$1 ) ) + \"\" :\n\
\t\t\t\tcomputed ? \"1\" : \"\";\n\
\t\t},\n\
\n\
\t\tset: function( elem, value ) {\n\
\t\t\tvar style = elem.style,\n\
\t\t\t\tcurrentStyle = elem.currentStyle,\n\
\t\t\t\topacity = jQuery.isNumeric( value ) ? \"alpha(opacity=\" + value * 100 + \")\" : \"\",\n\
\t\t\t\tfilter = currentStyle && currentStyle.filter || style.filter || \"\";\n\
\n\
\t\t\t// IE has trouble with opacity if it does not have layout\n\
\t\t\t// Force it by setting the zoom level\n\
\t\t\tstyle.zoom = 1;\n\
\n\
\t\t\t// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652\n\
\t\t\t// if value === \"\", then remove inline opacity #12685\n\
\t\t\tif ( ( value >= 1 || value === \"\" ) &&\n\
\t\t\t\t\tjQuery.trim( filter.replace( ralpha, \"\" ) ) === \"\" &&\n\
\t\t\t\t\tstyle.removeAttribute ) {\n\
\n\
\t\t\t\t// Setting style.filter to null, \"\" & \" \" still leave \"filter:\" in the cssText\n\
\t\t\t\t// if \"filter:\" is present at all, clearType is disabled, we want to avoid this\n\
\t\t\t\t// style.removeAttribute is IE Only, but so apparently is this code path...\n\
\t\t\t\tstyle.removeAttribute( \"filter\" );\n\
\n\
\t\t\t\t// if there is no filter style applied in a css rule or unset inline opacity, we are done\n\
\t\t\t\tif ( value === \"\" || currentStyle && !currentStyle.filter ) {\n\
\t\t\t\t\treturn;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// otherwise, set new filter values\n\
\t\t\tstyle.filter = ralpha.test( filter ) ?\n\
\t\t\t\tfilter.replace( ralpha, opacity ) :\n\
\t\t\t\tfilter + \" \" + opacity;\n\
\t\t}\n\
\t};\n\
}\n\
\n\
// These hooks cannot be added until DOM ready because the support test\n\
// for it is not run until after DOM ready\n\
jQuery(function() {\n\
\tif ( !jQuery.support.reliableMarginRight ) {\n\
\t\tjQuery.cssHooks.marginRight = {\n\
\t\t\tget: function( elem, computed ) {\n\
\t\t\t\tif ( computed ) {\n\
\t\t\t\t\t// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right\n\
\t\t\t\t\t// Work around by temporarily setting element display to inline-block\n\
\t\t\t\t\treturn jQuery.swap( elem, { \"display\": \"inline-block\" },\n\
\t\t\t\t\t\tcurCSS, [ elem, \"marginRight\" ] );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t};\n\
\t}\n\
\n\
\t// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084\n\
\t// getComputedStyle returns percent when specified for top/left/bottom/right\n\
\t// rather than make the css module depend on the offset module, we just check for it here\n\
\tif ( !jQuery.support.pixelPosition && jQuery.fn.position ) {\n\
\t\tjQuery.each( [ \"top\", \"left\" ], function( i, prop ) {\n\
\t\t\tjQuery.cssHooks[ prop ] = {\n\
\t\t\t\tget: function( elem, computed ) {\n\
\t\t\t\t\tif ( computed ) {\n\
\t\t\t\t\t\tcomputed = curCSS( elem, prop );\n\
\t\t\t\t\t\t// if curCSS returns percentage, fallback to offset\n\
\t\t\t\t\t\treturn rnumnonpx.test( computed ) ?\n\
\t\t\t\t\t\t\tjQuery( elem ).position()[ prop ] + \"px\" :\n\
\t\t\t\t\t\t\tcomputed;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t};\n\
\t\t});\n\
\t}\n\
\n\
});\n\
\n\
if ( jQuery.expr && jQuery.expr.filters ) {\n\
\tjQuery.expr.filters.hidden = function( elem ) {\n\
\t\t// Support: Opera <= 12.12\n\
\t\t// Opera reports offsetWidths and offsetHeights less than zero on some elements\n\
\t\treturn elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||\n\
\t\t\t(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, \"display\" )) === \"none\");\n\
\t};\n\
\n\
\tjQuery.expr.filters.visible = function( elem ) {\n\
\t\treturn !jQuery.expr.filters.hidden( elem );\n\
\t};\n\
}\n\
\n\
// These hooks are used by animate to expand properties\n\
jQuery.each({\n\
\tmargin: \"\",\n\
\tpadding: \"\",\n\
\tborder: \"Width\"\n\
}, function( prefix, suffix ) {\n\
\tjQuery.cssHooks[ prefix + suffix ] = {\n\
\t\texpand: function( value ) {\n\
\t\t\tvar i = 0,\n\
\t\t\t\texpanded = {},\n\
\n\
\t\t\t\t// assumes a single number if not a string\n\
\t\t\t\tparts = typeof value === \"string\" ? value.split(\" \") : [ value ];\n\
\n\
\t\t\tfor ( ; i < 4; i++ ) {\n\
\t\t\t\texpanded[ prefix + cssExpand[ i ] + suffix ] =\n\
\t\t\t\t\tparts[ i ] || parts[ i - 2 ] || parts[ 0 ];\n\
\t\t\t}\n\
\n\
\t\t\treturn expanded;\n\
\t\t}\n\
\t};\n\
\n\
\tif ( !rmargin.test( prefix ) ) {\n\
\t\tjQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;\n\
\t}\n\
});\n\
var r20 = /%20/g,\n\
\trbracket = /\\[\\]$/,\n\
\trCRLF = /\\r?\\n\
/g,\n\
\trsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,\n\
\trsubmittable = /^(?:input|select|textarea|keygen)/i;\n\
\n\
jQuery.fn.extend({\n\
\tserialize: function() {\n\
\t\treturn jQuery.param( this.serializeArray() );\n\
\t},\n\
\tserializeArray: function() {\n\
\t\treturn this.map(function(){\n\
\t\t\t// Can add propHook for \"elements\" to filter or add form elements\n\
\t\t\tvar elements = jQuery.prop( this, \"elements\" );\n\
\t\t\treturn elements ? jQuery.makeArray( elements ) : this;\n\
\t\t})\n\
\t\t.filter(function(){\n\
\t\t\tvar type = this.type;\n\
\t\t\t// Use .is(\":disabled\") so that fieldset[disabled] works\n\
\t\t\treturn this.name && !jQuery( this ).is( \":disabled\" ) &&\n\
\t\t\t\trsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&\n\
\t\t\t\t( this.checked || !manipulation_rcheckableType.test( type ) );\n\
\t\t})\n\
\t\t.map(function( i, elem ){\n\
\t\t\tvar val = jQuery( this ).val();\n\
\n\
\t\t\treturn val == null ?\n\
\t\t\t\tnull :\n\
\t\t\t\tjQuery.isArray( val ) ?\n\
\t\t\t\t\tjQuery.map( val, function( val ){\n\
\t\t\t\t\t\treturn { name: elem.name, value: val.replace( rCRLF, \"\\r\\n\
\" ) };\n\
\t\t\t\t\t}) :\n\
\t\t\t\t\t{ name: elem.name, value: val.replace( rCRLF, \"\\r\\n\
\" ) };\n\
\t\t}).get();\n\
\t}\n\
});\n\
\n\
//Serialize an array of form elements or a set of\n\
//key/values into a query string\n\
jQuery.param = function( a, traditional ) {\n\
\tvar prefix,\n\
\t\ts = [],\n\
\t\tadd = function( key, value ) {\n\
\t\t\t// If value is a function, invoke it and return its value\n\
\t\t\tvalue = jQuery.isFunction( value ) ? value() : ( value == null ? \"\" : value );\n\
\t\t\ts[ s.length ] = encodeURIComponent( key ) + \"=\" + encodeURIComponent( value );\n\
\t\t};\n\
\n\
\t// Set traditional to true for jQuery <= 1.3.2 behavior.\n\
\tif ( traditional === undefined ) {\n\
\t\ttraditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;\n\
\t}\n\
\n\
\t// If an array was passed in, assume that it is an array of form elements.\n\
\tif ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {\n\
\t\t// Serialize the form elements\n\
\t\tjQuery.each( a, function() {\n\
\t\t\tadd( this.name, this.value );\n\
\t\t});\n\
\n\
\t} else {\n\
\t\t// If traditional, encode the \"old\" way (the way 1.3.2 or older\n\
\t\t// did it), otherwise encode params recursively.\n\
\t\tfor ( prefix in a ) {\n\
\t\t\tbuildParams( prefix, a[ prefix ], traditional, add );\n\
\t\t}\n\
\t}\n\
\n\
\t// Return the resulting serialization\n\
\treturn s.join( \"&\" ).replace( r20, \"+\" );\n\
};\n\
\n\
function buildParams( prefix, obj, traditional, add ) {\n\
\tvar name;\n\
\n\
\tif ( jQuery.isArray( obj ) ) {\n\
\t\t// Serialize array item.\n\
\t\tjQuery.each( obj, function( i, v ) {\n\
\t\t\tif ( traditional || rbracket.test( prefix ) ) {\n\
\t\t\t\t// Treat each array item as a scalar.\n\
\t\t\t\tadd( prefix, v );\n\
\n\
\t\t\t} else {\n\
\t\t\t\t// Item is non-scalar (array or object), encode its numeric index.\n\
\t\t\t\tbuildParams( prefix + \"[\" + ( typeof v === \"object\" ? i : \"\" ) + \"]\", v, traditional, add );\n\
\t\t\t}\n\
\t\t});\n\
\n\
\t} else if ( !traditional && jQuery.type( obj ) === \"object\" ) {\n\
\t\t// Serialize object item.\n\
\t\tfor ( name in obj ) {\n\
\t\t\tbuildParams( prefix + \"[\" + name + \"]\", obj[ name ], traditional, add );\n\
\t\t}\n\
\n\
\t} else {\n\
\t\t// Serialize scalar item.\n\
\t\tadd( prefix, obj );\n\
\t}\n\
}\n\
jQuery.each( (\"blur focus focusin focusout load resize scroll unload click dblclick \" +\n\
\t\"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave \" +\n\
\t\"change select submit keydown keypress keyup error contextmenu\").split(\" \"), function( i, name ) {\n\
\n\
\t// Handle event binding\n\
\tjQuery.fn[ name ] = function( data, fn ) {\n\
\t\treturn arguments.length > 0 ?\n\
\t\t\tthis.on( name, null, data, fn ) :\n\
\t\t\tthis.trigger( name );\n\
\t};\n\
});\n\
\n\
jQuery.fn.hover = function( fnOver, fnOut ) {\n\
\treturn this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );\n\
};\n\
var\n\
\t// Document location\n\
\tajaxLocParts,\n\
\tajaxLocation,\n\
\tajax_nonce = jQuery.now(),\n\
\n\
\tajax_rquery = /\\?/,\n\
\trhash = /#.*$/,\n\
\trts = /([?&])_=[^&]*/,\n\
\trheaders = /^(.*?):[ \\t]*([^\\r\\n\
]*)\\r?$/mg, // IE leaves an \\r character at EOL\n\
\t// #7653, #8125, #8152: local protocol detection\n\
\trlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,\n\
\trnoContent = /^(?:GET|HEAD)$/,\n\
\trprotocol = /^\\/\\//,\n\
\trurl = /^([\\w.+-]+:)(?:\\/\\/([^\\/?#:]*)(?::(\\d+)|)|)/,\n\
\n\
\t// Keep a copy of the old load method\n\
\t_load = jQuery.fn.load,\n\
\n\
\t/* Prefilters\n\
\t * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)\n\
\t * 2) These are called:\n\
\t *    - BEFORE asking for a transport\n\
\t *    - AFTER param serialization (s.data is a string if s.processData is true)\n\
\t * 3) key is the dataType\n\
\t * 4) the catchall symbol \"*\" can be used\n\
\t * 5) execution will start with transport dataType and THEN continue down to \"*\" if needed\n\
\t */\n\
\tprefilters = {},\n\
\n\
\t/* Transports bindings\n\
\t * 1) key is the dataType\n\
\t * 2) the catchall symbol \"*\" can be used\n\
\t * 3) selection will start with transport dataType and THEN go to \"*\" if needed\n\
\t */\n\
\ttransports = {},\n\
\n\
\t// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression\n\
\tallTypes = \"*/\".concat(\"*\");\n\
\n\
// #8138, IE may throw an exception when accessing\n\
// a field from window.location if document.domain has been set\n\
try {\n\
\tajaxLocation = location.href;\n\
} catch( e ) {\n\
\t// Use the href attribute of an A element\n\
\t// since IE will modify it given document.location\n\
\tajaxLocation = document.createElement( \"a\" );\n\
\tajaxLocation.href = \"\";\n\
\tajaxLocation = ajaxLocation.href;\n\
}\n\
\n\
// Segment location into parts\n\
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];\n\
\n\
// Base \"constructor\" for jQuery.ajaxPrefilter and jQuery.ajaxTransport\n\
function addToPrefiltersOrTransports( structure ) {\n\
\n\
\t// dataTypeExpression is optional and defaults to \"*\"\n\
\treturn function( dataTypeExpression, func ) {\n\
\n\
\t\tif ( typeof dataTypeExpression !== \"string\" ) {\n\
\t\t\tfunc = dataTypeExpression;\n\
\t\t\tdataTypeExpression = \"*\";\n\
\t\t}\n\
\n\
\t\tvar dataType,\n\
\t\t\ti = 0,\n\
\t\t\tdataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];\n\
\n\
\t\tif ( jQuery.isFunction( func ) ) {\n\
\t\t\t// For each dataType in the dataTypeExpression\n\
\t\t\twhile ( (dataType = dataTypes[i++]) ) {\n\
\t\t\t\t// Prepend if requested\n\
\t\t\t\tif ( dataType[0] === \"+\" ) {\n\
\t\t\t\t\tdataType = dataType.slice( 1 ) || \"*\";\n\
\t\t\t\t\t(structure[ dataType ] = structure[ dataType ] || []).unshift( func );\n\
\n\
\t\t\t\t// Otherwise append\n\
\t\t\t\t} else {\n\
\t\t\t\t\t(structure[ dataType ] = structure[ dataType ] || []).push( func );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t};\n\
}\n\
\n\
// Base inspection function for prefilters and transports\n\
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {\n\
\n\
\tvar inspected = {},\n\
\t\tseekingTransport = ( structure === transports );\n\
\n\
\tfunction inspect( dataType ) {\n\
\t\tvar selected;\n\
\t\tinspected[ dataType ] = true;\n\
\t\tjQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {\n\
\t\t\tvar dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );\n\
\t\t\tif( typeof dataTypeOrTransport === \"string\" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {\n\
\t\t\t\toptions.dataTypes.unshift( dataTypeOrTransport );\n\
\t\t\t\tinspect( dataTypeOrTransport );\n\
\t\t\t\treturn false;\n\
\t\t\t} else if ( seekingTransport ) {\n\
\t\t\t\treturn !( selected = dataTypeOrTransport );\n\
\t\t\t}\n\
\t\t});\n\
\t\treturn selected;\n\
\t}\n\
\n\
\treturn inspect( options.dataTypes[ 0 ] ) || !inspected[ \"*\" ] && inspect( \"*\" );\n\
}\n\
\n\
// A special extend for ajax options\n\
// that takes \"flat\" options (not to be deep extended)\n\
// Fixes #9887\n\
function ajaxExtend( target, src ) {\n\
\tvar deep, key,\n\
\t\tflatOptions = jQuery.ajaxSettings.flatOptions || {};\n\
\n\
\tfor ( key in src ) {\n\
\t\tif ( src[ key ] !== undefined ) {\n\
\t\t\t( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];\n\
\t\t}\n\
\t}\n\
\tif ( deep ) {\n\
\t\tjQuery.extend( true, target, deep );\n\
\t}\n\
\n\
\treturn target;\n\
}\n\
\n\
jQuery.fn.load = function( url, params, callback ) {\n\
\tif ( typeof url !== \"string\" && _load ) {\n\
\t\treturn _load.apply( this, arguments );\n\
\t}\n\
\n\
\tvar selector, response, type,\n\
\t\tself = this,\n\
\t\toff = url.indexOf(\" \");\n\
\n\
\tif ( off >= 0 ) {\n\
\t\tselector = url.slice( off, url.length );\n\
\t\turl = url.slice( 0, off );\n\
\t}\n\
\n\
\t// If it's a function\n\
\tif ( jQuery.isFunction( params ) ) {\n\
\n\
\t\t// We assume that it's the callback\n\
\t\tcallback = params;\n\
\t\tparams = undefined;\n\
\n\
\t// Otherwise, build a param string\n\
\t} else if ( params && typeof params === \"object\" ) {\n\
\t\ttype = \"POST\";\n\
\t}\n\
\n\
\t// If we have elements to modify, make the request\n\
\tif ( self.length > 0 ) {\n\
\t\tjQuery.ajax({\n\
\t\t\turl: url,\n\
\n\
\t\t\t// if \"type\" variable is undefined, then \"GET\" method will be used\n\
\t\t\ttype: type,\n\
\t\t\tdataType: \"html\",\n\
\t\t\tdata: params\n\
\t\t}).done(function( responseText ) {\n\
\n\
\t\t\t// Save response for use in complete callback\n\
\t\t\tresponse = arguments;\n\
\n\
\t\t\tself.html( selector ?\n\
\n\
\t\t\t\t// If a selector was specified, locate the right elements in a dummy div\n\
\t\t\t\t// Exclude scripts to avoid IE 'Permission Denied' errors\n\
\t\t\t\tjQuery(\"<div>\").append( jQuery.parseHTML( responseText ) ).find( selector ) :\n\
\n\
\t\t\t\t// Otherwise use the full result\n\
\t\t\t\tresponseText );\n\
\n\
\t\t}).complete( callback && function( jqXHR, status ) {\n\
\t\t\tself.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );\n\
\t\t});\n\
\t}\n\
\n\
\treturn this;\n\
};\n\
\n\
// Attach a bunch of functions for handling common AJAX events\n\
jQuery.each( [ \"ajaxStart\", \"ajaxStop\", \"ajaxComplete\", \"ajaxError\", \"ajaxSuccess\", \"ajaxSend\" ], function( i, type ){\n\
\tjQuery.fn[ type ] = function( fn ){\n\
\t\treturn this.on( type, fn );\n\
\t};\n\
});\n\
\n\
jQuery.each( [ \"get\", \"post\" ], function( i, method ) {\n\
\tjQuery[ method ] = function( url, data, callback, type ) {\n\
\t\t// shift arguments if data argument was omitted\n\
\t\tif ( jQuery.isFunction( data ) ) {\n\
\t\t\ttype = type || callback;\n\
\t\t\tcallback = data;\n\
\t\t\tdata = undefined;\n\
\t\t}\n\
\n\
\t\treturn jQuery.ajax({\n\
\t\t\turl: url,\n\
\t\t\ttype: method,\n\
\t\t\tdataType: type,\n\
\t\t\tdata: data,\n\
\t\t\tsuccess: callback\n\
\t\t});\n\
\t};\n\
});\n\
\n\
jQuery.extend({\n\
\n\
\t// Counter for holding the number of active queries\n\
\tactive: 0,\n\
\n\
\t// Last-Modified header cache for next request\n\
\tlastModified: {},\n\
\tetag: {},\n\
\n\
\tajaxSettings: {\n\
\t\turl: ajaxLocation,\n\
\t\ttype: \"GET\",\n\
\t\tisLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),\n\
\t\tglobal: true,\n\
\t\tprocessData: true,\n\
\t\tasync: true,\n\
\t\tcontentType: \"application/x-www-form-urlencoded; charset=UTF-8\",\n\
\t\t/*\n\
\t\ttimeout: 0,\n\
\t\tdata: null,\n\
\t\tdataType: null,\n\
\t\tusername: null,\n\
\t\tpassword: null,\n\
\t\tcache: null,\n\
\t\tthrows: false,\n\
\t\ttraditional: false,\n\
\t\theaders: {},\n\
\t\t*/\n\
\n\
\t\taccepts: {\n\
\t\t\t\"*\": allTypes,\n\
\t\t\ttext: \"text/plain\",\n\
\t\t\thtml: \"text/html\",\n\
\t\t\txml: \"application/xml, text/xml\",\n\
\t\t\tjson: \"application/json, text/javascript\"\n\
\t\t},\n\
\n\
\t\tcontents: {\n\
\t\t\txml: /xml/,\n\
\t\t\thtml: /html/,\n\
\t\t\tjson: /json/\n\
\t\t},\n\
\n\
\t\tresponseFields: {\n\
\t\t\txml: \"responseXML\",\n\
\t\t\ttext: \"responseText\"\n\
\t\t},\n\
\n\
\t\t// Data converters\n\
\t\t// Keys separate source (or catchall \"*\") and destination types with a single space\n\
\t\tconverters: {\n\
\n\
\t\t\t// Convert anything to text\n\
\t\t\t\"* text\": window.String,\n\
\n\
\t\t\t// Text to html (true = no transformation)\n\
\t\t\t\"text html\": true,\n\
\n\
\t\t\t// Evaluate text as a json expression\n\
\t\t\t\"text json\": jQuery.parseJSON,\n\
\n\
\t\t\t// Parse text as xml\n\
\t\t\t\"text xml\": jQuery.parseXML\n\
\t\t},\n\
\n\
\t\t// For options that shouldn't be deep extended:\n\
\t\t// you can add your own custom options here if\n\
\t\t// and when you create one that shouldn't be\n\
\t\t// deep extended (see ajaxExtend)\n\
\t\tflatOptions: {\n\
\t\t\turl: true,\n\
\t\t\tcontext: true\n\
\t\t}\n\
\t},\n\
\n\
\t// Creates a full fledged settings object into target\n\
\t// with both ajaxSettings and settings fields.\n\
\t// If target is omitted, writes into ajaxSettings.\n\
\tajaxSetup: function( target, settings ) {\n\
\t\treturn settings ?\n\
\n\
\t\t\t// Building a settings object\n\
\t\t\tajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :\n\
\n\
\t\t\t// Extending ajaxSettings\n\
\t\t\tajaxExtend( jQuery.ajaxSettings, target );\n\
\t},\n\
\n\
\tajaxPrefilter: addToPrefiltersOrTransports( prefilters ),\n\
\tajaxTransport: addToPrefiltersOrTransports( transports ),\n\
\n\
\t// Main method\n\
\tajax: function( url, options ) {\n\
\n\
\t\t// If url is an object, simulate pre-1.5 signature\n\
\t\tif ( typeof url === \"object\" ) {\n\
\t\t\toptions = url;\n\
\t\t\turl = undefined;\n\
\t\t}\n\
\n\
\t\t// Force options to be an object\n\
\t\toptions = options || {};\n\
\n\
\t\tvar // Cross-domain detection vars\n\
\t\t\tparts,\n\
\t\t\t// Loop variable\n\
\t\t\ti,\n\
\t\t\t// URL without anti-cache param\n\
\t\t\tcacheURL,\n\
\t\t\t// Response headers as string\n\
\t\t\tresponseHeadersString,\n\
\t\t\t// timeout handle\n\
\t\t\ttimeoutTimer,\n\
\n\
\t\t\t// To know if global events are to be dispatched\n\
\t\t\tfireGlobals,\n\
\n\
\t\t\ttransport,\n\
\t\t\t// Response headers\n\
\t\t\tresponseHeaders,\n\
\t\t\t// Create the final options object\n\
\t\t\ts = jQuery.ajaxSetup( {}, options ),\n\
\t\t\t// Callbacks context\n\
\t\t\tcallbackContext = s.context || s,\n\
\t\t\t// Context for global events is callbackContext if it is a DOM node or jQuery collection\n\
\t\t\tglobalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?\n\
\t\t\t\tjQuery( callbackContext ) :\n\
\t\t\t\tjQuery.event,\n\
\t\t\t// Deferreds\n\
\t\t\tdeferred = jQuery.Deferred(),\n\
\t\t\tcompleteDeferred = jQuery.Callbacks(\"once memory\"),\n\
\t\t\t// Status-dependent callbacks\n\
\t\t\tstatusCode = s.statusCode || {},\n\
\t\t\t// Headers (they are sent all at once)\n\
\t\t\trequestHeaders = {},\n\
\t\t\trequestHeadersNames = {},\n\
\t\t\t// The jqXHR state\n\
\t\t\tstate = 0,\n\
\t\t\t// Default abort message\n\
\t\t\tstrAbort = \"canceled\",\n\
\t\t\t// Fake xhr\n\
\t\t\tjqXHR = {\n\
\t\t\t\treadyState: 0,\n\
\n\
\t\t\t\t// Builds headers hashtable if needed\n\
\t\t\t\tgetResponseHeader: function( key ) {\n\
\t\t\t\t\tvar match;\n\
\t\t\t\t\tif ( state === 2 ) {\n\
\t\t\t\t\t\tif ( !responseHeaders ) {\n\
\t\t\t\t\t\t\tresponseHeaders = {};\n\
\t\t\t\t\t\t\twhile ( (match = rheaders.exec( responseHeadersString )) ) {\n\
\t\t\t\t\t\t\t\tresponseHeaders[ match[1].toLowerCase() ] = match[ 2 ];\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\tmatch = responseHeaders[ key.toLowerCase() ];\n\
\t\t\t\t\t}\n\
\t\t\t\t\treturn match == null ? null : match;\n\
\t\t\t\t},\n\
\n\
\t\t\t\t// Raw string\n\
\t\t\t\tgetAllResponseHeaders: function() {\n\
\t\t\t\t\treturn state === 2 ? responseHeadersString : null;\n\
\t\t\t\t},\n\
\n\
\t\t\t\t// Caches the header\n\
\t\t\t\tsetRequestHeader: function( name, value ) {\n\
\t\t\t\t\tvar lname = name.toLowerCase();\n\
\t\t\t\t\tif ( !state ) {\n\
\t\t\t\t\t\tname = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;\n\
\t\t\t\t\t\trequestHeaders[ name ] = value;\n\
\t\t\t\t\t}\n\
\t\t\t\t\treturn this;\n\
\t\t\t\t},\n\
\n\
\t\t\t\t// Overrides response content-type header\n\
\t\t\t\toverrideMimeType: function( type ) {\n\
\t\t\t\t\tif ( !state ) {\n\
\t\t\t\t\t\ts.mimeType = type;\n\
\t\t\t\t\t}\n\
\t\t\t\t\treturn this;\n\
\t\t\t\t},\n\
\n\
\t\t\t\t// Status-dependent callbacks\n\
\t\t\t\tstatusCode: function( map ) {\n\
\t\t\t\t\tvar code;\n\
\t\t\t\t\tif ( map ) {\n\
\t\t\t\t\t\tif ( state < 2 ) {\n\
\t\t\t\t\t\t\tfor ( code in map ) {\n\
\t\t\t\t\t\t\t\t// Lazy-add the new callback in a way that preserves old ones\n\
\t\t\t\t\t\t\t\tstatusCode[ code ] = [ statusCode[ code ], map[ code ] ];\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\t// Execute the appropriate callbacks\n\
\t\t\t\t\t\t\tjqXHR.always( map[ jqXHR.status ] );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t\treturn this;\n\
\t\t\t\t},\n\
\n\
\t\t\t\t// Cancel the request\n\
\t\t\t\tabort: function( statusText ) {\n\
\t\t\t\t\tvar finalText = statusText || strAbort;\n\
\t\t\t\t\tif ( transport ) {\n\
\t\t\t\t\t\ttransport.abort( finalText );\n\
\t\t\t\t\t}\n\
\t\t\t\t\tdone( 0, finalText );\n\
\t\t\t\t\treturn this;\n\
\t\t\t\t}\n\
\t\t\t};\n\
\n\
\t\t// Attach deferreds\n\
\t\tdeferred.promise( jqXHR ).complete = completeDeferred.add;\n\
\t\tjqXHR.success = jqXHR.done;\n\
\t\tjqXHR.error = jqXHR.fail;\n\
\n\
\t\t// Remove hash character (#7531: and string promotion)\n\
\t\t// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)\n\
\t\t// Handle falsy url in the settings object (#10093: consistency with old signature)\n\
\t\t// We also use the url parameter if available\n\
\t\ts.url = ( ( url || s.url || ajaxLocation ) + \"\" ).replace( rhash, \"\" ).replace( rprotocol, ajaxLocParts[ 1 ] + \"//\" );\n\
\n\
\t\t// Alias method option to type as per ticket #12004\n\
\t\ts.type = options.method || options.type || s.method || s.type;\n\
\n\
\t\t// Extract dataTypes list\n\
\t\ts.dataTypes = jQuery.trim( s.dataType || \"*\" ).toLowerCase().match( core_rnotwhite ) || [\"\"];\n\
\n\
\t\t// A cross-domain request is in order when we have a protocol:host:port mismatch\n\
\t\tif ( s.crossDomain == null ) {\n\
\t\t\tparts = rurl.exec( s.url.toLowerCase() );\n\
\t\t\ts.crossDomain = !!( parts &&\n\
\t\t\t\t( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||\n\
\t\t\t\t\t( parts[ 3 ] || ( parts[ 1 ] === \"http:\" ? 80 : 443 ) ) !=\n\
\t\t\t\t\t\t( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === \"http:\" ? 80 : 443 ) ) )\n\
\t\t\t);\n\
\t\t}\n\
\n\
\t\t// Convert data if not already a string\n\
\t\tif ( s.data && s.processData && typeof s.data !== \"string\" ) {\n\
\t\t\ts.data = jQuery.param( s.data, s.traditional );\n\
\t\t}\n\
\n\
\t\t// Apply prefilters\n\
\t\tinspectPrefiltersOrTransports( prefilters, s, options, jqXHR );\n\
\n\
\t\t// If request was aborted inside a prefilter, stop there\n\
\t\tif ( state === 2 ) {\n\
\t\t\treturn jqXHR;\n\
\t\t}\n\
\n\
\t\t// We can fire global events as of now if asked to\n\
\t\tfireGlobals = s.global;\n\
\n\
\t\t// Watch for a new set of requests\n\
\t\tif ( fireGlobals && jQuery.active++ === 0 ) {\n\
\t\t\tjQuery.event.trigger(\"ajaxStart\");\n\
\t\t}\n\
\n\
\t\t// Uppercase the type\n\
\t\ts.type = s.type.toUpperCase();\n\
\n\
\t\t// Determine if request has content\n\
\t\ts.hasContent = !rnoContent.test( s.type );\n\
\n\
\t\t// Save the URL in case we're toying with the If-Modified-Since\n\
\t\t// and/or If-None-Match header later on\n\
\t\tcacheURL = s.url;\n\
\n\
\t\t// More options handling for requests with no content\n\
\t\tif ( !s.hasContent ) {\n\
\n\
\t\t\t// If data is available, append data to url\n\
\t\t\tif ( s.data ) {\n\
\t\t\t\tcacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? \"&\" : \"?\" ) + s.data );\n\
\t\t\t\t// #9682: remove data so that it's not used in an eventual retry\n\
\t\t\t\tdelete s.data;\n\
\t\t\t}\n\
\n\
\t\t\t// Add anti-cache in url if needed\n\
\t\t\tif ( s.cache === false ) {\n\
\t\t\t\ts.url = rts.test( cacheURL ) ?\n\
\n\
\t\t\t\t\t// If there is already a '_' parameter, set its value\n\
\t\t\t\t\tcacheURL.replace( rts, \"$1_=\" + ajax_nonce++ ) :\n\
\n\
\t\t\t\t\t// Otherwise add one to the end\n\
\t\t\t\t\tcacheURL + ( ajax_rquery.test( cacheURL ) ? \"&\" : \"?\" ) + \"_=\" + ajax_nonce++;\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.\n\
\t\tif ( s.ifModified ) {\n\
\t\t\tif ( jQuery.lastModified[ cacheURL ] ) {\n\
\t\t\t\tjqXHR.setRequestHeader( \"If-Modified-Since\", jQuery.lastModified[ cacheURL ] );\n\
\t\t\t}\n\
\t\t\tif ( jQuery.etag[ cacheURL ] ) {\n\
\t\t\t\tjqXHR.setRequestHeader( \"If-None-Match\", jQuery.etag[ cacheURL ] );\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Set the correct header, if data is being sent\n\
\t\tif ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {\n\
\t\t\tjqXHR.setRequestHeader( \"Content-Type\", s.contentType );\n\
\t\t}\n\
\n\
\t\t// Set the Accepts header for the server, depending on the dataType\n\
\t\tjqXHR.setRequestHeader(\n\
\t\t\t\"Accept\",\n\
\t\t\ts.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?\n\
\t\t\t\ts.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== \"*\" ? \", \" + allTypes + \"; q=0.01\" : \"\" ) :\n\
\t\t\t\ts.accepts[ \"*\" ]\n\
\t\t);\n\
\n\
\t\t// Check for headers option\n\
\t\tfor ( i in s.headers ) {\n\
\t\t\tjqXHR.setRequestHeader( i, s.headers[ i ] );\n\
\t\t}\n\
\n\
\t\t// Allow custom headers/mimetypes and early abort\n\
\t\tif ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {\n\
\t\t\t// Abort if not done already and return\n\
\t\t\treturn jqXHR.abort();\n\
\t\t}\n\
\n\
\t\t// aborting is no longer a cancellation\n\
\t\tstrAbort = \"abort\";\n\
\n\
\t\t// Install callbacks on deferreds\n\
\t\tfor ( i in { success: 1, error: 1, complete: 1 } ) {\n\
\t\t\tjqXHR[ i ]( s[ i ] );\n\
\t\t}\n\
\n\
\t\t// Get transport\n\
\t\ttransport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );\n\
\n\
\t\t// If no transport, we auto-abort\n\
\t\tif ( !transport ) {\n\
\t\t\tdone( -1, \"No Transport\" );\n\
\t\t} else {\n\
\t\t\tjqXHR.readyState = 1;\n\
\n\
\t\t\t// Send global event\n\
\t\t\tif ( fireGlobals ) {\n\
\t\t\t\tglobalEventContext.trigger( \"ajaxSend\", [ jqXHR, s ] );\n\
\t\t\t}\n\
\t\t\t// Timeout\n\
\t\t\tif ( s.async && s.timeout > 0 ) {\n\
\t\t\t\ttimeoutTimer = setTimeout(function() {\n\
\t\t\t\t\tjqXHR.abort(\"timeout\");\n\
\t\t\t\t}, s.timeout );\n\
\t\t\t}\n\
\n\
\t\t\ttry {\n\
\t\t\t\tstate = 1;\n\
\t\t\t\ttransport.send( requestHeaders, done );\n\
\t\t\t} catch ( e ) {\n\
\t\t\t\t// Propagate exception as error if not done\n\
\t\t\t\tif ( state < 2 ) {\n\
\t\t\t\t\tdone( -1, e );\n\
\t\t\t\t// Simply rethrow otherwise\n\
\t\t\t\t} else {\n\
\t\t\t\t\tthrow e;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\t// Callback for when everything is done\n\
\t\tfunction done( status, nativeStatusText, responses, headers ) {\n\
\t\t\tvar isSuccess, success, error, response, modified,\n\
\t\t\t\tstatusText = nativeStatusText;\n\
\n\
\t\t\t// Called once\n\
\t\t\tif ( state === 2 ) {\n\
\t\t\t\treturn;\n\
\t\t\t}\n\
\n\
\t\t\t// State is \"done\" now\n\
\t\t\tstate = 2;\n\
\n\
\t\t\t// Clear timeout if it exists\n\
\t\t\tif ( timeoutTimer ) {\n\
\t\t\t\tclearTimeout( timeoutTimer );\n\
\t\t\t}\n\
\n\
\t\t\t// Dereference transport for early garbage collection\n\
\t\t\t// (no matter how long the jqXHR object will be used)\n\
\t\t\ttransport = undefined;\n\
\n\
\t\t\t// Cache response headers\n\
\t\t\tresponseHeadersString = headers || \"\";\n\
\n\
\t\t\t// Set readyState\n\
\t\t\tjqXHR.readyState = status > 0 ? 4 : 0;\n\
\n\
\t\t\t// Get response data\n\
\t\t\tif ( responses ) {\n\
\t\t\t\tresponse = ajaxHandleResponses( s, jqXHR, responses );\n\
\t\t\t}\n\
\n\
\t\t\t// If successful, handle type chaining\n\
\t\t\tif ( status >= 200 && status < 300 || status === 304 ) {\n\
\n\
\t\t\t\t// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.\n\
\t\t\t\tif ( s.ifModified ) {\n\
\t\t\t\t\tmodified = jqXHR.getResponseHeader(\"Last-Modified\");\n\
\t\t\t\t\tif ( modified ) {\n\
\t\t\t\t\t\tjQuery.lastModified[ cacheURL ] = modified;\n\
\t\t\t\t\t}\n\
\t\t\t\t\tmodified = jqXHR.getResponseHeader(\"etag\");\n\
\t\t\t\t\tif ( modified ) {\n\
\t\t\t\t\t\tjQuery.etag[ cacheURL ] = modified;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// if no content\n\
\t\t\t\tif ( status === 204 ) {\n\
\t\t\t\t\tisSuccess = true;\n\
\t\t\t\t\tstatusText = \"nocontent\";\n\
\n\
\t\t\t\t// if not modified\n\
\t\t\t\t} else if ( status === 304 ) {\n\
\t\t\t\t\tisSuccess = true;\n\
\t\t\t\t\tstatusText = \"notmodified\";\n\
\n\
\t\t\t\t// If we have data, let's convert it\n\
\t\t\t\t} else {\n\
\t\t\t\t\tisSuccess = ajaxConvert( s, response );\n\
\t\t\t\t\tstatusText = isSuccess.state;\n\
\t\t\t\t\tsuccess = isSuccess.data;\n\
\t\t\t\t\terror = isSuccess.error;\n\
\t\t\t\t\tisSuccess = !error;\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\t// We extract error from statusText\n\
\t\t\t\t// then normalize statusText and status for non-aborts\n\
\t\t\t\terror = statusText;\n\
\t\t\t\tif ( status || !statusText ) {\n\
\t\t\t\t\tstatusText = \"error\";\n\
\t\t\t\t\tif ( status < 0 ) {\n\
\t\t\t\t\t\tstatus = 0;\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// Set data for the fake xhr object\n\
\t\t\tjqXHR.status = status;\n\
\t\t\tjqXHR.statusText = ( nativeStatusText || statusText ) + \"\";\n\
\n\
\t\t\t// Success/Error\n\
\t\t\tif ( isSuccess ) {\n\
\t\t\t\tdeferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );\n\
\t\t\t} else {\n\
\t\t\t\tdeferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );\n\
\t\t\t}\n\
\n\
\t\t\t// Status-dependent callbacks\n\
\t\t\tjqXHR.statusCode( statusCode );\n\
\t\t\tstatusCode = undefined;\n\
\n\
\t\t\tif ( fireGlobals ) {\n\
\t\t\t\tglobalEventContext.trigger( isSuccess ? \"ajaxSuccess\" : \"ajaxError\",\n\
\t\t\t\t\t[ jqXHR, s, isSuccess ? success : error ] );\n\
\t\t\t}\n\
\n\
\t\t\t// Complete\n\
\t\t\tcompleteDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );\n\
\n\
\t\t\tif ( fireGlobals ) {\n\
\t\t\t\tglobalEventContext.trigger( \"ajaxComplete\", [ jqXHR, s ] );\n\
\t\t\t\t// Handle the global AJAX counter\n\
\t\t\t\tif ( !( --jQuery.active ) ) {\n\
\t\t\t\t\tjQuery.event.trigger(\"ajaxStop\");\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\n\
\t\treturn jqXHR;\n\
\t},\n\
\n\
\tgetScript: function( url, callback ) {\n\
\t\treturn jQuery.get( url, undefined, callback, \"script\" );\n\
\t},\n\
\n\
\tgetJSON: function( url, data, callback ) {\n\
\t\treturn jQuery.get( url, data, callback, \"json\" );\n\
\t}\n\
});\n\
\n\
/* Handles responses to an ajax request:\n\
 * - sets all responseXXX fields accordingly\n\
 * - finds the right dataType (mediates between content-type and expected dataType)\n\
 * - returns the corresponding response\n\
 */\n\
function ajaxHandleResponses( s, jqXHR, responses ) {\n\
\tvar firstDataType, ct, finalDataType, type,\n\
\t\tcontents = s.contents,\n\
\t\tdataTypes = s.dataTypes,\n\
\t\tresponseFields = s.responseFields;\n\
\n\
\t// Fill responseXXX fields\n\
\tfor ( type in responseFields ) {\n\
\t\tif ( type in responses ) {\n\
\t\t\tjqXHR[ responseFields[type] ] = responses[ type ];\n\
\t\t}\n\
\t}\n\
\n\
\t// Remove auto dataType and get content-type in the process\n\
\twhile( dataTypes[ 0 ] === \"*\" ) {\n\
\t\tdataTypes.shift();\n\
\t\tif ( ct === undefined ) {\n\
\t\t\tct = s.mimeType || jqXHR.getResponseHeader(\"Content-Type\");\n\
\t\t}\n\
\t}\n\
\n\
\t// Check if we're dealing with a known content-type\n\
\tif ( ct ) {\n\
\t\tfor ( type in contents ) {\n\
\t\t\tif ( contents[ type ] && contents[ type ].test( ct ) ) {\n\
\t\t\t\tdataTypes.unshift( type );\n\
\t\t\t\tbreak;\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\t// Check to see if we have a response for the expected dataType\n\
\tif ( dataTypes[ 0 ] in responses ) {\n\
\t\tfinalDataType = dataTypes[ 0 ];\n\
\t} else {\n\
\t\t// Try convertible dataTypes\n\
\t\tfor ( type in responses ) {\n\
\t\t\tif ( !dataTypes[ 0 ] || s.converters[ type + \" \" + dataTypes[0] ] ) {\n\
\t\t\t\tfinalDataType = type;\n\
\t\t\t\tbreak;\n\
\t\t\t}\n\
\t\t\tif ( !firstDataType ) {\n\
\t\t\t\tfirstDataType = type;\n\
\t\t\t}\n\
\t\t}\n\
\t\t// Or just use first one\n\
\t\tfinalDataType = finalDataType || firstDataType;\n\
\t}\n\
\n\
\t// If we found a dataType\n\
\t// We add the dataType to the list if needed\n\
\t// and return the corresponding response\n\
\tif ( finalDataType ) {\n\
\t\tif ( finalDataType !== dataTypes[ 0 ] ) {\n\
\t\t\tdataTypes.unshift( finalDataType );\n\
\t\t}\n\
\t\treturn responses[ finalDataType ];\n\
\t}\n\
}\n\
\n\
// Chain conversions given the request and the original response\n\
function ajaxConvert( s, response ) {\n\
\tvar conv2, current, conv, tmp,\n\
\t\tconverters = {},\n\
\t\ti = 0,\n\
\t\t// Work with a copy of dataTypes in case we need to modify it for conversion\n\
\t\tdataTypes = s.dataTypes.slice(),\n\
\t\tprev = dataTypes[ 0 ];\n\
\n\
\t// Apply the dataFilter if provided\n\
\tif ( s.dataFilter ) {\n\
\t\tresponse = s.dataFilter( response, s.dataType );\n\
\t}\n\
\n\
\t// Create converters map with lowercased keys\n\
\tif ( dataTypes[ 1 ] ) {\n\
\t\tfor ( conv in s.converters ) {\n\
\t\t\tconverters[ conv.toLowerCase() ] = s.converters[ conv ];\n\
\t\t}\n\
\t}\n\
\n\
\t// Convert to each sequential dataType, tolerating list modification\n\
\tfor ( ; (current = dataTypes[++i]); ) {\n\
\n\
\t\t// There's only work to do if current dataType is non-auto\n\
\t\tif ( current !== \"*\" ) {\n\
\n\
\t\t\t// Convert response if prev dataType is non-auto and differs from current\n\
\t\t\tif ( prev !== \"*\" && prev !== current ) {\n\
\n\
\t\t\t\t// Seek a direct converter\n\
\t\t\t\tconv = converters[ prev + \" \" + current ] || converters[ \"* \" + current ];\n\
\n\
\t\t\t\t// If none found, seek a pair\n\
\t\t\t\tif ( !conv ) {\n\
\t\t\t\t\tfor ( conv2 in converters ) {\n\
\n\
\t\t\t\t\t\t// If conv2 outputs current\n\
\t\t\t\t\t\ttmp = conv2.split(\" \");\n\
\t\t\t\t\t\tif ( tmp[ 1 ] === current ) {\n\
\n\
\t\t\t\t\t\t\t// If prev can be converted to accepted input\n\
\t\t\t\t\t\t\tconv = converters[ prev + \" \" + tmp[ 0 ] ] ||\n\
\t\t\t\t\t\t\t\tconverters[ \"* \" + tmp[ 0 ] ];\n\
\t\t\t\t\t\t\tif ( conv ) {\n\
\t\t\t\t\t\t\t\t// Condense equivalence converters\n\
\t\t\t\t\t\t\t\tif ( conv === true ) {\n\
\t\t\t\t\t\t\t\t\tconv = converters[ conv2 ];\n\
\n\
\t\t\t\t\t\t\t\t// Otherwise, insert the intermediate dataType\n\
\t\t\t\t\t\t\t\t} else if ( converters[ conv2 ] !== true ) {\n\
\t\t\t\t\t\t\t\t\tcurrent = tmp[ 0 ];\n\
\t\t\t\t\t\t\t\t\tdataTypes.splice( i--, 0, current );\n\
\t\t\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t\t\tbreak;\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Apply converter (if not an equivalence)\n\
\t\t\t\tif ( conv !== true ) {\n\
\n\
\t\t\t\t\t// Unless errors are allowed to bubble, catch and return them\n\
\t\t\t\t\tif ( conv && s[\"throws\"] ) {\n\
\t\t\t\t\t\tresponse = conv( response );\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\ttry {\n\
\t\t\t\t\t\t\tresponse = conv( response );\n\
\t\t\t\t\t\t} catch ( e ) {\n\
\t\t\t\t\t\t\treturn { state: \"parsererror\", error: conv ? e : \"No conversion from \" + prev + \" to \" + current };\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// Update prev for next iteration\n\
\t\t\tprev = current;\n\
\t\t}\n\
\t}\n\
\n\
\treturn { state: \"success\", data: response };\n\
}\n\
// Install script dataType\n\
jQuery.ajaxSetup({\n\
\taccepts: {\n\
\t\tscript: \"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript\"\n\
\t},\n\
\tcontents: {\n\
\t\tscript: /(?:java|ecma)script/\n\
\t},\n\
\tconverters: {\n\
\t\t\"text script\": function( text ) {\n\
\t\t\tjQuery.globalEval( text );\n\
\t\t\treturn text;\n\
\t\t}\n\
\t}\n\
});\n\
\n\
// Handle cache's special case and global\n\
jQuery.ajaxPrefilter( \"script\", function( s ) {\n\
\tif ( s.cache === undefined ) {\n\
\t\ts.cache = false;\n\
\t}\n\
\tif ( s.crossDomain ) {\n\
\t\ts.type = \"GET\";\n\
\t\ts.global = false;\n\
\t}\n\
});\n\
\n\
// Bind script tag hack transport\n\
jQuery.ajaxTransport( \"script\", function(s) {\n\
\n\
\t// This transport only deals with cross domain requests\n\
\tif ( s.crossDomain ) {\n\
\n\
\t\tvar script,\n\
\t\t\thead = document.head || jQuery(\"head\")[0] || document.documentElement;\n\
\n\
\t\treturn {\n\
\n\
\t\t\tsend: function( _, callback ) {\n\
\n\
\t\t\t\tscript = document.createElement(\"script\");\n\
\n\
\t\t\t\tscript.async = true;\n\
\n\
\t\t\t\tif ( s.scriptCharset ) {\n\
\t\t\t\t\tscript.charset = s.scriptCharset;\n\
\t\t\t\t}\n\
\n\
\t\t\t\tscript.src = s.url;\n\
\n\
\t\t\t\t// Attach handlers for all browsers\n\
\t\t\t\tscript.onload = script.onreadystatechange = function( _, isAbort ) {\n\
\n\
\t\t\t\t\tif ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {\n\
\n\
\t\t\t\t\t\t// Handle memory leak in IE\n\
\t\t\t\t\t\tscript.onload = script.onreadystatechange = null;\n\
\n\
\t\t\t\t\t\t// Remove the script\n\
\t\t\t\t\t\tif ( script.parentNode ) {\n\
\t\t\t\t\t\t\tscript.parentNode.removeChild( script );\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t// Dereference the script\n\
\t\t\t\t\t\tscript = null;\n\
\n\
\t\t\t\t\t\t// Callback if not abort\n\
\t\t\t\t\t\tif ( !isAbort ) {\n\
\t\t\t\t\t\t\tcallback( 200, \"success\" );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\t\t\t\t};\n\
\n\
\t\t\t\t// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending\n\
\t\t\t\t// Use native DOM manipulation to avoid our domManip AJAX trickery\n\
\t\t\t\thead.insertBefore( script, head.firstChild );\n\
\t\t\t},\n\
\n\
\t\t\tabort: function() {\n\
\t\t\t\tif ( script ) {\n\
\t\t\t\t\tscript.onload( undefined, true );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t};\n\
\t}\n\
});\n\
var oldCallbacks = [],\n\
\trjsonp = /(=)\\?(?=&|$)|\\?\\?/;\n\
\n\
// Default jsonp settings\n\
jQuery.ajaxSetup({\n\
\tjsonp: \"callback\",\n\
\tjsonpCallback: function() {\n\
\t\tvar callback = oldCallbacks.pop() || ( jQuery.expando + \"_\" + ( ajax_nonce++ ) );\n\
\t\tthis[ callback ] = true;\n\
\t\treturn callback;\n\
\t}\n\
});\n\
\n\
// Detect, normalize options and install callbacks for jsonp requests\n\
jQuery.ajaxPrefilter( \"json jsonp\", function( s, originalSettings, jqXHR ) {\n\
\n\
\tvar callbackName, overwritten, responseContainer,\n\
\t\tjsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?\n\
\t\t\t\"url\" :\n\
\t\t\ttypeof s.data === \"string\" && !( s.contentType || \"\" ).indexOf(\"application/x-www-form-urlencoded\") && rjsonp.test( s.data ) && \"data\"\n\
\t\t);\n\
\n\
\t// Handle iff the expected data type is \"jsonp\" or we have a parameter to set\n\
\tif ( jsonProp || s.dataTypes[ 0 ] === \"jsonp\" ) {\n\
\n\
\t\t// Get callback name, remembering preexisting value associated with it\n\
\t\tcallbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?\n\
\t\t\ts.jsonpCallback() :\n\
\t\t\ts.jsonpCallback;\n\
\n\
\t\t// Insert callback into url or form data\n\
\t\tif ( jsonProp ) {\n\
\t\t\ts[ jsonProp ] = s[ jsonProp ].replace( rjsonp, \"$1\" + callbackName );\n\
\t\t} else if ( s.jsonp !== false ) {\n\
\t\t\ts.url += ( ajax_rquery.test( s.url ) ? \"&\" : \"?\" ) + s.jsonp + \"=\" + callbackName;\n\
\t\t}\n\
\n\
\t\t// Use data converter to retrieve json after script execution\n\
\t\ts.converters[\"script json\"] = function() {\n\
\t\t\tif ( !responseContainer ) {\n\
\t\t\t\tjQuery.error( callbackName + \" was not called\" );\n\
\t\t\t}\n\
\t\t\treturn responseContainer[ 0 ];\n\
\t\t};\n\
\n\
\t\t// force json dataType\n\
\t\ts.dataTypes[ 0 ] = \"json\";\n\
\n\
\t\t// Install callback\n\
\t\toverwritten = window[ callbackName ];\n\
\t\twindow[ callbackName ] = function() {\n\
\t\t\tresponseContainer = arguments;\n\
\t\t};\n\
\n\
\t\t// Clean-up function (fires after converters)\n\
\t\tjqXHR.always(function() {\n\
\t\t\t// Restore preexisting value\n\
\t\t\twindow[ callbackName ] = overwritten;\n\
\n\
\t\t\t// Save back as free\n\
\t\t\tif ( s[ callbackName ] ) {\n\
\t\t\t\t// make sure that re-using the options doesn't screw things around\n\
\t\t\t\ts.jsonpCallback = originalSettings.jsonpCallback;\n\
\n\
\t\t\t\t// save the callback name for future use\n\
\t\t\t\toldCallbacks.push( callbackName );\n\
\t\t\t}\n\
\n\
\t\t\t// Call if it was a function and we have a response\n\
\t\t\tif ( responseContainer && jQuery.isFunction( overwritten ) ) {\n\
\t\t\t\toverwritten( responseContainer[ 0 ] );\n\
\t\t\t}\n\
\n\
\t\t\tresponseContainer = overwritten = undefined;\n\
\t\t});\n\
\n\
\t\t// Delegate to script\n\
\t\treturn \"script\";\n\
\t}\n\
});\n\
var xhrCallbacks, xhrSupported,\n\
\txhrId = 0,\n\
\t// #5280: Internet Explorer will keep connections alive if we don't abort on unload\n\
\txhrOnUnloadAbort = window.ActiveXObject && function() {\n\
\t\t// Abort all pending requests\n\
\t\tvar key;\n\
\t\tfor ( key in xhrCallbacks ) {\n\
\t\t\txhrCallbacks[ key ]( undefined, true );\n\
\t\t}\n\
\t};\n\
\n\
// Functions to create xhrs\n\
function createStandardXHR() {\n\
\ttry {\n\
\t\treturn new window.XMLHttpRequest();\n\
\t} catch( e ) {}\n\
}\n\
\n\
function createActiveXHR() {\n\
\ttry {\n\
\t\treturn new window.ActiveXObject(\"Microsoft.XMLHTTP\");\n\
\t} catch( e ) {}\n\
}\n\
\n\
// Create the request object\n\
// (This is still attached to ajaxSettings for backward compatibility)\n\
jQuery.ajaxSettings.xhr = window.ActiveXObject ?\n\
\t/* Microsoft failed to properly\n\
\t * implement the XMLHttpRequest in IE7 (can't request local files),\n\
\t * so we use the ActiveXObject when it is available\n\
\t * Additionally XMLHttpRequest can be disabled in IE7/IE8 so\n\
\t * we need a fallback.\n\
\t */\n\
\tfunction() {\n\
\t\treturn !this.isLocal && createStandardXHR() || createActiveXHR();\n\
\t} :\n\
\t// For all other browsers, use the standard XMLHttpRequest object\n\
\tcreateStandardXHR;\n\
\n\
// Determine support properties\n\
xhrSupported = jQuery.ajaxSettings.xhr();\n\
jQuery.support.cors = !!xhrSupported && ( \"withCredentials\" in xhrSupported );\n\
xhrSupported = jQuery.support.ajax = !!xhrSupported;\n\
\n\
// Create transport if the browser can provide an xhr\n\
if ( xhrSupported ) {\n\
\n\
\tjQuery.ajaxTransport(function( s ) {\n\
\t\t// Cross domain only allowed if supported through XMLHttpRequest\n\
\t\tif ( !s.crossDomain || jQuery.support.cors ) {\n\
\n\
\t\t\tvar callback;\n\
\n\
\t\t\treturn {\n\
\t\t\t\tsend: function( headers, complete ) {\n\
\n\
\t\t\t\t\t// Get a new xhr\n\
\t\t\t\t\tvar handle, i,\n\
\t\t\t\t\t\txhr = s.xhr();\n\
\n\
\t\t\t\t\t// Open the socket\n\
\t\t\t\t\t// Passing null username, generates a login popup on Opera (#2865)\n\
\t\t\t\t\tif ( s.username ) {\n\
\t\t\t\t\t\txhr.open( s.type, s.url, s.async, s.username, s.password );\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\txhr.open( s.type, s.url, s.async );\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Apply custom fields if provided\n\
\t\t\t\t\tif ( s.xhrFields ) {\n\
\t\t\t\t\t\tfor ( i in s.xhrFields ) {\n\
\t\t\t\t\t\t\txhr[ i ] = s.xhrFields[ i ];\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Override mime type if needed\n\
\t\t\t\t\tif ( s.mimeType && xhr.overrideMimeType ) {\n\
\t\t\t\t\t\txhr.overrideMimeType( s.mimeType );\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// X-Requested-With header\n\
\t\t\t\t\t// For cross-domain requests, seeing as conditions for a preflight are\n\
\t\t\t\t\t// akin to a jigsaw puzzle, we simply never set it to be sure.\n\
\t\t\t\t\t// (it can always be set on a per-request basis or even using ajaxSetup)\n\
\t\t\t\t\t// For same-domain requests, won't change header if already provided.\n\
\t\t\t\t\tif ( !s.crossDomain && !headers[\"X-Requested-With\"] ) {\n\
\t\t\t\t\t\theaders[\"X-Requested-With\"] = \"XMLHttpRequest\";\n\
\t\t\t\t\t}\n\
\n\
\t\t\t\t\t// Need an extra try/catch for cross domain requests in Firefox 3\n\
\t\t\t\t\ttry {\n\
\t\t\t\t\t\tfor ( i in headers ) {\n\
\t\t\t\t\t\t\txhr.setRequestHeader( i, headers[ i ] );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t} catch( err ) {}\n\
\n\
\t\t\t\t\t// Do send the request\n\
\t\t\t\t\t// This may raise an exception which is actually\n\
\t\t\t\t\t// handled in jQuery.ajax (so no try/catch here)\n\
\t\t\t\t\txhr.send( ( s.hasContent && s.data ) || null );\n\
\n\
\t\t\t\t\t// Listener\n\
\t\t\t\t\tcallback = function( _, isAbort ) {\n\
\t\t\t\t\t\tvar status, responseHeaders, statusText, responses;\n\
\n\
\t\t\t\t\t\t// Firefox throws exceptions when accessing properties\n\
\t\t\t\t\t\t// of an xhr when a network error occurred\n\
\t\t\t\t\t\t// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)\n\
\t\t\t\t\t\ttry {\n\
\n\
\t\t\t\t\t\t\t// Was never called and is aborted or complete\n\
\t\t\t\t\t\t\tif ( callback && ( isAbort || xhr.readyState === 4 ) ) {\n\
\n\
\t\t\t\t\t\t\t\t// Only called once\n\
\t\t\t\t\t\t\t\tcallback = undefined;\n\
\n\
\t\t\t\t\t\t\t\t// Do not keep as active anymore\n\
\t\t\t\t\t\t\t\tif ( handle ) {\n\
\t\t\t\t\t\t\t\t\txhr.onreadystatechange = jQuery.noop;\n\
\t\t\t\t\t\t\t\t\tif ( xhrOnUnloadAbort ) {\n\
\t\t\t\t\t\t\t\t\t\tdelete xhrCallbacks[ handle ];\n\
\t\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t\t\t// If it's an abort\n\
\t\t\t\t\t\t\t\tif ( isAbort ) {\n\
\t\t\t\t\t\t\t\t\t// Abort it manually if needed\n\
\t\t\t\t\t\t\t\t\tif ( xhr.readyState !== 4 ) {\n\
\t\t\t\t\t\t\t\t\t\txhr.abort();\n\
\t\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t\t} else {\n\
\t\t\t\t\t\t\t\t\tresponses = {};\n\
\t\t\t\t\t\t\t\t\tstatus = xhr.status;\n\
\t\t\t\t\t\t\t\t\tresponseHeaders = xhr.getAllResponseHeaders();\n\
\n\
\t\t\t\t\t\t\t\t\t// When requesting binary data, IE6-9 will throw an exception\n\
\t\t\t\t\t\t\t\t\t// on any attempt to access responseText (#11426)\n\
\t\t\t\t\t\t\t\t\tif ( typeof xhr.responseText === \"string\" ) {\n\
\t\t\t\t\t\t\t\t\t\tresponses.text = xhr.responseText;\n\
\t\t\t\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t\t\t\t// Firefox throws an exception when accessing\n\
\t\t\t\t\t\t\t\t\t// statusText for faulty cross-domain requests\n\
\t\t\t\t\t\t\t\t\ttry {\n\
\t\t\t\t\t\t\t\t\t\tstatusText = xhr.statusText;\n\
\t\t\t\t\t\t\t\t\t} catch( e ) {\n\
\t\t\t\t\t\t\t\t\t\t// We normalize with Webkit giving an empty statusText\n\
\t\t\t\t\t\t\t\t\t\tstatusText = \"\";\n\
\t\t\t\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t\t\t\t// Filter status for non standard behaviors\n\
\n\
\t\t\t\t\t\t\t\t\t// If the request is local and we have data: assume a success\n\
\t\t\t\t\t\t\t\t\t// (success with no data won't get notified, that's the best we\n\
\t\t\t\t\t\t\t\t\t// can do given current implementations)\n\
\t\t\t\t\t\t\t\t\tif ( !status && s.isLocal && !s.crossDomain ) {\n\
\t\t\t\t\t\t\t\t\t\tstatus = responses.text ? 200 : 404;\n\
\t\t\t\t\t\t\t\t\t// IE - #1450: sometimes returns 1223 when it should be 204\n\
\t\t\t\t\t\t\t\t\t} else if ( status === 1223 ) {\n\
\t\t\t\t\t\t\t\t\t\tstatus = 204;\n\
\t\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t} catch( firefoxAccessException ) {\n\
\t\t\t\t\t\t\tif ( !isAbort ) {\n\
\t\t\t\t\t\t\t\tcomplete( -1, firefoxAccessException );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t}\n\
\n\
\t\t\t\t\t\t// Call complete if needed\n\
\t\t\t\t\t\tif ( responses ) {\n\
\t\t\t\t\t\t\tcomplete( status, statusText, responses, responseHeaders );\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t};\n\
\n\
\t\t\t\t\tif ( !s.async ) {\n\
\t\t\t\t\t\t// if we're in sync mode we fire the callback\n\
\t\t\t\t\t\tcallback();\n\
\t\t\t\t\t} else if ( xhr.readyState === 4 ) {\n\
\t\t\t\t\t\t// (IE6 & IE7) if it's in cache and has been\n\
\t\t\t\t\t\t// retrieved directly we need to fire the callback\n\
\t\t\t\t\t\tsetTimeout( callback );\n\
\t\t\t\t\t} else {\n\
\t\t\t\t\t\thandle = ++xhrId;\n\
\t\t\t\t\t\tif ( xhrOnUnloadAbort ) {\n\
\t\t\t\t\t\t\t// Create the active xhrs callbacks list if needed\n\
\t\t\t\t\t\t\t// and attach the unload handler\n\
\t\t\t\t\t\t\tif ( !xhrCallbacks ) {\n\
\t\t\t\t\t\t\t\txhrCallbacks = {};\n\
\t\t\t\t\t\t\t\tjQuery( window ).unload( xhrOnUnloadAbort );\n\
\t\t\t\t\t\t\t}\n\
\t\t\t\t\t\t\t// Add to list of active xhrs callbacks\n\
\t\t\t\t\t\t\txhrCallbacks[ handle ] = callback;\n\
\t\t\t\t\t\t}\n\
\t\t\t\t\t\txhr.onreadystatechange = callback;\n\
\t\t\t\t\t}\n\
\t\t\t\t},\n\
\n\
\t\t\t\tabort: function() {\n\
\t\t\t\t\tif ( callback ) {\n\
\t\t\t\t\t\tcallback( undefined, true );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t};\n\
\t\t}\n\
\t});\n\
}\n\
var fxNow, timerId,\n\
\trfxtypes = /^(?:toggle|show|hide)$/,\n\
\trfxnum = new RegExp( \"^(?:([+-])=|)(\" + core_pnum + \")([a-z%]*)$\", \"i\" ),\n\
\trrun = /queueHooks$/,\n\
\tanimationPrefilters = [ defaultPrefilter ],\n\
\ttweeners = {\n\
\t\t\"*\": [function( prop, value ) {\n\
\t\t\tvar end, unit,\n\
\t\t\t\ttween = this.createTween( prop, value ),\n\
\t\t\t\tparts = rfxnum.exec( value ),\n\
\t\t\t\ttarget = tween.cur(),\n\
\t\t\t\tstart = +target || 0,\n\
\t\t\t\tscale = 1,\n\
\t\t\t\tmaxIterations = 20;\n\
\n\
\t\t\tif ( parts ) {\n\
\t\t\t\tend = +parts[2];\n\
\t\t\t\tunit = parts[3] || ( jQuery.cssNumber[ prop ] ? \"\" : \"px\" );\n\
\n\
\t\t\t\t// We need to compute starting value\n\
\t\t\t\tif ( unit !== \"px\" && start ) {\n\
\t\t\t\t\t// Iteratively approximate from a nonzero starting point\n\
\t\t\t\t\t// Prefer the current property, because this process will be trivial if it uses the same units\n\
\t\t\t\t\t// Fallback to end or a simple constant\n\
\t\t\t\t\tstart = jQuery.css( tween.elem, prop, true ) || end || 1;\n\
\n\
\t\t\t\t\tdo {\n\
\t\t\t\t\t\t// If previous iteration zeroed out, double until we get *something*\n\
\t\t\t\t\t\t// Use a string for doubling factor so we don't accidentally see scale as unchanged below\n\
\t\t\t\t\t\tscale = scale || \".5\";\n\
\n\
\t\t\t\t\t\t// Adjust and apply\n\
\t\t\t\t\t\tstart = start / scale;\n\
\t\t\t\t\t\tjQuery.style( tween.elem, prop, start + unit );\n\
\n\
\t\t\t\t\t// Update scale, tolerating zero or NaN from tween.cur()\n\
\t\t\t\t\t// And breaking the loop if scale is unchanged or perfect, or if we've just had enough\n\
\t\t\t\t\t} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );\n\
\t\t\t\t}\n\
\n\
\t\t\t\ttween.unit = unit;\n\
\t\t\t\ttween.start = start;\n\
\t\t\t\t// If a +=/-= token was provided, we're doing a relative animation\n\
\t\t\t\ttween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;\n\
\t\t\t}\n\
\t\t\treturn tween;\n\
\t\t}]\n\
\t};\n\
\n\
// Animations created synchronously will run synchronously\n\
function createFxNow() {\n\
\tsetTimeout(function() {\n\
\t\tfxNow = undefined;\n\
\t});\n\
\treturn ( fxNow = jQuery.now() );\n\
}\n\
\n\
function createTweens( animation, props ) {\n\
\tjQuery.each( props, function( prop, value ) {\n\
\t\tvar collection = ( tweeners[ prop ] || [] ).concat( tweeners[ \"*\" ] ),\n\
\t\t\tindex = 0,\n\
\t\t\tlength = collection.length;\n\
\t\tfor ( ; index < length; index++ ) {\n\
\t\t\tif ( collection[ index ].call( animation, prop, value ) ) {\n\
\n\
\t\t\t\t// we're done with this property\n\
\t\t\t\treturn;\n\
\t\t\t}\n\
\t\t}\n\
\t});\n\
}\n\
\n\
function Animation( elem, properties, options ) {\n\
\tvar result,\n\
\t\tstopped,\n\
\t\tindex = 0,\n\
\t\tlength = animationPrefilters.length,\n\
\t\tdeferred = jQuery.Deferred().always( function() {\n\
\t\t\t// don't match elem in the :animated selector\n\
\t\t\tdelete tick.elem;\n\
\t\t}),\n\
\t\ttick = function() {\n\
\t\t\tif ( stopped ) {\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\t\t\tvar currentTime = fxNow || createFxNow(),\n\
\t\t\t\tremaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),\n\
\t\t\t\t// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)\n\
\t\t\t\ttemp = remaining / animation.duration || 0,\n\
\t\t\t\tpercent = 1 - temp,\n\
\t\t\t\tindex = 0,\n\
\t\t\t\tlength = animation.tweens.length;\n\
\n\
\t\t\tfor ( ; index < length ; index++ ) {\n\
\t\t\t\tanimation.tweens[ index ].run( percent );\n\
\t\t\t}\n\
\n\
\t\t\tdeferred.notifyWith( elem, [ animation, percent, remaining ]);\n\
\n\
\t\t\tif ( percent < 1 && length ) {\n\
\t\t\t\treturn remaining;\n\
\t\t\t} else {\n\
\t\t\t\tdeferred.resolveWith( elem, [ animation ] );\n\
\t\t\t\treturn false;\n\
\t\t\t}\n\
\t\t},\n\
\t\tanimation = deferred.promise({\n\
\t\t\telem: elem,\n\
\t\t\tprops: jQuery.extend( {}, properties ),\n\
\t\t\topts: jQuery.extend( true, { specialEasing: {} }, options ),\n\
\t\t\toriginalProperties: properties,\n\
\t\t\toriginalOptions: options,\n\
\t\t\tstartTime: fxNow || createFxNow(),\n\
\t\t\tduration: options.duration,\n\
\t\t\ttweens: [],\n\
\t\t\tcreateTween: function( prop, end ) {\n\
\t\t\t\tvar tween = jQuery.Tween( elem, animation.opts, prop, end,\n\
\t\t\t\t\t\tanimation.opts.specialEasing[ prop ] || animation.opts.easing );\n\
\t\t\t\tanimation.tweens.push( tween );\n\
\t\t\t\treturn tween;\n\
\t\t\t},\n\
\t\t\tstop: function( gotoEnd ) {\n\
\t\t\t\tvar index = 0,\n\
\t\t\t\t\t// if we are going to the end, we want to run all the tweens\n\
\t\t\t\t\t// otherwise we skip this part\n\
\t\t\t\t\tlength = gotoEnd ? animation.tweens.length : 0;\n\
\t\t\t\tif ( stopped ) {\n\
\t\t\t\t\treturn this;\n\
\t\t\t\t}\n\
\t\t\t\tstopped = true;\n\
\t\t\t\tfor ( ; index < length ; index++ ) {\n\
\t\t\t\t\tanimation.tweens[ index ].run( 1 );\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// resolve when we played the last frame\n\
\t\t\t\t// otherwise, reject\n\
\t\t\t\tif ( gotoEnd ) {\n\
\t\t\t\t\tdeferred.resolveWith( elem, [ animation, gotoEnd ] );\n\
\t\t\t\t} else {\n\
\t\t\t\t\tdeferred.rejectWith( elem, [ animation, gotoEnd ] );\n\
\t\t\t\t}\n\
\t\t\t\treturn this;\n\
\t\t\t}\n\
\t\t}),\n\
\t\tprops = animation.props;\n\
\n\
\tpropFilter( props, animation.opts.specialEasing );\n\
\n\
\tfor ( ; index < length ; index++ ) {\n\
\t\tresult = animationPrefilters[ index ].call( animation, elem, props, animation.opts );\n\
\t\tif ( result ) {\n\
\t\t\treturn result;\n\
\t\t}\n\
\t}\n\
\n\
\tcreateTweens( animation, props );\n\
\n\
\tif ( jQuery.isFunction( animation.opts.start ) ) {\n\
\t\tanimation.opts.start.call( elem, animation );\n\
\t}\n\
\n\
\tjQuery.fx.timer(\n\
\t\tjQuery.extend( tick, {\n\
\t\t\telem: elem,\n\
\t\t\tanim: animation,\n\
\t\t\tqueue: animation.opts.queue\n\
\t\t})\n\
\t);\n\
\n\
\t// attach callbacks from options\n\
\treturn animation.progress( animation.opts.progress )\n\
\t\t.done( animation.opts.done, animation.opts.complete )\n\
\t\t.fail( animation.opts.fail )\n\
\t\t.always( animation.opts.always );\n\
}\n\
\n\
function propFilter( props, specialEasing ) {\n\
\tvar value, name, index, easing, hooks;\n\
\n\
\t// camelCase, specialEasing and expand cssHook pass\n\
\tfor ( index in props ) {\n\
\t\tname = jQuery.camelCase( index );\n\
\t\teasing = specialEasing[ name ];\n\
\t\tvalue = props[ index ];\n\
\t\tif ( jQuery.isArray( value ) ) {\n\
\t\t\teasing = value[ 1 ];\n\
\t\t\tvalue = props[ index ] = value[ 0 ];\n\
\t\t}\n\
\n\
\t\tif ( index !== name ) {\n\
\t\t\tprops[ name ] = value;\n\
\t\t\tdelete props[ index ];\n\
\t\t}\n\
\n\
\t\thooks = jQuery.cssHooks[ name ];\n\
\t\tif ( hooks && \"expand\" in hooks ) {\n\
\t\t\tvalue = hooks.expand( value );\n\
\t\t\tdelete props[ name ];\n\
\n\
\t\t\t// not quite $.extend, this wont overwrite keys already present.\n\
\t\t\t// also - reusing 'index' from above because we have the correct \"name\"\n\
\t\t\tfor ( index in value ) {\n\
\t\t\t\tif ( !( index in props ) ) {\n\
\t\t\t\t\tprops[ index ] = value[ index ];\n\
\t\t\t\t\tspecialEasing[ index ] = easing;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t} else {\n\
\t\t\tspecialEasing[ name ] = easing;\n\
\t\t}\n\
\t}\n\
}\n\
\n\
jQuery.Animation = jQuery.extend( Animation, {\n\
\n\
\ttweener: function( props, callback ) {\n\
\t\tif ( jQuery.isFunction( props ) ) {\n\
\t\t\tcallback = props;\n\
\t\t\tprops = [ \"*\" ];\n\
\t\t} else {\n\
\t\t\tprops = props.split(\" \");\n\
\t\t}\n\
\n\
\t\tvar prop,\n\
\t\t\tindex = 0,\n\
\t\t\tlength = props.length;\n\
\n\
\t\tfor ( ; index < length ; index++ ) {\n\
\t\t\tprop = props[ index ];\n\
\t\t\ttweeners[ prop ] = tweeners[ prop ] || [];\n\
\t\t\ttweeners[ prop ].unshift( callback );\n\
\t\t}\n\
\t},\n\
\n\
\tprefilter: function( callback, prepend ) {\n\
\t\tif ( prepend ) {\n\
\t\t\tanimationPrefilters.unshift( callback );\n\
\t\t} else {\n\
\t\t\tanimationPrefilters.push( callback );\n\
\t\t}\n\
\t}\n\
});\n\
\n\
function defaultPrefilter( elem, props, opts ) {\n\
\t/*jshint validthis:true */\n\
\tvar prop, index, length,\n\
\t\tvalue, dataShow, toggle,\n\
\t\ttween, hooks, oldfire,\n\
\t\tanim = this,\n\
\t\tstyle = elem.style,\n\
\t\torig = {},\n\
\t\thandled = [],\n\
\t\thidden = elem.nodeType && isHidden( elem );\n\
\n\
\t// handle queue: false promises\n\
\tif ( !opts.queue ) {\n\
\t\thooks = jQuery._queueHooks( elem, \"fx\" );\n\
\t\tif ( hooks.unqueued == null ) {\n\
\t\t\thooks.unqueued = 0;\n\
\t\t\toldfire = hooks.empty.fire;\n\
\t\t\thooks.empty.fire = function() {\n\
\t\t\t\tif ( !hooks.unqueued ) {\n\
\t\t\t\t\toldfire();\n\
\t\t\t\t}\n\
\t\t\t};\n\
\t\t}\n\
\t\thooks.unqueued++;\n\
\n\
\t\tanim.always(function() {\n\
\t\t\t// doing this makes sure that the complete handler will be called\n\
\t\t\t// before this completes\n\
\t\t\tanim.always(function() {\n\
\t\t\t\thooks.unqueued--;\n\
\t\t\t\tif ( !jQuery.queue( elem, \"fx\" ).length ) {\n\
\t\t\t\t\thooks.empty.fire();\n\
\t\t\t\t}\n\
\t\t\t});\n\
\t\t});\n\
\t}\n\
\n\
\t// height/width overflow pass\n\
\tif ( elem.nodeType === 1 && ( \"height\" in props || \"width\" in props ) ) {\n\
\t\t// Make sure that nothing sneaks out\n\
\t\t// Record all 3 overflow attributes because IE does not\n\
\t\t// change the overflow attribute when overflowX and\n\
\t\t// overflowY are set to the same value\n\
\t\topts.overflow = [ style.overflow, style.overflowX, style.overflowY ];\n\
\n\
\t\t// Set display property to inline-block for height/width\n\
\t\t// animations on inline elements that are having width/height animated\n\
\t\tif ( jQuery.css( elem, \"display\" ) === \"inline\" &&\n\
\t\t\t\tjQuery.css( elem, \"float\" ) === \"none\" ) {\n\
\n\
\t\t\t// inline-level elements accept inline-block;\n\
\t\t\t// block-level elements need to be inline with layout\n\
\t\t\tif ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === \"inline\" ) {\n\
\t\t\t\tstyle.display = \"inline-block\";\n\
\n\
\t\t\t} else {\n\
\t\t\t\tstyle.zoom = 1;\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
\n\
\tif ( opts.overflow ) {\n\
\t\tstyle.overflow = \"hidden\";\n\
\t\tif ( !jQuery.support.shrinkWrapBlocks ) {\n\
\t\t\tanim.always(function() {\n\
\t\t\t\tstyle.overflow = opts.overflow[ 0 ];\n\
\t\t\t\tstyle.overflowX = opts.overflow[ 1 ];\n\
\t\t\t\tstyle.overflowY = opts.overflow[ 2 ];\n\
\t\t\t});\n\
\t\t}\n\
\t}\n\
\n\
\n\
\t// show/hide pass\n\
\tfor ( index in props ) {\n\
\t\tvalue = props[ index ];\n\
\t\tif ( rfxtypes.exec( value ) ) {\n\
\t\t\tdelete props[ index ];\n\
\t\t\ttoggle = toggle || value === \"toggle\";\n\
\t\t\tif ( value === ( hidden ? \"hide\" : \"show\" ) ) {\n\
\t\t\t\tcontinue;\n\
\t\t\t}\n\
\t\t\thandled.push( index );\n\
\t\t}\n\
\t}\n\
\n\
\tlength = handled.length;\n\
\tif ( length ) {\n\
\t\tdataShow = jQuery._data( elem, \"fxshow\" ) || jQuery._data( elem, \"fxshow\", {} );\n\
\t\tif ( \"hidden\" in dataShow ) {\n\
\t\t\thidden = dataShow.hidden;\n\
\t\t}\n\
\n\
\t\t// store state if its toggle - enables .stop().toggle() to \"reverse\"\n\
\t\tif ( toggle ) {\n\
\t\t\tdataShow.hidden = !hidden;\n\
\t\t}\n\
\t\tif ( hidden ) {\n\
\t\t\tjQuery( elem ).show();\n\
\t\t} else {\n\
\t\t\tanim.done(function() {\n\
\t\t\t\tjQuery( elem ).hide();\n\
\t\t\t});\n\
\t\t}\n\
\t\tanim.done(function() {\n\
\t\t\tvar prop;\n\
\t\t\tjQuery._removeData( elem, \"fxshow\" );\n\
\t\t\tfor ( prop in orig ) {\n\
\t\t\t\tjQuery.style( elem, prop, orig[ prop ] );\n\
\t\t\t}\n\
\t\t});\n\
\t\tfor ( index = 0 ; index < length ; index++ ) {\n\
\t\t\tprop = handled[ index ];\n\
\t\t\ttween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );\n\
\t\t\torig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );\n\
\n\
\t\t\tif ( !( prop in dataShow ) ) {\n\
\t\t\t\tdataShow[ prop ] = tween.start;\n\
\t\t\t\tif ( hidden ) {\n\
\t\t\t\t\ttween.end = tween.start;\n\
\t\t\t\t\ttween.start = prop === \"width\" || prop === \"height\" ? 1 : 0;\n\
\t\t\t\t}\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
}\n\
\n\
function Tween( elem, options, prop, end, easing ) {\n\
\treturn new Tween.prototype.init( elem, options, prop, end, easing );\n\
}\n\
jQuery.Tween = Tween;\n\
\n\
Tween.prototype = {\n\
\tconstructor: Tween,\n\
\tinit: function( elem, options, prop, end, easing, unit ) {\n\
\t\tthis.elem = elem;\n\
\t\tthis.prop = prop;\n\
\t\tthis.easing = easing || \"swing\";\n\
\t\tthis.options = options;\n\
\t\tthis.start = this.now = this.cur();\n\
\t\tthis.end = end;\n\
\t\tthis.unit = unit || ( jQuery.cssNumber[ prop ] ? \"\" : \"px\" );\n\
\t},\n\
\tcur: function() {\n\
\t\tvar hooks = Tween.propHooks[ this.prop ];\n\
\n\
\t\treturn hooks && hooks.get ?\n\
\t\t\thooks.get( this ) :\n\
\t\t\tTween.propHooks._default.get( this );\n\
\t},\n\
\trun: function( percent ) {\n\
\t\tvar eased,\n\
\t\t\thooks = Tween.propHooks[ this.prop ];\n\
\n\
\t\tif ( this.options.duration ) {\n\
\t\t\tthis.pos = eased = jQuery.easing[ this.easing ](\n\
\t\t\t\tpercent, this.options.duration * percent, 0, 1, this.options.duration\n\
\t\t\t);\n\
\t\t} else {\n\
\t\t\tthis.pos = eased = percent;\n\
\t\t}\n\
\t\tthis.now = ( this.end - this.start ) * eased + this.start;\n\
\n\
\t\tif ( this.options.step ) {\n\
\t\t\tthis.options.step.call( this.elem, this.now, this );\n\
\t\t}\n\
\n\
\t\tif ( hooks && hooks.set ) {\n\
\t\t\thooks.set( this );\n\
\t\t} else {\n\
\t\t\tTween.propHooks._default.set( this );\n\
\t\t}\n\
\t\treturn this;\n\
\t}\n\
};\n\
\n\
Tween.prototype.init.prototype = Tween.prototype;\n\
\n\
Tween.propHooks = {\n\
\t_default: {\n\
\t\tget: function( tween ) {\n\
\t\t\tvar result;\n\
\n\
\t\t\tif ( tween.elem[ tween.prop ] != null &&\n\
\t\t\t\t(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {\n\
\t\t\t\treturn tween.elem[ tween.prop ];\n\
\t\t\t}\n\
\n\
\t\t\t// passing an empty string as a 3rd parameter to .css will automatically\n\
\t\t\t// attempt a parseFloat and fallback to a string if the parse fails\n\
\t\t\t// so, simple values such as \"10px\" are parsed to Float.\n\
\t\t\t// complex values such as \"rotate(1rad)\" are returned as is.\n\
\t\t\tresult = jQuery.css( tween.elem, tween.prop, \"\" );\n\
\t\t\t// Empty strings, null, undefined and \"auto\" are converted to 0.\n\
\t\t\treturn !result || result === \"auto\" ? 0 : result;\n\
\t\t},\n\
\t\tset: function( tween ) {\n\
\t\t\t// use step hook for back compat - use cssHook if its there - use .style if its\n\
\t\t\t// available and use plain properties where available\n\
\t\t\tif ( jQuery.fx.step[ tween.prop ] ) {\n\
\t\t\t\tjQuery.fx.step[ tween.prop ]( tween );\n\
\t\t\t} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {\n\
\t\t\t\tjQuery.style( tween.elem, tween.prop, tween.now + tween.unit );\n\
\t\t\t} else {\n\
\t\t\t\ttween.elem[ tween.prop ] = tween.now;\n\
\t\t\t}\n\
\t\t}\n\
\t}\n\
};\n\
\n\
// Remove in 2.0 - this supports IE8's panic based approach\n\
// to setting things on disconnected nodes\n\
\n\
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {\n\
\tset: function( tween ) {\n\
\t\tif ( tween.elem.nodeType && tween.elem.parentNode ) {\n\
\t\t\ttween.elem[ tween.prop ] = tween.now;\n\
\t\t}\n\
\t}\n\
};\n\
\n\
jQuery.each([ \"toggle\", \"show\", \"hide\" ], function( i, name ) {\n\
\tvar cssFn = jQuery.fn[ name ];\n\
\tjQuery.fn[ name ] = function( speed, easing, callback ) {\n\
\t\treturn speed == null || typeof speed === \"boolean\" ?\n\
\t\t\tcssFn.apply( this, arguments ) :\n\
\t\t\tthis.animate( genFx( name, true ), speed, easing, callback );\n\
\t};\n\
});\n\
\n\
jQuery.fn.extend({\n\
\tfadeTo: function( speed, to, easing, callback ) {\n\
\n\
\t\t// show any hidden elements after setting opacity to 0\n\
\t\treturn this.filter( isHidden ).css( \"opacity\", 0 ).show()\n\
\n\
\t\t\t// animate to the value specified\n\
\t\t\t.end().animate({ opacity: to }, speed, easing, callback );\n\
\t},\n\
\tanimate: function( prop, speed, easing, callback ) {\n\
\t\tvar empty = jQuery.isEmptyObject( prop ),\n\
\t\t\toptall = jQuery.speed( speed, easing, callback ),\n\
\t\t\tdoAnimation = function() {\n\
\t\t\t\t// Operate on a copy of prop so per-property easing won't be lost\n\
\t\t\t\tvar anim = Animation( this, jQuery.extend( {}, prop ), optall );\n\
\t\t\t\tdoAnimation.finish = function() {\n\
\t\t\t\t\tanim.stop( true );\n\
\t\t\t\t};\n\
\t\t\t\t// Empty animations, or finishing resolves immediately\n\
\t\t\t\tif ( empty || jQuery._data( this, \"finish\" ) ) {\n\
\t\t\t\t\tanim.stop( true );\n\
\t\t\t\t}\n\
\t\t\t};\n\
\t\t\tdoAnimation.finish = doAnimation;\n\
\n\
\t\treturn empty || optall.queue === false ?\n\
\t\t\tthis.each( doAnimation ) :\n\
\t\t\tthis.queue( optall.queue, doAnimation );\n\
\t},\n\
\tstop: function( type, clearQueue, gotoEnd ) {\n\
\t\tvar stopQueue = function( hooks ) {\n\
\t\t\tvar stop = hooks.stop;\n\
\t\t\tdelete hooks.stop;\n\
\t\t\tstop( gotoEnd );\n\
\t\t};\n\
\n\
\t\tif ( typeof type !== \"string\" ) {\n\
\t\t\tgotoEnd = clearQueue;\n\
\t\t\tclearQueue = type;\n\
\t\t\ttype = undefined;\n\
\t\t}\n\
\t\tif ( clearQueue && type !== false ) {\n\
\t\t\tthis.queue( type || \"fx\", [] );\n\
\t\t}\n\
\n\
\t\treturn this.each(function() {\n\
\t\t\tvar dequeue = true,\n\
\t\t\t\tindex = type != null && type + \"queueHooks\",\n\
\t\t\t\ttimers = jQuery.timers,\n\
\t\t\t\tdata = jQuery._data( this );\n\
\n\
\t\t\tif ( index ) {\n\
\t\t\t\tif ( data[ index ] && data[ index ].stop ) {\n\
\t\t\t\t\tstopQueue( data[ index ] );\n\
\t\t\t\t}\n\
\t\t\t} else {\n\
\t\t\t\tfor ( index in data ) {\n\
\t\t\t\t\tif ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {\n\
\t\t\t\t\t\tstopQueue( data[ index ] );\n\
\t\t\t\t\t}\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\tfor ( index = timers.length; index--; ) {\n\
\t\t\t\tif ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {\n\
\t\t\t\t\ttimers[ index ].anim.stop( gotoEnd );\n\
\t\t\t\t\tdequeue = false;\n\
\t\t\t\t\ttimers.splice( index, 1 );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// start the next in the queue if the last step wasn't forced\n\
\t\t\t// timers currently will call their complete callbacks, which will dequeue\n\
\t\t\t// but only if they were gotoEnd\n\
\t\t\tif ( dequeue || !gotoEnd ) {\n\
\t\t\t\tjQuery.dequeue( this, type );\n\
\t\t\t}\n\
\t\t});\n\
\t},\n\
\tfinish: function( type ) {\n\
\t\tif ( type !== false ) {\n\
\t\t\ttype = type || \"fx\";\n\
\t\t}\n\
\t\treturn this.each(function() {\n\
\t\t\tvar index,\n\
\t\t\t\tdata = jQuery._data( this ),\n\
\t\t\t\tqueue = data[ type + \"queue\" ],\n\
\t\t\t\thooks = data[ type + \"queueHooks\" ],\n\
\t\t\t\ttimers = jQuery.timers,\n\
\t\t\t\tlength = queue ? queue.length : 0;\n\
\n\
\t\t\t// enable finishing flag on private data\n\
\t\t\tdata.finish = true;\n\
\n\
\t\t\t// empty the queue first\n\
\t\t\tjQuery.queue( this, type, [] );\n\
\n\
\t\t\tif ( hooks && hooks.cur && hooks.cur.finish ) {\n\
\t\t\t\thooks.cur.finish.call( this );\n\
\t\t\t}\n\
\n\
\t\t\t// look for any active animations, and finish them\n\
\t\t\tfor ( index = timers.length; index--; ) {\n\
\t\t\t\tif ( timers[ index ].elem === this && timers[ index ].queue === type ) {\n\
\t\t\t\t\ttimers[ index ].anim.stop( true );\n\
\t\t\t\t\ttimers.splice( index, 1 );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// look for any animations in the old queue and finish them\n\
\t\t\tfor ( index = 0; index < length; index++ ) {\n\
\t\t\t\tif ( queue[ index ] && queue[ index ].finish ) {\n\
\t\t\t\t\tqueue[ index ].finish.call( this );\n\
\t\t\t\t}\n\
\t\t\t}\n\
\n\
\t\t\t// turn off finishing flag\n\
\t\t\tdelete data.finish;\n\
\t\t});\n\
\t}\n\
});\n\
\n\
// Generate parameters to create a standard animation\n\
function genFx( type, includeWidth ) {\n\
\tvar which,\n\
\t\tattrs = { height: type },\n\
\t\ti = 0;\n\
\n\
\t// if we include width, step value is 1 to do all cssExpand values,\n\
\t// if we don't include width, step value is 2 to skip over Left and Right\n\
\tincludeWidth = includeWidth? 1 : 0;\n\
\tfor( ; i < 4 ; i += 2 - includeWidth ) {\n\
\t\twhich = cssExpand[ i ];\n\
\t\tattrs[ \"margin\" + which ] = attrs[ \"padding\" + which ] = type;\n\
\t}\n\
\n\
\tif ( includeWidth ) {\n\
\t\tattrs.opacity = attrs.width = type;\n\
\t}\n\
\n\
\treturn attrs;\n\
}\n\
\n\
// Generate shortcuts for custom animations\n\
jQuery.each({\n\
\tslideDown: genFx(\"show\"),\n\
\tslideUp: genFx(\"hide\"),\n\
\tslideToggle: genFx(\"toggle\"),\n\
\tfadeIn: { opacity: \"show\" },\n\
\tfadeOut: { opacity: \"hide\" },\n\
\tfadeToggle: { opacity: \"toggle\" }\n\
}, function( name, props ) {\n\
\tjQuery.fn[ name ] = function( speed, easing, callback ) {\n\
\t\treturn this.animate( props, speed, easing, callback );\n\
\t};\n\
});\n\
\n\
jQuery.speed = function( speed, easing, fn ) {\n\
\tvar opt = speed && typeof speed === \"object\" ? jQuery.extend( {}, speed ) : {\n\
\t\tcomplete: fn || !fn && easing ||\n\
\t\t\tjQuery.isFunction( speed ) && speed,\n\
\t\tduration: speed,\n\
\t\teasing: fn && easing || easing && !jQuery.isFunction( easing ) && easing\n\
\t};\n\
\n\
\topt.duration = jQuery.fx.off ? 0 : typeof opt.duration === \"number\" ? opt.duration :\n\
\t\topt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;\n\
\n\
\t// normalize opt.queue - true/undefined/null -> \"fx\"\n\
\tif ( opt.queue == null || opt.queue === true ) {\n\
\t\topt.queue = \"fx\";\n\
\t}\n\
\n\
\t// Queueing\n\
\topt.old = opt.complete;\n\
\n\
\topt.complete = function() {\n\
\t\tif ( jQuery.isFunction( opt.old ) ) {\n\
\t\t\topt.old.call( this );\n\
\t\t}\n\
\n\
\t\tif ( opt.queue ) {\n\
\t\t\tjQuery.dequeue( this, opt.queue );\n\
\t\t}\n\
\t};\n\
\n\
\treturn opt;\n\
};\n\
\n\
jQuery.easing = {\n\
\tlinear: function( p ) {\n\
\t\treturn p;\n\
\t},\n\
\tswing: function( p ) {\n\
\t\treturn 0.5 - Math.cos( p*Math.PI ) / 2;\n\
\t}\n\
};\n\
\n\
jQuery.timers = [];\n\
jQuery.fx = Tween.prototype.init;\n\
jQuery.fx.tick = function() {\n\
\tvar timer,\n\
\t\ttimers = jQuery.timers,\n\
\t\ti = 0;\n\
\n\
\tfxNow = jQuery.now();\n\
\n\
\tfor ( ; i < timers.length; i++ ) {\n\
\t\ttimer = timers[ i ];\n\
\t\t// Checks the timer has not already been removed\n\
\t\tif ( !timer() && timers[ i ] === timer ) {\n\
\t\t\ttimers.splice( i--, 1 );\n\
\t\t}\n\
\t}\n\
\n\
\tif ( !timers.length ) {\n\
\t\tjQuery.fx.stop();\n\
\t}\n\
\tfxNow = undefined;\n\
};\n\
\n\
jQuery.fx.timer = function( timer ) {\n\
\tif ( timer() && jQuery.timers.push( timer ) ) {\n\
\t\tjQuery.fx.start();\n\
\t}\n\
};\n\
\n\
jQuery.fx.interval = 13;\n\
\n\
jQuery.fx.start = function() {\n\
\tif ( !timerId ) {\n\
\t\ttimerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );\n\
\t}\n\
};\n\
\n\
jQuery.fx.stop = function() {\n\
\tclearInterval( timerId );\n\
\ttimerId = null;\n\
};\n\
\n\
jQuery.fx.speeds = {\n\
\tslow: 600,\n\
\tfast: 200,\n\
\t// Default speed\n\
\t_default: 400\n\
};\n\
\n\
// Back Compat <1.8 extension point\n\
jQuery.fx.step = {};\n\
\n\
if ( jQuery.expr && jQuery.expr.filters ) {\n\
\tjQuery.expr.filters.animated = function( elem ) {\n\
\t\treturn jQuery.grep(jQuery.timers, function( fn ) {\n\
\t\t\treturn elem === fn.elem;\n\
\t\t}).length;\n\
\t};\n\
}\n\
jQuery.fn.offset = function( options ) {\n\
\tif ( arguments.length ) {\n\
\t\treturn options === undefined ?\n\
\t\t\tthis :\n\
\t\t\tthis.each(function( i ) {\n\
\t\t\t\tjQuery.offset.setOffset( this, options, i );\n\
\t\t\t});\n\
\t}\n\
\n\
\tvar docElem, win,\n\
\t\tbox = { top: 0, left: 0 },\n\
\t\telem = this[ 0 ],\n\
\t\tdoc = elem && elem.ownerDocument;\n\
\n\
\tif ( !doc ) {\n\
\t\treturn;\n\
\t}\n\
\n\
\tdocElem = doc.documentElement;\n\
\n\
\t// Make sure it's not a disconnected DOM node\n\
\tif ( !jQuery.contains( docElem, elem ) ) {\n\
\t\treturn box;\n\
\t}\n\
\n\
\t// If we don't have gBCR, just use 0,0 rather than error\n\
\t// BlackBerry 5, iOS 3 (original iPhone)\n\
\tif ( typeof elem.getBoundingClientRect !== core_strundefined ) {\n\
\t\tbox = elem.getBoundingClientRect();\n\
\t}\n\
\twin = getWindow( doc );\n\
\treturn {\n\
\t\ttop: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),\n\
\t\tleft: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )\n\
\t};\n\
};\n\
\n\
jQuery.offset = {\n\
\n\
\tsetOffset: function( elem, options, i ) {\n\
\t\tvar position = jQuery.css( elem, \"position\" );\n\
\n\
\t\t// set position first, in-case top/left are set even on static elem\n\
\t\tif ( position === \"static\" ) {\n\
\t\t\telem.style.position = \"relative\";\n\
\t\t}\n\
\n\
\t\tvar curElem = jQuery( elem ),\n\
\t\t\tcurOffset = curElem.offset(),\n\
\t\t\tcurCSSTop = jQuery.css( elem, \"top\" ),\n\
\t\t\tcurCSSLeft = jQuery.css( elem, \"left\" ),\n\
\t\t\tcalculatePosition = ( position === \"absolute\" || position === \"fixed\" ) && jQuery.inArray(\"auto\", [curCSSTop, curCSSLeft]) > -1,\n\
\t\t\tprops = {}, curPosition = {}, curTop, curLeft;\n\
\n\
\t\t// need to be able to calculate position if either top or left is auto and position is either absolute or fixed\n\
\t\tif ( calculatePosition ) {\n\
\t\t\tcurPosition = curElem.position();\n\
\t\t\tcurTop = curPosition.top;\n\
\t\t\tcurLeft = curPosition.left;\n\
\t\t} else {\n\
\t\t\tcurTop = parseFloat( curCSSTop ) || 0;\n\
\t\t\tcurLeft = parseFloat( curCSSLeft ) || 0;\n\
\t\t}\n\
\n\
\t\tif ( jQuery.isFunction( options ) ) {\n\
\t\t\toptions = options.call( elem, i, curOffset );\n\
\t\t}\n\
\n\
\t\tif ( options.top != null ) {\n\
\t\t\tprops.top = ( options.top - curOffset.top ) + curTop;\n\
\t\t}\n\
\t\tif ( options.left != null ) {\n\
\t\t\tprops.left = ( options.left - curOffset.left ) + curLeft;\n\
\t\t}\n\
\n\
\t\tif ( \"using\" in options ) {\n\
\t\t\toptions.using.call( elem, props );\n\
\t\t} else {\n\
\t\t\tcurElem.css( props );\n\
\t\t}\n\
\t}\n\
};\n\
\n\
\n\
jQuery.fn.extend({\n\
\n\
\tposition: function() {\n\
\t\tif ( !this[ 0 ] ) {\n\
\t\t\treturn;\n\
\t\t}\n\
\n\
\t\tvar offsetParent, offset,\n\
\t\t\tparentOffset = { top: 0, left: 0 },\n\
\t\t\telem = this[ 0 ];\n\
\n\
\t\t// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent\n\
\t\tif ( jQuery.css( elem, \"position\" ) === \"fixed\" ) {\n\
\t\t\t// we assume that getBoundingClientRect is available when computed position is fixed\n\
\t\t\toffset = elem.getBoundingClientRect();\n\
\t\t} else {\n\
\t\t\t// Get *real* offsetParent\n\
\t\t\toffsetParent = this.offsetParent();\n\
\n\
\t\t\t// Get correct offsets\n\
\t\t\toffset = this.offset();\n\
\t\t\tif ( !jQuery.nodeName( offsetParent[ 0 ], \"html\" ) ) {\n\
\t\t\t\tparentOffset = offsetParent.offset();\n\
\t\t\t}\n\
\n\
\t\t\t// Add offsetParent borders\n\
\t\t\tparentOffset.top  += jQuery.css( offsetParent[ 0 ], \"borderTopWidth\", true );\n\
\t\t\tparentOffset.left += jQuery.css( offsetParent[ 0 ], \"borderLeftWidth\", true );\n\
\t\t}\n\
\n\
\t\t// Subtract parent offsets and element margins\n\
\t\t// note: when an element has margin: auto the offsetLeft and marginLeft\n\
\t\t// are the same in Safari causing offset.left to incorrectly be 0\n\
\t\treturn {\n\
\t\t\ttop:  offset.top  - parentOffset.top - jQuery.css( elem, \"marginTop\", true ),\n\
\t\t\tleft: offset.left - parentOffset.left - jQuery.css( elem, \"marginLeft\", true)\n\
\t\t};\n\
\t},\n\
\n\
\toffsetParent: function() {\n\
\t\treturn this.map(function() {\n\
\t\t\tvar offsetParent = this.offsetParent || document.documentElement;\n\
\t\t\twhile ( offsetParent && ( !jQuery.nodeName( offsetParent, \"html\" ) && jQuery.css( offsetParent, \"position\") === \"static\" ) ) {\n\
\t\t\t\toffsetParent = offsetParent.offsetParent;\n\
\t\t\t}\n\
\t\t\treturn offsetParent || document.documentElement;\n\
\t\t});\n\
\t}\n\
});\n\
\n\
\n\
// Create scrollLeft and scrollTop methods\n\
jQuery.each( {scrollLeft: \"pageXOffset\", scrollTop: \"pageYOffset\"}, function( method, prop ) {\n\
\tvar top = /Y/.test( prop );\n\
\n\
\tjQuery.fn[ method ] = function( val ) {\n\
\t\treturn jQuery.access( this, function( elem, method, val ) {\n\
\t\t\tvar win = getWindow( elem );\n\
\n\
\t\t\tif ( val === undefined ) {\n\
\t\t\t\treturn win ? (prop in win) ? win[ prop ] :\n\
\t\t\t\t\twin.document.documentElement[ method ] :\n\
\t\t\t\t\telem[ method ];\n\
\t\t\t}\n\
\n\
\t\t\tif ( win ) {\n\
\t\t\t\twin.scrollTo(\n\
\t\t\t\t\t!top ? val : jQuery( win ).scrollLeft(),\n\
\t\t\t\t\ttop ? val : jQuery( win ).scrollTop()\n\
\t\t\t\t);\n\
\n\
\t\t\t} else {\n\
\t\t\t\telem[ method ] = val;\n\
\t\t\t}\n\
\t\t}, method, val, arguments.length, null );\n\
\t};\n\
});\n\
\n\
function getWindow( elem ) {\n\
\treturn jQuery.isWindow( elem ) ?\n\
\t\telem :\n\
\t\telem.nodeType === 9 ?\n\
\t\t\telem.defaultView || elem.parentWindow :\n\
\t\t\tfalse;\n\
}\n\
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods\n\
jQuery.each( { Height: \"height\", Width: \"width\" }, function( name, type ) {\n\
\tjQuery.each( { padding: \"inner\" + name, content: type, \"\": \"outer\" + name }, function( defaultExtra, funcName ) {\n\
\t\t// margin is only for outerHeight, outerWidth\n\
\t\tjQuery.fn[ funcName ] = function( margin, value ) {\n\
\t\t\tvar chainable = arguments.length && ( defaultExtra || typeof margin !== \"boolean\" ),\n\
\t\t\t\textra = defaultExtra || ( margin === true || value === true ? \"margin\" : \"border\" );\n\
\n\
\t\t\treturn jQuery.access( this, function( elem, type, value ) {\n\
\t\t\t\tvar doc;\n\
\n\
\t\t\t\tif ( jQuery.isWindow( elem ) ) {\n\
\t\t\t\t\t// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there\n\
\t\t\t\t\t// isn't a whole lot we can do. See pull request at this URL for discussion:\n\
\t\t\t\t\t// https://github.com/jquery/jquery/pull/764\n\
\t\t\t\t\treturn elem.document.documentElement[ \"client\" + name ];\n\
\t\t\t\t}\n\
\n\
\t\t\t\t// Get document width or height\n\
\t\t\t\tif ( elem.nodeType === 9 ) {\n\
\t\t\t\t\tdoc = elem.documentElement;\n\
\n\
\t\t\t\t\t// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest\n\
\t\t\t\t\t// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.\n\
\t\t\t\t\treturn Math.max(\n\
\t\t\t\t\t\telem.body[ \"scroll\" + name ], doc[ \"scroll\" + name ],\n\
\t\t\t\t\t\telem.body[ \"offset\" + name ], doc[ \"offset\" + name ],\n\
\t\t\t\t\t\tdoc[ \"client\" + name ]\n\
\t\t\t\t\t);\n\
\t\t\t\t}\n\
\n\
\t\t\t\treturn value === undefined ?\n\
\t\t\t\t\t// Get width or height on the element, requesting but not forcing parseFloat\n\
\t\t\t\t\tjQuery.css( elem, type, extra ) :\n\
\n\
\t\t\t\t\t// Set width or height on the element\n\
\t\t\t\t\tjQuery.style( elem, type, value, extra );\n\
\t\t\t}, type, chainable ? margin : undefined, chainable, null );\n\
\t\t};\n\
\t});\n\
});\n\
// Limit scope pollution from any deprecated API\n\
// (function() {\n\
\n\
// })();\n\
\n\
// Expose for component\n\
module.exports = jQuery;\n\
\n\
// Expose jQuery to the global object\n\
//window.jQuery = window.$ = jQuery;\n\
\n\
// Expose jQuery as an AMD module, but only for AMD loaders that\n\
// understand the issues with loading multiple versions of jQuery\n\
// in a page that all might call define(). The loader will indicate\n\
// they have special allowances for multiple jQuery versions by\n\
// specifying define.amd.jQuery = true. Register as a named module,\n\
// since jQuery can be concatenated with other files that may use define,\n\
// but not use a proper concatenation script that understands anonymous\n\
// AMD modules. A named AMD is safest and most robust way to register.\n\
// Lowercase jquery is used because AMD module names are derived from\n\
// file names, and jQuery is normally delivered in a lowercase file name.\n\
// Do this after creating the global so that if an AMD module wants to call\n\
// noConflict to hide this version of jQuery, it will work.\n\
if ( typeof define === \"function\" && define.amd && define.amd.jQuery ) {\n\
\tdefine( \"jquery\", [], function () { return jQuery; } );\n\
}\n\
\n\
})( window );\n\
\n\
//# sourceURL=components/component/jquery/1.9.1/index.js"
));

require.modules["component-jquery"] = require.modules["component~jquery@1.9.1"];
require.modules["component~jquery"] = require.modules["component~jquery@1.9.1"];
require.modules["jquery"] = require.modules["component~jquery@1.9.1"];


require.register("indefinido~advisable@master", Function("exports, module",
"module.exports = require(\"indefinido~advisable@master/lib/advisable.js\");\n\
\n\
//# sourceURL=components/indefinido/advisable/master/index.js"
));

require.register("indefinido~advisable@master/lib/advisable.js", Function("exports, module",
"var $, advice, mixin;\n\
\n\
$ = require(\"component~jquery@1.9.1\");\n\
\n\
advice = {\n\
  around: function(base, wrapped) {\n\
    return function() {\n\
      var args;\n\
\n\
      args = $.makeArray(arguments);\n\
      return wrapped.apply(this, [$.proxy(base, this)].concat(args));\n\
    };\n\
  },\n\
  before: function(base, before) {\n\
    return this.around(base, function() {\n\
      var args, orig;\n\
\n\
      args = $.makeArray(arguments);\n\
      orig = args.shift();\n\
      before.apply(this, args);\n\
      return orig.apply(this, args);\n\
    });\n\
  },\n\
  after: function(base, after) {\n\
    return this.around(base, function() {\n\
      var args, orig, res;\n\
\n\
      args = $.makeArray(arguments);\n\
      orig = args.shift();\n\
      res = orig.apply(this, args);\n\
      after.apply(this, args);\n\
      return res;\n\
    });\n\
  }\n\
};\n\
\n\
mixin = {\n\
  before: function(method, advicer) {\n\
    if (typeof this[method] === 'function') {\n\
      return this[method] = advice.before(this[method], advicer);\n\
    }\n\
    throw new TypeError(\"Can only advice functions, attribute \" + method + \" of \" + this + \" is of type \" + (typeof this[method]));\n\
  },\n\
  after: function(method, advicer) {\n\
    if (typeof this[method] === 'function') {\n\
      return this[method] = advice.after(this[method], advicer);\n\
    }\n\
    throw new TypeError(\"Can only advice functions, attribute \" + method + \" of \" + this + \" is of type \" + (typeof this[method]));\n\
  },\n\
  around: function(method, advicer) {\n\
    if (typeof this[method] === 'function') {\n\
      return this[method] = advice.around(this[method], advicer);\n\
    }\n\
    throw new TypeError(\"Can only advice functions, attribute \" + method + \" of \" + this + \" is of type \" + (typeof this[method]));\n\
  }\n\
};\n\
\n\
exports.mixin = function(object) {\n\
  return $.extend(object, mixin);\n\
};\n\
\n\
//# sourceURL=components/indefinido/advisable/master/lib/advisable.js"
));

require.modules["indefinido-advisable"] = require.modules["indefinido~advisable@master"];
require.modules["indefinido~advisable"] = require.modules["indefinido~advisable@master"];
require.modules["advisable"] = require.modules["indefinido~advisable@master"];


require.register("chaijs~assertion-error@1.0.0", Function("exports, module",
"/*!\n\
 * assertion-error\n\
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Return a function that will copy properties from\n\
 * one object to another excluding any originally\n\
 * listed. Returned function will create a new `{}`.\n\
 *\n\
 * @param {String} excluded properties ...\n\
 * @return {Function}\n\
 */\n\
\n\
function exclude () {\n\
  var excludes = [].slice.call(arguments);\n\
\n\
  function excludeProps (res, obj) {\n\
    Object.keys(obj).forEach(function (key) {\n\
      if (!~excludes.indexOf(key)) res[key] = obj[key];\n\
    });\n\
  }\n\
\n\
  return function extendExclude () {\n\
    var args = [].slice.call(arguments)\n\
      , i = 0\n\
      , res = {};\n\
\n\
    for (; i < args.length; i++) {\n\
      excludeProps(res, args[i]);\n\
    }\n\
\n\
    return res;\n\
  };\n\
};\n\
\n\
/*!\n\
 * Primary Exports\n\
 */\n\
\n\
module.exports = AssertionError;\n\
\n\
/**\n\
 * ### AssertionError\n\
 *\n\
 * An extension of the JavaScript `Error` constructor for\n\
 * assertion and validation scenarios.\n\
 *\n\
 * @param {String} message\n\
 * @param {Object} properties to include (optional)\n\
 * @param {callee} start stack function (optional)\n\
 */\n\
\n\
function AssertionError (message, _props, ssf) {\n\
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')\n\
    , props = extend(_props || {});\n\
\n\
  // default values\n\
  this.message = message || 'Unspecified AssertionError';\n\
  this.showDiff = false;\n\
\n\
  // copy from properties\n\
  for (var key in props) {\n\
    this[key] = props[key];\n\
  }\n\
\n\
  // capture stack trace\n\
  ssf = ssf || arguments.callee;\n\
  if (ssf && Error.captureStackTrace) {\n\
    Error.captureStackTrace(this, ssf);\n\
  }\n\
}\n\
\n\
/*!\n\
 * Inherit from Error.prototype\n\
 */\n\
\n\
AssertionError.prototype = Object.create(Error.prototype);\n\
\n\
/*!\n\
 * Statically set name\n\
 */\n\
\n\
AssertionError.prototype.name = 'AssertionError';\n\
\n\
/*!\n\
 * Ensure correct constructor\n\
 */\n\
\n\
AssertionError.prototype.constructor = AssertionError;\n\
\n\
/**\n\
 * Allow errors to be converted to JSON for static transfer.\n\
 *\n\
 * @param {Boolean} include stack (default: `true`)\n\
 * @return {Object} object that can be `JSON.stringify`\n\
 */\n\
\n\
AssertionError.prototype.toJSON = function (stack) {\n\
  var extend = exclude('constructor', 'toJSON', 'stack')\n\
    , props = extend({ name: this.name }, this);\n\
\n\
  // include stack if exists and not turned off\n\
  if (false !== stack && this.stack) {\n\
    props.stack = this.stack;\n\
  }\n\
\n\
  return props;\n\
};\n\
\n\
//# sourceURL=components/chaijs/assertion-error/1.0.0/index.js"
));

require.modules["chaijs-assertion-error"] = require.modules["chaijs~assertion-error@1.0.0"];
require.modules["chaijs~assertion-error"] = require.modules["chaijs~assertion-error@1.0.0"];
require.modules["assertion-error"] = require.modules["chaijs~assertion-error@1.0.0"];


require.register("chaijs~type-detect@0.1.1", Function("exports, module",
"/*!\n\
 * type-detect\n\
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Primary Exports\n\
 */\n\
\n\
var exports = module.exports = getType;\n\
\n\
/*!\n\
 * Detectable javascript natives\n\
 */\n\
\n\
var natives = {\n\
    '[object Array]': 'array'\n\
  , '[object RegExp]': 'regexp'\n\
  , '[object Function]': 'function'\n\
  , '[object Arguments]': 'arguments'\n\
  , '[object Date]': 'date'\n\
};\n\
\n\
/**\n\
 * ### typeOf (obj)\n\
 *\n\
 * Use several different techniques to determine\n\
 * the type of object being tested.\n\
 *\n\
 *\n\
 * @param {Mixed} object\n\
 * @return {String} object type\n\
 * @api public\n\
 */\n\
\n\
function getType (obj) {\n\
  var str = Object.prototype.toString.call(obj);\n\
  if (natives[str]) return natives[str];\n\
  if (obj === null) return 'null';\n\
  if (obj === undefined) return 'undefined';\n\
  if (obj === Object(obj)) return 'object';\n\
  return typeof obj;\n\
}\n\
\n\
exports.Library = Library;\n\
\n\
/**\n\
 * ### Library\n\
 *\n\
 * Create a repository for custom type detection.\n\
 *\n\
 * ```js\n\
 * var lib = new type.Library;\n\
 * ```\n\
 *\n\
 */\n\
\n\
function Library () {\n\
  this.tests = {};\n\
}\n\
\n\
/**\n\
 * #### .of (obj)\n\
 *\n\
 * Expose replacement `typeof` detection to the library.\n\
 *\n\
 * ```js\n\
 * if ('string' === lib.of('hello world')) {\n\
 *   // ...\n\
 * }\n\
 * ```\n\
 *\n\
 * @param {Mixed} object to test\n\
 * @return {String} type\n\
 */\n\
\n\
Library.prototype.of = getType;\n\
\n\
/**\n\
 * #### .define (type, test)\n\
 *\n\
 * Add a test to for the `.test()` assertion.\n\
 *\n\
 * Can be defined as a regular expression:\n\
 *\n\
 * ```js\n\
 * lib.define('int', /^[0-9]+$/);\n\
 * ```\n\
 *\n\
 * ... or as a function:\n\
 *\n\
 * ```js\n\
 * lib.define('bln', function (obj) {\n\
 *   if ('boolean' === lib.of(obj)) return true;\n\
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];\n\
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();\n\
 *   return !! ~blns.indexOf(obj);\n\
 * });\n\
 * ```\n\
 *\n\
 * @param {String} type\n\
 * @param {RegExp|Function} test\n\
 * @api public\n\
 */\n\
\n\
Library.prototype.define = function (type, test) {\n\
  if (arguments.length === 1) return this.tests[type];\n\
  this.tests[type] = test;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * #### .test (obj, test)\n\
 *\n\
 * Assert that an object is of type. Will first\n\
 * check natives, and if that does not pass it will\n\
 * use the user defined custom tests.\n\
 *\n\
 * ```js\n\
 * assert(lib.test('1', 'int'));\n\
 * assert(lib.test('yes', 'bln'));\n\
 * ```\n\
 *\n\
 * @param {Mixed} object\n\
 * @param {String} type\n\
 * @return {Boolean} result\n\
 * @api public\n\
 */\n\
\n\
Library.prototype.test = function (obj, type) {\n\
  if (type === getType(obj)) return true;\n\
  var test = this.tests[type];\n\
\n\
  if (test && 'regexp' === getType(test)) {\n\
    return test.test(obj);\n\
  } else if (test && 'function' === getType(test)) {\n\
    return test(obj);\n\
  } else {\n\
    throw new ReferenceError('Type test \"' + type + '\" not defined or invalid.');\n\
  }\n\
};\n\
\n\
//# sourceURL=components/chaijs/type-detect/0.1.1/lib/type.js"
));

require.modules["chaijs-type-detect"] = require.modules["chaijs~type-detect@0.1.1"];
require.modules["chaijs~type-detect"] = require.modules["chaijs~type-detect@0.1.1"];
require.modules["type-detect"] = require.modules["chaijs~type-detect@0.1.1"];


require.register("chaijs~deep-eql@0.1.3", Function("exports, module",
"/*!\n\
 * deep-eql\n\
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Module dependencies\n\
 */\n\
\n\
var type = require(\"chaijs~type-detect@0.1.1\");\n\
\n\
/*!\n\
 * Buffer.isBuffer browser shim\n\
 */\n\
\n\
var Buffer;\n\
try { Buffer = require(\"buffer\").Buffer; }\n\
catch(ex) {\n\
  Buffer = {};\n\
  Buffer.isBuffer = function() { return false; }\n\
}\n\
\n\
/*!\n\
 * Primary Export\n\
 */\n\
\n\
module.exports = deepEqual;\n\
\n\
/**\n\
 * Assert super-strict (egal) equality between\n\
 * two objects of any type.\n\
 *\n\
 * @param {Mixed} a\n\
 * @param {Mixed} b\n\
 * @param {Array} memoised (optional)\n\
 * @return {Boolean} equal match\n\
 */\n\
\n\
function deepEqual(a, b, m) {\n\
  if (sameValue(a, b)) {\n\
    return true;\n\
  } else if ('date' === type(a)) {\n\
    return dateEqual(a, b);\n\
  } else if ('regexp' === type(a)) {\n\
    return regexpEqual(a, b);\n\
  } else if (Buffer.isBuffer(a)) {\n\
    return bufferEqual(a, b);\n\
  } else if ('arguments' === type(a)) {\n\
    return argumentsEqual(a, b, m);\n\
  } else if (!typeEqual(a, b)) {\n\
    return false;\n\
  } else if (('object' !== type(a) && 'object' !== type(b))\n\
  && ('array' !== type(a) && 'array' !== type(b))) {\n\
    return sameValue(a, b);\n\
  } else {\n\
    return objectEqual(a, b, m);\n\
  }\n\
}\n\
\n\
/*!\n\
 * Strict (egal) equality test. Ensures that NaN always\n\
 * equals NaN and `-0` does not equal `+0`.\n\
 *\n\
 * @param {Mixed} a\n\
 * @param {Mixed} b\n\
 * @return {Boolean} equal match\n\
 */\n\
\n\
function sameValue(a, b) {\n\
  if (a === b) return a !== 0 || 1 / a === 1 / b;\n\
  return a !== a && b !== b;\n\
}\n\
\n\
/*!\n\
 * Compare the types of two given objects and\n\
 * return if they are equal. Note that an Array\n\
 * has a type of `array` (not `object`) and arguments\n\
 * have a type of `arguments` (not `array`/`object`).\n\
 *\n\
 * @param {Mixed} a\n\
 * @param {Mixed} b\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function typeEqual(a, b) {\n\
  return type(a) === type(b);\n\
}\n\
\n\
/*!\n\
 * Compare two Date objects by asserting that\n\
 * the time values are equal using `saveValue`.\n\
 *\n\
 * @param {Date} a\n\
 * @param {Date} b\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function dateEqual(a, b) {\n\
  if ('date' !== type(b)) return false;\n\
  return sameValue(a.getTime(), b.getTime());\n\
}\n\
\n\
/*!\n\
 * Compare two regular expressions by converting them\n\
 * to string and checking for `sameValue`.\n\
 *\n\
 * @param {RegExp} a\n\
 * @param {RegExp} b\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function regexpEqual(a, b) {\n\
  if ('regexp' !== type(b)) return false;\n\
  return sameValue(a.toString(), b.toString());\n\
}\n\
\n\
/*!\n\
 * Assert deep equality of two `arguments` objects.\n\
 * Unfortunately, these must be sliced to arrays\n\
 * prior to test to ensure no bad behavior.\n\
 *\n\
 * @param {Arguments} a\n\
 * @param {Arguments} b\n\
 * @param {Array} memoize (optional)\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function argumentsEqual(a, b, m) {\n\
  if ('arguments' !== type(b)) return false;\n\
  a = [].slice.call(a);\n\
  b = [].slice.call(b);\n\
  return deepEqual(a, b, m);\n\
}\n\
\n\
/*!\n\
 * Get enumerable properties of a given object.\n\
 *\n\
 * @param {Object} a\n\
 * @return {Array} property names\n\
 */\n\
\n\
function enumerable(a) {\n\
  var res = [];\n\
  for (var key in a) res.push(key);\n\
  return res;\n\
}\n\
\n\
/*!\n\
 * Simple equality for flat iterable objects\n\
 * such as Arrays or Node.js buffers.\n\
 *\n\
 * @param {Iterable} a\n\
 * @param {Iterable} b\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function iterableEqual(a, b) {\n\
  if (a.length !==  b.length) return false;\n\
\n\
  var i = 0;\n\
  var match = true;\n\
\n\
  for (; i < a.length; i++) {\n\
    if (a[i] !== b[i]) {\n\
      match = false;\n\
      break;\n\
    }\n\
  }\n\
\n\
  return match;\n\
}\n\
\n\
/*!\n\
 * Extension to `iterableEqual` specifically\n\
 * for Node.js Buffers.\n\
 *\n\
 * @param {Buffer} a\n\
 * @param {Mixed} b\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function bufferEqual(a, b) {\n\
  if (!Buffer.isBuffer(b)) return false;\n\
  return iterableEqual(a, b);\n\
}\n\
\n\
/*!\n\
 * Block for `objectEqual` ensuring non-existing\n\
 * values don't get in.\n\
 *\n\
 * @param {Mixed} object\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function isValue(a) {\n\
  return a !== null && a !== undefined;\n\
}\n\
\n\
/*!\n\
 * Recursively check the equality of two objects.\n\
 * Once basic sameness has been established it will\n\
 * defer to `deepEqual` for each enumerable key\n\
 * in the object.\n\
 *\n\
 * @param {Mixed} a\n\
 * @param {Mixed} b\n\
 * @return {Boolean} result\n\
 */\n\
\n\
function objectEqual(a, b, m) {\n\
  if (!isValue(a) || !isValue(b)) {\n\
    return false;\n\
  }\n\
\n\
  if (a.prototype !== b.prototype) {\n\
    return false;\n\
  }\n\
\n\
  var i;\n\
  if (m) {\n\
    for (i = 0; i < m.length; i++) {\n\
      if ((m[i][0] === a && m[i][1] === b)\n\
      ||  (m[i][0] === b && m[i][1] === a)) {\n\
        return true;\n\
      }\n\
    }\n\
  } else {\n\
    m = [];\n\
  }\n\
\n\
  try {\n\
    var ka = enumerable(a);\n\
    var kb = enumerable(b);\n\
  } catch (ex) {\n\
    return false;\n\
  }\n\
\n\
  ka.sort();\n\
  kb.sort();\n\
\n\
  if (!iterableEqual(ka, kb)) {\n\
    return false;\n\
  }\n\
\n\
  m.push([ a, b ]);\n\
\n\
  var key;\n\
  for (i = ka.length - 1; i >= 0; i--) {\n\
    key = ka[i];\n\
    if (!deepEqual(a[key], b[key], m)) {\n\
      return false;\n\
    }\n\
  }\n\
\n\
  return true;\n\
}\n\
\n\
//# sourceURL=components/chaijs/deep-eql/0.1.3/lib/eql.js"
));

require.modules["chaijs-deep-eql"] = require.modules["chaijs~deep-eql@0.1.3"];
require.modules["chaijs~deep-eql"] = require.modules["chaijs~deep-eql@0.1.3"];
require.modules["deep-eql"] = require.modules["chaijs~deep-eql@0.1.3"];


require.register("chaijs~chai@1.9.1", Function("exports, module",
"module.exports = require(\"chaijs~chai@1.9.1/lib/chai.js\");\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/index.js"
));

require.register("chaijs~chai@1.9.1/lib/chai.js", Function("exports, module",
"/*!\n\
 * chai\n\
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
var used = []\n\
  , exports = module.exports = {};\n\
\n\
/*!\n\
 * Chai version\n\
 */\n\
\n\
exports.version = '1.9.1';\n\
\n\
/*!\n\
 * Assertion Error\n\
 */\n\
\n\
exports.AssertionError = require(\"chaijs~assertion-error@1.0.0\");\n\
\n\
/*!\n\
 * Utils for plugins (not exported)\n\
 */\n\
\n\
var util = require(\"chaijs~chai@1.9.1/lib/chai/utils/index.js\");\n\
\n\
/**\n\
 * # .use(function)\n\
 *\n\
 * Provides a way to extend the internals of Chai\n\
 *\n\
 * @param {Function}\n\
 * @returns {this} for chaining\n\
 * @api public\n\
 */\n\
\n\
exports.use = function (fn) {\n\
  if (!~used.indexOf(fn)) {\n\
    fn(this, util);\n\
    used.push(fn);\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/*!\n\
 * Configuration\n\
 */\n\
\n\
var config = require(\"chaijs~chai@1.9.1/lib/chai/config.js\");\n\
exports.config = config;\n\
\n\
/*!\n\
 * Primary `Assertion` prototype\n\
 */\n\
\n\
var assertion = require(\"chaijs~chai@1.9.1/lib/chai/assertion.js\");\n\
exports.use(assertion);\n\
\n\
/*!\n\
 * Core Assertions\n\
 */\n\
\n\
var core = require(\"chaijs~chai@1.9.1/lib/chai/core/assertions.js\");\n\
exports.use(core);\n\
\n\
/*!\n\
 * Expect interface\n\
 */\n\
\n\
var expect = require(\"chaijs~chai@1.9.1/lib/chai/interface/expect.js\");\n\
exports.use(expect);\n\
\n\
/*!\n\
 * Should interface\n\
 */\n\
\n\
var should = require(\"chaijs~chai@1.9.1/lib/chai/interface/should.js\");\n\
exports.use(should);\n\
\n\
/*!\n\
 * Assert interface\n\
 */\n\
\n\
var assert = require(\"chaijs~chai@1.9.1/lib/chai/interface/assert.js\");\n\
exports.use(assert);\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/assertion.js", Function("exports, module",
"/*!\n\
 * chai\n\
 * http://chaijs.com\n\
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
var config = require(\"chaijs~chai@1.9.1/lib/chai/config.js\");\n\
\n\
module.exports = function (_chai, util) {\n\
  /*!\n\
   * Module dependencies.\n\
   */\n\
\n\
  var AssertionError = _chai.AssertionError\n\
    , flag = util.flag;\n\
\n\
  /*!\n\
   * Module export.\n\
   */\n\
\n\
  _chai.Assertion = Assertion;\n\
\n\
  /*!\n\
   * Assertion Constructor\n\
   *\n\
   * Creates object for chaining.\n\
   *\n\
   * @api private\n\
   */\n\
\n\
  function Assertion (obj, msg, stack) {\n\
    flag(this, 'ssfi', stack || arguments.callee);\n\
    flag(this, 'object', obj);\n\
    flag(this, 'message', msg);\n\
  }\n\
\n\
  Object.defineProperty(Assertion, 'includeStack', {\n\
    get: function() {\n\
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');\n\
      return config.includeStack;\n\
    },\n\
    set: function(value) {\n\
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');\n\
      config.includeStack = value;\n\
    }\n\
  });\n\
\n\
  Object.defineProperty(Assertion, 'showDiff', {\n\
    get: function() {\n\
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');\n\
      return config.showDiff;\n\
    },\n\
    set: function(value) {\n\
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');\n\
      config.showDiff = value;\n\
    }\n\
  });\n\
\n\
  Assertion.addProperty = function (name, fn) {\n\
    util.addProperty(this.prototype, name, fn);\n\
  };\n\
\n\
  Assertion.addMethod = function (name, fn) {\n\
    util.addMethod(this.prototype, name, fn);\n\
  };\n\
\n\
  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {\n\
    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);\n\
  };\n\
\n\
  Assertion.overwriteProperty = function (name, fn) {\n\
    util.overwriteProperty(this.prototype, name, fn);\n\
  };\n\
\n\
  Assertion.overwriteMethod = function (name, fn) {\n\
    util.overwriteMethod(this.prototype, name, fn);\n\
  };\n\
\n\
  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {\n\
    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);\n\
  };\n\
\n\
  /*!\n\
   * ### .assert(expression, message, negateMessage, expected, actual)\n\
   *\n\
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.\n\
   *\n\
   * @name assert\n\
   * @param {Philosophical} expression to be tested\n\
   * @param {String} message to display if fails\n\
   * @param {String} negatedMessage to display if negated expression fails\n\
   * @param {Mixed} expected value (remember to check for negation)\n\
   * @param {Mixed} actual (optional) will default to `this.obj`\n\
   * @api private\n\
   */\n\
\n\
  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {\n\
    var ok = util.test(this, arguments);\n\
    if (true !== showDiff) showDiff = false;\n\
    if (true !== config.showDiff) showDiff = false;\n\
\n\
    if (!ok) {\n\
      var msg = util.getMessage(this, arguments)\n\
        , actual = util.getActual(this, arguments);\n\
      throw new AssertionError(msg, {\n\
          actual: actual\n\
        , expected: expected\n\
        , showDiff: showDiff\n\
      }, (config.includeStack) ? this.assert : flag(this, 'ssfi'));\n\
    }\n\
  };\n\
\n\
  /*!\n\
   * ### ._obj\n\
   *\n\
   * Quick reference to stored `actual` value for plugin developers.\n\
   *\n\
   * @api private\n\
   */\n\
\n\
  Object.defineProperty(Assertion.prototype, '_obj',\n\
    { get: function () {\n\
        return flag(this, 'object');\n\
      }\n\
    , set: function (val) {\n\
        flag(this, 'object', val);\n\
      }\n\
  });\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/assertion.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/config.js", Function("exports, module",
"module.exports = {\n\
\n\
  /**\n\
   * ### config.includeStack\n\
   *\n\
   * User configurable property, influences whether stack trace\n\
   * is included in Assertion error message. Default of false\n\
   * suppresses stack trace in the error message.\n\
   *\n\
   *     chai.config.includeStack = true;  // enable stack on error\n\
   *\n\
   * @param {Boolean}\n\
   * @api public\n\
   */\n\
\n\
   includeStack: false,\n\
\n\
  /**\n\
   * ### config.showDiff\n\
   *\n\
   * User configurable property, influences whether or not\n\
   * the `showDiff` flag should be included in the thrown\n\
   * AssertionErrors. `false` will always be `false`; `true`\n\
   * will be true when the assertion has requested a diff\n\
   * be shown.\n\
   *\n\
   * @param {Boolean}\n\
   * @api public\n\
   */\n\
\n\
  showDiff: true,\n\
\n\
  /**\n\
   * ### config.truncateThreshold\n\
   *\n\
   * User configurable property, sets length threshold for actual and\n\
   * expected values in assertion errors. If this threshold is exceeded,\n\
   * the value is truncated.\n\
   *\n\
   * Set it to zero if you want to disable truncating altogether.\n\
   *\n\
   *     chai.config.truncateThreshold = 0;  // disable truncating\n\
   *\n\
   * @param {Number}\n\
   * @api public\n\
   */\n\
\n\
  truncateThreshold: 40\n\
\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/config.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/core/assertions.js", Function("exports, module",
"/*!\n\
 * chai\n\
 * http://chaijs.com\n\
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
module.exports = function (chai, _) {\n\
  var Assertion = chai.Assertion\n\
    , toString = Object.prototype.toString\n\
    , flag = _.flag;\n\
\n\
  /**\n\
   * ### Language Chains\n\
   *\n\
   * The following are provided as chainable getters to\n\
   * improve the readability of your assertions. They\n\
   * do not provide testing capabilities unless they\n\
   * have been overwritten by a plugin.\n\
   *\n\
   * **Chains**\n\
   *\n\
   * - to\n\
   * - be\n\
   * - been\n\
   * - is\n\
   * - that\n\
   * - and\n\
   * - has\n\
   * - have\n\
   * - with\n\
   * - at\n\
   * - of\n\
   * - same\n\
   *\n\
   * @name language chains\n\
   * @api public\n\
   */\n\
\n\
  [ 'to', 'be', 'been'\n\
  , 'is', 'and', 'has', 'have'\n\
  , 'with', 'that', 'at'\n\
  , 'of', 'same' ].forEach(function (chain) {\n\
    Assertion.addProperty(chain, function () {\n\
      return this;\n\
    });\n\
  });\n\
\n\
  /**\n\
   * ### .not\n\
   *\n\
   * Negates any of assertions following in the chain.\n\
   *\n\
   *     expect(foo).to.not.equal('bar');\n\
   *     expect(goodFn).to.not.throw(Error);\n\
   *     expect({ foo: 'baz' }).to.have.property('foo')\n\
   *       .and.not.equal('bar');\n\
   *\n\
   * @name not\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('not', function () {\n\
    flag(this, 'negate', true);\n\
  });\n\
\n\
  /**\n\
   * ### .deep\n\
   *\n\
   * Sets the `deep` flag, later used by the `equal` and\n\
   * `property` assertions.\n\
   *\n\
   *     expect(foo).to.deep.equal({ bar: 'baz' });\n\
   *     expect({ foo: { bar: { baz: 'quux' } } })\n\
   *       .to.have.deep.property('foo.bar.baz', 'quux');\n\
   *\n\
   * @name deep\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('deep', function () {\n\
    flag(this, 'deep', true);\n\
  });\n\
\n\
  /**\n\
   * ### .a(type)\n\
   *\n\
   * The `a` and `an` assertions are aliases that can be\n\
   * used either as language chains or to assert a value's\n\
   * type.\n\
   *\n\
   *     // typeof\n\
   *     expect('test').to.be.a('string');\n\
   *     expect({ foo: 'bar' }).to.be.an('object');\n\
   *     expect(null).to.be.a('null');\n\
   *     expect(undefined).to.be.an('undefined');\n\
   *\n\
   *     // language chain\n\
   *     expect(foo).to.be.an.instanceof(Foo);\n\
   *\n\
   * @name a\n\
   * @alias an\n\
   * @param {String} type\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function an (type, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    type = type.toLowerCase();\n\
    var obj = flag(this, 'object')\n\
      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';\n\
\n\
    this.assert(\n\
        type === _.type(obj)\n\
      , 'expected #{this} to be ' + article + type\n\
      , 'expected #{this} not to be ' + article + type\n\
    );\n\
  }\n\
\n\
  Assertion.addChainableMethod('an', an);\n\
  Assertion.addChainableMethod('a', an);\n\
\n\
  /**\n\
   * ### .include(value)\n\
   *\n\
   * The `include` and `contain` assertions can be used as either property\n\
   * based language chains or as methods to assert the inclusion of an object\n\
   * in an array or a substring in a string. When used as language chains,\n\
   * they toggle the `contain` flag for the `keys` assertion.\n\
   *\n\
   *     expect([1,2,3]).to.include(2);\n\
   *     expect('foobar').to.contain('foo');\n\
   *     expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');\n\
   *\n\
   * @name include\n\
   * @alias contain\n\
   * @param {Object|String|Number} obj\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function includeChainingBehavior () {\n\
    flag(this, 'contains', true);\n\
  }\n\
\n\
  function include (val, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    var expected = false;\n\
    if (_.type(obj) === 'array' && _.type(val) === 'object') {\n\
      for (var i in obj) {\n\
        if (_.eql(obj[i], val)) {\n\
          expected = true;\n\
          break;\n\
        }\n\
      }\n\
    } else if (_.type(val) === 'object') {\n\
      if (!flag(this, 'negate')) {\n\
        for (var k in val) new Assertion(obj).property(k, val[k]);\n\
        return;\n\
      }\n\
      var subset = {}\n\
      for (var k in val) subset[k] = obj[k]\n\
      expected = _.eql(subset, val);\n\
    } else {\n\
      expected = obj && ~obj.indexOf(val)\n\
    }\n\
    this.assert(\n\
        expected\n\
      , 'expected #{this} to include ' + _.inspect(val)\n\
      , 'expected #{this} to not include ' + _.inspect(val));\n\
  }\n\
\n\
  Assertion.addChainableMethod('include', include, includeChainingBehavior);\n\
  Assertion.addChainableMethod('contain', include, includeChainingBehavior);\n\
\n\
  /**\n\
   * ### .ok\n\
   *\n\
   * Asserts that the target is truthy.\n\
   *\n\
   *     expect('everthing').to.be.ok;\n\
   *     expect(1).to.be.ok;\n\
   *     expect(false).to.not.be.ok;\n\
   *     expect(undefined).to.not.be.ok;\n\
   *     expect(null).to.not.be.ok;\n\
   *\n\
   * @name ok\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('ok', function () {\n\
    this.assert(\n\
        flag(this, 'object')\n\
      , 'expected #{this} to be truthy'\n\
      , 'expected #{this} to be falsy');\n\
  });\n\
\n\
  /**\n\
   * ### .true\n\
   *\n\
   * Asserts that the target is `true`.\n\
   *\n\
   *     expect(true).to.be.true;\n\
   *     expect(1).to.not.be.true;\n\
   *\n\
   * @name true\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('true', function () {\n\
    this.assert(\n\
        true === flag(this, 'object')\n\
      , 'expected #{this} to be true'\n\
      , 'expected #{this} to be false'\n\
      , this.negate ? false : true\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .false\n\
   *\n\
   * Asserts that the target is `false`.\n\
   *\n\
   *     expect(false).to.be.false;\n\
   *     expect(0).to.not.be.false;\n\
   *\n\
   * @name false\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('false', function () {\n\
    this.assert(\n\
        false === flag(this, 'object')\n\
      , 'expected #{this} to be false'\n\
      , 'expected #{this} to be true'\n\
      , this.negate ? true : false\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .null\n\
   *\n\
   * Asserts that the target is `null`.\n\
   *\n\
   *     expect(null).to.be.null;\n\
   *     expect(undefined).not.to.be.null;\n\
   *\n\
   * @name null\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('null', function () {\n\
    this.assert(\n\
        null === flag(this, 'object')\n\
      , 'expected #{this} to be null'\n\
      , 'expected #{this} not to be null'\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .undefined\n\
   *\n\
   * Asserts that the target is `undefined`.\n\
   *\n\
   *     expect(undefined).to.be.undefined;\n\
   *     expect(null).to.not.be.undefined;\n\
   *\n\
   * @name undefined\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('undefined', function () {\n\
    this.assert(\n\
        undefined === flag(this, 'object')\n\
      , 'expected #{this} to be undefined'\n\
      , 'expected #{this} not to be undefined'\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .exist\n\
   *\n\
   * Asserts that the target is neither `null` nor `undefined`.\n\
   *\n\
   *     var foo = 'hi'\n\
   *       , bar = null\n\
   *       , baz;\n\
   *\n\
   *     expect(foo).to.exist;\n\
   *     expect(bar).to.not.exist;\n\
   *     expect(baz).to.not.exist;\n\
   *\n\
   * @name exist\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('exist', function () {\n\
    this.assert(\n\
        null != flag(this, 'object')\n\
      , 'expected #{this} to exist'\n\
      , 'expected #{this} to not exist'\n\
    );\n\
  });\n\
\n\
\n\
  /**\n\
   * ### .empty\n\
   *\n\
   * Asserts that the target's length is `0`. For arrays, it checks\n\
   * the `length` property. For objects, it gets the count of\n\
   * enumerable keys.\n\
   *\n\
   *     expect([]).to.be.empty;\n\
   *     expect('').to.be.empty;\n\
   *     expect({}).to.be.empty;\n\
   *\n\
   * @name empty\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('empty', function () {\n\
    var obj = flag(this, 'object')\n\
      , expected = obj;\n\
\n\
    if (Array.isArray(obj) || 'string' === typeof object) {\n\
      expected = obj.length;\n\
    } else if (typeof obj === 'object') {\n\
      expected = Object.keys(obj).length;\n\
    }\n\
\n\
    this.assert(\n\
        !expected\n\
      , 'expected #{this} to be empty'\n\
      , 'expected #{this} not to be empty'\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .arguments\n\
   *\n\
   * Asserts that the target is an arguments object.\n\
   *\n\
   *     function test () {\n\
   *       expect(arguments).to.be.arguments;\n\
   *     }\n\
   *\n\
   * @name arguments\n\
   * @alias Arguments\n\
   * @api public\n\
   */\n\
\n\
  function checkArguments () {\n\
    var obj = flag(this, 'object')\n\
      , type = Object.prototype.toString.call(obj);\n\
    this.assert(\n\
        '[object Arguments]' === type\n\
      , 'expected #{this} to be arguments but got ' + type\n\
      , 'expected #{this} to not be arguments'\n\
    );\n\
  }\n\
\n\
  Assertion.addProperty('arguments', checkArguments);\n\
  Assertion.addProperty('Arguments', checkArguments);\n\
\n\
  /**\n\
   * ### .equal(value)\n\
   *\n\
   * Asserts that the target is strictly equal (`===`) to `value`.\n\
   * Alternately, if the `deep` flag is set, asserts that\n\
   * the target is deeply equal to `value`.\n\
   *\n\
   *     expect('hello').to.equal('hello');\n\
   *     expect(42).to.equal(42);\n\
   *     expect(1).to.not.equal(true);\n\
   *     expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });\n\
   *     expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });\n\
   *\n\
   * @name equal\n\
   * @alias equals\n\
   * @alias eq\n\
   * @alias deep.equal\n\
   * @param {Mixed} value\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertEqual (val, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    if (flag(this, 'deep')) {\n\
      return this.eql(val);\n\
    } else {\n\
      this.assert(\n\
          val === obj\n\
        , 'expected #{this} to equal #{exp}'\n\
        , 'expected #{this} to not equal #{exp}'\n\
        , val\n\
        , this._obj\n\
        , true\n\
      );\n\
    }\n\
  }\n\
\n\
  Assertion.addMethod('equal', assertEqual);\n\
  Assertion.addMethod('equals', assertEqual);\n\
  Assertion.addMethod('eq', assertEqual);\n\
\n\
  /**\n\
   * ### .eql(value)\n\
   *\n\
   * Asserts that the target is deeply equal to `value`.\n\
   *\n\
   *     expect({ foo: 'bar' }).to.eql({ foo: 'bar' });\n\
   *     expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);\n\
   *\n\
   * @name eql\n\
   * @alias eqls\n\
   * @param {Mixed} value\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertEql(obj, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    this.assert(\n\
        _.eql(obj, flag(this, 'object'))\n\
      , 'expected #{this} to deeply equal #{exp}'\n\
      , 'expected #{this} to not deeply equal #{exp}'\n\
      , obj\n\
      , this._obj\n\
      , true\n\
    );\n\
  }\n\
\n\
  Assertion.addMethod('eql', assertEql);\n\
  Assertion.addMethod('eqls', assertEql);\n\
\n\
  /**\n\
   * ### .above(value)\n\
   *\n\
   * Asserts that the target is greater than `value`.\n\
   *\n\
   *     expect(10).to.be.above(5);\n\
   *\n\
   * Can also be used in conjunction with `length` to\n\
   * assert a minimum length. The benefit being a\n\
   * more informative error message than if the length\n\
   * was supplied directly.\n\
   *\n\
   *     expect('foo').to.have.length.above(2);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);\n\
   *\n\
   * @name above\n\
   * @alias gt\n\
   * @alias greaterThan\n\
   * @param {Number} value\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertAbove (n, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    if (flag(this, 'doLength')) {\n\
      new Assertion(obj, msg).to.have.property('length');\n\
      var len = obj.length;\n\
      this.assert(\n\
          len > n\n\
        , 'expected #{this} to have a length above #{exp} but got #{act}'\n\
        , 'expected #{this} to not have a length above #{exp}'\n\
        , n\n\
        , len\n\
      );\n\
    } else {\n\
      this.assert(\n\
          obj > n\n\
        , 'expected #{this} to be above ' + n\n\
        , 'expected #{this} to be at most ' + n\n\
      );\n\
    }\n\
  }\n\
\n\
  Assertion.addMethod('above', assertAbove);\n\
  Assertion.addMethod('gt', assertAbove);\n\
  Assertion.addMethod('greaterThan', assertAbove);\n\
\n\
  /**\n\
   * ### .least(value)\n\
   *\n\
   * Asserts that the target is greater than or equal to `value`.\n\
   *\n\
   *     expect(10).to.be.at.least(10);\n\
   *\n\
   * Can also be used in conjunction with `length` to\n\
   * assert a minimum length. The benefit being a\n\
   * more informative error message than if the length\n\
   * was supplied directly.\n\
   *\n\
   *     expect('foo').to.have.length.of.at.least(2);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);\n\
   *\n\
   * @name least\n\
   * @alias gte\n\
   * @param {Number} value\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertLeast (n, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    if (flag(this, 'doLength')) {\n\
      new Assertion(obj, msg).to.have.property('length');\n\
      var len = obj.length;\n\
      this.assert(\n\
          len >= n\n\
        , 'expected #{this} to have a length at least #{exp} but got #{act}'\n\
        , 'expected #{this} to have a length below #{exp}'\n\
        , n\n\
        , len\n\
      );\n\
    } else {\n\
      this.assert(\n\
          obj >= n\n\
        , 'expected #{this} to be at least ' + n\n\
        , 'expected #{this} to be below ' + n\n\
      );\n\
    }\n\
  }\n\
\n\
  Assertion.addMethod('least', assertLeast);\n\
  Assertion.addMethod('gte', assertLeast);\n\
\n\
  /**\n\
   * ### .below(value)\n\
   *\n\
   * Asserts that the target is less than `value`.\n\
   *\n\
   *     expect(5).to.be.below(10);\n\
   *\n\
   * Can also be used in conjunction with `length` to\n\
   * assert a maximum length. The benefit being a\n\
   * more informative error message than if the length\n\
   * was supplied directly.\n\
   *\n\
   *     expect('foo').to.have.length.below(4);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);\n\
   *\n\
   * @name below\n\
   * @alias lt\n\
   * @alias lessThan\n\
   * @param {Number} value\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertBelow (n, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    if (flag(this, 'doLength')) {\n\
      new Assertion(obj, msg).to.have.property('length');\n\
      var len = obj.length;\n\
      this.assert(\n\
          len < n\n\
        , 'expected #{this} to have a length below #{exp} but got #{act}'\n\
        , 'expected #{this} to not have a length below #{exp}'\n\
        , n\n\
        , len\n\
      );\n\
    } else {\n\
      this.assert(\n\
          obj < n\n\
        , 'expected #{this} to be below ' + n\n\
        , 'expected #{this} to be at least ' + n\n\
      );\n\
    }\n\
  }\n\
\n\
  Assertion.addMethod('below', assertBelow);\n\
  Assertion.addMethod('lt', assertBelow);\n\
  Assertion.addMethod('lessThan', assertBelow);\n\
\n\
  /**\n\
   * ### .most(value)\n\
   *\n\
   * Asserts that the target is less than or equal to `value`.\n\
   *\n\
   *     expect(5).to.be.at.most(5);\n\
   *\n\
   * Can also be used in conjunction with `length` to\n\
   * assert a maximum length. The benefit being a\n\
   * more informative error message than if the length\n\
   * was supplied directly.\n\
   *\n\
   *     expect('foo').to.have.length.of.at.most(4);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);\n\
   *\n\
   * @name most\n\
   * @alias lte\n\
   * @param {Number} value\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertMost (n, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    if (flag(this, 'doLength')) {\n\
      new Assertion(obj, msg).to.have.property('length');\n\
      var len = obj.length;\n\
      this.assert(\n\
          len <= n\n\
        , 'expected #{this} to have a length at most #{exp} but got #{act}'\n\
        , 'expected #{this} to have a length above #{exp}'\n\
        , n\n\
        , len\n\
      );\n\
    } else {\n\
      this.assert(\n\
          obj <= n\n\
        , 'expected #{this} to be at most ' + n\n\
        , 'expected #{this} to be above ' + n\n\
      );\n\
    }\n\
  }\n\
\n\
  Assertion.addMethod('most', assertMost);\n\
  Assertion.addMethod('lte', assertMost);\n\
\n\
  /**\n\
   * ### .within(start, finish)\n\
   *\n\
   * Asserts that the target is within a range.\n\
   *\n\
   *     expect(7).to.be.within(5,10);\n\
   *\n\
   * Can also be used in conjunction with `length` to\n\
   * assert a length range. The benefit being a\n\
   * more informative error message than if the length\n\
   * was supplied directly.\n\
   *\n\
   *     expect('foo').to.have.length.within(2,4);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);\n\
   *\n\
   * @name within\n\
   * @param {Number} start lowerbound inclusive\n\
   * @param {Number} finish upperbound inclusive\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('within', function (start, finish, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object')\n\
      , range = start + '..' + finish;\n\
    if (flag(this, 'doLength')) {\n\
      new Assertion(obj, msg).to.have.property('length');\n\
      var len = obj.length;\n\
      this.assert(\n\
          len >= start && len <= finish\n\
        , 'expected #{this} to have a length within ' + range\n\
        , 'expected #{this} to not have a length within ' + range\n\
      );\n\
    } else {\n\
      this.assert(\n\
          obj >= start && obj <= finish\n\
        , 'expected #{this} to be within ' + range\n\
        , 'expected #{this} to not be within ' + range\n\
      );\n\
    }\n\
  });\n\
\n\
  /**\n\
   * ### .instanceof(constructor)\n\
   *\n\
   * Asserts that the target is an instance of `constructor`.\n\
   *\n\
   *     var Tea = function (name) { this.name = name; }\n\
   *       , Chai = new Tea('chai');\n\
   *\n\
   *     expect(Chai).to.be.an.instanceof(Tea);\n\
   *     expect([ 1, 2, 3 ]).to.be.instanceof(Array);\n\
   *\n\
   * @name instanceof\n\
   * @param {Constructor} constructor\n\
   * @param {String} message _optional_\n\
   * @alias instanceOf\n\
   * @api public\n\
   */\n\
\n\
  function assertInstanceOf (constructor, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var name = _.getName(constructor);\n\
    this.assert(\n\
        flag(this, 'object') instanceof constructor\n\
      , 'expected #{this} to be an instance of ' + name\n\
      , 'expected #{this} to not be an instance of ' + name\n\
    );\n\
  };\n\
\n\
  Assertion.addMethod('instanceof', assertInstanceOf);\n\
  Assertion.addMethod('instanceOf', assertInstanceOf);\n\
\n\
  /**\n\
   * ### .property(name, [value])\n\
   *\n\
   * Asserts that the target has a property `name`, optionally asserting that\n\
   * the value of that property is strictly equal to  `value`.\n\
   * If the `deep` flag is set, you can use dot- and bracket-notation for deep\n\
   * references into objects and arrays.\n\
   *\n\
   *     // simple referencing\n\
   *     var obj = { foo: 'bar' };\n\
   *     expect(obj).to.have.property('foo');\n\
   *     expect(obj).to.have.property('foo', 'bar');\n\
   *\n\
   *     // deep referencing\n\
   *     var deepObj = {\n\
   *         green: { tea: 'matcha' }\n\
   *       , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]\n\
   *     };\n\
\n\
   *     expect(deepObj).to.have.deep.property('green.tea', 'matcha');\n\
   *     expect(deepObj).to.have.deep.property('teas[1]', 'matcha');\n\
   *     expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');\n\
   *\n\
   * You can also use an array as the starting point of a `deep.property`\n\
   * assertion, or traverse nested arrays.\n\
   *\n\
   *     var arr = [\n\
   *         [ 'chai', 'matcha', 'konacha' ]\n\
   *       , [ { tea: 'chai' }\n\
   *         , { tea: 'matcha' }\n\
   *         , { tea: 'konacha' } ]\n\
   *     ];\n\
   *\n\
   *     expect(arr).to.have.deep.property('[0][1]', 'matcha');\n\
   *     expect(arr).to.have.deep.property('[1][2].tea', 'konacha');\n\
   *\n\
   * Furthermore, `property` changes the subject of the assertion\n\
   * to be the value of that property from the original object. This\n\
   * permits for further chainable assertions on that property.\n\
   *\n\
   *     expect(obj).to.have.property('foo')\n\
   *       .that.is.a('string');\n\
   *     expect(deepObj).to.have.property('green')\n\
   *       .that.is.an('object')\n\
   *       .that.deep.equals({ tea: 'matcha' });\n\
   *     expect(deepObj).to.have.property('teas')\n\
   *       .that.is.an('array')\n\
   *       .with.deep.property('[2]')\n\
   *         .that.deep.equals({ tea: 'konacha' });\n\
   *\n\
   * @name property\n\
   * @alias deep.property\n\
   * @param {String} name\n\
   * @param {Mixed} value (optional)\n\
   * @param {String} message _optional_\n\
   * @returns value of property for chaining\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('property', function (name, val, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
\n\
    var descriptor = flag(this, 'deep') ? 'deep property ' : 'property '\n\
      , negate = flag(this, 'negate')\n\
      , obj = flag(this, 'object')\n\
      , value = flag(this, 'deep')\n\
        ? _.getPathValue(name, obj)\n\
        : obj[name];\n\
\n\
    if (negate && undefined !== val) {\n\
      if (undefined === value) {\n\
        msg = (msg != null) ? msg + ': ' : '';\n\
        throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));\n\
      }\n\
    } else {\n\
      this.assert(\n\
          undefined !== value\n\
        , 'expected #{this} to have a ' + descriptor + _.inspect(name)\n\
        , 'expected #{this} to not have ' + descriptor + _.inspect(name));\n\
    }\n\
\n\
    if (undefined !== val) {\n\
      this.assert(\n\
          val === value\n\
        , 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'\n\
        , 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}'\n\
        , val\n\
        , value\n\
      );\n\
    }\n\
\n\
    flag(this, 'object', value);\n\
  });\n\
\n\
\n\
  /**\n\
   * ### .ownProperty(name)\n\
   *\n\
   * Asserts that the target has an own property `name`.\n\
   *\n\
   *     expect('test').to.have.ownProperty('length');\n\
   *\n\
   * @name ownProperty\n\
   * @alias haveOwnProperty\n\
   * @param {String} name\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertOwnProperty (name, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    this.assert(\n\
        obj.hasOwnProperty(name)\n\
      , 'expected #{this} to have own property ' + _.inspect(name)\n\
      , 'expected #{this} to not have own property ' + _.inspect(name)\n\
    );\n\
  }\n\
\n\
  Assertion.addMethod('ownProperty', assertOwnProperty);\n\
  Assertion.addMethod('haveOwnProperty', assertOwnProperty);\n\
\n\
  /**\n\
   * ### .length(value)\n\
   *\n\
   * Asserts that the target's `length` property has\n\
   * the expected value.\n\
   *\n\
   *     expect([ 1, 2, 3]).to.have.length(3);\n\
   *     expect('foobar').to.have.length(6);\n\
   *\n\
   * Can also be used as a chain precursor to a value\n\
   * comparison for the length property.\n\
   *\n\
   *     expect('foo').to.have.length.above(2);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);\n\
   *     expect('foo').to.have.length.below(4);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);\n\
   *     expect('foo').to.have.length.within(2,4);\n\
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);\n\
   *\n\
   * @name length\n\
   * @alias lengthOf\n\
   * @param {Number} length\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  function assertLengthChain () {\n\
    flag(this, 'doLength', true);\n\
  }\n\
\n\
  function assertLength (n, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    new Assertion(obj, msg).to.have.property('length');\n\
    var len = obj.length;\n\
\n\
    this.assert(\n\
        len == n\n\
      , 'expected #{this} to have a length of #{exp} but got #{act}'\n\
      , 'expected #{this} to not have a length of #{act}'\n\
      , n\n\
      , len\n\
    );\n\
  }\n\
\n\
  Assertion.addChainableMethod('length', assertLength, assertLengthChain);\n\
  Assertion.addMethod('lengthOf', assertLength, assertLengthChain);\n\
\n\
  /**\n\
   * ### .match(regexp)\n\
   *\n\
   * Asserts that the target matches a regular expression.\n\
   *\n\
   *     expect('foobar').to.match(/^foo/);\n\
   *\n\
   * @name match\n\
   * @param {RegExp} RegularExpression\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('match', function (re, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    this.assert(\n\
        re.exec(obj)\n\
      , 'expected #{this} to match ' + re\n\
      , 'expected #{this} not to match ' + re\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .string(string)\n\
   *\n\
   * Asserts that the string target contains another string.\n\
   *\n\
   *     expect('foobar').to.have.string('bar');\n\
   *\n\
   * @name string\n\
   * @param {String} string\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('string', function (str, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    new Assertion(obj, msg).is.a('string');\n\
\n\
    this.assert(\n\
        ~obj.indexOf(str)\n\
      , 'expected #{this} to contain ' + _.inspect(str)\n\
      , 'expected #{this} to not contain ' + _.inspect(str)\n\
    );\n\
  });\n\
\n\
\n\
  /**\n\
   * ### .keys(key1, [key2], [...])\n\
   *\n\
   * Asserts that the target has exactly the given keys, or\n\
   * asserts the inclusion of some keys when using the\n\
   * `include` or `contain` modifiers.\n\
   *\n\
   *     expect({ foo: 1, bar: 2 }).to.have.keys(['foo', 'bar']);\n\
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.keys('foo', 'bar');\n\
   *\n\
   * @name keys\n\
   * @alias key\n\
   * @param {String...|Array} keys\n\
   * @api public\n\
   */\n\
\n\
  function assertKeys (keys) {\n\
    var obj = flag(this, 'object')\n\
      , str\n\
      , ok = true;\n\
\n\
    keys = keys instanceof Array\n\
      ? keys\n\
      : Array.prototype.slice.call(arguments);\n\
\n\
    if (!keys.length) throw new Error('keys required');\n\
\n\
    var actual = Object.keys(obj)\n\
      , len = keys.length;\n\
\n\
    // Inclusion\n\
    ok = keys.every(function(key){\n\
      return ~actual.indexOf(key);\n\
    });\n\
\n\
    // Strict\n\
    if (!flag(this, 'negate') && !flag(this, 'contains')) {\n\
      ok = ok && keys.length == actual.length;\n\
    }\n\
\n\
    // Key string\n\
    if (len > 1) {\n\
      keys = keys.map(function(key){\n\
        return _.inspect(key);\n\
      });\n\
      var last = keys.pop();\n\
      str = keys.join(', ') + ', and ' + last;\n\
    } else {\n\
      str = _.inspect(keys[0]);\n\
    }\n\
\n\
    // Form\n\
    str = (len > 1 ? 'keys ' : 'key ') + str;\n\
\n\
    // Have / include\n\
    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;\n\
\n\
    // Assertion\n\
    this.assert(\n\
        ok\n\
      , 'expected #{this} to ' + str\n\
      , 'expected #{this} to not ' + str\n\
    );\n\
  }\n\
\n\
  Assertion.addMethod('keys', assertKeys);\n\
  Assertion.addMethod('key', assertKeys);\n\
\n\
  /**\n\
   * ### .throw(constructor)\n\
   *\n\
   * Asserts that the function target will throw a specific error, or specific type of error\n\
   * (as determined using `instanceof`), optionally with a RegExp or string inclusion test\n\
   * for the error's message.\n\
   *\n\
   *     var err = new ReferenceError('This is a bad function.');\n\
   *     var fn = function () { throw err; }\n\
   *     expect(fn).to.throw(ReferenceError);\n\
   *     expect(fn).to.throw(Error);\n\
   *     expect(fn).to.throw(/bad function/);\n\
   *     expect(fn).to.not.throw('good function');\n\
   *     expect(fn).to.throw(ReferenceError, /bad function/);\n\
   *     expect(fn).to.throw(err);\n\
   *     expect(fn).to.not.throw(new RangeError('Out of range.'));\n\
   *\n\
   * Please note that when a throw expectation is negated, it will check each\n\
   * parameter independently, starting with error constructor type. The appropriate way\n\
   * to check for the existence of a type of error but for a message that does not match\n\
   * is to use `and`.\n\
   *\n\
   *     expect(fn).to.throw(ReferenceError)\n\
   *        .and.not.throw(/good function/);\n\
   *\n\
   * @name throw\n\
   * @alias throws\n\
   * @alias Throw\n\
   * @param {ErrorConstructor} constructor\n\
   * @param {String|RegExp} expected error message\n\
   * @param {String} message _optional_\n\
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types\n\
   * @returns error for chaining (null if no error)\n\
   * @api public\n\
   */\n\
\n\
  function assertThrows (constructor, errMsg, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    new Assertion(obj, msg).is.a('function');\n\
\n\
    var thrown = false\n\
      , desiredError = null\n\
      , name = null\n\
      , thrownError = null;\n\
\n\
    if (arguments.length === 0) {\n\
      errMsg = null;\n\
      constructor = null;\n\
    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {\n\
      errMsg = constructor;\n\
      constructor = null;\n\
    } else if (constructor && constructor instanceof Error) {\n\
      desiredError = constructor;\n\
      constructor = null;\n\
      errMsg = null;\n\
    } else if (typeof constructor === 'function') {\n\
      name = constructor.prototype.name || constructor.name;\n\
      if (name === 'Error' && constructor !== Error) {\n\
        name = (new constructor()).name;\n\
      }\n\
    } else {\n\
      constructor = null;\n\
    }\n\
\n\
    try {\n\
      obj();\n\
    } catch (err) {\n\
      // first, check desired error\n\
      if (desiredError) {\n\
        this.assert(\n\
            err === desiredError\n\
          , 'expected #{this} to throw #{exp} but #{act} was thrown'\n\
          , 'expected #{this} to not throw #{exp}'\n\
          , (desiredError instanceof Error ? desiredError.toString() : desiredError)\n\
          , (err instanceof Error ? err.toString() : err)\n\
        );\n\
\n\
        flag(this, 'object', err);\n\
        return this;\n\
      }\n\
\n\
      // next, check constructor\n\
      if (constructor) {\n\
        this.assert(\n\
            err instanceof constructor\n\
          , 'expected #{this} to throw #{exp} but #{act} was thrown'\n\
          , 'expected #{this} to not throw #{exp} but #{act} was thrown'\n\
          , name\n\
          , (err instanceof Error ? err.toString() : err)\n\
        );\n\
\n\
        if (!errMsg) {\n\
          flag(this, 'object', err);\n\
          return this;\n\
        }\n\
      }\n\
\n\
      // next, check message\n\
      var message = 'object' === _.type(err) && \"message\" in err\n\
        ? err.message\n\
        : '' + err;\n\
\n\
      if ((message != null) && errMsg && errMsg instanceof RegExp) {\n\
        this.assert(\n\
            errMsg.exec(message)\n\
          , 'expected #{this} to throw error matching #{exp} but got #{act}'\n\
          , 'expected #{this} to throw error not matching #{exp}'\n\
          , errMsg\n\
          , message\n\
        );\n\
\n\
        flag(this, 'object', err);\n\
        return this;\n\
      } else if ((message != null) && errMsg && 'string' === typeof errMsg) {\n\
        this.assert(\n\
            ~message.indexOf(errMsg)\n\
          , 'expected #{this} to throw error including #{exp} but got #{act}'\n\
          , 'expected #{this} to throw error not including #{act}'\n\
          , errMsg\n\
          , message\n\
        );\n\
\n\
        flag(this, 'object', err);\n\
        return this;\n\
      } else {\n\
        thrown = true;\n\
        thrownError = err;\n\
      }\n\
    }\n\
\n\
    var actuallyGot = ''\n\
      , expectedThrown = name !== null\n\
        ? name\n\
        : desiredError\n\
          ? '#{exp}' //_.inspect(desiredError)\n\
          : 'an error';\n\
\n\
    if (thrown) {\n\
      actuallyGot = ' but #{act} was thrown'\n\
    }\n\
\n\
    this.assert(\n\
        thrown === true\n\
      , 'expected #{this} to throw ' + expectedThrown + actuallyGot\n\
      , 'expected #{this} to not throw ' + expectedThrown + actuallyGot\n\
      , (desiredError instanceof Error ? desiredError.toString() : desiredError)\n\
      , (thrownError instanceof Error ? thrownError.toString() : thrownError)\n\
    );\n\
\n\
    flag(this, 'object', thrownError);\n\
  };\n\
\n\
  Assertion.addMethod('throw', assertThrows);\n\
  Assertion.addMethod('throws', assertThrows);\n\
  Assertion.addMethod('Throw', assertThrows);\n\
\n\
  /**\n\
   * ### .respondTo(method)\n\
   *\n\
   * Asserts that the object or class target will respond to a method.\n\
   *\n\
   *     Klass.prototype.bar = function(){};\n\
   *     expect(Klass).to.respondTo('bar');\n\
   *     expect(obj).to.respondTo('bar');\n\
   *\n\
   * To check if a constructor will respond to a static function,\n\
   * set the `itself` flag.\n\
   *\n\
   *     Klass.baz = function(){};\n\
   *     expect(Klass).itself.to.respondTo('baz');\n\
   *\n\
   * @name respondTo\n\
   * @param {String} method\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('respondTo', function (method, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object')\n\
      , itself = flag(this, 'itself')\n\
      , context = ('function' === _.type(obj) && !itself)\n\
        ? obj.prototype[method]\n\
        : obj[method];\n\
\n\
    this.assert(\n\
        'function' === typeof context\n\
      , 'expected #{this} to respond to ' + _.inspect(method)\n\
      , 'expected #{this} to not respond to ' + _.inspect(method)\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .itself\n\
   *\n\
   * Sets the `itself` flag, later used by the `respondTo` assertion.\n\
   *\n\
   *     function Foo() {}\n\
   *     Foo.bar = function() {}\n\
   *     Foo.prototype.baz = function() {}\n\
   *\n\
   *     expect(Foo).itself.to.respondTo('bar');\n\
   *     expect(Foo).itself.not.to.respondTo('baz');\n\
   *\n\
   * @name itself\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addProperty('itself', function () {\n\
    flag(this, 'itself', true);\n\
  });\n\
\n\
  /**\n\
   * ### .satisfy(method)\n\
   *\n\
   * Asserts that the target passes a given truth test.\n\
   *\n\
   *     expect(1).to.satisfy(function(num) { return num > 0; });\n\
   *\n\
   * @name satisfy\n\
   * @param {Function} matcher\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('satisfy', function (matcher, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    this.assert(\n\
        matcher(obj)\n\
      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)\n\
      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)\n\
      , this.negate ? false : true\n\
      , matcher(obj)\n\
    );\n\
  });\n\
\n\
  /**\n\
   * ### .closeTo(expected, delta)\n\
   *\n\
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.\n\
   *\n\
   *     expect(1.5).to.be.closeTo(1, 0.5);\n\
   *\n\
   * @name closeTo\n\
   * @param {Number} expected\n\
   * @param {Number} delta\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('closeTo', function (expected, delta, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
    this.assert(\n\
        Math.abs(obj - expected) <= delta\n\
      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta\n\
      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta\n\
    );\n\
  });\n\
\n\
  function isSubsetOf(subset, superset, cmp) {\n\
    return subset.every(function(elem) {\n\
      if (!cmp) return superset.indexOf(elem) !== -1;\n\
\n\
      return superset.some(function(elem2) {\n\
        return cmp(elem, elem2);\n\
      });\n\
    })\n\
  }\n\
\n\
  /**\n\
   * ### .members(set)\n\
   *\n\
   * Asserts that the target is a superset of `set`,\n\
   * or that the target and `set` have the same strictly-equal (===) members.\n\
   * Alternately, if the `deep` flag is set, set members are compared for deep\n\
   * equality.\n\
   *\n\
   *     expect([1, 2, 3]).to.include.members([3, 2]);\n\
   *     expect([1, 2, 3]).to.not.include.members([3, 2, 8]);\n\
   *\n\
   *     expect([4, 2]).to.have.members([2, 4]);\n\
   *     expect([5, 2]).to.not.have.members([5, 2, 1]);\n\
   *\n\
   *     expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);\n\
   *\n\
   * @name members\n\
   * @param {Array} set\n\
   * @param {String} message _optional_\n\
   * @api public\n\
   */\n\
\n\
  Assertion.addMethod('members', function (subset, msg) {\n\
    if (msg) flag(this, 'message', msg);\n\
    var obj = flag(this, 'object');\n\
\n\
    new Assertion(obj).to.be.an('array');\n\
    new Assertion(subset).to.be.an('array');\n\
\n\
    var cmp = flag(this, 'deep') ? _.eql : undefined;\n\
\n\
    if (flag(this, 'contains')) {\n\
      return this.assert(\n\
          isSubsetOf(subset, obj, cmp)\n\
        , 'expected #{this} to be a superset of #{act}'\n\
        , 'expected #{this} to not be a superset of #{act}'\n\
        , obj\n\
        , subset\n\
      );\n\
    }\n\
\n\
    this.assert(\n\
        isSubsetOf(obj, subset, cmp) && isSubsetOf(subset, obj, cmp)\n\
        , 'expected #{this} to have the same members as #{act}'\n\
        , 'expected #{this} to not have the same members as #{act}'\n\
        , obj\n\
        , subset\n\
    );\n\
  });\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/core/assertions.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/interface/assert.js", Function("exports, module",
"/*!\n\
 * chai\n\
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
\n\
module.exports = function (chai, util) {\n\
\n\
  /*!\n\
   * Chai dependencies.\n\
   */\n\
\n\
  var Assertion = chai.Assertion\n\
    , flag = util.flag;\n\
\n\
  /*!\n\
   * Module export.\n\
   */\n\
\n\
  /**\n\
   * ### assert(expression, message)\n\
   *\n\
   * Write your own test expressions.\n\
   *\n\
   *     assert('foo' !== 'bar', 'foo is not bar');\n\
   *     assert(Array.isArray([]), 'empty arrays are arrays');\n\
   *\n\
   * @param {Mixed} expression to test for truthiness\n\
   * @param {String} message to display on error\n\
   * @name assert\n\
   * @api public\n\
   */\n\
\n\
  var assert = chai.assert = function (express, errmsg) {\n\
    var test = new Assertion(null, null, chai.assert);\n\
    test.assert(\n\
        express\n\
      , errmsg\n\
      , '[ negation message unavailable ]'\n\
    );\n\
  };\n\
\n\
  /**\n\
   * ### .fail(actual, expected, [message], [operator])\n\
   *\n\
   * Throw a failure. Node.js `assert` module-compatible.\n\
   *\n\
   * @name fail\n\
   * @param {Mixed} actual\n\
   * @param {Mixed} expected\n\
   * @param {String} message\n\
   * @param {String} operator\n\
   * @api public\n\
   */\n\
\n\
  assert.fail = function (actual, expected, message, operator) {\n\
    message = message || 'assert.fail()';\n\
    throw new chai.AssertionError(message, {\n\
        actual: actual\n\
      , expected: expected\n\
      , operator: operator\n\
    }, assert.fail);\n\
  };\n\
\n\
  /**\n\
   * ### .ok(object, [message])\n\
   *\n\
   * Asserts that `object` is truthy.\n\
   *\n\
   *     assert.ok('everything', 'everything is ok');\n\
   *     assert.ok(false, 'this will fail');\n\
   *\n\
   * @name ok\n\
   * @param {Mixed} object to test\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.ok = function (val, msg) {\n\
    new Assertion(val, msg).is.ok;\n\
  };\n\
\n\
  /**\n\
   * ### .notOk(object, [message])\n\
   *\n\
   * Asserts that `object` is falsy.\n\
   *\n\
   *     assert.notOk('everything', 'this will fail');\n\
   *     assert.notOk(false, 'this will pass');\n\
   *\n\
   * @name notOk\n\
   * @param {Mixed} object to test\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notOk = function (val, msg) {\n\
    new Assertion(val, msg).is.not.ok;\n\
  };\n\
\n\
  /**\n\
   * ### .equal(actual, expected, [message])\n\
   *\n\
   * Asserts non-strict equality (`==`) of `actual` and `expected`.\n\
   *\n\
   *     assert.equal(3, '3', '== coerces values to strings');\n\
   *\n\
   * @name equal\n\
   * @param {Mixed} actual\n\
   * @param {Mixed} expected\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.equal = function (act, exp, msg) {\n\
    var test = new Assertion(act, msg, assert.equal);\n\
\n\
    test.assert(\n\
        exp == flag(test, 'object')\n\
      , 'expected #{this} to equal #{exp}'\n\
      , 'expected #{this} to not equal #{act}'\n\
      , exp\n\
      , act\n\
    );\n\
  };\n\
\n\
  /**\n\
   * ### .notEqual(actual, expected, [message])\n\
   *\n\
   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.\n\
   *\n\
   *     assert.notEqual(3, 4, 'these numbers are not equal');\n\
   *\n\
   * @name notEqual\n\
   * @param {Mixed} actual\n\
   * @param {Mixed} expected\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notEqual = function (act, exp, msg) {\n\
    var test = new Assertion(act, msg, assert.notEqual);\n\
\n\
    test.assert(\n\
        exp != flag(test, 'object')\n\
      , 'expected #{this} to not equal #{exp}'\n\
      , 'expected #{this} to equal #{act}'\n\
      , exp\n\
      , act\n\
    );\n\
  };\n\
\n\
  /**\n\
   * ### .strictEqual(actual, expected, [message])\n\
   *\n\
   * Asserts strict equality (`===`) of `actual` and `expected`.\n\
   *\n\
   *     assert.strictEqual(true, true, 'these booleans are strictly equal');\n\
   *\n\
   * @name strictEqual\n\
   * @param {Mixed} actual\n\
   * @param {Mixed} expected\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.strictEqual = function (act, exp, msg) {\n\
    new Assertion(act, msg).to.equal(exp);\n\
  };\n\
\n\
  /**\n\
   * ### .notStrictEqual(actual, expected, [message])\n\
   *\n\
   * Asserts strict inequality (`!==`) of `actual` and `expected`.\n\
   *\n\
   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');\n\
   *\n\
   * @name notStrictEqual\n\
   * @param {Mixed} actual\n\
   * @param {Mixed} expected\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notStrictEqual = function (act, exp, msg) {\n\
    new Assertion(act, msg).to.not.equal(exp);\n\
  };\n\
\n\
  /**\n\
   * ### .deepEqual(actual, expected, [message])\n\
   *\n\
   * Asserts that `actual` is deeply equal to `expected`.\n\
   *\n\
   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });\n\
   *\n\
   * @name deepEqual\n\
   * @param {Mixed} actual\n\
   * @param {Mixed} expected\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.deepEqual = function (act, exp, msg) {\n\
    new Assertion(act, msg).to.eql(exp);\n\
  };\n\
\n\
  /**\n\
   * ### .notDeepEqual(actual, expected, [message])\n\
   *\n\
   * Assert that `actual` is not deeply equal to `expected`.\n\
   *\n\
   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });\n\
   *\n\
   * @name notDeepEqual\n\
   * @param {Mixed} actual\n\
   * @param {Mixed} expected\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notDeepEqual = function (act, exp, msg) {\n\
    new Assertion(act, msg).to.not.eql(exp);\n\
  };\n\
\n\
  /**\n\
   * ### .isTrue(value, [message])\n\
   *\n\
   * Asserts that `value` is true.\n\
   *\n\
   *     var teaServed = true;\n\
   *     assert.isTrue(teaServed, 'the tea has been served');\n\
   *\n\
   * @name isTrue\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isTrue = function (val, msg) {\n\
    new Assertion(val, msg).is['true'];\n\
  };\n\
\n\
  /**\n\
   * ### .isFalse(value, [message])\n\
   *\n\
   * Asserts that `value` is false.\n\
   *\n\
   *     var teaServed = false;\n\
   *     assert.isFalse(teaServed, 'no tea yet? hmm...');\n\
   *\n\
   * @name isFalse\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isFalse = function (val, msg) {\n\
    new Assertion(val, msg).is['false'];\n\
  };\n\
\n\
  /**\n\
   * ### .isNull(value, [message])\n\
   *\n\
   * Asserts that `value` is null.\n\
   *\n\
   *     assert.isNull(err, 'there was no error');\n\
   *\n\
   * @name isNull\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNull = function (val, msg) {\n\
    new Assertion(val, msg).to.equal(null);\n\
  };\n\
\n\
  /**\n\
   * ### .isNotNull(value, [message])\n\
   *\n\
   * Asserts that `value` is not null.\n\
   *\n\
   *     var tea = 'tasty chai';\n\
   *     assert.isNotNull(tea, 'great, time for tea!');\n\
   *\n\
   * @name isNotNull\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNotNull = function (val, msg) {\n\
    new Assertion(val, msg).to.not.equal(null);\n\
  };\n\
\n\
  /**\n\
   * ### .isUndefined(value, [message])\n\
   *\n\
   * Asserts that `value` is `undefined`.\n\
   *\n\
   *     var tea;\n\
   *     assert.isUndefined(tea, 'no tea defined');\n\
   *\n\
   * @name isUndefined\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isUndefined = function (val, msg) {\n\
    new Assertion(val, msg).to.equal(undefined);\n\
  };\n\
\n\
  /**\n\
   * ### .isDefined(value, [message])\n\
   *\n\
   * Asserts that `value` is not `undefined`.\n\
   *\n\
   *     var tea = 'cup of chai';\n\
   *     assert.isDefined(tea, 'tea has been defined');\n\
   *\n\
   * @name isDefined\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isDefined = function (val, msg) {\n\
    new Assertion(val, msg).to.not.equal(undefined);\n\
  };\n\
\n\
  /**\n\
   * ### .isFunction(value, [message])\n\
   *\n\
   * Asserts that `value` is a function.\n\
   *\n\
   *     function serveTea() { return 'cup of tea'; };\n\
   *     assert.isFunction(serveTea, 'great, we can have tea now');\n\
   *\n\
   * @name isFunction\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isFunction = function (val, msg) {\n\
    new Assertion(val, msg).to.be.a('function');\n\
  };\n\
\n\
  /**\n\
   * ### .isNotFunction(value, [message])\n\
   *\n\
   * Asserts that `value` is _not_ a function.\n\
   *\n\
   *     var serveTea = [ 'heat', 'pour', 'sip' ];\n\
   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');\n\
   *\n\
   * @name isNotFunction\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNotFunction = function (val, msg) {\n\
    new Assertion(val, msg).to.not.be.a('function');\n\
  };\n\
\n\
  /**\n\
   * ### .isObject(value, [message])\n\
   *\n\
   * Asserts that `value` is an object (as revealed by\n\
   * `Object.prototype.toString`).\n\
   *\n\
   *     var selection = { name: 'Chai', serve: 'with spices' };\n\
   *     assert.isObject(selection, 'tea selection is an object');\n\
   *\n\
   * @name isObject\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isObject = function (val, msg) {\n\
    new Assertion(val, msg).to.be.a('object');\n\
  };\n\
\n\
  /**\n\
   * ### .isNotObject(value, [message])\n\
   *\n\
   * Asserts that `value` is _not_ an object.\n\
   *\n\
   *     var selection = 'chai'\n\
   *     assert.isNotObject(selection, 'tea selection is not an object');\n\
   *     assert.isNotObject(null, 'null is not an object');\n\
   *\n\
   * @name isNotObject\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNotObject = function (val, msg) {\n\
    new Assertion(val, msg).to.not.be.a('object');\n\
  };\n\
\n\
  /**\n\
   * ### .isArray(value, [message])\n\
   *\n\
   * Asserts that `value` is an array.\n\
   *\n\
   *     var menu = [ 'green', 'chai', 'oolong' ];\n\
   *     assert.isArray(menu, 'what kind of tea do we want?');\n\
   *\n\
   * @name isArray\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isArray = function (val, msg) {\n\
    new Assertion(val, msg).to.be.an('array');\n\
  };\n\
\n\
  /**\n\
   * ### .isNotArray(value, [message])\n\
   *\n\
   * Asserts that `value` is _not_ an array.\n\
   *\n\
   *     var menu = 'green|chai|oolong';\n\
   *     assert.isNotArray(menu, 'what kind of tea do we want?');\n\
   *\n\
   * @name isNotArray\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNotArray = function (val, msg) {\n\
    new Assertion(val, msg).to.not.be.an('array');\n\
  };\n\
\n\
  /**\n\
   * ### .isString(value, [message])\n\
   *\n\
   * Asserts that `value` is a string.\n\
   *\n\
   *     var teaOrder = 'chai';\n\
   *     assert.isString(teaOrder, 'order placed');\n\
   *\n\
   * @name isString\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isString = function (val, msg) {\n\
    new Assertion(val, msg).to.be.a('string');\n\
  };\n\
\n\
  /**\n\
   * ### .isNotString(value, [message])\n\
   *\n\
   * Asserts that `value` is _not_ a string.\n\
   *\n\
   *     var teaOrder = 4;\n\
   *     assert.isNotString(teaOrder, 'order placed');\n\
   *\n\
   * @name isNotString\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNotString = function (val, msg) {\n\
    new Assertion(val, msg).to.not.be.a('string');\n\
  };\n\
\n\
  /**\n\
   * ### .isNumber(value, [message])\n\
   *\n\
   * Asserts that `value` is a number.\n\
   *\n\
   *     var cups = 2;\n\
   *     assert.isNumber(cups, 'how many cups');\n\
   *\n\
   * @name isNumber\n\
   * @param {Number} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNumber = function (val, msg) {\n\
    new Assertion(val, msg).to.be.a('number');\n\
  };\n\
\n\
  /**\n\
   * ### .isNotNumber(value, [message])\n\
   *\n\
   * Asserts that `value` is _not_ a number.\n\
   *\n\
   *     var cups = '2 cups please';\n\
   *     assert.isNotNumber(cups, 'how many cups');\n\
   *\n\
   * @name isNotNumber\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNotNumber = function (val, msg) {\n\
    new Assertion(val, msg).to.not.be.a('number');\n\
  };\n\
\n\
  /**\n\
   * ### .isBoolean(value, [message])\n\
   *\n\
   * Asserts that `value` is a boolean.\n\
   *\n\
   *     var teaReady = true\n\
   *       , teaServed = false;\n\
   *\n\
   *     assert.isBoolean(teaReady, 'is the tea ready');\n\
   *     assert.isBoolean(teaServed, 'has tea been served');\n\
   *\n\
   * @name isBoolean\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isBoolean = function (val, msg) {\n\
    new Assertion(val, msg).to.be.a('boolean');\n\
  };\n\
\n\
  /**\n\
   * ### .isNotBoolean(value, [message])\n\
   *\n\
   * Asserts that `value` is _not_ a boolean.\n\
   *\n\
   *     var teaReady = 'yep'\n\
   *       , teaServed = 'nope';\n\
   *\n\
   *     assert.isNotBoolean(teaReady, 'is the tea ready');\n\
   *     assert.isNotBoolean(teaServed, 'has tea been served');\n\
   *\n\
   * @name isNotBoolean\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.isNotBoolean = function (val, msg) {\n\
    new Assertion(val, msg).to.not.be.a('boolean');\n\
  };\n\
\n\
  /**\n\
   * ### .typeOf(value, name, [message])\n\
   *\n\
   * Asserts that `value`'s type is `name`, as determined by\n\
   * `Object.prototype.toString`.\n\
   *\n\
   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');\n\
   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');\n\
   *     assert.typeOf('tea', 'string', 'we have a string');\n\
   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');\n\
   *     assert.typeOf(null, 'null', 'we have a null');\n\
   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');\n\
   *\n\
   * @name typeOf\n\
   * @param {Mixed} value\n\
   * @param {String} name\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.typeOf = function (val, type, msg) {\n\
    new Assertion(val, msg).to.be.a(type);\n\
  };\n\
\n\
  /**\n\
   * ### .notTypeOf(value, name, [message])\n\
   *\n\
   * Asserts that `value`'s type is _not_ `name`, as determined by\n\
   * `Object.prototype.toString`.\n\
   *\n\
   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');\n\
   *\n\
   * @name notTypeOf\n\
   * @param {Mixed} value\n\
   * @param {String} typeof name\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notTypeOf = function (val, type, msg) {\n\
    new Assertion(val, msg).to.not.be.a(type);\n\
  };\n\
\n\
  /**\n\
   * ### .instanceOf(object, constructor, [message])\n\
   *\n\
   * Asserts that `value` is an instance of `constructor`.\n\
   *\n\
   *     var Tea = function (name) { this.name = name; }\n\
   *       , chai = new Tea('chai');\n\
   *\n\
   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');\n\
   *\n\
   * @name instanceOf\n\
   * @param {Object} object\n\
   * @param {Constructor} constructor\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.instanceOf = function (val, type, msg) {\n\
    new Assertion(val, msg).to.be.instanceOf(type);\n\
  };\n\
\n\
  /**\n\
   * ### .notInstanceOf(object, constructor, [message])\n\
   *\n\
   * Asserts `value` is not an instance of `constructor`.\n\
   *\n\
   *     var Tea = function (name) { this.name = name; }\n\
   *       , chai = new String('chai');\n\
   *\n\
   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');\n\
   *\n\
   * @name notInstanceOf\n\
   * @param {Object} object\n\
   * @param {Constructor} constructor\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notInstanceOf = function (val, type, msg) {\n\
    new Assertion(val, msg).to.not.be.instanceOf(type);\n\
  };\n\
\n\
  /**\n\
   * ### .include(haystack, needle, [message])\n\
   *\n\
   * Asserts that `haystack` includes `needle`. Works\n\
   * for strings and arrays.\n\
   *\n\
   *     assert.include('foobar', 'bar', 'foobar contains string \"bar\"');\n\
   *     assert.include([ 1, 2, 3 ], 3, 'array contains value');\n\
   *\n\
   * @name include\n\
   * @param {Array|String} haystack\n\
   * @param {Mixed} needle\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.include = function (exp, inc, msg) {\n\
    new Assertion(exp, msg, assert.include).include(inc);\n\
  };\n\
\n\
  /**\n\
   * ### .notInclude(haystack, needle, [message])\n\
   *\n\
   * Asserts that `haystack` does not include `needle`. Works\n\
   * for strings and arrays.\n\
   *i\n\
   *     assert.notInclude('foobar', 'baz', 'string not include substring');\n\
   *     assert.notInclude([ 1, 2, 3 ], 4, 'array not include contain value');\n\
   *\n\
   * @name notInclude\n\
   * @param {Array|String} haystack\n\
   * @param {Mixed} needle\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notInclude = function (exp, inc, msg) {\n\
    new Assertion(exp, msg, assert.notInclude).not.include(inc);\n\
  };\n\
\n\
  /**\n\
   * ### .match(value, regexp, [message])\n\
   *\n\
   * Asserts that `value` matches the regular expression `regexp`.\n\
   *\n\
   *     assert.match('foobar', /^foo/, 'regexp matches');\n\
   *\n\
   * @name match\n\
   * @param {Mixed} value\n\
   * @param {RegExp} regexp\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.match = function (exp, re, msg) {\n\
    new Assertion(exp, msg).to.match(re);\n\
  };\n\
\n\
  /**\n\
   * ### .notMatch(value, regexp, [message])\n\
   *\n\
   * Asserts that `value` does not match the regular expression `regexp`.\n\
   *\n\
   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');\n\
   *\n\
   * @name notMatch\n\
   * @param {Mixed} value\n\
   * @param {RegExp} regexp\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notMatch = function (exp, re, msg) {\n\
    new Assertion(exp, msg).to.not.match(re);\n\
  };\n\
\n\
  /**\n\
   * ### .property(object, property, [message])\n\
   *\n\
   * Asserts that `object` has a property named by `property`.\n\
   *\n\
   *     assert.property({ tea: { green: 'matcha' }}, 'tea');\n\
   *\n\
   * @name property\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.property = function (obj, prop, msg) {\n\
    new Assertion(obj, msg).to.have.property(prop);\n\
  };\n\
\n\
  /**\n\
   * ### .notProperty(object, property, [message])\n\
   *\n\
   * Asserts that `object` does _not_ have a property named by `property`.\n\
   *\n\
   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');\n\
   *\n\
   * @name notProperty\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notProperty = function (obj, prop, msg) {\n\
    new Assertion(obj, msg).to.not.have.property(prop);\n\
  };\n\
\n\
  /**\n\
   * ### .deepProperty(object, property, [message])\n\
   *\n\
   * Asserts that `object` has a property named by `property`, which can be a\n\
   * string using dot- and bracket-notation for deep reference.\n\
   *\n\
   *     assert.deepProperty({ tea: { green: 'matcha' }}, 'tea.green');\n\
   *\n\
   * @name deepProperty\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.deepProperty = function (obj, prop, msg) {\n\
    new Assertion(obj, msg).to.have.deep.property(prop);\n\
  };\n\
\n\
  /**\n\
   * ### .notDeepProperty(object, property, [message])\n\
   *\n\
   * Asserts that `object` does _not_ have a property named by `property`, which\n\
   * can be a string using dot- and bracket-notation for deep reference.\n\
   *\n\
   *     assert.notDeepProperty({ tea: { green: 'matcha' }}, 'tea.oolong');\n\
   *\n\
   * @name notDeepProperty\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.notDeepProperty = function (obj, prop, msg) {\n\
    new Assertion(obj, msg).to.not.have.deep.property(prop);\n\
  };\n\
\n\
  /**\n\
   * ### .propertyVal(object, property, value, [message])\n\
   *\n\
   * Asserts that `object` has a property named by `property` with value given\n\
   * by `value`.\n\
   *\n\
   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');\n\
   *\n\
   * @name propertyVal\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.propertyVal = function (obj, prop, val, msg) {\n\
    new Assertion(obj, msg).to.have.property(prop, val);\n\
  };\n\
\n\
  /**\n\
   * ### .propertyNotVal(object, property, value, [message])\n\
   *\n\
   * Asserts that `object` has a property named by `property`, but with a value\n\
   * different from that given by `value`.\n\
   *\n\
   *     assert.propertyNotVal({ tea: 'is good' }, 'tea', 'is bad');\n\
   *\n\
   * @name propertyNotVal\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.propertyNotVal = function (obj, prop, val, msg) {\n\
    new Assertion(obj, msg).to.not.have.property(prop, val);\n\
  };\n\
\n\
  /**\n\
   * ### .deepPropertyVal(object, property, value, [message])\n\
   *\n\
   * Asserts that `object` has a property named by `property` with value given\n\
   * by `value`. `property` can use dot- and bracket-notation for deep\n\
   * reference.\n\
   *\n\
   *     assert.deepPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');\n\
   *\n\
   * @name deepPropertyVal\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.deepPropertyVal = function (obj, prop, val, msg) {\n\
    new Assertion(obj, msg).to.have.deep.property(prop, val);\n\
  };\n\
\n\
  /**\n\
   * ### .deepPropertyNotVal(object, property, value, [message])\n\
   *\n\
   * Asserts that `object` has a property named by `property`, but with a value\n\
   * different from that given by `value`. `property` can use dot- and\n\
   * bracket-notation for deep reference.\n\
   *\n\
   *     assert.deepPropertyNotVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');\n\
   *\n\
   * @name deepPropertyNotVal\n\
   * @param {Object} object\n\
   * @param {String} property\n\
   * @param {Mixed} value\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.deepPropertyNotVal = function (obj, prop, val, msg) {\n\
    new Assertion(obj, msg).to.not.have.deep.property(prop, val);\n\
  };\n\
\n\
  /**\n\
   * ### .lengthOf(object, length, [message])\n\
   *\n\
   * Asserts that `object` has a `length` property with the expected value.\n\
   *\n\
   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');\n\
   *     assert.lengthOf('foobar', 5, 'string has length of 6');\n\
   *\n\
   * @name lengthOf\n\
   * @param {Mixed} object\n\
   * @param {Number} length\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.lengthOf = function (exp, len, msg) {\n\
    new Assertion(exp, msg).to.have.length(len);\n\
  };\n\
\n\
  /**\n\
   * ### .throws(function, [constructor/string/regexp], [string/regexp], [message])\n\
   *\n\
   * Asserts that `function` will throw an error that is an instance of\n\
   * `constructor`, or alternately that it will throw an error with message\n\
   * matching `regexp`.\n\
   *\n\
   *     assert.throw(fn, 'function throws a reference error');\n\
   *     assert.throw(fn, /function throws a reference error/);\n\
   *     assert.throw(fn, ReferenceError);\n\
   *     assert.throw(fn, ReferenceError, 'function throws a reference error');\n\
   *     assert.throw(fn, ReferenceError, /function throws a reference error/);\n\
   *\n\
   * @name throws\n\
   * @alias throw\n\
   * @alias Throw\n\
   * @param {Function} function\n\
   * @param {ErrorConstructor} constructor\n\
   * @param {RegExp} regexp\n\
   * @param {String} message\n\
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types\n\
   * @api public\n\
   */\n\
\n\
  assert.Throw = function (fn, errt, errs, msg) {\n\
    if ('string' === typeof errt || errt instanceof RegExp) {\n\
      errs = errt;\n\
      errt = null;\n\
    }\n\
\n\
    var assertErr = new Assertion(fn, msg).to.Throw(errt, errs);\n\
    return flag(assertErr, 'object');\n\
  };\n\
\n\
  /**\n\
   * ### .doesNotThrow(function, [constructor/regexp], [message])\n\
   *\n\
   * Asserts that `function` will _not_ throw an error that is an instance of\n\
   * `constructor`, or alternately that it will not throw an error with message\n\
   * matching `regexp`.\n\
   *\n\
   *     assert.doesNotThrow(fn, Error, 'function does not throw');\n\
   *\n\
   * @name doesNotThrow\n\
   * @param {Function} function\n\
   * @param {ErrorConstructor} constructor\n\
   * @param {RegExp} regexp\n\
   * @param {String} message\n\
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types\n\
   * @api public\n\
   */\n\
\n\
  assert.doesNotThrow = function (fn, type, msg) {\n\
    if ('string' === typeof type) {\n\
      msg = type;\n\
      type = null;\n\
    }\n\
\n\
    new Assertion(fn, msg).to.not.Throw(type);\n\
  };\n\
\n\
  /**\n\
   * ### .operator(val1, operator, val2, [message])\n\
   *\n\
   * Compares two values using `operator`.\n\
   *\n\
   *     assert.operator(1, '<', 2, 'everything is ok');\n\
   *     assert.operator(1, '>', 2, 'this will fail');\n\
   *\n\
   * @name operator\n\
   * @param {Mixed} val1\n\
   * @param {String} operator\n\
   * @param {Mixed} val2\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.operator = function (val, operator, val2, msg) {\n\
    if (!~['==', '===', '>', '>=', '<', '<=', '!=', '!=='].indexOf(operator)) {\n\
      throw new Error('Invalid operator \"' + operator + '\"');\n\
    }\n\
    var test = new Assertion(eval(val + operator + val2), msg);\n\
    test.assert(\n\
        true === flag(test, 'object')\n\
      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)\n\
      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );\n\
  };\n\
\n\
  /**\n\
   * ### .closeTo(actual, expected, delta, [message])\n\
   *\n\
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.\n\
   *\n\
   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');\n\
   *\n\
   * @name closeTo\n\
   * @param {Number} actual\n\
   * @param {Number} expected\n\
   * @param {Number} delta\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.closeTo = function (act, exp, delta, msg) {\n\
    new Assertion(act, msg).to.be.closeTo(exp, delta);\n\
  };\n\
\n\
  /**\n\
   * ### .sameMembers(set1, set2, [message])\n\
   *\n\
   * Asserts that `set1` and `set2` have the same members.\n\
   * Order is not taken into account.\n\
   *\n\
   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');\n\
   *\n\
   * @name sameMembers\n\
   * @param {Array} superset\n\
   * @param {Array} subset\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.sameMembers = function (set1, set2, msg) {\n\
    new Assertion(set1, msg).to.have.same.members(set2);\n\
  }\n\
\n\
  /**\n\
   * ### .includeMembers(superset, subset, [message])\n\
   *\n\
   * Asserts that `subset` is included in `superset`.\n\
   * Order is not taken into account.\n\
   *\n\
   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1 ], 'include members');\n\
   *\n\
   * @name includeMembers\n\
   * @param {Array} superset\n\
   * @param {Array} subset\n\
   * @param {String} message\n\
   * @api public\n\
   */\n\
\n\
  assert.includeMembers = function (superset, subset, msg) {\n\
    new Assertion(superset, msg).to.include.members(subset);\n\
  }\n\
\n\
  /*!\n\
   * Undocumented / untested\n\
   */\n\
\n\
  assert.ifError = function (val, msg) {\n\
    new Assertion(val, msg).to.not.be.ok;\n\
  };\n\
\n\
  /*!\n\
   * Aliases.\n\
   */\n\
\n\
  (function alias(name, as){\n\
    assert[as] = assert[name];\n\
    return alias;\n\
  })\n\
  ('Throw', 'throw')\n\
  ('Throw', 'throws');\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/interface/assert.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/interface/expect.js", Function("exports, module",
"/*!\n\
 * chai\n\
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
module.exports = function (chai, util) {\n\
  chai.expect = function (val, message) {\n\
    return new chai.Assertion(val, message);\n\
  };\n\
};\n\
\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/interface/expect.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/interface/should.js", Function("exports, module",
"/*!\n\
 * chai\n\
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
module.exports = function (chai, util) {\n\
  var Assertion = chai.Assertion;\n\
\n\
  function loadShould () {\n\
    // explicitly define this method as function as to have it's name to include as `ssfi`\n\
    function shouldGetter() {\n\
      if (this instanceof String || this instanceof Number) {\n\
        return new Assertion(this.constructor(this), null, shouldGetter);\n\
      } else if (this instanceof Boolean) {\n\
        return new Assertion(this == true, null, shouldGetter);\n\
      }\n\
      return new Assertion(this, null, shouldGetter);\n\
    }\n\
    function shouldSetter(value) {\n\
      // See https://github.com/chaijs/chai/issues/86: this makes\n\
      // `whatever.should = someValue` actually set `someValue`, which is\n\
      // especially useful for `global.should = require('chai').should()`.\n\
      //\n\
      // Note that we have to use [[DefineProperty]] instead of [[Put]]\n\
      // since otherwise we would trigger this very setter!\n\
      Object.defineProperty(this, 'should', {\n\
        value: value,\n\
        enumerable: true,\n\
        configurable: true,\n\
        writable: true\n\
      });\n\
    }\n\
    // modify Object.prototype to have `should`\n\
    Object.defineProperty(Object.prototype, 'should', {\n\
      set: shouldSetter\n\
      , get: shouldGetter\n\
      , configurable: true\n\
    });\n\
\n\
    var should = {};\n\
\n\
    should.equal = function (val1, val2, msg) {\n\
      new Assertion(val1, msg).to.equal(val2);\n\
    };\n\
\n\
    should.Throw = function (fn, errt, errs, msg) {\n\
      new Assertion(fn, msg).to.Throw(errt, errs);\n\
    };\n\
\n\
    should.exist = function (val, msg) {\n\
      new Assertion(val, msg).to.exist;\n\
    }\n\
\n\
    // negation\n\
    should.not = {}\n\
\n\
    should.not.equal = function (val1, val2, msg) {\n\
      new Assertion(val1, msg).to.not.equal(val2);\n\
    };\n\
\n\
    should.not.Throw = function (fn, errt, errs, msg) {\n\
      new Assertion(fn, msg).to.not.Throw(errt, errs);\n\
    };\n\
\n\
    should.not.exist = function (val, msg) {\n\
      new Assertion(val, msg).to.not.exist;\n\
    }\n\
\n\
    should['throw'] = should['Throw'];\n\
    should.not['throw'] = should.not['Throw'];\n\
\n\
    return should;\n\
  };\n\
\n\
  chai.should = loadShould;\n\
  chai.Should = loadShould;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/interface/should.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/addChainableMethod.js", Function("exports, module",
"/*!\n\
 * Chai - addChainingMethod utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Module dependencies\n\
 */\n\
\n\
var transferFlags = require(\"chaijs~chai@1.9.1/lib/chai/utils/transferFlags.js\");\n\
var flag = require(\"chaijs~chai@1.9.1/lib/chai/utils/flag.js\");\n\
var config = require(\"chaijs~chai@1.9.1/lib/chai/config.js\");\n\
\n\
/*!\n\
 * Module variables\n\
 */\n\
\n\
// Check whether `__proto__` is supported\n\
var hasProtoSupport = '__proto__' in Object;\n\
\n\
// Without `__proto__` support, this module will need to add properties to a function.\n\
// However, some Function.prototype methods cannot be overwritten,\n\
// and there seems no easy cross-platform way to detect them (@see chaijs/chai/issues/69).\n\
var excludeNames = /^(?:length|name|arguments|caller)$/;\n\
\n\
// Cache `Function` properties\n\
var call  = Function.prototype.call,\n\
    apply = Function.prototype.apply;\n\
\n\
/**\n\
 * ### addChainableMethod (ctx, name, method, chainingBehavior)\n\
 *\n\
 * Adds a method to an object, such that the method can also be chained.\n\
 *\n\
 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {\n\
 *       var obj = utils.flag(this, 'object');\n\
 *       new chai.Assertion(obj).to.be.equal(str);\n\
 *     });\n\
 *\n\
 * Can also be accessed directly from `chai.Assertion`.\n\
 *\n\
 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);\n\
 *\n\
 * The result can then be used as both a method assertion, executing both `method` and\n\
 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.\n\
 *\n\
 *     expect(fooStr).to.be.foo('bar');\n\
 *     expect(fooStr).to.be.foo.equal('foo');\n\
 *\n\
 * @param {Object} ctx object to which the method is added\n\
 * @param {String} name of method to add\n\
 * @param {Function} method function to be used for `name`, when called\n\
 * @param {Function} chainingBehavior function to be called every time the property is accessed\n\
 * @name addChainableMethod\n\
 * @api public\n\
 */\n\
\n\
module.exports = function (ctx, name, method, chainingBehavior) {\n\
  if (typeof chainingBehavior !== 'function') {\n\
    chainingBehavior = function () { };\n\
  }\n\
\n\
  var chainableBehavior = {\n\
      method: method\n\
    , chainingBehavior: chainingBehavior\n\
  };\n\
\n\
  // save the methods so we can overwrite them later, if we need to.\n\
  if (!ctx.__methods) {\n\
    ctx.__methods = {};\n\
  }\n\
  ctx.__methods[name] = chainableBehavior;\n\
\n\
  Object.defineProperty(ctx, name,\n\
    { get: function () {\n\
        chainableBehavior.chainingBehavior.call(this);\n\
\n\
        var assert = function assert() {\n\
          var old_ssfi = flag(this, 'ssfi');\n\
          if (old_ssfi && config.includeStack === false)\n\
            flag(this, 'ssfi', assert);\n\
          var result = chainableBehavior.method.apply(this, arguments);\n\
          return result === undefined ? this : result;\n\
        };\n\
\n\
        // Use `__proto__` if available\n\
        if (hasProtoSupport) {\n\
          // Inherit all properties from the object by replacing the `Function` prototype\n\
          var prototype = assert.__proto__ = Object.create(this);\n\
          // Restore the `call` and `apply` methods from `Function`\n\
          prototype.call = call;\n\
          prototype.apply = apply;\n\
        }\n\
        // Otherwise, redefine all properties (slow!)\n\
        else {\n\
          var asserterNames = Object.getOwnPropertyNames(ctx);\n\
          asserterNames.forEach(function (asserterName) {\n\
            if (!excludeNames.test(asserterName)) {\n\
              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);\n\
              Object.defineProperty(assert, asserterName, pd);\n\
            }\n\
          });\n\
        }\n\
\n\
        transferFlags(this, assert);\n\
        return assert;\n\
      }\n\
    , configurable: true\n\
  });\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/addChainableMethod.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/addMethod.js", Function("exports, module",
"/*!\n\
 * Chai - addMethod utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
var config = require(\"chaijs~chai@1.9.1/lib/chai/config.js\");\n\
\n\
/**\n\
 * ### .addMethod (ctx, name, method)\n\
 *\n\
 * Adds a method to the prototype of an object.\n\
 *\n\
 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {\n\
 *       var obj = utils.flag(this, 'object');\n\
 *       new chai.Assertion(obj).to.be.equal(str);\n\
 *     });\n\
 *\n\
 * Can also be accessed directly from `chai.Assertion`.\n\
 *\n\
 *     chai.Assertion.addMethod('foo', fn);\n\
 *\n\
 * Then can be used as any other assertion.\n\
 *\n\
 *     expect(fooStr).to.be.foo('bar');\n\
 *\n\
 * @param {Object} ctx object to which the method is added\n\
 * @param {String} name of method to add\n\
 * @param {Function} method function to be used for name\n\
 * @name addMethod\n\
 * @api public\n\
 */\n\
var flag = require(\"chaijs~chai@1.9.1/lib/chai/utils/flag.js\");\n\
\n\
module.exports = function (ctx, name, method) {\n\
  ctx[name] = function () {\n\
    var old_ssfi = flag(this, 'ssfi');\n\
    if (old_ssfi && config.includeStack === false)\n\
      flag(this, 'ssfi', ctx[name]);\n\
    var result = method.apply(this, arguments);\n\
    return result === undefined ? this : result;\n\
  };\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/addMethod.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/addProperty.js", Function("exports, module",
"/*!\n\
 * Chai - addProperty utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### addProperty (ctx, name, getter)\n\
 *\n\
 * Adds a property to the prototype of an object.\n\
 *\n\
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {\n\
 *       var obj = utils.flag(this, 'object');\n\
 *       new chai.Assertion(obj).to.be.instanceof(Foo);\n\
 *     });\n\
 *\n\
 * Can also be accessed directly from `chai.Assertion`.\n\
 *\n\
 *     chai.Assertion.addProperty('foo', fn);\n\
 *\n\
 * Then can be used as any other assertion.\n\
 *\n\
 *     expect(myFoo).to.be.foo;\n\
 *\n\
 * @param {Object} ctx object to which the property is added\n\
 * @param {String} name of property to add\n\
 * @param {Function} getter function to be used for name\n\
 * @name addProperty\n\
 * @api public\n\
 */\n\
\n\
module.exports = function (ctx, name, getter) {\n\
  Object.defineProperty(ctx, name,\n\
    { get: function () {\n\
        var result = getter.call(this);\n\
        return result === undefined ? this : result;\n\
      }\n\
    , configurable: true\n\
  });\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/addProperty.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/flag.js", Function("exports, module",
"/*!\n\
 * Chai - flag utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### flag(object ,key, [value])\n\
 *\n\
 * Get or set a flag value on an object. If a\n\
 * value is provided it will be set, else it will\n\
 * return the currently set value or `undefined` if\n\
 * the value is not set.\n\
 *\n\
 *     utils.flag(this, 'foo', 'bar'); // setter\n\
 *     utils.flag(this, 'foo'); // getter, returns `bar`\n\
 *\n\
 * @param {Object} object (constructed Assertion\n\
 * @param {String} key\n\
 * @param {Mixed} value (optional)\n\
 * @name flag\n\
 * @api private\n\
 */\n\
\n\
module.exports = function (obj, key, value) {\n\
  var flags = obj.__flags || (obj.__flags = Object.create(null));\n\
  if (arguments.length === 3) {\n\
    flags[key] = value;\n\
  } else {\n\
    return flags[key];\n\
  }\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/flag.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/getActual.js", Function("exports, module",
"/*!\n\
 * Chai - getActual utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * # getActual(object, [actual])\n\
 *\n\
 * Returns the `actual` value for an Assertion\n\
 *\n\
 * @param {Object} object (constructed Assertion)\n\
 * @param {Arguments} chai.Assertion.prototype.assert arguments\n\
 */\n\
\n\
module.exports = function (obj, args) {\n\
  return args.length > 4 ? args[4] : obj._obj;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/getActual.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/getEnumerableProperties.js", Function("exports, module",
"/*!\n\
 * Chai - getEnumerableProperties utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### .getEnumerableProperties(object)\n\
 *\n\
 * This allows the retrieval of enumerable property names of an object,\n\
 * inherited or not.\n\
 *\n\
 * @param {Object} object\n\
 * @returns {Array}\n\
 * @name getEnumerableProperties\n\
 * @api public\n\
 */\n\
\n\
module.exports = function getEnumerableProperties(object) {\n\
  var result = [];\n\
  for (var name in object) {\n\
    result.push(name);\n\
  }\n\
  return result;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/getEnumerableProperties.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/getMessage.js", Function("exports, module",
"/*!\n\
 * Chai - message composition utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Module dependancies\n\
 */\n\
\n\
var flag = require(\"chaijs~chai@1.9.1/lib/chai/utils/flag.js\")\n\
  , getActual = require(\"chaijs~chai@1.9.1/lib/chai/utils/getActual.js\")\n\
  , inspect = require(\"chaijs~chai@1.9.1/lib/chai/utils/inspect.js\")\n\
  , objDisplay = require(\"chaijs~chai@1.9.1/lib/chai/utils/objDisplay.js\");\n\
\n\
/**\n\
 * ### .getMessage(object, message, negateMessage)\n\
 *\n\
 * Construct the error message based on flags\n\
 * and template tags. Template tags will return\n\
 * a stringified inspection of the object referenced.\n\
 *\n\
 * Message template tags:\n\
 * - `#{this}` current asserted object\n\
 * - `#{act}` actual value\n\
 * - `#{exp}` expected value\n\
 *\n\
 * @param {Object} object (constructed Assertion)\n\
 * @param {Arguments} chai.Assertion.prototype.assert arguments\n\
 * @name getMessage\n\
 * @api public\n\
 */\n\
\n\
module.exports = function (obj, args) {\n\
  var negate = flag(obj, 'negate')\n\
    , val = flag(obj, 'object')\n\
    , expected = args[3]\n\
    , actual = getActual(obj, args)\n\
    , msg = negate ? args[2] : args[1]\n\
    , flagMsg = flag(obj, 'message');\n\
\n\
  msg = msg || '';\n\
  msg = msg\n\
    .replace(/#{this}/g, objDisplay(val))\n\
    .replace(/#{act}/g, objDisplay(actual))\n\
    .replace(/#{exp}/g, objDisplay(expected));\n\
\n\
  return flagMsg ? flagMsg + ': ' + msg : msg;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/getMessage.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/getName.js", Function("exports, module",
"/*!\n\
 * Chai - getName utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * # getName(func)\n\
 *\n\
 * Gets the name of a function, in a cross-browser way.\n\
 *\n\
 * @param {Function} a function (usually a constructor)\n\
 */\n\
\n\
module.exports = function (func) {\n\
  if (func.name) return func.name;\n\
\n\
  var match = /^\\s?function ([^(]*)\\(/.exec(func);\n\
  return match && match[1] ? match[1] : \"\";\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/getName.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/getPathValue.js", Function("exports, module",
"/*!\n\
 * Chai - getPathValue utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * @see https://github.com/logicalparadox/filtr\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### .getPathValue(path, object)\n\
 *\n\
 * This allows the retrieval of values in an\n\
 * object given a string path.\n\
 *\n\
 *     var obj = {\n\
 *         prop1: {\n\
 *             arr: ['a', 'b', 'c']\n\
 *           , str: 'Hello'\n\
 *         }\n\
 *       , prop2: {\n\
 *             arr: [ { nested: 'Universe' } ]\n\
 *           , str: 'Hello again!'\n\
 *         }\n\
 *     }\n\
 *\n\
 * The following would be the results.\n\
 *\n\
 *     getPathValue('prop1.str', obj); // Hello\n\
 *     getPathValue('prop1.att[2]', obj); // b\n\
 *     getPathValue('prop2.arr[0].nested', obj); // Universe\n\
 *\n\
 * @param {String} path\n\
 * @param {Object} object\n\
 * @returns {Object} value or `undefined`\n\
 * @name getPathValue\n\
 * @api public\n\
 */\n\
\n\
var getPathValue = module.exports = function (path, obj) {\n\
  var parsed = parsePath(path);\n\
  return _getPathValue(parsed, obj);\n\
};\n\
\n\
/*!\n\
 * ## parsePath(path)\n\
 *\n\
 * Helper function used to parse string object\n\
 * paths. Use in conjunction with `_getPathValue`.\n\
 *\n\
 *      var parsed = parsePath('myobject.property.subprop');\n\
 *\n\
 * ### Paths:\n\
 *\n\
 * * Can be as near infinitely deep and nested\n\
 * * Arrays are also valid using the formal `myobject.document[3].property`.\n\
 *\n\
 * @param {String} path\n\
 * @returns {Object} parsed\n\
 * @api private\n\
 */\n\
\n\
function parsePath (path) {\n\
  var str = path.replace(/\\[/g, '.[')\n\
    , parts = str.match(/(\\\\\\.|[^.]+?)+/g);\n\
  return parts.map(function (value) {\n\
    var re = /\\[(\\d+)\\]$/\n\
      , mArr = re.exec(value)\n\
    if (mArr) return { i: parseFloat(mArr[1]) };\n\
    else return { p: value };\n\
  });\n\
};\n\
\n\
/*!\n\
 * ## _getPathValue(parsed, obj)\n\
 *\n\
 * Helper companion function for `.parsePath` that returns\n\
 * the value located at the parsed address.\n\
 *\n\
 *      var value = getPathValue(parsed, obj);\n\
 *\n\
 * @param {Object} parsed definition from `parsePath`.\n\
 * @param {Object} object to search against\n\
 * @returns {Object|Undefined} value\n\
 * @api private\n\
 */\n\
\n\
function _getPathValue (parsed, obj) {\n\
  var tmp = obj\n\
    , res;\n\
  for (var i = 0, l = parsed.length; i < l; i++) {\n\
    var part = parsed[i];\n\
    if (tmp) {\n\
      if ('undefined' !== typeof part.p)\n\
        tmp = tmp[part.p];\n\
      else if ('undefined' !== typeof part.i)\n\
        tmp = tmp[part.i];\n\
      if (i == (l - 1)) res = tmp;\n\
    } else {\n\
      res = undefined;\n\
    }\n\
  }\n\
  return res;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/getPathValue.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/getProperties.js", Function("exports, module",
"/*!\n\
 * Chai - getProperties utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### .getProperties(object)\n\
 *\n\
 * This allows the retrieval of property names of an object, enumerable or not,\n\
 * inherited or not.\n\
 *\n\
 * @param {Object} object\n\
 * @returns {Array}\n\
 * @name getProperties\n\
 * @api public\n\
 */\n\
\n\
module.exports = function getProperties(object) {\n\
  var result = Object.getOwnPropertyNames(subject);\n\
\n\
  function addProperty(property) {\n\
    if (result.indexOf(property) === -1) {\n\
      result.push(property);\n\
    }\n\
  }\n\
\n\
  var proto = Object.getPrototypeOf(subject);\n\
  while (proto !== null) {\n\
    Object.getOwnPropertyNames(proto).forEach(addProperty);\n\
    proto = Object.getPrototypeOf(proto);\n\
  }\n\
\n\
  return result;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/getProperties.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/index.js", Function("exports, module",
"/*!\n\
 * chai\n\
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Main exports\n\
 */\n\
\n\
var exports = module.exports = {};\n\
\n\
/*!\n\
 * test utility\n\
 */\n\
\n\
exports.test = require(\"chaijs~chai@1.9.1/lib/chai/utils/test.js\");\n\
\n\
/*!\n\
 * type utility\n\
 */\n\
\n\
exports.type = require(\"chaijs~chai@1.9.1/lib/chai/utils/type.js\");\n\
\n\
/*!\n\
 * message utility\n\
 */\n\
\n\
exports.getMessage = require(\"chaijs~chai@1.9.1/lib/chai/utils/getMessage.js\");\n\
\n\
/*!\n\
 * actual utility\n\
 */\n\
\n\
exports.getActual = require(\"chaijs~chai@1.9.1/lib/chai/utils/getActual.js\");\n\
\n\
/*!\n\
 * Inspect util\n\
 */\n\
\n\
exports.inspect = require(\"chaijs~chai@1.9.1/lib/chai/utils/inspect.js\");\n\
\n\
/*!\n\
 * Object Display util\n\
 */\n\
\n\
exports.objDisplay = require(\"chaijs~chai@1.9.1/lib/chai/utils/objDisplay.js\");\n\
\n\
/*!\n\
 * Flag utility\n\
 */\n\
\n\
exports.flag = require(\"chaijs~chai@1.9.1/lib/chai/utils/flag.js\");\n\
\n\
/*!\n\
 * Flag transferring utility\n\
 */\n\
\n\
exports.transferFlags = require(\"chaijs~chai@1.9.1/lib/chai/utils/transferFlags.js\");\n\
\n\
/*!\n\
 * Deep equal utility\n\
 */\n\
\n\
exports.eql = require(\"chaijs~deep-eql@0.1.3\");\n\
\n\
/*!\n\
 * Deep path value\n\
 */\n\
\n\
exports.getPathValue = require(\"chaijs~chai@1.9.1/lib/chai/utils/getPathValue.js\");\n\
\n\
/*!\n\
 * Function name\n\
 */\n\
\n\
exports.getName = require(\"chaijs~chai@1.9.1/lib/chai/utils/getName.js\");\n\
\n\
/*!\n\
 * add Property\n\
 */\n\
\n\
exports.addProperty = require(\"chaijs~chai@1.9.1/lib/chai/utils/addProperty.js\");\n\
\n\
/*!\n\
 * add Method\n\
 */\n\
\n\
exports.addMethod = require(\"chaijs~chai@1.9.1/lib/chai/utils/addMethod.js\");\n\
\n\
/*!\n\
 * overwrite Property\n\
 */\n\
\n\
exports.overwriteProperty = require(\"chaijs~chai@1.9.1/lib/chai/utils/overwriteProperty.js\");\n\
\n\
/*!\n\
 * overwrite Method\n\
 */\n\
\n\
exports.overwriteMethod = require(\"chaijs~chai@1.9.1/lib/chai/utils/overwriteMethod.js\");\n\
\n\
/*!\n\
 * Add a chainable method\n\
 */\n\
\n\
exports.addChainableMethod = require(\"chaijs~chai@1.9.1/lib/chai/utils/addChainableMethod.js\");\n\
\n\
/*!\n\
 * Overwrite chainable method\n\
 */\n\
\n\
exports.overwriteChainableMethod = require(\"chaijs~chai@1.9.1/lib/chai/utils/overwriteChainableMethod.js\");\n\
\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/index.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/inspect.js", Function("exports, module",
"// This is (almost) directly from Node.js utils\n\
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js\n\
\n\
var getName = require(\"chaijs~chai@1.9.1/lib/chai/utils/getName.js\");\n\
var getProperties = require(\"chaijs~chai@1.9.1/lib/chai/utils/getProperties.js\");\n\
var getEnumerableProperties = require(\"chaijs~chai@1.9.1/lib/chai/utils/getEnumerableProperties.js\");\n\
\n\
module.exports = inspect;\n\
\n\
/**\n\
 * Echos the value of a value. Trys to print the value out\n\
 * in the best way possible given the different types.\n\
 *\n\
 * @param {Object} obj The object to print out.\n\
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)\n\
 *    properties of objects.\n\
 * @param {Number} depth Depth in which to descend in object. Default is 2.\n\
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the\n\
 *    output. Default is false (no coloring).\n\
 */\n\
function inspect(obj, showHidden, depth, colors) {\n\
  var ctx = {\n\
    showHidden: showHidden,\n\
    seen: [],\n\
    stylize: function (str) { return str; }\n\
  };\n\
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));\n\
}\n\
\n\
// https://gist.github.com/1044128/\n\
var getOuterHTML = function(element) {\n\
  if ('outerHTML' in element) return element.outerHTML;\n\
  var ns = \"http://www.w3.org/1999/xhtml\";\n\
  var container = document.createElementNS(ns, '_');\n\
  var elemProto = (window.HTMLElement || window.Element).prototype;\n\
  var xmlSerializer = new XMLSerializer();\n\
  var html;\n\
  if (document.xmlVersion) {\n\
    return xmlSerializer.serializeToString(element);\n\
  } else {\n\
    container.appendChild(element.cloneNode(false));\n\
    html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');\n\
    container.innerHTML = '';\n\
    return html;\n\
  }\n\
};\n\
\n\
// Returns true if object is a DOM element.\n\
var isDOMElement = function (object) {\n\
  if (typeof HTMLElement === 'object') {\n\
    return object instanceof HTMLElement;\n\
  } else {\n\
    return object &&\n\
      typeof object === 'object' &&\n\
      object.nodeType === 1 &&\n\
      typeof object.nodeName === 'string';\n\
  }\n\
};\n\
\n\
function formatValue(ctx, value, recurseTimes) {\n\
  // Provide a hook for user-specified inspect functions.\n\
  // Check that value is an object with an inspect function on it\n\
  if (value && typeof value.inspect === 'function' &&\n\
      // Filter out the util module, it's inspect function is special\n\
      value.inspect !== exports.inspect &&\n\
      // Also filter out any prototype objects using the circular check.\n\
      !(value.constructor && value.constructor.prototype === value)) {\n\
    var ret = value.inspect(recurseTimes);\n\
    if (typeof ret !== 'string') {\n\
      ret = formatValue(ctx, ret, recurseTimes);\n\
    }\n\
    return ret;\n\
  }\n\
\n\
  // Primitive types cannot have properties\n\
  var primitive = formatPrimitive(ctx, value);\n\
  if (primitive) {\n\
    return primitive;\n\
  }\n\
\n\
  // If it's DOM elem, get outer HTML.\n\
  if (isDOMElement(value)) {\n\
    return getOuterHTML(value);\n\
  }\n\
\n\
  // Look up the keys of the object.\n\
  var visibleKeys = getEnumerableProperties(value);\n\
  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;\n\
\n\
  // Some type of object without properties can be shortcutted.\n\
  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,\n\
  // a `stack` plus `description` property; ignore those for consistency.\n\
  if (keys.length === 0 || (isError(value) && (\n\
      (keys.length === 1 && keys[0] === 'stack') ||\n\
      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')\n\
     ))) {\n\
    if (typeof value === 'function') {\n\
      var name = getName(value);\n\
      var nameSuffix = name ? ': ' + name : '';\n\
      return ctx.stylize('[Function' + nameSuffix + ']', 'special');\n\
    }\n\
    if (isRegExp(value)) {\n\
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');\n\
    }\n\
    if (isDate(value)) {\n\
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');\n\
    }\n\
    if (isError(value)) {\n\
      return formatError(value);\n\
    }\n\
  }\n\
\n\
  var base = '', array = false, braces = ['{', '}'];\n\
\n\
  // Make Array say that they are Array\n\
  if (isArray(value)) {\n\
    array = true;\n\
    braces = ['[', ']'];\n\
  }\n\
\n\
  // Make functions say that they are functions\n\
  if (typeof value === 'function') {\n\
    var name = getName(value);\n\
    var nameSuffix = name ? ': ' + name : '';\n\
    base = ' [Function' + nameSuffix + ']';\n\
  }\n\
\n\
  // Make RegExps say that they are RegExps\n\
  if (isRegExp(value)) {\n\
    base = ' ' + RegExp.prototype.toString.call(value);\n\
  }\n\
\n\
  // Make dates with properties first say the date\n\
  if (isDate(value)) {\n\
    base = ' ' + Date.prototype.toUTCString.call(value);\n\
  }\n\
\n\
  // Make error with message first say the error\n\
  if (isError(value)) {\n\
    return formatError(value);\n\
  }\n\
\n\
  if (keys.length === 0 && (!array || value.length == 0)) {\n\
    return braces[0] + base + braces[1];\n\
  }\n\
\n\
  if (recurseTimes < 0) {\n\
    if (isRegExp(value)) {\n\
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');\n\
    } else {\n\
      return ctx.stylize('[Object]', 'special');\n\
    }\n\
  }\n\
\n\
  ctx.seen.push(value);\n\
\n\
  var output;\n\
  if (array) {\n\
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);\n\
  } else {\n\
    output = keys.map(function(key) {\n\
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);\n\
    });\n\
  }\n\
\n\
  ctx.seen.pop();\n\
\n\
  return reduceToSingleString(output, base, braces);\n\
}\n\
\n\
\n\
function formatPrimitive(ctx, value) {\n\
  switch (typeof value) {\n\
    case 'undefined':\n\
      return ctx.stylize('undefined', 'undefined');\n\
\n\
    case 'string':\n\
      var simple = '\\'' + JSON.stringify(value).replace(/^\"|\"$/g, '')\n\
                                               .replace(/'/g, \"\\\\'\")\n\
                                               .replace(/\\\\\"/g, '\"') + '\\'';\n\
      return ctx.stylize(simple, 'string');\n\
\n\
    case 'number':\n\
      return ctx.stylize('' + value, 'number');\n\
\n\
    case 'boolean':\n\
      return ctx.stylize('' + value, 'boolean');\n\
  }\n\
  // For some reason typeof null is \"object\", so special case here.\n\
  if (value === null) {\n\
    return ctx.stylize('null', 'null');\n\
  }\n\
}\n\
\n\
\n\
function formatError(value) {\n\
  return '[' + Error.prototype.toString.call(value) + ']';\n\
}\n\
\n\
\n\
function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {\n\
  var output = [];\n\
  for (var i = 0, l = value.length; i < l; ++i) {\n\
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {\n\
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,\n\
          String(i), true));\n\
    } else {\n\
      output.push('');\n\
    }\n\
  }\n\
  keys.forEach(function(key) {\n\
    if (!key.match(/^\\d+$/)) {\n\
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,\n\
          key, true));\n\
    }\n\
  });\n\
  return output;\n\
}\n\
\n\
\n\
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {\n\
  var name, str;\n\
  if (value.__lookupGetter__) {\n\
    if (value.__lookupGetter__(key)) {\n\
      if (value.__lookupSetter__(key)) {\n\
        str = ctx.stylize('[Getter/Setter]', 'special');\n\
      } else {\n\
        str = ctx.stylize('[Getter]', 'special');\n\
      }\n\
    } else {\n\
      if (value.__lookupSetter__(key)) {\n\
        str = ctx.stylize('[Setter]', 'special');\n\
      }\n\
    }\n\
  }\n\
  if (visibleKeys.indexOf(key) < 0) {\n\
    name = '[' + key + ']';\n\
  }\n\
  if (!str) {\n\
    if (ctx.seen.indexOf(value[key]) < 0) {\n\
      if (recurseTimes === null) {\n\
        str = formatValue(ctx, value[key], null);\n\
      } else {\n\
        str = formatValue(ctx, value[key], recurseTimes - 1);\n\
      }\n\
      if (str.indexOf('\\n\
') > -1) {\n\
        if (array) {\n\
          str = str.split('\\n\
').map(function(line) {\n\
            return '  ' + line;\n\
          }).join('\\n\
').substr(2);\n\
        } else {\n\
          str = '\\n\
' + str.split('\\n\
').map(function(line) {\n\
            return '   ' + line;\n\
          }).join('\\n\
');\n\
        }\n\
      }\n\
    } else {\n\
      str = ctx.stylize('[Circular]', 'special');\n\
    }\n\
  }\n\
  if (typeof name === 'undefined') {\n\
    if (array && key.match(/^\\d+$/)) {\n\
      return str;\n\
    }\n\
    name = JSON.stringify('' + key);\n\
    if (name.match(/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)) {\n\
      name = name.substr(1, name.length - 2);\n\
      name = ctx.stylize(name, 'name');\n\
    } else {\n\
      name = name.replace(/'/g, \"\\\\'\")\n\
                 .replace(/\\\\\"/g, '\"')\n\
                 .replace(/(^\"|\"$)/g, \"'\");\n\
      name = ctx.stylize(name, 'string');\n\
    }\n\
  }\n\
\n\
  return name + ': ' + str;\n\
}\n\
\n\
\n\
function reduceToSingleString(output, base, braces) {\n\
  var numLinesEst = 0;\n\
  var length = output.reduce(function(prev, cur) {\n\
    numLinesEst++;\n\
    if (cur.indexOf('\\n\
') >= 0) numLinesEst++;\n\
    return prev + cur.length + 1;\n\
  }, 0);\n\
\n\
  if (length > 60) {\n\
    return braces[0] +\n\
           (base === '' ? '' : base + '\\n\
 ') +\n\
           ' ' +\n\
           output.join(',\\n\
  ') +\n\
           ' ' +\n\
           braces[1];\n\
  }\n\
\n\
  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];\n\
}\n\
\n\
function isArray(ar) {\n\
  return Array.isArray(ar) ||\n\
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');\n\
}\n\
\n\
function isRegExp(re) {\n\
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';\n\
}\n\
\n\
function isDate(d) {\n\
  return typeof d === 'object' && objectToString(d) === '[object Date]';\n\
}\n\
\n\
function isError(e) {\n\
  return typeof e === 'object' && objectToString(e) === '[object Error]';\n\
}\n\
\n\
function objectToString(o) {\n\
  return Object.prototype.toString.call(o);\n\
}\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/inspect.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/objDisplay.js", Function("exports, module",
"/*!\n\
 * Chai - flag utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Module dependancies\n\
 */\n\
\n\
var inspect = require(\"chaijs~chai@1.9.1/lib/chai/utils/inspect.js\");\n\
var config = require(\"chaijs~chai@1.9.1/lib/chai/config.js\");\n\
\n\
/**\n\
 * ### .objDisplay (object)\n\
 *\n\
 * Determines if an object or an array matches\n\
 * criteria to be inspected in-line for error\n\
 * messages or should be truncated.\n\
 *\n\
 * @param {Mixed} javascript object to inspect\n\
 * @name objDisplay\n\
 * @api public\n\
 */\n\
\n\
module.exports = function (obj) {\n\
  var str = inspect(obj)\n\
    , type = Object.prototype.toString.call(obj);\n\
\n\
  if (config.truncateThreshold && str.length >= config.truncateThreshold) {\n\
    if (type === '[object Function]') {\n\
      return !obj.name || obj.name === ''\n\
        ? '[Function]'\n\
        : '[Function: ' + obj.name + ']';\n\
    } else if (type === '[object Array]') {\n\
      return '[ Array(' + obj.length + ') ]';\n\
    } else if (type === '[object Object]') {\n\
      var keys = Object.keys(obj)\n\
        , kstr = keys.length > 2\n\
          ? keys.splice(0, 2).join(', ') + ', ...'\n\
          : keys.join(', ');\n\
      return '{ Object (' + kstr + ') }';\n\
    } else {\n\
      return str;\n\
    }\n\
  } else {\n\
    return str;\n\
  }\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/objDisplay.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/overwriteMethod.js", Function("exports, module",
"/*!\n\
 * Chai - overwriteMethod utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### overwriteMethod (ctx, name, fn)\n\
 *\n\
 * Overwites an already existing method and provides\n\
 * access to previous function. Must return function\n\
 * to be used for name.\n\
 *\n\
 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {\n\
 *       return function (str) {\n\
 *         var obj = utils.flag(this, 'object');\n\
 *         if (obj instanceof Foo) {\n\
 *           new chai.Assertion(obj.value).to.equal(str);\n\
 *         } else {\n\
 *           _super.apply(this, arguments);\n\
 *         }\n\
 *       }\n\
 *     });\n\
 *\n\
 * Can also be accessed directly from `chai.Assertion`.\n\
 *\n\
 *     chai.Assertion.overwriteMethod('foo', fn);\n\
 *\n\
 * Then can be used as any other assertion.\n\
 *\n\
 *     expect(myFoo).to.equal('bar');\n\
 *\n\
 * @param {Object} ctx object whose method is to be overwritten\n\
 * @param {String} name of method to overwrite\n\
 * @param {Function} method function that returns a function to be used for name\n\
 * @name overwriteMethod\n\
 * @api public\n\
 */\n\
\n\
module.exports = function (ctx, name, method) {\n\
  var _method = ctx[name]\n\
    , _super = function () { return this; };\n\
\n\
  if (_method && 'function' === typeof _method)\n\
    _super = _method;\n\
\n\
  ctx[name] = function () {\n\
    var result = method(_super).apply(this, arguments);\n\
    return result === undefined ? this : result;\n\
  }\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/overwriteMethod.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/overwriteProperty.js", Function("exports, module",
"/*!\n\
 * Chai - overwriteProperty utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### overwriteProperty (ctx, name, fn)\n\
 *\n\
 * Overwites an already existing property getter and provides\n\
 * access to previous value. Must return function to use as getter.\n\
 *\n\
 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {\n\
 *       return function () {\n\
 *         var obj = utils.flag(this, 'object');\n\
 *         if (obj instanceof Foo) {\n\
 *           new chai.Assertion(obj.name).to.equal('bar');\n\
 *         } else {\n\
 *           _super.call(this);\n\
 *         }\n\
 *       }\n\
 *     });\n\
 *\n\
 *\n\
 * Can also be accessed directly from `chai.Assertion`.\n\
 *\n\
 *     chai.Assertion.overwriteProperty('foo', fn);\n\
 *\n\
 * Then can be used as any other assertion.\n\
 *\n\
 *     expect(myFoo).to.be.ok;\n\
 *\n\
 * @param {Object} ctx object whose property is to be overwritten\n\
 * @param {String} name of property to overwrite\n\
 * @param {Function} getter function that returns a getter function to be used for name\n\
 * @name overwriteProperty\n\
 * @api public\n\
 */\n\
\n\
module.exports = function (ctx, name, getter) {\n\
  var _get = Object.getOwnPropertyDescriptor(ctx, name)\n\
    , _super = function () {};\n\
\n\
  if (_get && 'function' === typeof _get.get)\n\
    _super = _get.get\n\
\n\
  Object.defineProperty(ctx, name,\n\
    { get: function () {\n\
        var result = getter(_super).call(this);\n\
        return result === undefined ? this : result;\n\
      }\n\
    , configurable: true\n\
  });\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/overwriteProperty.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/overwriteChainableMethod.js", Function("exports, module",
"/*!\n\
 * Chai - overwriteChainableMethod utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### overwriteChainableMethod (ctx, name, fn)\n\
 *\n\
 * Overwites an already existing chainable method\n\
 * and provides access to the previous function or\n\
 * property.  Must return functions to be used for\n\
 * name.\n\
 *\n\
 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'length',\n\
 *       function (_super) {\n\
 *       }\n\
 *     , function (_super) {\n\
 *       }\n\
 *     );\n\
 *\n\
 * Can also be accessed directly from `chai.Assertion`.\n\
 *\n\
 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);\n\
 *\n\
 * Then can be used as any other assertion.\n\
 *\n\
 *     expect(myFoo).to.have.length(3);\n\
 *     expect(myFoo).to.have.length.above(3);\n\
 *\n\
 * @param {Object} ctx object whose method / property is to be overwritten\n\
 * @param {String} name of method / property to overwrite\n\
 * @param {Function} method function that returns a function to be used for name\n\
 * @param {Function} chainingBehavior function that returns a function to be used for property\n\
 * @name overwriteChainableMethod\n\
 * @api public\n\
 */\n\
\n\
module.exports = function (ctx, name, method, chainingBehavior) {\n\
  var chainableBehavior = ctx.__methods[name];\n\
\n\
  var _chainingBehavior = chainableBehavior.chainingBehavior;\n\
  chainableBehavior.chainingBehavior = function () {\n\
    var result = chainingBehavior(_chainingBehavior).call(this);\n\
    return result === undefined ? this : result;\n\
  };\n\
\n\
  var _method = chainableBehavior.method;\n\
  chainableBehavior.method = function () {\n\
    var result = method(_method).apply(this, arguments);\n\
    return result === undefined ? this : result;\n\
  };\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/overwriteChainableMethod.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/test.js", Function("exports, module",
"/*!\n\
 * Chai - test utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Module dependancies\n\
 */\n\
\n\
var flag = require(\"chaijs~chai@1.9.1/lib/chai/utils/flag.js\");\n\
\n\
/**\n\
 * # test(object, expression)\n\
 *\n\
 * Test and object for expression.\n\
 *\n\
 * @param {Object} object (constructed Assertion)\n\
 * @param {Arguments} chai.Assertion.prototype.assert arguments\n\
 */\n\
\n\
module.exports = function (obj, args) {\n\
  var negate = flag(obj, 'negate')\n\
    , expr = args[0];\n\
  return negate ? !expr : expr;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/test.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/transferFlags.js", Function("exports, module",
"/*!\n\
 * Chai - transferFlags utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/**\n\
 * ### transferFlags(assertion, object, includeAll = true)\n\
 *\n\
 * Transfer all the flags for `assertion` to `object`. If\n\
 * `includeAll` is set to `false`, then the base Chai\n\
 * assertion flags (namely `object`, `ssfi`, and `message`)\n\
 * will not be transferred.\n\
 *\n\
 *\n\
 *     var newAssertion = new Assertion();\n\
 *     utils.transferFlags(assertion, newAssertion);\n\
 *\n\
 *     var anotherAsseriton = new Assertion(myObj);\n\
 *     utils.transferFlags(assertion, anotherAssertion, false);\n\
 *\n\
 * @param {Assertion} assertion the assertion to transfer the flags from\n\
 * @param {Object} object the object to transfer the flags too; usually a new assertion\n\
 * @param {Boolean} includeAll\n\
 * @name getAllFlags\n\
 * @api private\n\
 */\n\
\n\
module.exports = function (assertion, object, includeAll) {\n\
  var flags = assertion.__flags || (assertion.__flags = Object.create(null));\n\
\n\
  if (!object.__flags) {\n\
    object.__flags = Object.create(null);\n\
  }\n\
\n\
  includeAll = arguments.length === 3 ? includeAll : true;\n\
\n\
  for (var flag in flags) {\n\
    if (includeAll ||\n\
        (flag !== 'object' && flag !== 'ssfi' && flag != 'message')) {\n\
      object.__flags[flag] = flags[flag];\n\
    }\n\
  }\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/transferFlags.js"
));

require.register("chaijs~chai@1.9.1/lib/chai/utils/type.js", Function("exports, module",
"/*!\n\
 * Chai - type utility\n\
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>\n\
 * MIT Licensed\n\
 */\n\
\n\
/*!\n\
 * Detectable javascript natives\n\
 */\n\
\n\
var natives = {\n\
    '[object Arguments]': 'arguments'\n\
  , '[object Array]': 'array'\n\
  , '[object Date]': 'date'\n\
  , '[object Function]': 'function'\n\
  , '[object Number]': 'number'\n\
  , '[object RegExp]': 'regexp'\n\
  , '[object String]': 'string'\n\
};\n\
\n\
/**\n\
 * ### type(object)\n\
 *\n\
 * Better implementation of `typeof` detection that can\n\
 * be used cross-browser. Handles the inconsistencies of\n\
 * Array, `null`, and `undefined` detection.\n\
 *\n\
 *     utils.type({}) // 'object'\n\
 *     utils.type(null) // `null'\n\
 *     utils.type(undefined) // `undefined`\n\
 *     utils.type([]) // `array`\n\
 *\n\
 * @param {Mixed} object to detect type of\n\
 * @name type\n\
 * @api private\n\
 */\n\
\n\
module.exports = function (obj) {\n\
  var str = Object.prototype.toString.call(obj);\n\
  if (natives[str]) return natives[str];\n\
  if (obj === null) return 'null';\n\
  if (obj === undefined) return 'undefined';\n\
  if (obj === Object(obj)) return 'object';\n\
  return typeof obj;\n\
};\n\
\n\
//# sourceURL=components/chaijs/chai/1.9.1/lib/chai/utils/type.js"
));

require.modules["chaijs-chai"] = require.modules["chaijs~chai@1.9.1"];
require.modules["chaijs~chai"] = require.modules["chaijs~chai@1.9.1"];
require.modules["chai"] = require.modules["chaijs~chai@1.9.1"];


require.register("pluma~assimilate@0.3.0", Function("exports, module",
"/*! assimilate 0.3.0 Copyright (c) 2013 Alan Plum. MIT licensed. */\n\
var slice = Array.prototype.slice;\n\
\n\
function bind(fn, self) {\n\
    var args = slice.call(arguments, 2);\n\
    if (typeof Function.prototype.bind === 'function') {\n\
        return Function.prototype.bind.apply(fn, [self].concat(args));\n\
    }\n\
    return function() {\n\
        return fn.apply(self, args.concat(slice.call(arguments, 0)));\n\
    };\n\
}\n\
\n\
function simpleCopy(target, name, source) {\n\
    target[name] = source[name];\n\
}\n\
\n\
function properCopy(target, name, source) {\n\
    var descriptor = Object.getOwnPropertyDescriptor(source, name);\n\
    Object.defineProperty(target, name, descriptor);\n\
}\n\
\n\
function ownProperties(obj) {\n\
    return Object.getOwnPropertyNames(obj);\n\
}\n\
\n\
function allKeys(obj) {\n\
    var keys = [];\n\
    for (var name in obj) {\n\
        keys.push(name);\n\
    }\n\
    return keys;\n\
}\n\
\n\
function ownKeys(obj) {\n\
    var keys = [];\n\
    for (var name in obj) {\n\
        if (obj.hasOwnProperty(name)) {\n\
            keys.push(name);\n\
        }\n\
    }\n\
    return keys;\n\
}\n\
\n\
function assimilateWithStrategy(target) {\n\
    var strategy = this,\n\
    sources = slice.call(arguments, 1),\n\
    i, source, names, j, name;\n\
\n\
    if (target === undefined || target === null) {\n\
        target = {};\n\
    }\n\
\n\
    for (i = 0; i < sources.length; i++) {\n\
        source = sources[i];\n\
        names = strategy.keysFn(source);\n\
        for (j = 0; j < names.length; j++) {\n\
            name = names[j];\n\
            strategy.copyFn(target, name, source);\n\
        }\n\
    }\n\
\n\
    return target;\n\
}\n\
\n\
var strategies = {\n\
    DEFAULT: {\n\
        keysFn: ownKeys,\n\
        copyFn: simpleCopy\n\
    },\n\
    PROPER: {\n\
        keysFn: ownProperties,\n\
        copyFn: properCopy\n\
    },\n\
    INHERITED: {\n\
        keysFn: allKeys,\n\
        copyFn: simpleCopy\n\
    },\n\
    DEEP: {\n\
        keysFn: ownKeys,\n\
        copyFn: function recursiveCopy(target, name, source) {\n\
            var val = source[name];\n\
            var old = target[name];\n\
            if (typeof val === 'object' && typeof old === 'object') {\n\
                assimilateWithStrategy.call(strategies.DEEP, old, val);\n\
            } else {\n\
                simpleCopy(target, name, source);\n\
            }\n\
        }\n\
    },\n\
    STRICT: {\n\
        keysFn: ownKeys,\n\
        copyFn: function strictCopy(target, name, source) {\n\
            if (source[name] !== undefined) {\n\
                simpleCopy(target, name, source);\n\
            }\n\
        }\n\
    },\n\
    FALLBACK: {\n\
        keysFn: function fallbackCopy(target, name, source) {\n\
            if (target[name] === undefined) {\n\
                simpleCopy(target, name, source);\n\
            }\n\
        },\n\
        copyFn: simpleCopy\n\
    }\n\
};\n\
\n\
var assimilate = bind(assimilateWithStrategy, strategies.DEFAULT);\n\
assimilate.strategies = strategies;\n\
assimilate.withStrategy = function withStrategy(strategy) {\n\
    if (typeof strategy === 'string') {\n\
        strategy = strategies[strategy.toUpperCase()];\n\
    }\n\
    if (!strategy) {\n\
        throw new Error('Unknwon or invalid strategy:' + strategy);\n\
    }\n\
    if (typeof strategy.copyFn !== 'function') {\n\
        throw new Error('Strategy missing copy function:' + strategy);\n\
    }\n\
    if (typeof strategy.keysFn !== 'function') {\n\
        throw new Error('Strategy missing keys function:' + strategy);\n\
    }\n\
    return bind(assimilateWithStrategy, strategy);\n\
};\n\
\n\
module.exports = assimilate;\n\
//# sourceURL=components/pluma/assimilate/0.3.0/dist/assimilate.js"
));

require.modules["pluma-assimilate"] = require.modules["pluma~assimilate@0.3.0"];
require.modules["pluma~assimilate"] = require.modules["pluma~assimilate@0.3.0"];
require.modules["assimilate"] = require.modules["pluma~assimilate@0.3.0"];


require.register("indefinido~observable@es6-modules", Function("exports, module",
"module.exports = require(\"indefinido~observable@es6-modules/lib/observable.js\");\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/index.js"
));

require.register("indefinido~observable@es6-modules/lib/adapters/rivets.js", Function("exports, module",
"exports.adapter = {\n\
  subscribe: function(record, attribute_path, callback) {\n\
    if (record == null) {\n\
      throw new TypeError('observable.adapters.rivets.subscribe: No record provided for subscription');\n\
    }\n\
    if (attribute_path) {\n\
      return record.subscribe(attribute_path, callback);\n\
    }\n\
  },\n\
  unsubscribe: function(record, attribute_path, callback) {\n\
    if (record == null) {\n\
      throw new TypeError('observable.adapters.rivets.unsubscribe: No record provided for subscription');\n\
    }\n\
    return record.unsubscribe(attribute_path, callback);\n\
  },\n\
  read: function(record, attribute_path) {\n\
    if (record == null) {\n\
      throw new TypeError('observable.adapters.rivets.read: No record provided for subscription');\n\
    }\n\
    return record[attribute_path];\n\
  },\n\
  publish: function(record, attribute_path, value) {\n\
    if (record == null) {\n\
      throw new TypeError('observable.adapters.rivets.publish: No record provided for subscription');\n\
    }\n\
    return record[attribute_path] = value;\n\
  }\n\
};\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/adapters/rivets.js"
));

require.register("indefinido~observable@es6-modules/lib/legacy/notifierable.js", Function("exports, module",
"var jQuery = require(\"component~jquery@1.9.1\");\n\
var mutations, notifierable, subscribed_getter;\n\
\n\
notifierable = {\n\
  observe: function(object, keypath, callback) {\n\
    return Object.defineProperty(object, keypath, {\n\
      get: this.getter(object, keypath),\n\
      set: this.setter(object, keypath, callback),\n\
      enumerable: true\n\
    });\n\
  },\n\
  storage_for: function(object) {\n\
    var toJSON;\n\
\n\
    toJSON = void 0;\n\
    Object.defineProperty(object, \"observed\", {\n\
      configurable: true,\n\
      enumerable: false,\n\
      value: {}\n\
    });\n\
    toJSON = object.json || object.toJSON;\n\
    if (toJSON) {\n\
      return Object.defineProperty(object, \"toJSON\", {\n\
        enumerable: false,\n\
        value: function() {\n\
          var json;\n\
\n\
          json = void 0;\n\
          json = toJSON.apply(this, arguments);\n\
          return observable.unobserve(_.omit(json, observable.ignores, [\"toJSON\", \"observed\"]));\n\
        }\n\
      });\n\
    }\n\
  },\n\
  setter: function(object, keypath, callback) {\n\
    var current, old_setter, setter, thread;\n\
\n\
    setter = lookup.setter.call(object, keypath);\n\
    this.observed[keypath] = lookup.getter.call(object, keypath) && lookup.getter.call(object, keypath)() || object[keypath];\n\
    if (!setter) {\n\
      setter = function(value) {\n\
        return check.call(object, keypath, value) !== false && setter.callback_thread.call(object, value);\n\
      };\n\
    } else if (!setter.callback_thread) {\n\
      old_setter = setter;\n\
      setter = function(value) {\n\
        return check.call(object, keypath, value) !== false && setter.callback_thread.call(object, value);\n\
      };\n\
      setter.callback_thread = old_setter;\n\
    }\n\
    current = setter.callback_thread || $.noop;\n\
    setter.callback_thread = thread = function(value) {\n\
      return current.call(object, value) !== false && callback.call(object, value);\n\
    };\n\
    if (requiresDomElement) {\n\
      this.observed[keypath + \"_setter\"] = setter;\n\
    }\n\
    return setter;\n\
  },\n\
  getter: subscribed_getter = function(object, keypath) {\n\
    var getter, root_getter;\n\
\n\
    getter = lookup.getter.call(object, keypath) || (root_getter = function() {\n\
      return object.observed[keypath];\n\
    });\n\
    if (requiresDomElement) {\n\
      this.observed[keypath + \"_getter\"] = getter;\n\
    }\n\
    return getter;\n\
  },\n\
  mutations: function(keypath) {\n\
    var array, setter;\n\
\n\
    setter = lookup.setter.call(this, keypath);\n\
    array = this[keypath];\n\
    if (!setter) {\n\
      this.observe.call(this, keypath, function(new_array) {\n\
        var i, j, type;\n\
\n\
        i = void 0;\n\
        type = void 0;\n\
        j = void 0;\n\
        if ($.type(new_array) !== \"array\") {\n\
          return;\n\
        }\n\
        if (new_array.object === array.object && new_array.thread === array.thread) {\n\
          return;\n\
        }\n\
        i = new_array.length;\n\
        j = new_array.length;\n\
        new_array.thread = array.thread;\n\
        new_array.object = array.object;\n\
        new_array.key = keypath;\n\
        while (i--) {\n\
          type = $.type(new_array[i]);\n\
          if (!new_array[i].observed && (type === \"object\" || type === \"array\")) {\n\
            new_array[i] = observable(new_array[i]);\n\
          }\n\
        }\n\
        new_array.length = j;\n\
        $.extend(new_array, mutations.overrides);\n\
      });\n\
      setter = lookup.setter.call(this, keypath);\n\
    }\n\
    array.thread = setter.callback_thread;\n\
    array.object = this;\n\
    array.key = keypath;\n\
    $.extend(array, mutations.overrides);\n\
    if (!this.observed.mutate) {\n\
      this.observed.mutate = mutations.mutate;\n\
    }\n\
  }\n\
};\n\
\n\
mutations = {\n\
  mutate: function(thread, method, array) {\n\
    array.method = method;\n\
    thread.call(this, array);\n\
    this.publish(array.key, array);\n\
    delete array.method;\n\
  },\n\
  overrides: {\n\
    push: function() {\n\
      var i, operation;\n\
\n\
      i = arguments.length;\n\
      operation = void 0;\n\
      while (i--) {\n\
        !arguments[i].observed && $.type(arguments[i]) === \"object\" && (arguments[i] = observable(arguments[i]));\n\
      }\n\
      operation = Array.prototype.push.apply(this, arguments);\n\
      this.object.observed.mutate.call(this.object, this.thread, \"push\", this);\n\
      return operation;\n\
    }\n\
  }\n\
};\n\
\n\
jQuery(\"pop shift unshift\".split(\" \")).each(function(i, method) {\n\
  return mutations.overrides[method] = function() {\n\
    Array.prototype[method].apply(this, arguments);\n\
    return this.object.observed.mutate.call(this.object, this.thread, method, this);\n\
  };\n\
});\n\
\n\
module.exports = notifierable;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/legacy/notifierable.js"
));

require.register("indefinido~observable@es6-modules/lib/legacy/schedulerable.js", Function("exports, module",
"var lookup = require(\"indefinido~observable@es6-modules/lib/lookup.js\");\n\
var jQuery = require(\"component~jquery@1.9.1\");\n\
var scheduler, schedulerable;\n\
\n\
scheduler = function(options) {\n\
  var name, timeout, value;\n\
\n\
  if (options == null) {\n\
    options = {};\n\
  }\n\
  timeout = null;\n\
  for (name in options) {\n\
    value = options[name];\n\
    options[name] = {\n\
      value: value\n\
    };\n\
  }\n\
  jQuery.extend(options, {\n\
    keypaths: {\n\
      value: []\n\
    },\n\
    schedule: {\n\
      value: function() {\n\
        var deliver,\n\
          _this = this;\n\
\n\
        deliver = function() {\n\
          return _this.deliver();\n\
        };\n\
        clearTimeout(timeout);\n\
        return timeout = setTimeout(deliver, 500 || options.wait);\n\
      }\n\
    }\n\
  });\n\
  return Object.create(scheduler.methods, options);\n\
};\n\
\n\
jQuery.extend(scheduler, {\n\
  methods: {\n\
    property: function(object, keypath) {\n\
      if (this.keypaths.indexOf(keypath) !== -1) {\n\
        return;\n\
      }\n\
      this.keypaths.push(keypath);\n\
      return Object.defineProperty(object, keypath, {\n\
        get: this.getter(object, keypath),\n\
        set: this.setter(object, keypath),\n\
        enumerable: true,\n\
        configurable: true\n\
      });\n\
    },\n\
    deliver: function() {\n\
      var keypath, observer, _ref;\n\
\n\
      _ref = this.target.observation.observers;\n\
      for (keypath in _ref) {\n\
        observer = _ref[keypath];\n\
        observer.deliver();\n\
      }\n\
      return true;\n\
    },\n\
    setter: function(object, keypath, callback) {\n\
      var current_setter;\n\
\n\
      current_setter = lookup.setter.call(object, keypath);\n\
      if (current_setter) {\n\
        return function(value) {\n\
          current_setter.call(this, value);\n\
          this.observed[keypath] = value;\n\
          return this.observation.scheduler.schedule();\n\
        };\n\
      } else {\n\
        return function(value) {\n\
          this.observed[keypath] = value;\n\
          return this.observation.scheduler.schedule();\n\
        };\n\
      }\n\
    },\n\
    getter: function(object, keypath) {\n\
      var root_getter;\n\
\n\
      return lookup.getter.call(object, keypath) || (root_getter = function() {\n\
        return this.observed[keypath];\n\
      });\n\
    },\n\
    destroy: function() {\n\
      return this.target = null;\n\
    }\n\
  }\n\
});\n\
\n\
schedulerable = function(observable) {\n\
  var original;\n\
\n\
  original = observable.methods.subscribe;\n\
  observable.methods.subscribe = function(keypath, callback) {\n\
    original.apply(this, arguments);\n\
    return this.observation.scheduler.property(this, keypath);\n\
  };\n\
  return jQuery.extend((function() {\n\
    var object;\n\
\n\
    object = observable.apply(this, arguments);\n\
    object.observation.scheduler = scheduler({\n\
      target: object\n\
    });\n\
    return object;\n\
  }), observable);\n\
};\n\
\n\
module.exports = schedulerable;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/legacy/schedulerable.js"
));

require.register("indefinido~observable@es6-modules/lib/lookup.js", Function("exports, module",
"var lookup;\n\
\n\
lookup = {\n\
  setter: Object.prototype.__lookupSetter__ || function(property) {\n\
    return this.observed && this.observed[property + \"_setter\"];\n\
  },\n\
  getter: Object.prototype.__lookupGetter__ || function(property) {\n\
    var default_getter;\n\
\n\
    default_getter = void 0;\n\
    return this.observed && this.observed[property + \"_getter\"] || ((default_getter = $.proxy(lookup.default_getter, this, property)) && (default_getter.is_default = true) && default_getter);\n\
  },\n\
  types: {\n\
    undefined: undefined,\n\
    \"null\": null,\n\
    \"true\": true,\n\
    \"false\": false,\n\
    NaN: NaN\n\
  },\n\
  basic_types: [undefined, null],\n\
  default_getter: function(property) {\n\
    var possible_value;\n\
\n\
    possible_value = this[property];\n\
    if (possible_value && possible_value.hasOwnProperty(\"toString\")) {\n\
      if (possible_value.toString.is_default) {\n\
        return this.observed[property];\n\
      }\n\
      return possible_value.toString.call(this);\n\
    } else if (possible_value in lookup.types) {\n\
      return lookup.types[possible_value];\n\
    } else {\n\
      return possible_value;\n\
    }\n\
  }\n\
};\n\
\n\
module.exports = lookup;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/lookup.js"
));

require.register("indefinido~observable@es6-modules/lib/observable.js", Function("exports, module",
"require(\"indefinido~observable@es6-modules/lib/platform.js\");\n\
var jQuery = require(\"component~jquery@1.9.1\");\n\
var observation = require(\"indefinido~observable@es6-modules/lib/observable/observation.js\");\n\
var selection = require(\"indefinido~observable@es6-modules/lib/observable/selection.js\");\n\
var KeypathObserver = require(\"indefinido~observable@es6-modules/lib/observable/keypath_observer.js\");\n\
var SelfObserver = require(\"indefinido~observable@es6-modules/lib/observable/self_observer.js\");\n\
var observable;\n\
\n\
observable = function() {\n\
  var object;\n\
\n\
  object = observable.select.apply(this, arguments);\n\
  if (object.observation) {\n\
    return object;\n\
  }\n\
  return jQuery.extend(observable.observe(object), observable.methods);\n\
};\n\
\n\
jQuery.extend(observable, {\n\
  select: selection(observable),\n\
  observe: function(object) {\n\
    return Object.defineProperty(object, \"observation\", {\n\
      configurable: true,\n\
      enumerable: false,\n\
      value: observation(object)\n\
    }, Object.defineProperty(object, \"observed\", {\n\
      configurable: true,\n\
      enumerable: false,\n\
      value: {}\n\
    }));\n\
  },\n\
  self: function(object) {\n\
    var observer, observers;\n\
\n\
    observers = object.observation.observers;\n\
    return observer = observers.self || (observers.self = new SelfObserver(object));\n\
  },\n\
  keypath: function(object, keypath) {\n\
    var observer, observers;\n\
\n\
    observers = object.observation.observers;\n\
    return observer = observers[keypath] || (observers[keypath] = new KeypathObserver(object, keypath));\n\
  },\n\
  unobserve: function(object) {\n\
    var name, unobserved;\n\
\n\
    if (!object.observation) {\n\
      return object;\n\
    }\n\
    unobserved = {};\n\
    for (name in observation.methods) {\n\
      delete object[name];\n\
    }\n\
    object.observation.destroy();\n\
    object.observation.scheduler.destroy();\n\
    delete object.observation;\n\
    delete object.observed;\n\
    return unobserved;\n\
  },\n\
  methods: {\n\
    subscribe: function(keypath_or_callback, callback) {\n\
      var observer;\n\
\n\
      switch (arguments.length) {\n\
        case 1:\n\
          observer = observable.self(this);\n\
          return this.observation.add('self', keypath_or_callback);\n\
        case 2:\n\
          observable.keypath(this, keypath_or_callback);\n\
          return this.observation.add(keypath_or_callback, callback);\n\
      }\n\
    },\n\
    unsubscribe: function(keypath, callback) {\n\
      return this.observation[callback ? 'remove' : 'mute'](keypath, callback);\n\
    },\n\
    publish: function(keypath, value) {\n\
      return this[keypath] = value;\n\
    }\n\
  },\n\
  ignores: []\n\
});\n\
\n\
if (!Object.observe) {\n\
  var schedulerable = require(\"indefinido~observable@es6-modules/lib/legacy/schedulerable.js\");\n\
  observable = schedulerable(observable);\n\
}\n\
\n\
observable.mixin = observable;\n\
\n\
module.exports = observable;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/observable.js"
));

require.register("indefinido~observable@es6-modules/lib/observable/keypath_observer.js", Function("exports, module",
"var PathObserver = require(\"indefinido~observable@es6-modules/vendor/observe-js/observe.js\").PathObserver;\n\
var Callbacks = require(\"component~jquery@1.9.1\").Callbacks;\n\
var KeypathObserver,\n\
  __hasProp = {}.hasOwnProperty,\n\
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n\
\n\
KeypathObserver = (function(_super) {\n\
  __extends(KeypathObserver, _super);\n\
\n\
  function KeypathObserver(object, keypath) {\n\
    _super.call(this, object, keypath);\n\
    this.callbacks = Callbacks();\n\
    this.open((function() {\n\
      return this.fireWith(object, arguments);\n\
    }), this.callbacks);\n\
  }\n\
\n\
  KeypathObserver.prototype.add = function(callback) {\n\
    return this.callbacks.add(callback);\n\
  };\n\
\n\
  KeypathObserver.prototype.remove = function() {\n\
    var _ref;\n\
\n\
    return (_ref = this.callbacks).remove.apply(_ref, arguments);\n\
  };\n\
\n\
  KeypathObserver.prototype.close = function() {\n\
    KeypathObserver.__super__.close.apply(this, arguments);\n\
    this.callbacks.empty();\n\
    return delete this.callbacks;\n\
  };\n\
\n\
  return KeypathObserver;\n\
\n\
})(PathObserver);\n\
\n\
module.exports = KeypathObserver;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/observable/keypath_observer.js"
));

require.register("indefinido~observable@es6-modules/lib/observable/observation.js", Function("exports, module",
"var observation, observationable;\n\
\n\
observation = {\n\
  add: function(keypath, callback) {\n\
    return this.observers[keypath].add(callback);\n\
  },\n\
  remove: function(keypath, callback) {\n\
    return this.observers[keypath].remove(callback);\n\
  },\n\
  mute: function(keypath) {\n\
    this.observers[keypath].close();\n\
    return delete this.observers[keypath];\n\
  },\n\
  destroy: function(keypath) {\n\
    var observer, _ref;\n\
\n\
    _ref = this.observers;\n\
    for (keypath in _ref) {\n\
      observer = _ref[keypath];\n\
      observer.close();\n\
    }\n\
    return delete this.observers;\n\
  }\n\
};\n\
\n\
observationable = function(object) {\n\
  return Object.create(observation, {\n\
    observers: {\n\
      value: {}\n\
    }\n\
  });\n\
};\n\
\n\
module.exports = observationable;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/observable/observation.js"
));

require.register("indefinido~observable@es6-modules/lib/observable/selection.js", Function("exports, module",
"var jQuery = require(\"component~jquery@1.9.1\");\n\
var requiresDomElement, selection;\n\
\n\
requiresDomElement = Object.defineProperty.requiresDomElement;\n\
\n\
selection = function(observable) {\n\
  if (requiresDomElement) {\n\
    selection.generate_ignores(observable);\n\
    return selection.legacy;\n\
  } else {\n\
    return selection.from_call;\n\
  }\n\
};\n\
\n\
selection.legacy = function() {\n\
  var fix, object;\n\
\n\
  object = selection.from_call.apply(this, arguments);\n\
  if (!jQuery.isReady) {\n\
    throw new Error(\"observable.call: For compatibility reasons, observable can only be called when dom is loaded.\");\n\
  }\n\
  if (typeof object.nodeName !== \"string\") {\n\
    fix = document.createElement(\"fix\");\n\
    document.body.appendChild(fix);\n\
    object = jQuery.extend(fix, object);\n\
  }\n\
  return object;\n\
};\n\
\n\
selection.generate_ignores = function(observable) {\n\
  var fix_ignores, ignores, property;\n\
\n\
  ignores = document.createElement(\"fix\");\n\
  fix_ignores = [];\n\
  property = void 0;\n\
  for (property in ignores) {\n\
    fix_ignores.push(property);\n\
  }\n\
  return observable.ignores = fix_ignores;\n\
};\n\
\n\
selection.from_call = function(param) {\n\
  var object;\n\
\n\
  if (this === window) {\n\
    object = param || {};\n\
  } else if (this !== window) {\n\
    if (param) {\n\
      throw new TypeError(\"Two objects provided! Call either with observable.call(object) or observable(object), not with observable.call(param, param)\");\n\
    } else {\n\
      object = this;\n\
    }\n\
  }\n\
  return object;\n\
};\n\
\n\
module.exports = selection;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/observable/selection.js"
));

require.register("indefinido~observable@es6-modules/lib/observable/self_observer.js", Function("exports, module",
"var ObjectObserver = require(\"indefinido~observable@es6-modules/vendor/observe-js/observe.js\").ObjectObserver;\n\
var Callbacks = require(\"component~jquery@1.9.1\").Callbacks;\n\
var SelfObserver,\n\
  __hasProp = {}.hasOwnProperty,\n\
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n\
\n\
SelfObserver = (function(_super) {\n\
  __extends(SelfObserver, _super);\n\
\n\
  function SelfObserver(object) {\n\
    _super.call(this, object);\n\
    this.callbacks = Callbacks();\n\
    this.open((function() {\n\
      return this.fireWith(object, arguments);\n\
    }), this.callbacks);\n\
  }\n\
\n\
  SelfObserver.prototype.add = function(callback) {\n\
    return this.callbacks.add(callback);\n\
  };\n\
\n\
  SelfObserver.prototype.remove = function() {\n\
    var _ref;\n\
\n\
    return (_ref = this.callbacks).remove.apply(_ref, arguments);\n\
  };\n\
\n\
  SelfObserver.prototype.close = function() {\n\
    SelfObserver.__super__.close.apply(this, arguments);\n\
    this.callbacks.empty();\n\
    return delete this.callbacks;\n\
  };\n\
\n\
  return SelfObserver;\n\
\n\
})(ObjectObserver);\n\
\n\
module.exports = SelfObserver;\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/observable/self_observer.js"
));

require.register("indefinido~observable@es6-modules/lib/platform.js", Function("exports, module",
"if (!Object.prototype.create) {\n\
  require(\"indefinido~observable@es6-modules/vendor/shims/object.create.js\");\n\
}\n\
\n\
if (!Array.prototype.indexOf) {\n\
  require(\"indefinido~observable@es6-modules/vendor/shims/array.indexOf.js\");\n\
}\n\
\n\
if (typeof require !== \"undefined\") {\n\
  require(\"indefinido~observable@es6-modules/vendor/shims/accessors-legacy.js\");\n\
  require(\"indefinido~observable@es6-modules/vendor/shims/accessors.js\");\n\
}\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/lib/platform.js"
));

require.register("indefinido~observable@es6-modules/vendor/observe-js/observe.js", Function("exports, module",
"// Copyright 2012 Google Inc.\n\
//\n\
// Licensed under the Apache License, Version 2.0 (the \"License\");\n\
// you may not use this file except in compliance with the License.\n\
// You may obtain a copy of the License at\n\
//\n\
//     http://www.apache.org/licenses/LICENSE-2.0\n\
//\n\
// Unless required by applicable law or agreed to in writing, software\n\
// distributed under the License is distributed on an \"AS IS\" BASIS,\n\
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n\
// See the License for the specific language governing permissions and\n\
// limitations under the License.\n\
\n\
(function(global) {\n\
  'use strict';\n\
\n\
  // Detect and do basic sanity checking on Object/Array.observe.\n\
  function detectObjectObserve() {\n\
    if (typeof Object.observe !== 'function' ||\n\
        typeof Array.observe !== 'function') {\n\
      return false;\n\
    }\n\
\n\
    var records = [];\n\
\n\
    function callback(recs) {\n\
      records = recs;\n\
    }\n\
\n\
    var test = {};\n\
    var arr = [];\n\
    Object.observe(test, callback);\n\
    Array.observe(arr, callback);\n\
    test.id = 1;\n\
    test.id = 2;\n\
    delete test.id;\n\
    arr.push(1, 2);\n\
    arr.length = 0;\n\
\n\
    Object.deliverChangeRecords(callback);\n\
    if (records.length !== 5)\n\
      return false;\n\
\n\
    if (records[0].type != 'add' ||\n\
        records[1].type != 'update' ||\n\
        records[2].type != 'delete' ||\n\
        records[3].type != 'splice' ||\n\
        records[4].type != 'splice') {\n\
      return false;\n\
    }\n\
\n\
    Object.unobserve(test, callback);\n\
    Array.unobserve(arr, callback);\n\
\n\
    return true;\n\
  }\n\
\n\
  var hasObserve = detectObjectObserve();\n\
\n\
  function detectEval() {\n\
    // Don't test for eval if we're running in a Chrome App environment.\n\
    // We check for APIs set that only exist in a Chrome App context.\n\
    if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {\n\
      return false;\n\
    }\n\
\n\
    try {\n\
      var f = new Function('', 'return true;');\n\
      return f();\n\
    } catch (ex) {\n\
      return false;\n\
    }\n\
  }\n\
\n\
  var hasEval = detectEval();\n\
\n\
  function isIndex(s) {\n\
    return +s === s >>> 0;\n\
  }\n\
\n\
  function toNumber(s) {\n\
    return +s;\n\
  }\n\
\n\
  function isObject(obj) {\n\
    return obj === Object(obj);\n\
  }\n\
\n\
  var numberIsNaN = Number.isNaN || function isNaN(value) {\n\
    return typeof value === 'number' && global.isNaN(value);\n\
  }\n\
\n\
  function areSameValue(left, right) {\n\
    if (left === right)\n\
      return left !== 0 || 1 / left === 1 / right;\n\
    if (numberIsNaN(left) && numberIsNaN(right))\n\
      return true;\n\
\n\
    return left !== left && right !== right;\n\
  }\n\
\n\
  var createObject = ('__proto__' in {}) ?\n\
    function(obj) { return obj; } :\n\
    function(obj) {\n\
      var proto = obj.__proto__;\n\
      if (!proto)\n\
        return obj;\n\
      var newObject = Object.create(proto);\n\
      Object.getOwnPropertyNames(obj).forEach(function(name) {\n\
        Object.defineProperty(newObject, name,\n\
                             Object.getOwnPropertyDescriptor(obj, name));\n\
      });\n\
      return newObject;\n\
    };\n\
\n\
  var identStart = '[\\$_a-zA-Z]';\n\
  var identPart = '[\\$_a-zA-Z0-9]';\n\
  var ident = identStart + '+' + identPart + '*';\n\
  var elementIndex = '(?:[0-9]|[1-9]+[0-9]+)';\n\
  var identOrElementIndex = '(?:' + ident + '|' + elementIndex + ')';\n\
  var path = '(?:' + identOrElementIndex + ')(?:\\\\s*\\\\.\\\\s*' + identOrElementIndex + ')*';\n\
  var pathRegExp = new RegExp('^' + path + '$');\n\
\n\
  function isPathValid(s) {\n\
    if (typeof s != 'string')\n\
      return false;\n\
    s = s.trim();\n\
\n\
    if (s == '')\n\
      return true;\n\
\n\
    if (s[0] == '.')\n\
      return false;\n\
\n\
    return pathRegExp.test(s);\n\
  }\n\
\n\
  var constructorIsPrivate = {};\n\
\n\
  function Path(s, privateToken) {\n\
    if (privateToken !== constructorIsPrivate)\n\
      throw Error('Use Path.get to retrieve path objects');\n\
\n\
    if (s.trim() == '')\n\
      return this;\n\
\n\
    if (isIndex(s)) {\n\
      this.push(s);\n\
      return this;\n\
    }\n\
\n\
    s.split(/\\s*\\.\\s*/).filter(function(part) {\n\
      return part;\n\
    }).forEach(function(part) {\n\
      this.push(part);\n\
    }, this);\n\
\n\
    if (hasEval && this.length) {\n\
      this.getValueFrom = this.compiledGetValueFromFn();\n\
    }\n\
  }\n\
\n\
  // TODO(rafaelw): Make simple LRU cache\n\
  var pathCache = {};\n\
\n\
  function getPath(pathString) {\n\
    if (pathString instanceof Path)\n\
      return pathString;\n\
\n\
    if (pathString == null)\n\
      pathString = '';\n\
\n\
    if (typeof pathString !== 'string')\n\
      pathString = String(pathString);\n\
\n\
    var path = pathCache[pathString];\n\
    if (path)\n\
      return path;\n\
    if (!isPathValid(pathString))\n\
      return invalidPath;\n\
    var path = new Path(pathString, constructorIsPrivate);\n\
    pathCache[pathString] = path;\n\
    return path;\n\
  }\n\
\n\
  Path.get = getPath;\n\
\n\
  Path.prototype = createObject({\n\
    __proto__: [],\n\
    valid: true,\n\
\n\
    toString: function() {\n\
      return this.join('.');\n\
    },\n\
\n\
    getValueFrom: function(obj, directObserver) {\n\
      for (var i = 0; i < this.length; i++) {\n\
        if (obj == null)\n\
          return;\n\
        obj = obj[this[i]];\n\
      }\n\
      return obj;\n\
    },\n\
\n\
    iterateObjects: function(obj, observe) {\n\
      for (var i = 0; i < this.length; i++) {\n\
        if (i)\n\
          obj = obj[this[i - 1]];\n\
        if (!isObject(obj))\n\
          return;\n\
        observe(obj, this[0]);\n\
      }\n\
    },\n\
\n\
    compiledGetValueFromFn: function() {\n\
      var accessors = this.map(function(ident) {\n\
        return isIndex(ident) ? '[\"' + ident + '\"]' : '.' + ident;\n\
      });\n\
\n\
      var str = '';\n\
      var pathString = 'obj';\n\
      str += 'if (obj != null';\n\
      var i = 0;\n\
      for (; i < (this.length - 1); i++) {\n\
        var ident = this[i];\n\
        pathString += accessors[i];\n\
        str += ' &&\\n\
     ' + pathString + ' != null';\n\
      }\n\
      str += ')\\n\
';\n\
\n\
      pathString += accessors[i];\n\
\n\
      str += '  return ' + pathString + ';\\n\
else\\n\
  return undefined;';\n\
      return new Function('obj', str);\n\
    },\n\
\n\
    setValueFrom: function(obj, value) {\n\
      if (!this.length)\n\
        return false;\n\
\n\
      for (var i = 0; i < this.length - 1; i++) {\n\
        if (!isObject(obj))\n\
          return false;\n\
        obj = obj[this[i]];\n\
      }\n\
\n\
      if (!isObject(obj))\n\
        return false;\n\
\n\
      obj[this[i]] = value;\n\
      return true;\n\
    }\n\
  });\n\
\n\
  var invalidPath = new Path('', constructorIsPrivate);\n\
  invalidPath.valid = false;\n\
  invalidPath.getValueFrom = invalidPath.setValueFrom = function() {};\n\
\n\
  var MAX_DIRTY_CHECK_CYCLES = 1000;\n\
\n\
  function dirtyCheck(observer) {\n\
    var cycles = 0;\n\
    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {\n\
      cycles++;\n\
    }\n\
    if (global.testingExposeCycleCount)\n\
      global.dirtyCheckCycleCount = cycles;\n\
\n\
    return cycles > 0;\n\
  }\n\
\n\
  function objectIsEmpty(object) {\n\
    for (var prop in object)\n\
      return false;\n\
    return true;\n\
  }\n\
\n\
  function diffIsEmpty(diff) {\n\
    return objectIsEmpty(diff.added) &&\n\
           objectIsEmpty(diff.removed) &&\n\
           objectIsEmpty(diff.changed);\n\
  }\n\
\n\
  function diffObjectFromOldObject(object, oldObject) {\n\
    var added = {};\n\
    var removed = {};\n\
    var changed = {};\n\
\n\
    for (var prop in oldObject) {\n\
      var newValue = object[prop];\n\
\n\
      if (newValue !== undefined && newValue === oldObject[prop])\n\
        continue;\n\
\n\
      if (!(prop in object)) {\n\
        removed[prop] = undefined;\n\
        continue;\n\
      }\n\
\n\
      if (newValue !== oldObject[prop])\n\
        changed[prop] = newValue;\n\
    }\n\
\n\
    for (var prop in object) {\n\
      if (prop in oldObject)\n\
        continue;\n\
\n\
      added[prop] = object[prop];\n\
    }\n\
\n\
    if (Array.isArray(object) && object.length !== oldObject.length)\n\
      changed.length = object.length;\n\
\n\
    return {\n\
      added: added,\n\
      removed: removed,\n\
      changed: changed\n\
    };\n\
  }\n\
\n\
  var eomTasks = [];\n\
  function runEOMTasks() {\n\
    if (!eomTasks.length)\n\
      return false;\n\
\n\
    for (var i = 0; i < eomTasks.length; i++) {\n\
      eomTasks[i]();\n\
    }\n\
    eomTasks.length = 0;\n\
    return true;\n\
  }\n\
\n\
  var runEOM = hasObserve ? (function(){\n\
    var eomObj = { pingPong: true };\n\
    var eomRunScheduled = false;\n\
\n\
    Object.observe(eomObj, function() {\n\
      runEOMTasks();\n\
      eomRunScheduled = false;\n\
    });\n\
\n\
    return function(fn) {\n\
      eomTasks.push(fn);\n\
      if (!eomRunScheduled) {\n\
        eomRunScheduled = true;\n\
        eomObj.pingPong = !eomObj.pingPong;\n\
      }\n\
    };\n\
  })() :\n\
  (function() {\n\
    return function(fn) {\n\
      eomTasks.push(fn);\n\
    };\n\
  })();\n\
\n\
  var observedObjectCache = [];\n\
\n\
  function newObservedObject() {\n\
    var observer;\n\
    var object;\n\
    var discardRecords = false;\n\
    var first = true;\n\
\n\
    function callback(records) {\n\
      if (observer && observer.state_ === OPENED && !discardRecords)\n\
        observer.check_(records);\n\
    }\n\
\n\
    return {\n\
      open: function(obs) {\n\
        if (observer)\n\
          throw Error('ObservedObject in use');\n\
\n\
        if (!first)\n\
          Object.deliverChangeRecords(callback);\n\
\n\
        observer = obs;\n\
        first = false;\n\
      },\n\
      observe: function(obj, arrayObserve) {\n\
        object = obj;\n\
        if (arrayObserve)\n\
          Array.observe(object, callback);\n\
        else\n\
          Object.observe(object, callback);\n\
      },\n\
      deliver: function(discard) {\n\
        discardRecords = discard;\n\
        Object.deliverChangeRecords(callback);\n\
        discardRecords = false;\n\
      },\n\
      close: function() {\n\
        observer = undefined;\n\
        Object.unobserve(object, callback);\n\
        observedObjectCache.push(this);\n\
      }\n\
    };\n\
  }\n\
\n\
  /*\n\
   * The observedSet abstraction is a perf optimization which reduces the total\n\
   * number of Object.observe observations of a set of objects. The idea is that\n\
   * groups of Observers will have some object dependencies in common and this\n\
   * observed set ensures that each object in the transitive closure of\n\
   * dependencies is only observed once. The observedSet acts as a write barrier\n\
   * such that whenever any change comes through, all Observers are checked for\n\
   * changed values.\n\
   *\n\
   * Note that this optimization is explicitly moving work from setup-time to\n\
   * change-time.\n\
   *\n\
   * TODO(rafaelw): Implement \"garbage collection\". In order to move work off\n\
   * the critical path, when Observers are closed, their observed objects are\n\
   * not Object.unobserve(d). As a result, it's possible that if the observedSet\n\
   * is kept open, but some Observers have been closed, it could cause \"leaks\"\n\
   * (prevent otherwise collectable objects from being collected). At some\n\
   * point, we should implement incremental \"gc\" which keeps a list of\n\
   * observedSets which may need clean-up and does small amounts of cleanup on a\n\
   * timeout until all is clean.\n\
   */\n\
\n\
  function getObservedObject(observer, object, arrayObserve) {\n\
    var dir = observedObjectCache.pop() || newObservedObject();\n\
    dir.open(observer);\n\
    dir.observe(object, arrayObserve);\n\
    return dir;\n\
  }\n\
\n\
  var observedSetCache = [];\n\
\n\
  function newObservedSet() {\n\
    var observerCount = 0;\n\
    var observers = [];\n\
    var objects = [];\n\
    var rootObj;\n\
    var rootObjProps;\n\
\n\
    function observe(obj, prop) {\n\
      if (!obj)\n\
        return;\n\
\n\
      if (obj === rootObj)\n\
        rootObjProps[prop] = true;\n\
\n\
      if (objects.indexOf(obj) < 0) {\n\
        objects.push(obj);\n\
        Object.observe(obj, callback);\n\
      }\n\
\n\
      observe(Object.getPrototypeOf(obj), prop);\n\
    }\n\
\n\
    function allRootObjNonObservedProps(recs) {\n\
      for (var i = 0; i < recs.length; i++) {\n\
        var rec = recs[i];\n\
        if (rec.object !== rootObj ||\n\
            rootObjProps[rec.name] ||\n\
            rec.type === 'setPrototype') {\n\
          return false;\n\
        }\n\
      }\n\
      return true;\n\
    }\n\
\n\
    function callback(recs) {\n\
      if (allRootObjNonObservedProps(recs))\n\
        return;\n\
\n\
      var observer;\n\
      for (var i = 0; i < observers.length; i++) {\n\
        observer = observers[i];\n\
        if (observer.state_ == OPENED) {\n\
          observer.iterateObjects_(observe);\n\
        }\n\
      }\n\
\n\
      for (var i = 0; i < observers.length; i++) {\n\
        observer = observers[i];\n\
        if (observer.state_ == OPENED) {\n\
          observer.check_();\n\
        }\n\
      }\n\
    }\n\
\n\
    var record = {\n\
      object: undefined,\n\
      objects: objects,\n\
      open: function(obs, object) {\n\
        if (!rootObj) {\n\
          rootObj = object;\n\
          rootObjProps = {};\n\
        }\n\
\n\
        observers.push(obs);\n\
        observerCount++;\n\
        obs.iterateObjects_(observe);\n\
      },\n\
      close: function(obs) {\n\
        observerCount--;\n\
        if (observerCount > 0) {\n\
          return;\n\
        }\n\
\n\
        for (var i = 0; i < objects.length; i++) {\n\
          Object.unobserve(objects[i], callback);\n\
          Observer.unobservedCount++;\n\
        }\n\
\n\
        observers.length = 0;\n\
        objects.length = 0;\n\
        rootObj = undefined;\n\
        rootObjProps = undefined;\n\
        observedSetCache.push(this);\n\
      }\n\
    };\n\
\n\
    return record;\n\
  }\n\
\n\
  var lastObservedSet;\n\
\n\
  function getObservedSet(observer, obj) {\n\
    if (!lastObservedSet || lastObservedSet.object !== obj) {\n\
      lastObservedSet = observedSetCache.pop() || newObservedSet();\n\
      lastObservedSet.object = obj;\n\
    }\n\
    lastObservedSet.open(observer, obj);\n\
    return lastObservedSet;\n\
  }\n\
\n\
  var UNOPENED = 0;\n\
  var OPENED = 1;\n\
  var CLOSED = 2;\n\
  var RESETTING = 3;\n\
\n\
  var nextObserverId = 1;\n\
\n\
  function Observer() {\n\
    this.state_ = UNOPENED;\n\
    this.callback_ = undefined;\n\
    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef\n\
    this.directObserver_ = undefined;\n\
    this.value_ = undefined;\n\
    this.id_ = nextObserverId++;\n\
  }\n\
\n\
  Observer.prototype = {\n\
    open: function(callback, target) {\n\
      if (this.state_ != UNOPENED)\n\
        throw Error('Observer has already been opened.');\n\
\n\
      addToAll(this);\n\
      this.callback_ = callback;\n\
      this.target_ = target;\n\
      this.connect_();\n\
      this.state_ = OPENED;\n\
      return this.value_;\n\
    },\n\
\n\
    close: function() {\n\
      if (this.state_ != OPENED)\n\
        return;\n\
\n\
      removeFromAll(this);\n\
      this.disconnect_();\n\
      this.value_ = undefined;\n\
      this.callback_ = undefined;\n\
      this.target_ = undefined;\n\
      this.state_ = CLOSED;\n\
    },\n\
\n\
    deliver: function() {\n\
      if (this.state_ != OPENED)\n\
        return;\n\
\n\
      dirtyCheck(this);\n\
    },\n\
\n\
    report_: function(changes) {\n\
      try {\n\
        this.callback_.apply(this.target_, changes);\n\
      } catch (ex) {\n\
        Observer._errorThrownDuringCallback = true;\n\
        console.error('Exception caught during observer callback: ' +\n\
                       (ex.stack || ex));\n\
      }\n\
    },\n\
\n\
    discardChanges: function() {\n\
      this.check_(undefined, true);\n\
      return this.value_;\n\
    }\n\
  }\n\
\n\
  var collectObservers = !hasObserve;\n\
  var allObservers;\n\
  Observer._allObserversCount = 0;\n\
\n\
  if (collectObservers) {\n\
    allObservers = [];\n\
  }\n\
\n\
  function addToAll(observer) {\n\
    Observer._allObserversCount++;\n\
    if (!collectObservers)\n\
      return;\n\
\n\
    allObservers.push(observer);\n\
  }\n\
\n\
  function removeFromAll(observer) {\n\
    Observer._allObserversCount--;\n\
  }\n\
\n\
  var runningMicrotaskCheckpoint = false;\n\
\n\
  var hasDebugForceFullDelivery = hasObserve && (function() {\n\
    try {\n\
      eval('%RunMicrotasks()');\n\
      return true;\n\
    } catch (ex) {\n\
      return false;\n\
    }\n\
  })();\n\
\n\
  global.Platform = global.Platform || {};\n\
\n\
  global.Platform.performMicrotaskCheckpoint = function() {\n\
    if (runningMicrotaskCheckpoint)\n\
      return;\n\
\n\
    if (hasDebugForceFullDelivery) {\n\
      eval('%RunMicrotasks()');\n\
      return;\n\
    }\n\
\n\
    if (!collectObservers)\n\
      return;\n\
\n\
    runningMicrotaskCheckpoint = true;\n\
\n\
    var cycles = 0;\n\
    var anyChanged, toCheck;\n\
\n\
    do {\n\
      cycles++;\n\
      toCheck = allObservers;\n\
      allObservers = [];\n\
      anyChanged = false;\n\
\n\
      for (var i = 0; i < toCheck.length; i++) {\n\
        var observer = toCheck[i];\n\
        if (observer.state_ != OPENED)\n\
          continue;\n\
\n\
        if (observer.check_())\n\
          anyChanged = true;\n\
\n\
        allObservers.push(observer);\n\
      }\n\
      if (runEOMTasks())\n\
        anyChanged = true;\n\
    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);\n\
\n\
    if (global.testingExposeCycleCount)\n\
      global.dirtyCheckCycleCount = cycles;\n\
\n\
    runningMicrotaskCheckpoint = false;\n\
  };\n\
\n\
  if (collectObservers) {\n\
    global.Platform.clearObservers = function() {\n\
      allObservers = [];\n\
    };\n\
  }\n\
\n\
  function ObjectObserver(object) {\n\
    Observer.call(this);\n\
    this.value_ = object;\n\
    this.oldObject_ = undefined;\n\
  }\n\
\n\
  ObjectObserver.prototype = createObject({\n\
    __proto__: Observer.prototype,\n\
\n\
    arrayObserve: false,\n\
\n\
    connect_: function(callback, target) {\n\
      if (hasObserve) {\n\
        this.directObserver_ = getObservedObject(this, this.value_,\n\
                                                 this.arrayObserve);\n\
      } else {\n\
        this.oldObject_ = this.copyObject(this.value_);\n\
      }\n\
\n\
    },\n\
\n\
    copyObject: function(object) {\n\
      var copy = Array.isArray(object) ? [] : {};\n\
      for (var prop in object) {\n\
        copy[prop] = object[prop];\n\
      };\n\
      if (Array.isArray(object))\n\
        copy.length = object.length;\n\
      return copy;\n\
    },\n\
\n\
    check_: function(changeRecords, skipChanges) {\n\
      var diff;\n\
      var oldValues;\n\
      if (hasObserve) {\n\
        if (!changeRecords)\n\
          return false;\n\
\n\
        oldValues = {};\n\
        diff = diffObjectFromChangeRecords(this.value_, changeRecords,\n\
                                           oldValues);\n\
      } else {\n\
        oldValues = this.oldObject_;\n\
        diff = diffObjectFromOldObject(this.value_, this.oldObject_);\n\
      }\n\
\n\
      if (diffIsEmpty(diff))\n\
        return false;\n\
\n\
      if (!hasObserve)\n\
        this.oldObject_ = this.copyObject(this.value_);\n\
\n\
      this.report_([\n\
        diff.added || {},\n\
        diff.removed || {},\n\
        diff.changed || {},\n\
        function(property) {\n\
          return oldValues[property];\n\
        }\n\
      ]);\n\
\n\
      return true;\n\
    },\n\
\n\
    disconnect_: function() {\n\
      if (hasObserve) {\n\
        this.directObserver_.close();\n\
        this.directObserver_ = undefined;\n\
      } else {\n\
        this.oldObject_ = undefined;\n\
      }\n\
    },\n\
\n\
    deliver: function() {\n\
      if (this.state_ != OPENED)\n\
        return;\n\
\n\
      if (hasObserve)\n\
        this.directObserver_.deliver(false);\n\
      else\n\
        dirtyCheck(this);\n\
    },\n\
\n\
    discardChanges: function() {\n\
      if (this.directObserver_)\n\
        this.directObserver_.deliver(true);\n\
      else\n\
        this.oldObject_ = this.copyObject(this.value_);\n\
\n\
      return this.value_;\n\
    }\n\
  });\n\
\n\
  function ArrayObserver(array) {\n\
    if (!Array.isArray(array))\n\
      throw Error('Provided object is not an Array');\n\
    ObjectObserver.call(this, array);\n\
  }\n\
\n\
  ArrayObserver.prototype = createObject({\n\
\n\
    __proto__: ObjectObserver.prototype,\n\
\n\
    arrayObserve: true,\n\
\n\
    copyObject: function(arr) {\n\
      return arr.slice();\n\
    },\n\
\n\
    check_: function(changeRecords) {\n\
      var splices;\n\
      if (hasObserve) {\n\
        if (!changeRecords)\n\
          return false;\n\
        splices = projectArraySplices(this.value_, changeRecords);\n\
      } else {\n\
        splices = calcSplices(this.value_, 0, this.value_.length,\n\
                              this.oldObject_, 0, this.oldObject_.length);\n\
      }\n\
\n\
      if (!splices || !splices.length)\n\
        return false;\n\
\n\
      if (!hasObserve)\n\
        this.oldObject_ = this.copyObject(this.value_);\n\
\n\
      this.report_([splices]);\n\
      return true;\n\
    }\n\
  });\n\
\n\
  ArrayObserver.applySplices = function(previous, current, splices) {\n\
    splices.forEach(function(splice) {\n\
      var spliceArgs = [splice.index, splice.removed.length];\n\
      var addIndex = splice.index;\n\
      while (addIndex < splice.index + splice.addedCount) {\n\
        spliceArgs.push(current[addIndex]);\n\
        addIndex++;\n\
      }\n\
\n\
      Array.prototype.splice.apply(previous, spliceArgs);\n\
    });\n\
  };\n\
\n\
  function PathObserver(object, path) {\n\
    Observer.call(this);\n\
\n\
    this.object_ = object;\n\
    this.path_ = getPath(path);\n\
    this.directObserver_ = undefined;\n\
  }\n\
\n\
  PathObserver.prototype = createObject({\n\
    __proto__: Observer.prototype,\n\
\n\
    connect_: function() {\n\
      if (hasObserve)\n\
        this.directObserver_ = getObservedSet(this, this.object_);\n\
\n\
      this.check_(undefined, true);\n\
    },\n\
\n\
    disconnect_: function() {\n\
      this.value_ = undefined;\n\
\n\
      if (this.directObserver_) {\n\
        this.directObserver_.close(this);\n\
        this.directObserver_ = undefined;\n\
      }\n\
    },\n\
\n\
    iterateObjects_: function(observe) {\n\
      this.path_.iterateObjects(this.object_, observe);\n\
    },\n\
\n\
    check_: function(changeRecords, skipChanges) {\n\
      var oldValue = this.value_;\n\
      this.value_ = this.path_.getValueFrom(this.object_);\n\
      if (skipChanges || areSameValue(this.value_, oldValue))\n\
        return false;\n\
\n\
      this.report_([this.value_, oldValue]);\n\
      return true;\n\
    },\n\
\n\
    setValue: function(newValue) {\n\
      if (this.path_)\n\
        this.path_.setValueFrom(this.object_, newValue);\n\
    }\n\
  });\n\
\n\
  function CompoundObserver(reportChangesOnOpen) {\n\
    Observer.call(this);\n\
\n\
    this.reportChangesOnOpen_ = reportChangesOnOpen;\n\
    this.value_ = [];\n\
    this.directObserver_ = undefined;\n\
    this.observed_ = [];\n\
  }\n\
\n\
  var observerSentinel = {};\n\
\n\
  CompoundObserver.prototype = createObject({\n\
    __proto__: Observer.prototype,\n\
\n\
    connect_: function() {\n\
      if (hasObserve) {\n\
        var object;\n\
        var needsDirectObserver = false;\n\
        for (var i = 0; i < this.observed_.length; i += 2) {\n\
          object = this.observed_[i]\n\
          if (object !== observerSentinel) {\n\
            needsDirectObserver = true;\n\
            break;\n\
          }\n\
        }\n\
\n\
        if (needsDirectObserver)\n\
          this.directObserver_ = getObservedSet(this, object);\n\
      }\n\
\n\
      this.check_(undefined, !this.reportChangesOnOpen_);\n\
    },\n\
\n\
    disconnect_: function() {\n\
      for (var i = 0; i < this.observed_.length; i += 2) {\n\
        if (this.observed_[i] === observerSentinel)\n\
          this.observed_[i + 1].close();\n\
      }\n\
      this.observed_.length = 0;\n\
      this.value_.length = 0;\n\
\n\
      if (this.directObserver_) {\n\
        this.directObserver_.close(this);\n\
        this.directObserver_ = undefined;\n\
      }\n\
    },\n\
\n\
    addPath: function(object, path) {\n\
      if (this.state_ != UNOPENED && this.state_ != RESETTING)\n\
        throw Error('Cannot add paths once started.');\n\
\n\
      var path = getPath(path);\n\
      this.observed_.push(object, path);\n\
      if (!this.reportChangesOnOpen_)\n\
        return;\n\
      var index = this.observed_.length / 2 - 1;\n\
      this.value_[index] = path.getValueFrom(object);\n\
    },\n\
\n\
    addObserver: function(observer) {\n\
      if (this.state_ != UNOPENED && this.state_ != RESETTING)\n\
        throw Error('Cannot add observers once started.');\n\
\n\
      this.observed_.push(observerSentinel, observer);\n\
      if (!this.reportChangesOnOpen_)\n\
        return;\n\
      var index = this.observed_.length / 2 - 1;\n\
      this.value_[index] = observer.open(this.deliver, this);\n\
    },\n\
\n\
    startReset: function() {\n\
      if (this.state_ != OPENED)\n\
        throw Error('Can only reset while open');\n\
\n\
      this.state_ = RESETTING;\n\
      this.disconnect_();\n\
    },\n\
\n\
    finishReset: function() {\n\
      if (this.state_ != RESETTING)\n\
        throw Error('Can only finishReset after startReset');\n\
      this.state_ = OPENED;\n\
      this.connect_();\n\
\n\
      return this.value_;\n\
    },\n\
\n\
    iterateObjects_: function(observe) {\n\
      var object;\n\
      for (var i = 0; i < this.observed_.length; i += 2) {\n\
        object = this.observed_[i]\n\
        if (object !== observerSentinel)\n\
          this.observed_[i + 1].iterateObjects(object, observe)\n\
      }\n\
    },\n\
\n\
    check_: function(changeRecords, skipChanges) {\n\
      var oldValues;\n\
      for (var i = 0; i < this.observed_.length; i += 2) {\n\
        var object = this.observed_[i];\n\
        var path = this.observed_[i+1];\n\
        var value;\n\
        if (object === observerSentinel) {\n\
          var observable = path;\n\
          value = this.state_ === UNOPENED ?\n\
              observable.open(this.deliver, this) :\n\
              observable.discardChanges();\n\
        } else {\n\
          value = path.getValueFrom(object);\n\
        }\n\
\n\
        if (skipChanges) {\n\
          this.value_[i / 2] = value;\n\
          continue;\n\
        }\n\
\n\
        if (areSameValue(value, this.value_[i / 2]))\n\
          continue;\n\
\n\
        oldValues = oldValues || [];\n\
        oldValues[i / 2] = this.value_[i / 2];\n\
        this.value_[i / 2] = value;\n\
      }\n\
\n\
      if (!oldValues)\n\
        return false;\n\
\n\
      // TODO(rafaelw): Having observed_ as the third callback arg here is\n\
      // pretty lame API. Fix.\n\
      this.report_([this.value_, oldValues, this.observed_]);\n\
      return true;\n\
    }\n\
  });\n\
\n\
  function identFn(value) { return value; }\n\
\n\
  function ObserverTransform(observable, getValueFn, setValueFn,\n\
                             dontPassThroughSet) {\n\
    this.callback_ = undefined;\n\
    this.target_ = undefined;\n\
    this.value_ = undefined;\n\
    this.observable_ = observable;\n\
    this.getValueFn_ = getValueFn || identFn;\n\
    this.setValueFn_ = setValueFn || identFn;\n\
    // TODO(rafaelw): This is a temporary hack. PolymerExpressions needs this\n\
    // at the moment because of a bug in it's dependency tracking.\n\
    this.dontPassThroughSet_ = dontPassThroughSet;\n\
  }\n\
\n\
  ObserverTransform.prototype = {\n\
    open: function(callback, target) {\n\
      this.callback_ = callback;\n\
      this.target_ = target;\n\
      this.value_ =\n\
          this.getValueFn_(this.observable_.open(this.observedCallback_, this));\n\
      return this.value_;\n\
    },\n\
\n\
    observedCallback_: function(value) {\n\
      value = this.getValueFn_(value);\n\
      if (areSameValue(value, this.value_))\n\
        return;\n\
      var oldValue = this.value_;\n\
      this.value_ = value;\n\
      this.callback_.call(this.target_, this.value_, oldValue);\n\
    },\n\
\n\
    discardChanges: function() {\n\
      this.value_ = this.getValueFn_(this.observable_.discardChanges());\n\
      return this.value_;\n\
    },\n\
\n\
    deliver: function() {\n\
      return this.observable_.deliver();\n\
    },\n\
\n\
    setValue: function(value) {\n\
      value = this.setValueFn_(value);\n\
      if (!this.dontPassThroughSet_ && this.observable_.setValue)\n\
        return this.observable_.setValue(value);\n\
    },\n\
\n\
    close: function() {\n\
      if (this.observable_)\n\
        this.observable_.close();\n\
      this.callback_ = undefined;\n\
      this.target_ = undefined;\n\
      this.observable_ = undefined;\n\
      this.value_ = undefined;\n\
      this.getValueFn_ = undefined;\n\
      this.setValueFn_ = undefined;\n\
    }\n\
  }\n\
\n\
  var expectedRecordTypes = {\n\
    add: true,\n\
    update: true,\n\
    delete: true\n\
  };\n\
\n\
 var updateRecord = {\n\
    object: undefined,\n\
    type: 'update',\n\
    name: undefined,\n\
    oldValue: undefined\n\
  };\n\
\n\
  function notify(object, name, value, oldValue) {\n\
    if (areSameValue(value, oldValue))\n\
      return;\n\
\n\
    // TODO(rafaelw): Hack hack hack. This entire code really needs to move\n\
    // out of observe-js into polymer.\n\
    if (typeof object.propertyChanged_ == 'function')\n\
      object.propertyChanged_(name, value, oldValue);\n\
\n\
    if (!hasObserve)\n\
      return;\n\
\n\
    var notifier = object.notifier_;\n\
    if (!notifier)\n\
      notifier = object.notifier_ = Object.getNotifier(object);\n\
\n\
    updateRecord.object = object;\n\
    updateRecord.name = name;\n\
    updateRecord.oldValue = oldValue;\n\
\n\
    notifier.notify(updateRecord);\n\
  }\n\
\n\
  Observer.createBindablePrototypeAccessor = function(proto, name) {\n\
    var privateName = name + '_';\n\
    var privateObservable  = name + 'Observable_';\n\
\n\
    proto[privateName] = proto[name];\n\
\n\
    Object.defineProperty(proto, name, {\n\
      get: function() {\n\
        var observable = this[privateObservable];\n\
        if (observable)\n\
          observable.deliver();\n\
\n\
        return this[privateName];\n\
      },\n\
      set: function(value) {\n\
        var observable = this[privateObservable];\n\
        if (observable) {\n\
          observable.setValue(value);\n\
          return;\n\
        }\n\
\n\
        var oldValue = this[privateName];\n\
        this[privateName] = value;\n\
        notify(this, name, value, oldValue);\n\
\n\
        return value;\n\
      },\n\
      configurable: true\n\
    });\n\
  }\n\
\n\
  Observer.bindToInstance = function(instance, name, observable, resolveFn) {\n\
    var privateName = name + '_';\n\
    var privateObservable  = name + 'Observable_';\n\
\n\
    instance[privateObservable] = observable;\n\
    var oldValue = instance[privateName];\n\
    var value = observable.open(function(value, oldValue) {\n\
      instance[privateName] = value;\n\
      notify(instance, name, value, oldValue);\n\
    });\n\
\n\
    if (resolveFn && !areSameValue(oldValue, value)) {\n\
      var resolvedValue = resolveFn(oldValue, value);\n\
      if (!areSameValue(value, resolvedValue)) {\n\
        value = resolvedValue;\n\
        if (observable.setValue)\n\
          observable.setValue(value);\n\
      }\n\
    }\n\
\n\
    instance[privateName] = value;\n\
    notify(instance, name, value, oldValue);\n\
\n\
    return {\n\
      close: function() {\n\
        observable.close();\n\
        instance[privateObservable] = undefined;\n\
      }\n\
    };\n\
  }\n\
\n\
  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {\n\
    var added = {};\n\
    var removed = {};\n\
\n\
    for (var i = 0; i < changeRecords.length; i++) {\n\
      var record = changeRecords[i];\n\
      if (!expectedRecordTypes[record.type]) {\n\
        console.error('Unknown changeRecord type: ' + record.type);\n\
        console.error(record);\n\
        continue;\n\
      }\n\
\n\
      if (!(record.name in oldValues))\n\
        oldValues[record.name] = record.oldValue;\n\
\n\
      if (record.type == 'update')\n\
        continue;\n\
\n\
      if (record.type == 'add') {\n\
        if (record.name in removed)\n\
          delete removed[record.name];\n\
        else\n\
          added[record.name] = true;\n\
\n\
        continue;\n\
      }\n\
\n\
      // type = 'delete'\n\
      if (record.name in added) {\n\
        delete added[record.name];\n\
        delete oldValues[record.name];\n\
      } else {\n\
        removed[record.name] = true;\n\
      }\n\
    }\n\
\n\
    for (var prop in added)\n\
      added[prop] = object[prop];\n\
\n\
    for (var prop in removed)\n\
      removed[prop] = undefined;\n\
\n\
    var changed = {};\n\
    for (var prop in oldValues) {\n\
      if (prop in added || prop in removed)\n\
        continue;\n\
\n\
      var newValue = object[prop];\n\
      if (oldValues[prop] !== newValue)\n\
        changed[prop] = newValue;\n\
    }\n\
\n\
    return {\n\
      added: added,\n\
      removed: removed,\n\
      changed: changed\n\
    };\n\
  }\n\
\n\
  function newSplice(index, removed, addedCount) {\n\
    return {\n\
      index: index,\n\
      removed: removed,\n\
      addedCount: addedCount\n\
    };\n\
  }\n\
\n\
  var EDIT_LEAVE = 0;\n\
  var EDIT_UPDATE = 1;\n\
  var EDIT_ADD = 2;\n\
  var EDIT_DELETE = 3;\n\
\n\
  function ArraySplice() {}\n\
\n\
  ArraySplice.prototype = {\n\
\n\
    // Note: This function is *based* on the computation of the Levenshtein\n\
    // \"edit\" distance. The one change is that \"updates\" are treated as two\n\
    // edits - not one. With Array splices, an update is really a delete\n\
    // followed by an add. By retaining this, we optimize for \"keeping\" the\n\
    // maximum array items in the original array. For example:\n\
    //\n\
    //   'xxxx123' -> '123yyyy'\n\
    //\n\
    // With 1-edit updates, the shortest path would be just to update all seven\n\
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This\n\
    // leaves the substring '123' intact.\n\
    calcEditDistances: function(current, currentStart, currentEnd,\n\
                                old, oldStart, oldEnd) {\n\
      // \"Deletion\" columns\n\
      var rowCount = oldEnd - oldStart + 1;\n\
      var columnCount = currentEnd - currentStart + 1;\n\
      var distances = new Array(rowCount);\n\
\n\
      // \"Addition\" rows. Initialize null column.\n\
      for (var i = 0; i < rowCount; i++) {\n\
        distances[i] = new Array(columnCount);\n\
        distances[i][0] = i;\n\
      }\n\
\n\
      // Initialize null row\n\
      for (var j = 0; j < columnCount; j++)\n\
        distances[0][j] = j;\n\
\n\
      for (var i = 1; i < rowCount; i++) {\n\
        for (var j = 1; j < columnCount; j++) {\n\
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))\n\
            distances[i][j] = distances[i - 1][j - 1];\n\
          else {\n\
            var north = distances[i - 1][j] + 1;\n\
            var west = distances[i][j - 1] + 1;\n\
            distances[i][j] = north < west ? north : west;\n\
          }\n\
        }\n\
      }\n\
\n\
      return distances;\n\
    },\n\
\n\
    // This starts at the final weight, and walks \"backward\" by finding\n\
    // the minimum previous weight recursively until the origin of the weight\n\
    // matrix.\n\
    spliceOperationsFromEditDistances: function(distances) {\n\
      var i = distances.length - 1;\n\
      var j = distances[0].length - 1;\n\
      var current = distances[i][j];\n\
      var edits = [];\n\
      while (i > 0 || j > 0) {\n\
        if (i == 0) {\n\
          edits.push(EDIT_ADD);\n\
          j--;\n\
          continue;\n\
        }\n\
        if (j == 0) {\n\
          edits.push(EDIT_DELETE);\n\
          i--;\n\
          continue;\n\
        }\n\
        var northWest = distances[i - 1][j - 1];\n\
        var west = distances[i - 1][j];\n\
        var north = distances[i][j - 1];\n\
\n\
        var min;\n\
        if (west < north)\n\
          min = west < northWest ? west : northWest;\n\
        else\n\
          min = north < northWest ? north : northWest;\n\
\n\
        if (min == northWest) {\n\
          if (northWest == current) {\n\
            edits.push(EDIT_LEAVE);\n\
          } else {\n\
            edits.push(EDIT_UPDATE);\n\
            current = northWest;\n\
          }\n\
          i--;\n\
          j--;\n\
        } else if (min == west) {\n\
          edits.push(EDIT_DELETE);\n\
          i--;\n\
          current = west;\n\
        } else {\n\
          edits.push(EDIT_ADD);\n\
          j--;\n\
          current = north;\n\
        }\n\
      }\n\
\n\
      edits.reverse();\n\
      return edits;\n\
    },\n\
\n\
    /**\n\
     * Splice Projection functions:\n\
     *\n\
     * A splice map is a representation of how a previous array of items\n\
     * was transformed into a new array of items. Conceptually it is a list of\n\
     * tuples of\n\
     *\n\
     *   <index, removed, addedCount>\n\
     *\n\
     * which are kept in ascending index order of. The tuple represents that at\n\
     * the |index|, |removed| sequence of items were removed, and counting forward\n\
     * from |index|, |addedCount| items were added.\n\
     */\n\
\n\
    /**\n\
     * Lacking individual splice mutation information, the minimal set of\n\
     * splices can be synthesized given the previous state and final state of an\n\
     * array. The basic approach is to calculate the edit distance matrix and\n\
     * choose the shortest path through it.\n\
     *\n\
     * Complexity: O(l * p)\n\
     *   l: The length of the current array\n\
     *   p: The length of the old array\n\
     */\n\
    calcSplices: function(current, currentStart, currentEnd,\n\
                          old, oldStart, oldEnd) {\n\
      var prefixCount = 0;\n\
      var suffixCount = 0;\n\
\n\
      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);\n\
      if (currentStart == 0 && oldStart == 0)\n\
        prefixCount = this.sharedPrefix(current, old, minLength);\n\
\n\
      if (currentEnd == current.length && oldEnd == old.length)\n\
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);\n\
\n\
      currentStart += prefixCount;\n\
      oldStart += prefixCount;\n\
      currentEnd -= suffixCount;\n\
      oldEnd -= suffixCount;\n\
\n\
      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)\n\
        return [];\n\
\n\
      if (currentStart == currentEnd) {\n\
        var splice = newSplice(currentStart, [], 0);\n\
        while (oldStart < oldEnd)\n\
          splice.removed.push(old[oldStart++]);\n\
\n\
        return [ splice ];\n\
      } else if (oldStart == oldEnd)\n\
        return [ newSplice(currentStart, [], currentEnd - currentStart) ];\n\
\n\
      var ops = this.spliceOperationsFromEditDistances(\n\
          this.calcEditDistances(current, currentStart, currentEnd,\n\
                                 old, oldStart, oldEnd));\n\
\n\
      var splice = undefined;\n\
      var splices = [];\n\
      var index = currentStart;\n\
      var oldIndex = oldStart;\n\
      for (var i = 0; i < ops.length; i++) {\n\
        switch(ops[i]) {\n\
          case EDIT_LEAVE:\n\
            if (splice) {\n\
              splices.push(splice);\n\
              splice = undefined;\n\
            }\n\
\n\
            index++;\n\
            oldIndex++;\n\
            break;\n\
          case EDIT_UPDATE:\n\
            if (!splice)\n\
              splice = newSplice(index, [], 0);\n\
\n\
            splice.addedCount++;\n\
            index++;\n\
\n\
            splice.removed.push(old[oldIndex]);\n\
            oldIndex++;\n\
            break;\n\
          case EDIT_ADD:\n\
            if (!splice)\n\
              splice = newSplice(index, [], 0);\n\
\n\
            splice.addedCount++;\n\
            index++;\n\
            break;\n\
          case EDIT_DELETE:\n\
            if (!splice)\n\
              splice = newSplice(index, [], 0);\n\
\n\
            splice.removed.push(old[oldIndex]);\n\
            oldIndex++;\n\
            break;\n\
        }\n\
      }\n\
\n\
      if (splice) {\n\
        splices.push(splice);\n\
      }\n\
      return splices;\n\
    },\n\
\n\
    sharedPrefix: function(current, old, searchLength) {\n\
      for (var i = 0; i < searchLength; i++)\n\
        if (!this.equals(current[i], old[i]))\n\
          return i;\n\
      return searchLength;\n\
    },\n\
\n\
    sharedSuffix: function(current, old, searchLength) {\n\
      var index1 = current.length;\n\
      var index2 = old.length;\n\
      var count = 0;\n\
      while (count < searchLength && this.equals(current[--index1], old[--index2]))\n\
        count++;\n\
\n\
      return count;\n\
    },\n\
\n\
    calculateSplices: function(current, previous) {\n\
      return this.calcSplices(current, 0, current.length, previous, 0,\n\
                              previous.length);\n\
    },\n\
\n\
    equals: function(currentValue, previousValue) {\n\
      return currentValue === previousValue;\n\
    }\n\
  };\n\
\n\
  var arraySplice = new ArraySplice();\n\
\n\
  function calcSplices(current, currentStart, currentEnd,\n\
                       old, oldStart, oldEnd) {\n\
    return arraySplice.calcSplices(current, currentStart, currentEnd,\n\
                                   old, oldStart, oldEnd);\n\
  }\n\
\n\
  function intersect(start1, end1, start2, end2) {\n\
    // Disjoint\n\
    if (end1 < start2 || end2 < start1)\n\
      return -1;\n\
\n\
    // Adjacent\n\
    if (end1 == start2 || end2 == start1)\n\
      return 0;\n\
\n\
    // Non-zero intersect, span1 first\n\
    if (start1 < start2) {\n\
      if (end1 < end2)\n\
        return end1 - start2; // Overlap\n\
      else\n\
        return end2 - start2; // Contained\n\
    } else {\n\
      // Non-zero intersect, span2 first\n\
      if (end2 < end1)\n\
        return end2 - start1; // Overlap\n\
      else\n\
        return end1 - start1; // Contained\n\
    }\n\
  }\n\
\n\
  function mergeSplice(splices, index, removed, addedCount) {\n\
\n\
    var splice = newSplice(index, removed, addedCount);\n\
\n\
    var inserted = false;\n\
    var insertionOffset = 0;\n\
\n\
    for (var i = 0; i < splices.length; i++) {\n\
      var current = splices[i];\n\
      current.index += insertionOffset;\n\
\n\
      if (inserted)\n\
        continue;\n\
\n\
      var intersectCount = intersect(splice.index,\n\
                                     splice.index + splice.removed.length,\n\
                                     current.index,\n\
                                     current.index + current.addedCount);\n\
\n\
      if (intersectCount >= 0) {\n\
        // Merge the two splices\n\
\n\
        splices.splice(i, 1);\n\
        i--;\n\
\n\
        insertionOffset -= current.addedCount - current.removed.length;\n\
\n\
        splice.addedCount += current.addedCount - intersectCount;\n\
        var deleteCount = splice.removed.length +\n\
                          current.removed.length - intersectCount;\n\
\n\
        if (!splice.addedCount && !deleteCount) {\n\
          // merged splice is a noop. discard.\n\
          inserted = true;\n\
        } else {\n\
          var removed = current.removed;\n\
\n\
          if (splice.index < current.index) {\n\
            // some prefix of splice.removed is prepended to current.removed.\n\
            var prepend = splice.removed.slice(0, current.index - splice.index);\n\
            Array.prototype.push.apply(prepend, removed);\n\
            removed = prepend;\n\
          }\n\
\n\
          if (splice.index + splice.removed.length > current.index + current.addedCount) {\n\
            // some suffix of splice.removed is appended to current.removed.\n\
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);\n\
            Array.prototype.push.apply(removed, append);\n\
          }\n\
\n\
          splice.removed = removed;\n\
          if (current.index < splice.index) {\n\
            splice.index = current.index;\n\
          }\n\
        }\n\
      } else if (splice.index < current.index) {\n\
        // Insert splice here.\n\
\n\
        inserted = true;\n\
\n\
        splices.splice(i, 0, splice);\n\
        i++;\n\
\n\
        var offset = splice.addedCount - splice.removed.length\n\
        current.index += offset;\n\
        insertionOffset += offset;\n\
      }\n\
    }\n\
\n\
    if (!inserted)\n\
      splices.push(splice);\n\
  }\n\
\n\
  function createInitialSplices(array, changeRecords) {\n\
    var splices = [];\n\
\n\
    for (var i = 0; i < changeRecords.length; i++) {\n\
      var record = changeRecords[i];\n\
      switch(record.type) {\n\
        case 'splice':\n\
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);\n\
          break;\n\
        case 'add':\n\
        case 'update':\n\
        case 'delete':\n\
          if (!isIndex(record.name))\n\
            continue;\n\
          var index = toNumber(record.name);\n\
          if (index < 0)\n\
            continue;\n\
          mergeSplice(splices, index, [record.oldValue], 1);\n\
          break;\n\
        default:\n\
          console.error('Unexpected record type: ' + JSON.stringify(record));\n\
          break;\n\
      }\n\
    }\n\
\n\
    return splices;\n\
  }\n\
\n\
  function projectArraySplices(array, changeRecords) {\n\
    var splices = [];\n\
\n\
    createInitialSplices(array, changeRecords).forEach(function(splice) {\n\
      if (splice.addedCount == 1 && splice.removed.length == 1) {\n\
        if (splice.removed[0] !== array[splice.index])\n\
          splices.push(splice);\n\
\n\
        return\n\
      };\n\
\n\
      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount,\n\
                                           splice.removed, 0, splice.removed.length));\n\
    });\n\
\n\
    return splices;\n\
  }\n\
\n\
  global.Observer = Observer;\n\
  global.Observer.runEOM_ = runEOM;\n\
  global.Observer.observerSentinel_ = observerSentinel; // for testing.\n\
  global.Observer.hasObjectObserve = hasObserve;\n\
  global.ArrayObserver = ArrayObserver;\n\
  global.ArrayObserver.calculateSplices = function(current, previous) {\n\
    return arraySplice.calculateSplices(current, previous);\n\
  };\n\
\n\
  global.ArraySplice = ArraySplice;\n\
  global.ObjectObserver = ObjectObserver;\n\
  global.PathObserver = PathObserver;\n\
  global.CompoundObserver = CompoundObserver;\n\
  global.Path = Path;\n\
  global.ObserverTransform = ObserverTransform;\n\
})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? exports || global : this || window);\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/vendor/observe-js/observe.js"
));

require.register("indefinido~observable@es6-modules/vendor/shims/accessors-legacy.js", Function("exports, module",
"/*\n\
 * Xccessors Legacy: Cross-browser legacy non-standard accessors\n\
 * http://github.com/eligrey/Xccessors\n\
 *\n\
 * 2010-03-21\n\
 *\n\
 * By Elijah Grey, http://eligrey.com\n\
 *\n\
 * A shim that implements __defineGetter__, __defineSetter__, __lookupGetter__,\n\
 * and __lookupSetter__\n\
 * in browsers that have ECMAScript 5 accessor support but not the legacy methods.\n\
 *\n\
 * Public Domain.\n\
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.\n\
*/\n\
\n\
/*global Element, Window, HTMLDocument */\n\
\n\
/*jslint white: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true,\n\
  strict: true, newcap: true, immed: true, maxlen: 90 */\n\
\n\
/*! @source http://purl.eligrey.com/github/Xccessors/blob/master/xccessors-legacy.js*/\n\
\n\
\"use strict\";\n\
\n\
(function () {\n\
    var\n\
    defineProp = Object.defineProperty,\n\
    getProp    = Object.getOwnPropertyDescriptor,\n\
\n\
    // methods being implemented\n\
    methods    = [\n\
        \"__defineGetter__\", \"__defineSetter__\", \"__lookupGetter__\", \"__lookupSetter__\"\n\
    ],\n\
\n\
    // objects to implement legacy methods onto their prototypes\n\
    // Object.prototype[method] doesn't work on everything for IE\n\
    extend     = [Object, String, Array, Function, Boolean, Number,\n\
                 RegExp, Date, Error],\n\
    len        = extend.length,\n\
    proto      = \"prototype\",\n\
    extendMethod = function (method, fun) {\n\
        var i = len;\n\
        if (!(method in {})) {\n\
            while (i--) {\n\
              defineProp(extend[i][proto], method, {value: fun, enumerable: false})\n\
            }\n\
        }\n\
    };\n\
\n\
    // IE8 Does not support enumerable key so we abort!\n\
    // TODO Fix this without cluttering the prototype\n\
    try {defineProp({}, 'domo', {value: true, enumerable: false})} catch (e) {return;}\n\
\n\
    // IE7 Does not have Element, Window defined, so we check here\n\
    if (typeof Element != 'undefined') extend.push(Element);\n\
    if (typeof Window != 'undefined') extend.push(Window);\n\
\n\
    // IE9 Does not have html document defined, so we check here\n\
    if (typeof HTMLDocument != 'undefined') extend.push(HTMLDocument);\n\
\n\
\n\
    if (defineProp) {\n\
        extendMethod(methods[0], function (prop, fun) { // __defineGetter__\n\
            defineProp(this, prop, { get: fun });\n\
        });\n\
\n\
        extendMethod(methods[1], function (prop, fun) { // __defineSetter__\n\
            defineProp(this, prop, { set: fun });\n\
        });\n\
    }\n\
\n\
    if (getProp && !defineProp.requiresDomElement) {\n\
      extendMethod(methods[2], function (prop) { // __lookupGetter__\n\
        var descriptor = getProp(this, prop);\n\
        if (descriptor && descriptor.get) return descriptor.get;\n\
\n\
         // look in prototype too\n\
        descriptor = getProp(this.constructor[proto], prop);\n\
        if (descriptor && descriptor.get) return descriptor.get;\n\
      });\n\
\n\
      extendMethod(methods[3], function (prop) { // __lookupSetter__\n\
        var descriptor = getProp(this, prop);\n\
        if (descriptor && descriptor.set) return descriptor.set;\n\
\n\
        // look in prototype too\n\
        descriptor = getProp(this.constructor[proto], prop);\n\
        if (descriptor && descriptor.set) return descriptor.set;\n\
      });\n\
    }\n\
}());\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/vendor/shims/accessors-legacy.js"
));

require.register("indefinido~observable@es6-modules/vendor/shims/accessors.js", Function("exports, module",
"'use strict';\n\
\n\
(function () {\n\
  // Cache native objects for better performacy and easy to use\n\
  // references\n\
  var ObjectProto = Object.prototype,\n\
  hasOwnProp = ObjectProto.hasOwnProperty,\n\
  getProp    = Object.getOwnPropertyDescriptor,\n\
  defineProp = Object.defineProperty,\n\
  objectCreate = Object.create,\n\
  toStrings = [],\n\
  features = null,\n\
  stack = [], detach,\n\
  fixedOwnProperty,\n\
   prototypeBase = [Object, String, Array, Function, Boolean, Number, RegExp, Date, Error];\n\
\n\
  // IE7 Does not have Element and Window defined, so only add them if\n\
  // they exists check here\n\
  if (typeof Element != 'undefined') prototypeBase.push(Element);\n\
  if (typeof Window  != 'undefined') prototypeBase.push(Window);\n\
\n\
  features = {\n\
    allowsNonEnumerableProperty: function () {\n\
      var broken = false;\n\
      try {\n\
        defineProp({}, 'x', {})\n\
      } catch(e) {\n\
        broken = true;\n\
      }\n\
\n\
      return (!broken) && (!!defineProp);\n\
    },\n\
    supportsOnPropertyChangeEvent: function () {\n\
      var test = document.createElement('domo');\n\
      return 'onpropertychange' in test\n\
    }\n\
  }\n\
\n\
  if (!features.allowsNonEnumerableProperty() && features.supportsOnPropertyChangeEvent()) {\n\
\n\
    // Check if node is on document\n\
    var inDocument = function inDocument (node) {\n\
      var curr = node;\n\
      while (curr != null) {\n\
        curr = curr.parentNode;\n\
        if (curr == document) return true;\n\
      }\n\
      return false;\n\
    },\n\
\n\
    // Generate property event handler for setting some property\n\
    generate_setter = function generate_setter (object, property, descriptor) {\n\
      var setter = function object_define_property_shim_change_listener (event) {\n\
        var current_value, changed_value;\n\
        if (\n\
          // if we are setting this property\n\
          event.propertyName == property\n\
\n\
          // prevent firing setters again\n\
          // by checking callstack\n\
          && stack.indexOf(property) === -1\n\
        ) {\n\
          // Remove the event so it doesn't fire again and\n\
          // create a loop\n\
          object.detachEvent(\"onpropertychange\", setter);\n\
\n\
          // If detaching the current setter\n\
          // just remove the event listener\n\
          if (detach) return;\n\
\n\
          // get the changed value, run it through the set function\n\
          changed_value = object[property];\n\
          descriptor.set.call(object, changed_value);\n\
\n\
          // Restore get function if:\n\
          //  it was mentioned on definition\n\
          //  there's no falsey value, in that case we just need to return falsey value\n\
          //  current toString is not the getter, to prevent further unecessary redefinitions\n\
          if (descriptor.get && descriptor.value && descriptor.value.toString != descriptor.bound_getter) {\n\
            // TODO if (descriptor.get + '' === 'undefined') descriptor.get = '';        // Handle undefined getter\n\
            descriptor.value.toString = descriptor.bound_getter\n\
          }\n\
\n\
          // Update stored values\n\
          object[property] = descriptor.value = changed_value;\n\
\n\
          // restore the event handler\n\
          object.attachEvent(\"onpropertychange\", setter);\n\
\n\
          // stack.pop();\n\
          return false;\n\
        }\n\
      }\n\
\n\
      return setter;\n\
    };\n\
\n\
    // Shim define property with apropriated fail cases exceptions\n\
    Object.defineProperty = function (obj, prop, descriptor) {\n\
      var fix;\n\
\n\
      if (!prop)\n\
\n\
      if (descriptor.set) {\n\
        if (!obj.attachEvent) throw new TypeError('Object.defineProperty: First parameter must be a dom element. When descriptor has \\'set\\' property.');\n\
\n\
        if (!fix && !inDocument(obj)) throw new TypeError('Object.defineProperty: Dom element must be attached in document.');\n\
      }\n\
\n\
      if (!descriptor) throw new TypeError('Object.defineProperty (object, property, descriptor): Descriptor must be an object, was \\'' + descriptor + '\\'.');\n\
\n\
      // Store current value in descriptor\n\
      // TODO only try to set descriptor value if it was passed as parameter\n\
      descriptor.value = descriptor.value || (descriptor.get && descriptor.get.call(obj)) || obj[prop];\n\
\n\
      if (descriptor.set) {\n\
        // Detach old listeners if any\n\
        detach = true;\n\
        obj[prop] = 'detaching';\n\
        detach = false;\n\
\n\
        if (descriptor.get) {\n\
          // TODO remove jquery dependency\n\
          descriptor.bound_getter   = $.extend($.proxy(descriptor.get, obj), descriptor.get);\n\
\n\
          // Why? we only bind the getter when we have a non falsey value\n\
          if (descriptor.value) descriptor.value.toString = descriptor.bound_getter;\n\
\n\
          // Although its not allowed for convention to have getters\n\
          // and setters with the descriptor value, here we just reuse\n\
          // the descriptor stored value\n\
          obj[prop] = descriptor.value;\n\
        }\n\
\n\
        (fix || obj).attachEvent(\"onpropertychange\", generate_setter(obj, prop, descriptor));\n\
\n\
      } else if (descriptor.get) {\n\
        descriptor.bound_getter   = $.extend($.proxy(descriptor.get, obj), descriptor.get);\n\
\n\
        // Why? we only bind the getter when we have a non falsey value\n\
        if (descriptor.value) descriptor.value.toString = descriptor.bound_getter;\n\
\n\
        // Although its not allowed for convention to have getters\n\
        // and setters with the descriptor value, here we just reuse\n\
        // the descriptor stored value\n\
        obj[prop] = descriptor.value;\n\
      } else {\n\
        obj[prop] = descriptor.value;\n\
      }\n\
\n\
      return obj;\n\
    }\n\
\n\
    // Allow others to check requirements for define property\n\
    Object.defineProperty.requiresDomElement = true\n\
  }\n\
\n\
\n\
  // Since we shimed define property, we can also shim defineProperties\n\
  if (!Object.defineProperties) {\n\
    Object.defineProperties = function (obj, props) {\n\
      for (var prop in props) {\n\
        if (hasOwnProp.call(props, prop)) {\n\
          Object.defineProperty(obj, prop, props[prop]);\n\
        }\n\
      }\n\
    };\n\
\n\
    baseElement      = document.createElement('fix');\n\
    fixedOwnProperty = function (name) {\n\
      if (name in baseElement) return false;\n\
      return hasOwnProp.call(this, name);\n\
    };\n\
\n\
\n\
    Object.create = function (prototype, properties) {\n\
      var complexDescriptor, fix, descriptor, name;\n\
\n\
      for (name in properties) {\n\
        descriptor = properties[name]\n\
        if (descriptor instanceof Object) {\n\
          complexDescriptor = !!(descriptor.get || descriptor.set)\n\
\n\
          if (complexDescriptor) {\n\
            break;\n\
          }\n\
        }\n\
      }\n\
\n\
      if (complexDescriptor || prototype.nodeName === 'fix' || properties && properties._shim) {\n\
        properties && delete properties._shim;\n\
\n\
        if (typeof object != 'function') {\n\
          fix = document.createElement('fix');\n\
          document.appendChild(fix);\n\
\n\
          // Copy over prototype properties\n\
          for (name in prototype) {\n\
            try {\n\
              if (name in baseElement) continue;\n\
              fix[name] = prototype[name];\n\
            } catch (e) {\n\
              console.warn(\"Object.create: Invalid shimmed property: \" + name + \", with error \" + e);\n\
            }\n\
          }\n\
\n\
          // Ensure most normalized for loops to work property, by\n\
          // skiping the dom element properties on own property\n\
          // checking.\n\
          //\n\
          // TODO ensure other own property methods checking\n\
          fix.hasOwnProperty = fixedOwnProperty\n\
\n\
          Object.defineProperties(fix, properties);\n\
        } else {\n\
          throw new TypeError('Functions with complex descriptors not implemented yet');\n\
        }\n\
        return fix;\n\
      } else {\n\
        return objectCreate(prototype, properties)\n\
      }\n\
    }\n\
  };\n\
\n\
\n\
  /* TODO Use define Property, and only define if\n\
     non-enumerable properties are allowed\n\
\n\
     also define __defineGetter__ and __defineSetter__\n\
  if (!Object.defineProperty.requiresDomElement) {\n\
    if (!Object.prototype.__lookupGetter__) {\n\
      Object.__lookupGetter__ = function () {\n\
      console && console.log('__lookupGetter__ not implemented yet');\n\
        return null;\n\
    }\n\
  }\n\
\n\
  if (!Object.__lookupSetter__) {\n\
    Object.prototype.__lookupSetter__ = function () {\n\
      console && console.log('__lookupSetter__ not implemented yet');\n\
      return null;\n\
      }\n\
      }\n\
    }\n\
  */\n\
\n\
})();\n\
\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/vendor/shims/accessors.js"
));

require.register("indefinido~observable@es6-modules/vendor/shims/array.indexOf.js", Function("exports, module",
"if (!Array.prototype.indexOf) { \n\
    Array.prototype.indexOf = function(obj, start) {\n\
         for (var i = (start || 0), j = this.length; i < j; i++) {\n\
             if (this[i] === obj) { return i; }\n\
         }\n\
         return -1;\n\
    }\n\
}\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/vendor/shims/array.indexOf.js"
));

require.register("indefinido~observable@es6-modules/vendor/shims/object.create.js", Function("exports, module",
"// ES5 15.2.3.5\n\
// http://es5.github.com/#x15.2.3.5\n\
if (!Object.create) {\n\
\n\
    // Contributed by Brandon Benvie, October, 2012\n\
    var createEmpty;\n\
    var supportsProto = Object.prototype.__proto__ === null;\n\
    if (supportsProto || typeof document == 'undefined') {\n\
        createEmpty = function () {\n\
            return { \"__proto__\": null };\n\
        };\n\
    } else {\n\
        // In old IE __proto__ can't be used to manually set `null`, nor does\n\
        // any other method exist to make an object that inherits from nothing,\n\
        // aside from Object.prototype itself. Instead, create a new global\n\
        // object and *steal* its Object.prototype and strip it bare. This is\n\
        // used as the prototype to create nullary objects.\n\
        createEmpty = function () {\n\
            var iframe = document.createElement('iframe');\n\
            var parent = document.body || document.documentElement;\n\
            iframe.style.display = 'none';\n\
            parent.appendChild(iframe);\n\
            iframe.src = 'javascript:';\n\
            var empty = iframe.contentWindow.Object.prototype;\n\
            parent.removeChild(iframe);\n\
            iframe = null;\n\
            delete empty.constructor;\n\
            delete empty.hasOwnProperty;\n\
            delete empty.propertyIsEnumerable;\n\
            delete empty.isPrototypeOf;\n\
            delete empty.toLocaleString;\n\
            delete empty.toString;\n\
            delete empty.valueOf;\n\
            empty.__proto__ = null;\n\
\n\
            function Empty() {}\n\
            Empty.prototype = empty;\n\
            // short-circuit future calls\n\
            createEmpty = function () {\n\
                return new Empty();\n\
            };\n\
            return new Empty();\n\
        };\n\
    }\n\
\n\
    Object.create = function create(prototype, properties) {\n\
\n\
        var object;\n\
        function Type() {}  // An empty constructor.\n\
\n\
        if (prototype === null) {\n\
            object = createEmpty();\n\
        } else {\n\
            if (typeof prototype !== \"object\" && typeof prototype !== \"function\") {\n\
                // In the native implementation `parent` can be `null`\n\
                // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)\n\
                // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`\n\
                // like they are in modern browsers. Using `Object.create` on DOM elements\n\
                // is...err...probably inappropriate, but the native version allows for it.\n\
                throw new TypeError(\"Object prototype may only be an Object or null\"); // same msg as Chrome\n\
            }\n\
            Type.prototype = prototype;\n\
            object = new Type();\n\
            // IE has no built-in implementation of `Object.getPrototypeOf`\n\
            // neither `__proto__`, but this manually setting `__proto__` will\n\
            // guarantee that `Object.getPrototypeOf` will work as expected with\n\
            // objects created using `Object.create`\n\
            object.__proto__ = prototype;\n\
        }\n\
\n\
        if (properties !== void 0) {\n\
            Object.defineProperties(object, properties);\n\
        }\n\
\n\
        return object;\n\
    };\n\
}\n\
\n\
//# sourceURL=components/indefinido/observable/es6-modules/vendor/shims/object.create.js"
));

require.modules["indefinido-observable"] = require.modules["indefinido~observable@es6-modules"];
require.modules["indefinido~observable"] = require.modules["indefinido~observable@es6-modules"];
require.modules["observable"] = require.modules["indefinido~observable@es6-modules"];


require.register("indemma", Function("exports, module",
"module.exports = require(\"indemma/lib/record.js\");\n\
\n\
//# sourceURL=index.js"
));

require.register("indemma/lib/extensions/rivets.js", Function("exports, module",
"var root;\n\
\n\
root = typeof exports !== \"undefined\" && exports !== null ? exports : this;\n\
\n\
model.rivets = function() {\n\
  var model_extensions;\n\
\n\
  model_extensions = {\n\
    record: {\n\
      tie: function(element) {\n\
        var lasso;\n\
\n\
        lasso = {};\n\
        lasso[this.resource] = this;\n\
        return rivets.bind(element, lasso);\n\
      }\n\
    },\n\
    preloadData: true\n\
  };\n\
  return model.mix(function(modelable) {\n\
    return $.extend(true, modelable, model_extensions);\n\
  });\n\
};\n\
\n\
//# sourceURL=lib/extensions/rivets.js"
));

require.register("indemma/lib/record.js", Function("exports, module",
"var $, advisable, bind, extend, merge, observable, type,\n\
  __slice = [].slice;\n\
\n\
$ = require(\"component~jquery@1.9.1\");\n\
\n\
type = require(\"component~type@1.0.0\");\n\
\n\
bind = require(\"component~bind@0.0.1\");\n\
\n\
observable = require(\"indefinido~observable@es6-modules\");\n\
\n\
advisable = require(\"indefinido~advisable@master\").mixin;\n\
\n\
extend = require(\"pluma~assimilate@0.3.0\");\n\
\n\
merge = require(\"pluma~assimilate@0.3.0\").withStrategy('deep');\n\
\n\
this.model = (function() {\n\
  var initialize_record, mixer, modelable;\n\
\n\
  modelable = {\n\
    after_mix: [],\n\
    record: {\n\
      after_initialize: [],\n\
      before_initialize: []\n\
    },\n\
    every: function() {\n\
      return this.cache;\n\
    },\n\
    create: function() {\n\
      var params;\n\
\n\
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n\
      throw 'model.create not implemented yet, try using the restful.model.create method';\n\
    },\n\
    where: function(conditions, first) {\n\
      var record, results, _i, _len, _ref;\n\
\n\
      if (first == null) {\n\
        first = false;\n\
      }\n\
      results = [];\n\
      if (type(conditions.id) !== 'array') {\n\
        conditions.id = [conditions.id];\n\
      }\n\
      _ref = this.cache;\n\
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
        record = _ref[_i];\n\
        if (conditions.id.indexOf(record._id) !== -1) {\n\
          if (first) {\n\
            return record;\n\
          } else {\n\
            results.push(record);\n\
          }\n\
        }\n\
      }\n\
      if (first) {\n\
        return null;\n\
      } else {\n\
        return results;\n\
      }\n\
    }\n\
  };\n\
  initialize_record = function(data) {\n\
    var after_initialize, callback, creation, index, instance, _i, _j, _len, _len1, _ref, _ref1;\n\
\n\
    if (data == null) {\n\
      data = {\n\
        resource: this.resource,\n\
        parent_resource: this.parent_resource\n\
      };\n\
    }\n\
    data.resource || (data.resource = this.resource);\n\
    data.parent_resource || (data.parent_resource = this.resource.parent || this.parent_resource);\n\
    data.route || (data.route = this.route);\n\
    data.nested_attributes = this.nested_attributes || [];\n\
    after_initialize = (data.after_initialize || []).concat(this.record.after_initialize);\n\
    creation = extend(Object.create(data, {\n\
      _shim: {}\n\
    }), this.record, creation, {\n\
      after_initialize: after_initialize\n\
    });\n\
    _ref = this.record.before_initialize;\n\
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {\n\
      callback = _ref[index];\n\
      callback.call(this, creation);\n\
    }\n\
    instance = record.call(creation);\n\
    _ref1 = instance.after_initialize;\n\
    for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {\n\
      callback = _ref1[index];\n\
      callback.call(instance, instance);\n\
    }\n\
    delete instance.after_initialize;\n\
    return instance;\n\
  };\n\
  mixer = function(options) {\n\
    var after_initialize, after_mix, callback, instance, _i, _len, _ref;\n\
\n\
    if (this === window) {\n\
      throw 'Model mixin called incorrectly call with model.call {} instead of model({})';\n\
    }\n\
    if (!mixer.stale) {\n\
      mixer.stale = true;\n\
    }\n\
    if (this.record && this.record.after_initialize) {\n\
      after_initialize = this.record.after_initialize.splice(0);\n\
    } else {\n\
      after_initialize = [];\n\
    }\n\
    if (this.after_mix) {\n\
      after_mix = this.after_mix.splice(0);\n\
    } else {\n\
      after_mix = [];\n\
    }\n\
    instance = bind(this, initialize_record);\n\
    extend(instance, merge(this, modelable));\n\
    this.record = instance.record = merge({}, instance.record, modelable.record);\n\
    this.record.after_initialize = instance.record.after_initialize = instance.record.after_initialize.concat(after_initialize);\n\
    this.record.before_initialize = instance.record.before_initialize.concat([]);\n\
    _ref = modelable.after_mix.concat(after_mix);\n\
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
      callback = _ref[_i];\n\
      callback.call(instance, instance);\n\
    }\n\
    return mixer[this.resource.name || this.resource.toString()] = instance;\n\
  };\n\
  mixer.mix = function(blender) {\n\
    if (this.stale) {\n\
      throw \"Trying to change model mixin with \" + object + \" but model already used.\\n\
Check your configuration order\";\n\
    }\n\
    return blender(modelable);\n\
  };\n\
  return mixer;\n\
})();\n\
\n\
this.record = (function() {\n\
  var callbacks, recordable, that;\n\
\n\
  callbacks = {\n\
    dirtify: function() {}\n\
  };\n\
  recordable = {\n\
    dirty: false,\n\
    after_initialize: [callbacks.dirtify]\n\
  };\n\
  that = function(data) {\n\
    var after_initialize;\n\
\n\
    if (this === window) {\n\
      throw \"Mixin called incorrectly, call mixin with call method: record.call(object, data)\";\n\
    }\n\
    data || (data = {});\n\
    after_initialize = (this.after_initialize || []).concat(data.after_initialize || []).concat(recordable.after_initialize);\n\
    return advisable(observable(extend(this, recordable, data, {\n\
      after_initialize: after_initialize\n\
    })));\n\
  };\n\
  that.mix = function(blender) {\n\
    return blender(recordable);\n\
  };\n\
  return that;\n\
})();\n\
\n\
exports.record = this.record;\n\
\n\
exports.model = this.model;\n\
\n\
//# sourceURL=lib/record.js"
));

require.register("indemma/lib/record/associable.js", Function("exports, module",
"var $, associable, callbacks, descriptors, extend, model, plural, root, singular,\n\
  __slice = [].slice;\n\
\n\
root = window;\n\
\n\
$ = require(\"component~jquery@1.9.1\");\n\
\n\
extend = require(\"pluma~assimilate@0.3.0\");\n\
\n\
require(\"indemma/lib/record/resource.js\");\n\
\n\
plural = {\n\
  add: function() {\n\
    var attributes, params, _i, _len, _results;\n\
\n\
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n\
    _results = [];\n\
    for (_i = 0, _len = params.length; _i < _len; _i++) {\n\
      attributes = params[_i];\n\
      _results.push(this.push(this.build(attributes)));\n\
    }\n\
    return _results;\n\
  },\n\
  create: function() {\n\
    var attributes, params, record, _i, _len, _results;\n\
\n\
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n\
    _results = [];\n\
    for (_i = 0, _len = params.length; _i < _len; _i++) {\n\
      attributes = params[_i];\n\
      record = this.build(attributes);\n\
      this.push(record);\n\
      _results.push(record.save());\n\
    }\n\
    return _results;\n\
  },\n\
  build: function(data) {\n\
    var _name;\n\
\n\
    if (data == null) {\n\
      data = {};\n\
    }\n\
    data.parent_resource = this.parent_resource;\n\
    if (this.parent != null) {\n\
      data.route || (data.route = \"\" + this.parent.route + \"/\" + this.parent._id + \"/\" + (model.pluralize(this.resource.toString())));\n\
    }\n\
    if (this.route !== data.route && this.route) {\n\
      throw \"associable.has_many: cannot redefine route of association \" + this.parent_resource + \".\" + this.resource + \" from \" + this.route + \" to \" + data.route;\n\
    }\n\
    data[_name = this.parent_resource] || (data[_name] = this.parent);\n\
    return model[model.singularize(this.resource)](data);\n\
  },\n\
  push: function() {\n\
    console.warn(\"\" + this.resource + \".push is deprecated and will be removed, please use add instead\");\n\
    Array.prototype.push.apply(this, arguments);\n\
    return arguments[0];\n\
  },\n\
  length: 0,\n\
  json: function(methods, omissions) {\n\
    var record, _i, _len, _results;\n\
\n\
    _results = [];\n\
    for (_i = 0, _len = this.length; _i < _len; _i++) {\n\
      record = this[_i];\n\
      _results.push(record.json(methods, omissions));\n\
    }\n\
    return _results;\n\
  },\n\
  find: function(id) {\n\
    var resource, _i, _len;\n\
\n\
    for (_i = 0, _len = this.length; _i < _len; _i++) {\n\
      resource = this[_i];\n\
      if (resource._id === id) {\n\
        return resource;\n\
      }\n\
    }\n\
  },\n\
  filter: Array.prototype.filter || (typeof _ !== \"undefined\" && _ !== null ? _.filter : void 0)\n\
};\n\
\n\
singular = {\n\
  create: function(data) {\n\
    return model[this.resource].create(extend({}, this, data));\n\
  },\n\
  build: function(data) {\n\
    return this.owner[this.resource.toString()] = model[this.resource.toString()](extend({}, this, data));\n\
  }\n\
};\n\
\n\
descriptors = {\n\
  belongs_to: {\n\
    resource_id: {\n\
      getter: function() {\n\
        return this.owner.observed[this.resource + '_id'];\n\
      },\n\
      setter: function(resource_id) {\n\
        var association_name, current_resource_id, _ref;\n\
\n\
        association_name = this.resource.toString();\n\
        if (!resource_id) {\n\
          this.dirty = true;\n\
          this.owner[association_name] = resource_id;\n\
          return resource_id;\n\
        }\n\
        current_resource_id = (_ref = this.owner.observed[association_name]) != null ? _ref._id : void 0;\n\
        if (resource_id !== current_resource_id) {\n\
          this.owner.observed[association_name + '_id'] = resource_id;\n\
          this.owner.observed[association_name] = null;\n\
        }\n\
        return resource_id;\n\
      }\n\
    },\n\
    resource: {\n\
      getter: function() {\n\
        var associated, associated_id, association_name, resource;\n\
\n\
        association_name = this.resource.toString();\n\
        associated = this.owner.observed[association_name];\n\
        associated_id = this.owner.observed[association_name + '_id'];\n\
        if (!(((associated != null ? associated._id : void 0) != null) || associated_id)) {\n\
          return associated;\n\
        }\n\
        if (associated != null ? associated.sustained : void 0) {\n\
          return associated;\n\
        }\n\
        resource = model[association_name];\n\
        if (!resource) {\n\
          console.warn(\"descriptors.belongs_to.resource.getter: associated factory not found for model '\" + association_name + \"' belonging to '\" + this.owner.resource + \"'\");\n\
          return associated;\n\
        }\n\
        associated = resource.find(associated_id || associated._id);\n\
        if (associated) {\n\
          return this.owner.observed[association_name] = associated;\n\
        }\n\
        associated || (associated = resource({\n\
          _id: associated_id\n\
        }));\n\
        associated.reload();\n\
        return this.owner.observed[association_name] = associated;\n\
      },\n\
      setter: function(associated) {\n\
        this.owner.observed[this.resource.toString()] = associated;\n\
        return this.owner.observed[this.resource.toString() + '_id'] = associated ? associated._id : null;\n\
      }\n\
    }\n\
  }\n\
};\n\
\n\
callbacks = {\n\
  has_many: {\n\
    nest_attributes: function() {\n\
      var association, association_name, association_names, associations_attributes, message, _i, _len, _results;\n\
\n\
      association_names = model[this.resource].has_many;\n\
      if (association_names) {\n\
        _results = [];\n\
        for (_i = 0, _len = association_names.length; _i < _len; _i++) {\n\
          association_name = association_names[_i];\n\
          associations_attributes = this[\"\" + association_name + \"_attributes\"];\n\
          association = this[model.pluralize(association_name)];\n\
          if (associations_attributes && associations_attributes.length) {\n\
            if (!association) {\n\
              message = \"has_many.nest_attributes: Association not found for \" + association_name + \". \\n\
\";\n\
              message += \"did you set it on model declaration? \\n\
  has_many: \" + association_name + \" \";\n\
              throw message;\n\
            }\n\
            association.resource = model.singularize(association.resource);\n\
            association.add.apply(association, associations_attributes);\n\
            _results.push(association.resource = model.pluralize(association.resource));\n\
          } else {\n\
            _results.push(void 0);\n\
          }\n\
        }\n\
        return _results;\n\
      }\n\
    },\n\
    update_association: function(data) {\n\
      var associated, association, association_name, id, pluralized_association, _i, _j, _len, _len1, _ref;\n\
\n\
      id = this._id || data && (data._id || data.id);\n\
      if (!id) {\n\
        return;\n\
      }\n\
      _ref = model[this.resource.toString()].has_many;\n\
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
        association_name = _ref[_i];\n\
        pluralized_association = model.pluralize(association_name);\n\
        association = this[pluralized_association];\n\
        if (!association.route) {\n\
          association.route = \"/\" + (model.pluralize(this.resource.toString())) + \"/\" + id + \"/\" + (model.pluralize(association.resource));\n\
          for (_j = 0, _len1 = association.length; _j < _len1; _j++) {\n\
            associated = association[_j];\n\
            if (!associated.route && (associated.parent != null)) {\n\
              associated.route = \"/\" + (model.pluralize(this.resource.toString())) + \"/\" + id + \"/\" + (model.pluralize(association.resource));\n\
            }\n\
          }\n\
        }\n\
      }\n\
      return true;\n\
    },\n\
    autosave: function() {\n\
      throw 'Not implemented yet';\n\
    }\n\
  },\n\
  has_one: {\n\
    nest_attributes: function() {\n\
      var association_name, association_names, associations_attributes, _i, _len, _results;\n\
\n\
      association_names = model[this.resource].has_one;\n\
      if (association_names) {\n\
        _results = [];\n\
        for (_i = 0, _len = association_names.length; _i < _len; _i++) {\n\
          association_name = association_names[_i];\n\
          associations_attributes = this[\"\" + association_name + \"_attributes\"];\n\
          if (associations_attributes) {\n\
            this[association_name] = this[\"build_\" + association_name](associations_attributes);\n\
            _results.push(delete this[\"\" + association_name + \"_attributes\"]);\n\
          } else {\n\
            _results.push(void 0);\n\
          }\n\
        }\n\
        return _results;\n\
      }\n\
    }\n\
  }\n\
};\n\
\n\
associable = {\n\
  model: {\n\
    blender: function(definition) {\n\
      var model;\n\
\n\
      model = associable.model;\n\
      this.create_after_hooks = model.create_after_hooks;\n\
      this.create_before_hooks = model.create_before_hooks;\n\
      if (this.has_many && $.type(this.has_many) !== 'array') {\n\
        this.has_many = [this.has_many];\n\
      }\n\
      if (this.has_one && $.type(this.has_one) !== 'array') {\n\
        this.has_one = [this.has_one];\n\
      }\n\
      if (this.belongs_to && $.type(this.belongs_to) !== 'array') {\n\
        this.belongs_to = [this.belongs_to];\n\
      }\n\
      this.has_many || (this.has_many = []);\n\
      this.has_one || (this.has_one = []);\n\
      this.belongs_to || (this.belongs_to = []);\n\
      return true;\n\
    },\n\
    create_after_hooks: function(definition) {\n\
      var association_attributes, association_name, association_proxy, old_dirty, old_resource_id, options, resource, _i, _j, _k, _len, _len1, _len2, _name, _ref, _ref1, _ref2, _results;\n\
\n\
      options = model[this.resource.name || this.resource.toString()];\n\
      if (options.has_many) {\n\
        _ref = options.has_many;\n\
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
          resource = _ref[_i];\n\
          association_proxy = {\n\
            resource: resource,\n\
            parent_resource: this.resource,\n\
            parent: this\n\
          };\n\
          association_name = model.pluralize(resource);\n\
          association_attributes = this[association_name] || [];\n\
          this[_name = \"\" + association_name + \"_attributes\"] || (this[_name] = []);\n\
          if (association_attributes.length) {\n\
            this[\"\" + association_name + \"_attributes\"] = this[\"\" + association_name + \"_attributes\"].concat(association_attributes);\n\
          }\n\
          this[association_name] = $.extend(association_proxy, plural);\n\
        }\n\
        this.after('saved', callbacks.has_many.update_association);\n\
        callbacks.has_many.nest_attributes.call(this);\n\
      }\n\
      if (options.has_one) {\n\
        _ref1 = options.has_one;\n\
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {\n\
          resource = _ref1[_j];\n\
          association_proxy = {\n\
            resource: resource,\n\
            parent_resource: this.resource,\n\
            owner: this\n\
          };\n\
          association_proxy[this.resource.toString()] = this;\n\
          this[\"build_\" + resource] = $.proxy(singular.build, association_proxy);\n\
          this[\"create_\" + resource] = $.proxy(singular.create, association_proxy);\n\
        }\n\
        callbacks.has_one.nest_attributes.call(this);\n\
      }\n\
      if (options.belongs_to) {\n\
        _ref2 = options.belongs_to;\n\
        _results = [];\n\
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {\n\
          resource = _ref2[_k];\n\
          association_proxy = {\n\
            resource: resource,\n\
            parent_resource: this.resource,\n\
            parent: this,\n\
            owner: this\n\
          };\n\
          association_proxy[this.resource.toString()] = this;\n\
          this[\"build_\" + resource] = $.proxy(singular.build, association_proxy);\n\
          this[\"create_\" + resource] = $.proxy(singular.create, association_proxy);\n\
          old_resource_id = this[\"\" + resource + \"_id\"];\n\
          old_dirty = this.dirty;\n\
          this[\"\" + resource + \"_id\"] = null;\n\
          Object.defineProperty(this, \"\" + resource + \"_id\", {\n\
            get: $.proxy(descriptors.belongs_to.resource_id.getter, association_proxy),\n\
            set: $.proxy(descriptors.belongs_to.resource_id.setter, association_proxy),\n\
            configurable: true\n\
          });\n\
          this[\"\" + resource + \"_id\"] = old_resource_id;\n\
          _results.push(this.dirty = old_dirty);\n\
        }\n\
        return _results;\n\
      }\n\
    },\n\
    create_before_hooks: function(record) {\n\
      var association_proxy, definition, old_resource, resource, _i, _len, _ref, _results;\n\
\n\
      definition = this;\n\
      if (definition.belongs_to) {\n\
        _ref = definition.belongs_to;\n\
        _results = [];\n\
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
          resource = _ref[_i];\n\
          association_proxy = {\n\
            resource: resource,\n\
            parent_resource: this.resource,\n\
            owner: record\n\
          };\n\
          old_resource = this[resource];\n\
          Object.defineProperty(record, resource.toString(), {\n\
            get: $.proxy(descriptors.belongs_to.resource.getter, association_proxy),\n\
            set: $.proxy(descriptors.belongs_to.resource.setter, association_proxy),\n\
            configurable: true\n\
          });\n\
          _results.push(this[resource] = old_resource);\n\
        }\n\
        return _results;\n\
      }\n\
    }\n\
  },\n\
  record: {\n\
    after_initialize: function(attributes) {\n\
      if (this.resource == null) {\n\
        throw new Error('resource must be defined in order to associate');\n\
      }\n\
      return model[this.resource.name || this.resource.toString()].create_after_hooks.call(this);\n\
    },\n\
    before_initialize: function(creation) {\n\
      if (!this.resource) {\n\
        throw new Error('resource must be defined in order to associate');\n\
      }\n\
      return model[this.resource.name || this.resource.toString()].create_before_hooks(creation);\n\
    }\n\
  }\n\
};\n\
\n\
model = root.model;\n\
\n\
model.mix(function(modelable) {\n\
  modelable.after_mix.push(associable.model.blender);\n\
  modelable.record.before_initialize.push(associable.record.before_initialize);\n\
  return modelable.record.after_initialize.push(associable.record.after_initialize);\n\
});\n\
\n\
model.associable = {\n\
  mix: function(blender) {\n\
    return blender(singular, plural);\n\
  }\n\
};\n\
\n\
//# sourceURL=lib/record/associable.js"
));

require.register("indemma/lib/record/dirtyable.js", Function("exports, module",
"'use strict';\n\
var dirtyable, model, record;\n\
\n\
dirtyable = {\n\
  ignores: ['dirty', 'resource', 'route', 'initial_route', 'after_initialize', 'before_initialize', 'parent_resource', 'nested_attributes', 'reloading', 'ready', 'saving', 'salvation', 'sustained', 'element', 'default', 'lock', 'validated', 'validation', 'errors', 'dirty'],\n\
  change: function(name) {\n\
    return dirtyable.ignores.indexOf(name) === -1;\n\
  },\n\
  descriptor: {\n\
    get: function() {\n\
      return this.observed.dirty;\n\
    },\n\
    set: function(value) {\n\
      this.observed.dirty = value;\n\
      this.observation.scheduler.schedule();\n\
      return value;\n\
    }\n\
  },\n\
  record: {\n\
    after_initialize: function() {\n\
      Object.defineProperty(this, 'dirty', dirtyable.descriptor);\n\
      this.observed.dirty = !!this._id;\n\
      return this.subscribe(function(added, removed, changed, past) {\n\
        return this.dirty || (this.dirty = !!Object.keys(changed).filter(dirtyable.change).length);\n\
      });\n\
    }\n\
  }\n\
};\n\
\n\
model = window.model;\n\
\n\
record = window.record;\n\
\n\
model.dirtyable = true;\n\
\n\
record.mix(function(recordable) {\n\
  return recordable.after_initialize.push(dirtyable.record.after_initialize);\n\
});\n\
\n\
model.mix(function(modelable) {});\n\
\n\
module.exports = dirtyable;\n\
\n\
//# sourceURL=lib/record/dirtyable.js"
));

require.register("indemma/lib/record/errors.js", Function("exports, module",
"\n\
\n\
//# sourceURL=lib/record/errors.js"
));

require.register("indemma/lib/record/maid.js", Function("exports, module",
"var maid, model;\n\
\n\
maid = {\n\
  model: function() {\n\
    if (this.washing != null) {\n\
      return this.record.after_initialize.push(maid.record);\n\
    }\n\
  },\n\
  record: function() {\n\
    return this.subscribe('dirty', function(dirty) {\n\
      var _this = this;\n\
\n\
      return dirty && setTimeout(function() {\n\
        return _this.save();\n\
      }, 500);\n\
    });\n\
  }\n\
};\n\
\n\
model = window.model;\n\
\n\
model.mix(function(modelable) {\n\
  return modelable.after_mix.unshift(maid.model);\n\
});\n\
\n\
//# sourceURL=lib/record/maid.js"
));

require.register("indemma/lib/record/persistable.js", Function("exports, module",
"var handlers, model, persistable, record;\n\
\n\
require(\"indemma/lib/record/queryable.js\");\n\
\n\
handlers = {\n\
  store_after_saved: function() {\n\
    var storage;\n\
\n\
    storage = model[this.resource.toString()].storage;\n\
    if (this._id) {\n\
      return storage.store(this._id, this);\n\
    }\n\
  }\n\
};\n\
\n\
persistable = {\n\
  record: {\n\
    after_initialize: function() {\n\
      var storage;\n\
\n\
      if (this._id) {\n\
        storage = model[this.resource.toString()].storage;\n\
        return storage.store(this._id, this);\n\
      } else {\n\
        return this.after('saved', handlers.store_after_saved);\n\
      }\n\
    }\n\
  }\n\
};\n\
\n\
model = window.model;\n\
\n\
record = window.record;\n\
\n\
model.persistable = true;\n\
\n\
model.mix(function(modelable) {\n\
  return modelable.record.after_initialize.push(persistable.record.after_initialize);\n\
});\n\
\n\
//# sourceURL=lib/record/persistable.js"
));

require.register("indemma/lib/record/queryable.js", Function("exports, module",
"var extend, model, queryable, record, stampit, storable;\n\
\n\
extend = require(\"pluma~assimilate@0.3.0\");\n\
\n\
storable = require(\"indemma/lib/record/storable.js\");\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
queryable = {\n\
  storage: storable(),\n\
  find: function(key) {\n\
    if (!key) {\n\
      throw new TypeError(\"InvalidFind: resource.find was called with a falsey value\");\n\
    }\n\
    return this.storage.store(key);\n\
  },\n\
  every: function(callback) {\n\
    return callback(this.storage.values());\n\
  },\n\
  where: function() {\n\
    throw new Error('queryable.where: Not implemented yet');\n\
  }\n\
};\n\
\n\
model = window.model;\n\
\n\
record = window.record;\n\
\n\
model.queryable = true;\n\
\n\
module.exports = queryable;\n\
\n\
model.mix(function(modelable) {\n\
  return extend(modelable, queryable);\n\
});\n\
\n\
//# sourceURL=lib/record/queryable.js"
));

require.register("indemma/lib/record/resource.js", Function("exports, module",
"var descriptors, model, resource, resourceable, stampit;\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
require(\"indemma/vendor/owl/pluralize.js\");\n\
\n\
resource = stampit({\n\
  toString: function() {\n\
    return this.name;\n\
  }\n\
}, {\n\
  name: 'unknown',\n\
  scope: null,\n\
  singular: false\n\
}, function() {\n\
  var _base;\n\
\n\
  if (this.original_reference) {\n\
    stampit.mixIn(this.original_reference, this);\n\
    this.original_reference.toString = this.toString;\n\
    (_base = this.original_reference).param_name || (_base.param_name = this.name);\n\
    return this.original_reference;\n\
  }\n\
  this.param_name || (this.param_name = this.name);\n\
  return this;\n\
});\n\
\n\
descriptors = {\n\
  route: {\n\
    get: function() {\n\
      var route;\n\
\n\
      if (typeof this.resource === 'string') {\n\
        this.resource = {\n\
          name: this.resource\n\
        };\n\
      }\n\
      route = '/';\n\
      if (this.parent != null) {\n\
        route += (\"\" + this.parent.route + \"/\" + this.parent._id) + \"/\";\n\
      }\n\
      if (this.resource.scope != null) {\n\
        route += this.resource.scope + '/';\n\
      }\n\
      route += this.resource.singular ? this.resource.name : model.pluralize(this.resource.name);\n\
      return this.route = route;\n\
    },\n\
    configurable: true\n\
  }\n\
};\n\
\n\
resourceable = {\n\
  pluralize: function(word, count, plural) {\n\
    if (!(word && word.length)) {\n\
      throw new TypeError(\"Invalid string passed to pluralize '\" + word + \"'\");\n\
    }\n\
    if (word.indexOf('s') !== word.length - 1) {\n\
      return owl.pluralize(word, count, plural);\n\
    } else {\n\
      return word;\n\
    }\n\
  },\n\
  singularize: function(word) {\n\
    if (!(word && word.length)) {\n\
      throw new TypeError(\"Invalid string passed to singularize '\" + word + \"'\");\n\
    }\n\
    if (word.lastIndexOf('s') === word.length - 1) {\n\
      return word.substring(0, word.length - 1);\n\
    } else {\n\
      return word;\n\
    }\n\
  },\n\
  initialize: function() {\n\
    var resource_definition, _ref;\n\
\n\
    resource_definition = {};\n\
    if (typeof this.resource === 'string') {\n\
      resource_definition = {\n\
        name: this.resource\n\
      };\n\
    }\n\
    if (typeof this.resource === 'object') {\n\
      this.resource.original_reference = this.resource;\n\
      resource_definition = this.resource;\n\
    }\n\
    resource_definition.parent = this.parent_resource;\n\
    this.resource = resource(resource_definition);\n\
    return (_ref = this.route) != null ? _ref : Object.defineProperty(this, 'route', descriptors.route);\n\
  }\n\
};\n\
\n\
model = window.model;\n\
\n\
model.mix(function(modelable) {\n\
  modelable.record.after_initialize.unshift(resourceable.initialize);\n\
  return modelable.after_mix.unshift(resourceable.initialize);\n\
});\n\
\n\
model.singularize = resourceable.singularize;\n\
\n\
model.pluralize = resourceable.pluralize;\n\
\n\
//# sourceURL=lib/record/resource.js"
));

require.register("indemma/lib/record/rest.js", Function("exports, module",
"var $, data_for, request;\n\
\n\
$ = require(\"component~jquery@1.9.1\");\n\
\n\
module.exports = {\n\
  get: function(data) {\n\
    return request.call(this, 'get', (this._id ? \"\" + this.route + \"/\" + this._id : this.route), data);\n\
  },\n\
  put: function(data) {\n\
    return request.call(this, 'put', (this._id ? \"\" + this.route + \"/\" + this._id : this.route), data);\n\
  },\n\
  post: function(data) {\n\
    return request.call(this, 'post', this.route, data);\n\
  },\n\
  \"delete\": function(data) {\n\
    return request.call(this, 'delete', (this._id ? \"\" + this.route + \"/\" + this._id : this.route), data);\n\
  }\n\
};\n\
\n\
data_for = function(data) {\n\
  var param_name;\n\
\n\
  param_name = this.resource.param_name || this.resource.toString();\n\
  if (!data && this.json) {\n\
    data = {};\n\
    data[param_name] = this.json();\n\
  }\n\
  if (data && data[param_name]) {\n\
    delete data[param_name]['id'];\n\
    delete data[param_name]['_id'];\n\
  }\n\
  return data;\n\
};\n\
\n\
request = function(method, url, data) {\n\
  data = data_for.call(this, data);\n\
  return $.ajax({\n\
    url: url,\n\
    data: data,\n\
    type: method,\n\
    dataType: 'json',\n\
    context: this\n\
  });\n\
};\n\
\n\
//# sourceURL=lib/record/rest.js"
));

require.register("indemma/lib/record/restfulable.js", Function("exports, module",
"var $, merge, model, observable, record, rest, restful, root, type, util,\n\
  __slice = [].slice;\n\
\n\
merge = require(\"pluma~assimilate@0.3.0\").withStrategy('deep');\n\
\n\
type = require(\"component~type@1.0.0\");\n\
\n\
observable = require(\"indefinido~observable@es6-modules\").mixin;\n\
\n\
$ = require(\"component~jquery@1.9.1\");\n\
\n\
rest = require(\"indemma/lib/record/rest.js\");\n\
\n\
root = typeof exports !== \"undefined\" && exports !== null ? exports : this;\n\
\n\
require(\"indemma/lib/record/dirtyable.js\");\n\
\n\
util = {\n\
  model: {\n\
    map: function(records) {\n\
      var record, _i, _len, _results;\n\
\n\
      _results = [];\n\
      for (_i = 0, _len = records.length; _i < _len; _i++) {\n\
        record = records[_i];\n\
        _results.push(this(record));\n\
      }\n\
      return _results;\n\
    }\n\
  }\n\
};\n\
\n\
restful = {\n\
  model: {\n\
    create: function() {\n\
      var attributes, callback, params, record, savings, _i, _j, _len;\n\
\n\
      params = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];\n\
      if (!arguments.length) {\n\
        throw new TypeError(\"No arguments provided for \" + this.resource + \".create\");\n\
      }\n\
      if (typeof callback !== 'function') {\n\
        params.push(callback);\n\
        callback = void 0;\n\
      }\n\
      if (!params.length) {\n\
        params.unshift({});\n\
      }\n\
      savings = [];\n\
      for (_j = 0, _len = params.length; _j < _len; _j++) {\n\
        attributes = params[_j];\n\
        record = this(attributes);\n\
        record.dirty = true;\n\
        savings.push(record.save(callback));\n\
      }\n\
      return $.when.apply($, savings);\n\
    },\n\
    every: function(conditions, doned, failed) {\n\
      if (conditions == null) {\n\
        conditions = {};\n\
      }\n\
      if (typeof conditions === 'function') {\n\
        doned = conditions;\n\
        conditions = {};\n\
      }\n\
      return $.when(rest.get.call(this, conditions)).then(util.model.map).done(doned).fail(failed);\n\
    },\n\
    first: function(conditions, callback) {\n\
      var namespaced;\n\
\n\
      if (conditions == null) {\n\
        conditions = {};\n\
      }\n\
      if (typeof conditions === 'function') {\n\
        callback = conditions;\n\
        conditions = {};\n\
      }\n\
      namespaced = conditions[this.resource] || {};\n\
      namespaced.limit = 1;\n\
      namespaced.order = 'desc';\n\
      return this.every(conditions, callback);\n\
    },\n\
    get: function(action, data) {\n\
      var default_route, old_route, payload, promise, resource;\n\
\n\
      if (data == null) {\n\
        data = {};\n\
      }\n\
      old_route = this.route;\n\
      default_route = '/';\n\
      if (this.resource.scope != null) {\n\
        default_route += this.resource.scope + '/';\n\
      }\n\
      default_route += this.resource.singular ? this.resource.name : model.pluralize(this.resource.name);\n\
      if (default_route !== this.route) {\n\
        this.route = default_route;\n\
      }\n\
      if (action) {\n\
        Object.defineProperty(this, 'route', {\n\
          value: \"\" + default_route + \"/\" + action,\n\
          configurable: true\n\
        });\n\
      }\n\
      resource = data.resource;\n\
      if (data && data.json) {\n\
        data = data.json();\n\
      }\n\
      if (resource != null) {\n\
        payload = data;\n\
        data = {};\n\
        data[resource] = payload;\n\
      }\n\
      promise = rest.get.call(this, data);\n\
      Object.defineProperty(this, 'route', {\n\
        value: old_route,\n\
        configurable: true\n\
      });\n\
      return promise;\n\
    },\n\
    put: rest.put,\n\
    \"delete\": rest[\"delete\"]\n\
  },\n\
  record: {\n\
    ready: function(callback) {\n\
      return callback.call(this);\n\
    },\n\
    reload: function() {\n\
      var data, param, params, promise, _i, _len;\n\
\n\
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n\
      data = params.pop();\n\
      if (type(data) !== 'object') {\n\
        params.push(data);\n\
      }\n\
      promise = rest.get.call(this, data || {});\n\
      promise.done(this.assign_attributes);\n\
      promise.fail(this.failed);\n\
      this.reloading = promise;\n\
      this.ready = function() {\n\
        console.warn(\"resource.ready was deprecated, please use resource.reloading.done\");\n\
        return promise.done.apply(promise, arguments);\n\
      };\n\
      for (_i = 0, _len = params.length; _i < _len; _i++) {\n\
        param = params[_i];\n\
        promise.done(param);\n\
      }\n\
      return promise;\n\
    },\n\
    assign_attributes: function(attributes) {\n\
      var associated, association, association_attributes, association_name, associations_attributes, attribute, message, name, singular_resource, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;\n\
\n\
      _ref = model[this.resource.toString()].has_many;\n\
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
        association_name = _ref[_i];\n\
        associations_attributes = attributes[association_name + \"_attributes\"] || attributes[association_name];\n\
        delete attributes[association_name];\n\
        delete attributes[association_name + '_attributes'];\n\
        association = this[association_name];\n\
        if (association == null) {\n\
          message = \"Association '\" + association_name + \"' not found. \\n\
\";\n\
          message += \"For record with resource \" + this.resource + \". \\n\
\";\n\
          message += \"Probably defined on server side but not on client side.\\n\
\";\n\
          message += \"Skipping association assignment!\";\n\
          console.warn(message);\n\
          continue;\n\
        }\n\
        if (association.length) {\n\
          Array.prototype.splice.call(association, 0);\n\
        }\n\
        if (!((associations_attributes != null) && associations_attributes.length)) {\n\
          continue;\n\
        }\n\
        singular_resource = model.singularize(association_name);\n\
        for (_j = 0, _len1 = associations_attributes.length; _j < _len1; _j++) {\n\
          association_attributes = associations_attributes[_j];\n\
          _ref1 = model[singular_resource].has_many;\n\
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {\n\
            association_name = _ref1[_k];\n\
            association_attributes[\"\" + association_name + \"_attributes\"] = association_attributes[association_name];\n\
            delete association_attributes[association_name];\n\
          }\n\
        }\n\
        association.add.apply(association, associations_attributes);\n\
      }\n\
      _ref2 = model[this.resource.toString()].has_one;\n\
      for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {\n\
        association_name = _ref2[_l];\n\
        association_attributes = attributes[association_name];\n\
        delete attributes[association_name];\n\
        delete attributes[association_name + \"_attributes\"];\n\
        if (association_attributes) {\n\
          associated = this[association_name] || this[\"build_\" + association_name]({\n\
            _id: association_attributes._id\n\
          });\n\
          associated.assign_attributes(association_attributes);\n\
          this[association_name] = associated;\n\
        }\n\
      }\n\
      _ref3 = model[this.resource.toString()].belongs_to;\n\
      for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {\n\
        association_name = _ref3[_m];\n\
        association_attributes = (_ref4 = (_ref5 = attributes[association_name]) != null ? typeof _ref5.json === \"function\" ? _ref5.json() : void 0 : void 0) != null ? _ref4 : attributes[association_name];\n\
        delete attributes[association_name];\n\
        delete attributes[association_name + \"_attributes\"];\n\
        if (association_attributes) {\n\
          associated = this[association_name] || this[\"build_\" + association_name]({\n\
            _id: association_attributes._id\n\
          });\n\
          associated.assign_attributes(association_attributes);\n\
          this[association_name] = associated;\n\
        }\n\
      }\n\
      _results = [];\n\
      for (name in attributes) {\n\
        attribute = attributes[name];\n\
        if (attribute !== this[name]) {\n\
          if (type(attribute) === 'object') {\n\
            if (JSON.stringify(attribute) !== JSON.stringify(this[name])) {\n\
              _results.push(this[name] = attributes[name]);\n\
            } else {\n\
              _results.push(void 0);\n\
            }\n\
          } else {\n\
            _results.push(this[name] = attributes[name]);\n\
          }\n\
        }\n\
      }\n\
      return _results;\n\
    },\n\
    destroy: function(doned, failed, data) {\n\
      var promise;\n\
\n\
      if (!((this.id != null) || (this._id != null))) {\n\
        throw new Error('Can\\'t delete record without id!');\n\
      }\n\
      promise = rest[\"delete\"].call(this, data);\n\
      promise.done(this.destroyed);\n\
      promise.fail(this.failed);\n\
      promise.done(doned);\n\
      promise.fail(failed);\n\
      return promise;\n\
    },\n\
    saving: false,\n\
    salvation: null,\n\
    save: function(doned, failed, data) {\n\
      var lock, salvation;\n\
\n\
      lock = JSON.stringify(this.json());\n\
      if (this.saving) {\n\
        if (this.lock === lock) {\n\
          return this.salvation;\n\
        } else {\n\
          this.salvation.abort();\n\
        }\n\
      }\n\
      this.lock = lock;\n\
      if (!this.dirty) {\n\
        salvation = $.Deferred().resolveWith(this, null);\n\
      }\n\
      this.saving = true;\n\
      salvation || (salvation = rest[this._id ? 'put' : 'post'].call(this, data));\n\
      this.salvation = salvation;\n\
      salvation.done(this.saved);\n\
      salvation.fail(this.failed);\n\
      salvation.always(function() {\n\
        return this.saving = false;\n\
      });\n\
      salvation.done(doned);\n\
      salvation.fail(failed);\n\
      return salvation;\n\
    },\n\
    saved: function(data) {\n\
      var callback, _i, _len, _ref, _results;\n\
\n\
      if (this.lock === JSON.stringify(this.json())) {\n\
        this.dirty = false;\n\
        delete this.lock;\n\
      }\n\
      if (data != null) {\n\
        this.assign_attributes(data);\n\
      }\n\
      if (this.after_save) {\n\
        _ref = this.after_save;\n\
        _results = [];\n\
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
          callback = _ref[_i];\n\
          throw \"Not supported after_save callback: \" + callback;\n\
        }\n\
        return _results;\n\
      }\n\
    },\n\
    failed: function(xhr, error, status) {\n\
      var attribute_name, definition, e, message, messages, payload, _i, _len, _ref;\n\
\n\
      payload = xhr.responseJSON;\n\
      try {\n\
        payload || (payload = JSON.parse(xhr.responseText));\n\
      } catch (_error) {\n\
        e = _error;\n\
      }\n\
      payload || (payload = xhr.responseText);\n\
      switch (xhr.status) {\n\
        case 0:\n\
          message = status || xhr.statusText;\n\
          switch (message) {\n\
            case 'abort':\n\
              console.info(\"salvation probably aborted\");\n\
              break;\n\
            case 'error':\n\
              console.info(\"server probably unreachable\");\n\
              break;\n\
            default:\n\
              throw new Error('Unhandled status code for xhr');\n\
          }\n\
          break;\n\
        case 422:\n\
          definition = model[this.resource.toString()];\n\
          _ref = payload.errors;\n\
          for (attribute_name in _ref) {\n\
            messages = _ref[attribute_name];\n\
            if (!definition.associations) {\n\
              definition.associations = definition.has_one.concat(definition.has_many.concat(definition.belongs_to));\n\
            }\n\
            if (!(this.hasOwnProperty(attribute_name) || definition.hasOwnProperty(attribute_name) || definition.associations.indexOf(attribute_name) !== -1 || attribute_name === 'base')) {\n\
              message = \"Server returned an validation error message for a attribute that is not defined in your model.\\n\
\";\n\
              message += \"The attribute was '\" + attribute_name + \"', the model resource was '\" + this.resource + \"'.\\n\
\";\n\
              message += \"The model definition keys were '\" + (JSON.stringify(Object.keys(definition))) + \"'.\\n\
\";\n\
              message += \"Please remove server validation, or update your model definition.\";\n\
              throw new TypeError(message);\n\
            }\n\
            for (_i = 0, _len = messages.length; _i < _len; _i++) {\n\
              message = messages[_i];\n\
              this.errors.add(attribute_name, 'server', {\n\
                server_message: message\n\
              });\n\
            }\n\
          }\n\
          break;\n\
        default:\n\
          message = \"Fail in \" + this.resource + \".save:\\n\
\";\n\
          message += \"Record: \" + this + \"\\n\
\";\n\
          message += \"Status: \" + status + \" (\" + (payload || xhr).status + \")\\n\
\";\n\
          message += \"Error : \" + (payload.error || payload.message || payload);\n\
          console.log(message);\n\
      }\n\
      return this.saving = false;\n\
    },\n\
    toString: function() {\n\
      var e, name, property, serialized;\n\
\n\
      serialized = {};\n\
      serialized[this.resource] = this.json();\n\
      try {\n\
        return JSON.stringify(serialized);\n\
      } catch (_error) {\n\
        e = _error;\n\
        console.warn(\"restfulable.toString: Failed to stringify record: \" + e.message + \". retrying...\");\n\
        for (name in serialized) {\n\
          property = serialized[name];\n\
          if (typeof property === 'object') {\n\
            delete serialized[name];\n\
          }\n\
        }\n\
        return JSON.stringify(serialized);\n\
      }\n\
    },\n\
    json: function(options) {\n\
      var definition, json, method, name, nature, nested, value, _ref, _ref1;\n\
\n\
      if (options == null) {\n\
        options = {};\n\
      }\n\
      json = {};\n\
      definition = model[this.resource.toString()];\n\
      for (name in this) {\n\
        if (observable.ignores.indexOf(name) !== -1) {\n\
          continue;\n\
        }\n\
        nested = this.nested_attributes.indexOf(name) !== -1;\n\
        if (!nested && (definition.belongs_to.indexOf(name) !== -1 || definition.has_one.indexOf(name) !== -1 || definition.has_many.indexOf(name) !== -1)) {\n\
          continue;\n\
        }\n\
        value = this[name];\n\
        if (value == null) {\n\
          continue;\n\
        }\n\
        nature = type(value);\n\
        if (nature === 'function') {\n\
          continue;\n\
        }\n\
        if (nature === 'object' || nature === 'element') {\n\
          if (nested) {\n\
            if (!value.json) {\n\
              console.warn(\"json: Tryied to serialize nested attribute '\" + name + \"' without serialization method!\");\n\
              continue;\n\
            }\n\
            json[\"\" + name + \"_attributes\"] = value.json(options[name]);\n\
          } else if ((value.toJSON != null) || (value.json != null)) {\n\
            if (value.resource) {\n\
              continue;\n\
            }\n\
            if (value.json != null) {\n\
              json[name] = value.json(options[name]);\n\
            } else {\n\
              json[name] = value.toJSON(options[name]);\n\
            }\n\
          } else {\n\
            continue;\n\
          }\n\
        } else {\n\
          json[name] = value;\n\
        }\n\
      }\n\
      json = observable.unobserve(json);\n\
      _ref1 = (_ref = options.methods) != null ? _ref : {};\n\
      for (name in _ref1) {\n\
        value = _ref1[name];\n\
        method = this[name];\n\
        if (typeof method === 'function') {\n\
          json[name] = method();\n\
        } else {\n\
          json[name] = method;\n\
        }\n\
      }\n\
      delete json.dirty;\n\
      delete json.resource;\n\
      delete json.route;\n\
      delete json.initial_route;\n\
      delete json.after_initialize;\n\
      delete json.before_initialize;\n\
      delete json.parent_resource;\n\
      delete json.nested_attributes;\n\
      delete json.reloading;\n\
      delete json.ready;\n\
      delete json.saving;\n\
      delete json.salvation;\n\
      delete json.sustained;\n\
      delete json.element;\n\
      delete json[\"default\"];\n\
      delete json.lock;\n\
      delete json.validated;\n\
      delete json.validation;\n\
      delete json.errors;\n\
      return json;\n\
    }\n\
  }\n\
};\n\
\n\
restful.toJSON = restful.json;\n\
\n\
model = window.model;\n\
\n\
record = window.record;\n\
\n\
model.restfulable = true;\n\
\n\
record.mix(function(recordable) {\n\
  return merge(recordable, restful.record);\n\
});\n\
\n\
model.mix(function(modelable) {\n\
  return merge(modelable, restful.model);\n\
});\n\
\n\
model.associable && model.associable.mix(function(singular_association, plural_association) {\n\
  plural_association.get = function() {\n\
    if (this.parent != null) {\n\
      this.route || (this.route = \"\" + this.parent.route + \"/\" + this.parent._id + \"/\" + (model.pluralize(this.resource.name)));\n\
    }\n\
    return rest.get.apply(this, arguments);\n\
  };\n\
  return plural_association.post = function() {\n\
    if (this.parent != null) {\n\
      this.route || (this.route = \"\" + this.parent.route + \"/\" + this.parent._id + \"/\" + (model.pluralize(this.resource.name)));\n\
    }\n\
    return rest.post.apply(this, arguments);\n\
  };\n\
});\n\
\n\
//# sourceURL=lib/record/restfulable.js"
));

require.register("indemma/lib/record/scopable.js", Function("exports, module",
"var $, builders, defaults, extend, merge, model, observable, record, rest, scopable, stampit, util,\n\
  __slice = [].slice;\n\
\n\
require(\"indemma/lib/record/restfulable.js\");\n\
\n\
require(\"indemma/lib/record/resource.js\");\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
extend = require(\"pluma~assimilate@0.3.0\");\n\
\n\
observable = require(\"indefinido~observable@es6-modules\").mixin;\n\
\n\
merge = extend.withStrategy('deep');\n\
\n\
$ = require(\"component~jquery@1.9.1\");\n\
\n\
rest = require(\"indemma/lib/record/rest.js\");\n\
\n\
util = {\n\
  model: {\n\
    map: function(records) {\n\
      var index, record, _i, _len, _results;\n\
\n\
      _results = [];\n\
      for (index = _i = 0, _len = records.length; _i < _len; index = ++_i) {\n\
        record = records[index];\n\
        _results.push((this.build || this).call(this, record));\n\
      }\n\
      return _results;\n\
    }\n\
  }\n\
};\n\
\n\
scopable = {\n\
  builder: stampit().enclose(function() {\n\
    return stampit.mixIn(function(name, type) {\n\
      var builder;\n\
\n\
      if ($.type(type) === 'function') {\n\
        this[\"$\" + name] = type() || new type;\n\
        type = $.type(this[\"$\" + name]);\n\
      } else {\n\
        this[\"$\" + name] = defaults[type] || type;\n\
      }\n\
      if ($.type(type) !== 'string' || type.toString() === '') {\n\
        type = $.type(type);\n\
      }\n\
      builder = builders[type];\n\
      if (builder == null) {\n\
        throw \"Unknown scope type: '\" + type + \"', For model with resource: '\" + this.resource + \"'\";\n\
      }\n\
      this.scope.declared.push(name);\n\
      return this[name] = builder({\n\
        name: name\n\
      });\n\
    }, {\n\
      data: {},\n\
      then: [],\n\
      fail: [],\n\
      declared: [],\n\
      fetch: function(data, done, fail) {\n\
        var deferred, method, scope;\n\
\n\
        if (typeof data === 'function') {\n\
          done = data;\n\
          data = {};\n\
        }\n\
        scope = extend({}, this.scope.data);\n\
        for (method in observable.methods) {\n\
          delete scope[method];\n\
        }\n\
        if (scope.noned != null) {\n\
          deferred = $.Deferred();\n\
          deferred.resolveWith(this, [[]]);\n\
        } else {\n\
          deferred = rest.get.call(this, extend(scope, data));\n\
        }\n\
        deferred.then(util.model.map).done(this.scope.then.concat([done])).fail(this.scope.fail.concat([fail]));\n\
        this.scope.clear();\n\
        return deferred;\n\
      },\n\
      clear: function() {\n\
        this.data = {};\n\
        return this.callbacks = [];\n\
      }\n\
    });\n\
  }),\n\
  base: stampit().state({\n\
    name: 'unamed_scope'\n\
  }),\n\
  record: {\n\
    failed: function(xhr, error, status) {\n\
      var e, message, payload;\n\
\n\
      payload = xhr.responseJSON;\n\
      try {\n\
        payload || (payload = JSON.parse(xhr.responseText));\n\
      } catch (_error) {\n\
        e = _error;\n\
      }\n\
      payload || (payload = xhr.responseText);\n\
      switch (xhr.status) {\n\
        case 422:\n\
          this.valid = false;\n\
          return this.errors = payload.errors;\n\
        default:\n\
          message = \"Fail in \" + this.resource + \".save:\\n\
\";\n\
          message += \"Record: \" + this + \"\\n\
\";\n\
          message += \"Status: \" + status + \" (\" + (payload.status || xhr.status) + \")\\n\
\";\n\
          message += \"Error : \" + (payload.error || payload.message || payload);\n\
      }\n\
      return console.error(message);\n\
    }\n\
  },\n\
  model: {\n\
    none: function() {\n\
      this.scope.data.noned = true;\n\
      return this;\n\
    },\n\
    fetch: function(data, done, fail) {\n\
      if (typeof data === 'function') {\n\
        done = data;\n\
        data = null;\n\
      }\n\
      return this.scope.fetch.call(this, data, done, fail);\n\
    },\n\
    forward_scopes_to_associations: function() {\n\
      var associated_factory, associated_resource, association, association_name, factory, scope, _i, _j, _len, _len1, _ref, _ref1;\n\
\n\
      factory = model[this.resource.name];\n\
      _ref = factory.has_many;\n\
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
        association_name = _ref[_i];\n\
        associated_resource = model.singularize(association_name);\n\
        associated_factory = model[associated_resource];\n\
        if (!model[associated_resource]) {\n\
          console.warn(\"Associated factory not found for associated resource: \" + associated_resource);\n\
          continue;\n\
        }\n\
        association = this[association_name];\n\
        association.scope = scopable.builder(association);\n\
        _ref1 = associated_factory.scope.declared;\n\
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {\n\
          scope = _ref1[_j];\n\
          association.scope(scope, associated_factory[\"$\" + scope]);\n\
        }\n\
      }\n\
      return true;\n\
    }\n\
  },\n\
  after_mix: function() {\n\
    var name, property, type, _results;\n\
\n\
    this.scope = scopable.builder(this);\n\
    _results = [];\n\
    for (property in this) {\n\
      type = this[property];\n\
      if (property.charAt(0) === '$') {\n\
        name = property.substring(1);\n\
        _results.push(this.scope(name, type));\n\
      } else {\n\
        _results.push(void 0);\n\
      }\n\
    }\n\
    return _results;\n\
  }\n\
};\n\
\n\
builders = {\n\
  string: stampit().enclose(function() {\n\
    var base;\n\
\n\
    base = scopable.base(this);\n\
    return stampit.mixIn(function() {\n\
      var callbacks, value, _base, _name;\n\
\n\
      value = arguments[0], callbacks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n\
      callbacks.length && (this.scope.then = this.scope.then.concat(callbacks));\n\
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = value != null ? value : this[\"$\" + base.name]);\n\
      return this;\n\
    });\n\
  }),\n\
  boolean: stampit().enclose(function() {\n\
    var base;\n\
\n\
    base = scopable.base(this);\n\
    return stampit.mixIn(function() {\n\
      var callbacks, value, _base, _name;\n\
\n\
      value = arguments[0], callbacks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n\
      callbacks.length && (this.scope.then = this.scope.then.concat(callbacks));\n\
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = value != null ? value : this[\"$\" + base.name]);\n\
      return this;\n\
    });\n\
  }),\n\
  array: stampit().enclose(function() {\n\
    var base;\n\
\n\
    base = scopable.base(this);\n\
    return stampit.mixIn(function() {\n\
      var values, _base, _name;\n\
\n\
      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n\
      (_base = this.scope.data)[_name = base.name] || (_base[_name] = values != null ? values : this[\"$\" + base.name]);\n\
      return this;\n\
    });\n\
  })\n\
};\n\
\n\
defaults = {\n\
  boolean: true,\n\
  array: []\n\
};\n\
\n\
model = window.model;\n\
\n\
record = window.record;\n\
\n\
model.scopable = true;\n\
\n\
model.mix(function(modelable) {\n\
  merge(modelable, scopable.model);\n\
  return modelable.after_mix.push(scopable.after_mix);\n\
});\n\
\n\
if (model.associable) {\n\
  model.mix(function(modelable) {\n\
    return modelable.record.after_initialize.push(function() {\n\
      return scopable.model.forward_scopes_to_associations.call(this);\n\
    });\n\
  });\n\
  model.associable.mix(function(singular_association, plural_association) {\n\
    plural_association.every = plural_association.reload = function(data, done, fail) {\n\
      var promises, reload;\n\
\n\
      if (this.parent != null) {\n\
        this.route || (this.route = \"\" + this.parent.route + \"/\" + this.parent._id + \"/\" + (model.pluralize(this.resource)));\n\
      }\n\
      promises = [];\n\
      if (typeof data === 'function') {\n\
        done = data;\n\
        data = void 0;\n\
      }\n\
      promises.push(this.scope.fetch.call(this, data, null, scopable.record.failed));\n\
      reload = $.when.apply(jQuery, promises);\n\
      reload.done(function(records, status) {\n\
        var association_name, create, index, singular_resource, target, _i, _j, _k, _len, _len1, _len2, _ref;\n\
\n\
        if (!records.length) {\n\
          if (this.length) {\n\
            Array.prototype.splice.call(this, 0);\n\
          }\n\
          return true;\n\
        }\n\
        singular_resource = model.singularize(this.resource);\n\
        for (_i = 0, _len = records.length; _i < _len; _i++) {\n\
          record = records[_i];\n\
          _ref = model[singular_resource].has_many;\n\
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {\n\
            association_name = _ref[_j];\n\
            record[\"\" + association_name + \"_attributes\"] = record[association_name];\n\
            delete record[association_name];\n\
          }\n\
        }\n\
        create = [];\n\
        for (index = _k = 0, _len2 = records.length; _k < _len2; index = ++_k) {\n\
          record = records[index];\n\
          if (target = this.find(record._id)) {\n\
            target.assign_attributes(record);\n\
          } else {\n\
            create.push(record);\n\
          }\n\
        }\n\
        this.add.apply(this, create);\n\
        records.splice(0);\n\
        return records.push.apply(records, this);\n\
      });\n\
      reload.done(done);\n\
      reload.fail(fail);\n\
      return reload;\n\
    };\n\
    return plural_association.each = function(callback) {\n\
      var _this = this;\n\
\n\
      if (this.parent != null) {\n\
        this.route || (this.route = \"\" + this.parent.route + \"/\" + this.parent._id + \"/\" + (model.pluralize(this.resource)));\n\
      }\n\
      return this.get().done(function(records) {\n\
        var _i, _len, _results;\n\
\n\
        _results = [];\n\
        for (_i = 0, _len = _this.length; _i < _len; _i++) {\n\
          record = _this[_i];\n\
          _results.push(callback(record));\n\
        }\n\
        return _results;\n\
      });\n\
    };\n\
  });\n\
}\n\
\n\
//# sourceURL=lib/record/scopable.js"
));

require.register("indemma/lib/record/storable.js", Function("exports, module",
"var extend, merge, model, record, stampit, storable;\n\
\n\
extend = require(\"pluma~assimilate@0.3.0\");\n\
\n\
merge = extend.withStrategy('deep');\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
Object.values || (Object.values = (typeof _ !== \"undefined\" && _ !== null ? _.values : void 0) || function(object) {\n\
  var key, value, _results;\n\
\n\
  _results = [];\n\
  for (key in object) {\n\
    value = object[key];\n\
    _results.push(value);\n\
  }\n\
  return _results;\n\
});\n\
\n\
storable = stampit({\n\
  store: function(keypath, value, options) {\n\
    var collection, entry, key, _i, _len;\n\
\n\
    collection = this.database;\n\
    keypath = keypath.toString().split('.');\n\
    key = keypath.pop();\n\
    for (_i = 0, _len = keypath.length; _i < _len; _i++) {\n\
      entry = keypath[_i];\n\
      collection[entry] || (collection[entry] = {});\n\
      collection = collection[entry];\n\
    }\n\
    if (arguments.length === 1) {\n\
      this.reads++;\n\
      return collection[key];\n\
    } else {\n\
      this.writes++;\n\
      value.sustained || (value.sustained = true);\n\
      return collection[key] = value;\n\
    }\n\
  },\n\
  values: function() {\n\
    return Object.values(this.database);\n\
  }\n\
}, {\n\
  type: 'object',\n\
  writes: 0,\n\
  reads: 0\n\
}, function() {\n\
  this.database || (this.database = {});\n\
  return this;\n\
});\n\
\n\
model = window.model;\n\
\n\
record = window.record;\n\
\n\
model.storable = true;\n\
\n\
module.exports = storable;\n\
\n\
//# sourceURL=lib/record/storable.js"
));

require.register("indemma/lib/record/translationable.js", Function("exports, module",
"var extend, extensions, root;\n\
\n\
root = typeof exports !== \"undefined\" && exports !== null ? exports : window;\n\
\n\
extend = require(\"pluma~assimilate@0.3.0\");\n\
\n\
extensions = {\n\
  model: {\n\
    human_attribute_name: function(attribute_name) {\n\
      var _ref, _ref1;\n\
\n\
      return ((_ref = this.translation) != null ? (_ref1 = _ref.attributes) != null ? _ref1[attribute_name] : void 0 : void 0) || attribute_name;\n\
    }\n\
  }\n\
};\n\
\n\
model.mix(function(modelable) {\n\
  return extend(modelable, extensions.model);\n\
});\n\
\n\
//# sourceURL=lib/record/translationable.js"
));

require.register("indemma/lib/record/validatable.js", Function("exports, module",
"var errorsable, extensions, initializers, manager, messages, observable, root, stampit, type;\n\
\n\
require(\"indemma/lib/record/translationable.js\");\n\
\n\
root = typeof exports !== \"undefined\" && exports !== null ? exports : this;\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
observable = require(\"indefinido~observable@es6-modules\");\n\
\n\
type = require(\"component~type@1.0.0\");\n\
\n\
messages = {\n\
  blank: function(attribute_name) {\n\
    attribute_name = this.human_attribute_name(attribute_name);\n\
    return \"O campo \" + attribute_name + \" não pode ficar em branco.\";\n\
  },\n\
  cpf: function(attribute_name) {\n\
    attribute_name = this.human_attribute_name(attribute_name);\n\
    return \"O campo \" + attribute_name + \" não está válido.\";\n\
  },\n\
  confirmation: function(attribute_name) {\n\
    var confirmation_attribute_name;\n\
\n\
    confirmation_attribute_name = this.human_attribute_name(attribute_name);\n\
    attribute_name = this.human_attribute_name(attribute_name.replace('_confirmation', ''));\n\
    return \"O campo \" + attribute_name + \" não está de acordo com o campo \" + confirmation_attribute_name + \".\";\n\
  },\n\
  associated: function(attribute_name) {\n\
    attribute_name = this.human_attribute_name(attribute_name);\n\
    return \"O registro associado \" + attribute_name + \" não é válido.\";\n\
  },\n\
  server: function(attribute_name, options) {\n\
    if (attribute_name === 'base') {\n\
      return options.server_message;\n\
    } else {\n\
      attribute_name = this.human_attribute_name(attribute_name);\n\
      return \"\" + attribute_name + \" \" + options.server_message + \".\";\n\
    }\n\
  },\n\
  type: function(attribute_name, options) {\n\
    attribute_name = this.human_attribute_name(attribute_name);\n\
    return \"O campo \" + attribute_name + \" não está válido.\";\n\
  }\n\
};\n\
\n\
errorsable = stampit({\n\
  add: function(attribute_name, message_key, options) {\n\
    var translator;\n\
\n\
    this.push([attribute_name, message_key, options]);\n\
    this.messages[attribute_name] = '';\n\
    translator = messages[message_key];\n\
    if (translator != null) {\n\
      return this.messages[attribute_name] += translator.call(this.model, attribute_name, options);\n\
    } else {\n\
      return this.messages[attribute_name] += message_key;\n\
    }\n\
  },\n\
  clear: function() {\n\
    var attribute_name, _results;\n\
\n\
    if (this.length) {\n\
      this.length = 0;\n\
      _results = [];\n\
      for (attribute_name in this.messages) {\n\
        _results.push(this.messages[attribute_name] = null);\n\
      }\n\
      return _results;\n\
    }\n\
  },\n\
  push: Array.prototype.push,\n\
  splice: Array.prototype.splice,\n\
  indexOf: Array.prototype.indexOf\n\
}, {\n\
  model: null,\n\
  messages: null,\n\
  length: 0\n\
}, function() {\n\
  this.messages = {};\n\
  return this;\n\
});\n\
\n\
initializers = {\n\
  define_triggers: function() {\n\
    this.errors = errorsable({\n\
      model: model[this.resource]\n\
    });\n\
    this.before('save', function() {\n\
      if (this.save) {\n\
        return this.validate();\n\
      }\n\
    });\n\
    this.validated = false;\n\
    this.validation = null;\n\
    this.subscribe('dirty', function(value) {\n\
      return value && (this.validated = false);\n\
    });\n\
    return Object.defineProperty(this, 'valid', {\n\
      get: function() {\n\
        this.validate();\n\
        if (this.validation.state() === 'resolved') {\n\
          return !this.errors.length;\n\
        } else {\n\
          return null;\n\
        }\n\
      },\n\
      set: function() {\n\
        throw new TypeError(\"You can't set the value for the valid property.\");\n\
      },\n\
      enumerable: false\n\
    });\n\
  },\n\
  create_validators: function(definitions) {\n\
    var definition, name, validator, validator_options, _ref, _results;\n\
\n\
    this.validators = [];\n\
    _ref = manager.validators;\n\
    _results = [];\n\
    for (name in _ref) {\n\
      validator = _ref[name];\n\
      definition = definitions[validator.definition_key];\n\
      if (definition) {\n\
        if (type(definition) !== 'array') {\n\
          definition = [definition];\n\
        }\n\
        _results.push((function() {\n\
          var _i, _len, _results1;\n\
\n\
          _results1 = [];\n\
          for (_i = 0, _len = definition.length; _i < _len; _i++) {\n\
            validator_options = definition[_i];\n\
            if (type(validator_options) !== 'object') {\n\
              validator_options = {\n\
                attribute_name: validator_options\n\
              };\n\
            }\n\
            validator_options.model = this;\n\
            this.validators.push(validator(validator_options));\n\
            _results1.push(delete definitions[validator.definition_key]);\n\
          }\n\
          return _results1;\n\
        }).call(this));\n\
      } else {\n\
        _results.push(void 0);\n\
      }\n\
    }\n\
    return _results;\n\
  }\n\
};\n\
\n\
extensions = {\n\
  model: {\n\
    validators: null\n\
  },\n\
  record: {\n\
    validate_attribute: function(attribute, doned, failed) {\n\
      var results, validation, validator, _i, _len, _ref;\n\
\n\
      this.errors.messages[attribute] = null;\n\
      results = [this, attribute];\n\
      _ref = model[this.resource.toString()].validators;\n\
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
        validator = _ref[_i];\n\
        if (validator.attribute_name === attribute) {\n\
          results.push(validator.validate_each(this, validator.attribute_name, this[validator.attribute_name]));\n\
        }\n\
      }\n\
      validation = jQuery.when.apply(jQuery, results);\n\
      validation.done(doned);\n\
      validation.fail(failed);\n\
      return validation;\n\
    },\n\
    validate: function(doned, failed) {\n\
      var results, validator, _i, _len, _ref;\n\
\n\
      if (this.validated) {\n\
        return this.validation;\n\
      }\n\
      this.errors.clear();\n\
      results = [this];\n\
      _ref = model[this.resource.toString()].validators;\n\
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n\
        validator = _ref[_i];\n\
        results.push(validator.validate_each(this, validator.attribute_name, this[validator.attribute_name]));\n\
      }\n\
      this.validation = jQuery.when.apply(jQuery, results);\n\
      this.validation.done(doned);\n\
      this.validation.fail(failed);\n\
      return this.validation.done(function(record) {\n\
        var old_dirty;\n\
\n\
        old_dirty = record.dirty;\n\
        record.dirty = null;\n\
        record.validated || (record.validated = true);\n\
        record.observed.dirty = old_dirty;\n\
        return record;\n\
      });\n\
    }\n\
  }\n\
};\n\
\n\
manager = {\n\
  validators: {}\n\
};\n\
\n\
model.mix(function(modelable) {\n\
  if (modelable.record.validate) {\n\
    return;\n\
  }\n\
  jQuery.extend(modelable, extensions.model);\n\
  jQuery.extend(modelable.record, extensions.record);\n\
  modelable.after_mix.unshift(initializers.create_validators);\n\
  modelable.record.after_initialize.push(initializers.define_triggers);\n\
  return model.validators = manager.validators;\n\
});\n\
\n\
manager.validators.confirmation = require(\"indemma/lib/record/validations/confirmation.js\");\n\
\n\
manager.validators.associated = require(\"indemma/lib/record/validations/associated.js\");\n\
\n\
manager.validators.presence = require(\"indemma/lib/record/validations/presence.js\");\n\
\n\
manager.validators.remote = require(\"indemma/lib/record/validations/remote.js\");\n\
\n\
manager.validators.type = require(\"indemma/lib/record/validations/type.js\");\n\
\n\
manager.validators.cpf = require(\"indemma/lib/record/validations/cpf.js\");\n\
\n\
//# sourceURL=lib/record/validatable.js"
));

require.register("indemma/lib/record/validations/associated.js", Function("exports, module",
"var associationable, composed, stampit;\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
associationable = stampit({\n\
  validate_each: function(record, attribute, value) {\n\
    var associated, associated_validation;\n\
\n\
    associated = record[attribute];\n\
    if (associated) {\n\
      if (model[record.resource].has_one.indexOf(attribute) === -1) {\n\
        throw new Error('Only has_one associations are supported to validates_associated');\n\
      }\n\
      associated_validation = associated.validate();\n\
      associated_validation.done(function() {\n\
        if (associated.errors.length) {\n\
          return record.errors.add(attribute, 'associated', this.options);\n\
        }\n\
      });\n\
      return associated_validation;\n\
    }\n\
  }\n\
});\n\
\n\
composed = stampit.compose(require(\"indemma/lib/record/validations/validatorable.js\"), associationable);\n\
\n\
composed.definition_key = 'validates_associated';\n\
\n\
module.exports = composed;\n\
\n\
//# sourceURL=lib/record/validations/associated.js"
));

require.register("indemma/lib/record/validations/confirmation.js", Function("exports, module",
"var composed, confirmationable, stampit;\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
confirmationable = stampit({\n\
  validate_each: function(record, attribute, value) {\n\
    if (record[attribute] !== record[\"\" + attribute + \"_confirmation\"]) {\n\
      return record.errors.add(\"\" + attribute + \"_confirmation\", 'confirmation', this.options);\n\
    }\n\
  }\n\
});\n\
\n\
composed = stampit.compose(require(\"indemma/lib/record/validations/validatorable.js\"), confirmationable);\n\
\n\
composed.definition_key = 'validates_confirmation_of';\n\
\n\
module.exports = composed;\n\
\n\
//# sourceURL=lib/record/validations/confirmation.js"
));

require.register("indemma/lib/record/validations/cpf.js", Function("exports, module",
"var composed, cpfable, stampit;\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
cpfable = stampit({\n\
  validate_format: function(value) {\n\
    var c, d1, dv, i, v, _i, _j;\n\
\n\
    value = value.replace(/[\\.\\-]/g, \"\");\n\
    if (value.length < 11) {\n\
      return false;\n\
    }\n\
    if (value.match(/^(0+|1+|2+|3+|4+|5+|6+|7+|8+|9+)$/)) {\n\
      return false;\n\
    }\n\
    c = value.substr(0, 9);\n\
    dv = value.substr(9, 2);\n\
    d1 = 0;\n\
    v = false;\n\
    i = 0;\n\
    for (i = _i = 0; _i <= 9; i = ++_i) {\n\
      d1 += c.charAt(i) * (10 - i);\n\
    }\n\
    if (d1 === 0) {\n\
      return false;\n\
    }\n\
    d1 = 11 - (d1 % 11);\n\
    if (d1 > 9) {\n\
      d1 = 0;\n\
    }\n\
    if (+dv.charAt(0) !== d1) {\n\
      return false;\n\
    }\n\
    d1 *= 2;\n\
    for (i = _j = 0; _j <= 9; i = ++_j) {\n\
      d1 += c.charAt(i) * (11 - i);\n\
    }\n\
    d1 = 11 - (d1 % 11);\n\
    if (d1 > 9) {\n\
      d1 = 0;\n\
    }\n\
    if (+dv.charAt(1) !== d1) {\n\
      return false;\n\
    }\n\
    return true;\n\
  },\n\
  validate_each: function(record, attribute, value) {\n\
    if (value && !this.validate_format(value)) {\n\
      return record.errors.add(attribute, 'cpf', this.options);\n\
    }\n\
  }\n\
});\n\
\n\
composed = stampit.compose(require(\"indemma/lib/record/validations/validatorable.js\"), cpfable);\n\
\n\
composed.definition_key = 'validates_cpf_format';\n\
\n\
module.exports = composed;\n\
\n\
//# sourceURL=lib/record/validations/cpf.js"
));

require.register("indemma/lib/record/validations/presence.js", Function("exports, module",
"var composed, presenceable, stampit;\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
presenceable = stampit({\n\
  validate_each: function(record, attribute, value) {\n\
    if (value === null || value === '' || value === void 0) {\n\
      return record.errors.add(attribute, 'blank', this.options);\n\
    }\n\
  }\n\
});\n\
\n\
composed = stampit.compose(require(\"indemma/lib/record/validations/validatorable.js\"), presenceable);\n\
\n\
composed.definition_key = 'validates_presence_of';\n\
\n\
module.exports = composed;\n\
\n\
//# sourceURL=lib/record/validations/presence.js"
));

require.register("indemma/lib/record/validations/remote.js", Function("exports, module",
"var composed, remoteable, rest, stampit;\n\
\n\
rest = require(\"indemma/lib/record/rest.js\");\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
remoteable = stampit({\n\
  validate_each: function(record, attribute, value) {\n\
    var data,\n\
      _this = this;\n\
\n\
    data = this.json(record);\n\
    return this.post(data).done(function(json) {\n\
      return _this.succeeded(json, record);\n\
    });\n\
  },\n\
  json: function(record) {\n\
    var data, param, _base;\n\
\n\
    param = this.resource.param_name || this.resource.toString();\n\
    data = {};\n\
    data[param] = record.json();\n\
    (_base = data[param]).id || (_base.id = data[param]._id);\n\
    delete data[param]._id;\n\
    return data;\n\
  },\n\
  post: function(data) {\n\
    return jQuery.ajax({\n\
      url: this.route,\n\
      data: data,\n\
      type: 'post',\n\
      dataType: 'json',\n\
      context: this\n\
    });\n\
  },\n\
  succeeded: function(json, record) {\n\
    var error_message, error_messages, _i, _len, _results;\n\
\n\
    error_messages = json[this.attribute_name];\n\
    if (!error_messages) {\n\
      return;\n\
    }\n\
    _results = [];\n\
    for (_i = 0, _len = error_messages.length; _i < _len; _i++) {\n\
      error_message = error_messages[_i];\n\
      _results.push(record.errors.add(this.attribute_name, 'server', {\n\
        server_message: error_message\n\
      }));\n\
    }\n\
    return _results;\n\
  }\n\
}, {\n\
  message: \"Remote validation failed\",\n\
  route: null\n\
}, function() {\n\
  var pluralized_resource;\n\
\n\
  pluralized_resource = model.pluralize(this.model.resource.toString());\n\
  this.resource = this.model.resource;\n\
  this.route || (this.route = \"/\" + pluralized_resource + \"/validate\");\n\
  return this;\n\
});\n\
\n\
composed = stampit.compose(require(\"indemma/lib/record/validations/validatorable.js\"), remoteable);\n\
\n\
composed.definition_key = 'validates_remotely';\n\
\n\
module.exports = composed;\n\
\n\
//# sourceURL=lib/record/validations/remote.js"
));

require.register("indemma/lib/record/validations/type.js", Function("exports, module",
"var composed, stampit, typeable, validations;\n\
\n\
validations = require(\"indemma/lib/record/validatable.js\");\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
typeable = stampit({\n\
  validate_each: function(record, attribute, value) {\n\
    this.type || (this.type = model[record.resource.toString()][attribute]);\n\
    if (value) {\n\
      if (value instanceof this.type) {\n\
        this.type_name || (this.type_name = this.type.name);\n\
        if (!value.valid) {\n\
          return record.errors.add(attribute, 'type', {\n\
            type_name: this.type_name != null\n\
          });\n\
        }\n\
      } else {\n\
        throw new Error(\"Invalid attribute value type! Found \" + (typeof value) + \" expected \" + this.type.name);\n\
      }\n\
    }\n\
  }\n\
});\n\
\n\
composed = stampit.compose(require(\"indemma/lib/record/validations/validatorable.js\"), typeable);\n\
\n\
composed.definition_key = 'validates_type_of';\n\
\n\
module.exports = composed;\n\
\n\
//# sourceURL=lib/record/validations/type.js"
));

require.register("indemma/lib/record/validations/validatorable.js", Function("exports, module",
"var stampit;\n\
\n\
stampit = require(\"indemma/vendor/stampit.js\");\n\
\n\
module.exports = stampit({\n\
  validate: function() {\n\
    throw new Error('Composed factory must override the validate method');\n\
  },\n\
  validate_each: function() {\n\
    throw new Error('Composed factory must override the validate each method');\n\
  }\n\
});\n\
\n\
//# sourceURL=lib/record/validations/validatorable.js"
));

require.register("indemma/vendor/stampit.js", Function("exports, module",
"!function(e){if(\"object\"==typeof exports)module.exports=e();else if(\"function\"==typeof define&&define.amd)define(e);else{var f;\"undefined\"!=typeof window?f=window:\"undefined\"!=typeof global?f=global:\"undefined\"!=typeof self&&(f=self),f.stampit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error(\"Cannot find module '\"+o+\"'\")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){\n\
var forIn = _dereq_('mout/object/forIn');\n\
\n\
function copyProp(val, key){\n\
    this[key] = val;\n\
}\n\
\n\
module.exports = function mixInChain(target, objects){\n\
    var i = 0,\n\
        n = arguments.length,\n\
        obj;\n\
    while(++i < n){\n\
        obj = arguments[i];\n\
        if (obj != null) {\n\
            forIn(obj, copyProp, target);\n\
        }\n\
    }\n\
    return target;\n\
};\n\
\n\
},{\"mout/object/forIn\":14}],2:[function(_dereq_,module,exports){\n\
\n\
\n\
    /**\n\
     * Array forEach\n\
     */\n\
    function forEach(arr, callback, thisObj) {\n\
        if (arr == null) {\n\
            return;\n\
        }\n\
        var i = -1,\n\
            len = arr.length;\n\
        while (++i < len) {\n\
            // we iterate over sparse items since there is no way to make it\n\
            // work properly on IE 7-8. see #64\n\
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {\n\
                break;\n\
            }\n\
        }\n\
    }\n\
\n\
    module.exports = forEach;\n\
\n\
\n\
\n\
},{}],3:[function(_dereq_,module,exports){\n\
var forEach = _dereq_('./forEach');\n\
var makeIterator = _dereq_('../function/makeIterator_');\n\
\n\
    /**\n\
     * Array map\n\
     */\n\
    function map(arr, callback, thisObj) {\n\
        callback = makeIterator(callback, thisObj);\n\
        var results = [];\n\
        if (arr == null){\n\
            return results;\n\
        }\n\
\n\
        var i = -1, len = arr.length;\n\
        while (++i < len) {\n\
            results[i] = callback(arr[i], i, arr);\n\
        }\n\
\n\
        return results;\n\
    }\n\
\n\
     module.exports = map;\n\
\n\
\n\
},{\"../function/makeIterator_\":4,\"./forEach\":2}],4:[function(_dereq_,module,exports){\n\
var prop = _dereq_('./prop');\n\
var deepMatches = _dereq_('../object/deepMatches');\n\
\n\
    /**\n\
     * Converts argument into a valid iterator.\n\
     * Used internally on most array/object/collection methods that receives a\n\
     * callback/iterator providing a shortcut syntax.\n\
     */\n\
    function makeIterator(src, thisObj){\n\
        switch(typeof src) {\n\
            case 'object':\n\
                // typeof null == \"object\"\n\
                return (src != null)? function(val, key, target){\n\
                    return deepMatches(val, src);\n\
                } : src;\n\
            case 'string':\n\
            case 'number':\n\
                return prop(src);\n\
            case 'function':\n\
                if (typeof thisObj === 'undefined') {\n\
                    return src;\n\
                } else {\n\
                    return function(val, i, arr){\n\
                        return src.call(thisObj, val, i, arr);\n\
                    };\n\
                }\n\
            default:\n\
                return src;\n\
        }\n\
    }\n\
\n\
    module.exports = makeIterator;\n\
\n\
\n\
\n\
},{\"../object/deepMatches\":13,\"./prop\":5}],5:[function(_dereq_,module,exports){\n\
\n\
\n\
    /**\n\
     * Returns a function that gets a property of the passed object\n\
     */\n\
    function prop(name){\n\
        return function(obj){\n\
            return obj[name];\n\
        };\n\
    }\n\
\n\
    module.exports = prop;\n\
\n\
\n\
\n\
},{}],6:[function(_dereq_,module,exports){\n\
var kindOf = _dereq_('./kindOf');\n\
var isPlainObject = _dereq_('./isPlainObject');\n\
var mixIn = _dereq_('../object/mixIn');\n\
\n\
    /**\n\
     * Clone native types.\n\
     */\n\
    function clone(val){\n\
        switch (kindOf(val)) {\n\
            case 'Object':\n\
                return cloneObject(val);\n\
            case 'Array':\n\
                return cloneArray(val);\n\
            case 'RegExp':\n\
                return cloneRegExp(val);\n\
            case 'Date':\n\
                return cloneDate(val);\n\
            default:\n\
                return val;\n\
        }\n\
    }\n\
\n\
    function cloneObject(source) {\n\
        if (isPlainObject(source)) {\n\
            return mixIn({}, source);\n\
        } else {\n\
            return source;\n\
        }\n\
    }\n\
\n\
    function cloneRegExp(r) {\n\
        var flags = '';\n\
        flags += r.multiline ? 'm' : '';\n\
        flags += r.global ? 'g' : '';\n\
        flags += r.ignorecase ? 'i' : '';\n\
        return new RegExp(r.source, flags);\n\
    }\n\
\n\
    function cloneDate(date) {\n\
        return new Date(+date);\n\
    }\n\
\n\
    function cloneArray(arr) {\n\
        return arr.slice();\n\
    }\n\
\n\
    module.exports = clone;\n\
\n\
\n\
\n\
},{\"../object/mixIn\":18,\"./isPlainObject\":11,\"./kindOf\":12}],7:[function(_dereq_,module,exports){\n\
var clone = _dereq_('./clone');\n\
var forOwn = _dereq_('../object/forOwn');\n\
var kindOf = _dereq_('./kindOf');\n\
var isPlainObject = _dereq_('./isPlainObject');\n\
\n\
    /**\n\
     * Recursively clone native types.\n\
     */\n\
    function deepClone(val, instanceClone) {\n\
        switch ( kindOf(val) ) {\n\
            case 'Object':\n\
                return cloneObject(val, instanceClone);\n\
            case 'Array':\n\
                return cloneArray(val, instanceClone);\n\
            default:\n\
                return clone(val);\n\
        }\n\
    }\n\
\n\
    function cloneObject(source, instanceClone) {\n\
        if (isPlainObject(source)) {\n\
            var out = {};\n\
            forOwn(source, function(val, key) {\n\
                this[key] = deepClone(val, instanceClone);\n\
            }, out);\n\
            return out;\n\
        } else if (instanceClone) {\n\
            return instanceClone(source);\n\
        } else {\n\
            return source;\n\
        }\n\
    }\n\
\n\
    function cloneArray(arr, instanceClone) {\n\
        var out = [],\n\
            i = -1,\n\
            n = arr.length,\n\
            val;\n\
        while (++i < n) {\n\
            out[i] = deepClone(arr[i], instanceClone);\n\
        }\n\
        return out;\n\
    }\n\
\n\
    module.exports = deepClone;\n\
\n\
\n\
\n\
\n\
},{\"../object/forOwn\":15,\"./clone\":6,\"./isPlainObject\":11,\"./kindOf\":12}],8:[function(_dereq_,module,exports){\n\
var isKind = _dereq_('./isKind');\n\
    /**\n\
     */\n\
    var isArray = Array.isArray || function (val) {\n\
        return isKind(val, 'Array');\n\
    };\n\
    module.exports = isArray;\n\
\n\
\n\
},{\"./isKind\":9}],9:[function(_dereq_,module,exports){\n\
var kindOf = _dereq_('./kindOf');\n\
    /**\n\
     * Check if value is from a specific \"kind\".\n\
     */\n\
    function isKind(val, kind){\n\
        return kindOf(val) === kind;\n\
    }\n\
    module.exports = isKind;\n\
\n\
\n\
},{\"./kindOf\":12}],10:[function(_dereq_,module,exports){\n\
var isKind = _dereq_('./isKind');\n\
    /**\n\
     */\n\
    function isObject(val) {\n\
        return isKind(val, 'Object');\n\
    }\n\
    module.exports = isObject;\n\
\n\
\n\
},{\"./isKind\":9}],11:[function(_dereq_,module,exports){\n\
\n\
\n\
    /**\n\
     * Checks if the value is created by the `Object` constructor.\n\
     */\n\
    function isPlainObject(value) {\n\
        return (!!value\n\
            && typeof value === 'object'\n\
            && value.constructor === Object);\n\
    }\n\
\n\
    module.exports = isPlainObject;\n\
\n\
\n\
\n\
},{}],12:[function(_dereq_,module,exports){\n\
\n\
\n\
    var _rKind = /^\\[object (.*)\\]$/,\n\
        _toString = Object.prototype.toString,\n\
        UNDEF;\n\
\n\
    /**\n\
     * Gets the \"kind\" of value. (e.g. \"String\", \"Number\", etc)\n\
     */\n\
    function kindOf(val) {\n\
        if (val === null) {\n\
            return 'Null';\n\
        } else if (val === UNDEF) {\n\
            return 'Undefined';\n\
        } else {\n\
            return _rKind.exec( _toString.call(val) )[1];\n\
        }\n\
    }\n\
    module.exports = kindOf;\n\
\n\
\n\
},{}],13:[function(_dereq_,module,exports){\n\
var forOwn = _dereq_('./forOwn');\n\
var isArray = _dereq_('../lang/isArray');\n\
\n\
    function containsMatch(array, pattern) {\n\
        var i = -1, length = array.length;\n\
        while (++i < length) {\n\
            if (deepMatches(array[i], pattern)) {\n\
                return true;\n\
            }\n\
        }\n\
\n\
        return false;\n\
    }\n\
\n\
    function matchArray(target, pattern) {\n\
        var i = -1, patternLength = pattern.length;\n\
        while (++i < patternLength) {\n\
            if (!containsMatch(target, pattern[i])) {\n\
                return false;\n\
            }\n\
        }\n\
\n\
        return true;\n\
    }\n\
\n\
    function matchObject(target, pattern) {\n\
        var result = true;\n\
        forOwn(pattern, function(val, key) {\n\
            if (!deepMatches(target[key], val)) {\n\
                // Return false to break out of forOwn early\n\
                return (result = false);\n\
            }\n\
        });\n\
\n\
        return result;\n\
    }\n\
\n\
    /**\n\
     * Recursively check if the objects match.\n\
     */\n\
    function deepMatches(target, pattern){\n\
        if (target && typeof target === 'object') {\n\
            if (isArray(target) && isArray(pattern)) {\n\
                return matchArray(target, pattern);\n\
            } else {\n\
                return matchObject(target, pattern);\n\
            }\n\
        } else {\n\
            return target === pattern;\n\
        }\n\
    }\n\
\n\
    module.exports = deepMatches;\n\
\n\
\n\
\n\
},{\"../lang/isArray\":8,\"./forOwn\":15}],14:[function(_dereq_,module,exports){\n\
\n\
\n\
    var _hasDontEnumBug,\n\
        _dontEnums;\n\
\n\
    function checkDontEnum(){\n\
        _dontEnums = [\n\
                'toString',\n\
                'toLocaleString',\n\
                'valueOf',\n\
                'hasOwnProperty',\n\
                'isPrototypeOf',\n\
                'propertyIsEnumerable',\n\
                'constructor'\n\
            ];\n\
\n\
        _hasDontEnumBug = true;\n\
\n\
        for (var key in {'toString': null}) {\n\
            _hasDontEnumBug = false;\n\
        }\n\
    }\n\
\n\
    /**\n\
     * Similar to Array/forEach but works over object properties and fixes Don't\n\
     * Enum bug on IE.\n\
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation\n\
     */\n\
    function forIn(obj, fn, thisObj){\n\
        var key, i = 0;\n\
        // no need to check if argument is a real object that way we can use\n\
        // it for arrays, functions, date, etc.\n\
\n\
        //post-pone check till needed\n\
        if (_hasDontEnumBug == null) checkDontEnum();\n\
\n\
        for (key in obj) {\n\
            if (exec(fn, obj, key, thisObj) === false) {\n\
                break;\n\
            }\n\
        }\n\
\n\
        if (_hasDontEnumBug) {\n\
            while (key = _dontEnums[i++]) {\n\
                // since we aren't using hasOwn check we need to make sure the\n\
                // property was overwritten\n\
                if (obj[key] !== Object.prototype[key]) {\n\
                    if (exec(fn, obj, key, thisObj) === false) {\n\
                        break;\n\
                    }\n\
                }\n\
            }\n\
        }\n\
    }\n\
\n\
    function exec(fn, obj, key, thisObj){\n\
        return fn.call(thisObj, obj[key], key, obj);\n\
    }\n\
\n\
    module.exports = forIn;\n\
\n\
\n\
\n\
},{}],15:[function(_dereq_,module,exports){\n\
var hasOwn = _dereq_('./hasOwn');\n\
var forIn = _dereq_('./forIn');\n\
\n\
    /**\n\
     * Similar to Array/forEach but works over object properties and fixes Don't\n\
     * Enum bug on IE.\n\
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation\n\
     */\n\
    function forOwn(obj, fn, thisObj){\n\
        forIn(obj, function(val, key){\n\
            if (hasOwn(obj, key)) {\n\
                return fn.call(thisObj, obj[key], key, obj);\n\
            }\n\
        });\n\
    }\n\
\n\
    module.exports = forOwn;\n\
\n\
\n\
\n\
},{\"./forIn\":14,\"./hasOwn\":16}],16:[function(_dereq_,module,exports){\n\
\n\
\n\
    /**\n\
     * Safer Object.hasOwnProperty\n\
     */\n\
     function hasOwn(obj, prop){\n\
         return Object.prototype.hasOwnProperty.call(obj, prop);\n\
     }\n\
\n\
     module.exports = hasOwn;\n\
\n\
\n\
\n\
},{}],17:[function(_dereq_,module,exports){\n\
var hasOwn = _dereq_('./hasOwn');\n\
var deepClone = _dereq_('../lang/deepClone');\n\
var isObject = _dereq_('../lang/isObject');\n\
\n\
    /**\n\
     * Deep merge objects.\n\
     */\n\
    function merge() {\n\
        var i = 1,\n\
            key, val, obj, target;\n\
\n\
        // make sure we don't modify source element and it's properties\n\
        // objects are passed by reference\n\
        target = deepClone( arguments[0] );\n\
\n\
        while (obj = arguments[i++]) {\n\
            for (key in obj) {\n\
                if ( ! hasOwn(obj, key) ) {\n\
                    continue;\n\
                }\n\
\n\
                val = obj[key];\n\
\n\
                if ( isObject(val) && isObject(target[key]) ){\n\
                    // inception, deep merge objects\n\
                    target[key] = merge(target[key], val);\n\
                } else {\n\
                    // make sure arrays, regexp, date, objects are cloned\n\
                    target[key] = deepClone(val);\n\
                }\n\
\n\
            }\n\
        }\n\
\n\
        return target;\n\
    }\n\
\n\
    module.exports = merge;\n\
\n\
\n\
\n\
},{\"../lang/deepClone\":7,\"../lang/isObject\":10,\"./hasOwn\":16}],18:[function(_dereq_,module,exports){\n\
var forOwn = _dereq_('./forOwn');\n\
\n\
    /**\n\
    * Combine properties from all the objects into first one.\n\
    * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.\n\
    * @param {object} target    Target Object\n\
    * @param {...object} objects    Objects to be combined (0...n objects).\n\
    * @return {object} Target Object.\n\
    */\n\
    function mixIn(target, objects){\n\
        var i = 0,\n\
            n = arguments.length,\n\
            obj;\n\
        while(++i < n){\n\
            obj = arguments[i];\n\
            if (obj != null) {\n\
                forOwn(obj, copyProp, target);\n\
            }\n\
        }\n\
        return target;\n\
    }\n\
\n\
    function copyProp(val, key){\n\
        this[key] = val;\n\
    }\n\
\n\
    module.exports = mixIn;\n\
\n\
\n\
},{\"./forOwn\":15}],19:[function(_dereq_,module,exports){\n\
/**\n\
 * Stampit\n\
 **\n\
 * Create objects from reusable, composable behaviors.\n\
 **\n\
 * Copyright (c) 2013 Eric Elliott\n\
 * http://opensource.org/licenses/MIT\n\
 **/\n\
'use strict';\n\
var forEach = _dereq_('mout/array/forEach');\n\
var mixIn = _dereq_('mout/object/mixIn');\n\
var merge = _dereq_('mout/object/merge');\n\
var map = _dereq_('mout/array/map');\n\
var forOwn = _dereq_('mout/object/forOwn');\n\
var mixInChain = _dereq_('./mixinchain.js');\n\
var slice = [].slice;\n\
\n\
var create = function (o) {\n\
  if (arguments.length > 1) {\n\
    throw new Error('Object.create implementation only accepts the first parameter.');\n\
  }\n\
  function F() {}\n\
  F.prototype = o;\n\
  return new F();\n\
};\n\
\n\
if(!Array.isArray) {\n\
  Array.isArray = function (vArg) {\n\
    return Object.prototype.toString.call(vArg) === \"[object Array]\";\n\
  };\n\
}\n\
\n\
var extractFunctions = function extractFunctions(arg) {\n\
  var arr = [],\n\
    args = [].slice.call(arguments);\n\
\n\
  if (typeof arg === 'function') {\n\
    arr = map(args, function (fn) {\n\
      if (typeof fn === 'function') {\n\
        return fn;\n\
      }\n\
    });\n\
  } else if (typeof arg === 'object') {\n\
    forEach(args, function (obj) {\n\
      forOwn(obj, function (fn) {\n\
        arr.push(fn);\n\
      });\n\
    });\n\
  } else if ( Array.isArray(arg) ) {\n\
    forEach(arg, function (fn) {\n\
      arr.push(fn);\n\
    });\n\
  }\n\
  return arr;\n\
};\n\
\n\
/**\n\
 * Return a factory function that will produce new objects using the\n\
 * prototypes that are passed in or composed.\n\
 *\n\
 * @param  {Object} [methods] A map of method names and bodies for delegation.\n\
 * @param  {Object} [state]   A map of property names and values to clone for each new object.\n\
 * @param  {Function} [enclose] A closure (function) used to create private data and privileged methods.\n\
 * @return {Function} factory A factory to produce objects using the given prototypes.\n\
 * @return {Function} factory.create Just like calling the factory function.\n\
 * @return {Object} factory.fixed An object map containing the fixed prototypes.\n\
 * @return {Function} factory.methods Add methods to the methods prototype. Chainable.\n\
 * @return {Function} factory.state Add properties to the state prototype. Chainable.\n\
 * @return {Function} factory.enclose Add or replace the closure prototype. Not chainable.\n\
 */\n\
var stampit = function stampit(methods, state, enclose) {\n\
  var fixed = {\n\
      methods: methods || {},\n\
      state: state,\n\
      enclose: extractFunctions(enclose)\n\
    },\n\
\n\
    factory = function factory(properties) {\n\
      var state = merge({}, fixed.state),\n\
        instance = mixIn(create(fixed.methods || {}),\n\
          state, properties),\n\
        closures = fixed.enclose,\n\
        args = slice.call(arguments, 1);\n\
\n\
      forEach(closures, function (fn) {\n\
        if (typeof fn === 'function') {\n\
          instance = fn.apply(instance, args) || instance;\n\
        }\n\
      });\n\
\n\
      return instance;\n\
    };\n\
\n\
  return mixIn(factory, {\n\
    create: factory,\n\
    fixed: fixed,\n\
    /**\n\
     * Take n objects and add them to the methods prototype.\n\
     * @return {Object} stamp  The factory in question (`this`).\n\
     */\n\
    methods: function stampMethods() {\n\
      var obj = fixed.methods || {},\n\
        args = [obj].concat([].slice.call(arguments));\n\
      fixed.methods = mixInChain.apply(this, args);\n\
      return this;\n\
    },\n\
    /**\n\
     * Take n objects and add them to the state prototype.\n\
     * @return {Object} stamp  The factory in question (`this`).\n\
     */\n\
    state: function stampState() {\n\
      var obj = fixed.state || {},\n\
        args = [obj].concat([].slice.call(arguments));\n\
      fixed.state = mixIn.apply(this, args);\n\
      return this;\n\
    },\n\
    /**\n\
     * Take n functions, an array of functions, or n objects and add\n\
     * the functions to the enclose prototype.\n\
     * @return {Object} stamp  The factory in question (`this`).\n\
     */\n\
    enclose: function stampEnclose() {\n\
      fixed.enclose = fixed.enclose\n\
        .concat( extractFunctions.apply(null, arguments) );\n\
      return this;\n\
    }\n\
  });\n\
};\n\
\n\
/**\n\
 * Take two or more factories produced from stampit() and\n\
 * combine them to produce a new factory. Combining overrides\n\
 * properties with last-in priority.\n\
 *\n\
 * @param {...Function} factory A factory produced by stampit().\n\
 * @return {Function} A new stampit factory composed from arguments.\n\
 */\n\
var compose = function compose() {\n\
  var args = [].slice.call(arguments),\n\
    obj = stampit();\n\
\n\
  forEach(args, function (source) {\n\
    if (source) {\n\
      if (source.fixed.methods) {\n\
        obj.fixed.methods = mixInChain({}, obj.fixed.methods,\n\
          source.fixed.methods);\n\
      }\n\
\n\
      if (source.fixed.state) {\n\
        obj.fixed.state = mixIn({}, obj.fixed.state,\n\
          source.fixed.state);\n\
      }\n\
\n\
      if (source.fixed.enclose) {\n\
        obj.fixed.enclose = obj.fixed.enclose\n\
          .concat(source.fixed.enclose);\n\
      }\n\
    }\n\
  });\n\
\n\
  return stampit(obj.fixed.methods, obj.fixed.state,\n\
    obj.fixed.enclose);\n\
};\n\
\n\
/**\n\
 * Take an old-fashioned JS constructor and return a stampit stamp\n\
 * that you can freely compose with other stamps.\n\
 * @param  {Function} Constructor \n\
 * @return {Function}             A composable stampit factory\n\
 *                                (aka stamp).\n\
 */\n\
var convertConstructor = function convertConstructor(Constructor) {\n\
  return stampit().methods(Constructor.prototype).enclose(Constructor);\n\
};\n\
\n\
module.exports = mixIn(stampit, {\n\
  compose: compose,\n\
  /**\n\
   * Alias for mixIn\n\
   */\n\
  extend: mixIn,\n\
  /**\n\
   * Take a destination object followed by one or more source objects,\n\
   * and copy the source object properties to the destination object,\n\
   * with last in priority overrides.\n\
   * @param {Object} destination An object to copy properties to.\n\
   * @param {...Object} source An object to copy properties from.\n\
   * @returns {Object}\n\
   */\n\
  mixIn: mixIn,\n\
\n\
  convertConstructor: convertConstructor\n\
});\n\
\n\
},{\"./mixinchain.js\":1,\"mout/array/forEach\":2,\"mout/array/map\":3,\"mout/object/forOwn\":15,\"mout/object/merge\":17,\"mout/object/mixIn\":18}]},{},[19])\n\
(19)\n\
});\n\
//# sourceURL=vendor/stampit.js"
));

require.register("indemma/vendor/owl/pluralize.js", Function("exports, module",
"/* This file is part of OWL Pluralization.\r\n\
\r\n\
OWL Pluralization is free software: you can redistribute it and/or \r\n\
modify it under the terms of the GNU Lesser General Public License\r\n\
as published by the Free Software Foundation, either version 3 of\r\n\
the License, or (at your option) any later version.\r\n\
\r\n\
OWL Pluralization is distributed in the hope that it will be useful,\r\n\
but WITHOUT ANY WARRANTY; without even the implied warranty of\r\n\
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\r\n\
GNU Lesser General Public License for more details.\r\n\
\r\n\
You should have received a copy of the GNU Lesser General Public \r\n\
License along with OWL Pluralization.  If not, see \r\n\
<http://www.gnu.org/licenses/>.\r\n\
*/\r\n\
\r\n\
// prepare the owl namespace.\r\n\
if ( typeof owl === 'undefined' ) owl = {};\r\n\
\r\n\
owl.pluralize = (function() {\r\n\
\tvar userDefined = {};\r\n\
\r\n\
\tfunction capitalizeSame(word, sampleWord) {\r\n\
\t\tif ( sampleWord.match(/^[A-Z]/) ) {\r\n\
\t\t\treturn word.charAt(0).toUpperCase() + word.slice(1);\r\n\
\t\t} else {\r\n\
\t\t\treturn word;\r\n\
\t\t}\r\n\
\t}\r\n\
\r\n\
\t// returns a plain Object having the given keys,\r\n\
\t// all with value 1, which can be used for fast lookups.\r\n\
\tfunction toKeys(keys) {\r\n\
\t\tkeys = keys.split(',');\r\n\
\t\tvar keysLength = keys.length;\r\n\
\t\tvar table = {};\r\n\
\t\tfor ( var i=0; i < keysLength; i++ ) {\r\n\
\t\t\ttable[ keys[i] ] = 1;\r\n\
\t\t}\r\n\
\t\treturn table;\r\n\
\t}\r\n\
\r\n\
\t// words that are always singular, always plural, or the same in both forms.\r\n\
\tvar uninflected = toKeys(\"aircraft,advice,blues,corn,molasses,equipment,gold,information,cotton,jewelry,kin,legislation,luck,luggage,moose,music,offspring,rice,silver,trousers,wheat,bison,bream,breeches,britches,carp,chassis,clippers,cod,contretemps,corps,debris,diabetes,djinn,eland,elk,flounder,gallows,graffiti,headquarters,herpes,high,homework,innings,jackanapes,mackerel,measles,mews,mumps,news,pincers,pliers,proceedings,rabies,salmon,scissors,sea,series,shears,species,swine,trout,tuna,whiting,wildebeest,pike,oats,tongs,dregs,snuffers,victuals,tweezers,vespers,pinchers,bellows,cattle\");\r\n\
\r\n\
\tvar irregular = {\r\n\
\t\t// pronouns\r\n\
\t\tI: 'we',\r\n\
\t\tyou: 'you',\r\n\
\t\the: 'they',\r\n\
\t\tit: 'they',  // or them\r\n\
\t\tme: 'us',\r\n\
\t\tyou: 'you',\r\n\
\t\thim: 'them',\r\n\
\t\tthem: 'them',\r\n\
\t\tmyself: 'ourselves',\r\n\
\t\tyourself: 'yourselves',\r\n\
\t\thimself: 'themselves',\r\n\
\t\therself: 'themselves',\r\n\
\t\titself: 'themselves',\r\n\
\t\tthemself: 'themselves',\r\n\
\t\toneself: 'oneselves',\r\n\
\r\n\
\t\tchild: 'children',\r\n\
\t\tdwarf: 'dwarfs',  // dwarfs are real; dwarves are fantasy.\r\n\
\t\tmongoose: 'mongooses',\r\n\
\t\tmythos: 'mythoi',\r\n\
\t\tox: 'oxen',\r\n\
\t\tsoliloquy: 'soliloquies',\r\n\
\t\ttrilby: 'trilbys',\r\n\
\t\tperson: 'people',\r\n\
\t\tforum: 'forums', // fora is ok but uncommon.\r\n\
\r\n\
\t\t// latin plural in popular usage.\r\n\
\t\tsyllabus: 'syllabi',\r\n\
\t\talumnus: 'alumni', \r\n\
\t\tgenus: 'genera',\r\n\
\t\tviscus: 'viscera',\r\n\
\t\tstigma: 'stigmata'\r\n\
\t};\r\n\
\r\n\
\tvar suffixRules = [\r\n\
\t\t// common suffixes\r\n\
\t\t[ /man$/i, 'men' ],\r\n\
\t\t[ /([lm])ouse$/i, '$1ice' ],\r\n\
\t\t[ /tooth$/i, 'teeth' ],\r\n\
\t\t[ /goose$/i, 'geese' ],\r\n\
\t\t[ /foot$/i, 'feet' ],\r\n\
\t\t[ /zoon$/i, 'zoa' ],\r\n\
\t\t[ /([tcsx])is$/i, '$1es' ],\r\n\
\r\n\
\t\t// fully assimilated suffixes\r\n\
\t\t[ /ix$/i, 'ices' ],\r\n\
\t\t[ /^(cod|mur|sil|vert)ex$/i, '$1ices' ],\r\n\
\t\t[ /^(agend|addend|memorand|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)um$/i, '$1a' ],\r\n\
\t\t[ /^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\\w+hedr)on$/i, '$1a' ],\r\n\
\t\t[ /^(alumn|alg|vertebr)a$/i, '$1ae' ],\r\n\
\t\t\r\n\
\t\t// churches, classes, boxes, etc.\r\n\
\t\t[ /([cs]h|ss|x)$/i, '$1es' ],\r\n\
\r\n\
\t\t// words with -ves plural form\r\n\
\t\t[ /([aeo]l|[^d]ea|ar)f$/i, '$1ves' ],\r\n\
\t\t[ /([nlw]i)fe$/i, '$1ves' ],\r\n\
\r\n\
\t\t// -y\r\n\
\t\t[ /([aeiou])y$/i, '$1ys' ],\r\n\
\t\t[ /(^[A-Z][a-z]*)y$/, '$1ys' ], // case sensitive!\r\n\
\t\t[ /y$/i, 'ies' ],\r\n\
\r\n\
\t\t// -o\r\n\
\t\t[ /([aeiou])o$/i, '$1os' ],\r\n\
\t\t[ /^(pian|portic|albin|generalissim|manifest|archipelag|ghett|medic|armadill|guan|octav|command|infern|phot|ditt|jumb|pr|dynam|ling|quart|embry|lumbag|rhin|fiasc|magnet|styl|alt|contralt|sopran|bass|crescend|temp|cant|sol|kimon)o$/i, '$1os' ],\r\n\
\t\t[ /o$/i, 'oes' ],\r\n\
\r\n\
\t\t// words ending in s...\r\n\
\t\t[ /s$/i, 'ses' ]\r\n\
\t];\r\n\
\r\n\
\t// pluralizes the given singular noun.  There are three ways to call it:\r\n\
\t//   pluralize(noun) -> pluralNoun\r\n\
\t//     Returns the plural of the given noun.\r\n\
\t//   Example: \r\n\
\t//     pluralize(\"person\") -> \"people\"\r\n\
\t//     pluralize(\"me\") -> \"us\"\r\n\
\t//\r\n\
\t//   pluralize(noun, count) -> plural or singular noun\r\n\
\t//   Inflect the noun according to the count, returning the singular noun\r\n\
\t//   if the count is 1.\r\n\
\t//   Examples:\r\n\
\t//     pluralize(\"person\", 3) -> \"people\"\r\n\
\t//     pluralize(\"person\", 1) -> \"person\"\r\n\
\t//     pluralize(\"person\", 0) -> \"people\"\r\n\
\t//\r\n\
\t//   pluralize(noun, count, plural) -> plural or singular noun\r\n\
\t//   you can provide an irregular plural yourself as the 3rd argument.\r\n\
\t//   Example:\r\n\
\t//     pluralize(\"château\", 2 \"châteaux\") -> \"châteaux\"\r\n\
\tfunction pluralize(word, count, plural) {\r\n\
\t\t// handle the empty string reasonably.\r\n\
\t\tif ( word === '' ) return '';\r\n\
\r\n\
\t\t// singular case.\r\n\
\t\tif ( count === 1 ) return word;\r\n\
\r\n\
\t\t// life is very easy if an explicit plural was provided.\r\n\
\t\tif ( typeof plural === 'string' ) return plural;\r\n\
\r\n\
\t\tvar lowerWord = word.toLowerCase();\r\n\
\r\n\
\t\t// user defined rules have the highest priority.\r\n\
\t\tif ( lowerWord in userDefined ) {\r\n\
\t\t\treturn capitalizeSame(userDefined[lowerWord], word);\r\n\
\t\t}\r\n\
\r\n\
\t\t// single letters are pluralized with 's, \"I got five A's on\r\n\
\t\t// my report card.\"\r\n\
\t\tif ( word.match(/^[A-Z]$/) ) return word + \"'s\";\r\n\
\r\n\
\t\t// some word don't change form when plural.\r\n\
\t\tif ( word.match(/fish$|ois$|sheep$|deer$|pox$|itis$/i) ) return word;\r\n\
\t\tif ( word.match(/^[A-Z][a-z]*ese$/) ) return word;  // Nationalities.\r\n\
\t\tif ( lowerWord in uninflected ) return word;\r\n\
\r\n\
\t\t// there's a known set of words with irregular plural forms.\r\n\
\t\tif ( lowerWord in irregular ) {\r\n\
\t\t\treturn capitalizeSame(irregular[lowerWord], word);\r\n\
\t\t}\r\n\
\t\t\r\n\
\t\t// try to pluralize the word depending on its suffix.\r\n\
\t\tvar suffixRulesLength = suffixRules.length;\r\n\
\t\tfor ( var i=0; i < suffixRulesLength; i++ ) {\r\n\
\t\t\tvar rule = suffixRules[i];\r\n\
\t\t\tif ( word.match(rule[0]) ) {\r\n\
\t\t\t\treturn word.replace(rule[0], rule[1]);\r\n\
\t\t\t}\r\n\
\t\t}\r\n\
\r\n\
\t\t// if all else fails, just add s.\r\n\
\t\treturn word + 's';\r\n\
\t}\r\n\
\r\n\
\tpluralize.define = function(word, plural) {\r\n\
\t\tuserDefined[word.toLowerCase()] = plural;\r\n\
\t}\r\n\
\r\n\
\treturn pluralize;\r\n\
\r\n\
})();\r\n\
\n\
//# sourceURL=vendor/owl/pluralize.js"
));

require.register("indemma/vendor/spec/sinon.js", Function("exports, module",
"/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/\n\
/*global module, require, __dirname, document*/\n\
/**\n\
 * Sinon core utilities. For internal use only.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
var sinon = (function (formatio) {\n\
    var div = typeof document != \"undefined\" && document.createElement(\"div\");\n\
    var hasOwn = Object.prototype.hasOwnProperty;\n\
\n\
    function isDOMNode(obj) {\n\
        var success = false;\n\
\n\
        try {\n\
            obj.appendChild(div);\n\
            success = div.parentNode == obj;\n\
        } catch (e) {\n\
            return false;\n\
        } finally {\n\
            try {\n\
                obj.removeChild(div);\n\
            } catch (e) {\n\
                // Remove failed, not much we can do about that\n\
            }\n\
        }\n\
\n\
        return success;\n\
    }\n\
\n\
    function isElement(obj) {\n\
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);\n\
    }\n\
\n\
    function isFunction(obj) {\n\
        return typeof obj === \"function\" || !!(obj && obj.constructor && obj.call && obj.apply);\n\
    }\n\
\n\
    function isReallyNaN(val) {\n\
        return typeof val === 'number' && isNaN(val);\n\
    }\n\
\n\
    function mirrorProperties(target, source) {\n\
        for (var prop in source) {\n\
            if (!hasOwn.call(target, prop)) {\n\
                target[prop] = source[prop];\n\
            }\n\
        }\n\
    }\n\
\n\
    function isRestorable (obj) {\n\
        return typeof obj === \"function\" && typeof obj.restore === \"function\" && obj.restore.sinon;\n\
    }\n\
\n\
    var sinon = {\n\
        wrapMethod: function wrapMethod(object, property, method) {\n\
            if (!object) {\n\
                throw new TypeError(\"Should wrap property of object\");\n\
            }\n\
\n\
            if (typeof method != \"function\") {\n\
                throw new TypeError(\"Method wrapper should be function\");\n\
            }\n\
\n\
            var wrappedMethod = object[property],\n\
                error;\n\
\n\
            if (!isFunction(wrappedMethod)) {\n\
                error = new TypeError(\"Attempted to wrap \" + (typeof wrappedMethod) + \" property \" +\n\
                                    property + \" as function\");\n\
            } else if (wrappedMethod.restore && wrappedMethod.restore.sinon) {\n\
                error = new TypeError(\"Attempted to wrap \" + property + \" which is already wrapped\");\n\
            } else if (wrappedMethod.calledBefore) {\n\
                var verb = !!wrappedMethod.returns ? \"stubbed\" : \"spied on\";\n\
                error = new TypeError(\"Attempted to wrap \" + property + \" which is already \" + verb);\n\
            }\n\
\n\
            if (error) {\n\
                if (wrappedMethod && wrappedMethod._stack) {\n\
                    error.stack += '\\n\
--------------\\n\
' + wrappedMethod._stack;\n\
                }\n\
                throw error;\n\
            }\n\
\n\
            // IE 8 does not support hasOwnProperty on the window object and Firefox has a problem\n\
            // when using hasOwn.call on objects from other frames.\n\
            var owned = object.hasOwnProperty ? object.hasOwnProperty(property) : hasOwn.call(object, property);\n\
            object[property] = method;\n\
            method.displayName = property;\n\
            // Set up a stack trace which can be used later to find what line of\n\
            // code the original method was created on.\n\
            method._stack = (new Error('Stack Trace for original')).stack;\n\
\n\
            method.restore = function () {\n\
                // For prototype properties try to reset by delete first.\n\
                // If this fails (ex: localStorage on mobile safari) then force a reset\n\
                // via direct assignment.\n\
                if (!owned) {\n\
                    delete object[property];\n\
                }\n\
                if (object[property] === method) {\n\
                    object[property] = wrappedMethod;\n\
                }\n\
            };\n\
\n\
            method.restore.sinon = true;\n\
            mirrorProperties(method, wrappedMethod);\n\
\n\
            return method;\n\
        },\n\
\n\
        extend: function extend(target) {\n\
            for (var i = 1, l = arguments.length; i < l; i += 1) {\n\
                for (var prop in arguments[i]) {\n\
                    if (arguments[i].hasOwnProperty(prop)) {\n\
                        target[prop] = arguments[i][prop];\n\
                    }\n\
\n\
                    // DONT ENUM bug, only care about toString\n\
                    if (arguments[i].hasOwnProperty(\"toString\") &&\n\
                        arguments[i].toString != target.toString) {\n\
                        target.toString = arguments[i].toString;\n\
                    }\n\
                }\n\
            }\n\
\n\
            return target;\n\
        },\n\
\n\
        create: function create(proto) {\n\
            var F = function () {};\n\
            F.prototype = proto;\n\
            return new F();\n\
        },\n\
\n\
        deepEqual: function deepEqual(a, b) {\n\
            if (sinon.match && sinon.match.isMatcher(a)) {\n\
                return a.test(b);\n\
            }\n\
\n\
            if (typeof a != 'object' || typeof b != 'object') {\n\
                if (isReallyNaN(a) && isReallyNaN(b)) {\n\
                    return true;\n\
                } else {\n\
                    return a === b;\n\
                }\n\
            }\n\
\n\
            if (isElement(a) || isElement(b)) {\n\
                return a === b;\n\
            }\n\
\n\
            if (a === b) {\n\
                return true;\n\
            }\n\
\n\
            if ((a === null && b !== null) || (a !== null && b === null)) {\n\
                return false;\n\
            }\n\
\n\
            if (a instanceof RegExp && b instanceof RegExp) {\n\
              return (a.source === b.source) && (a.global === b.global) &&\n\
                (a.ignoreCase === b.ignoreCase) && (a.multiline === b.multiline);\n\
            }\n\
\n\
            var aString = Object.prototype.toString.call(a);\n\
            if (aString != Object.prototype.toString.call(b)) {\n\
                return false;\n\
            }\n\
\n\
            if (aString == \"[object Date]\") {\n\
                return a.valueOf() === b.valueOf();\n\
            }\n\
\n\
            var prop, aLength = 0, bLength = 0;\n\
\n\
            if (aString == \"[object Array]\" && a.length !== b.length) {\n\
                return false;\n\
            }\n\
\n\
            for (prop in a) {\n\
                aLength += 1;\n\
\n\
                if (!(prop in b)) {\n\
                    return false;\n\
                }\n\
\n\
                if (!deepEqual(a[prop], b[prop])) {\n\
                    return false;\n\
                }\n\
            }\n\
\n\
            for (prop in b) {\n\
                bLength += 1;\n\
            }\n\
\n\
            return aLength == bLength;\n\
        },\n\
\n\
        functionName: function functionName(func) {\n\
            var name = func.displayName || func.name;\n\
\n\
            // Use function decomposition as a last resort to get function\n\
            // name. Does not rely on function decomposition to work - if it\n\
            // doesn't debugging will be slightly less informative\n\
            // (i.e. toString will say 'spy' rather than 'myFunc').\n\
            if (!name) {\n\
                var matches = func.toString().match(/function ([^\\s\\(]+)/);\n\
                name = matches && matches[1];\n\
            }\n\
\n\
            return name;\n\
        },\n\
\n\
        functionToString: function toString() {\n\
            if (this.getCall && this.callCount) {\n\
                var thisValue, prop, i = this.callCount;\n\
\n\
                while (i--) {\n\
                    thisValue = this.getCall(i).thisValue;\n\
\n\
                    for (prop in thisValue) {\n\
                        if (thisValue[prop] === this) {\n\
                            return prop;\n\
                        }\n\
                    }\n\
                }\n\
            }\n\
\n\
            return this.displayName || \"sinon fake\";\n\
        },\n\
\n\
        getConfig: function (custom) {\n\
            var config = {};\n\
            custom = custom || {};\n\
            var defaults = sinon.defaultConfig;\n\
\n\
            for (var prop in defaults) {\n\
                if (defaults.hasOwnProperty(prop)) {\n\
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];\n\
                }\n\
            }\n\
\n\
            return config;\n\
        },\n\
\n\
        format: function (val) {\n\
            return \"\" + val;\n\
        },\n\
\n\
        defaultConfig: {\n\
            injectIntoThis: true,\n\
            injectInto: null,\n\
            properties: [\"spy\", \"stub\", \"mock\", \"clock\", \"server\", \"requests\"],\n\
            useFakeTimers: true,\n\
            useFakeServer: true\n\
        },\n\
\n\
        timesInWords: function timesInWords(count) {\n\
            return count == 1 && \"once\" ||\n\
                count == 2 && \"twice\" ||\n\
                count == 3 && \"thrice\" ||\n\
                (count || 0) + \" times\";\n\
        },\n\
\n\
        calledInOrder: function (spies) {\n\
            for (var i = 1, l = spies.length; i < l; i++) {\n\
                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {\n\
                    return false;\n\
                }\n\
            }\n\
\n\
            return true;\n\
        },\n\
\n\
        orderByFirstCall: function (spies) {\n\
            return spies.sort(function (a, b) {\n\
                // uuid, won't ever be equal\n\
                var aCall = a.getCall(0);\n\
                var bCall = b.getCall(0);\n\
                var aId = aCall && aCall.callId || -1;\n\
                var bId = bCall && bCall.callId || -1;\n\
\n\
                return aId < bId ? -1 : 1;\n\
            });\n\
        },\n\
\n\
        log: function () {},\n\
\n\
        logError: function (label, err) {\n\
            var msg = label + \" threw exception: \";\n\
            sinon.log(msg + \"[\" + err.name + \"] \" + err.message);\n\
            if (err.stack) { sinon.log(err.stack); }\n\
\n\
            setTimeout(function () {\n\
                err.message = msg + err.message;\n\
                throw err;\n\
            }, 0);\n\
        },\n\
\n\
        typeOf: function (value) {\n\
            if (value === null) {\n\
                return \"null\";\n\
            }\n\
            else if (value === undefined) {\n\
                return \"undefined\";\n\
            }\n\
            var string = Object.prototype.toString.call(value);\n\
            return string.substring(8, string.length - 1).toLowerCase();\n\
        },\n\
\n\
        createStubInstance: function (constructor) {\n\
            if (typeof constructor !== \"function\") {\n\
                throw new TypeError(\"The constructor should be a function.\");\n\
            }\n\
            return sinon.stub(sinon.create(constructor.prototype));\n\
        },\n\
\n\
        restore: function (object) {\n\
            if (object !== null && typeof object === \"object\") {\n\
                for (var prop in object) {\n\
                    if (isRestorable(object[prop])) {\n\
                        object[prop].restore();\n\
                    }\n\
                }\n\
            }\n\
            else if (isRestorable(object)) {\n\
                object.restore();\n\
            }\n\
        }\n\
    };\n\
\n\
    var isNode = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
    var isAMD = typeof define === 'function' && typeof define.amd === 'object' && define.amd;\n\
\n\
    function makePublicAPI(require, exports, module) {\n\
        module.exports = sinon;\n\
        sinon.spy = require(\"indemma/vendor/spec/sinon/spy.js\");\n\
        sinon.spyCall = require(\"indemma/vendor/spec/sinon/call.js\");\n\
        sinon.behavior = require(\"indemma/vendor/spec/sinon/behavior.js\");\n\
        sinon.stub = require(\"indemma/vendor/spec/sinon/stub.js\");\n\
        sinon.mock = require(\"indemma/vendor/spec/sinon/mock.js\");\n\
        sinon.collection = require(\"indemma/vendor/spec/sinon/collection.js\");\n\
        sinon.assert = require(\"indemma/vendor/spec/sinon/assert.js\");\n\
        sinon.sandbox = require(\"indemma/vendor/spec/sinon/sandbox.js\");\n\
        sinon.test = require(\"indemma/vendor/spec/sinon/test.js\");\n\
        sinon.testCase = require(\"indemma/vendor/spec/sinon/test_case.js\");\n\
        sinon.match = require(\"indemma/vendor/spec/sinon/match.js\");\n\
    }\n\
\n\
    if (isAMD) {\n\
        define(makePublicAPI);\n\
    } else if (isNode) {\n\
        try {\n\
            formatio = require(\"formatio\");\n\
        } catch (e) {}\n\
        makePublicAPI(require, exports, module);\n\
    }\n\
\n\
    if (formatio) {\n\
        var formatter = formatio.configure({ quoteStrings: false });\n\
        sinon.format = function () {\n\
            return formatter.ascii.apply(formatter, arguments);\n\
        };\n\
    } else if (isNode) {\n\
        try {\n\
            var util = require(\"util\");\n\
            sinon.format = function (value) {\n\
                return typeof value == \"object\" && value.toString === Object.prototype.toString ? util.inspect(value) : value;\n\
            };\n\
        } catch (e) {\n\
            /* Node, but no util module - would be very old, but better safe than\n\
             sorry */\n\
        }\n\
    }\n\
\n\
    return sinon;\n\
}(typeof formatio == \"object\" && formatio));\n\
\n\
//# sourceURL=vendor/spec/sinon.js"
));

require.register("indemma/vendor/spec/sinon/assert.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 * @depend stub.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false, nomen: false, plusplus: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
 * Assertions matching the test spy retrieval interface.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon, global) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
    var slice = Array.prototype.slice;\n\
    var assert;\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    function verifyIsStub() {\n\
        var method;\n\
\n\
        for (var i = 0, l = arguments.length; i < l; ++i) {\n\
            method = arguments[i];\n\
\n\
            if (!method) {\n\
                assert.fail(\"fake is not a spy\");\n\
            }\n\
\n\
            if (typeof method != \"function\") {\n\
                assert.fail(method + \" is not a function\");\n\
            }\n\
\n\
            if (typeof method.getCall != \"function\") {\n\
                assert.fail(method + \" is not stubbed\");\n\
            }\n\
        }\n\
    }\n\
\n\
    function failAssertion(object, msg) {\n\
        object = object || global;\n\
        var failMethod = object.fail || assert.fail;\n\
        failMethod.call(object, msg);\n\
    }\n\
\n\
    function mirrorPropAsAssertion(name, method, message) {\n\
        if (arguments.length == 2) {\n\
            message = method;\n\
            method = name;\n\
        }\n\
\n\
        assert[name] = function (fake) {\n\
            verifyIsStub(fake);\n\
\n\
            var args = slice.call(arguments, 1);\n\
            var failed = false;\n\
\n\
            if (typeof method == \"function\") {\n\
                failed = !method(fake);\n\
            } else {\n\
                failed = typeof fake[method] == \"function\" ?\n\
                    !fake[method].apply(fake, args) : !fake[method];\n\
            }\n\
\n\
            if (failed) {\n\
                failAssertion(this, fake.printf.apply(fake, [message].concat(args)));\n\
            } else {\n\
                assert.pass(name);\n\
            }\n\
        };\n\
    }\n\
\n\
    function exposedName(prefix, prop) {\n\
        return !prefix || /^fail/.test(prop) ? prop :\n\
            prefix + prop.slice(0, 1).toUpperCase() + prop.slice(1);\n\
    }\n\
\n\
    assert = {\n\
        failException: \"AssertError\",\n\
\n\
        fail: function fail(message) {\n\
            var error = new Error(message);\n\
            error.name = this.failException || assert.failException;\n\
\n\
            throw error;\n\
        },\n\
\n\
        pass: function pass(assertion) {},\n\
\n\
        callOrder: function assertCallOrder() {\n\
            verifyIsStub.apply(null, arguments);\n\
            var expected = \"\", actual = \"\";\n\
\n\
            if (!sinon.calledInOrder(arguments)) {\n\
                try {\n\
                    expected = [].join.call(arguments, \", \");\n\
                    var calls = slice.call(arguments);\n\
                    var i = calls.length;\n\
                    while (i) {\n\
                        if (!calls[--i].called) {\n\
                            calls.splice(i, 1);\n\
                        }\n\
                    }\n\
                    actual = sinon.orderByFirstCall(calls).join(\", \");\n\
                } catch (e) {\n\
                    // If this fails, we'll just fall back to the blank string\n\
                }\n\
\n\
                failAssertion(this, \"expected \" + expected + \" to be \" +\n\
                              \"called in order but were called as \" + actual);\n\
            } else {\n\
                assert.pass(\"callOrder\");\n\
            }\n\
        },\n\
\n\
        callCount: function assertCallCount(method, count) {\n\
            verifyIsStub(method);\n\
\n\
            if (method.callCount != count) {\n\
                var msg = \"expected %n to be called \" + sinon.timesInWords(count) +\n\
                    \" but was called %c%C\";\n\
                failAssertion(this, method.printf(msg));\n\
            } else {\n\
                assert.pass(\"callCount\");\n\
            }\n\
        },\n\
\n\
        expose: function expose(target, options) {\n\
            if (!target) {\n\
                throw new TypeError(\"target is null or undefined\");\n\
            }\n\
\n\
            var o = options || {};\n\
            var prefix = typeof o.prefix == \"undefined\" && \"assert\" || o.prefix;\n\
            var includeFail = typeof o.includeFail == \"undefined\" || !!o.includeFail;\n\
\n\
            for (var method in this) {\n\
                if (method != \"export\" && (includeFail || !/^(fail)/.test(method))) {\n\
                    target[exposedName(prefix, method)] = this[method];\n\
                }\n\
            }\n\
\n\
            return target;\n\
        },\n\
\n\
        match: function match(actual, expectation) {\n\
            var matcher = sinon.match(expectation);\n\
            if (matcher.test(actual)) {\n\
                assert.pass(\"match\");\n\
            } else {\n\
                var formatted = [\n\
                    \"expected value to match\",\n\
                    \"    expected = \" + sinon.format(expectation),\n\
                    \"    actual = \" + sinon.format(actual)\n\
                ]\n\
                failAssertion(this, formatted.join(\"\\n\
\"));\n\
            }\n\
        }\n\
    };\n\
\n\
    mirrorPropAsAssertion(\"called\", \"expected %n to have been called at least once but was never called\");\n\
    mirrorPropAsAssertion(\"notCalled\", function (spy) { return !spy.called; },\n\
                          \"expected %n to not have been called but was called %c%C\");\n\
    mirrorPropAsAssertion(\"calledOnce\", \"expected %n to be called once but was called %c%C\");\n\
    mirrorPropAsAssertion(\"calledTwice\", \"expected %n to be called twice but was called %c%C\");\n\
    mirrorPropAsAssertion(\"calledThrice\", \"expected %n to be called thrice but was called %c%C\");\n\
    mirrorPropAsAssertion(\"calledOn\", \"expected %n to be called with %1 as this but was called with %t\");\n\
    mirrorPropAsAssertion(\"alwaysCalledOn\", \"expected %n to always be called with %1 as this but was called with %t\");\n\
    mirrorPropAsAssertion(\"calledWithNew\", \"expected %n to be called with new\");\n\
    mirrorPropAsAssertion(\"alwaysCalledWithNew\", \"expected %n to always be called with new\");\n\
    mirrorPropAsAssertion(\"calledWith\", \"expected %n to be called with arguments %*%C\");\n\
    mirrorPropAsAssertion(\"calledWithMatch\", \"expected %n to be called with match %*%C\");\n\
    mirrorPropAsAssertion(\"alwaysCalledWith\", \"expected %n to always be called with arguments %*%C\");\n\
    mirrorPropAsAssertion(\"alwaysCalledWithMatch\", \"expected %n to always be called with match %*%C\");\n\
    mirrorPropAsAssertion(\"calledWithExactly\", \"expected %n to be called with exact arguments %*%C\");\n\
    mirrorPropAsAssertion(\"alwaysCalledWithExactly\", \"expected %n to always be called with exact arguments %*%C\");\n\
    mirrorPropAsAssertion(\"neverCalledWith\", \"expected %n to never be called with arguments %*%C\");\n\
    mirrorPropAsAssertion(\"neverCalledWithMatch\", \"expected %n to never be called with match %*%C\");\n\
    mirrorPropAsAssertion(\"threw\", \"%n did not throw exception%C\");\n\
    mirrorPropAsAssertion(\"alwaysThrew\", \"%n did not always throw exception%C\");\n\
\n\
    sinon.assert = assert;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = assert; });\n\
    } else if (commonJSModule) {\n\
        module.exports = assert;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null, typeof window != \"undefined\" ? window : (typeof self != \"undefined\") ? self : global));\n\
\n\
//# sourceURL=vendor/spec/sinon/assert.js"
));

require.register("indemma/vendor/spec/sinon/behavior.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false*/\n\
/*global module, require, sinon, process, setImmediate, setTimeout*/\n\
/**\n\
 * Stub behavior\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @author Tim Fischbach (mail@timfischbach.de)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    var slice = Array.prototype.slice;\n\
    var join = Array.prototype.join;\n\
    var proto;\n\
\n\
    var nextTick = (function () {\n\
        if (typeof process === \"object\" && typeof process.nextTick === \"function\") {\n\
            return process.nextTick;\n\
        } else if (typeof setImmediate === \"function\") {\n\
            return setImmediate;\n\
        } else {\n\
            return function (callback) {\n\
                setTimeout(callback, 0);\n\
            };\n\
        }\n\
    })();\n\
\n\
    function throwsException(error, message) {\n\
        if (typeof error == \"string\") {\n\
            this.exception = new Error(message || \"\");\n\
            this.exception.name = error;\n\
        } else if (!error) {\n\
            this.exception = new Error(\"Error\");\n\
        } else {\n\
            this.exception = error;\n\
        }\n\
\n\
        return this;\n\
    }\n\
\n\
    function getCallback(behavior, args) {\n\
        var callArgAt = behavior.callArgAt;\n\
\n\
        if (callArgAt < 0) {\n\
            var callArgProp = behavior.callArgProp;\n\
\n\
            for (var i = 0, l = args.length; i < l; ++i) {\n\
                if (!callArgProp && typeof args[i] == \"function\") {\n\
                    return args[i];\n\
                }\n\
\n\
                if (callArgProp && args[i] &&\n\
                    typeof args[i][callArgProp] == \"function\") {\n\
                    return args[i][callArgProp];\n\
                }\n\
            }\n\
\n\
            return null;\n\
        }\n\
\n\
        return args[callArgAt];\n\
    }\n\
\n\
    function getCallbackError(behavior, func, args) {\n\
        if (behavior.callArgAt < 0) {\n\
            var msg;\n\
\n\
            if (behavior.callArgProp) {\n\
                msg = sinon.functionName(behavior.stub) +\n\
                    \" expected to yield to '\" + behavior.callArgProp +\n\
                    \"', but no object with such a property was passed.\";\n\
            } else {\n\
                msg = sinon.functionName(behavior.stub) +\n\
                    \" expected to yield, but no callback was passed.\";\n\
            }\n\
\n\
            if (args.length > 0) {\n\
                msg += \" Received [\" + join.call(args, \", \") + \"]\";\n\
            }\n\
\n\
            return msg;\n\
        }\n\
\n\
        return \"argument at index \" + behavior.callArgAt + \" is not a function: \" + func;\n\
    }\n\
\n\
    function callCallback(behavior, args) {\n\
        if (typeof behavior.callArgAt == \"number\") {\n\
            var func = getCallback(behavior, args);\n\
\n\
            if (typeof func != \"function\") {\n\
                throw new TypeError(getCallbackError(behavior, func, args));\n\
            }\n\
\n\
            if (behavior.callbackAsync) {\n\
                nextTick(function() {\n\
                    func.apply(behavior.callbackContext, behavior.callbackArguments);\n\
                });\n\
            } else {\n\
                func.apply(behavior.callbackContext, behavior.callbackArguments);\n\
            }\n\
        }\n\
    }\n\
\n\
    proto = {\n\
        create: function(stub) {\n\
            var behavior = sinon.extend({}, sinon.behavior);\n\
            delete behavior.create;\n\
            behavior.stub = stub;\n\
\n\
            return behavior;\n\
        },\n\
\n\
        isPresent: function() {\n\
            return (typeof this.callArgAt == 'number' ||\n\
                    this.exception ||\n\
                    typeof this.returnArgAt == 'number' ||\n\
                    this.returnThis ||\n\
                    this.returnValueDefined);\n\
        },\n\
\n\
        invoke: function(context, args) {\n\
            callCallback(this, args);\n\
\n\
            if (this.exception) {\n\
                throw this.exception;\n\
            } else if (typeof this.returnArgAt == 'number') {\n\
                return args[this.returnArgAt];\n\
            } else if (this.returnThis) {\n\
                return context;\n\
            }\n\
\n\
            return this.returnValue;\n\
        },\n\
\n\
        onCall: function(index) {\n\
            return this.stub.onCall(index);\n\
        },\n\
\n\
        onFirstCall: function() {\n\
            return this.stub.onFirstCall();\n\
        },\n\
\n\
        onSecondCall: function() {\n\
            return this.stub.onSecondCall();\n\
        },\n\
\n\
        onThirdCall: function() {\n\
            return this.stub.onThirdCall();\n\
        },\n\
\n\
        withArgs: function(/* arguments */) {\n\
            throw new Error('Defining a stub by invoking \"stub.onCall(...).withArgs(...)\" is not supported. ' +\n\
                            'Use \"stub.withArgs(...).onCall(...)\" to define sequential behavior for calls with certain arguments.');\n\
        },\n\
\n\
        callsArg: function callsArg(pos) {\n\
            if (typeof pos != \"number\") {\n\
                throw new TypeError(\"argument index is not number\");\n\
            }\n\
\n\
            this.callArgAt = pos;\n\
            this.callbackArguments = [];\n\
            this.callbackContext = undefined;\n\
            this.callArgProp = undefined;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
        callsArgOn: function callsArgOn(pos, context) {\n\
            if (typeof pos != \"number\") {\n\
                throw new TypeError(\"argument index is not number\");\n\
            }\n\
            if (typeof context != \"object\") {\n\
                throw new TypeError(\"argument context is not an object\");\n\
            }\n\
\n\
            this.callArgAt = pos;\n\
            this.callbackArguments = [];\n\
            this.callbackContext = context;\n\
            this.callArgProp = undefined;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
        callsArgWith: function callsArgWith(pos) {\n\
            if (typeof pos != \"number\") {\n\
                throw new TypeError(\"argument index is not number\");\n\
            }\n\
\n\
            this.callArgAt = pos;\n\
            this.callbackArguments = slice.call(arguments, 1);\n\
            this.callbackContext = undefined;\n\
            this.callArgProp = undefined;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
        callsArgOnWith: function callsArgWith(pos, context) {\n\
            if (typeof pos != \"number\") {\n\
                throw new TypeError(\"argument index is not number\");\n\
            }\n\
            if (typeof context != \"object\") {\n\
                throw new TypeError(\"argument context is not an object\");\n\
            }\n\
\n\
            this.callArgAt = pos;\n\
            this.callbackArguments = slice.call(arguments, 2);\n\
            this.callbackContext = context;\n\
            this.callArgProp = undefined;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
        yields: function () {\n\
            this.callArgAt = -1;\n\
            this.callbackArguments = slice.call(arguments, 0);\n\
            this.callbackContext = undefined;\n\
            this.callArgProp = undefined;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
        yieldsOn: function (context) {\n\
            if (typeof context != \"object\") {\n\
                throw new TypeError(\"argument context is not an object\");\n\
            }\n\
\n\
            this.callArgAt = -1;\n\
            this.callbackArguments = slice.call(arguments, 1);\n\
            this.callbackContext = context;\n\
            this.callArgProp = undefined;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
        yieldsTo: function (prop) {\n\
            this.callArgAt = -1;\n\
            this.callbackArguments = slice.call(arguments, 1);\n\
            this.callbackContext = undefined;\n\
            this.callArgProp = prop;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
        yieldsToOn: function (prop, context) {\n\
            if (typeof context != \"object\") {\n\
                throw new TypeError(\"argument context is not an object\");\n\
            }\n\
\n\
            this.callArgAt = -1;\n\
            this.callbackArguments = slice.call(arguments, 2);\n\
            this.callbackContext = context;\n\
            this.callArgProp = prop;\n\
            this.callbackAsync = false;\n\
\n\
            return this;\n\
        },\n\
\n\
\n\
        \"throws\": throwsException,\n\
        throwsException: throwsException,\n\
\n\
        returns: function returns(value) {\n\
            this.returnValue = value;\n\
            this.returnValueDefined = true;\n\
\n\
            return this;\n\
        },\n\
\n\
        returnsArg: function returnsArg(pos) {\n\
            if (typeof pos != \"number\") {\n\
                throw new TypeError(\"argument index is not number\");\n\
            }\n\
\n\
            this.returnArgAt = pos;\n\
\n\
            return this;\n\
        },\n\
\n\
        returnsThis: function returnsThis() {\n\
            this.returnThis = true;\n\
\n\
            return this;\n\
        }\n\
    };\n\
\n\
    // create asynchronous versions of callsArg* and yields* methods\n\
    for (var method in proto) {\n\
        // need to avoid creating anotherasync versions of the newly added async methods\n\
        if (proto.hasOwnProperty(method) &&\n\
            method.match(/^(callsArg|yields)/) &&\n\
            !method.match(/Async/)) {\n\
            proto[method + 'Async'] = (function (syncFnName) {\n\
                return function () {\n\
                    var result = this[syncFnName].apply(this, arguments);\n\
                    this.callbackAsync = true;\n\
                    return result;\n\
                };\n\
            })(method);\n\
        }\n\
    }\n\
\n\
    sinon.behavior = proto;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = proto; });\n\
    } else if (commonJSModule) {\n\
        module.exports = proto;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/behavior.js"
));

require.register("indemma/vendor/spec/sinon/call.js", Function("exports, module",
"/**\n\
  * @depend ../sinon.js\n\
  * @depend match.js\n\
  */\n\
/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
  * Spy calls\n\
  *\n\
  * @author Christian Johansen (christian@cjohansen.no)\n\
  * @author Maximilian Antoni (mail@maxantoni.de)\n\
  * @license BSD\n\
  *\n\
  * Copyright (c) 2010-2013 Christian Johansen\n\
  * Copyright (c) 2013 Maximilian Antoni\n\
  */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    function throwYieldError(proxy, text, args) {\n\
        var msg = sinon.functionName(proxy) + text;\n\
        if (args.length) {\n\
            msg += \" Received [\" + slice.call(args).join(\", \") + \"]\";\n\
        }\n\
        throw new Error(msg);\n\
    }\n\
\n\
    var slice = Array.prototype.slice;\n\
\n\
    var callProto = {\n\
        calledOn: function calledOn(thisValue) {\n\
            if (sinon.match && sinon.match.isMatcher(thisValue)) {\n\
                return thisValue.test(this.thisValue);\n\
            }\n\
            return this.thisValue === thisValue;\n\
        },\n\
\n\
        calledWith: function calledWith() {\n\
            for (var i = 0, l = arguments.length; i < l; i += 1) {\n\
                if (!sinon.deepEqual(arguments[i], this.args[i])) {\n\
                    return false;\n\
                }\n\
            }\n\
\n\
            return true;\n\
        },\n\
\n\
        calledWithMatch: function calledWithMatch() {\n\
            for (var i = 0, l = arguments.length; i < l; i += 1) {\n\
                var actual = this.args[i];\n\
                var expectation = arguments[i];\n\
                if (!sinon.match || !sinon.match(expectation).test(actual)) {\n\
                    return false;\n\
                }\n\
            }\n\
            return true;\n\
        },\n\
\n\
        calledWithExactly: function calledWithExactly() {\n\
            return arguments.length == this.args.length &&\n\
                this.calledWith.apply(this, arguments);\n\
        },\n\
\n\
        notCalledWith: function notCalledWith() {\n\
            return !this.calledWith.apply(this, arguments);\n\
        },\n\
\n\
        notCalledWithMatch: function notCalledWithMatch() {\n\
            return !this.calledWithMatch.apply(this, arguments);\n\
        },\n\
\n\
        returned: function returned(value) {\n\
            return sinon.deepEqual(value, this.returnValue);\n\
        },\n\
\n\
        threw: function threw(error) {\n\
            if (typeof error === \"undefined\" || !this.exception) {\n\
                return !!this.exception;\n\
            }\n\
\n\
            return this.exception === error || this.exception.name === error;\n\
        },\n\
\n\
        calledWithNew: function calledWithNew() {\n\
            return this.proxy.prototype && this.thisValue instanceof this.proxy;\n\
        },\n\
\n\
        calledBefore: function (other) {\n\
            return this.callId < other.callId;\n\
        },\n\
\n\
        calledAfter: function (other) {\n\
            return this.callId > other.callId;\n\
        },\n\
\n\
        callArg: function (pos) {\n\
            this.args[pos]();\n\
        },\n\
\n\
        callArgOn: function (pos, thisValue) {\n\
            this.args[pos].apply(thisValue);\n\
        },\n\
\n\
        callArgWith: function (pos) {\n\
            this.callArgOnWith.apply(this, [pos, null].concat(slice.call(arguments, 1)));\n\
        },\n\
\n\
        callArgOnWith: function (pos, thisValue) {\n\
            var args = slice.call(arguments, 2);\n\
            this.args[pos].apply(thisValue, args);\n\
        },\n\
\n\
        \"yield\": function () {\n\
            this.yieldOn.apply(this, [null].concat(slice.call(arguments, 0)));\n\
        },\n\
\n\
        yieldOn: function (thisValue) {\n\
            var args = this.args;\n\
            for (var i = 0, l = args.length; i < l; ++i) {\n\
                if (typeof args[i] === \"function\") {\n\
                    args[i].apply(thisValue, slice.call(arguments, 1));\n\
                    return;\n\
                }\n\
            }\n\
            throwYieldError(this.proxy, \" cannot yield since no callback was passed.\", args);\n\
        },\n\
\n\
        yieldTo: function (prop) {\n\
            this.yieldToOn.apply(this, [prop, null].concat(slice.call(arguments, 1)));\n\
        },\n\
\n\
        yieldToOn: function (prop, thisValue) {\n\
            var args = this.args;\n\
            for (var i = 0, l = args.length; i < l; ++i) {\n\
                if (args[i] && typeof args[i][prop] === \"function\") {\n\
                    args[i][prop].apply(thisValue, slice.call(arguments, 2));\n\
                    return;\n\
                }\n\
            }\n\
            throwYieldError(this.proxy, \" cannot yield to '\" + prop +\n\
                \"' since no callback was passed.\", args);\n\
        },\n\
\n\
        toString: function () {\n\
            var callStr = this.proxy.toString() + \"(\";\n\
            var args = [];\n\
\n\
            for (var i = 0, l = this.args.length; i < l; ++i) {\n\
                args.push(sinon.format(this.args[i]));\n\
            }\n\
\n\
            callStr = callStr + args.join(\", \") + \")\";\n\
\n\
            if (typeof this.returnValue != \"undefined\") {\n\
                callStr += \" => \" + sinon.format(this.returnValue);\n\
            }\n\
\n\
            if (this.exception) {\n\
                callStr += \" !\" + this.exception.name;\n\
\n\
                if (this.exception.message) {\n\
                    callStr += \"(\" + this.exception.message + \")\";\n\
                }\n\
            }\n\
\n\
            return callStr;\n\
        }\n\
    };\n\
\n\
    callProto.invokeCallback = callProto.yield;\n\
\n\
    function createSpyCall(spy, thisValue, args, returnValue, exception, id) {\n\
        if (typeof id !== \"number\") {\n\
            throw new TypeError(\"Call id is not a number\");\n\
        }\n\
        var proxyCall = sinon.create(callProto);\n\
        proxyCall.proxy = spy;\n\
        proxyCall.thisValue = thisValue;\n\
        proxyCall.args = args;\n\
        proxyCall.returnValue = returnValue;\n\
        proxyCall.exception = exception;\n\
        proxyCall.callId = id;\n\
\n\
        return proxyCall;\n\
    }\n\
    createSpyCall.toString = callProto.toString; // used by mocks\n\
\n\
    sinon.spyCall = createSpyCall;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = createSpyCall; });\n\
    } else if (commonJSModule) {\n\
        module.exports = createSpyCall;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
\n\
//# sourceURL=vendor/spec/sinon/call.js"
));

require.register("indemma/vendor/spec/sinon/collection.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 * @depend stub.js\n\
 * @depend mock.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false, forin: true*/\n\
/*global module, require, sinon*/\n\
/**\n\
 * Collections of stubs, spies and mocks.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
    var push = [].push;\n\
    var hasOwnProperty = Object.prototype.hasOwnProperty;\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    function getFakes(fakeCollection) {\n\
        if (!fakeCollection.fakes) {\n\
            fakeCollection.fakes = [];\n\
        }\n\
\n\
        return fakeCollection.fakes;\n\
    }\n\
\n\
    function each(fakeCollection, method) {\n\
        var fakes = getFakes(fakeCollection);\n\
\n\
        for (var i = 0, l = fakes.length; i < l; i += 1) {\n\
            if (typeof fakes[i][method] == \"function\") {\n\
                fakes[i][method]();\n\
            }\n\
        }\n\
    }\n\
\n\
    function compact(fakeCollection) {\n\
        var fakes = getFakes(fakeCollection);\n\
        var i = 0;\n\
        while (i < fakes.length) {\n\
          fakes.splice(i, 1);\n\
        }\n\
    }\n\
\n\
    var collection = {\n\
        verify: function resolve() {\n\
            each(this, \"verify\");\n\
        },\n\
\n\
        restore: function restore() {\n\
            each(this, \"restore\");\n\
            compact(this);\n\
        },\n\
\n\
        verifyAndRestore: function verifyAndRestore() {\n\
            var exception;\n\
\n\
            try {\n\
                this.verify();\n\
            } catch (e) {\n\
                exception = e;\n\
            }\n\
\n\
            this.restore();\n\
\n\
            if (exception) {\n\
                throw exception;\n\
            }\n\
        },\n\
\n\
        add: function add(fake) {\n\
            push.call(getFakes(this), fake);\n\
            return fake;\n\
        },\n\
\n\
        spy: function spy() {\n\
            return this.add(sinon.spy.apply(sinon, arguments));\n\
        },\n\
\n\
        stub: function stub(object, property, value) {\n\
            if (property) {\n\
                var original = object[property];\n\
\n\
                if (typeof original != \"function\") {\n\
                    if (!hasOwnProperty.call(object, property)) {\n\
                        throw new TypeError(\"Cannot stub non-existent own property \" + property);\n\
                    }\n\
\n\
                    object[property] = value;\n\
\n\
                    return this.add({\n\
                        restore: function () {\n\
                            object[property] = original;\n\
                        }\n\
                    });\n\
                }\n\
            }\n\
            if (!property && !!object && typeof object == \"object\") {\n\
                var stubbedObj = sinon.stub.apply(sinon, arguments);\n\
\n\
                for (var prop in stubbedObj) {\n\
                    if (typeof stubbedObj[prop] === \"function\") {\n\
                        this.add(stubbedObj[prop]);\n\
                    }\n\
                }\n\
\n\
                return stubbedObj;\n\
            }\n\
\n\
            return this.add(sinon.stub.apply(sinon, arguments));\n\
        },\n\
\n\
        mock: function mock() {\n\
            return this.add(sinon.mock.apply(sinon, arguments));\n\
        },\n\
\n\
        inject: function inject(obj) {\n\
            var col = this;\n\
\n\
            obj.spy = function () {\n\
                return col.spy.apply(col, arguments);\n\
            };\n\
\n\
            obj.stub = function () {\n\
                return col.stub.apply(col, arguments);\n\
            };\n\
\n\
            obj.mock = function () {\n\
                return col.mock.apply(col, arguments);\n\
            };\n\
\n\
            return obj;\n\
        }\n\
    };\n\
\n\
    sinon.collection = collection;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = collection; });\n\
    } else if (commonJSModule) {\n\
        module.exports = collection;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/collection.js"
));

require.register("indemma/vendor/spec/sinon/match.js", Function("exports, module",
"/* @depend ../sinon.js */\n\
/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
 * Match functions\n\
 *\n\
 * @author Maximilian Antoni (mail@maxantoni.de)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2012 Maximilian Antoni\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    function assertType(value, type, name) {\n\
        var actual = sinon.typeOf(value);\n\
        if (actual !== type) {\n\
            throw new TypeError(\"Expected type of \" + name + \" to be \" +\n\
                type + \", but was \" + actual);\n\
        }\n\
    }\n\
\n\
    var matcher = {\n\
        toString: function () {\n\
            return this.message;\n\
        }\n\
    };\n\
\n\
    function isMatcher(object) {\n\
        return matcher.isPrototypeOf(object);\n\
    }\n\
\n\
    function matchObject(expectation, actual) {\n\
        if (actual === null || actual === undefined) {\n\
            return false;\n\
        }\n\
        for (var key in expectation) {\n\
            if (expectation.hasOwnProperty(key)) {\n\
                var exp = expectation[key];\n\
                var act = actual[key];\n\
                if (match.isMatcher(exp)) {\n\
                    if (!exp.test(act)) {\n\
                        return false;\n\
                    }\n\
                } else if (sinon.typeOf(exp) === \"object\") {\n\
                    if (!matchObject(exp, act)) {\n\
                        return false;\n\
                    }\n\
                } else if (!sinon.deepEqual(exp, act)) {\n\
                    return false;\n\
                }\n\
            }\n\
        }\n\
        return true;\n\
    }\n\
\n\
    matcher.or = function (m2) {\n\
        if (!arguments.length) {\n\
            throw new TypeError(\"Matcher expected\");\n\
        } else if (!isMatcher(m2)) {\n\
            m2 = match(m2);\n\
        }\n\
        var m1 = this;\n\
        var or = sinon.create(matcher);\n\
        or.test = function (actual) {\n\
            return m1.test(actual) || m2.test(actual);\n\
        };\n\
        or.message = m1.message + \".or(\" + m2.message + \")\";\n\
        return or;\n\
    };\n\
\n\
    matcher.and = function (m2) {\n\
        if (!arguments.length) {\n\
            throw new TypeError(\"Matcher expected\");\n\
        } else if (!isMatcher(m2)) {\n\
            m2 = match(m2);\n\
        }\n\
        var m1 = this;\n\
        var and = sinon.create(matcher);\n\
        and.test = function (actual) {\n\
            return m1.test(actual) && m2.test(actual);\n\
        };\n\
        and.message = m1.message + \".and(\" + m2.message + \")\";\n\
        return and;\n\
    };\n\
\n\
    var match = function (expectation, message) {\n\
        var m = sinon.create(matcher);\n\
        var type = sinon.typeOf(expectation);\n\
        switch (type) {\n\
        case \"object\":\n\
            if (typeof expectation.test === \"function\") {\n\
                m.test = function (actual) {\n\
                    return expectation.test(actual) === true;\n\
                };\n\
                m.message = \"match(\" + sinon.functionName(expectation.test) + \")\";\n\
                return m;\n\
            }\n\
            var str = [];\n\
            for (var key in expectation) {\n\
                if (expectation.hasOwnProperty(key)) {\n\
                    str.push(key + \": \" + expectation[key]);\n\
                }\n\
            }\n\
            m.test = function (actual) {\n\
                return matchObject(expectation, actual);\n\
            };\n\
            m.message = \"match(\" + str.join(\", \") + \")\";\n\
            break;\n\
        case \"number\":\n\
            m.test = function (actual) {\n\
                return expectation == actual;\n\
            };\n\
            break;\n\
        case \"string\":\n\
            m.test = function (actual) {\n\
                if (typeof actual !== \"string\") {\n\
                    return false;\n\
                }\n\
                return actual.indexOf(expectation) !== -1;\n\
            };\n\
            m.message = \"match(\\\"\" + expectation + \"\\\")\";\n\
            break;\n\
        case \"regexp\":\n\
            m.test = function (actual) {\n\
                if (typeof actual !== \"string\") {\n\
                    return false;\n\
                }\n\
                return expectation.test(actual);\n\
            };\n\
            break;\n\
        case \"function\":\n\
            m.test = expectation;\n\
            if (message) {\n\
                m.message = message;\n\
            } else {\n\
                m.message = \"match(\" + sinon.functionName(expectation) + \")\";\n\
            }\n\
            break;\n\
        default:\n\
            m.test = function (actual) {\n\
              return sinon.deepEqual(expectation, actual);\n\
            };\n\
        }\n\
        if (!m.message) {\n\
            m.message = \"match(\" + expectation + \")\";\n\
        }\n\
        return m;\n\
    };\n\
\n\
    match.isMatcher = isMatcher;\n\
\n\
    match.any = match(function () {\n\
        return true;\n\
    }, \"any\");\n\
\n\
    match.defined = match(function (actual) {\n\
        return actual !== null && actual !== undefined;\n\
    }, \"defined\");\n\
\n\
    match.truthy = match(function (actual) {\n\
        return !!actual;\n\
    }, \"truthy\");\n\
\n\
    match.falsy = match(function (actual) {\n\
        return !actual;\n\
    }, \"falsy\");\n\
\n\
    match.same = function (expectation) {\n\
        return match(function (actual) {\n\
            return expectation === actual;\n\
        }, \"same(\" + expectation + \")\");\n\
    };\n\
\n\
    match.typeOf = function (type) {\n\
        assertType(type, \"string\", \"type\");\n\
        return match(function (actual) {\n\
            return sinon.typeOf(actual) === type;\n\
        }, \"typeOf(\\\"\" + type + \"\\\")\");\n\
    };\n\
\n\
    match.instanceOf = function (type) {\n\
        assertType(type, \"function\", \"type\");\n\
        return match(function (actual) {\n\
            return actual instanceof type;\n\
        }, \"instanceOf(\" + sinon.functionName(type) + \")\");\n\
    };\n\
\n\
    function createPropertyMatcher(propertyTest, messagePrefix) {\n\
        return function (property, value) {\n\
            assertType(property, \"string\", \"property\");\n\
            var onlyProperty = arguments.length === 1;\n\
            var message = messagePrefix + \"(\\\"\" + property + \"\\\"\";\n\
            if (!onlyProperty) {\n\
                message += \", \" + value;\n\
            }\n\
            message += \")\";\n\
            return match(function (actual) {\n\
                if (actual === undefined || actual === null ||\n\
                        !propertyTest(actual, property)) {\n\
                    return false;\n\
                }\n\
                return onlyProperty || sinon.deepEqual(value, actual[property]);\n\
            }, message);\n\
        };\n\
    }\n\
\n\
    match.has = createPropertyMatcher(function (actual, property) {\n\
        if (typeof actual === \"object\") {\n\
            return property in actual;\n\
        }\n\
        return actual[property] !== undefined;\n\
    }, \"has\");\n\
\n\
    match.hasOwn = createPropertyMatcher(function (actual, property) {\n\
        return actual.hasOwnProperty(property);\n\
    }, \"hasOwn\");\n\
\n\
    match.bool = match.typeOf(\"boolean\");\n\
    match.number = match.typeOf(\"number\");\n\
    match.string = match.typeOf(\"string\");\n\
    match.object = match.typeOf(\"object\");\n\
    match.func = match.typeOf(\"function\");\n\
    match.array = match.typeOf(\"array\");\n\
    match.regexp = match.typeOf(\"regexp\");\n\
    match.date = match.typeOf(\"date\");\n\
\n\
    sinon.match = match;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = match; });\n\
    } else if (commonJSModule) {\n\
        module.exports = match;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/match.js"
));

require.register("indemma/vendor/spec/sinon/mock.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 * @depend stub.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false, nomen: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
 * Mock functions.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
    var push = [].push;\n\
    var match;\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    match = sinon.match;\n\
\n\
    if (!match && commonJSModule) {\n\
        match = require(\"indemma/vendor/spec/sinon/match.js\");\n\
    }\n\
\n\
    function mock(object) {\n\
        if (!object) {\n\
            return sinon.expectation.create(\"Anonymous mock\");\n\
        }\n\
\n\
        return mock.create(object);\n\
    }\n\
\n\
    sinon.mock = mock;\n\
\n\
    sinon.extend(mock, (function () {\n\
        function each(collection, callback) {\n\
            if (!collection) {\n\
                return;\n\
            }\n\
\n\
            for (var i = 0, l = collection.length; i < l; i += 1) {\n\
                callback(collection[i]);\n\
            }\n\
        }\n\
\n\
        return {\n\
            create: function create(object) {\n\
                if (!object) {\n\
                    throw new TypeError(\"object is null\");\n\
                }\n\
\n\
                var mockObject = sinon.extend({}, mock);\n\
                mockObject.object = object;\n\
                delete mockObject.create;\n\
\n\
                return mockObject;\n\
            },\n\
\n\
            expects: function expects(method) {\n\
                if (!method) {\n\
                    throw new TypeError(\"method is falsy\");\n\
                }\n\
\n\
                if (!this.expectations) {\n\
                    this.expectations = {};\n\
                    this.proxies = [];\n\
                }\n\
\n\
                if (!this.expectations[method]) {\n\
                    this.expectations[method] = [];\n\
                    var mockObject = this;\n\
\n\
                    sinon.wrapMethod(this.object, method, function () {\n\
                        return mockObject.invokeMethod(method, this, arguments);\n\
                    });\n\
\n\
                    push.call(this.proxies, method);\n\
                }\n\
\n\
                var expectation = sinon.expectation.create(method);\n\
                push.call(this.expectations[method], expectation);\n\
\n\
                return expectation;\n\
            },\n\
\n\
            restore: function restore() {\n\
                var object = this.object;\n\
\n\
                each(this.proxies, function (proxy) {\n\
                    if (typeof object[proxy].restore == \"function\") {\n\
                        object[proxy].restore();\n\
                    }\n\
                });\n\
            },\n\
\n\
            verify: function verify() {\n\
                var expectations = this.expectations || {};\n\
                var messages = [], met = [];\n\
\n\
                each(this.proxies, function (proxy) {\n\
                    each(expectations[proxy], function (expectation) {\n\
                        if (!expectation.met()) {\n\
                            push.call(messages, expectation.toString());\n\
                        } else {\n\
                            push.call(met, expectation.toString());\n\
                        }\n\
                    });\n\
                });\n\
\n\
                this.restore();\n\
\n\
                if (messages.length > 0) {\n\
                    sinon.expectation.fail(messages.concat(met).join(\"\\n\
\"));\n\
                } else {\n\
                    sinon.expectation.pass(messages.concat(met).join(\"\\n\
\"));\n\
                }\n\
\n\
                return true;\n\
            },\n\
\n\
            invokeMethod: function invokeMethod(method, thisValue, args) {\n\
                var expectations = this.expectations && this.expectations[method];\n\
                var length = expectations && expectations.length || 0, i;\n\
\n\
                for (i = 0; i < length; i += 1) {\n\
                    if (!expectations[i].met() &&\n\
                        expectations[i].allowsCall(thisValue, args)) {\n\
                        return expectations[i].apply(thisValue, args);\n\
                    }\n\
                }\n\
\n\
                var messages = [], available, exhausted = 0;\n\
\n\
                for (i = 0; i < length; i += 1) {\n\
                    if (expectations[i].allowsCall(thisValue, args)) {\n\
                        available = available || expectations[i];\n\
                    } else {\n\
                        exhausted += 1;\n\
                    }\n\
                    push.call(messages, \"    \" + expectations[i].toString());\n\
                }\n\
\n\
                if (exhausted === 0) {\n\
                    return available.apply(thisValue, args);\n\
                }\n\
\n\
                messages.unshift(\"Unexpected call: \" + sinon.spyCall.toString.call({\n\
                    proxy: method,\n\
                    args: args\n\
                }));\n\
\n\
                sinon.expectation.fail(messages.join(\"\\n\
\"));\n\
            }\n\
        };\n\
    }()));\n\
\n\
    var times = sinon.timesInWords;\n\
\n\
    sinon.expectation = (function () {\n\
        var slice = Array.prototype.slice;\n\
        var _invoke = sinon.spy.invoke;\n\
\n\
        function callCountInWords(callCount) {\n\
            if (callCount == 0) {\n\
                return \"never called\";\n\
            } else {\n\
                return \"called \" + times(callCount);\n\
            }\n\
        }\n\
\n\
        function expectedCallCountInWords(expectation) {\n\
            var min = expectation.minCalls;\n\
            var max = expectation.maxCalls;\n\
\n\
            if (typeof min == \"number\" && typeof max == \"number\") {\n\
                var str = times(min);\n\
\n\
                if (min != max) {\n\
                    str = \"at least \" + str + \" and at most \" + times(max);\n\
                }\n\
\n\
                return str;\n\
            }\n\
\n\
            if (typeof min == \"number\") {\n\
                return \"at least \" + times(min);\n\
            }\n\
\n\
            return \"at most \" + times(max);\n\
        }\n\
\n\
        function receivedMinCalls(expectation) {\n\
            var hasMinLimit = typeof expectation.minCalls == \"number\";\n\
            return !hasMinLimit || expectation.callCount >= expectation.minCalls;\n\
        }\n\
\n\
        function receivedMaxCalls(expectation) {\n\
            if (typeof expectation.maxCalls != \"number\") {\n\
                return false;\n\
            }\n\
\n\
            return expectation.callCount == expectation.maxCalls;\n\
        }\n\
\n\
        function verifyMatcher(possibleMatcher, arg){\n\
            if (match && match.isMatcher(possibleMatcher)) {\n\
                return possibleMatcher.test(arg);\n\
            } else {\n\
                return true;\n\
            }\n\
        }\n\
\n\
        return {\n\
            minCalls: 1,\n\
            maxCalls: 1,\n\
\n\
            create: function create(methodName) {\n\
                var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);\n\
                delete expectation.create;\n\
                expectation.method = methodName;\n\
\n\
                return expectation;\n\
            },\n\
\n\
            invoke: function invoke(func, thisValue, args) {\n\
                this.verifyCallAllowed(thisValue, args);\n\
\n\
                return _invoke.apply(this, arguments);\n\
            },\n\
\n\
            atLeast: function atLeast(num) {\n\
                if (typeof num != \"number\") {\n\
                    throw new TypeError(\"'\" + num + \"' is not number\");\n\
                }\n\
\n\
                if (!this.limitsSet) {\n\
                    this.maxCalls = null;\n\
                    this.limitsSet = true;\n\
                }\n\
\n\
                this.minCalls = num;\n\
\n\
                return this;\n\
            },\n\
\n\
            atMost: function atMost(num) {\n\
                if (typeof num != \"number\") {\n\
                    throw new TypeError(\"'\" + num + \"' is not number\");\n\
                }\n\
\n\
                if (!this.limitsSet) {\n\
                    this.minCalls = null;\n\
                    this.limitsSet = true;\n\
                }\n\
\n\
                this.maxCalls = num;\n\
\n\
                return this;\n\
            },\n\
\n\
            never: function never() {\n\
                return this.exactly(0);\n\
            },\n\
\n\
            once: function once() {\n\
                return this.exactly(1);\n\
            },\n\
\n\
            twice: function twice() {\n\
                return this.exactly(2);\n\
            },\n\
\n\
            thrice: function thrice() {\n\
                return this.exactly(3);\n\
            },\n\
\n\
            exactly: function exactly(num) {\n\
                if (typeof num != \"number\") {\n\
                    throw new TypeError(\"'\" + num + \"' is not a number\");\n\
                }\n\
\n\
                this.atLeast(num);\n\
                return this.atMost(num);\n\
            },\n\
\n\
            met: function met() {\n\
                return !this.failed && receivedMinCalls(this);\n\
            },\n\
\n\
            verifyCallAllowed: function verifyCallAllowed(thisValue, args) {\n\
                if (receivedMaxCalls(this)) {\n\
                    this.failed = true;\n\
                    sinon.expectation.fail(this.method + \" already called \" + times(this.maxCalls));\n\
                }\n\
\n\
                if (\"expectedThis\" in this && this.expectedThis !== thisValue) {\n\
                    sinon.expectation.fail(this.method + \" called with \" + thisValue + \" as thisValue, expected \" +\n\
                        this.expectedThis);\n\
                }\n\
\n\
                if (!(\"expectedArguments\" in this)) {\n\
                    return;\n\
                }\n\
\n\
                if (!args) {\n\
                    sinon.expectation.fail(this.method + \" received no arguments, expected \" +\n\
                        sinon.format(this.expectedArguments));\n\
                }\n\
\n\
                if (args.length < this.expectedArguments.length) {\n\
                    sinon.expectation.fail(this.method + \" received too few arguments (\" + sinon.format(args) +\n\
                        \"), expected \" + sinon.format(this.expectedArguments));\n\
                }\n\
\n\
                if (this.expectsExactArgCount &&\n\
                    args.length != this.expectedArguments.length) {\n\
                    sinon.expectation.fail(this.method + \" received too many arguments (\" + sinon.format(args) +\n\
                        \"), expected \" + sinon.format(this.expectedArguments));\n\
                }\n\
\n\
                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {\n\
\n\
                    if (!verifyMatcher(this.expectedArguments[i],args[i])) {\n\
                        sinon.expectation.fail(this.method + \" received wrong arguments \" + sinon.format(args) +\n\
                            \", didn't match \" + this.expectedArguments.toString());\n\
                    }\n\
\n\
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {\n\
                        sinon.expectation.fail(this.method + \" received wrong arguments \" + sinon.format(args) +\n\
                            \", expected \" + sinon.format(this.expectedArguments));\n\
                    }\n\
                }\n\
            },\n\
\n\
            allowsCall: function allowsCall(thisValue, args) {\n\
                if (this.met() && receivedMaxCalls(this)) {\n\
                    return false;\n\
                }\n\
\n\
                if (\"expectedThis\" in this && this.expectedThis !== thisValue) {\n\
                    return false;\n\
                }\n\
\n\
                if (!(\"expectedArguments\" in this)) {\n\
                    return true;\n\
                }\n\
\n\
                args = args || [];\n\
\n\
                if (args.length < this.expectedArguments.length) {\n\
                    return false;\n\
                }\n\
\n\
                if (this.expectsExactArgCount &&\n\
                    args.length != this.expectedArguments.length) {\n\
                    return false;\n\
                }\n\
\n\
                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {\n\
                    if (!verifyMatcher(this.expectedArguments[i],args[i])) {\n\
                        return false;\n\
                    }\n\
\n\
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {\n\
                        return false;\n\
                    }\n\
                }\n\
\n\
                return true;\n\
            },\n\
\n\
            withArgs: function withArgs() {\n\
                this.expectedArguments = slice.call(arguments);\n\
                return this;\n\
            },\n\
\n\
            withExactArgs: function withExactArgs() {\n\
                this.withArgs.apply(this, arguments);\n\
                this.expectsExactArgCount = true;\n\
                return this;\n\
            },\n\
\n\
            on: function on(thisValue) {\n\
                this.expectedThis = thisValue;\n\
                return this;\n\
            },\n\
\n\
            toString: function () {\n\
                var args = (this.expectedArguments || []).slice();\n\
\n\
                if (!this.expectsExactArgCount) {\n\
                    push.call(args, \"[...]\");\n\
                }\n\
\n\
                var callStr = sinon.spyCall.toString.call({\n\
                    proxy: this.method || \"anonymous mock expectation\",\n\
                    args: args\n\
                });\n\
\n\
                var message = callStr.replace(\", [...\", \"[, ...\") + \" \" +\n\
                    expectedCallCountInWords(this);\n\
\n\
                if (this.met()) {\n\
                    return \"Expectation met: \" + message;\n\
                }\n\
\n\
                return \"Expected \" + message + \" (\" +\n\
                    callCountInWords(this.callCount) + \")\";\n\
            },\n\
\n\
            verify: function verify() {\n\
                if (!this.met()) {\n\
                    sinon.expectation.fail(this.toString());\n\
                } else {\n\
                    sinon.expectation.pass(this.toString());\n\
                }\n\
\n\
                return true;\n\
            },\n\
\n\
            pass: function(message) {\n\
              sinon.assert.pass(message);\n\
            },\n\
            fail: function (message) {\n\
                var exception = new Error(message);\n\
                exception.name = \"ExpectationError\";\n\
\n\
                throw exception;\n\
            }\n\
        };\n\
    }());\n\
\n\
    sinon.mock = mock;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = mock; });\n\
    } else if (commonJSModule) {\n\
        module.exports = mock;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/mock.js"
));

require.register("indemma/vendor/spec/sinon/sandbox.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 * @depend collection.js\n\
 * @depend util/fake_timers.js\n\
 * @depend util/fake_server_with_clock.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n\
/*global require, module*/\n\
/**\n\
 * Manages fake collections as well as fake utilities such as Sinon's\n\
 * timers and fake XHR implementation in one convenient object.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
if (typeof module !== \"undefined\" && module.exports && typeof require == \"function\") {\n\
    var sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    sinon.extend(sinon, require(\"indemma/vendor/spec/sinon/util/fake_timers.js\"));\n\
}\n\
\n\
(function () {\n\
    var push = [].push;\n\
\n\
    function exposeValue(sandbox, config, key, value) {\n\
        if (!value) {\n\
            return;\n\
        }\n\
\n\
        if (config.injectInto && !(key in config.injectInto)) {\n\
            config.injectInto[key] = value;\n\
            sandbox.injectedKeys.push(key);\n\
        } else {\n\
            push.call(sandbox.args, value);\n\
        }\n\
    }\n\
\n\
    function prepareSandboxFromConfig(config) {\n\
        var sandbox = sinon.create(sinon.sandbox);\n\
\n\
        if (config.useFakeServer) {\n\
            if (typeof config.useFakeServer == \"object\") {\n\
                sandbox.serverPrototype = config.useFakeServer;\n\
            }\n\
\n\
            sandbox.useFakeServer();\n\
        }\n\
\n\
        if (config.useFakeTimers) {\n\
            if (typeof config.useFakeTimers == \"object\") {\n\
                sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);\n\
            } else {\n\
                sandbox.useFakeTimers();\n\
            }\n\
        }\n\
\n\
        return sandbox;\n\
    }\n\
\n\
    sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {\n\
        useFakeTimers: function useFakeTimers() {\n\
            this.clock = sinon.useFakeTimers.apply(sinon, arguments);\n\
\n\
            return this.add(this.clock);\n\
        },\n\
\n\
        serverPrototype: sinon.fakeServer,\n\
\n\
        useFakeServer: function useFakeServer() {\n\
            var proto = this.serverPrototype || sinon.fakeServer;\n\
\n\
            if (!proto || !proto.create) {\n\
                return null;\n\
            }\n\
\n\
            this.server = proto.create();\n\
            return this.add(this.server);\n\
        },\n\
\n\
        inject: function (obj) {\n\
            sinon.collection.inject.call(this, obj);\n\
\n\
            if (this.clock) {\n\
                obj.clock = this.clock;\n\
            }\n\
\n\
            if (this.server) {\n\
                obj.server = this.server;\n\
                obj.requests = this.server.requests;\n\
            }\n\
\n\
            return obj;\n\
        },\n\
\n\
        restore: function () {\n\
            sinon.collection.restore.apply(this, arguments);\n\
            this.restoreContext();\n\
        },\n\
\n\
        restoreContext: function () {\n\
            if (this.injectedKeys) {\n\
                for (var i = 0, j = this.injectedKeys.length; i < j; i++) {\n\
                    delete this.injectInto[this.injectedKeys[i]];\n\
                }\n\
                this.injectedKeys = [];\n\
            }\n\
        },\n\
\n\
        create: function (config) {\n\
            if (!config) {\n\
                return sinon.create(sinon.sandbox);\n\
            }\n\
\n\
            var sandbox = prepareSandboxFromConfig(config);\n\
            sandbox.args = sandbox.args || [];\n\
            sandbox.injectedKeys = [];\n\
            sandbox.injectInto = config.injectInto;\n\
            var prop, value, exposed = sandbox.inject({});\n\
\n\
            if (config.properties) {\n\
                for (var i = 0, l = config.properties.length; i < l; i++) {\n\
                    prop = config.properties[i];\n\
                    value = exposed[prop] || prop == \"sandbox\" && sandbox;\n\
                    exposeValue(sandbox, config, prop, value);\n\
                }\n\
            } else {\n\
                exposeValue(sandbox, config, \"sandbox\", value);\n\
            }\n\
\n\
            return sandbox;\n\
        }\n\
    });\n\
\n\
    sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = sinon.sandbox; });\n\
    } else if (typeof module !== 'undefined' && module.exports) {\n\
        module.exports = sinon.sandbox;\n\
    }\n\
}());\n\
\n\
//# sourceURL=vendor/spec/sinon/sandbox.js"
));

require.register("indemma/vendor/spec/sinon/spy.js", Function("exports, module",
"/**\n\
  * @depend ../sinon.js\n\
  * @depend call.js\n\
  */\n\
/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
  * Spy functions\n\
  *\n\
  * @author Christian Johansen (christian@cjohansen.no)\n\
  * @license BSD\n\
  *\n\
  * Copyright (c) 2010-2013 Christian Johansen\n\
  */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
    var push = Array.prototype.push;\n\
    var slice = Array.prototype.slice;\n\
    var callId = 0;\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    function spy(object, property) {\n\
        if (!property && typeof object == \"function\") {\n\
            return spy.create(object);\n\
        }\n\
\n\
        if (!object && !property) {\n\
            return spy.create(function () { });\n\
        }\n\
\n\
        var method = object[property];\n\
        return sinon.wrapMethod(object, property, spy.create(method));\n\
    }\n\
\n\
    function matchingFake(fakes, args, strict) {\n\
        if (!fakes) {\n\
            return;\n\
        }\n\
\n\
        for (var i = 0, l = fakes.length; i < l; i++) {\n\
            if (fakes[i].matches(args, strict)) {\n\
                return fakes[i];\n\
            }\n\
        }\n\
    }\n\
\n\
    function incrementCallCount() {\n\
        this.called = true;\n\
        this.callCount += 1;\n\
        this.notCalled = false;\n\
        this.calledOnce = this.callCount == 1;\n\
        this.calledTwice = this.callCount == 2;\n\
        this.calledThrice = this.callCount == 3;\n\
    }\n\
\n\
    function createCallProperties() {\n\
        this.firstCall = this.getCall(0);\n\
        this.secondCall = this.getCall(1);\n\
        this.thirdCall = this.getCall(2);\n\
        this.lastCall = this.getCall(this.callCount - 1);\n\
    }\n\
\n\
    var vars = \"a,b,c,d,e,f,g,h,i,j,k,l\";\n\
    function createProxy(func) {\n\
        // Retain the function length:\n\
        var p;\n\
        if (func.length) {\n\
            eval(\"p = (function proxy(\" + vars.substring(0, func.length * 2 - 1) +\n\
                \") { return p.invoke(func, this, slice.call(arguments)); });\");\n\
        }\n\
        else {\n\
            p = function proxy() {\n\
                return p.invoke(func, this, slice.call(arguments));\n\
            };\n\
        }\n\
        return p;\n\
    }\n\
\n\
    var uuid = 0;\n\
\n\
    // Public API\n\
    var spyApi = {\n\
        reset: function () {\n\
            this.called = false;\n\
            this.notCalled = true;\n\
            this.calledOnce = false;\n\
            this.calledTwice = false;\n\
            this.calledThrice = false;\n\
            this.callCount = 0;\n\
            this.firstCall = null;\n\
            this.secondCall = null;\n\
            this.thirdCall = null;\n\
            this.lastCall = null;\n\
            this.args = [];\n\
            this.returnValues = [];\n\
            this.thisValues = [];\n\
            this.exceptions = [];\n\
            this.callIds = [];\n\
            if (this.fakes) {\n\
                for (var i = 0; i < this.fakes.length; i++) {\n\
                    this.fakes[i].reset();\n\
                }\n\
            }\n\
        },\n\
\n\
        create: function create(func) {\n\
            var name;\n\
\n\
            if (typeof func != \"function\") {\n\
                func = function () { };\n\
            } else {\n\
                name = sinon.functionName(func);\n\
            }\n\
\n\
            var proxy = createProxy(func);\n\
\n\
            sinon.extend(proxy, spy);\n\
            delete proxy.create;\n\
            sinon.extend(proxy, func);\n\
\n\
            proxy.reset();\n\
            proxy.prototype = func.prototype;\n\
            proxy.displayName = name || \"spy\";\n\
            proxy.toString = sinon.functionToString;\n\
            proxy._create = sinon.spy.create;\n\
            proxy.id = \"spy#\" + uuid++;\n\
\n\
            return proxy;\n\
        },\n\
\n\
        invoke: function invoke(func, thisValue, args) {\n\
            var matching = matchingFake(this.fakes, args);\n\
            var exception, returnValue;\n\
\n\
            incrementCallCount.call(this);\n\
            push.call(this.thisValues, thisValue);\n\
            push.call(this.args, args);\n\
            push.call(this.callIds, callId++);\n\
\n\
            createCallProperties.call(this);\n\
\n\
            try {\n\
                if (matching) {\n\
                    returnValue = matching.invoke(func, thisValue, args);\n\
                } else {\n\
                    returnValue = (this.func || func).apply(thisValue, args);\n\
                }\n\
\n\
                var thisCall = this.getCall(this.callCount - 1);\n\
                if (thisCall.calledWithNew() && typeof returnValue !== 'object') {\n\
                    returnValue = thisValue;\n\
                }\n\
            } catch (e) {\n\
                exception = e;\n\
            }\n\
\n\
            push.call(this.exceptions, exception);\n\
            push.call(this.returnValues, returnValue);\n\
\n\
            if (exception !== undefined) {\n\
                throw exception;\n\
            }\n\
\n\
            return returnValue;\n\
        },\n\
\n\
        named: function named(name) {\n\
            this.displayName = name;\n\
            return this;\n\
        },\n\
\n\
        getCall: function getCall(i) {\n\
            if (i < 0 || i >= this.callCount) {\n\
                return null;\n\
            }\n\
\n\
            return sinon.spyCall(this, this.thisValues[i], this.args[i],\n\
                                    this.returnValues[i], this.exceptions[i],\n\
                                    this.callIds[i]);\n\
        },\n\
\n\
        getCalls: function () {\n\
            var calls = [];\n\
            var i;\n\
\n\
            for (i = 0; i < this.callCount; i++) {\n\
                calls.push(this.getCall(i));\n\
            }\n\
\n\
            return calls;\n\
        },\n\
\n\
        calledBefore: function calledBefore(spyFn) {\n\
            if (!this.called) {\n\
                return false;\n\
            }\n\
\n\
            if (!spyFn.called) {\n\
                return true;\n\
            }\n\
\n\
            return this.callIds[0] < spyFn.callIds[spyFn.callIds.length - 1];\n\
        },\n\
\n\
        calledAfter: function calledAfter(spyFn) {\n\
            if (!this.called || !spyFn.called) {\n\
                return false;\n\
            }\n\
\n\
            return this.callIds[this.callCount - 1] > spyFn.callIds[spyFn.callCount - 1];\n\
        },\n\
\n\
        withArgs: function () {\n\
            var args = slice.call(arguments);\n\
\n\
            if (this.fakes) {\n\
                var match = matchingFake(this.fakes, args, true);\n\
\n\
                if (match) {\n\
                    return match;\n\
                }\n\
            } else {\n\
                this.fakes = [];\n\
            }\n\
\n\
            var original = this;\n\
            var fake = this._create();\n\
            fake.matchingAguments = args;\n\
            fake.parent = this;\n\
            push.call(this.fakes, fake);\n\
\n\
            fake.withArgs = function () {\n\
                return original.withArgs.apply(original, arguments);\n\
            };\n\
\n\
            for (var i = 0; i < this.args.length; i++) {\n\
                if (fake.matches(this.args[i])) {\n\
                    incrementCallCount.call(fake);\n\
                    push.call(fake.thisValues, this.thisValues[i]);\n\
                    push.call(fake.args, this.args[i]);\n\
                    push.call(fake.returnValues, this.returnValues[i]);\n\
                    push.call(fake.exceptions, this.exceptions[i]);\n\
                    push.call(fake.callIds, this.callIds[i]);\n\
                }\n\
            }\n\
            createCallProperties.call(fake);\n\
\n\
            return fake;\n\
        },\n\
\n\
        matches: function (args, strict) {\n\
            var margs = this.matchingAguments;\n\
\n\
            if (margs.length <= args.length &&\n\
                sinon.deepEqual(margs, args.slice(0, margs.length))) {\n\
                return !strict || margs.length == args.length;\n\
            }\n\
        },\n\
\n\
        printf: function (format) {\n\
            var spy = this;\n\
            var args = slice.call(arguments, 1);\n\
            var formatter;\n\
\n\
            return (format || \"\").replace(/%(.)/g, function (match, specifyer) {\n\
                formatter = spyApi.formatters[specifyer];\n\
\n\
                if (typeof formatter == \"function\") {\n\
                    return formatter.call(null, spy, args);\n\
                } else if (!isNaN(parseInt(specifyer, 10))) {\n\
                    return sinon.format(args[specifyer - 1]);\n\
                }\n\
\n\
                return \"%\" + specifyer;\n\
            });\n\
        }\n\
    };\n\
\n\
    function delegateToCalls(method, matchAny, actual, notCalled) {\n\
        spyApi[method] = function () {\n\
            if (!this.called) {\n\
                if (notCalled) {\n\
                    return notCalled.apply(this, arguments);\n\
                }\n\
                return false;\n\
            }\n\
\n\
            var currentCall;\n\
            var matches = 0;\n\
\n\
            for (var i = 0, l = this.callCount; i < l; i += 1) {\n\
                currentCall = this.getCall(i);\n\
\n\
                if (currentCall[actual || method].apply(currentCall, arguments)) {\n\
                    matches += 1;\n\
\n\
                    if (matchAny) {\n\
                        return true;\n\
                    }\n\
                }\n\
            }\n\
\n\
            return matches === this.callCount;\n\
        };\n\
    }\n\
\n\
    delegateToCalls(\"calledOn\", true);\n\
    delegateToCalls(\"alwaysCalledOn\", false, \"calledOn\");\n\
    delegateToCalls(\"calledWith\", true);\n\
    delegateToCalls(\"calledWithMatch\", true);\n\
    delegateToCalls(\"alwaysCalledWith\", false, \"calledWith\");\n\
    delegateToCalls(\"alwaysCalledWithMatch\", false, \"calledWithMatch\");\n\
    delegateToCalls(\"calledWithExactly\", true);\n\
    delegateToCalls(\"alwaysCalledWithExactly\", false, \"calledWithExactly\");\n\
    delegateToCalls(\"neverCalledWith\", false, \"notCalledWith\",\n\
        function () { return true; });\n\
    delegateToCalls(\"neverCalledWithMatch\", false, \"notCalledWithMatch\",\n\
        function () { return true; });\n\
    delegateToCalls(\"threw\", true);\n\
    delegateToCalls(\"alwaysThrew\", false, \"threw\");\n\
    delegateToCalls(\"returned\", true);\n\
    delegateToCalls(\"alwaysReturned\", false, \"returned\");\n\
    delegateToCalls(\"calledWithNew\", true);\n\
    delegateToCalls(\"alwaysCalledWithNew\", false, \"calledWithNew\");\n\
    delegateToCalls(\"callArg\", false, \"callArgWith\", function () {\n\
        throw new Error(this.toString() + \" cannot call arg since it was not yet invoked.\");\n\
    });\n\
    spyApi.callArgWith = spyApi.callArg;\n\
    delegateToCalls(\"callArgOn\", false, \"callArgOnWith\", function () {\n\
        throw new Error(this.toString() + \" cannot call arg since it was not yet invoked.\");\n\
    });\n\
    spyApi.callArgOnWith = spyApi.callArgOn;\n\
    delegateToCalls(\"yield\", false, \"yield\", function () {\n\
        throw new Error(this.toString() + \" cannot yield since it was not yet invoked.\");\n\
    });\n\
    // \"invokeCallback\" is an alias for \"yield\" since \"yield\" is invalid in strict mode.\n\
    spyApi.invokeCallback = spyApi.yield;\n\
    delegateToCalls(\"yieldOn\", false, \"yieldOn\", function () {\n\
        throw new Error(this.toString() + \" cannot yield since it was not yet invoked.\");\n\
    });\n\
    delegateToCalls(\"yieldTo\", false, \"yieldTo\", function (property) {\n\
        throw new Error(this.toString() + \" cannot yield to '\" + property +\n\
            \"' since it was not yet invoked.\");\n\
    });\n\
    delegateToCalls(\"yieldToOn\", false, \"yieldToOn\", function (property) {\n\
        throw new Error(this.toString() + \" cannot yield to '\" + property +\n\
            \"' since it was not yet invoked.\");\n\
    });\n\
\n\
    spyApi.formatters = {\n\
        \"c\": function (spy) {\n\
            return sinon.timesInWords(spy.callCount);\n\
        },\n\
\n\
        \"n\": function (spy) {\n\
            return spy.toString();\n\
        },\n\
\n\
        \"C\": function (spy) {\n\
            var calls = [];\n\
\n\
            for (var i = 0, l = spy.callCount; i < l; ++i) {\n\
                var stringifiedCall = \"    \" + spy.getCall(i).toString();\n\
                if (/\\n\
/.test(calls[i - 1])) {\n\
                    stringifiedCall = \"\\n\
\" + stringifiedCall;\n\
                }\n\
                push.call(calls, stringifiedCall);\n\
            }\n\
\n\
            return calls.length > 0 ? \"\\n\
\" + calls.join(\"\\n\
\") : \"\";\n\
        },\n\
\n\
        \"t\": function (spy) {\n\
            var objects = [];\n\
\n\
            for (var i = 0, l = spy.callCount; i < l; ++i) {\n\
                push.call(objects, sinon.format(spy.thisValues[i]));\n\
            }\n\
\n\
            return objects.join(\", \");\n\
        },\n\
\n\
        \"*\": function (spy, args) {\n\
            var formatted = [];\n\
\n\
            for (var i = 0, l = args.length; i < l; ++i) {\n\
                push.call(formatted, sinon.format(args[i]));\n\
            }\n\
\n\
            return formatted.join(\", \");\n\
        }\n\
    };\n\
\n\
    sinon.extend(spy, spyApi);\n\
\n\
    spy.spyCall = sinon.spyCall;\n\
    sinon.spy = spy;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = spy; });\n\
    } else if (commonJSModule) {\n\
        module.exports = spy;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/spy.js"
));

require.register("indemma/vendor/spec/sinon/stub.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 * @depend spy.js\n\
 * @depend behavior.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
 * Stub functions\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    function stub(object, property, func) {\n\
        if (!!func && typeof func != \"function\") {\n\
            throw new TypeError(\"Custom stub should be function\");\n\
        }\n\
\n\
        var wrapper;\n\
\n\
        if (func) {\n\
            wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;\n\
        } else {\n\
            wrapper = stub.create();\n\
        }\n\
\n\
        if (!object && typeof property === \"undefined\") {\n\
            return sinon.stub.create();\n\
        }\n\
\n\
        if (typeof property === \"undefined\" && typeof object == \"object\") {\n\
            for (var prop in object) {\n\
                if (typeof object[prop] === \"function\") {\n\
                    stub(object, prop);\n\
                }\n\
            }\n\
\n\
            return object;\n\
        }\n\
\n\
        return sinon.wrapMethod(object, property, wrapper);\n\
    }\n\
\n\
    function getDefaultBehavior(stub) {\n\
        return stub.defaultBehavior || getParentBehaviour(stub) || sinon.behavior.create(stub);\n\
    }\n\
\n\
    function getParentBehaviour(stub) {\n\
        return (stub.parent && getCurrentBehavior(stub.parent));\n\
    }\n\
\n\
    function getCurrentBehavior(stub) {\n\
        var behavior = stub.behaviors[stub.callCount - 1];\n\
        return behavior && behavior.isPresent() ? behavior : getDefaultBehavior(stub);\n\
    }\n\
\n\
    var uuid = 0;\n\
\n\
    sinon.extend(stub, (function () {\n\
        var proto = {\n\
            create: function create() {\n\
                var functionStub = function () {\n\
                    return getCurrentBehavior(functionStub).invoke(this, arguments);\n\
                };\n\
\n\
                functionStub.id = \"stub#\" + uuid++;\n\
                var orig = functionStub;\n\
                functionStub = sinon.spy.create(functionStub);\n\
                functionStub.func = orig;\n\
\n\
                sinon.extend(functionStub, stub);\n\
                functionStub._create = sinon.stub.create;\n\
                functionStub.displayName = \"stub\";\n\
                functionStub.toString = sinon.functionToString;\n\
\n\
                functionStub.defaultBehavior = null;\n\
                functionStub.behaviors = [];\n\
\n\
                return functionStub;\n\
            },\n\
\n\
            resetBehavior: function () {\n\
                var i;\n\
\n\
                this.defaultBehavior = null;\n\
                this.behaviors = [];\n\
\n\
                delete this.returnValue;\n\
                delete this.returnArgAt;\n\
                this.returnThis = false;\n\
\n\
                if (this.fakes) {\n\
                    for (i = 0; i < this.fakes.length; i++) {\n\
                        this.fakes[i].resetBehavior();\n\
                    }\n\
                }\n\
            },\n\
\n\
            onCall: function(index) {\n\
                if (!this.behaviors[index]) {\n\
                    this.behaviors[index] = sinon.behavior.create(this);\n\
                }\n\
\n\
                return this.behaviors[index];\n\
            },\n\
\n\
            onFirstCall: function() {\n\
                return this.onCall(0);\n\
            },\n\
\n\
            onSecondCall: function() {\n\
                return this.onCall(1);\n\
            },\n\
\n\
            onThirdCall: function() {\n\
                return this.onCall(2);\n\
            }\n\
        };\n\
\n\
        for (var method in sinon.behavior) {\n\
            if (sinon.behavior.hasOwnProperty(method) &&\n\
                !proto.hasOwnProperty(method) &&\n\
                method != 'create' &&\n\
                method != 'withArgs' &&\n\
                method != 'invoke') {\n\
                proto[method] = (function(behaviorMethod) {\n\
                    return function() {\n\
                        this.defaultBehavior = this.defaultBehavior || sinon.behavior.create(this);\n\
                        this.defaultBehavior[behaviorMethod].apply(this.defaultBehavior, arguments);\n\
                        return this;\n\
                    };\n\
                }(method));\n\
            }\n\
        }\n\
\n\
        return proto;\n\
    }()));\n\
\n\
    sinon.stub = stub;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = stub; });\n\
    } else if (commonJSModule) {\n\
        module.exports = stub;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/stub.js"
));

require.register("indemma/vendor/spec/sinon/test.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 * @depend stub.js\n\
 * @depend mock.js\n\
 * @depend sandbox.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false, forin: true, plusplus: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
 * Test function, sandboxes fakes\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon) {\n\
        return;\n\
    }\n\
\n\
    function test(callback) {\n\
        var type = typeof callback;\n\
\n\
        if (type != \"function\") {\n\
            throw new TypeError(\"sinon.test needs to wrap a test function, got \" + type);\n\
        }\n\
\n\
        return function () {\n\
            var config = sinon.getConfig(sinon.config);\n\
            config.injectInto = config.injectIntoThis && this || config.injectInto;\n\
            var sandbox = sinon.sandbox.create(config);\n\
            var exception, result;\n\
            var args = Array.prototype.slice.call(arguments).concat(sandbox.args);\n\
\n\
            try {\n\
                result = callback.apply(this, args);\n\
            } catch (e) {\n\
                exception = e;\n\
            }\n\
\n\
            if (typeof exception !== \"undefined\") {\n\
                sandbox.restore();\n\
                throw exception;\n\
            }\n\
            else {\n\
                sandbox.verifyAndRestore();\n\
            }\n\
\n\
            return result;\n\
        };\n\
    }\n\
\n\
    test.config = {\n\
        injectIntoThis: true,\n\
        injectInto: null,\n\
        properties: [\"spy\", \"stub\", \"mock\", \"clock\", \"server\", \"requests\"],\n\
        useFakeTimers: true,\n\
        useFakeServer: true\n\
    };\n\
\n\
    sinon.test = test;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = test; });\n\
    } else if (commonJSModule) {\n\
        module.exports = test;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/test.js"
));

require.register("indemma/vendor/spec/sinon/test_case.js", Function("exports, module",
"/**\n\
 * @depend ../sinon.js\n\
 * @depend test.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false, eqeqeq: false*/\n\
/*global module, require, sinon*/\n\
/**\n\
 * Test case, sandboxes all test functions\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function (sinon) {\n\
    var commonJSModule = typeof module !== \"undefined\" && module.exports && typeof require == \"function\";\n\
\n\
    if (!sinon && commonJSModule) {\n\
        sinon = require(\"indemma/vendor/spec/sinon.js\");\n\
    }\n\
\n\
    if (!sinon || !Object.prototype.hasOwnProperty) {\n\
        return;\n\
    }\n\
\n\
    function createTest(property, setUp, tearDown) {\n\
        return function () {\n\
            if (setUp) {\n\
                setUp.apply(this, arguments);\n\
            }\n\
\n\
            var exception, result;\n\
\n\
            try {\n\
                result = property.apply(this, arguments);\n\
            } catch (e) {\n\
                exception = e;\n\
            }\n\
\n\
            if (tearDown) {\n\
                tearDown.apply(this, arguments);\n\
            }\n\
\n\
            if (exception) {\n\
                throw exception;\n\
            }\n\
\n\
            return result;\n\
        };\n\
    }\n\
\n\
    function testCase(tests, prefix) {\n\
        /*jsl:ignore*/\n\
        if (!tests || typeof tests != \"object\") {\n\
            throw new TypeError(\"sinon.testCase needs an object with test functions\");\n\
        }\n\
        /*jsl:end*/\n\
\n\
        prefix = prefix || \"test\";\n\
        var rPrefix = new RegExp(\"^\" + prefix);\n\
        var methods = {}, testName, property, method;\n\
        var setUp = tests.setUp;\n\
        var tearDown = tests.tearDown;\n\
\n\
        for (testName in tests) {\n\
            if (tests.hasOwnProperty(testName)) {\n\
                property = tests[testName];\n\
\n\
                if (/^(setUp|tearDown)$/.test(testName)) {\n\
                    continue;\n\
                }\n\
\n\
                if (typeof property == \"function\" && rPrefix.test(testName)) {\n\
                    method = property;\n\
\n\
                    if (setUp || tearDown) {\n\
                        method = createTest(property, setUp, tearDown);\n\
                    }\n\
\n\
                    methods[testName] = sinon.test(method);\n\
                } else {\n\
                    methods[testName] = tests[testName];\n\
                }\n\
            }\n\
        }\n\
\n\
        return methods;\n\
    }\n\
\n\
    sinon.testCase = testCase;\n\
\n\
    if (typeof define === \"function\" && define.amd) {\n\
        define([\"module\"], function(module) { module.exports = testCase; });\n\
    } else if (commonJSModule) {\n\
        module.exports = testCase;\n\
    }\n\
}(typeof sinon == \"object\" && sinon || null));\n\
\n\
//# sourceURL=vendor/spec/sinon/test_case.js"
));

require.register("indemma/vendor/spec/sinon/util/event.js", Function("exports, module",
"/*jslint eqeqeq: false, onevar: false*/\n\
/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/\n\
/**\n\
 * Minimal Event interface implementation\n\
 *\n\
 * Original implementation by Sven Fuchs: https://gist.github.com/995028\n\
 * Modifications and tests by Christian Johansen.\n\
 *\n\
 * @author Sven Fuchs (svenfuchs@artweb-design.de)\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2011 Sven Fuchs, Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
if (typeof sinon == \"undefined\") {\n\
    this.sinon = {};\n\
}\n\
\n\
(function () {\n\
    var push = [].push;\n\
\n\
    sinon.Event = function Event(type, bubbles, cancelable, target) {\n\
        this.initEvent(type, bubbles, cancelable, target);\n\
    };\n\
\n\
    sinon.Event.prototype = {\n\
        initEvent: function(type, bubbles, cancelable, target) {\n\
            this.type = type;\n\
            this.bubbles = bubbles;\n\
            this.cancelable = cancelable;\n\
            this.target = target;\n\
        },\n\
\n\
        stopPropagation: function () {},\n\
\n\
        preventDefault: function () {\n\
            this.defaultPrevented = true;\n\
        }\n\
    };\n\
\n\
    sinon.ProgressEvent = function ProgressEvent(type, progressEventRaw, target) {\n\
        this.initEvent(type, false, false, target);\n\
        this.loaded = progressEventRaw.loaded || null;\n\
        this.total = progressEventRaw.total || null;\n\
    };\n\
\n\
    sinon.ProgressEvent.prototype = new sinon.Event();\n\
\n\
    sinon.ProgressEvent.prototype.constructor =  sinon.ProgressEvent;\n\
\n\
    sinon.CustomEvent = function CustomEvent(type, customData, target) {\n\
        this.initEvent(type, false, false, target);\n\
        this.detail = customData.detail || null;\n\
    };\n\
\n\
    sinon.CustomEvent.prototype = new sinon.Event();\n\
\n\
    sinon.CustomEvent.prototype.constructor =  sinon.CustomEvent;\n\
\n\
    sinon.EventTarget = {\n\
        addEventListener: function addEventListener(event, listener) {\n\
            this.eventListeners = this.eventListeners || {};\n\
            this.eventListeners[event] = this.eventListeners[event] || [];\n\
            push.call(this.eventListeners[event], listener);\n\
        },\n\
\n\
        removeEventListener: function removeEventListener(event, listener) {\n\
            var listeners = this.eventListeners && this.eventListeners[event] || [];\n\
\n\
            for (var i = 0, l = listeners.length; i < l; ++i) {\n\
                if (listeners[i] == listener) {\n\
                    return listeners.splice(i, 1);\n\
                }\n\
            }\n\
        },\n\
\n\
        dispatchEvent: function dispatchEvent(event) {\n\
            var type = event.type;\n\
            var listeners = this.eventListeners && this.eventListeners[type] || [];\n\
\n\
            for (var i = 0; i < listeners.length; i++) {\n\
                if (typeof listeners[i] == \"function\") {\n\
                    listeners[i].call(this, event);\n\
                } else {\n\
                    listeners[i].handleEvent(event);\n\
                }\n\
            }\n\
\n\
            return !!event.defaultPrevented;\n\
        }\n\
    };\n\
}());\n\
\n\
//# sourceURL=vendor/spec/sinon/util/event.js"
));

require.register("indemma/vendor/spec/sinon/util/fake_server.js", Function("exports, module",
"/**\n\
 * @depend fake_xml_http_request.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false, regexp: false, plusplus: false*/\n\
/*global module, require, window*/\n\
/**\n\
 * The Sinon \"server\" mimics a web server that receives requests from\n\
 * sinon.FakeXMLHttpRequest and provides an API to respond to those requests,\n\
 * both synchronously and asynchronously. To respond synchronuously, canned\n\
 * answers have to be provided upfront.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
if (typeof sinon == \"undefined\") {\n\
    var sinon = {};\n\
}\n\
\n\
sinon.fakeServer = (function () {\n\
    var push = [].push;\n\
    function F() {}\n\
\n\
    function create(proto) {\n\
        F.prototype = proto;\n\
        return new F();\n\
    }\n\
\n\
    function responseArray(handler) {\n\
        var response = handler;\n\
\n\
        if (Object.prototype.toString.call(handler) != \"[object Array]\") {\n\
            response = [200, {}, handler];\n\
        }\n\
\n\
        if (typeof response[2] != \"string\") {\n\
            throw new TypeError(\"Fake server response body should be string, but was \" +\n\
                                typeof response[2]);\n\
        }\n\
\n\
        return response;\n\
    }\n\
\n\
    var wloc = typeof window !== \"undefined\" ? window.location : {};\n\
    var rCurrLoc = new RegExp(\"^\" + wloc.protocol + \"//\" + wloc.host);\n\
\n\
    function matchOne(response, reqMethod, reqUrl) {\n\
        var rmeth = response.method;\n\
        var matchMethod = !rmeth || rmeth.toLowerCase() == reqMethod.toLowerCase();\n\
        var url = response.url;\n\
        var matchUrl = !url || url == reqUrl || (typeof url.test == \"function\" && url.test(reqUrl));\n\
\n\
        return matchMethod && matchUrl;\n\
    }\n\
\n\
    function match(response, request) {\n\
        var requestUrl = request.url;\n\
\n\
        if (!/^https?:\\/\\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {\n\
            requestUrl = requestUrl.replace(rCurrLoc, \"\");\n\
        }\n\
\n\
        if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {\n\
            if (typeof response.response == \"function\") {\n\
                var ru = response.url;\n\
                var args = [request].concat(ru && typeof ru.exec == \"function\" ? ru.exec(requestUrl).slice(1) : []);\n\
                return response.response.apply(response, args);\n\
            }\n\
\n\
            return true;\n\
        }\n\
\n\
        return false;\n\
    }\n\
\n\
    function log(response, request) {\n\
        var str;\n\
\n\
        str =  \"Request:\\n\
\"  + sinon.format(request)  + \"\\n\
\\n\
\";\n\
        str += \"Response:\\n\
\" + sinon.format(response) + \"\\n\
\\n\
\";\n\
\n\
        sinon.log(str);\n\
    }\n\
\n\
    return {\n\
        create: function () {\n\
            var server = create(this);\n\
            this.xhr = sinon.useFakeXMLHttpRequest();\n\
            server.requests = [];\n\
\n\
            this.xhr.onCreate = function (xhrObj) {\n\
                server.addRequest(xhrObj);\n\
            };\n\
\n\
            return server;\n\
        },\n\
\n\
        addRequest: function addRequest(xhrObj) {\n\
            var server = this;\n\
            push.call(this.requests, xhrObj);\n\
\n\
            xhrObj.onSend = function () {\n\
                server.handleRequest(this);\n\
\n\
                if (server.autoRespond && !server.responding) {\n\
                    setTimeout(function () {\n\
                        server.responding = false;\n\
                        server.respond();\n\
                    }, server.autoRespondAfter || 10);\n\
\n\
                    server.responding = true;\n\
                }\n\
            };\n\
        },\n\
\n\
        getHTTPMethod: function getHTTPMethod(request) {\n\
            if (this.fakeHTTPMethods && /post/i.test(request.method)) {\n\
                var matches = (request.requestBody || \"\").match(/_method=([^\\b;]+)/);\n\
                return !!matches ? matches[1] : request.method;\n\
            }\n\
\n\
            return request.method;\n\
        },\n\
\n\
        handleRequest: function handleRequest(xhr) {\n\
            if (xhr.async) {\n\
                if (!this.queue) {\n\
                    this.queue = [];\n\
                }\n\
\n\
                push.call(this.queue, xhr);\n\
            } else {\n\
                this.processRequest(xhr);\n\
            }\n\
        },\n\
\n\
        respondWith: function respondWith(method, url, body) {\n\
            if (arguments.length == 1 && typeof method != \"function\") {\n\
                this.response = responseArray(method);\n\
                return;\n\
            }\n\
\n\
            if (!this.responses) { this.responses = []; }\n\
\n\
            if (arguments.length == 1) {\n\
                body = method;\n\
                url = method = null;\n\
            }\n\
\n\
            if (arguments.length == 2) {\n\
                body = url;\n\
                url = method;\n\
                method = null;\n\
            }\n\
\n\
            push.call(this.responses, {\n\
                method: method,\n\
                url: url,\n\
                response: typeof body == \"function\" ? body : responseArray(body)\n\
            });\n\
        },\n\
\n\
        respond: function respond() {\n\
            if (arguments.length > 0) this.respondWith.apply(this, arguments);\n\
            var queue = this.queue || [];\n\
            var requests = queue.splice(0, queue.length);\n\
            var request;\n\
\n\
            while(request = requests.shift()) {\n\
                this.processRequest(request);\n\
            }\n\
        },\n\
\n\
        processRequest: function processRequest(request) {\n\
            try {\n\
                if (request.aborted) {\n\
                    return;\n\
                }\n\
\n\
                var response = this.response || [404, {}, \"\"];\n\
\n\
                if (this.responses) {\n\
                    for (var l = this.responses.length, i = l - 1; i >= 0; i--) {\n\
                        if (match.call(this, this.responses[i], request)) {\n\
                            response = this.responses[i].response;\n\
                            break;\n\
                        }\n\
                    }\n\
                }\n\
\n\
                if (request.readyState != 4) {\n\
                    log(response, request);\n\
\n\
                    request.respond(response[0], response[1], response[2]);\n\
                }\n\
            } catch (e) {\n\
                sinon.logError(\"Fake server request processing\", e);\n\
            }\n\
        },\n\
\n\
        restore: function restore() {\n\
            return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);\n\
        }\n\
    };\n\
}());\n\
\n\
if (typeof module !== 'undefined' && module.exports) {\n\
    module.exports = sinon;\n\
}\n\
\n\
//# sourceURL=vendor/spec/sinon/util/fake_server.js"
));

require.register("indemma/vendor/spec/sinon/util/fake_server_with_clock.js", Function("exports, module",
"/**\n\
 * @depend fake_server.js\n\
 * @depend fake_timers.js\n\
 */\n\
/*jslint browser: true, eqeqeq: false, onevar: false*/\n\
/*global sinon*/\n\
/**\n\
 * Add-on for sinon.fakeServer that automatically handles a fake timer along with\n\
 * the FakeXMLHttpRequest. The direct inspiration for this add-on is jQuery\n\
 * 1.3.x, which does not use xhr object's onreadystatehandler at all - instead,\n\
 * it polls the object for completion with setInterval. Dispite the direct\n\
 * motivation, there is nothing jQuery-specific in this file, so it can be used\n\
 * in any environment where the ajax implementation depends on setInterval or\n\
 * setTimeout.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
(function () {\n\
    function Server() {}\n\
    Server.prototype = sinon.fakeServer;\n\
\n\
    sinon.fakeServerWithClock = new Server();\n\
\n\
    sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {\n\
        if (xhr.async) {\n\
            if (typeof setTimeout.clock == \"object\") {\n\
                this.clock = setTimeout.clock;\n\
            } else {\n\
                this.clock = sinon.useFakeTimers();\n\
                this.resetClock = true;\n\
            }\n\
\n\
            if (!this.longestTimeout) {\n\
                var clockSetTimeout = this.clock.setTimeout;\n\
                var clockSetInterval = this.clock.setInterval;\n\
                var server = this;\n\
\n\
                this.clock.setTimeout = function (fn, timeout) {\n\
                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);\n\
\n\
                    return clockSetTimeout.apply(this, arguments);\n\
                };\n\
\n\
                this.clock.setInterval = function (fn, timeout) {\n\
                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);\n\
\n\
                    return clockSetInterval.apply(this, arguments);\n\
                };\n\
            }\n\
        }\n\
\n\
        return sinon.fakeServer.addRequest.call(this, xhr);\n\
    };\n\
\n\
    sinon.fakeServerWithClock.respond = function respond() {\n\
        var returnVal = sinon.fakeServer.respond.apply(this, arguments);\n\
\n\
        if (this.clock) {\n\
            this.clock.tick(this.longestTimeout || 0);\n\
            this.longestTimeout = 0;\n\
\n\
            if (this.resetClock) {\n\
                this.clock.restore();\n\
                this.resetClock = false;\n\
            }\n\
        }\n\
\n\
        return returnVal;\n\
    };\n\
\n\
    sinon.fakeServerWithClock.restore = function restore() {\n\
        if (this.clock) {\n\
            this.clock.restore();\n\
        }\n\
\n\
        return sinon.fakeServer.restore.apply(this, arguments);\n\
    };\n\
}());\n\
\n\
//# sourceURL=vendor/spec/sinon/util/fake_server_with_clock.js"
));

require.register("indemma/vendor/spec/sinon/util/fake_timers.js", Function("exports, module",
"/*jslint eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true, forin: false*/\n\
/*global module, require, window*/\n\
/**\n\
 * Fake timer API\n\
 * setTimeout\n\
 * setInterval\n\
 * clearTimeout\n\
 * clearInterval\n\
 * tick\n\
 * reset\n\
 * Date\n\
 *\n\
 * Inspired by jsUnitMockTimeOut from JsUnit\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
if (typeof sinon == \"undefined\") {\n\
    var sinon = {};\n\
}\n\
\n\
(function (global) {\n\
    // node expects setTimeout/setInterval to return a fn object w/ .ref()/.unref()\n\
    // browsers, a number.\n\
    // see https://github.com/cjohansen/Sinon.JS/pull/436\n\
    var timeoutResult = setTimeout(function() {}, 0);\n\
    var addTimerReturnsObject = typeof timeoutResult === 'object';\n\
    clearTimeout(timeoutResult);\n\
\n\
    var id = 1;\n\
\n\
    function addTimer(args, recurring) {\n\
        if (args.length === 0) {\n\
            throw new Error(\"Function requires at least 1 parameter\");\n\
        }\n\
\n\
        if (typeof args[0] === \"undefined\") {\n\
            throw new Error(\"Callback must be provided to timer calls\");\n\
        }\n\
\n\
        var toId = id++;\n\
        var delay = args[1] || 0;\n\
\n\
        if (!this.timeouts) {\n\
            this.timeouts = {};\n\
        }\n\
\n\
        this.timeouts[toId] = {\n\
            id: toId,\n\
            func: args[0],\n\
            callAt: this.now + delay,\n\
            invokeArgs: Array.prototype.slice.call(args, 2)\n\
        };\n\
\n\
        if (recurring === true) {\n\
            this.timeouts[toId].interval = delay;\n\
        }\n\
\n\
        if (addTimerReturnsObject) {\n\
            return {\n\
                id: toId,\n\
                ref: function() {},\n\
                unref: function() {}\n\
            };\n\
        }\n\
        else {\n\
            return toId;\n\
        }\n\
    }\n\
\n\
    function parseTime(str) {\n\
        if (!str) {\n\
            return 0;\n\
        }\n\
\n\
        var strings = str.split(\":\");\n\
        var l = strings.length, i = l;\n\
        var ms = 0, parsed;\n\
\n\
        if (l > 3 || !/^(\\d\\d:){0,2}\\d\\d?$/.test(str)) {\n\
            throw new Error(\"tick only understands numbers and 'h:m:s'\");\n\
        }\n\
\n\
        while (i--) {\n\
            parsed = parseInt(strings[i], 10);\n\
\n\
            if (parsed >= 60) {\n\
                throw new Error(\"Invalid time \" + str);\n\
            }\n\
\n\
            ms += parsed * Math.pow(60, (l - i - 1));\n\
        }\n\
\n\
        return ms * 1000;\n\
    }\n\
\n\
    function createObject(object) {\n\
        var newObject;\n\
\n\
        if (Object.create) {\n\
            newObject = Object.create(object);\n\
        } else {\n\
            var F = function () {};\n\
            F.prototype = object;\n\
            newObject = new F();\n\
        }\n\
\n\
        newObject.Date.clock = newObject;\n\
        return newObject;\n\
    }\n\
\n\
    sinon.clock = {\n\
        now: 0,\n\
\n\
        create: function create(now) {\n\
            var clock = createObject(this);\n\
\n\
            if (typeof now == \"number\") {\n\
                clock.now = now;\n\
            }\n\
\n\
            if (!!now && typeof now == \"object\") {\n\
                throw new TypeError(\"now should be milliseconds since UNIX epoch\");\n\
            }\n\
\n\
            return clock;\n\
        },\n\
\n\
        setTimeout: function setTimeout(callback, timeout) {\n\
            return addTimer.call(this, arguments, false);\n\
        },\n\
\n\
        clearTimeout: function clearTimeout(timerId) {\n\
            if (!this.timeouts) {\n\
                this.timeouts = [];\n\
            }\n\
            // in Node, timerId is an object with .ref()/.unref(), and\n\
            // its .id field is the actual timer id.\n\
            if (typeof timerId === 'object') {\n\
              timerId = timerId.id\n\
            }\n\
            if (timerId in this.timeouts) {\n\
                delete this.timeouts[timerId];\n\
            }\n\
        },\n\
\n\
        setInterval: function setInterval(callback, timeout) {\n\
            return addTimer.call(this, arguments, true);\n\
        },\n\
\n\
        clearInterval: function clearInterval(timerId) {\n\
            this.clearTimeout(timerId);\n\
        },\n\
\n\
        setImmediate: function setImmediate(callback) {\n\
            var passThruArgs = Array.prototype.slice.call(arguments, 1);\n\
\n\
            return addTimer.call(this, [callback, 0].concat(passThruArgs), false);\n\
        },\n\
\n\
        clearImmediate: function clearImmediate(timerId) {\n\
            this.clearTimeout(timerId);\n\
        },\n\
\n\
        tick: function tick(ms) {\n\
            ms = typeof ms == \"number\" ? ms : parseTime(ms);\n\
            var tickFrom = this.now, tickTo = this.now + ms, previous = this.now;\n\
            var timer = this.firstTimerInRange(tickFrom, tickTo);\n\
\n\
            var firstException;\n\
            while (timer && tickFrom <= tickTo) {\n\
                if (this.timeouts[timer.id]) {\n\
                    tickFrom = this.now = timer.callAt;\n\
                    try {\n\
                      this.callTimer(timer);\n\
                    } catch (e) {\n\
                      firstException = firstException || e;\n\
                    }\n\
                }\n\
\n\
                timer = this.firstTimerInRange(previous, tickTo);\n\
                previous = tickFrom;\n\
            }\n\
\n\
            this.now = tickTo;\n\
\n\
            if (firstException) {\n\
              throw firstException;\n\
            }\n\
\n\
            return this.now;\n\
        },\n\
\n\
        firstTimerInRange: function (from, to) {\n\
            var timer, smallest = null, originalTimer;\n\
\n\
            for (var id in this.timeouts) {\n\
                if (this.timeouts.hasOwnProperty(id)) {\n\
                    if (this.timeouts[id].callAt < from || this.timeouts[id].callAt > to) {\n\
                        continue;\n\
                    }\n\
\n\
                    if (smallest === null || this.timeouts[id].callAt < smallest) {\n\
                        originalTimer = this.timeouts[id];\n\
                        smallest = this.timeouts[id].callAt;\n\
\n\
                        timer = {\n\
                            func: this.timeouts[id].func,\n\
                            callAt: this.timeouts[id].callAt,\n\
                            interval: this.timeouts[id].interval,\n\
                            id: this.timeouts[id].id,\n\
                            invokeArgs: this.timeouts[id].invokeArgs\n\
                        };\n\
                    }\n\
                }\n\
            }\n\
\n\
            return timer || null;\n\
        },\n\
\n\
        callTimer: function (timer) {\n\
            if (typeof timer.interval == \"number\") {\n\
                this.timeouts[timer.id].callAt += timer.interval;\n\
            } else {\n\
                delete this.timeouts[timer.id];\n\
            }\n\
\n\
            try {\n\
                if (typeof timer.func == \"function\") {\n\
                    timer.func.apply(null, timer.invokeArgs);\n\
                } else {\n\
                    eval(timer.func);\n\
                }\n\
            } catch (e) {\n\
              var exception = e;\n\
            }\n\
\n\
            if (!this.timeouts[timer.id]) {\n\
                if (exception) {\n\
                  throw exception;\n\
                }\n\
                return;\n\
            }\n\
\n\
            if (exception) {\n\
              throw exception;\n\
            }\n\
        },\n\
\n\
        reset: function reset() {\n\
            this.timeouts = {};\n\
        },\n\
\n\
        Date: (function () {\n\
            var NativeDate = Date;\n\
\n\
            function ClockDate(year, month, date, hour, minute, second, ms) {\n\
                // Defensive and verbose to avoid potential harm in passing\n\
                // explicit undefined when user does not pass argument\n\
                switch (arguments.length) {\n\
                case 0:\n\
                    return new NativeDate(ClockDate.clock.now);\n\
                case 1:\n\
                    return new NativeDate(year);\n\
                case 2:\n\
                    return new NativeDate(year, month);\n\
                case 3:\n\
                    return new NativeDate(year, month, date);\n\
                case 4:\n\
                    return new NativeDate(year, month, date, hour);\n\
                case 5:\n\
                    return new NativeDate(year, month, date, hour, minute);\n\
                case 6:\n\
                    return new NativeDate(year, month, date, hour, minute, second);\n\
                default:\n\
                    return new NativeDate(year, month, date, hour, minute, second, ms);\n\
                }\n\
            }\n\
\n\
            return mirrorDateProperties(ClockDate, NativeDate);\n\
        }())\n\
    };\n\
\n\
    function mirrorDateProperties(target, source) {\n\
        if (source.now) {\n\
            target.now = function now() {\n\
                return target.clock.now;\n\
            };\n\
        } else {\n\
            delete target.now;\n\
        }\n\
\n\
        if (source.toSource) {\n\
            target.toSource = function toSource() {\n\
                return source.toSource();\n\
            };\n\
        } else {\n\
            delete target.toSource;\n\
        }\n\
\n\
        target.toString = function toString() {\n\
            return source.toString();\n\
        };\n\
\n\
        target.prototype = source.prototype;\n\
        target.parse = source.parse;\n\
        target.UTC = source.UTC;\n\
        target.prototype.toUTCString = source.prototype.toUTCString;\n\
\n\
        for (var prop in source) {\n\
            if (source.hasOwnProperty(prop)) {\n\
                target[prop] = source[prop];\n\
            }\n\
        }\n\
\n\
        return target;\n\
    }\n\
\n\
    var methods = [\"Date\", \"setTimeout\", \"setInterval\",\n\
                   \"clearTimeout\", \"clearInterval\"];\n\
\n\
    if (typeof global.setImmediate !== \"undefined\") {\n\
        methods.push(\"setImmediate\");\n\
    }\n\
\n\
    if (typeof global.clearImmediate !== \"undefined\") {\n\
        methods.push(\"clearImmediate\");\n\
    }\n\
\n\
    function restore() {\n\
        var method;\n\
\n\
        for (var i = 0, l = this.methods.length; i < l; i++) {\n\
            method = this.methods[i];\n\
\n\
            if (global[method].hadOwnProperty) {\n\
                global[method] = this[\"_\" + method];\n\
            } else {\n\
                try {\n\
                    delete global[method];\n\
                } catch (e) {}\n\
            }\n\
        }\n\
\n\
        // Prevent multiple executions which will completely remove these props\n\
        this.methods = [];\n\
    }\n\
\n\
    function stubGlobal(method, clock) {\n\
        clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(global, method);\n\
        clock[\"_\" + method] = global[method];\n\
\n\
        if (method == \"Date\") {\n\
            var date = mirrorDateProperties(clock[method], global[method]);\n\
            global[method] = date;\n\
        } else {\n\
            global[method] = function () {\n\
                return clock[method].apply(clock, arguments);\n\
            };\n\
\n\
            for (var prop in clock[method]) {\n\
                if (clock[method].hasOwnProperty(prop)) {\n\
                    global[method][prop] = clock[method][prop];\n\
                }\n\
            }\n\
        }\n\
\n\
        global[method].clock = clock;\n\
    }\n\
\n\
    sinon.useFakeTimers = function useFakeTimers(now) {\n\
        var clock = sinon.clock.create(now);\n\
        clock.restore = restore;\n\
        clock.methods = Array.prototype.slice.call(arguments,\n\
                                                   typeof now == \"number\" ? 1 : 0);\n\
\n\
        if (clock.methods.length === 0) {\n\
            clock.methods = methods;\n\
        }\n\
\n\
        for (var i = 0, l = clock.methods.length; i < l; i++) {\n\
            stubGlobal(clock.methods[i], clock);\n\
        }\n\
\n\
        return clock;\n\
    };\n\
}(typeof global != \"undefined\" && typeof global !== \"function\" ? global : this));\n\
\n\
sinon.timers = {\n\
    setTimeout: setTimeout,\n\
    clearTimeout: clearTimeout,\n\
    setImmediate: (typeof setImmediate !== \"undefined\" ? setImmediate : undefined),\n\
    clearImmediate: (typeof clearImmediate !== \"undefined\" ? clearImmediate: undefined),\n\
    setInterval: setInterval,\n\
    clearInterval: clearInterval,\n\
    Date: Date\n\
};\n\
\n\
if (typeof module !== 'undefined' && module.exports) {\n\
    module.exports = sinon;\n\
}\n\
\n\
//# sourceURL=vendor/spec/sinon/util/fake_timers.js"
));

require.register("indemma/vendor/spec/sinon/util/fake_xdomain_request.js", Function("exports, module",
"/**\r\n\
 * @depend ../../sinon.js\r\n\
 * @depend event.js\r\n\
 */\r\n\
/*jslint eqeqeq: false, onevar: false*/\r\n\
/*global sinon, module, require, XDomainRequest*/\r\n\
/**\r\n\
 * Fake XDomainRequest object\r\n\
 */\r\n\
\"use strict\";\r\n\
\r\n\
if (typeof sinon == \"undefined\") {\r\n\
    this.sinon = {};\r\n\
}\r\n\
sinon.xdr = { XDomainRequest: this.XDomainRequest };\r\n\
\r\n\
// wrapper for global\r\n\
(function (global) {\r\n\
    var xdr = sinon.xdr;\r\n\
    xdr.GlobalXDomainRequest = global.XDomainRequest;\r\n\
    xdr.supportsXDR = typeof xdr.GlobalXDomainRequest != \"undefined\";\r\n\
    xdr.workingXDR = xdr.supportsXDR ? xdr.GlobalXDomainRequest :  false;\r\n\
\r\n\
    function FakeXDomainRequest() {\r\n\
        this.readyState = FakeXDomainRequest.UNSENT;\r\n\
        this.requestBody = null;\r\n\
        this.requestHeaders = {};\r\n\
        this.status = 0;\r\n\
        this.timeout = null;\r\n\
\r\n\
        if (typeof FakeXDomainRequest.onCreate == \"function\") {\r\n\
            FakeXDomainRequest.onCreate(this);\r\n\
        }\r\n\
    }\r\n\
\r\n\
    function verifyState(xdr) {\r\n\
        if (xdr.readyState !== FakeXDomainRequest.OPENED) {\r\n\
            throw new Error(\"INVALID_STATE_ERR\");\r\n\
        }\r\n\
\r\n\
        if (xdr.sendFlag) {\r\n\
            throw new Error(\"INVALID_STATE_ERR\");\r\n\
        }\r\n\
    }\r\n\
\r\n\
    function verifyRequestSent(xdr) {\r\n\
        if (xdr.readyState == FakeXDomainRequest.UNSENT) {\r\n\
            throw new Error(\"Request not sent\");\r\n\
        }\r\n\
        if (xdr.readyState == FakeXDomainRequest.DONE) {\r\n\
            throw new Error(\"Request done\");\r\n\
        }\r\n\
    }\r\n\
\r\n\
    function verifyResponseBodyType(body) {\r\n\
        if (typeof body != \"string\") {\r\n\
            var error = new Error(\"Attempted to respond to fake XDomainRequest with \" +\r\n\
                                  body + \", which is not a string.\");\r\n\
            error.name = \"InvalidBodyException\";\r\n\
            throw error;\r\n\
        }\r\n\
    }\r\n\
\r\n\
    sinon.extend(FakeXDomainRequest.prototype, sinon.EventTarget, {\r\n\
        open: function open(method, url) {\r\n\
            this.method = method;\r\n\
            this.url = url;\r\n\
\r\n\
            this.responseText = null;\r\n\
            this.sendFlag = false;\r\n\
\r\n\
            this.readyStateChange(FakeXDomainRequest.OPENED);\r\n\
        },\r\n\
\r\n\
        readyStateChange: function readyStateChange(state) {\r\n\
            this.readyState = state;\r\n\
            var eventName = '';\r\n\
            switch (this.readyState) {\r\n\
            case FakeXDomainRequest.UNSENT:\r\n\
                break;\r\n\
            case FakeXDomainRequest.OPENED:\r\n\
                break;\r\n\
            case FakeXDomainRequest.LOADING:\r\n\
                if (this.sendFlag){\r\n\
                    //raise the progress event\r\n\
                    eventName = 'onprogress';\r\n\
                }\r\n\
                break;\r\n\
            case FakeXDomainRequest.DONE:\r\n\
                if (this.isTimeout){\r\n\
                    eventName = 'ontimeout'\r\n\
                }\r\n\
                else if (this.errorFlag || (this.status < 200 || this.status > 299)) {\r\n\
                    eventName = 'onerror';\r\n\
                }\r\n\
                else {\r\n\
                    eventName = 'onload'\r\n\
                }\r\n\
                break;\r\n\
            }\r\n\
\r\n\
            // raising event (if defined)\r\n\
            if (eventName) {\r\n\
                if (typeof this[eventName] == \"function\") {\r\n\
                    try {\r\n\
                        this[eventName]();\r\n\
                    } catch (e) {\r\n\
                        sinon.logError(\"Fake XHR \" + eventName + \" handler\", e);\r\n\
                    }\r\n\
                }\r\n\
            }\r\n\
        },\r\n\
\r\n\
        send: function send(data) {\r\n\
            verifyState(this);\r\n\
\r\n\
            if (!/^(get|head)$/i.test(this.method)) {\r\n\
                this.requestBody = data;\r\n\
            }\r\n\
            this.requestHeaders[\"Content-Type\"] = \"text/plain;charset=utf-8\";\r\n\
\r\n\
            this.errorFlag = false;\r\n\
            this.sendFlag = true;\r\n\
            this.readyStateChange(FakeXDomainRequest.OPENED);\r\n\
\r\n\
            if (typeof this.onSend == \"function\") {\r\n\
                this.onSend(this);\r\n\
            }\r\n\
        },\r\n\
\r\n\
        abort: function abort() {\r\n\
            this.aborted = true;\r\n\
            this.responseText = null;\r\n\
            this.errorFlag = true;\r\n\
\r\n\
            if (this.readyState > sinon.FakeXDomainRequest.UNSENT && this.sendFlag) {\r\n\
                this.readyStateChange(sinon.FakeXDomainRequest.DONE);\r\n\
                this.sendFlag = false;\r\n\
            }\r\n\
        },\r\n\
\r\n\
        setResponseBody: function setResponseBody(body) {\r\n\
            verifyRequestSent(this);\r\n\
            verifyResponseBodyType(body);\r\n\
\r\n\
            var chunkSize = this.chunkSize || 10;\r\n\
            var index = 0;\r\n\
            this.responseText = \"\";\r\n\
\r\n\
            do {\r\n\
                this.readyStateChange(FakeXDomainRequest.LOADING);\r\n\
                this.responseText += body.substring(index, index + chunkSize);\r\n\
                index += chunkSize;\r\n\
            } while (index < body.length);\r\n\
\r\n\
            this.readyStateChange(FakeXDomainRequest.DONE);\r\n\
        },\r\n\
\r\n\
        respond: function respond(status, contentType, body) {\r\n\
            // content-type ignored, since XDomainRequest does not carry this\r\n\
            // we keep the same syntax for respond(...) as for FakeXMLHttpRequest to ease\r\n\
            // test integration across browsers\r\n\
            this.status = typeof status == \"number\" ? status : 200;\r\n\
            this.setResponseBody(body || \"\");\r\n\
        },\r\n\
\r\n\
        simulatetimeout: function(){\r\n\
            this.status = 0;\r\n\
            this.isTimeout = true;\r\n\
            // Access to this should actually throw an error\r\n\
            this.responseText = undefined;\r\n\
            this.readyStateChange(FakeXDomainRequest.DONE);\r\n\
        }\r\n\
    });\r\n\
\r\n\
    sinon.extend(FakeXDomainRequest, {\r\n\
        UNSENT: 0,\r\n\
        OPENED: 1,\r\n\
        LOADING: 3,\r\n\
        DONE: 4\r\n\
    });\r\n\
\r\n\
    sinon.useFakeXDomainRequest = function () {\r\n\
        sinon.FakeXDomainRequest.restore = function restore(keepOnCreate) {\r\n\
            if (xdr.supportsXDR) {\r\n\
                global.XDomainRequest = xdr.GlobalXDomainRequest;\r\n\
            }\r\n\
\r\n\
            delete sinon.FakeXDomainRequest.restore;\r\n\
\r\n\
            if (keepOnCreate !== true) {\r\n\
                delete sinon.FakeXDomainRequest.onCreate;\r\n\
            }\r\n\
        };\r\n\
        if (xdr.supportsXDR) {\r\n\
            global.XDomainRequest = sinon.FakeXDomainRequest;\r\n\
        }\r\n\
        return sinon.FakeXDomainRequest;\r\n\
    };\r\n\
\r\n\
    sinon.FakeXDomainRequest = FakeXDomainRequest;\r\n\
})(this);\r\n\
\r\n\
if (typeof module == \"object\" && typeof require == \"function\") {\r\n\
    module.exports = sinon;\r\n\
}\r\n\
\n\
//# sourceURL=vendor/spec/sinon/util/fake_xdomain_request.js"
));

require.register("indemma/vendor/spec/sinon/util/fake_xml_http_request.js", Function("exports, module",
"/**\n\
 * @depend ../../sinon.js\n\
 * @depend event.js\n\
 */\n\
/*jslint eqeqeq: false, onevar: false*/\n\
/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/\n\
/**\n\
 * Fake XMLHttpRequest object\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
\"use strict\";\n\
\n\
// wrapper for global\n\
(function(global) {\n\
    if (typeof sinon === \"undefined\") {\n\
        global.sinon = {};\n\
    }\n\
\n\
    var supportsProgress = typeof ProgressEvent !== \"undefined\";\n\
    var supportsCustomEvent = typeof CustomEvent !== \"undefined\";\n\
    sinon.xhr = { XMLHttpRequest: global.XMLHttpRequest };\n\
    var xhr = sinon.xhr;\n\
    xhr.GlobalXMLHttpRequest = global.XMLHttpRequest;\n\
    xhr.GlobalActiveXObject = global.ActiveXObject;\n\
    xhr.supportsActiveX = typeof xhr.GlobalActiveXObject != \"undefined\";\n\
    xhr.supportsXHR = typeof xhr.GlobalXMLHttpRequest != \"undefined\";\n\
    xhr.workingXHR = xhr.supportsXHR ? xhr.GlobalXMLHttpRequest : xhr.supportsActiveX\n\
                                     ? function() { return new xhr.GlobalActiveXObject(\"MSXML2.XMLHTTP.3.0\") } : false;\n\
    xhr.supportsCORS = 'withCredentials' in (new sinon.xhr.GlobalXMLHttpRequest());\n\
\n\
    /*jsl:ignore*/\n\
    var unsafeHeaders = {\n\
        \"Accept-Charset\": true,\n\
        \"Accept-Encoding\": true,\n\
        \"Connection\": true,\n\
        \"Content-Length\": true,\n\
        \"Cookie\": true,\n\
        \"Cookie2\": true,\n\
        \"Content-Transfer-Encoding\": true,\n\
        \"Date\": true,\n\
        \"Expect\": true,\n\
        \"Host\": true,\n\
        \"Keep-Alive\": true,\n\
        \"Referer\": true,\n\
        \"TE\": true,\n\
        \"Trailer\": true,\n\
        \"Transfer-Encoding\": true,\n\
        \"Upgrade\": true,\n\
        \"User-Agent\": true,\n\
        \"Via\": true\n\
    };\n\
    /*jsl:end*/\n\
\n\
    function FakeXMLHttpRequest() {\n\
        this.readyState = FakeXMLHttpRequest.UNSENT;\n\
        this.requestHeaders = {};\n\
        this.requestBody = null;\n\
        this.status = 0;\n\
        this.statusText = \"\";\n\
        this.upload = new UploadProgress();\n\
        if (sinon.xhr.supportsCORS) {\n\
            this.withCredentials = false;\n\
        }\n\
\n\
\n\
        var xhr = this;\n\
        var events = [\"loadstart\", \"load\", \"abort\", \"loadend\"];\n\
\n\
        function addEventListener(eventName) {\n\
            xhr.addEventListener(eventName, function (event) {\n\
                var listener = xhr[\"on\" + eventName];\n\
\n\
                if (listener && typeof listener == \"function\") {\n\
                    listener.call(this, event);\n\
                }\n\
            });\n\
        }\n\
\n\
        for (var i = events.length - 1; i >= 0; i--) {\n\
            addEventListener(events[i]);\n\
        }\n\
\n\
        if (typeof FakeXMLHttpRequest.onCreate == \"function\") {\n\
            FakeXMLHttpRequest.onCreate(this);\n\
        }\n\
    }\n\
\n\
    // An upload object is created for each\n\
    // FakeXMLHttpRequest and allows upload\n\
    // events to be simulated using uploadProgress\n\
    // and uploadError.\n\
    function UploadProgress() {\n\
        this.eventListeners = {\n\
            \"progress\": [],\n\
            \"load\": [],\n\
            \"abort\": [],\n\
            \"error\": []\n\
        }\n\
    }\n\
\n\
    UploadProgress.prototype.addEventListener = function(event, listener) {\n\
        this.eventListeners[event].push(listener);\n\
    };\n\
\n\
    UploadProgress.prototype.removeEventListener = function(event, listener) {\n\
        var listeners = this.eventListeners[event] || [];\n\
\n\
        for (var i = 0, l = listeners.length; i < l; ++i) {\n\
            if (listeners[i] == listener) {\n\
                return listeners.splice(i, 1);\n\
            }\n\
        }\n\
    };\n\
\n\
    UploadProgress.prototype.dispatchEvent = function(event) {\n\
        var listeners = this.eventListeners[event.type] || [];\n\
\n\
        for (var i = 0, listener; (listener = listeners[i]) != null; i++) {\n\
            listener(event);\n\
        }\n\
    };\n\
\n\
    function verifyState(xhr) {\n\
        if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {\n\
            throw new Error(\"INVALID_STATE_ERR\");\n\
        }\n\
\n\
        if (xhr.sendFlag) {\n\
            throw new Error(\"INVALID_STATE_ERR\");\n\
        }\n\
    }\n\
\n\
    // filtering to enable a white-list version of Sinon FakeXhr,\n\
    // where whitelisted requests are passed through to real XHR\n\
    function each(collection, callback) {\n\
        if (!collection) return;\n\
        for (var i = 0, l = collection.length; i < l; i += 1) {\n\
            callback(collection[i]);\n\
        }\n\
    }\n\
    function some(collection, callback) {\n\
        for (var index = 0; index < collection.length; index++) {\n\
            if(callback(collection[index]) === true) return true;\n\
        }\n\
        return false;\n\
    }\n\
    // largest arity in XHR is 5 - XHR#open\n\
    var apply = function(obj,method,args) {\n\
        switch(args.length) {\n\
        case 0: return obj[method]();\n\
        case 1: return obj[method](args[0]);\n\
        case 2: return obj[method](args[0],args[1]);\n\
        case 3: return obj[method](args[0],args[1],args[2]);\n\
        case 4: return obj[method](args[0],args[1],args[2],args[3]);\n\
        case 5: return obj[method](args[0],args[1],args[2],args[3],args[4]);\n\
        }\n\
    };\n\
\n\
    FakeXMLHttpRequest.filters = [];\n\
    FakeXMLHttpRequest.addFilter = function(fn) {\n\
        this.filters.push(fn)\n\
    };\n\
    var IE6Re = /MSIE 6/;\n\
    FakeXMLHttpRequest.defake = function(fakeXhr,xhrArgs) {\n\
        var xhr = new sinon.xhr.workingXHR();\n\
        each([\"open\",\"setRequestHeader\",\"send\",\"abort\",\"getResponseHeader\",\n\
              \"getAllResponseHeaders\",\"addEventListener\",\"overrideMimeType\",\"removeEventListener\"],\n\
             function(method) {\n\
                 fakeXhr[method] = function() {\n\
                   return apply(xhr,method,arguments);\n\
                 };\n\
             });\n\
\n\
        var copyAttrs = function(args) {\n\
            each(args, function(attr) {\n\
              try {\n\
                fakeXhr[attr] = xhr[attr]\n\
              } catch(e) {\n\
                if(!IE6Re.test(navigator.userAgent)) throw e;\n\
              }\n\
            });\n\
        };\n\
\n\
        var stateChange = function() {\n\
            fakeXhr.readyState = xhr.readyState;\n\
            if(xhr.readyState >= FakeXMLHttpRequest.HEADERS_RECEIVED) {\n\
                copyAttrs([\"status\",\"statusText\"]);\n\
            }\n\
            if(xhr.readyState >= FakeXMLHttpRequest.LOADING) {\n\
                copyAttrs([\"responseText\"]);\n\
            }\n\
            if(xhr.readyState === FakeXMLHttpRequest.DONE) {\n\
                copyAttrs([\"responseXML\"]);\n\
            }\n\
            if(fakeXhr.onreadystatechange) fakeXhr.onreadystatechange.call(fakeXhr, { target: fakeXhr });\n\
        };\n\
        if(xhr.addEventListener) {\n\
          for(var event in fakeXhr.eventListeners) {\n\
              if(fakeXhr.eventListeners.hasOwnProperty(event)) {\n\
                  each(fakeXhr.eventListeners[event],function(handler) {\n\
                      xhr.addEventListener(event, handler);\n\
                  });\n\
              }\n\
          }\n\
          xhr.addEventListener(\"readystatechange\",stateChange);\n\
        } else {\n\
          xhr.onreadystatechange = stateChange;\n\
        }\n\
        apply(xhr,\"open\",xhrArgs);\n\
    };\n\
    FakeXMLHttpRequest.useFilters = false;\n\
\n\
    function verifyRequestOpened(xhr) {\n\
        if (xhr.readyState != FakeXMLHttpRequest.OPENED) {\n\
            throw new Error(\"INVALID_STATE_ERR - \" + xhr.readyState);\n\
        }\n\
    }\n\
\n\
    function verifyRequestSent(xhr) {\n\
        if (xhr.readyState == FakeXMLHttpRequest.DONE) {\n\
            throw new Error(\"Request done\");\n\
        }\n\
    }\n\
\n\
    function verifyHeadersReceived(xhr) {\n\
        if (xhr.async && xhr.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {\n\
            throw new Error(\"No headers received\");\n\
        }\n\
    }\n\
\n\
    function verifyResponseBodyType(body) {\n\
        if (typeof body != \"string\") {\n\
            var error = new Error(\"Attempted to respond to fake XMLHttpRequest with \" +\n\
                                 body + \", which is not a string.\");\n\
            error.name = \"InvalidBodyException\";\n\
            throw error;\n\
        }\n\
    }\n\
\n\
    sinon.extend(FakeXMLHttpRequest.prototype, sinon.EventTarget, {\n\
        async: true,\n\
\n\
        open: function open(method, url, async, username, password) {\n\
            this.method = method;\n\
            this.url = url;\n\
            this.async = typeof async == \"boolean\" ? async : true;\n\
            this.username = username;\n\
            this.password = password;\n\
            this.responseText = null;\n\
            this.responseXML = null;\n\
            this.requestHeaders = {};\n\
            this.sendFlag = false;\n\
            if(sinon.FakeXMLHttpRequest.useFilters === true) {\n\
                var xhrArgs = arguments;\n\
                var defake = some(FakeXMLHttpRequest.filters,function(filter) {\n\
                    return filter.apply(this,xhrArgs)\n\
                });\n\
                if (defake) {\n\
                  return sinon.FakeXMLHttpRequest.defake(this,arguments);\n\
                }\n\
            }\n\
            this.readyStateChange(FakeXMLHttpRequest.OPENED);\n\
        },\n\
\n\
        readyStateChange: function readyStateChange(state) {\n\
            this.readyState = state;\n\
\n\
            if (typeof this.onreadystatechange == \"function\") {\n\
                try {\n\
                    this.onreadystatechange();\n\
                } catch (e) {\n\
                    sinon.logError(\"Fake XHR onreadystatechange handler\", e);\n\
                }\n\
            }\n\
\n\
            this.dispatchEvent(new sinon.Event(\"readystatechange\"));\n\
\n\
            switch (this.readyState) {\n\
                case FakeXMLHttpRequest.DONE:\n\
                    this.dispatchEvent(new sinon.Event(\"load\", false, false, this));\n\
                    this.dispatchEvent(new sinon.Event(\"loadend\", false, false, this));\n\
                    this.upload.dispatchEvent(new sinon.Event(\"load\", false, false, this));\n\
                    if (supportsProgress) {\n\
                        this.upload.dispatchEvent(new sinon.ProgressEvent('progress', {loaded: 100, total: 100}));\n\
                    }\n\
                    break;\n\
            }\n\
        },\n\
\n\
        setRequestHeader: function setRequestHeader(header, value) {\n\
            verifyState(this);\n\
\n\
            if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {\n\
                throw new Error(\"Refused to set unsafe header \\\"\" + header + \"\\\"\");\n\
            }\n\
\n\
            if (this.requestHeaders[header]) {\n\
                this.requestHeaders[header] += \",\" + value;\n\
            } else {\n\
                this.requestHeaders[header] = value;\n\
            }\n\
        },\n\
\n\
        // Helps testing\n\
        setResponseHeaders: function setResponseHeaders(headers) {\n\
            verifyRequestOpened(this);\n\
            this.responseHeaders = {};\n\
\n\
            for (var header in headers) {\n\
                if (headers.hasOwnProperty(header)) {\n\
                    this.responseHeaders[header] = headers[header];\n\
                }\n\
            }\n\
\n\
            if (this.async) {\n\
                this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);\n\
            } else {\n\
                this.readyState = FakeXMLHttpRequest.HEADERS_RECEIVED;\n\
            }\n\
        },\n\
\n\
        // Currently treats ALL data as a DOMString (i.e. no Document)\n\
        send: function send(data) {\n\
            verifyState(this);\n\
\n\
            if (!/^(get|head)$/i.test(this.method)) {\n\
                if (this.requestHeaders[\"Content-Type\"]) {\n\
                    var value = this.requestHeaders[\"Content-Type\"].split(\";\");\n\
                    this.requestHeaders[\"Content-Type\"] = value[0] + \";charset=utf-8\";\n\
                } else {\n\
                    this.requestHeaders[\"Content-Type\"] = \"text/plain;charset=utf-8\";\n\
                }\n\
\n\
                this.requestBody = data;\n\
            }\n\
\n\
            this.errorFlag = false;\n\
            this.sendFlag = this.async;\n\
            this.readyStateChange(FakeXMLHttpRequest.OPENED);\n\
\n\
            if (typeof this.onSend == \"function\") {\n\
                this.onSend(this);\n\
            }\n\
\n\
            this.dispatchEvent(new sinon.Event(\"loadstart\", false, false, this));\n\
        },\n\
\n\
        abort: function abort() {\n\
            this.aborted = true;\n\
            this.responseText = null;\n\
            this.errorFlag = true;\n\
            this.requestHeaders = {};\n\
\n\
            if (this.readyState > sinon.FakeXMLHttpRequest.UNSENT && this.sendFlag) {\n\
                this.readyStateChange(sinon.FakeXMLHttpRequest.DONE);\n\
                this.sendFlag = false;\n\
            }\n\
\n\
            this.readyState = sinon.FakeXMLHttpRequest.UNSENT;\n\
\n\
            this.dispatchEvent(new sinon.Event(\"abort\", false, false, this));\n\
\n\
            this.upload.dispatchEvent(new sinon.Event(\"abort\", false, false, this));\n\
\n\
            if (typeof this.onerror === \"function\") {\n\
                this.onerror();\n\
            }\n\
        },\n\
\n\
        getResponseHeader: function getResponseHeader(header) {\n\
            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {\n\
                return null;\n\
            }\n\
\n\
            if (/^Set-Cookie2?$/i.test(header)) {\n\
                return null;\n\
            }\n\
\n\
            header = header.toLowerCase();\n\
\n\
            for (var h in this.responseHeaders) {\n\
                if (h.toLowerCase() == header) {\n\
                    return this.responseHeaders[h];\n\
                }\n\
            }\n\
\n\
            return null;\n\
        },\n\
\n\
        getAllResponseHeaders: function getAllResponseHeaders() {\n\
            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {\n\
                return \"\";\n\
            }\n\
\n\
            var headers = \"\";\n\
\n\
            for (var header in this.responseHeaders) {\n\
                if (this.responseHeaders.hasOwnProperty(header) &&\n\
                    !/^Set-Cookie2?$/i.test(header)) {\n\
                    headers += header + \": \" + this.responseHeaders[header] + \"\\r\\n\
\";\n\
                }\n\
            }\n\
\n\
            return headers;\n\
        },\n\
\n\
        setResponseBody: function setResponseBody(body) {\n\
            verifyRequestSent(this);\n\
            verifyHeadersReceived(this);\n\
            verifyResponseBodyType(body);\n\
\n\
            var chunkSize = this.chunkSize || 10;\n\
            var index = 0;\n\
            this.responseText = \"\";\n\
\n\
            do {\n\
                if (this.async) {\n\
                    this.readyStateChange(FakeXMLHttpRequest.LOADING);\n\
                }\n\
\n\
                this.responseText += body.substring(index, index + chunkSize);\n\
                index += chunkSize;\n\
            } while (index < body.length);\n\
\n\
            var type = this.getResponseHeader(\"Content-Type\");\n\
\n\
            if (this.responseText &&\n\
                (!type || /(text\\/xml)|(application\\/xml)|(\\+xml)/.test(type))) {\n\
                try {\n\
                    this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);\n\
                } catch (e) {\n\
                    // Unable to parse XML - no biggie\n\
                }\n\
            }\n\
\n\
            if (this.async) {\n\
                this.readyStateChange(FakeXMLHttpRequest.DONE);\n\
            } else {\n\
                this.readyState = FakeXMLHttpRequest.DONE;\n\
            }\n\
        },\n\
\n\
        respond: function respond(status, headers, body) {\n\
            this.status = typeof status == \"number\" ? status : 200;\n\
            this.statusText = FakeXMLHttpRequest.statusCodes[this.status];\n\
            this.setResponseHeaders(headers || {});\n\
            this.setResponseBody(body || \"\");\n\
        },\n\
\n\
        uploadProgress: function uploadProgress(progressEventRaw) {\n\
            if (supportsProgress) {\n\
                this.upload.dispatchEvent(new sinon.ProgressEvent(\"progress\", progressEventRaw));\n\
            }\n\
        },\n\
\n\
        uploadError: function uploadError(error) {\n\
            if (supportsCustomEvent) {\n\
                this.upload.dispatchEvent(new sinon.CustomEvent(\"error\", {\"detail\": error}));\n\
            }\n\
        }\n\
    });\n\
\n\
    sinon.extend(FakeXMLHttpRequest, {\n\
        UNSENT: 0,\n\
        OPENED: 1,\n\
        HEADERS_RECEIVED: 2,\n\
        LOADING: 3,\n\
        DONE: 4\n\
    });\n\
\n\
    // Borrowed from JSpec\n\
    FakeXMLHttpRequest.parseXML = function parseXML(text) {\n\
        var xmlDoc;\n\
\n\
        if (typeof DOMParser != \"undefined\") {\n\
            var parser = new DOMParser();\n\
            xmlDoc = parser.parseFromString(text, \"text/xml\");\n\
        } else {\n\
            xmlDoc = new ActiveXObject(\"Microsoft.XMLDOM\");\n\
            xmlDoc.async = \"false\";\n\
            xmlDoc.loadXML(text);\n\
        }\n\
\n\
        return xmlDoc;\n\
    };\n\
\n\
    FakeXMLHttpRequest.statusCodes = {\n\
        100: \"Continue\",\n\
        101: \"Switching Protocols\",\n\
        200: \"OK\",\n\
        201: \"Created\",\n\
        202: \"Accepted\",\n\
        203: \"Non-Authoritative Information\",\n\
        204: \"No Content\",\n\
        205: \"Reset Content\",\n\
        206: \"Partial Content\",\n\
        300: \"Multiple Choice\",\n\
        301: \"Moved Permanently\",\n\
        302: \"Found\",\n\
        303: \"See Other\",\n\
        304: \"Not Modified\",\n\
        305: \"Use Proxy\",\n\
        307: \"Temporary Redirect\",\n\
        400: \"Bad Request\",\n\
        401: \"Unauthorized\",\n\
        402: \"Payment Required\",\n\
        403: \"Forbidden\",\n\
        404: \"Not Found\",\n\
        405: \"Method Not Allowed\",\n\
        406: \"Not Acceptable\",\n\
        407: \"Proxy Authentication Required\",\n\
        408: \"Request Timeout\",\n\
        409: \"Conflict\",\n\
        410: \"Gone\",\n\
        411: \"Length Required\",\n\
        412: \"Precondition Failed\",\n\
        413: \"Request Entity Too Large\",\n\
        414: \"Request-URI Too Long\",\n\
        415: \"Unsupported Media Type\",\n\
        416: \"Requested Range Not Satisfiable\",\n\
        417: \"Expectation Failed\",\n\
        422: \"Unprocessable Entity\",\n\
        500: \"Internal Server Error\",\n\
        501: \"Not Implemented\",\n\
        502: \"Bad Gateway\",\n\
        503: \"Service Unavailable\",\n\
        504: \"Gateway Timeout\",\n\
        505: \"HTTP Version Not Supported\"\n\
    };\n\
\n\
    sinon.useFakeXMLHttpRequest = function () {\n\
        sinon.FakeXMLHttpRequest.restore = function restore(keepOnCreate) {\n\
            if (xhr.supportsXHR) {\n\
                global.XMLHttpRequest = xhr.GlobalXMLHttpRequest;\n\
            }\n\
\n\
            if (xhr.supportsActiveX) {\n\
                global.ActiveXObject = xhr.GlobalActiveXObject;\n\
            }\n\
\n\
            delete sinon.FakeXMLHttpRequest.restore;\n\
\n\
            if (keepOnCreate !== true) {\n\
                delete sinon.FakeXMLHttpRequest.onCreate;\n\
            }\n\
        };\n\
        if (xhr.supportsXHR) {\n\
            global.XMLHttpRequest = sinon.FakeXMLHttpRequest;\n\
        }\n\
\n\
        if (xhr.supportsActiveX) {\n\
            global.ActiveXObject = function ActiveXObject(objId) {\n\
                if (objId == \"Microsoft.XMLHTTP\" || /^Msxml2\\.XMLHTTP/i.test(objId)) {\n\
\n\
                    return new sinon.FakeXMLHttpRequest();\n\
                }\n\
\n\
                return new xhr.GlobalActiveXObject(objId);\n\
            };\n\
        }\n\
\n\
        return sinon.FakeXMLHttpRequest;\n\
    };\n\
\n\
    sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;\n\
\n\
})(typeof global === \"object\" ? global : this);\n\
\n\
if (typeof module !== 'undefined' && module.exports) {\n\
    module.exports = sinon;\n\
}\n\
\n\
//# sourceURL=vendor/spec/sinon/util/fake_xml_http_request.js"
));

require.register("indemma/vendor/spec/sinon/util/timers_ie.js", Function("exports, module",
"/*global sinon, setTimeout, setInterval, clearTimeout, clearInterval, Date*/\n\
/**\n\
 * Helps IE run the fake timers. By defining global functions, IE allows\n\
 * them to be overwritten at a later point. If these are not defined like\n\
 * this, overwriting them will result in anything from an exception to browser\n\
 * crash.\n\
 *\n\
 * If you don't require fake timers to work in IE, don't include this file.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
function setTimeout() {}\n\
function clearTimeout() {}\n\
function setImmediate() {}\n\
function clearImmediate() {}\n\
function setInterval() {}\n\
function clearInterval() {}\n\
function Date() {}\n\
\n\
// Reassign the original functions. Now their writable attribute\n\
// should be true. Hackish, I know, but it works.\n\
setTimeout = sinon.timers.setTimeout;\n\
clearTimeout = sinon.timers.clearTimeout;\n\
setImmediate = sinon.timers.setImmediate;\n\
clearImmediate = sinon.timers.clearImmediate;\n\
setInterval = sinon.timers.setInterval;\n\
clearInterval = sinon.timers.clearInterval;\n\
Date = sinon.timers.Date;\n\
\n\
//# sourceURL=vendor/spec/sinon/util/timers_ie.js"
));

require.register("indemma/vendor/spec/sinon/util/xdr_ie.js", Function("exports, module",
"/*global sinon*/\r\n\
/**\r\n\
 * Helps IE run the fake XDomainRequest. By defining global functions, IE allows\r\n\
 * them to be overwritten at a later point. If these are not defined like\r\n\
 * this, overwriting them will result in anything from an exception to browser\r\n\
 * crash.\r\n\
 *\r\n\
 * If you don't require fake XDR to work in IE, don't include this file.\r\n\
 */\r\n\
function XDomainRequest() {}\r\n\
\r\n\
// Reassign the original function. Now its writable attribute\r\n\
// should be true. Hackish, I know, but it works.\r\n\
XDomainRequest = sinon.xdr.XDomainRequest || undefined;\r\n\
\n\
//# sourceURL=vendor/spec/sinon/util/xdr_ie.js"
));

require.register("indemma/vendor/spec/sinon/util/xhr_ie.js", Function("exports, module",
"/*global sinon*/\n\
/**\n\
 * Helps IE run the fake XMLHttpRequest. By defining global functions, IE allows\n\
 * them to be overwritten at a later point. If these are not defined like\n\
 * this, overwriting them will result in anything from an exception to browser\n\
 * crash.\n\
 *\n\
 * If you don't require fake XHR to work in IE, don't include this file.\n\
 *\n\
 * @author Christian Johansen (christian@cjohansen.no)\n\
 * @license BSD\n\
 *\n\
 * Copyright (c) 2010-2013 Christian Johansen\n\
 */\n\
function XMLHttpRequest() {}\n\
\n\
// Reassign the original function. Now its writable attribute\n\
// should be true. Hackish, I know, but it works.\n\
XMLHttpRequest = sinon.xhr.XMLHttpRequest || undefined;\n\
\n\
//# sourceURL=vendor/spec/sinon/util/xhr_ie.js"
));

require.modules["indemma"] = require.modules["indemma"];


require("indemma")
