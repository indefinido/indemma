var jQuery, rest, root;

require('indemma/lib/record/resource.js');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

rest = require('indemma/lib/record/rest.js');

jQuery = require('component-jquery');

describe('rest', function() {
  var object;

  object = null;
  beforeEach(function() {
    object = Object.create(rest);
    object.route = "users";
    return object.resource = "user";
  });
  beforeEach(function() {
    return sinon.stub(jQuery, "ajax").returns(jQuery.Deferred());
  });
  afterEach(function() {
    return jQuery.ajax.restore();
  });
  return describe('#delete', function() {
    return it('should make ajax call', function() {
      object["delete"]();
      return jQuery.ajax.called.should.be["true"];
    });
  });
});
