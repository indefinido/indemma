root = exports ? window

require 'indemma/lib/record/associable'

describe 'record',  ->
  record = root.record

  it 'should create a record'

describe 'model',  ->
  model  = root.model
  arthur = radio       = null
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

    radio = corporation
      _id: 1
      name: 'Local Radio'

    ford = friend
      _id: 2
      name: 'Ford Perfect'

    arthur = person
      _id: 3
      name: 'Arthur Philip Dent'

  describe 'has_one', ->
    it 'should add a has_one property with the associations descriptions', ->
      $.type(person.has_one).should.be.eq 'array'


  describe 'belongs_to', ->
    it 'should add a belongs_to property with the associations descriptions', ->
      $.type(person.belongs_to).should.be.eq 'array'


    describe "#associated_id", ->
      it 'should return an partial resource when acessing associated', ->
        arthur.corporation_id = radio._id

        arthur.should.have.property 'corporation'
        arthur.corporation.should.be.object
        arthur.corporation.should.have.property 'resource'
        arthur.corporation.should.have.property '_id', radio._id

      xit 'should fetch the resource when accessing associated and resource not present', (done) ->
        radio = corporation
          _id: 1
          name: 'Local Radio'

        arthur.corporation_id = radio._id

        arthur.corporation.should.be.object
        arthur.corporation.should.have.property 'resource', radio.resource
        arthur.corporation._id.should.be null
        arthur.corporation.locking.should.be.object

        arthur.corporation.locking.done (corporation) ->
          corporation.should.have.property '_id' , radio.id
          corporation.should.have.property 'name', radio.name


    describe "#associated", ->

      it 'should update associated id and record when associated record changes', ->
        radio = corporation
          _id: 1
          name: 'Local Radio'
          sustained: true

        expect(arthur.corporation).to.be.undefined

        arthur.corporation = radio

        arthur.should.to.have.property 'corporation', radio
        arthur.should.to.have.property 'corporation_id', radio._id


    describe "#build_associated", ->
      it 'should add builded object to association named attribute', ->
        arthur = person
          name: 'Arthur Dent'

        corporation = arthur.build_corporation()
        arthur.should.have.property 'corporation'
        expect(corporation).to.be.ok

  describe 'has_many', ->
    it 'should add a has_many property with the associations descriptions', ->
      $.type(person.has_many).should.be.eq 'array'

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
