var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable');

describe('model ( validates_associated: ... )', function() {
  return describe('basic usage', function() {
    var address, model, person;

    model = root.model;
    person = address = null;
    beforeEach(function() {
      address = model.call({
        resource: 'address',
        street: String,
        validates_presence_of: 'street'
      });
      return person = model.call({
        resource: 'person',
        has_one: 'address',
        validates_associated: 'address'
      });
    });
    afterEach(function() {
      person.validators.length = 0;
      return address.validators.length = 0;
    });
    return describe('.validate()', function() {
      return it('should add error to record when fields does not match', function() {
        var arthur;

        arthur = person({});
        arthur.build_address({
          street: null
        });
        arthur.valid;
        arthur.errors.messages.should.have.deep.property('address', 'O registro associado address não é válido.');
        return arthur.address.errors.messages.should.have.deep.property('street', 'O campo street não pode ficar em branco.');
      });
    });
  });
});
