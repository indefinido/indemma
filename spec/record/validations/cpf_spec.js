var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable.js');

describe('model #() validates_cpf_format', function() {
  return describe('basic usage', function() {
    var model;

    model = root.model;
    beforeEach(function() {
      return this.person = model.call({
        resource: 'person',
        cpf: String,
        validates_cpf_format: 'cpf'
      });
    });
    afterEach(function() {
      return this.person.validators.length = 0;
    });
    return describe('#validate', function() {
      return it('should add error to record when fields is in invalid format', function() {
        var arthur;

        arthur = this.person({
          cpf: '871.95FRANGO-00'
        });
        arthur.valid;
        return arthur.errors.messages.should.have.deep.property('cpf', "O campo cpf não está válido.");
      });
    });
  });
});
