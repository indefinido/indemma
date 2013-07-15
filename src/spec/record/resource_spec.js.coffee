require 'indemma/lib/record/restfulable'
require 'indemma/lib/record/resource'

root = exports ? window

model  = root.model  # TODO model = require 'indemma/model'
record = root.record # TODO model = require 'indemma/record'
jQuery = require 'component-jquery'

describe 'resource', ->

  describe 'when included', ->
    xit 'sets the resource loaded flag on model', ->
      # model.resource.should.be.true

  describe 'model' ,  ->
    it 'add methods to model object'

    describe '#pluralize', ->
      xit 'transforms word into plural form'

    describe '#singularize', ->
      xit 'transforms word into singular form'