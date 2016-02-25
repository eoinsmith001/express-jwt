var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var querystring = require('querystring');

var url = 'localhost:3000';

describe('Authenticated API', function() {
  var token;

  it('shows error if contacting protected endpoint', function(done) {
    request(url)
    .get('/api')
    .expect(403)
    .end(function(err, result) {
      expect(err).to.not.exist;
      expect(result.body.success).to.be.false;
      done();
    });
  });

  it('can obtain a token', function(done) {
    request(url)
    .get('/token')
    .expect(200)
    .end(function(err, result) {
      expect(err).to.not.exist;
      expect(result.body.token).to.exist;
      token = result.body.token;
      done();
    });
  });

  it('reaches protected endpoint with valid token set in headers', function(done) {
    request(url)
    .get('/api')
    .set('x-access-token', token)
    .expect(200)
    .end(function(err, result) {
      expect(err).to.not.exist;
      expect(result.body.message).to.exist;
      done();
    });
  });

  it('reaches protected endpoint with valid token set in querystring', function(done) {
    var qstring = '?'+querystring.stringify({
      token: token
    });
    request(url)
    .get('/api'+qstring)
    .expect(200)
    .end(function(err, result) {
      expect(err).to.not.exist;
      expect(result.body.message).to.exist;
      done();
    });
  });
});
