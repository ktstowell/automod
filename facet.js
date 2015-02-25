'use strict';

/***********************************************************************************************************************************************
 * AUTOMOD FACETS
 ***********************************************************************************************************************************************
 * @description Creates a new instance of a facet;
 */

module.exports = function(specs) {

  var Facet = function(specs) {
    var scope = this;

    // Members/aliases
    this.name = specs.name;
    this.module = specs.module;
    this.modules = specs.modules;
    this.source = specs.source;
    this.specs = specs.specs;
    this.cached = null;

    /**
     * FACET
     *
     * @description  Is applied as the value within a map in the owning instance of Module
     *               will return a new require() instance or a cached one.
     * @param  {[type]} force [description]
     * @return {[type]}       [description]
     */
    this.facet = function(force) {

      if(!scope.cached || force) {
        scope.cached = require(scope.specs.path+'/'+scope.module+'/'+scope.source);

        if(scope.cached && scope.cached.constructor === Function) {
          scope.cached = scope.cached(scope.specs.data);
        }

      }

      return scope.cached;
    };

    return this.facet;
  };

  // Return a new instance of Facet
  return new Facet(specs);
};