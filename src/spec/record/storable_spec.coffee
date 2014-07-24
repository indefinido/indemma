'use strict'

storable = require 'indemma/lib/record/storable.js'

describe 'storable',  ->
  it 'should set the storable key', ->
    model.should.have.property 'storable', true

  beforeEach ->
    @storage = storable()

  describe "#store", ->
    beforeEach ->
      @data = name: 'Arthur Dent'

    describe "write", ->
      it "should write object on deep storage"
      # storage.store 'users.1', data

      it "should write object on storage", ->
        @storage.store '1', @data
        @storage.writes.should.be.eq 1
        @storage.database['1'].should.be.eq @data

      it "should mark an object as sustained",  ->
        @storage.store '1', @data
        @data.should.have.property 'sustained', true


    describe "read", ->

      beforeEach ->
        @data = name: 'Arthur Dent'
        @storage.store '1', @data

      it "should save object on storage", ->
        @storage.store('1').should.be.eq @data

      it "should unmark an object as sustained"
