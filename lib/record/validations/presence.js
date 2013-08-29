var composed, presenceable, stampit, validations;

validations = require('../validatable');

stampit = require('../../../vendor/stampit');

presenceable = stampit({
  validate_each: function(record, attribute, value) {
    if (value === null || value === '' || value === void 0) {
      return record.errors.add(attribute, 'blank', this.options);
    }
  }
});

composed = stampit.compose(validations.validatable, presenceable);

composed.definition_key = 'validates_presence_of';

validations.manager.validators.presence = composed;
