module.exports = function (request, reply, h) {
  if (request.payload.email === 'test@example.com' &&
      request.payload.password === 'password') {
    h.jsonReply('token.json');
  } else {
    h.jsonReply('not-authorized.json', {code: 401});
  }
};