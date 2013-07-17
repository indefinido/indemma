root = exports ? window

describe 'record',  ->
  record = root.record

  it 'should create a record', ->
    arthur = record.call resource: 'person'
    arthur.should.be.object


describe 'model',  ->
  model = root.model

  it 'should return a record factory with association support'

  describe '#()', ->

    describe '{generated_association} all', ->

      it 'should auto observe nested associations attributes'
