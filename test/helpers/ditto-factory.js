/*

Assign each new Ditto a new port number so
that many tests can be run asynchronously. 

*/

var Ditto = require('../ditto');
var path = require('path');

var port = 17000;

module.exports = function (options) {
  options.port = port;
  port++;
  options.config = path.join(__dirname, options.config);
  return new Ditto(options);
};