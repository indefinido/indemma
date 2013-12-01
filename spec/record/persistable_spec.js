var persistable, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

persistable = require('indemma/lib/record/persistable');

describe('persistable', function() {
  return describe('model', function() {
    it('should set the persistable key', function() {
      return model.should.have.property('persistable', true);
    });
    return describe('#find', function() {
      beforeEach(function() {
        this.person = model.call({
          resource: 'person',
          has_many: 'friends',
          belongs_to: 'corporation'
        });
        return this.arthur = this.person({
          _id: '1',
          name: 'Arthur Philip Dent'
        });
      });
      return it('should call try to store a record after saving', function(done) {
        var _this = this;

        sinon.stub(this.person.storage, 'store').returns(true);
        this.arthur.save(function() {
          expect(_this.person.storage.store.calledOnce).to.be["true"];
          return done();
        });
        return this.person.storage.store.restore();
      });
    });
  });
});
