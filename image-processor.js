var cv    = require('opencv');
var async = require('async');
var _     = require('lodash');

var IMAGE_WIDTH = 2048;

module.exports = function (image, callback) {
  async.waterfall([
    cv.readImage.bind(cv.readImage, image),
    function (im, cb) {
      im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
        var largestFace = _.max(faces, 'width');
        cb(err, largestFace);
      });
    },
    function (face, cb) {
      var direction;
      if (!face) {
        direction = null;
      } else if (face.x >= IMAGE_WIDTH / 2) {
        direction = 'left';
      } else {
        direction = 'right';
      }
      cb(null, {
        direction: direction,
        width: face.width,
        height: face.height
      });
    }
  ], function (err, data) {
    callback(err, data);
  });
};
