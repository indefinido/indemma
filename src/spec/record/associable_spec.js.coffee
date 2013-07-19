root = exports ? window

require 'indemma/lib/record/associable'

describe 'record',  ->
  record = root.record

  it 'should create a record'

describe 'model',  ->
  model  = root.model
  person = null

  beforeEach ->
    person = model.call
      resource: 'person'
      has_many: 'friends'

  it 'should return a record factory with associations stored', ->
    person.has_many.should.be.array

    has_many = Array.prototype.splice.call person.has_many, 0

    has_many.should.contain 'friends'

  describe '#()', ->

    it 'should return a record with an association object', ->
      person().should.have.property 'friends'

    describe '{generated_association}', ->
      association = null

      beforeEach -> association = person().friends

      it 'should have query methods', ->
        association.should.have.property 'all'
        association.should.have.property 'each'
        association.should.have.property 'reload'

      describe '#all', ->

        it 'should auto observe nested associations attributes'
