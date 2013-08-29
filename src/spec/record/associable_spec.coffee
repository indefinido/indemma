root = exports ? window

require 'indemma/lib/record/associable'

describe 'record',  ->
  record = root.record

  it 'should create a record'

describe 'model',  ->
  model  = root.model
  person = corporation = null

  beforeEach ->
    corporation = model.call
      resource: 'corporation'

    # TODO implement support for self referential associations
    friend = model.call
      resource: 'friends'

    person = model.call
      resource  : 'person'
      has_many  : 'friends'
      belongs_to: 'corporation'

  describe 'belongs_to', ->

    it 'should add builded object to association named attribute', ->
      arthur = person
        name: 'Arthur Dent'

      corporation = arthur.build_corporation()
      arthur.should.have.property 'corporation'
      expect(corporation).to.be.ok

  describe 'has_many', ->

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
