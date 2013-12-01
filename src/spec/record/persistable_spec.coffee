root = exports ? window

persistable = require 'indemma/lib/record/persistable'

describe 'persistable',  ->

  describe 'model', ->
    it 'should set the persistable key', ->
      model.should.have.property 'persistable', true

    describe '#find', ->
      beforeEach ->
        @person = model.call
          resource  : 'person'
          has_many  : 'friends'
          belongs_to: 'corporation'

        @arthur = @person
          _id: '1'
          name: 'Arthur Philip Dent'

      it 'should call try to store a record after saving', (done) ->
        sinon.stub(@person.storage, 'store').returns true

        @arthur.save =>
          expect(@person.storage.store.calledOnce).to.be.true
          done()

        @person.storage.store.restore()

