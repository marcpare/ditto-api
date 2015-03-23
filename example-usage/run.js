#!/usr/bin/env node
var request = require('request');
var Ditto = require('../ditto');
var path = require('path');

var ditto = new Ditto({
  port: 34345,
  baseDir: path.join(__dirname, 'json')
});

// return static JSON
ditto.route({
  method: 'get',
  path: '/recipes',
  response: 'recipes.json'
});

// dynamic JSON filename
ditto.route({
  method: 'get',
  path: '/recipes/{id}',
  response: 'recipe-{id}.json'
});

// works with query params, too
ditto.route({
  method: 'get',
  path: '/international-recipes',
  response: 'recipes-{query.country}.json'
});

ditto.start();

request.get('http://localhost:34345/recipes', function (err, resp, body) {
  console.log('/recipes');
  console.log(body);
});

request.get('http://localhost:34345/recipes/1', function (err, resp, body) {
  console.log('/recipes/1');
  console.log(body);
});

request.get('http://localhost:34345/international-recipes?country=guatemala', function (err, resp, body) {
  console.log('/international-recipes');
  console.log(body);
});