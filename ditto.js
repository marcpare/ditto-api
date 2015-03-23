var Hapi = require('hapi');
var fs   = require('fs');
var path = require('path');
var _    = require('underscore');

function Ditto (options) {
  options = options || {};
  if (!options.port) throw "Missing options.port";
  this.port = options.port;
  this.baseDir = options.baseDir;
  
  var server = new Hapi.Server();
  this.server = server;  
  this.server.connection({
    host: 'localhost',
    port: this.port
  });
  this.baseUrl = 'http://localhost:'+this.port+'/'
}

Ditto.prototype.relativePath = function (p) {
  return path.join(this.baseDir, p);
}

Ditto.prototype.relativeJSON = function (jsonPath) {
  var fullPath = this.relativePath(jsonPath);
  var json = fs.readFileSync(fullPath);
  return JSON.parse(json);
};

Ditto.prototype.route = function (route) {
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

          // Supported templated JSON filenames
          // e.g. `"response": "recipe-<%=id%>.json"`
          
          jsonPath = _.template(jsonPath);
          var resolvedPath = jsonPath(request.params);
          
          reply(ditto.relativeJSON(resolvedPath));
        }
        ditto.server.route(route);
      }
    },
    {
      detect: function (route) {
        return route.handler && /\.js$/.test(route.handler);
      },
      addRoute: function (route){
        var handlerPath = ditto.relativePath(route.handler);
        var handler = require(handlerPath);
        var helpers = {
          jsonReply: function (jsonPath) {
            // TODO: call to static handler (need to factor out the static
            //       handler so that I can make this call).
          }
        };
        route.handler = function (request, reply) {
          handler(request, reply, helpers);
        };
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
  this.server.start();
};

Ditto.prototype.stop = function () {
  this.server.stop();
};

module.exports = Ditto;