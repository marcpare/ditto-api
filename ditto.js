var Hapi = require('hapi');
var fs   = require('fs');
var path = require('path');


function Ditto (options) {
  options = options || {};
  if (!options.port) throw "Missing options.port";
}

Ditto.prototype.start = function () {
  var server = new Hapi.Server();
  
  server.connection({
    host: 'localhost',
    port: this.port
  });
  
  server.start();
};

module.exports = Ditto;