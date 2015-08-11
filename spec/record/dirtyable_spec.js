var jQuery, model, record, root;

require('indemma/lib/record/restfulable.js');

require('indemma/lib/record/dirtyable.js');

'use strict';

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

jQuery = require('component-jquery');

describe('dirtyable', function() {
  describe('when included', function() {
    return it('sets te dirtyable loaded flag on model', function() {
      return model.dirtyable.should.be["true"];
    });
  });
  describe('record', function() {
    return describe('()', function() {
      beforeEach(function() {
        this.person = model.call({
          resource: 'person'
        });
        return this.arthur = this.person({
          name: 'Arthur Philip Dent'
        });
      });
      describe('.dirty', function() {
        it('should exist after initialization', function() {
          return this.arthur.should.have.property('dirty');
        });
        return it('should be true on record changes', function() {
          this.arthur.name = 10;
          this.arthur.observation.deliver();
          return this.arthur.dirty.should.be["true"];
        });
      });
      return describe('.saved()', function() {
        beforeEach(function() {
          return sinon.stub(jQuery, "ajax").returns(jQuery.Deferred());
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        return it('should clean record after', function() {});
      });
    });
  });
  return describe('model', function() {
    return describe('()', function() {});
  });
});
