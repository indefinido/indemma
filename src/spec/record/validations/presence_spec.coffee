root = exports ? window

require 'indemma/lib/record/validatable'

describe 'model #() validates presence of',  ->

  describe 'basic usage', ->
    model  = root.model
    person = null

    beforeEach ->
      person = model.call
        resource  : 'person'
        name      : String
        belongs_to: 'corporation'
        validates_presence_of: 'name'

    afterEach ->
      person.validators.length = 0

    describe '#validate', ->

      it 'should add error to record when required field is empty (null, undefined or \'\')'

