var composed, confirmationable, stampit, validations;

validations = require('../validatable');

stampit = require('../../../vendor/stampit');

confirmationable = stampit({
  validate_each: function(record, attribute, value) {
    if (record[attribute] !== record["" + attribute + "_confirmation"]) {
      return record.errors.add("" + attribute + "_confirmation", 'confirmation', this.options);
    }
  }
});

composed = stampit.compose(validations.validatable, confirmationable);

composed.definition_key = 'validates_confirmation_of';

validations.manager.validators.confirmation = composed;
