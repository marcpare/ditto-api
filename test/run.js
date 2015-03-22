#!/usr/bin/env node
var request = require('request');
var Ditto = require('../ditto');
var ditto = new Ditto({
  port: 34345,
  config: 'example-configs/static/ditto.json'
});
ditto.start();

request.get('http://localhost:34345/recipes', function (err, resp, body) {
  console.log(body);
});