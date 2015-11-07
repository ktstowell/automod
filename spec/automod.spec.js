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
      var self = this,
          mod = automod({root: __dirname});

      setTimeout(function() {
        self.callback(null, mod);
      }, 1000);
    }, 'all package.json files should be retrieved recursively': function(mod) {
      // kind og a shitty test - but works since i know what __dirname is here.
      assert.equal(mod.packages.length, true);
    }
  },
  'Given I have a "users" module with a package.json...': {
    topic: function() {
      return automod({root: __dirname});
    }, ' and I have used "automod to be able to "require" it': {
      topic: function() {
        return require('users');
      }, 'I should gain access to its API from anywhere within my application simply by typing "require(users)"': function(users) {
        console.log(users);
      }
    }
  }
}).export(module);