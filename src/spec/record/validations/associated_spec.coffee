root = exports ? window

require 'indemma/lib/record/validatable'

describe 'model #() validates_associated',  ->

  describe 'basic usage', ->
    model  = root.model
    person = address = null

    beforeEach ->
      address = model.call
        resource : 'address'
        street   : String
        validates_presence_of: 'street'

      person = model.call
        resource : 'person'
        has_one  : 'address'
        validates_associated: 'address'

    afterEach ->
      person.validators.length  = 0
      address.validators.length = 0

    describe '#validate', ->

      it 'should add error to record when fields does not match', ->
        arthur = person {}
        arthur.build_address street: null

        arthur.valid

        arthur.errors.messages.should.have.deep.property 'address', 'O registro associado address não é válido.'
        arthur.address.errors.messages.should.have.deep.property 'street', 'O campo street não pode ficar em branco.'
