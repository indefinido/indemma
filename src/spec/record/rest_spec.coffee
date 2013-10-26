require 'indemma/lib/record/resource'

root   = exports ? window

rest   = require 'indemma/lib/record/rest'
jQuery = require 'component-jquery'

describe 'rest', ->
  object = null

  beforeEach ->
    object = Object.create rest
    object.route    = "users"
    object.resource = "user"

  beforeEach -> sinon.stub(jQuery, "ajax").returns(jQuery.Deferred())
  afterEach  -> jQuery.ajax.restore()

  describe '#delete', ->
    it 'should make ajax call', ->
      object.delete()
      jQuery.ajax.called.should.be.true