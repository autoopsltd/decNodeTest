var assert = require('assert'),
    http = require('http');
var server = require('../app/app.js').app;

describe('/', function () {
  it('should return 200', function (done) {
    http.get('http://localhost:3000', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('should say "Hello Auto Ops Ltd."', function (done) {
    http.get('http://localhost:3000', function (res) {
      var data = '';

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        assert.equal('Hello Auto Ops Ltd.\n', data);
        done();
      });
    });
  });
});
