var model, record, root;

require('indemma/lib/record/resource');

require('indemma/lib/record/restfulable');

require('indemma/lib/record/scopable');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

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
      it('should add scope methods to model', function() {
        return person.none.should.be["function"];
      });
      it('should generate scope methods based on model definition', function() {
        return person.hetero.should.be["function"];
      });
      describe('#none', function() {
        return it('should return empty response on fetch calls', function(done) {
          return person.none().fetch(null, function(people) {
            people.length.should.be.empty;
            return done();
          });
        });
      });
      describe('scope', function() {
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
          return describe('xhr request', function() {
            it('should build correct url', function() {
              var settings;

              person.by_type(1, 3, 4).fetch();
              settings = jQuery.ajax.firstCall.args[0];
              settings.should.have.property('data');
              settings.data.should.have.property('by_type');
              return settings.data.by_type.should.include(1, 3, 4);
            });
            return it('should make call', function() {
              person.by_type(1, 3, 4).fetch();
              return jQuery.ajax.callCount.should.be.eq(1);
            });
          });
        });
        describe('when boolean', function() {
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
        return describe('#{generated_association}', function() {
          describe('of type belongs_to', function() {
            var towel;

            towel = null;
            beforeEach(function() {
              person = model.call({
                $hetero: true,
                $by_type: [],
                resource: 'person'
              });
              return towel = model.call({
                resource: 'towel',
                material: 'cotton',
                belongs_to: 'person'
              });
            });
            return describe('#{generated_scope}', function() {
              return it('can be called on association', function() {
                var soft_towel;

                soft_towel = towel({
                  material: 'silicon microfiber'
                });
                soft_towel.build_person();
                return expect(soft_towel.person).to.respondTo('hetero');
              });
            });
          });
          return describe('of type has_many', function() {
            var arthur, towel;

            arthur = towel = null;
            beforeEach(function() {
              person = model.call({
                $hetero: true,
                $by_type: [],
                resource: 'person',
                has_many: 'towels'
              });
              towel = model.call({
                $by_material: [],
                resource: 'towel',
                material: 'cotton',
                belongs_to: 'person'
              });
              return arthur = person({
                name: 'Arthur'
              });
            });
            return describe('#{generated_scope}', function() {
              it('can be called on association', function() {
                return expect(arthur.towels).to.respondTo('by_material');
              });
              return it('should be serializable into paramenters', function() {
                var query_string;

                arthur.towels.by_material('cotton', 'microfiber');
                query_string = decodeURIComponent(jQuery.param(arthur.towels.scope.data));
                return query_string.should.be.eq('by_material[]=cotton&by_material[]=microfiber');
              });
            });
          });
        });
      });
    });
  });
});
