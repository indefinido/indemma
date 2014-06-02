import jQuery from 'jquery';
var requiresDomElement, selection;

requiresDomElement = Object.defineProperty.requiresDomElement;

selection = function(observable) {
  if (requiresDomElement) {
    selection.generate_ignores(observable);
    return selection.legacy;
  } else {
    return selection.from_call;
  }
};

selection.legacy = function() {
  var fix, object;

  object = selection.from_call.apply(this, arguments);
  if (!jQuery.isReady) {
    throw new Error("observable.call: For compatibility reasons, observable can only be called when dom is loaded.");
  }
  if (typeof object.nodeName !== "string") {
    fix = document.createElement("fix");
    document.body.appendChild(fix);
    object = jQuery.extend(fix, object);
  }
  return object;
};

selection.generate_ignores = function(observable) {
  var fix_ignores, ignores, property;

  ignores = document.createElement("fix");
  fix_ignores = [];
  property = void 0;
  for (property in ignores) {
    fix_ignores.push(property);
  }
  return observable.ignores = fix_ignores;
};

selection.from_call = function(param) {
  var object;

  if (this === window) {
    object = param || {};
  } else if (this !== window) {
    if (param) {
      throw new TypeError("Two objects provided! Call either with observable.call(object) or observable(object), not with observable.call(param, param)");
    } else {
      object = this;
    }
  }
  return object;
};

export default selection;
