var jQuery, model, record, root;

require('indemma/lib/record/restfulable');

require('indemma/lib/record/resource');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

jQuery = require('component-jquery');

describe('resource', function() {
  describe('when included', function() {
    return xit('sets the resource loaded flag on model', function() {});
  });
  return describe('model', function() {
    it('add methods to model object');
    describe('#pluralize', function() {
      return xit('transforms word into plural form');
    });
    return describe('#singularize', function() {
      return xit('transforms word into singular form');
    });
  });
});
