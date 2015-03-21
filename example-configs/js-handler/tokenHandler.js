module.exports = function (request, reply) {
  if (request.payload.email === 'test@example.json' &&
      request.payload.password === 'password') {
    jsonReply('token.json');
  } else {
    jsonReply('not-authorized.json', {code: 401});    
  }
};