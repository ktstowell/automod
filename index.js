'use strict';

// Dependencies
var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;
var findit = require('findit');
var path = require('path');

/***********************************************************************************************************************************************
 * AUTO MOD
 ***********************************************************************************************************************************************
 * @description Automatic module loading with node.js
 */

//
// Platform Maps
//------------------------------------------------------------------------------------------//
// @description

/**
 * system map
 * @type {Object}
 */
var platforms = {
  nix: ['darwin', 'linux', 'unix'],
  win: ['win32', 'win64'] // not sure these are right - think they are
};

/**
 * Comand map
 * @type {Object}
 */
var cmds = {
  nix: function(src, dest) { return 'ln -s '+ src + ' ' + dest; },
  win: function(src, dest) { return 'cp -r '+ src + ' ' + dest; }
};

//
// MODULE ENTRY
//------------------------------------------------------------------------------------------//
// @description
// Accept root path or use cwd to check for all existing modules
// while ignoring node_modules.
// if a package.json is found, symlink or copy into node_module
// so that require() will work.
// 
// this means, identity platform early
// if windows - will need copy
// if *nix can use symlink
module.exports = function(opts) {
  var src;
  var platform;
  var finder;
  var manifest;

  // member validation
  opts = opts || {};
  src = opts.src || process.cwd();
  platform = os.platform();
  manifest = 'package.json';

  // Get map of generic platform
  for(var type in platforms) {
    if(platforms[type].indexOf(platform) !== -1) {
      platform = type;
      break;
    }
  }

  // start package.json parsing
  finder = findit(src);

  // Skip node modules/git
  finder.on('directory', function(dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') { stop(); }
  });

  finder.on('file', function(file, stat) {
    if(path.basename(file) === manifest)
  });
};