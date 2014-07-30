'use strict';require('indemma/lib/record/validatable.js');

describe('model', function() {
  var corporation, person;

  person = corporation = null;
  beforeEach(function() {
    return person = model.call({
      resource: 'person'
    });
  });
  it('should store validators', function() {
    person.should.have.property('validators');
    return person.validators.should.be.an('array');
  });
  return describe('(validates_... : ...)', function() {
    describe('validators instatiation', function() {
      it('should have validators', function() {
        var validator;

        person = model.call({
          resource: 'person',
          name: String,
          validates_presence_of: 'name'
        });
        person.validators.should.not.be.empty;
        validator = person.validators[0];
        return validator.should.have.property('attribute_name', 'name');
      });
      return it('should have validators with in the key validates');
    });
    describe('.validate_attribute()', function() {
      beforeEach(function() {
        person.validators.length = 0;
        return person = model.call({
          resource: 'person',
          name: String,
          validates_presence_of: 'name'
        });
      });
      return it('should add error messages for the validated attribute', function() {
        var arthur;

        arthur = person({
          name: null
        });
        arthur.validate_attribute('name');
        arthur.errors.length.should.be.eq(1);
        return arthur.errors.messages.should.have.property('name');
      });
    });
    return describe('.valid', function() {
      beforeEach(function() {
        var _ref;

        if ((_ref = this.personable) != null) {
          _ref.validators.length = 0;
        }
        this.personable = model.call({
          resource: 'person',
          name: String,
          validates_presence_of: 'name'
        });
        this.xhr = jQuery.Deferred();
        return sinon.stub(jQuery, 'ajax').returns(this.xhr);
      });
      afterEach(function() {
        return jQuery.ajax.restore();
      });
      it('should be true when valid', function() {
        var arthur;

        arthur = this.personable({
          name: "Arthur"
        });
        arthur.should.have.property('valid');
        arthur.valid.should.be["true"];
        return arthur.errors.length.should.be.eq(0);
      });
      it('should exist as read only property', function() {
        var arthur;

        arthur = this.personable({
          name: "Arthur"
        });
        return expect(function() {
          return arthur.valid = false;
        }).to["throw"](Error);
      });
      it('should validate record', function() {
        var anonymous;

        anonymous = this.personable({
          name: null
        });
        anonymous.valid.should.be["false"];
        return anonymous.errors.length.should.be.eq(1);
      });
      it('should not validate record multiple times even with remote', function() {
        var arthur;

        this.personable = model.call({
          resource: 'person',
          name: String,
          validates_remotely: 'email'
        });
        arthur = this.personable({
          name: "Arthur",
          email: "arthur.dent@hitchhikers.guide"
        });
        arthur.valid;
        arthur.valid;
        arthur.valid;
        arthur.valid;
        return jQuery.ajax.callCount.should.be.eq(1);
      });
      it('should not validate record until it changes', function() {
        var anonymous;

        anonymous = this.personable({
          name: null
        });
        anonymous.observation.deliver();
        return anonymous.errors.length.should.be.eq(0);
      });
      return it('should not re-validate record until it changes', function() {
        var anonymous, validation;

        anonymous = this.personable({
          name: null
        });
        anonymous.valid.should.be["false"];
        anonymous.errors.length.should.be.eq(1);
        validation = anonymous.validation;
        anonymous.validate().should.be.eq(validation);
        anonymous.dirty = true;
        anonymous.observation.deliver();
        return anonymous.validate().should.not.be.eq(validation);
      });
    });
  });
});
