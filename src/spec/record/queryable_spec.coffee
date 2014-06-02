root = exports ? window

queryable = require 'indemma/lib/record/queryable.js'

describe 'queryable',  ->

  describe 'model', ->
    beforeEach ->
      @person = model.call
        resource  : 'person'

    it 'should set the queryable key', ->
      model.should.have.property 'queryable', true

    it 'should create a storage', ->
      @person.should.have.property 'storage'

    describe '#find', ->
      beforeEach ->
        @xhr = jQuery.Deferred()
        sinon.stub(jQuery, "ajax").returns @xhr

        @arthur = @person
          _id: '1'
          name: 'Arthur Philip Dent'

        @arthur.save()
        @xhr.resolveWith @arthur, [@arthur.json()]

      afterEach  -> jQuery.ajax.restore()

      it 'should retrieve a record by key', ->
        @person.find('1').should.have.property 'name', @arthur.name
