var composed, confirmationable, stampit;

stampit = require('../../../vendor/stampit');

confirmationable = stampit({
  validate_each: function(record, attribute, value) {
    if (record[attribute] !== record["" + attribute + "_confirmation"]) {
      return record.errors.add("" + attribute + "_confirmation", 'confirmation', this.options);
    }
  }
});

composed = stampit.compose(require('./validatorable'), confirmationable);

composed.definition_key = 'validates_confirmation_of';

module.exports = composed;
