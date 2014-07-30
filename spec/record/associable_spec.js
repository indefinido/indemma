var $, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/associable.js');

$ = require('jquery');

describe('record', function() {
  var record;

  record = root.record;
  return it('should create a record');
});

describe('model', function() {
  var arthur, corporation, model, person, radio;

  model = root.model;
  arthur = radio = null;
  person = corporation = null;
  beforeEach(function() {
    var ford, friend;

    corporation = model.call({
      resource: 'corporation'
    });
    friend = model.call({
      resource: 'friends'
    });
    person = model.call({
      resource: 'person',
      has_many: 'friends',
      belongs_to: 'corporation'
    });
    radio = corporation({
      _id: 1,
      name: 'Local Radio'
    });
    ford = friend({
      _id: 2,
      name: 'Ford Perfect'
    });
    return this.arthur = arthur = person({
      _id: 3,
      name: 'Arthur Philip Dent'
    });
  });
  describe('has_one', function() {
    return it('should add a has_one property with the associations descriptions', function() {
      return $.type(person.has_one).should.be.eq('array');
    });
  });
  describe('belongs_to', function() {
    it('should add a belongs_to property with the associations descriptions', function() {
      return $.type(person.belongs_to).should.be.eq('array');
    });
    describe("{associated}_id", function() {
      xdescribe('with autobuild option on the asssociation', function() {
        return xit('should return an partial resource when acessing associated', function() {
          this.arthur.corporation_id = radio._id;
          this.arthur.should.have.property('corporation');
          this.arthur.corporation.should.be.object;
          this.arthur.corporation.should.have.property('resource');
          return this.arthur.corporation.should.have.property('_id', radio._id);
        });
      });
      xit('should fetch the resource when accessing associated and resource not present', function(done) {
        radio = corporation({
          _id: 1,
          name: 'Local Radio'
        });
        this.arthur.corporation_id = radio._id;
        this.arthur.corporation.should.be.object;
        this.arthur.corporation.should.have.property('resource', radio.resource);
        this.arthur.corporation._id.should.be(null);
        this.arthur.corporation.locking.should.be.object;
        return this.arthur.corporation.locking.done(function(corporation) {
          corporation.should.have.property('_id', radio.id);
          return corporation.should.have.property('name', radio.name);
        });
      });
      return it('should notify changes on property', function() {
        var subscribed;

        radio = corporation({
          _id: 1,
          name: 'Local Radio'
        });
        subscribed = sinon.spy();
        this.arthur.subscribe('corporation_id', subscribed);
        arthur.corporation_id = radio._id;
        this.arthur.observation.deliver();
        return subscribed.called.should.be["true"];
      });
    });
    describe("{associated}", function() {
      describe('with autoload option on the association', function() {
        return it('should create associated when sustained and stored', function() {
          radio.sustained.should.be["true"];
          arthur.corporation_id = radio._id;
          return arthur.should.have.property('corporation', radio);
        });
      });
      return it('should update associated id and record when associated record changes', function() {
        radio = corporation({
          _id: 1,
          name: 'Local Radio',
          sustained: true
        });
        expect(arthur.corporation).to.be.undefined;
        arthur.corporation = radio;
        arthur.should.to.have.property('corporation', radio);
        return arthur.should.to.have.property('corporation_id', radio._id);
      });
    });
    return describe("#build_{associated}", function() {
      return it('should add builded object to association named attribute', function() {
        arthur = person({
          name: 'Arthur Dent'
        });
        corporation = arthur.build_corporation();
        arthur.should.have.property('corporation');
        return expect(corporation).to.be.ok;
      });
    });
  });
  return describe('has_many', function() {
    it('should add a has_many property with the associations descriptions', function() {
      return $.type(person.has_many).should.be.eq('array');
    });
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
          association.should.have.property('find');
          association.should.have.property('each');
          return association.should.have.property('reload');
        });
        return describe('#every', function() {
          return it('should auto observe nested associations attributes');
        });
      });
    });
  });
});
