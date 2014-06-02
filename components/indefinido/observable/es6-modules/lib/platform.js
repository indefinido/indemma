if (!Object.prototype.create) {
  require("../vendor/shims/object.create");
}

if (!Array.prototype.indexOf) {
  require("../vendor/shims/array.indexOf");
}

if (typeof require !== "undefined") {
  require("../vendor/shims/accessors-legacy.js");
  require("../vendor/shims/accessors.js");
}
