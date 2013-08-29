var composed, cpfable, stampit, validations;

validations = require('../validatable');

stampit = require('../../../vendor/stampit');

cpfable = stampit({
  validate_format: function(value) {
    var c, d1, dv, i, v, _i, _j;

    value = value.replace(/[\.\-]/g, "");
    if (value.length < 11) {
      return false;
    }
    if (value.match(/^(0+|1+|2+|3+|4+|5+|6+|7+|8+|9+)$/)) {
      return false;
    }
    c = value.substr(0, 9);
    dv = value.substr(9, 2);
    d1 = 0;
    v = false;
    i = 0;
    for (i = _i = 1; _i <= 9; i = ++_i) {
      d1 += c.charAt(i) * (10 - i);
    }
    if (d1 === 0) {
      return false;
    }
    d1 = 11 - (d1 % 11);
    if (d1 > 9) {
      d1 = 0;
    }
    if (+dv.charAt(0 !== d1)) {
      return false;
    }
    d1 *= 2;
    for (i = _j = 1; _j <= 9; i = ++_j) {
      d1 += c.charAt(i) * (11 - i);
    }
    d1 = 11 - (d1 % 11);
    if (d1 > 9) {
      d1 = 0;
    }
    if (+dv.charAt(1) !== d1) {
      return false;
    }
    return true;
  },
  validate_each: function(record, attribute, value) {
    if (value && !this.validate_format(value)) {
      return record.errors.add(attribute, 'cpf', this.options);
    }
  }
});

composed = stampit.compose(validations.validatable, cpfable);

composed.definition_key = 'validates_cpf_format';

validations.manager.validators.cpf = composed;
