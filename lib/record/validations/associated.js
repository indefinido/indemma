var associationable, composed, stampit, validations;

validations = require('../validatable');

stampit = require('../../../vendor/stampit');

associationable = stampit({
  validate_each: function(record, attribute, value) {
    var associated_validation;

    if (record[attribute]) {
      if (model[record.resource].has_one.indexOf(attribute) === -1) {
        throw new Error('Only has_one associations are supported to validates_associated');
      }
      associated_validation = record[attribute].validate();
      associated_validation.done(function() {
        if (record[attribute].errors.length) {
          return record.errors.add(attribute, 'associated', this.options);
        }
      });
      return associated_validation;
    }
  }
});

composed = stampit.compose(validations.validatable, associationable);

composed.definition_key = 'validates_associated';

validations.manager.validators.association = composed;
