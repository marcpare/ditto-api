var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    'c': ['config'],
    'p': ['port']
  }
});

var port = argv.port || 34345;
var configPath = argv.config;

// read cli args
// port:
// config file:

// then start a hapi server

// then we add routes one by one

// test by sending http requests

