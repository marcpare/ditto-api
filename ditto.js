var Hapi = require('hapi');
var fs   = require('fs');
var path = require('path');
var _    = require('underscore');

_.templateSettings = {
  interpolate:  /\{(.+?)\}/g  
};

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

// Supports templated JSON filenames
// e.g. `"response": "recipe-{id}.json"`
Ditto.prototype.jsonReply = function (request, reply, jsonPath) {
  var pathTemplate = _.template(jsonPath);
  var resolvedPath = pathTemplate(request.params);
  reply(this.relativeJSON(resolvedPath));
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
          ditto.jsonReply(request, reply, jsonPath);          
        }
        ditto.server.route(route);
      }
    },
    {
      detect: function (route) {
        return route.handler;
      },
      addRoute: function (route) {
        var customHandler = route.handler;
        route.handler = function (request, reply) {
          // Custom context to provide helpers to the handler so that
          // you can do things like:
          //     
          //    this.jsonReply('token.json')
          // 
          var handlerContext = {
            jsonReply: function (jsonPath, options) {
              ditto.jsonReply(request, reply, jsonPath);
            }
          };
          customHandler = customHandler.bind(handlerContext);
          return customHandler(request, reply);
        };
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
  this.server.start();
};

Ditto.prototype.stop = function () {
  this.server.stop();
};

module.exports = Ditto;