require 'indemma/lib/record/restfulable'
require 'indemma/lib/record/resource'

root = exports ? window

model  = root.model  # TODO model = require 'indemma/model'
record = root.record # TODO model = require 'indemma/record'
jQuery = require 'component-jquery'

describe 'restfulable', ->

  describe 'when included', ->
    it 'sets te restufulable loaded flag on model', ->
      model.restfulable.should.be.true

    # it 'adds save methods to records'

  describe 'record',  ->
    arthur = null

    describe '#()',  ->

      beforeEach ->
        arthur = record.call
          resource: 'person'
          name    : 'Arthur Philip Dent'

        arthur.dirty = true

      describe '#save', ->
        beforeEach -> sinon.stub(jQuery, "ajax").returns(jQuery.Deferred())
        afterEach  -> jQuery.ajax.restore()

        it 'should send paramenters accordingly'

        # TODO erase this test and implement the above test (should
        # send paramenters accordingly)
        it 'should make ajax call', ->
          arthur.save()
          jQuery.ajax.called.should.be.true

  describe 'model' ,  ->
    describe '#()', ->
      describe '#json', ->
        friend = person = null

        beforeEach ->
          person   = model.call
            resource: 'person'
            has_many: 'friends'
            nested_attributes: ['friends']
            name: String

          friend   = model.call
            resource: 'friend'
            belongs_to: 'person'

      describe '#assign_attributes', ->
        friend = person = null

        beforeEach ->
          person   = model.call
            resource: 'person'
            has_many: 'friends'
            name: String

          friend   = model.call
            resource: 'friend'
            belongs_to: 'person'

        # TODO implement setter on has many association and move this code to there
        it 'assigns associations properly', ->
          arthur     = person name: 'Arthur Dent'
          ford       = friend name: 'Ford Perfect'
          marvin     = friend name: 'Marvin'
          attributes = friends: [ford, marvin]

          arthur.assign_attributes attributes

          search_record = (association, search) ->
            search = JSON.stringify search.json()
            for associated in association
              associated = JSON.stringify(associated.json())
              return true if associated == search

            false

          search_record(arthur.friends, ford).should.be.eq.true
          search_record(arthur.friends, arthur).should.be.eq.true


      describe 'with singular resource', ->
        describe '#create', ->

          it 'should return promises'
          it 'should return models when promise is resolved'

      describe 'with plural resource', ->

        describe '#create', ->
          deferred = promise = person = null

          beforeEach ->
            person   = model.call resource: 'person'
            deferred = jQuery.Deferred()
            deferred.resolveWith person(name: 'Arthur'), [_id: 1]
            sinon.stub(jQuery, "ajax").returns(deferred)
            promise  = person.create {name: 'Arthur'}, {name: 'Ford'}

          afterEach  -> jQuery.ajax.restore()

          # TODO move this test to restful test
          it 'should return a promise', (done) ->
            promise.done.should.be.function
            promise.state().should.be.eq 'resolved'
            promise.done(-> done()).should.be.eq 'resolved'


          it 'should return models when promise is resolved', (done) ->
            # Will be called once for each saved record
            created = ->
              @name.should.be.eq 'Arthur'
              done()

            person.create {name: 'Arthur'}, {name: 'Ford'}, created

          it 'should optionally accept create callback', (done) ->
            promise = person.create {name: 'Arthur'}, {name: 'Ford'}
            promise.done.should.be.function
            promise.done -> done()
            promise.state().should.be.eq 'resolved'


          it 'should create record when only callback is passed', (done) ->
            person.create -> done()
            jQuery.ajax.callCount.should.be.eq 3 # 2 is counts is from the beforeEach

          it 'should throw exception when nothing is passed', () ->
            expect(person.create).to.throw TypeError

          it 'should make ajax calls', ->
            jQuery.ajax.callCount.should.be.eq 2

      describe '#destroy', ->
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
