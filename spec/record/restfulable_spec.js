var jQuery, model, record, root, should_behave_like_errorsable;

require('indemma/lib/record/restfulable');

require('indemma/lib/record/validatable');

require('indemma/lib/record/resource');

'use strict';

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

jQuery = require('component-jquery');

should_behave_like_errorsable = function() {
  return describe('.errors', function() {
    return describe('when server responds', function() {
      beforeEach(function() {
        return this.xhr = {
          status: 422
        };
      });
      describe('with errors', function() {
        it('should add messages for each attribute on the errors object');
        return it('should add messages for base attribute on the errors object', function() {
          var base_messages;

          base_messages = ["arthur you should bring a towel!"];
          this.xhr.responseText = JSON.stringify({
            errors: {
              base: base_messages
            }
          });
          this.subject.failed(this.xhr, 'error');
          this.subject.should.have.property('errors');
          this.subject.errors[0].should.include('base', 'server', {
            server_message: base_messages[0]
          });
          return this.subject.errors.messages.should.have.property('base', base_messages[0]);
        });
      });
      return describe('with invalid error messages', function() {
        return it('when inexistent attribute should throw exception', function() {});
      });
    });
  });
};

describe('restfulable', function() {
  describe('when included', function() {
    return it('sets te restufulable loaded flag on model', function() {
      return model.restfulable.should.be["true"];
    });
  });
  describe('record', function() {
    var arthur;

    arthur = null;
    return describe('()', function() {
      beforeEach(function() {
        this.arthur = arthur = record.call({
          resource: 'person',
          name: 'Arthur Philip Dent'
        });
        return this.arthur.dirty = true;
      });
      return describe('.save()', function() {
        beforeEach(function() {
          return sinon.stub(jQuery, "ajax").returns(jQuery.Deferred());
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        it('should be able to serialize record', function() {
          return JSON.stringify(arthur.json());
        });
        it('should ignore key in transient fields');
        it('should send paramenters accordingly');
        return it('should make ajax call', function() {
          arthur.save();
          return jQuery.ajax.called.should.be["true"];
        });
      });
    });
  });
  return describe('model', function() {
    return describe('()', function() {
      describe('.json()', function() {
        var friend, person;

        friend = person = null;
        return beforeEach(function() {
          person = model.call({
            resource: 'person',
            has_many: 'friends',
            nested_attributes: ['friends'],
            name: String
          });
          return friend = model.call({
            resource: 'friend',
            belongs_to: 'person'
          });
        });
      });
      describe('.assign_attributes()', function() {
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
        it('should not assign attribute with the same value twice', function() {
          var arthur, object;

          object = {};
          arthur = person({
            name: object
          });
          arthur.assign_attributes({
            name: {}
          });
          return arthur.name.should.not.be.eq(object);
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
        return describe('.create()', function() {
          it('should return promises');
          return it('should return models when promise is resolved');
        });
      });
      describe('with plural resource', function() {
        return describe('.create()', function() {
          var deferred, person, promise;

          deferred = promise = person = null;
          should_behave_like_errorsable();
          beforeEach(function() {
            var context;

            person = model.call({
              resource: 'person'
            });
            deferred = jQuery.Deferred();
            this.subject = context = person({
              name: 'Arthur'
            });
            context.lock = JSON.stringify(context.json());
            deferred.resolveWith(context, [
              {
                _id: 1,
                name: 'Arthur'
              }
            ]);
            deferred.resolveWith(person({
              name: 'Arthur'
            }), [
              {
                _id: 1,
                name: 'Arthur'
              }
            ]);
            sinon.stub(jQuery, "ajax").returns(deferred);
            return promise = person.create({
              name: 'Arthur'
            }, {
              name: 'Ford'
            });
          });
          afterEach(function() {
            return jQuery.ajax.restore();
          });
          it('should return a promise', function(done) {
            promise.done.should.be["function"];
            promise.state().should.be.eq('resolved');
            return promise.done(function() {
              return done();
            }).should.be.eq('resolved');
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
            promise = person.create({
              name: 'Arthur'
            }, {
              name: 'Ford'
            });
            promise.done.should.be["function"];
            promise.done(function() {
              return done();
            });
            return promise.state().should.be.eq('resolved');
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
            return jQuery.ajax.callCount.should.be.eq(3);
          });
        });
      });
      return describe('.destroy()', function() {
        return describe('with plural resource', function() {
          var arthur, deferred, person;

          arthur = person = deferred = null;
          beforeEach(function() {
            person = model.call({
              resource: 'person'
            });
            deferred = jQuery.Deferred();
            deferred.resolveWith(person({
              name: 'Arthur'
            }), [
              {
                id: 1
              }
            ]);
            sinon.stub(jQuery, "ajax").returns(deferred);
            return arthur = person({
              name: 'Arthur',
              id: 1
            });
          });
          afterEach(function() {
            return jQuery.ajax.restore();
          });
          it("throw exception when record has no id", function() {
            delete arthur.id;
            return expect(arthur.destroy).to["throw"](Error);
          });
          return it("should make ajax calls", function() {
            arthur.destroy();
            return jQuery.ajax.callCount.should.be.eq(1);
          });
        });
      });
    });
  });
});
