root = exports ? window

root.indemma = require 'indemma'
root.sinon   = require 'indemma/vendor/spec/sinon.js'

chai    = require 'chaijs-chai'
root.expect = chai.expect
root.should = chai.should()

jQuery = require("component~jquery@1.9.1")

