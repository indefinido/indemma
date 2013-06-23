require 'indemma/lib/record/restful'

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

    beforeEach ->
      arthur = record.call
        resource: 'person'
        name    : 'Arthur Philip Dent'

      arthur.dirty = true

    describe '#save', ->

      it 'sends correct parameters', ->
        sinon.stub(jQuery, "ajax").returns(jQuery.Deferred())

        arthur.save()

        jQuery.ajax.called.should.be.true

  describe 'model' ,  ->