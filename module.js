'use strict';

var Facet = require('./facet');

/***********************************************************************************************************************************************
 * MODULE
 ***********************************************************************************************************************************************
 * @description Creates a new instance of a module.
 */
module.exports = function(name, specs) {
  var Module = function(name, specs) {

    // Members/aliases
    this.name = name;
    this.path = specs.path;
    this.automod = specs.data.automod;
    this.specs = specs;
    this.__facets = [];

    // Assign this to the exports object.
    specs.data.modules[this.name] = this;

    // First require
    this.module = require(this.path+ (this.path.charAt(this.path.length-1) === '/' ? '' : '/') + this.name);
    // If using fn version of module.exports, store the fn return and pass in the data.
    if(this.module && this.module.constructor === Function) {
      this.module = this.module(specs.data);
    }

    return this;
  };

  /**
   * FACETS
   *
   * @description Adds facets to the module.
   * @param facets
   * @returns {{load: load}}
   */
  Module.prototype.facets = function(facets) {
    var self = this;

    this.__facets = Object.keys(facets);

    // Add facets directly to class to preserve API of app.modules[module][facet]();
    for(var facet in facets) {
      this[facet] = Facet({name: facet, source: facets[facet], modules: self.automod.modules, module: name, specs: self.specs});
    }

    return {
      load: function(facets) {

        facets = facets || self.__facets;

        if(facets.constructor !== Array) { facets = [facets]}

        facets.forEach(function(facet) {
          self[facet]();
        });
      }
    }
  };

  // Return a new instance of Module
  return new Module(name, specs);
};