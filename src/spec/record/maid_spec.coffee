'use strict'

maid = require 'indemma/lib/record/maid.js'

describe 'maid', ->

    beforeEach ->
      @personable = model.call
        resource: 'person'
        washing: true

      @arthur = @personable name: 'Arthur Dent'

      sinon.stub(@arthur, 'save').returns true

    it 'should save upon record dirtying', (done) ->
      @arthur.name = 'Arthur Philip Dent'
      setTimeout =>
          @arthur.save.called.should.be.true
          done()
        , 1000

