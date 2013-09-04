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
        it('should send paramenters accordingly');
        return it('should make ajax call', function() {
          arthur.save();
          return jQuery.ajax.called.should.be["true"];
        });
      });
    });
  });
  return describe('model', function() {
    return describe('#()', function() {
      describe('#assign_attributes', function() {
        var friend, person;

        friend = person = null;
        beforeEach(function() {
          person = model.call({
            resource: 'person',
            has_many: 'friends',
            name: String
          });
          return friend = model.call({
            resource: 'friend',
            belongs_to: 'person'
          });
        });
        return it('assigns associations properly', function() {
          var arthur, attributes, ford, marvin, search_record;

          arthur = person({
            name: 'Arthur Dent'
          });
          ford = friend({
            name: 'Ford Perfect'
          });
          marvin = friend({
            name: 'Marvin'
          });
          attributes = {
            friends: [ford, marvin]
          };
          arthur.assign_attributes(attributes);
          search_record = function(association, search) {
            var associated, _i, _len;

            search = JSON.stringify(search.json());
            for (_i = 0, _len = association.length; _i < _len; _i++) {
              associated = association[_i];
              associated = JSON.stringify(associated.json());
              if (associated === search) {
                return true;
              }
            }
            return false;
          };
          search_record(arthur.friends, ford).should.be.eq["true"];
          return search_record(arthur.friends, arthur).should.be.eq["true"];
        });
      });
      describe('with singular resource', function() {
        return describe('#create', function() {
          it('should return promises');
          return it('should return models when promise is resolved');
        });
      });
      return describe('with plural resource', function() {
        return describe('#create', function() {
          var deferred, person, promises;

          deferred = promises = person = null;
          beforeEach(function() {
            person = model.call({
              resource: 'person'
            });
            deferred = jQuery.Deferred();
            deferred.resolveWith(person({
              name: 'Arthur'
            }), [
              {
                _id: 1
              }
            ]);
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
            return person.create({
              name: 'Arthur'
            }, {
              name: 'Ford'
            }, created);
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
            person.create(function() {
              return done();
            });
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
});
