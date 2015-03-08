var express         = require('express');
var multer          = require('multer');
var app             = express();
var WebSocketServer = require('ws').Server;
var processImage    = require('./image-processor');
var path            = require('path');
var _               = require('lodash');

var wss = null;

var wsBroadcast = function (message) {
  if (!_.isString(message)) {
    message = JSON.stringify(message);
  }
  wss.clients.forEach(function (client) {
    client.send(message);
  });
};

app.use(multer({ dest: path.join(__dirname, 'tmp/uploads/')}));

app.get('/sample', function (req, res) {
  res.sendFile('sample.html', {root: __dirname});
});

app.get('/command', function (req, res) {
  res.sendFile('command.html', {root: __dirname});
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
    wsBroadcast(result);
    res.sendStatus(200);
  });
});

var initializeWebsocket = function () {
  wss = new WebSocketServer({server: server, path: '/ws'});
  wss.on('connection', function (ws) {
    ws.on('message', function (message) {
      wsBroadcast(message);
    });
  });
};

var server = app.listen(5000, function () {
  var host = server.address().address
  var port = server.address().port
  initializeWebsocket();
});
