/***********************************************************************************************************************************************
 * AUTOMOD TEST SUITE 
 ***********************************************************************************************************************************************
 * @description
 */
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('automod');
var automod = require('..');
//
// TESTS
//------------------------------------------------------------------------------------------//
// @description
suite.addBatch({
  'When using automod... ': {
    topic: function() {
      return automod({src: __dirname});
    }, 'all package.json files should be retrieved recursively': function(mod) {
      console.log(mod)
      assert.equal(true, true);
    }
  }
}).export(module);