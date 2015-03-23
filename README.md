ditto-api
===

Lightweight base for creating fake APIs with Node.

![splash](https://cloud.githubusercontent.com/assets/175162/6763987/4778d740-cf54-11e4-8813-6106bd7b74d0.gif)

Use it to build out your front-end while the back-end is under development or unreliable.

Use it to simulate unreliable connections.

Use it to inspect actual request and response headers.

Key features
---

* Make real HTTP requests to a running Hapi server
* Code over Configuration: hook in and write custom handlers if you need to
* Not just static responses: define response sequences so that routes can behave differently across multiple calls

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

    // a custom handler
    // notice the `jsonReply` helper
    ditto.route({
      method: "POST",
      path: "/token",
      handler: function (request, reply) {
        if (request.payload.email === 'test@example.com' &&
            request.payload.password === 'password') {
          this.jsonReply('token.json');    
        } else {
          this.jsonReply('not-authorized.json').code(401);
        }
      }
    });
    
    // simulate an unreliable connection for the next two requests
    ditto.route({
      method: "GET",
      path: "/recipes",
      handler: function (request, reply) {
        reply({error:true}).code(404);
      },
      times: 2
    });  
      
Install
---

    npm install ditto-api

Test
---
  
    npm test



