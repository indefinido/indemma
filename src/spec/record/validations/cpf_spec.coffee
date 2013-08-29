root = exports ? window

require 'indemma/lib/record/validatable'

describe 'model #() validates_cpf_format',  ->

  describe 'basic usage', ->
    model  = root.model
    person = null

    beforeEach ->
      person = model.call
        resource : 'person'
        cpf      : String
        validates_cpf_format: 'cpf'

    afterEach ->
      # Clear validators from resource
      person?.validators.length = 0

    describe '#validate', ->

      it 'should add error to record when fields is in invalid format', ->
        arthur = person cpf: '871.943.417-00'
        arthur.valid

        # TODO figure out why the heck the validators aren't being reset
        arthur.errors.messages.should.have.deep.property 'cpf', "O campo cpf não está válido."
