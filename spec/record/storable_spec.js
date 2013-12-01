var root, storable;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

storable = require('indemma/lib/record/storable');

describe('storable', function() {
  it('should set the storable key', function() {
    return model.should.have.property('storable', true);
  });
  beforeEach(function() {
    return this.storage = storable();
  });
  return describe("#store", function() {
    describe("write", function() {
      it("should write object on deep storage");
      return it("should write object on storage", function() {
        var data;

        data = {
          name: 'Arthur Dent'
        };
        this.storage.store('1', data);
        this.storage.writes.should.be.eq(1);
        return this.storage.database['1'].should.be.eq(data);
      });
    });
    return describe("read", function() {
      var data;

      data = null;
      beforeEach(function() {
        data = {
          name: 'Arthur Dent'
        };
        return this.storage.store('1', data);
      });
      return it("should save object on storage", function() {
        return this.storage.store('1').should.be.eq(data);
      });
    });
  });
});
