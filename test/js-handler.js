// var test = require('tape');
// var DittoFactory = require('./ditto-factory');
// var request = require('request');

// var ditto = DittoFactory({
//   config: 'configs/js-handler/ditto.json'
// });
// ditto.start();
//
// test('js handler successful login', function (t) {
//   request({
//     method: 'post',
//     url: ditto.baseUrl+'token',
    // json: {
    //   email: 'test@example.com',
    //   password: 'password'
    // }
//   }, function (err, resp, body) {
//     t.deepEqual(body, {"token": "helloworldtoken"});
//     ditto.stop();
//     t.end();
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
  method: "POST",
  path: "/token",
  handler: function (request, reply) {
    if (request.payload.email === 'test@example.com' &&
        request.payload.password === 'password') {
      this.jsonReply('token.json');    
    } else {
      this.jsonReply('token.json', {code: 401});
    }
  }
});

test('js handler successful login', function (t) {
  request({
    method: 'post',
    url: 'http://localhost:18000/token',
    json: {
      email: 'test@example.com',
      password: 'password'
    }
  }, function (err, resp, body) {
    t.deepEqual(body, {token:"helloworldtoken"})
    t.end();
  });
});

test('cleanup', function (t) {
  ditto.stop();
  t.end();
})