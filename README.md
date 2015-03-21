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







Python:

