var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable');

describe('model #() validates presence of', function() {
  return describe('basic usage', function() {
    var model, person;

    model = root.model;
    person = null;
    beforeEach(function() {
      return person = model.call({
        resource: 'person',
        name: String,
        belongs_to: 'corporation',
        validates_presence_of: 'name'
      });
    });
    afterEach(function() {
      return person.validators.length = 0;
    });
    return describe('#validate', function() {
      return it('should add error to record when required field is empty (null, undefined or \'\')');
    });
  });
});
