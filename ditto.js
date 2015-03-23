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
  
  this.handlerStacks = {};
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
  var data = request.params;
  data.query = request.query; // pass the query object to the template, too
  var resolvedPath = pathTemplate(request.params);
  return reply(this.relativeJSON(resolvedPath));
};

// Allows adding handlers to a route multiple times.
// If the `times` parameter of the route is set, call
// that handler that many times, then move on to the
// next handler. (Useful for simulating unreliable
// connections)
Ditto.prototype.pushRoute = function (route) {
  var ditto = this;
  var times = route.times || -1;
  delete route.times;
  
  var originalHandler = route.handler;
  
  var routeKey = route.method + " " + route.path;
  var existing = true;
  if (!ditto.handlerStacks[routeKey]) {
    existing = false;
    ditto.handlerStacks[routeKey] = []
  }

  var handler = function (request, reply) {
    var stack = ditto.handlerStacks[routeKey];
    var wrapper = stack[0];
    wrapper.handler(request, reply);
    if (wrapper.times) {
      wrapper.times--;
      if (wrapper.times === 0) {
        stack.shift();
      }
    }
    ditto.handlerStacks[routeKey] = stack;
  };
  
  ditto.handlerStacks[routeKey].unshift({
    handler: originalHandler,
    times: times
  });
  
  route.handler = handler;
  
  if (!existing) ditto.server.route(route);
};

var staticRouteAdder = {
  detect: function (route) {
    return route.response && /\.json$/.test(route.response);
  },
  addRoute: function (ditto, route) {
    var jsonPath = route.response;
    delete route.response;
    route.handler = function (request, reply) {
      ditto.jsonReply(request, reply, jsonPath);          
    }
    ditto.pushRoute(route);
  }
};

var jsRouteAdder = {
  detect: function (route) {
    return route.handler;
  },
  addRoute: function (ditto, route) {
    var customHandler = route.handler;
    route.handler = function (request, reply) {
      // Custom context to provide helpers to the handler so that
      // you can do things like:
      //     
      //    this.jsonReply('token.json')
      // 
      var handlerContext = {
        jsonReply: function (jsonPath) {
          return ditto.jsonReply(request, reply, jsonPath);
        }
      };
      customHandler.call(handlerContext, request, reply);
    };
    ditto.pushRoute(route);
  }
};

Ditto.prototype.route = function (route) {
  var ditto = this;
  
  routeAdders = [
    staticRouteAdder,
    jsRouteAdder
  ];
  
  // Add the route using the first matching adder
  for (var i = 0; i < routeAdders.length; i++) {
    if (routeAdders[i].detect(route)) {
      routeAdders[i].addRoute(ditto, route);
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