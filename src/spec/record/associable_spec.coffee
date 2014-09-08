root = exports ? window

require 'indemma/lib/record/associable.js'
$ = require 'jquery'

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

    @arthur = arthur = person
      _id: 3
      name: 'Arthur Philip Dent'

  describe 'has_one', ->
    it 'should add a has_one property with the associations descriptions', ->
      $.type(person.has_one).should.be.eq 'array'


  describe 'belongs_to', ->
    it 'should add a belongs_to property with the associations descriptions', ->
      $.type(person.belongs_to).should.be.eq 'array'

    describe "{associated}_id", ->
      xdescribe 'with autobuild option on the asssociation', ->
        xit 'should return an partial resource when acessing associated', ->
          @arthur.corporation_id = radio._id

          @arthur.should.have.property 'corporation'
          @arthur.corporation.should.be.object
          @arthur.corporation.should.have.property 'resource'
          @arthur.corporation.should.have.property '_id', radio._id

      xit 'should fetch the resource when accessing associated and resource not present', (done) ->
        radio = corporation
          _id: 1
          name: 'Local Radio'

        @arthur.corporation_id = radio._id

        @arthur.corporation.should.be.object
        @arthur.corporation.should.have.property 'resource', radio.resource
        @arthur.corporation._id.should.be null
        @arthur.corporation.locking.should.be.object

        @arthur.corporation.locking.done (corporation) ->
          corporation.should.have.property '_id' , radio.id
          corporation.should.have.property 'name', radio.name

      it 'should notify changes', ->
        radio      = corporation _id: 1, name: 'Local Radio'
        subscribed_id = sinon.spy()
        subscribed = sinon.spy()

        @arthur.subscribe 'corporation_id', subscribed_id
        @arthur.subscribe 'corporation'   , subscribed
        @arthur.corporation_id = radio._id
        @arthur.observation.deliver()

        @arthur.corporation_id = null
        @arthur.observation.deliver()

        # Tests
        subscribed.called.should.be.true
        subscribed.callCount.should.be.eq 2
        subscribed_id.called.should.be.true
        subscribed_id.callCount.should.be.eq 2


      it 'should remove {associated} when nulifying', ->
        radio      = corporation _id: 1, name: 'Local Radio'
        subscribed = sinon.spy()

        # Associate arthur with a corporation through id
        @arthur.subscribe 'corporation_id', subscribed
        @arthur.corporation_id = radio._id
        @arthur.observation.deliver()

        # Unassociate arthur with a corporation through id
        @arthur.corporation_id = null
        @arthur.observation.deliver()

        subscribed.called.should.be.true
        subscribed.callCount.should.be.eq 2
        @arthur.should.have.property 'corporation_id', null
        @arthur.should.have.property 'corporation'   , null


    describe "{associated}", ->

      describe 'with autoload option on the association', ->

        it 'should create associated when sustained and stored', ->
          radio.sustained.should.be.true
          @arthur.corporation_id = radio._id
          @arthur.should.have.property 'corporation', radio


      it 'should update {associated_id} and record when associated record changes', ->
        radio = corporation
          _id: 1
          name: 'Local Radio'
          sustained: true

        expect(@arthur.corporation).to.be.null

        @arthur.corporation = radio

        @arthur.corporation_id
        @arthur.should.have.property 'corporation'   , radio
        @arthur.should.have.property 'corporation_id', radio._id

        @arthur.corporation = null
        @arthur.observation.deliver()

        @arthur.should.have.property 'corporation'   , null
        @arthur.should.have.property 'corporation_id', null

      it 'should notify changes', ->
        radio         = corporation _id: 1, name: 'Local Radio'
        subscribed    = sinon.spy()
        subscribed_id = sinon.spy()

        @arthur.subscribe 'corporation'   , subscribed
        @arthur.subscribe 'corporation_id', subscribed_id
        @arthur.corporation = radio
        @arthur.observation.deliver()

        @arthur.corporation = null
        @arthur.observation.deliver()

        # Tests
        subscribed.called.should.be.true
        subscribed.callCount.should.be.eq 2

        subscribed_id.called.should.be.true
        subscribed_id.callCount.should.be.eq 2

    describe "#build_{associated}", ->
      it 'should add builded object to association named attribute', ->
        @arthur = person
          name: 'Arthur Dent'

        corporation = @arthur.build_corporation()
        @arthur.should.have.property 'corporation'
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
          # THINK Why has many check is here
          # association.should.have.property 'has_many'
          association.should.have.property 'find'
          association.should.have.property 'each'
          association.should.have.property 'reload'

        describe '#every', ->

          it 'should auto observe nested associations attributes'
