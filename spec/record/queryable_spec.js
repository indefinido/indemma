var queryable, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

queryable = require('indemma/lib/record/queryable.js');

describe('queryable', function() {
  return describe('model', function() {
    beforeEach(function() {
      return this.personable = model.call({
        resource: 'person'
      });
    });
    it('should set the queryable key', function() {
      return model.should.have.property('queryable', true);
    });
    it('should create a storage', function() {
      return this.personable.should.have.property('storage');
    });
    return describe('#find', function() {
      beforeEach(function() {
        this.xhr = jQuery.Deferred();
        sinon.stub(jQuery, "ajax").returns(this.xhr);
        this.arthur = this.personable({
          _id: '1',
          name: 'Arthur Philip Dent'
        });
        this.arthur.save();
        return this.xhr.resolveWith(this.arthur, [this.arthur.json()]);
      });
      afterEach(function() {
        return jQuery.ajax.restore();
      });
      return it('should retrieve a record by key', function() {
        return this.personable.find('1').should.have.property('name', this.arthur.name);
      });
    });
  });
});
