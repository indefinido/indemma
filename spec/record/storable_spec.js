'use strict';
var storable;

storable = require('indemma/lib/record/storable.js');

describe('storable', function() {
  it('should set the storable key', function() {
    return model.should.have.property('storable', true);
  });
  beforeEach(function() {
    return this.storage = storable();
  });
  return describe("#store", function() {
    beforeEach(function() {
      return this.data = {
        name: 'Arthur Dent'
      };
    });
    describe("write", function() {
      it("should write object on deep storage");
      it("should write object on storage", function() {
        this.storage.store('1', this.data);
        this.storage.writes.should.be.eq(1);
        return this.storage.database['1'].should.be.eq(this.data);
      });
      return it("should mark an object as sustained", function() {
        this.storage.store('1', this.data);
        return this.data.should.have.property('sustained', true);
      });
    });
    return describe("read", function() {
      beforeEach(function() {
        this.data = {
          name: 'Arthur Dent'
        };
        return this.storage.store('1', this.data);
      });
      it("should save object on storage", function() {
        return this.storage.store('1').should.be.eq(this.data);
      });
      return it("should unmark an object as sustained");
    });
  });
});
