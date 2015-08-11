'use strict'

maid = require 'indemma/lib/record/maid.js'

describe 'maid', ->

  beforeEach ->
    @personable = model.call
      resource: 'person'
      washing: true
  
  it 'should save upon record dirtying', (done) ->
    @arthur = @personable name: 'Arthur Dent'
    
    sinon.stub(@arthur, 'save').returns true
    @arthur.name = 'Arthur Philip Dent'
    
    setTimeout =>
      @arthur.save.called.should.be.true
      done()
    , 1000


  it 'should not save upon record creation', (done) ->
    @timeout 10000
    sinon.stub(jQuery, "ajax").returns(jQuery.Deferred())
    @arthur = @personable name: 'Arthur Dent'

    setTimeout =>
      jQuery.ajax.called.should.be.false
      jQuery.ajax.restore()
      done()
    , 2000
    
