var model, record, root, should_behave_like_errorsable;

require('indemma/lib/record/restfulable.js');

require('indemma/lib/record/validatable.js');

require('indemma/lib/record/resource.js');

'use strict';

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

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
        this.person = model.call({
          resource: 'person'
        });
        this.arthur = this.person({
          name: 'Arthur Philip Dent'
        });
        return this.arthur.dirty = true;
      });
      describe('.json()', function() {
        return it('should remove all non data properties', function() {
          return this.arthur.json().should.not.have.property('before_initialize');
        });
      });
      return describe('.save()', function() {
        beforeEach(function() {
          return sinon.stub(jQuery, "ajax").returns(jQuery.Deferred());
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        it('should be able to serialize record', function() {
          return JSON.stringify(this.arthur.json());
        });
        it('should ignore key in transient fields');
        it('should send paramenters accordingly');
        return it('should make ajax call', function() {
          this.arthur.save();
          return jQuery.ajax.called.should.be["true"];
        });
      });
    });
  });
  return describe('model', function() {
    return describe('()', function() {
      describe('.json()', function() {
        return beforeEach(function() {
          this.personable = model.call({
            resource: 'person',
            has_many: 'friends',
            nested_attributes: ['friends'],
            name: String
          });
          return this.friendable = model.call({
            resource: 'friend',
            belongs_to: 'person'
          });
        });
      });
      describe('.assign_attributes()', function() {
        beforeEach(function() {
          this.personable = model.call({
            resource: 'person',
            has_many: 'friends',
            belongs_to: 'company',
            has_one: 'towel',
            name: String
          });
          this.friendable = model.call({
            resource: 'friend',
            belongs_to: 'person',
            name: String
          });
          this.companyable = model.call({
            resource: 'company',
            has_many: 'people',
            name: String
          });
          this.towelable = model.call({
            resource: 'towel',
            belongs_to: 'person',
            material: String
          });
          this.arthur = this.personable({
            name: 'Arthur Dent'
          });
          this.ford = this.friendable({
            name: 'Ford Perfect'
          });
          this.marvin = this.friendable({
            name: 'Marvin'
          });
          this.megadodo = this.companyable({
            name: 'Megadodo Publications'
          });
          return this.towel = this.towelable({
            material: 'Microfiber'
          });
        });
        it('should not assign attribute with the same value twice', function() {
          var object;

          object = {};
          this.arthur = this.personable({
            name: object
          });
          this.arthur.assign_attributes({
            name: {
              wearing: 'robe'
            }
          });
          return this.arthur.name.should.not.be.eq(object);
        });
        it('assigns associations properly', function() {
          var attributes, search_record;

          attributes = {
            friends: [this.ford, this.marvin]
          };
          this.arthur.assign_attributes(attributes);
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
          search_record(this.arthur.friends, this.ford).should.be.eq["true"];
          return search_record(this.arthur.friends, this.arthur).should.be.eq["true"];
        });
        describe('when assigning has one', function() {
          it('should build new objects when associated not defined', function() {
            this.arthur.assign_attributes({
              towel: {
                material: 'Copper'
              }
            });
            this.arthur.should.have.property('towel');
            return this.arthur.towel.should.have.property('material', 'Copper');
          });
          return it('should not build new objects when associated already defined', function() {
            this.arthur.towel = this.towel;
            this.arthur.assign_attributes({
              towel: {
                name: 'Copper'
              }
            });
            this.arthur.should.have.property('towel', this.towel);
            this.arthur.towel.should.have.property('name', 'Copper');
            return this.towel.should.have.property('name', 'Copper');
          });
        });
        return describe('when assigning belongs to', function() {
          it('should build new objects when associated not defined', function() {
            this.arthur.assign_attributes({
              company: {
                name: 'Megado'
              }
            });
            this.arthur.should.have.property('company');
            return this.arthur.company.should.have.property('name', 'Megado');
          });
          return it('should not build new objects when associated already defined', function() {
            this.arthur.company = this.megadodo;
            this.arthur.assign_attributes({
              company: {
                name: 'Megado'
              }
            });
            this.arthur.should.have.property('company', this.megadodo);
            this.arthur.company.should.have.property('name', 'Megado');
            return this.megadodo.should.have.property('name', 'Megado');
          });
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
          beforeEach(function() {
            this.personable = model.call({
              resource: 'person'
            });
            this.deferred = jQuery.Deferred();
            this.deferred.resolveWith(this.personable({
              _id: 1,
              name: 'Arthur'
            }), [
              {
                _id: 1,
                name: 'Arthur'
              }
            ]);
            sinon.stub(jQuery, "ajax").returns(this.deferred);
            return this.promise = this.personable.create({
              name: 'Arthur'
            }, {
              name: 'Ford'
            });
          });
          afterEach(function() {
            return jQuery.ajax.restore();
          });
          it('should return a promise', function() {
            this.promise.done.should.be["function"];
            return this.promise.state().should.be.eq('resolved');
          });
          it('should return models when promise is resolved', function(done) {
            var created;

            created = function() {
              this.name.should.be.eq('Arthur');
              return done();
            };
            return this.personable.create({
              name: 'Arthur'
            }, {
              name: 'Ford'
            }, created);
          });
          it('should optionally accept create callback', function(done) {
            this.promise = this.personable.create({
              name: 'Arthur'
            }, {
              name: 'Ford'
            });
            this.promise.done.should.be["function"];
            this.promise.done(function() {
              return done();
            });
            return this.promise.state().should.be.eq('resolved');
          });
          it('should create record when only callback is passed', function(done) {
            this.personable.create(function() {
              return done();
            });
            return jQuery.ajax.callCount.should.be.eq(3);
          });
          it('should throw exception when nothing is passed', function() {
            return expect(this.personable.create).to["throw"](TypeError);
          });
          return it('should make ajax calls', function() {
            return jQuery.ajax.callCount.should.be.eq(2);
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
