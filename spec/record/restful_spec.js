var jQuery, model, record, root;

require('indemma/lib/record/restful');

root = typeof exports !== "undefined" && exports !== null ? exports : window;

model = root.model;

record = root.record;

jQuery = require('component-jquery');

describe('restfulable', function() {
  describe('when included', function() {
    return it('sets te restufulable loaded flag on model', function() {
      return model.restfulable.should.be["true"];
    });
  });
  describe('record', function() {
    var arthur;

    arthur = null;
    beforeEach(function() {
      arthur = record.call({
        resource: 'person',
        name: 'Arthur Philip Dent'
      });
      return arthur.dirty = true;
    });
    return describe('#save', function() {
      return it('sends correct parameters', function() {
        sinon.stub(jQuery, "ajax").returns(jQuery.Deferred());
        arthur.save();
        return jQuery.ajax.called.should.be["true"];
      });
    });
  });
  return describe('model', function() {});
});
