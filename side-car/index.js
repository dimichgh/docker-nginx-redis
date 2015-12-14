var express = require('express'),
    http = require('http');

var os = require('os');
var hostName = os.hostname();
var app = express();

app.get('/car', function(req, res, next) {
  res.send({helloCar:'world'},200);
});

app.get('/hello', function(req, res, next) {
  res.send({hello:'world'},200);
});

http.createServer(app).listen(process.env.PORT || 4000, function() {
  console.log('Car is running on port 4000 - http://', os.hostname() + ':4000');
});
