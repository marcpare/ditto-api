var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    'c': ['config'],
    'p': ['port']
  }
});

var port = argv.port || 34345;
var configPath = argv.config;