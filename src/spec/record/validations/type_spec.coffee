root = exports ? window

require 'indemma/lib/record/validatable'

describe 'model #() validates type of',  ->

  describe 'basic usage', ->
    model  = root.model
    person = null

    beforeEach ->
      person = model.call
        resource  : 'person'
        name      : String
        phone     : Phone
        validates_type_of: ['name', 'phone']

    afterEach ->
      person.validators.length = 0

    describe '#validate', ->

      #it 'should use Phone#valid getter to find out if object is valid'
      it 'should use Phone#validate to find out if attribute is valid'
      it 'should add error to record when phone typed attribute has an non valid phone value', ->
        arthur = person phone: new Phone 'batata'
        arthur.valid.should.be.false
        arthur.errors.messages.should.have.property 'phone'
        expect(arthur.errors.messages.phone).to.match /não está válido/

      it 'should throw error to when phone typed attribute has an non phone value', ->
        arthur = person phone: 'batata'
        expect( -> arthur.valid).to.throw /invalid attribute value type/i