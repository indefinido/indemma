(function() {
  require('indemma');

  require('indemma/lib/record/restful');

  describe('restfulable', function() {
    var model;

    model = null;
    before(function() {
      return model = window.model;
    });
    return it('provides the restfulable configuration option for model', function() {
      return model.restfulable.should.be["function"];
    });
  });

}).call(this);
