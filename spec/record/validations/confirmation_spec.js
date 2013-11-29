var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable');

describe('model #() validates_confirmation_of', function() {
  return describe('basic usage', function() {
    var model, person;

    model = root.model;
    person = null;
    beforeEach(function() {
      return person = model.call({
        resource: 'person',
        password: String,
        validates_confirmation_of: 'password'
      });
    });
    afterEach(function() {
      return person.validators.length = 0;
    });
    return describe('#validate', function() {
      return it('should add error to record when fields does not match', function() {
        var arthur;

        arthur = person({
          password: "domo",
          password_confirmation: "kun"
        });
        arthur.valid;
        return arthur.errors.messages.should.have.deep.property('password_confirmation', 'O campo password não está de acordo com o campo password_confirmation.');
      });
    });
  });
});
