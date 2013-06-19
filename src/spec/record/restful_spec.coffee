require 'indemma'
require 'indemma/lib/record/restful'

describe 'restfulable', ->
  model = null

  before  ->
    model = window.model # TODO model = require 'indemma/model'

  it 'provides the restfulable configuration option for model', ->
    model.restfulable.should.be.function