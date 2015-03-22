var DittoFactory = require('./ditto-factory');
var request = require('request');

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
module.exports = basicTest;