var jQuery, model, record, root;

require('indemma/lib/record/resource');

require('indemma/lib/record/restfulable');

require('indemma/lib/record/scopable');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

jQuery = require('component-jquery');

describe('scopable', function() {
  describe('when included', function() {
    return it('sets te scopable loaded flag on model', function() {
      return model.scopable.should.be["true"];
    });
  });
  return describe('model', function() {
    return describe('#(options)', function() {
      var person;

      person = null;
      beforeEach(function() {
        return person = model.call({
          $hetero: true,
          $by_type: [],
          resource: 'person'
        });
      });
      describe('scope', function() {
        it('should add scope methods to model', function() {
          return person.hetero.should.be["function"];
        });
        return describe('#(name, type)', function() {
          return it('should add scope methods to model', function() {
            person.scope('bissexual', Boolean);
            return person.bissexual.should.be["function"];
          });
        });
      });
      return describe('#{generated_scope}', function() {
        var deferred;

        deferred = null;
        beforeEach(function() {
          deferred = jQuery.Deferred();
          sinon.stub(jQuery, "ajax").returns(deferred);
          return person.scope.clear();
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        describe('#all', function() {
          var promises;

          deferred = promises = person = null;
          return it('should return models when promise is resolved', function(done) {
            var fetched;

            fetched = function(people) {
              people.should.be.array;
              people[0].name.should.be.string;
              return done();
            };
            person.all(fetched);
            deferred.resolveWith(person, [
              [
                {
                  name: 'Arthur'
                }, {
                  name: 'Ford'
                }
              ]
            ]);
            return jQuery.ajax.callCount.should.be.eq(1);
          });
        });
        describe('when array', function() {
          it('should acumulate data in scope object', function() {
            person.by_type();
            return person.scope.data.by_type.should.be.a('array');
          });
          it('should override data throught parameters', function() {
            person.by_type(1, 2, 3);
            return person.scope.data.by_type.should.contain(1, 2, 3);
          });
          it('should use default value');
          it('should allow scope chaining');
          return it('should make ajax call', function() {
            person.by_type(1, 3, 4).fetch();
            return jQuery.ajax.callCount.should.be.eq(1);
          });
        });
        return describe('when boolean', function() {
          it('should acumulate data in scope object', function() {
            person.hetero();
            return person.scope.data.hetero.should.be.eq(true);
          });
          it('should override data throught parameters', function() {
            person.hetero(false);
            return person.scope.data.hetero.should.be.eq(false);
          });
          it('should allow scope chaining');
          return it('should make ajax call', function() {
            person.hetero().fetch();
            return jQuery.ajax.callCount.should.be.eq(1);
          });
        });
      });
    });
  });
});
