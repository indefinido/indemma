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
      beforeEach(function() {
        return this.person = model.call({
          $hetero: true,
          $by_type: [],
          $by_name: String,
          resource: 'person'
        });
      });
      it('should add scope methods to model', function() {
        return this.person.none.should.be["function"];
      });
      it('should generate scope methods based on model definition', function() {
        return this.person.hetero.should.be["function"];
      });
      describe('#none', function() {
        return it('should return empty response on fetch calls', function(done) {
          return this.person.none().fetch(null, function(people) {
            people.length.should.be.empty;
            return done();
          });
        });
      });
      describe('scope', function() {
        return describe('#(name, type)', function() {
          return it('should add scope methods to model', function() {
            this.person.scope('bissexual', Boolean);
            return this.person.bissexual.should.be["function"];
          });
        });
      });
      return describe('#{generated_scope}', function() {
        beforeEach(function() {
          this.request = jQuery.Deferred();
          sinon.stub(jQuery, "ajax").returns(this.request);
          return this.person.scope.clear();
        });
        afterEach(function() {
          return jQuery.ajax.restore();
        });
        describe('#every', function() {
          return it('should fetch models from the server', function(done) {
            var fetched;

            fetched = function(people) {
              people.should.be.array;
              people[0].name.should.be.string;
              return done();
            };
            this.person.every(fetched);
            this.request.resolveWith(this.person, [
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
        describe('when string', function() {
          it('should acumulate data in scope object', function() {
            this.person.by_name();
            return this.person.scope.data.by_name.should.be.a('string');
          });
          return it('should override data throught parameters', function() {
            this.person.by_name('Ford');
            return this.person.scope.data.by_name.should.be.eq('Ford');
          });
        });
        describe('when array', function() {
          it('should acumulate data in scope object', function() {
            this.person.by_type();
            return this.person.scope.data.by_type.should.be.a('array');
          });
          it('should override data throught parameters', function() {
            this.person.by_type(1, 2, 3);
            return this.person.scope.data.by_type.should.contain(1, 2, 3);
          });
          it('should use default value');
          it('should allow scope chaining');
          return describe('xhr request', function() {
            it('should build correct url', function() {
              var settings;

              this.person.by_type(1, 3, 4).fetch();
              settings = jQuery.ajax.firstCall.args[0];
              settings.should.have.property('data');
              settings.data.should.have.property('by_type');
              return settings.data.by_type.should.include(1, 3, 4);
            });
            return it('should make call', function() {
              this.person.by_type(1, 3, 4).fetch();
              return jQuery.ajax.callCount.should.be.eq(1);
            });
          });
        });
        describe('when boolean', function() {
          it('should acumulate data in scope object', function() {
            this.person.hetero();
            return this.person.scope.data.hetero.should.be.eq(true);
          });
          it('should override data throught parameters', function() {
            this.person.hetero(false);
            return this.person.scope.data.hetero.should.be.eq(false);
          });
          it('should allow scope chaining');
          return it('should make ajax call', function() {
            this.person.hetero().fetch();
            return jQuery.ajax.callCount.should.be.eq(1);
          });
        });
        return describe('#{generated_association}', function() {
          describe('of type belongs_to', function() {
            beforeEach(function() {
              this.person = model.call({
                $hetero: true,
                $by_type: [],
                resource: 'person'
              });
              return this.towel = model.call({
                resource: 'towel',
                material: 'cotton',
                belongs_to: 'person'
              });
            });
            return describe('#{generated_scope}', function() {
              return it('can be called on association', function() {
                var soft_towel;

                soft_towel = this.towel({
                  material: 'silicon microfiber'
                });
                soft_towel.build_person();
                return expect(soft_towel.person).to.respondTo('hetero');
              });
            });
          });
          return describe('of type has_many', function() {
            beforeEach(function() {
              this.person = model.call({
                $hetero: true,
                $by_type: [],
                resource: 'person',
                has_many: 'towels'
              });
              this.towel = model.call({
                $by_material: [],
                resource: 'towel',
                material: 'cotton',
                belongs_to: 'person'
              });
              this.arthur = this.person({
                name: 'Arthur'
              });
              return this.person.scope.clear();
            });
            return describe('#{generated_scope}', function() {
              it('can be called on association', function() {
                return expect(this.arthur.towels).to.respondTo('by_material');
              });
              it('should be serializable into paramenters', function() {
                var query_string;

                this.arthur.towels.by_material('cotton', 'microfiber');
                query_string = decodeURIComponent(jQuery.param(this.arthur.towels.scope.data));
                return query_string.should.be.eq('by_material[]=cotton&by_material[]=microfiber');
              });
              return describe('#every', function() {
                it('should empty association when no models are returned', function(done) {
                  var fetched,
                    _this = this;

                  fetched = function(towels) {
                    towels.should.be.array;
                    towels.should.be.empty;
                    _this.arthur.towels.should.have.length(0);
                     this.should.have.length(0) ;
                    return done();
                  };
                  this.arthur.towels.every(fetched);
                  this.request.resolveWith(this.arthur.towels, [[]]);
                  return jQuery.ajax.callCount.should.be.eq(1);
                });
                return it('should update resources when already exists in association', function(done) {
                  var aditions, fetched,
                    _this = this;

                  aditions = this.arthur.towels.add({
                    _id: 1,
                    material: 'colan'
                  });
                  fetched = function(towels) {
                    towels.should.be.array;
                    towels.should.have.length(1);
                    towels[0].material.should.be.eq('cotton');
                    aditions[0].material.should.be.eq('cotton');
                    _this.arthur.towels[0].material.should.be.eq('cotton');
                    return done();
                  };
                  this.arthur.towels.every(fetched);
                  this.request.resolveWith(this.arthur.towels, [
                    [
                      {
                        _id: 1,
                        material: 'cotton'
                      }
                    ]
                  ]);
                  return jQuery.ajax.callCount.should.be.eq(1);
                });
              });
            });
          });
        });
      });
    });
  });
});
