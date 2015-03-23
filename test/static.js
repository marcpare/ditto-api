var test = require('tape');
var path = require('path');
var request = require('request');
var Ditto = require('../ditto');

var ditto = new Ditto({
  port: 18000,
  baseDir: path.join(__dirname, 'json')
});
ditto.start();

test('responds to a static route', function (t) {
    
  ditto.route({
    "method": "GET",
    "path": "/recipes",
    "response": "recipes.json"
  });
    
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes',
    json: true
  }, function (err, resp, body) {
    t.deepEqual(body, {status:"recipes"})
    t.end();
  });
  
});

test('responds to a static route with a parameter', function (t) {
  
  ditto.route({
    "method": "GET",
    "path": "/recipes/{id}",
    "response": "recipe.json"
  });
    
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes/1',
    json: true
  }, function (err, resp, body) {
    t.deepEqual(body, {status:"recipe"})
    t.end();
  });
  
});

test('cleanup', function (t) {
  ditto.stop();
  t.end();
})