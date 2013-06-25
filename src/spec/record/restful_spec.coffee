require 'indemma/lib/record/restful'
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

        it 'sends correct parameters', ->

          arthur.save()

          jQuery.ajax.called.should.be.true

  describe 'model' ,  ->
    describe '#()', ->
      describe '#create', ->
        promises = person = null

        beforeEach ->
          person   = model.call resource: 'person'
          deferred = jQuery.Deferred()
          deferred.resolveWith(record.call(name: 'Arthur'))
          sinon.stub(jQuery, "ajax").returns(deferred)
          promises = person.create {name: 'Arthur'}, {name: 'Ford'}

        afterEach  -> jQuery.ajax.restore()

        # TODO move this test to restful test
        it 'should return promises', (done) ->
          promises.should.be.array
          promises[0].should.be.object
          promises[1].should.be.object

          jQuery.when.apply(jQuery, promises).done () ->
            promises[0].state().should.be.eq 'resolved'
            promises[1].state().should.be.eq 'resolved'
            done()

        it 'should return models when promise is resolved', (done) ->
          # Will be called once for each saved record
          created = () ->
            @name.should.be.eq 'Arthur'
            done()

          person.create created, {name: 'Arthur'}, {name: 'Ford'}

        it 'should optionally accept create callback', (done) ->
          deferreds = person.create {name: 'Arthur'}, {name: 'Ford'}
          promises.should.be.array
          promises[0].should.be.object
          promises[1].should.be.object

          jQuery.when.apply(jQuery, promises).done () ->
            promises[0].state().should.be.eq 'resolved'
            promises[1].state().should.be.eq 'resolved'
            done()

        it 'should create record when only callback is passed', (done) ->
          person.create done
          jQuery.ajax.callCount.should.be.eq 3 # 2 is counts is from the beforeEach

        it 'should throw exception when nothing is passed', () ->
          expect(person.create).to.throw TypeError

        it 'should make ajax calls', ->
          jQuery.ajax.callCount.should.be.eq 2
