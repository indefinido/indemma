'use strict';
var maid;

maid = require('indemma/lib/record/maid.js');

describe('maid', function() {
  beforeEach(function() {
    return this.personable = model.call({
      resource: 'person',
      washing: true
    });
  });
  it('should save upon record dirtying', function(done) {
    var _this = this;

    this.arthur = this.personable({
      name: 'Arthur Dent'
    });
    sinon.stub(this.arthur, 'save').returns(true);
    this.arthur.name = 'Arthur Philip Dent';
    return setTimeout(function() {
      _this.arthur.save.called.should.be["true"];
      return done();
    }, 1000);
  });
  return it('should not save upon record creation', function(done) {
    var _this = this;

    this.timeout(10000);
    sinon.stub(jQuery, "ajax").returns(jQuery.Deferred());
    this.arthur = this.personable({
      name: 'Arthur Dent'
    });
    return setTimeout(function() {
      jQuery.ajax.called.should.be["false"];
      jQuery.ajax.restore();
      return done();
    }, 2000);
  });
});
