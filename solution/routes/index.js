var express = require('express');
var router = express.Router();
var image = require('../controllers/images');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});


/* GET room page. */
router.get('/room', function(req, res, next) {
    res.render('room', { title: 'Room' });
});


/* GET image upload page. */
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload Image' });
});


/* POST retrieve authors */
router.post('/get_authors', image.getAuthors);


/* POST retrieve images using author as filter. */
router.post('/get_images', image.getImages);


/* POST upload image */
router.post('/upload_image', image.uploadImage);


module.exports = router;
