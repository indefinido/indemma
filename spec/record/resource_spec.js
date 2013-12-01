var jQuery, model, record, root;

require('indemma/lib/record/restfulable');

require('indemma/lib/record/resource');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

jQuery = require('component-jquery');

describe('resource', function() {
  describe('with scope option', function() {
    var person, towel;

    person = towel = null;
    beforeEach(function() {
      person = model.call({
        resource: 'person'
      });
      return towel = model.call({
        resource: {
          name: 'towel',
          scope: 'users'
        }
      });
    });
    return it('should be prefixed with scope', function() {
      towel.route.should.be.eq('/users/towels');
      towel({}).route.should.be.eq('/users/towels');
      return towel({
        id: 1
      }).route.should.be.eq('/users/towels');
    });
  });
  describe('with singular resource', function() {
    var towel;

    towel = null;
    beforeEach(function() {
      var context, deferred, promises;

      towel = model.call({
        resource: {
          name: 'towel',
          singular: true
        }
      });
      deferred = jQuery.Deferred();
      context = towel({
        name: 'Arthur Philip Dent'
      });
      context.lock = JSON.stringify(context.json());
      deferred.resolveWith(context, [
        {
          _id: 1,
          name: 'Arthur Philip Dent'
        }
      ]);
      sinon.stub(jQuery, "ajax").returns(deferred);
      return promises = towel.create({
        name: 'Arthur Philip Dent'
      }, {
        name: 'Ford'
      });
    });
    afterEach(function() {
      return jQuery.ajax.restore();
    });
    return it('the route should be in singular form', function() {
      towel.route.should.be.eq('/towel');
      towel({}).route.should.be.eq('/towel');
      return towel({
        id: 1
      }).route.should.be.eq('/towel');
    });
  });
  describe('when included', function() {
    return xit('sets the resource loaded flag on model', function() {});
  });
  return describe('model', function() {
    it('add methods to model object');
    describe('#pluralize', function() {
      return xit('transforms word into plural form');
    });
    return describe('#singularize', function() {
      return xit('transforms word into singular form');
    });
  });
});
