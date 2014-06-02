root = exports ? window

require 'indemma/lib/record/validatable.js'

describe 'model #() validates_remotely',  ->
  model   = root.model
  request = arthur  = person = null

  describe 'basic usage', ->

    beforeEach ->
      person = model.call
        resource  : 'person'
        name      : String
        validates_remotely: 'name'

      arthur = person name: "Arthur Dent"

    afterEach ->
      person?.validators.length = 0

    describe '#validate', ->

      beforeEach ->
        request = jQuery.Deferred()
        sinon.stub(jQuery, "ajax").returns(request)

      afterEach  -> jQuery.ajax.restore()

      it 'should send paramenters accordingly', ->
        arthur.validate()

        jQuery.ajax.called.should.be.true

        jQuery.ajax.calledWithMatch(
          url: '/people/validate'
          type: 'post'
          data:
            person:
              name: 'Arthur Dent'
        ).should.be.true


      it 'should add errors to record when request responds with errors', ->
        arthur.validate()
        request.resolveWith arthur,
          [name: ['The name should be Marvin!', 'The name should be in lowercase!']]

        arthur.errors.length.should.be.eq 2
        arthur.errors.messages.name.should.exist

  describe 'with options usage', ->

    beforeEach ->
      person?.validators.length = 0

      person = model.call
        resource  : 'person'
        name      : String
        validates_remotely: 'name'

      arthur = person name: "Arthur Dent"

    describe '#validate', ->

      beforeEach ->
        request = jQuery.Deferred()
        sinon.stub(jQuery, "ajax").returns(request)

      afterEach  -> jQuery.ajax.restore()

      it 'should make ajax call', ->
        arthur.validate()
        jQuery.ajax.called.should.be.true
