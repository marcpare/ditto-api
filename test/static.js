var test = require('tape');
var basicTest = require('./basic-test');
var path = require('path');
var request = require('request');

test('code over configuration', function (t) {
  
  var Ditto = require('../ditto');
  var ditto = new Ditto({
    port: 18000,
    baseDir: path.join(__dirname, 'configs')
  });
  
  ditto.route({
    "method": "GET",
    "path": "/recipes",
    "response": "recipes.json"
  });
  
  ditto.start();
  
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes',
    json: true
  }, function (err, resp, body) {
    t.deepEqual(body, {status:"recipes"})
    ditto.stop();
    t.end();
  });
  
});

// test('loads and responds to static routes', function (t) {
//   basicTest(t, {
//     config: 'configs/static/ditto.json',
//     method: 'get',
//     url: 'recipes',
//     expect: {"status": "recipes"}
//   });
// });
//
// test('loads and responds to static routes with param', function (t) {
//   basicTest(t, {
//     config: 'configs/static/ditto.json',
//     method: 'get',
//     url: 'recipes/1',
//     expect: {"status": "recipe"}
//   });
// });