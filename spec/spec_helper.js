var chai, indemma, root;

root = typeof exports !== "undefined" && exports !== null ? exports : window;

indemma = require('indemma');

chai = require('chaijs-chai');

root.expect = chai.expect;

root.should = chai.should();
