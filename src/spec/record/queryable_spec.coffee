root = exports ? window

queryable = require 'indemma/lib/record/queryable.js'

describe 'queryable',  ->

  describe 'model', ->
    beforeEach ->
      @personable = model.call
        resource  : 'person'

    it 'should set the queryable key', ->
      model.should.have.property 'queryable', true

    it 'should create a storage', ->
      @personable.should.have.property 'storage'

    describe '#find', ->
      beforeEach ->
        @xhr = jQuery.Deferred()
        sinon.stub(jQuery, "ajax").returns @xhr

        @arthur = @personable
          _id: '1'
          name: 'Arthur Philip Dent'

        @arthur.save()
        @xhr.resolveWith @arthur, [@arthur.json()]

      afterEach  -> jQuery.ajax.restore()

      it 'should retrieve a record by key', ->
        @personable.find('1').should.have.property 'name', @arthur.name
