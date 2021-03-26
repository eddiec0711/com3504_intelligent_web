var express = require('express');
var router = express.Router();
var fs = require('fs');

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
  res.render('image', { title: 'Image Upload' });
});

// router.post('/image', ****controller.js****);



router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});

router.post('/upload_image', function(req, res) {
  var targetDirectory = './private/images/';
  var newString = new Date().getTime();
  // if (!fs.existsSync(targetDirectory)) {
  //   fs.mkdirSync(targetDirectory);
  // }
  console.log('saving file ' + targetDirectory + newString);

  var imageBlob = req.body.imageBlob.replace(/^data:image\/\w+;base64,/, "");
  var buf = Buffer.from(imageBlob, 'base64');
  var filepath = targetDirectory + newString + '.png'
  // fs.writeFile(filepath, buf, function(err) {
  //   if (err) {
  //     console.log(err);
  //   }
  // });

  res.end(JSON.stringify({path:filepath}));
});


module.exports = router;
