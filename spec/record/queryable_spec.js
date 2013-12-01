var queryable, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

queryable = require('indemma/lib/record/queryable');

describe('queryable', function() {
  return describe('model', function() {
    beforeEach(function() {
      return this.person = model.call({
        resource: 'person'
      });
    });
    it('should set the queryable key', function() {
      return model.should.have.property('queryable', true);
    });
    it('should create a storage', function() {
      return this.person.should.have.property('storage');
    });
    return describe('#find', function() {
      beforeEach(function() {
        this.arthur = this.person({
          _id: '1',
          name: 'Arthur Philip Dent'
        });
        return this.arthur.save();
      });
      return it('should retrieve a record by key', function() {
        return this.person.find('1').should.have.property('name', this.arthur.name);
      });
    });
  });
});
