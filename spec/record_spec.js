var root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

describe('record', function() {
  var record;

  record = root.record;
  return it('should create a record', function() {
    var arthur;

    arthur = record.call({
      resource: 'person'
    });
    return arthur.should.be.object;
  });
});

describe('model', function() {
  var model;

  model = root.model;
  return describe('#()', function() {
    xit('should throw exception if no resource is passed');
    return it('should create a record factory', function() {
      var john, person;

      person = model.call({
        resource: 'person'
      });
      person.should.be.object;
      john = person();
      john.should.be.object;
      return john.resource.should.have.property('name', 'person');
    });
  });
});
