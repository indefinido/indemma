var associationable, composed, stampit;

stampit = require('../../../vendor/stampit');

associationable = stampit({
  validate_each: function(record, attribute, value) {
    var associated, associated_validation;

    associated = record[attribute];
    if (associated) {
      if (model[record.resource].has_one.indexOf(attribute) === -1) {
        throw new Error('Only has_one associations are supported to validates_associated');
      }
      associated_validation = associated.validate();
      associated_validation.done(function() {
        if (associated.errors.length) {
          return record.errors.add(attribute, 'associated', this.options);
        }
      });
      return associated_validation;
    }
  }
});

composed = stampit.compose(require('./validatorable'), associationable);

composed.definition_key = 'validates_associated';

module.exports = composed;
