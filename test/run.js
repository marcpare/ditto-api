#!/usr/bin/env node
var Ditto = require('../ditto');
var ditto = new Ditto({
  port: 34345
});
ditto.start();