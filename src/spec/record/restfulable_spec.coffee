require 'indemma/lib/record/restfulable.js'
require 'indemma/lib/record/validatable.js'
require 'indemma/lib/record/resource.js'

'use strict'

root = exports ? window

model  = root.model  # TODO model = require 'indemma/model'
record = root.record # TODO model = require 'indemma/record'

# Move to shared behaviour!
should_behave_like_errorsable = ->

  describe '.errors', ->
    describe 'when server responds', ->
      beforeEach ->
        @xhr =
          status: 422

      describe 'with errors', ->
        it 'should add messages for each attribute on the errors object'
        it 'should add messages for base attribute on the errors object', ->
          base_messages = ["arthur you should bring a towel!"]
          @xhr.responseText = JSON.stringify
            errors:
              base: base_messages

          @subject.failed @xhr, 'error'
          @subject.should.have.property 'errors'
          @subject.errors[0].should.include 'base', 'server', server_message: base_messages[0]
          @subject.errors.messages.should.have.property 'base', base_messages[0]

      describe 'with invalid error messages', ->
        it 'when inexistent attribute should throw exception', ->

describe 'restfulable', ->

  describe 'when included', ->
    it 'sets te restufulable loaded flag on model', ->
      model.restfulable.should.be.true

    # it 'adds save methods to records'

  describe 'record',  ->
    # TODO Convert to @arthur
    arthur = null

    describe '()',  ->

      beforeEach ->
        @person = model.call resource: 'person'

        # TODO Convert to @arthur
        @arthur = @person name: 'Arthur Philip Dent'

        # TODO put persistance check in other property
        @arthur.dirty = true

      describe '.json()', ->

        it 'should remove all non data properties', ->
          @arthur.json().should.not.have.property 'before_initialize'


      describe '.save()', ->
        beforeEach -> sinon.stub(jQuery, "ajax").returns(jQuery.Deferred())
        afterEach  -> jQuery.ajax.restore()

        it 'should be able to serialize record', ->
          JSON.stringify @arthur.json()

        it 'should ignore key in transient fields'

        it 'should send paramenters accordingly'

        # TODO erase this test and implement the above test (should
        # send paramenters accordingly)
        it 'should make ajax call', ->
          @arthur.save()
          jQuery.ajax.called.should.be.true

  describe 'model' ,  ->
    describe '()', ->
      describe '.json()', ->

        beforeEach ->
          @personable   = model.call
            resource: 'person'
            has_many: 'friends'
            nested_attributes: ['friends']
            name: String

          @friendable   = model.call
            resource: 'friend'
            belongs_to: 'person'

      describe '.assign_attributes()', ->

        beforeEach ->
          @personable = model.call
            resource: 'person'
            has_many: 'friends'
            belongs_to: 'company'
            has_one: 'towel'
            name: String

          @friendable = model.call
            resource: 'friend'
            belongs_to: 'person'
            name: String

          @companyable = model.call
            resource: 'company'
            has_many: 'people'
            name: String

          @towelable = model.call
            resource: 'towel'
            belongs_to: 'person'
            material: String


          @arthur   = @personable name: 'Arthur Dent'
          @ford     = @friendable name: 'Ford Perfect'
          @marvin   = @friendable name: 'Marvin'
          @megadodo = @companyable name: 'Megadodo Publications'
          @towel    = @towelable material: 'Microfiber'


        # TODO implement setter on has many association and move this code to there
        it 'should not assign attribute with the same value twice', ->
          object     = {}

          @arthur    = @personable name: object
          @arthur.assign_attributes name: {wearing: 'robe'}

          @arthur.name.should.not.be.eq object

        it 'assigns associations properly', ->
          attributes = friends: [@ford, @marvin]

          @arthur.assign_attributes attributes

          search_record = (association, search) ->
            search = JSON.stringify search.json()
            for associated in association
              associated = JSON.stringify(associated.json())
              return true if associated == search

            false

          search_record(@arthur.friends, @ford  ).should.be.eq.true
          search_record(@arthur.friends, @arthur).should.be.eq.true

        describe 'when assigning has one', ->
          it 'should build new objects when associated not defined', ->
            @arthur.assign_attributes towel: {material: 'Copper'}

            @arthur.should.have.property 'towel'
            @arthur.towel.should.have.property 'material', 'Copper'

          it 'should not build new objects when associated already defined', ->
            @arthur.towel = @towel
            @arthur.assign_attributes towel: {name: 'Copper'}

            @arthur.should.have.property 'towel', @towel
            @arthur.towel.should.have.property 'name', 'Copper'
            @towel.should.have.property 'name', 'Copper'

        describe 'when assigning belongs to', ->
          it 'should build new objects when associated not defined', ->
            @arthur.assign_attributes company: {name: 'Megado'}

            @arthur.should.have.property 'company'
            @arthur.company.should.have.property 'name', 'Megado'

          it 'should not build new objects when associated already defined', ->
            @arthur.company = @megadodo
            @arthur.assign_attributes company: {name: 'Megado'}

            @arthur.should.have.property 'company', @megadodo
            @arthur.company.should.have.property 'name', 'Megado'
            @megadodo.should.have.property 'name', 'Megado'

      describe 'with singular resource', ->
        describe '.create()', ->

          it 'should return promises'
          it 'should return models when promise is resolved'

      describe 'with plural resource', ->

        describe '.create()', ->
          beforeEach ->
            @personable   = model.call resource: 'person'

            @deferred     = jQuery.Deferred()
            @deferred.resolveWith @personable({_id: 1, name: 'Arthur'}), [{_id: 1, name: 'Arthur'}]
            sinon.stub(jQuery, "ajax").returns @deferred

            @promise      = @personable.create {name: 'Arthur'}, {name: 'Ford'}

          afterEach  -> jQuery.ajax.restore()

          # TODO move this test to restful test
          it 'should return a promise', ->
            @promise.done.should.be.function
            @promise.state().should.be.eq 'resolved'

          it 'should return models when promise is resolved', (done) ->
            # Will be called once for each saved record
            created = ->
              @name.should.be.eq 'Arthur'
              done()

            @personable.create {name: 'Arthur'}, {name: 'Ford'}, created

          it 'should optionally accept create callback', (done) ->
            @promise = @personable.create {name: 'Arthur'}, {name: 'Ford'}
            @promise.done.should.be.function
            @promise.done -> done()
            @promise.state().should.be.eq 'resolved'


          it 'should create record when only callback is passed', (done) ->
            @personable.create -> done()
            jQuery.ajax.callCount.should.be.eq 3 # 2 are from the beforeEach

          it 'should throw exception when nothing is passed', () ->
            expect(@personable.create).to.throw TypeError

          it 'should make ajax calls', ->
            jQuery.ajax.callCount.should.be.eq 2


      describe '.destroy()', ->
        describe 'with plural resource', ->
          arthur = person = deferred = null

          beforeEach ->
            person   = model.call resource: 'person'
            deferred = jQuery.Deferred()
            deferred.resolveWith person(name: 'Arthur'), [id: 1]
            sinon.stub(jQuery, "ajax").returns(deferred)
            arthur = person name: 'Arthur', id: 1

          afterEach  -> jQuery.ajax.restore()

          it "throw exception when record has no id", ->
            delete arthur.id
            expect(arthur.destroy).to.throw Error


          it "should make ajax calls", ->
            arthur.destroy()
            jQuery.ajax.callCount.should.be.eq 1
