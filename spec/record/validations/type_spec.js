var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable.js');

describe('model #() validates type of', function() {
  return describe('basic usage', function() {
    var model, person;

    model = root.model;
    person = null;
    beforeEach(function() {
      return person = model.call({
        resource: 'person',
        name: String,
        phone: Phone,
        validates_type_of: ['name', 'phone']
      });
    });
    afterEach(function() {
      return person.validators.length = 0;
    });
    return describe('#validate', function() {
      it('should use Phone#validate to find out if attribute is valid');
      it('should add error to record when phone typed attribute has an non valid phone value', function() {
        var arthur;

        arthur = person({
          phone: new Phone('batata')
        });
        arthur.valid.should.be["false"];
        arthur.errors.messages.should.have.property('phone');
        return expect(arthur.errors.messages.phone).to.match(/não está válido/);
      });
      return it('should throw error to when phone typed attribute has an non phone value', function() {
        var arthur;

        arthur = person({
          phone: 'batata'
        });
        return expect(function() {
          return arthur.valid;
        }).to["throw"](/invalid attribute value type/i);
      });
    });
  });
});
