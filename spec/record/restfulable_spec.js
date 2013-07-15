var jQuery, model, record, root;

require('indemma/lib/record/restfulable');

require('indemma/lib/record/resource');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

jQuery = require('component-jquery');

describe('restfulable', function() {
  describe('when included', function() {
    return it('sets te restufulable loaded flag on model', function() {
      return model.restfulable.should.be["true"];
    });
  });
  describe('record', function() {
    var arthur;

    arthur = null;
    return describe('#()', function() {
      beforeEach(function() {
        arthur = record.call({
          resource: 'person',
          name: 'Arthur Philip Dent'
        });
        return arthur.dirty = true;
      });
      return describe('#save', function() {
        beforeEach(function() {
          return sinon.stub(jQuery, "ajax").returns(jQuery.Deferred());
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        return it('sends correct parameters', function() {
          arthur.save();
          return jQuery.ajax.called.should.be["true"];
        });
      });
    });
  });
  return describe('model', function() {
    return describe('#()', function() {
      describe('#all', function() {
        var deferred, person, promises;

        deferred = promises = person = null;
        beforeEach(function() {
          person = model.call({
            resource: 'person'
          });
          deferred = jQuery.Deferred();
          return sinon.stub(jQuery, "ajax").returns(deferred);
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        return it('should return models when promise is resolved', function(done) {
          var fetched;

          fetched = function(people) {
            people.should.be.array;
            people[0].name.should.be.string;
            return done();
          };
          person.all(fetched);
          return deferred.resolveWith(person, [
            [
              {
                name: 'Arthur'
              }, {
                name: 'Ford'
              }
            ]
          ]);
        });
      });
      return describe('#create', function() {
        var person, promises;

        promises = person = null;
        beforeEach(function() {
          var deferred;

          person = model.call({
            resource: 'person'
          });
          deferred = jQuery.Deferred();
          deferred.resolveWith(record.call({
            name: 'Arthur'
          }));
          sinon.stub(jQuery, "ajax").returns(deferred);
          return promises = person.create({
            name: 'Arthur'
          }, {
            name: 'Ford'
          });
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        it('should return promises', function(done) {
          promises.should.be.array;
          promises[0].should.be.object;
          promises[1].should.be.object;
          return jQuery.when.apply(jQuery, promises).done(function() {
            promises[0].state().should.be.eq('resolved');
            promises[1].state().should.be.eq('resolved');
            return done();
          });
        });
        it('should return models when promise is resolved', function(done) {
          var created;

          created = function() {
            this.name.should.be.eq('Arthur');
            return done();
          };
          return person.create(created, {
            name: 'Arthur'
          }, {
            name: 'Ford'
          });
        });
        it('should optionally accept create callback', function(done) {
          var deferreds;

          deferreds = person.create({
            name: 'Arthur'
          }, {
            name: 'Ford'
          });
          promises.should.be.array;
          promises[0].should.be.object;
          promises[1].should.be.object;
          return jQuery.when.apply(jQuery, promises).done(function() {
            promises[0].state().should.be.eq('resolved');
            promises[1].state().should.be.eq('resolved');
            return done();
          });
        });
        it('should create record when only callback is passed', function(done) {
          person.create(done);
          return jQuery.ajax.callCount.should.be.eq(3);
        });
        it('should throw exception when nothing is passed', function() {
          return expect(person.create).to["throw"](TypeError);
        });
        return it('should make ajax calls', function() {
          return jQuery.ajax.callCount.should.be.eq(2);
        });
      });
    });
  });
});
