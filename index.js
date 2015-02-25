'use strict';

// Dependencies
var fs = require('fs');
var Module = require('./module');

/***********************************************************************************************************************************************
 * AUTO MOD
 ***********************************************************************************************************************************************
 * @description Automatic module loading with node.js
 */

var Automod = {};
    Automod.ignore = ['node_modules', 'app.js', 'server.js', 'automod', 'package.json', '.DS_Store'];
    Automod.modules = {};

module.exports = function(specs) {

  // Set up defaults.
  specs.path = specs.path || '../../';
  specs.ignore = specs.ignore || [];
  specs.data = specs.data || {};
  specs.data.automod = Automod;
  specs.data.modules = Automod.modules;

  // Join ignore.
  Automod.ignore = Automod.ignore.concat(specs.ignore);

  // crawl through root and create a keyspace for each module in modules and cache
  fs.readdirSync(specs.path).forEach(function(module) {
    if(Automod.ignore.indexOf(module) === -1) {
      // Create a new instance of an Automod module for every whitelisted item.
      Automod.modules[module] = Module(module, specs);
    }
  });

  return Automod;
};