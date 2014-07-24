root = exports ? window

require 'indemma/lib/record/persistable.js'

describe 'persistable',  ->

  describe 'model', ->
    it 'should set the persistable key', ->
      model.should.have.property 'persistable', true

    describe '#find', ->
      beforeEach ->
        @xhr = jQuery.Deferred()
        sinon.stub(jQuery, "ajax").returns @xhr

        @personable = model.call
          resource  : 'person'
          has_many  : 'friends'
          belongs_to: 'corporation'

        @arthur = @personable
          name: 'Arthur Philip Dent'

        @xhr.resolveWith @arthur, [_id: 1]

        # TODO use another way to check if record has persisted
        @arthur.dirty = true

      afterEach  -> jQuery.ajax.restore()

      it 'should try to store a record after saving when initialzed without id', (done) ->
        sinon.stub(@personable.storage, 'store').returns true

        @arthur.save =>
          expect(@personable.storage.store.calledOnce).to.be.true
          done()

        @personable.storage.store.restore()

