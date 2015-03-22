ditto-api
===

Lightweight library and client for creating fake APIs.

![splash](https://cloud.githubusercontent.com/assets/175162/6763987/4778d740-cf54-11e4-8813-6106bd7b74d0.gif)

Key features
---

* Make real HTTP requests to a running server
* Not just static responses: define response sequences so that routes can behave differently across multiple calls
* Controlled via HTTP so that you can use it from any language
* Stateful interactions

Use it to build out your front-end while the back-end is under development or unreliable.

Use it to drive test scenarios that are too tricky for mocks and stubs:

    var ditto = require('ditto-api');
    ditto.start({
      port: 12345,
      config: 'config/ditto.json'
    });
    
    ditto.route("recipes-ingredients-fail.json", {
      times: 1
    });
    
    ditto.route("recipes-ingredients-ok.json", {
      times: 1
    });
    
    requests.get('http://localhost:12345/recipes/1/ingredients')
      .response.code.should.be.equal(404);
    
    requests.get('http://localhost:12345/recipes/1/ingredients')
      .response.code.should.be.equal(200);

Configure responses with JSON or Javascript:

    // token-handler.js

    module.exports = function (request, reply) {
      if (request.payload.email === 'test@example.json' &&
          request.payload.password === 'password') {
        jsonReply('token.json');
      } else {
        jsonReply('not-authorized.json', {code: 401});    
      }
    };


Install
---

    npm install -g ditto-api

Run
---

    ditto-api -p 34567 -c ditto.json
    
Command line options

* p (port): which port to bind the server to
* c (config): server configuration file
    

Configure
---


`handler`: Javascript file which is required and run as a handler.

**Handler API**

Handlers have access to some global convenience functions

* `jsonReply(filename, options)`

Examples
---


Test
---


Client API
---

**Javascript**

Loads a route from a JSON file (relative to the configuration file location). Overrides the handler for an existing route with the same method and path.

    fakeApi.route("recipes-ingredients-fail.json");

Options:

`times`: Respond with the new route `times` number of times. Then revert to previous. Can stack up multiple calls like this.

    fakeApi.route("recipes-ingredients-fail.json", {
      times: 1
    });
    
    fakeApi.route("recipes-ingredients-ok.json", {
      times: 2
    });
    
    fakeApi.route("recipes-ingredients-fail.json", {
      times: 3
    });
    
    // responds: fail, fail, fail, ok, ok, fail





**Python**

