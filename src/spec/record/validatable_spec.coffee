'use strict'

require 'indemma/lib/record/validatable.js'

describe 'model',  ->

  person = corporation = null

  beforeEach ->
    person = model.call resource  : 'person'

  it 'should store validators', ->
    person.should.have.property 'validators'
    person.validators.should.be.an 'array'

  describe '(validates_... : ...)', ->

    describe 'validators instatiation',  ->

      it 'should have validators', ->
        person = model.call
          resource  : 'person'
          name      : String
          validates_presence_of: 'name'

        person.validators.should.not.be.empty
        validator = person.validators[0]
        validator.should.have.property 'attribute_name', 'name'

      it 'should have validators with in the key validates'
        #person = model.call
        #  resource  : 'person'
        #  name      : String
        #  validates : {name: {presence: true} }

        #person.validators.should.have.key 'name'

    describe '.validate_attribute()', ->

      beforeEach ->
        # TODO implement better model redefinition pattern
        person.validators.length = 0

        person = model.call
          resource  : 'person'
          name      : String
          validates_presence_of: 'name'

      it 'should add error messages for the validated attribute', ->
        arthur = person name: null

        arthur.validate_attribute 'name'

        arthur.errors.length.should.be.eq 1
        arthur.errors.messages.should.have.property 'name'

    describe '.valid', ->

      beforeEach ->
        # TODO implement better model redefinition pattern
        @personable?.validators.length = 0

        @personable = model.call
          resource  : 'person'
          name      : String
          validates_presence_of: 'name'

        @xhr        = jQuery.Deferred()
        sinon.stub(jQuery, 'ajax').returns @xhr

      afterEach -> jQuery.ajax.restore()


      # TODO more specific .valid test functionality
      it 'should be true when valid', ->
        arthur = @personable name: "Arthur"

        arthur.should.have.property 'valid'
        arthur.valid.should.be.true
        arthur.errors.length.should.be.eq 0


      it 'should exist as read only property', ->
        arthur = @personable name: "Arthur"
        expect(-> arthur.valid = false).to.throw Error

      it 'should validate record', ->
        anonymous = @personable name: null
        anonymous.valid.should.be.false
        anonymous.errors.length.should.be.eq 1

      it 'should not validate record multiple times even with remote' , ->
        @personable = model.call
          resource  : 'person'
          name      : String
          validates_remotely: 'email'

        arthur = @personable name: "Arthur", email: "arthur.dent@hitchhikers.guide"
        arthur.valid
        arthur.valid
        arthur.valid
        arthur.valid

        jQuery.ajax.callCount.should.be.eq 1

      it 'should not validate record until it changes', ->
        anonymous = @personable name: null

        anonymous.observation.deliver()
        anonymous.errors.length.should.be.eq 0

      it 'should not re-validate record until it changes', ->
        anonymous = @personable name: null

        anonymous.valid.should.be.false
        anonymous.errors.length.should.be.eq 1

        validation = anonymous.validation
        # We expect it to not instanitante new validation deferred
        anonymous.validate().should.be.eq validation

        # Record for some reason changed
        anonymous.dirty = true
        anonymous.observation.deliver()

        # We expect it to instanitante new validation deferred
        anonymous.validate().should.not.be.eq validation
