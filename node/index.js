var express = require('express'),
    http = require('http'),
    redis = require('redis');
var hostname = require('os').hostname();
var app = express();
var os = require('os');

// console.log(process.env.REDIS_PORT_6379_TCP_ADDR + ':' + process.env.REDIS_PORT_6379_TCP_PORT);

// APPROACH 1: Using environment variables created by Docker
// var client = redis.createClient(
// 	process.env.REDIS_PORT_6379_TCP_PORT,
//   	process.env.REDIS_PORT_6379_TCP_ADDR
// );

// APPROACH 2: Using host entries created by Docker in /etc/hosts (RECOMMENDED)
// var client = redis.createClient('6379', 'redis');
var sidecar = require('./sidecar');

Object.keys(sidecar).forEach(function(key){
  console.log(key);

  app.get(sidecar[key], function(_req, _res, next){
    var options = {
      hostname: 'sidecar',
      port: 4000,
      path: sidecar[key],
      method: 'GET'
    };

    var proxy = http.request(options, function (res) {
       res.pipe(_res, {
         end: true
       });
     });

     _req.pipe(proxy, {
       end: true
     });
  });

});

app.get('/', function(req, res, next) {

  var options = {
    hostname: 'sidecar',
    port: 4000,
    path: '/car',
    method: 'GET'
  };

  var car = http.request(options, function(result) {

    result.setEncoding('utf8');
    var data = [];

    result.on('data', function (chunk) {
      data.push(chunk.toString());
    });

    result.on('end', function() {
      res.send({data: 123});
    });

  });

  car.on('error', function(e) {
    console.log(e);
    res.send('Error');
  });

  car.end();

});

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Server Is Listening on port ' + (process.env.PORT || 8080));
});
