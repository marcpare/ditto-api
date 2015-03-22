var Hapi = require('hapi');
var fs   = require('fs');
var path = require('path');

function Ditto (options) {
  options = options || {};
  if (!options.port) throw "Missing options.port";
  if (!options.config) throw "Missing config file location";
  
  this.port = options.port;
  this.config = JSON.parse(fs.readFileSync(options.config));
  this.baseDir = path.dirname(options.config);
}

Ditto.prototype.relativeJSON = function (jsonPath) {
  var fullPath = path.join(this.baseDir, jsonPath);
  var json = fs.readFileSync(fullPath);
  return JSON.parse(json);
};

Ditto.prototype.addRoute = function (route) {
  var ditto = this;
  
  // LATER: factor out the `addRoute` methods
  
  routeAdders = [
    {
      detect: function (route) {
        return route.response && /\.json$/.test(route.response);
      },
      addRoute: function (route) {
        var jsonPath = route.response;
        delete route.response;        
        route.handler = function (request, reply) {
          reply(ditto.relativeJSON(jsonPath));
        }
        ditto.server.route(route);
      }
    }
  ];
  
  // Add the route using the first matching adder
  for (var i = 0; i < routeAdders.length; i++) {
    if (routeAdders[i].detect(route)) {
      routeAdders[i].addRoute(route);
      break;
    }
  }
    
};

Ditto.prototype.processConfig = function () {
  var routes = this.config.routes || [];
  routes.forEach(this.addRoute, this);
};

Ditto.prototype.start = function () {
  var server = new Hapi.Server();
  this.server = server;  
  server.connection({
    host: 'localhost',
    port: this.port
  });
  this.processConfig();
  server.start();
};

module.exports = Ditto;