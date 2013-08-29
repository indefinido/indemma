root = exports ? window

require 'indemma/lib/record/translationable'

describe 'model',  ->
  model  = root.model
  person = null

  beforeEach ->
    person = model.call
      resource  : 'person'
      name: String
      translation:
        attributes:
          name: 'Batata'

  describe '#human_attribute_name', ->
    it 'should return the translated attribute name', ->
      person.human_attribute_name('name').should.be.eq 'Batata'
