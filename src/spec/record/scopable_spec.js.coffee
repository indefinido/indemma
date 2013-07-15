require 'indemma/lib/record/resource'
require 'indemma/lib/record/restfulable'
require 'indemma/lib/record/scopable'

root = exports ? window

model  = root.model  # TODO model = require 'indemma/model'
record = root.record # TODO model = require 'indemma/record'
jQuery = require 'component-jquery'

describe 'scopable', ->

  describe 'when included', ->
    it 'sets te scopable loaded flag on model', ->
      model.scopable.should.be.true

    # it 'adds save methods to records'

  describe 'model', ->

    describe '#(options)', ->
      person = model.call
        $hetero: true
        $by_type: []
        resource: 'person'

      describe 'scope', ->
        it 'should add scope methods to model', ->
          person.hetero.should.be.function

        describe '#(name, type)', ->
          it 'should add scope methods to model', ->
            person.scope 'bissexual', Boolean
            person.bissexual.should.be.function

      describe '#{generated_scope}', ->
        beforeEach ->
          sinon.stub(jQuery, "ajax").returns(jQuery.Deferred())
          person.scope.clear()

        afterEach  -> jQuery.ajax.restore()

        describe 'when array', ->
          it 'should acumulate data in scope object', ->
            person.by_type()
            person.scope.data.by_type.should.be.a 'array'

          it 'should override data throught parameters', ->
            person.by_type 1, 2, 3
            person.scope.data.by_type.should.contain 1, 2, 3

          it 'should use default value'
          it 'should allow scope chaining'

          it 'should make ajax call', ->
            person.by_type(1, 3, 4).fetch()
            jQuery.ajax.callCount.should.be.eq 1


        describe 'when boolean', ->

          it 'should acumulate data in scope object', ->
            person.hetero()
            person.scope.data.hetero.should.be.eq true

          it 'should override data throught parameters', ->
            person.hetero false
            person.scope.data.hetero.should.be.eq false

          it 'should allow scope chaining'

          it 'should make ajax call', ->
            person.hetero().fetch()
            jQuery.ajax.callCount.should.be.eq 1
