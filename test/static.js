var test = require('tape');
var basicTest = require('./basic-test');

test('loads and responds to static routes', function (t) {
  basicTest(t, {
    config: 'configs/static/ditto.json',
    method: 'get',
    url: 'recipes',
    expect: {"status": "recipes"}
  });
});

test('loads and responds to static routes with param', function (t) {   
  basicTest(t, {
    config: 'configs/static/ditto.json',
    method: 'get',
    url: 'recipes/1',
    expect: {"status": "recipe"}
  });
});