var express         = require('express');
var multer          = require('multer');
var app             = express();
var WebSocketServer = require('ws').Server;
var processImage    = require('./image-processor');

var wss = null;

app.use(multer({ dest: './uploads/'}))

app.post('/image', function (req, res) {
  wss.clients.forEach(function (client) {
  });
  res.sendStatus(200);
});

var server = app.listen(5000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port);
  wss = new WebSocketServer({server: server});
});
