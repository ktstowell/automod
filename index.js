'use strict';

// Dependencies
var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;
var findit = require('findit');
var path = require('path');
var chalk = require('chalk');

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
var commands = {
  nix: function(src, dest) { return 'if ! [ -L "' + dest + '" ]; then ln -s ' + src + ' ' + dest + '; fi'; },
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
  var root;
  var platform;
  var manifest;
  var dest;
  var logging;
  var packages = [];

  // member validation
  opts = (opts = opts || {});
  root = opts.root || process.cwd();
  logging = opts.logging || 'debug';
  platform = os.platform();
  manifest = 'package.json';
  dest = 'node_modules'

  // Get platform settings
  for(var type in platforms) {
    if(platforms[type].indexOf(platform) !== -1) {
      platform = type;
      break;
    }
  }

  /**
   * Start looking for package.json/manifest
   */
  find({src: root, find: manifest})
    // Upon finding:
    .on('found', function(data) {

      // Notify
      logger(logging, 'success', 'Package found');
      // Track found packages for return
      packages.push(data);

      // Run the command
      var foo = command(commands[platform](data.src, root + '/' + dest + '/' +data.pckg.name))
        .on('success', function(msg) { logger(logging, 'success', msg); })
        .on('error', function(msg) { logger(logging, 'error', msg); })
        .on('complete', function(msg) { logger(logging, 'complete', msg); });
    });

  return {opts: opts, platform: os.platform(), packages: packages};
}

//
// SUPPORT
//------------------------------------------------------------------------------------------//
// @description

/**
 * [description]
 * @return {[type]} [description]
 */
function command(cmd) {
  var stream = exec(cmd);
  var api;

  var events = {
    success: function() {},
    error: function() {},
    complete: function() {}
  };

  stream.stdout.on('data', function(data) {
    events.success(data);
  });

  stream.stderr.on('data', function(data) {
    events.error(data);
  });

  stream.on('close', function(data) {
    events.complete(data);
  });

  api = {
    on: on
  };

  return api;

  function on(type, fn) {
    events[type] = fn;
    return api;
  }
}

/**
 * [find description]
 * @param  {[type]} root [description]
 * @return {[type]}      [description]
 */
function find(data, fn) {
  var api;
  var finder = findit(data.src);
  var events = {
    found: function() {}
  };

  // Skip node modules/git
  finder.on('directory', function(dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') { stop(); } // make this configurable later
  });

  // On file, 
  finder.on('file', function(file, stat) {
    var name = path.basename(file);
    var pckg;
    var src;

    if(name === data.find) {
      pckg = require(file);
      src = file.split(name)[0];
      
      if(pckg) {
        events.found({pckg: pckg, src: src});
      }
    }
  });

  api = {
    on: on
  };

  return api;

  function on(type, fn) {
    events[type] = fn;
    return api;
  }
}

/**
 * [log description]
 * @param  {[type]} setting [description]
 * @param  {[type]} type    [description]
 * @param  {[type]} msg     [description]
 * @return {[type]}         [description]
 */
function logger(setting, type, msg) {
  console.log('Logger: ', setting, type, msg);
}