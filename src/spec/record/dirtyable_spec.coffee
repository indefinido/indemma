require 'indemma/lib/record/restfulable.js'
require 'indemma/lib/record/dirtyable.js'

'use strict'

root = exports ? window

model  = root.model  # TODO model = require 'indemma/model'
record = root.record # TODO model = require 'indemma/record'
jQuery = require 'component-jquery'

describe 'dirtyable', ->

  describe 'when included', ->
    it 'sets te dirtyable loaded flag on model', ->
      model.dirtyable.should.be.true

  describe 'record',  ->
    # TODO Convert to @arthur
    describe '()',  ->

      beforeEach ->
        # TODO Convert to @arthur
        @person = model.call resource: 'person'
        @arthur = @person    name    : 'Arthur Philip Dent'

      describe '.dirty', ->
        it 'should exist after initialization', ->
          @arthur.should.have.property 'dirty'

        it 'should be true on record changes', ->
          @arthur.name = 10

          # Force instantaneous delivery
          @arthur.observation.deliver()

          @arthur.dirty.should.be.true

      describe '.saved()', ->
        beforeEach -> sinon.stub(jQuery, "ajax").returns(jQuery.Deferred())
        afterEach  -> jQuery.ajax.restore()

        it 'should clean record after', ->


  describe 'model' ,  ->
    describe '()', ->
