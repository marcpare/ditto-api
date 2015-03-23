var test = require('tape');
var DittoFactory = require('./ditto-factory');
var request = require('request');

// var ditto = DittoFactory({
//   config: 'configs/js-handler/ditto.json'
// });
// ditto.start();
//
// test('js handler successful login', function (t) {
//   request({
//     method: 'post',
//     url: ditto.baseUrl+'token',
//     json: {
//       email: 'test@example.com',
//       password: 'password'
//     }
//   }, function (err, resp, body) {
//     t.deepEqual(body, {"token": "helloworldtoken"});
//     ditto.stop();
//     t.end();
//   });
// });