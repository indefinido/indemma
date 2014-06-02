var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/validatable.js');

describe('model #() validates_remotely', function() {
  var arthur, model, person, request;

  model = root.model;
  request = arthur = person = null;
  describe('basic usage', function() {
    beforeEach(function() {
      person = model.call({
        resource: 'person',
        name: String,
        validates_remotely: 'name'
      });
      return arthur = person({
        name: "Arthur Dent"
      });
    });
    afterEach(function() {
      return person != null ? person.validators.length = 0 : void 0;
    });
    return describe('#validate', function() {
      beforeEach(function() {
        request = jQuery.Deferred();
        return sinon.stub(jQuery, "ajax").returns(request);
      });
      afterEach(function() {
        return jQuery.ajax.restore();
      });
      it('should send paramenters accordingly', function() {
        arthur.validate();
        jQuery.ajax.called.should.be["true"];
        return jQuery.ajax.calledWithMatch({
          url: '/people/validate',
          type: 'post',
          data: {
            person: {
              name: 'Arthur Dent'
            }
          }
        }).should.be["true"];
      });
      return it('should add errors to record when request responds with errors', function() {
        arthur.validate();
        request.resolveWith(arthur, [
          {
            name: ['The name should be Marvin!', 'The name should be in lowercase!']
          }
        ]);
        arthur.errors.length.should.be.eq(2);
        return arthur.errors.messages.name.should.exist;
      });
    });
  });
  return describe('with options usage', function() {
    beforeEach(function() {
      if (person != null) {
        person.validators.length = 0;
      }
      person = model.call({
        resource: 'person',
        name: String,
        validates_remotely: 'name'
      });
      return arthur = person({
        name: "Arthur Dent"
      });
    });
    return describe('#validate', function() {
      beforeEach(function() {
        request = jQuery.Deferred();
        return sinon.stub(jQuery, "ajax").returns(request);
      });
      afterEach(function() {
        return jQuery.ajax.restore();
      });
      return it('should make ajax call', function() {
        arthur.validate();
        return jQuery.ajax.called.should.be["true"];
      });
    });
  });
});
