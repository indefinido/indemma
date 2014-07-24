'use strict';
var maid;

maid = require('indemma/lib/record/maid.js');

describe('maid', function() {
  beforeEach(function() {
    this.personable = model.call({
      resource: 'person',
      washing: true
    });
    this.arthur = this.personable({
      name: 'Arthur Dent'
    });
    return sinon.stub(this.arthur, 'save').returns(true);
  });
  return it('should save upon record dirtying', function(done) {
    debugger;
    var _this = this;

    this.arthur.name = 'Arthur Philip Dent';
    return setTimeout(function() {
      _this.arthur.save.called.should.be["true"];
      return done();
    }, 1000);
  });
});
