var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable');

describe('model', function() {
  var corporation, model, person;

  model = root.model;
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
      person = null;
      beforeEach(function() {
        person.validators.length = 0;
        return person = model.call({
          resource: 'person',
          name: String,
          validates_presence_of: 'name'
        });
      });
      it('should be true when valid', function() {
        var arthur;

        arthur = person({
          name: "Arthur"
        });
        arthur.should.have.property('valid');
        arthur.valid.should.be["true"];
        return arthur.errors.length.should.be.eq(0);
      });
      it('should exist as read only property', function() {
        var arthur;

        arthur = person({
          name: "Arthur"
        });
        return expect(function() {
          return arthur.valid = false;
        }).to["throw"](Error);
      });
      it('should validate record', function() {
        var anonymous;

        anonymous = person({
          name: null
        });
        anonymous.valid.should.be["false"];
        return anonymous.errors.length.should.be.eq(1);
      });
      return it('should not validate record util it changes', function() {
        var anonymous, validation;

        anonymous = person({
          name: null
        });
        anonymous.valid.should.be["false"];
        anonymous.errors.length.should.be.eq(1);
        validation = anonymous.validation;
        anonymous.validate().should.be.eq(validation);
        anonymous.dirty = true;
        return anonymous.validate().should.not.be.eq(validation);
      });
    });
  });
});
