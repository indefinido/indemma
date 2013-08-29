var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable');

describe('model #() validates_cpf_format', function() {
  return describe('basic usage', function() {
    var model, person;

    model = root.model;
    person = null;
    beforeEach(function() {
      return person = model.call({
        resource: 'person',
        cpf: String,
        validates_cpf_format: 'cpf'
      });
    });
    afterEach(function() {
      return person != null ? person.validators.length = 0 : void 0;
    });
    return describe('#validate', function() {
      return it('should add error to record when fields is in invalid format', function() {
        var arthur;

        arthur = person({
          cpf: '871.943.417-00'
        });
        arthur.valid;
        return arthur.errors.messages.should.have.deep.property('cpf', "O campo cpf não está válido.");
      });
    });
  });
});
