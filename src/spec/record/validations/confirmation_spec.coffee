root = exports ? window

require 'indemma/lib/record/validatable'

describe 'model #() validates_confirmation_of',  ->

  describe 'basic usage', ->
    model  = root.model
    person = null

    beforeEach ->
      person = model.call
        resource : 'person'
        password : String
        validates_confirmation_of: 'password'

    afterEach ->
      person.validators.length = 0

    describe '#validate', ->

      it 'should add error to record when fields does not match', ->
        arthur = person password: "domo", password_confirmation: "kun"
        arthur.valid
        arthur.errors.messages.should.have.deep.property 'password_confirmation', 'O campo password não está de acordo com o campo password_confirmation.'
