var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/associable');

describe('record', function() {
  var record;

  record = root.record;
  return it('should create a record');
});

describe('model', function() {
  var corporation, model, person;

  model = root.model;
  person = corporation = null;
  beforeEach(function() {
    var friend;

    corporation = model.call({
      resource: 'corporation'
    });
    friend = model.call({
      resource: 'friends'
    });
    return person = model.call({
      resource: 'person',
      has_many: 'friends',
      belongs_to: 'corporation'
    });
  });
  describe('belongs_to', function() {
    return it('should add builded object to association named attribute', function() {
      var arthur;

      arthur = person({
        name: 'Arthur Dent'
      });
      corporation = arthur.build_corporation();
      arthur.should.have.property('corporation');
      return expect(corporation).to.be.ok;
    });
  });
  return describe('has_many', function() {
    it('should return a record factory with associations stored', function() {
      var has_many;

      person.has_many.should.be.array;
      has_many = Array.prototype.splice.call(person.has_many, 0);
      return has_many.should.contain('friends');
    });
    return describe('#()', function() {
      it('should return a record with an association object', function() {
        return person().should.have.property('friends');
      });
      return describe('{generated_association}', function() {
        var association;

        association = null;
        beforeEach(function() {
          return association = person().friends;
        });
        it('should have query methods', function() {
          association.should.have.property('all');
          association.should.have.property('each');
          return association.should.have.property('reload');
        });
        return describe('#all', function() {
          return it('should auto observe nested associations attributes');
        });
      });
    });
  });
});
