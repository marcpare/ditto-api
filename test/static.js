var DittoFactory = require('./ditto-factory');
var request = require('request');
var test = require('tape');

function basicTest (t, options) {
  var ditto = DittoFactory({config: options.config});
  ditto.start();
  request({
    method: options.method,
    url: ditto.baseUrl+options.url,
    json: true
  }, function (err, resp, body) {
    t.deepEqual(body, options.expect)
    ditto.stop();
    t.end();
  });
}

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