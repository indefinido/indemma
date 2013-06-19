(function() {
  require('indemma');

  describe('record', function() {
    return it('should create a record factory', function() {
      return window.model('person');
    });
  });

}).call(this);
