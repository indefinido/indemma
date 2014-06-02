var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/translationable.js');

describe('model', function() {
  var model, person;

  model = root.model;
  person = null;
  beforeEach(function() {
    return person = model.call({
      resource: 'person',
      name: String,
      translation: {
        attributes: {
          name: 'Batata'
        }
      }
    });
  });
  return describe('#human_attribute_name', function() {
    return it('should return the translated attribute name', function() {
      return person.human_attribute_name('name').should.be.eq('Batata');
    });
  });
});
