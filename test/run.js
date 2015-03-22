#!/usr/bin/env node
var Ditto = require('../ditto');
var ditto = new Ditto({
  port: 34345,
  config: 'example-configs/static/ditto.json'
});
ditto.start();