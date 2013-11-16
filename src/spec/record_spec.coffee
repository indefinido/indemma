root = exports ? window

describe 'record',  ->
  record = root.record

  it 'should create a record', ->
    arthur = record.call resource: 'person'
    arthur.should.be.object

describe 'model',  ->
  model = root.model

  describe '#()', ->

    xit 'should throw exception if no resource is passed'

    it 'should create a record factory', ->
      person = model.call resource: 'person'
      person.should.be.object

      john = person()
      john.should.be.object
      john.resource.should.have.property 'name', 'person'