var express = require('express'),
    http = require('http');

var os = require('os');
var hostName = os.hostname();
var app = express();
var startDtTime ;



app.get('/health', function(req, res, next) {

  res.send({
    start: startDtTime,
    memory:{
      total: os.totalmem(),
      free: os.freemem()
    },
    env: {
      hostname: os.hostname(),
      uptime: os.uptime(),
      averageload: os.loadavg()
    }
  });
});

app.get('/hello', function(req, res, next) {
  res.send({hello:'world'},200);
});

http.createServer(app).listen(process.env.PORT || 4000, function() {
  startDtTime = new Date(Date.now());
  console.log('Car is running on port 4000 - http://', os.hostname() + ':4000');
});
