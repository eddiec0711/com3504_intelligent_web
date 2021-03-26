var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

//router.post('/', ****controller.js****);



router.get('/room', function(req, res, next) {
  res.render('room', { title: 'Room' });
});

//router.post('/room', ****controller.js****);



router.get('/image', function(req, res, next) {
  res.render('image', { title: 'Image' });
});

//router.post('/image', ****controller.js****);



router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});

//router.post('/upload', ****controller.js****);



module.exports = router;
