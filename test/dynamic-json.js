var test = require('tape');
var path = require('path');
var request = require('request');
var Ditto = require('../ditto');

var ditto = new Ditto({
  port: 18000,
  baseDir: path.join(__dirname, 'json')
});
ditto.start();

ditto.route({
  "method": "GET",
  "path": "/recipes/{id}",
  "response": "recipe-{id}.json"
});

test('loads a dynamic route', function (t) {
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes/1',
    json: true
  }, function (err, resp, body) {
    t.deepEqual(body, {status:"recipe1"})
    t.end();
  });
});

test('loads another dynamic route', function (t) {
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes/2',
    json: true
  }, function (err, resp, body) {
    t.deepEqual(body, {status:"recipe2"})
    t.end();
  });
});

ditto.route({
  method: "GET",
  path: "/recipes",
  response: 'recipes-{query.country}.json'
});

test('dynamic route for responding to query parameters', function (t) {
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes?country=guatemala',
    json: true
  }, function (err, resp, body) {
    t.equal(body.recipes[0].name, "Pupusas");
    t.end();
  });
});

test('cleanup', function (t) {
  ditto.stop();
  t.end();
})