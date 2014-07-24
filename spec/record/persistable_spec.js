var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

require('indemma/lib/record/persistable.js');

describe('persistable', function() {
  return describe('model', function() {
    it('should set the persistable key', function() {
      return model.should.have.property('persistable', true);
    });
    return describe('#find', function() {
      beforeEach(function() {
        this.xhr = jQuery.Deferred();
        sinon.stub(jQuery, "ajax").returns(this.xhr);
        this.personable = model.call({
          resource: 'person',
          has_many: 'friends',
          belongs_to: 'corporation'
        });
        this.arthur = this.personable({
          name: 'Arthur Philip Dent'
        });
        this.xhr.resolveWith(this.arthur, [
          {
            _id: 1
          }
        ]);
        return this.arthur.dirty = true;
      });
      afterEach(function() {
        return jQuery.ajax.restore();
      });
      return it('should try to store a record after saving when initialzed without id', function(done) {
        var _this = this;

        sinon.stub(this.personable.storage, 'store').returns(true);
        this.arthur.save(function() {
          expect(_this.personable.storage.store.calledOnce).to.be["true"];
          return done();
        });
        return this.personable.storage.store.restore();
      });
    });
  });
});
