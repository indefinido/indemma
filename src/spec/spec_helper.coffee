root = exports ? window

indemma = require 'indemma'
chai    = require 'chaijs-chai'

# sinon is included on karma.conf.js

root.expect = chai.expect
root.should = chai.should()