// var test = require('tape');
// var basicTest = require('./basic-test');

// test('loads a dynamic route', function (t) {
//   basicTest(t, {
//     config: 'configs/dynamic-json/ditto.json',
//     method: 'get',
//     url: 'recipes/1',
//     expect: {"status": "recipe1"}
//   });
// });
//
// test('loads another dynamic route', function (t) {
//   basicTest(t, {
//     config: 'configs/dynamic-json/ditto.json',
//     method: 'get',
//     url: 'recipes/2',
//     expect: {"status": "recipe2"}
//   });
// });


var test = require('tape');
var path = require('path');
var request = require('request');
var Ditto = require('../ditto');

var ditto = new Ditto({
  port: 18000,
  baseDir: path.join(__dirname, 'configs')
});
ditto.start();

ditto.route({
  "method": "GET",
  "path": "/recipes/{id}",
  "response": "recipe-<%=id%>.json"
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

test('cleanup', function (t) {
  ditto.stop();
  t.end();
})