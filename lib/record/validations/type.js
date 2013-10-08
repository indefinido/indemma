var composed, stampit, typeable, validations;

validations = require('../validatable');

stampit = require('../../../vendor/stampit');

typeable = stampit({
  validate_each: function(record, attribute, value) {
    this.type || (this.type = model[record.resource.toString()][attribute]);
    if (value) {
      if (value instanceof this.type) {
        this.type_name || (this.type_name = this.type.name);
        if (!value.valid) {
          return record.errors.add(attribute, 'type', {
            type_name: this.type_name != null
          });
        }
      } else {
        throw new Error("Invalid attribute value type! Found " + (typeof value) + " expected " + this.type.name);
      }
    }
  }
});

composed = stampit.compose(validations.validatable, typeable);

composed.definition_key = 'validates_type_of';

validations.manager.validators.type = composed;
