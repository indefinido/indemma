var stampit;

stampit = require('../../../vendor/stampit');

module.exports = stampit({
  validate: function() {
    throw new Error('Composed factory must override the validate method');
  },
  validate_each: function() {
    throw new Error('Composed factory must override the validate each method');
  }
});
