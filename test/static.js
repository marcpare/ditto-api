var Ditto = require('../ditto');
var request = require('request');
var test = require('tape');
var path = require('path');

var ditto = new Ditto({
  port: 34345,
  config: path.join(__dirname, 'configs/static/ditto.json')
});

test('loads and responds to static routes', function (t) {   
  ditto.start();
  request.get('http://localhost:34345/recipes', function (err, resp, body) {
    t.deepEqual(body, {"status": "recipes"})
    ditto.stop();
    t.end();
  });
});

// test('static route with param', function (t) {
//   request.get('http://localhost:34345/recipes/1', function (err, resp, body) {
//     t.deepEqual(body, {"status": "recipe"})
//     t.end();
//   });
// });