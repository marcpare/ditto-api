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
  method: "GET",
  path: "/recipes",
  response: "recipes.json"
});

test('responds one time', function (t) {
  
  t.plan(3);
  
  ditto.route({
    method: "GET",
    path: "/recipes",
    handler: function (request, reply) {
      reply({error:true}).code(404);
    },
    times: 2
  });
  
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes',
    json: true
  }, function (err, resp, body) {
    t.equal(resp.statusCode, 404);
  });
  
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes',
    json: true
  }, function (err, resp, body) {
    t.equal(resp.statusCode, 404);
  });
  
  request({
    method: 'get',
    url: 'http://localhost:18000/recipes',
    json: true
  }, function (err, resp, body) {
    t.equal(resp.statusCode, 200);
  });
  
});

test('cleanup', function (t) {
  ditto.stop();
  t.end();
})



