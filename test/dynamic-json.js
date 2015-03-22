var test = require('tape');
var basicTest = require('./basic-test');

test('loads a dynamic route', function (t) {
  basicTest(t, {
    config: 'configs/dynamic-json/ditto.json',
    method: 'get',
    url: 'recipes/1',
    expect: {"status": "recipe1"}
  });
});

test('loads another dynamic route', function (t) {   
  basicTest(t, {
    config: 'configs/dynamic-json/ditto.json',
    method: 'get',
    url: 'recipes/2',
    expect: {"status": "recipe2"}
  });
});