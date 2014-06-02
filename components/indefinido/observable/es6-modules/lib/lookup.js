var lookup;

lookup = {
  setter: Object.prototype.__lookupSetter__ || function(property) {
    return this.observed && this.observed[property + "_setter"];
  },
  getter: Object.prototype.__lookupGetter__ || function(property) {
    var default_getter;

    default_getter = void 0;
    return this.observed && this.observed[property + "_getter"] || ((default_getter = $.proxy(lookup.default_getter, this, property)) && (default_getter.is_default = true) && default_getter);
  },
  types: {
    undefined: undefined,
    "null": null,
    "true": true,
    "false": false,
    NaN: NaN
  },
  basic_types: [undefined, null],
  default_getter: function(property) {
    var possible_value;

    possible_value = this[property];
    if (possible_value && possible_value.hasOwnProperty("toString")) {
      if (possible_value.toString.is_default) {
        return this.observed[property];
      }
      return possible_value.toString.call(this);
    } else if (possible_value in lookup.types) {
      return lookup.types[possible_value];
    } else {
      return possible_value;
    }
  }
};

export default lookup;
