var express         = require('express');
var multer          = require('multer');
var app             = express();
var WebSocketServer = require('ws').Server;
var processImage    = require('./image-processor');

var wss = null;

app.use(multer({ dest: './uploads/'}))

app.get('/sample', function (req, res) {
  res.sendFile('sample.html', {root: '.'});
});

app.post('/image', function (req, res, next) {
  if (!req.files.image || !req.files.image.path) {
    return next(new Error('no file'));
  }
  var path = req.files.image.path;
  processImage(path, function (err, result) {
    if (err) {
      return next(err);
    }
    wss.clients.forEach(function (client) {
      client.send(JSON.stringify(result));
    });
    res.sendStatus(200);
  });
});

var server = app.listen(5000, function () {
  var host = server.address().address
  var port = server.address().port
  wss = new WebSocketServer({server: server});
});
