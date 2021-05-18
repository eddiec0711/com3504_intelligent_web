var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});


router.get('/room', function(req, res, next) {
  res.render('room', { title: 'Room' });
});


router.get('/image', function(req, res, next) {
  res.render('image', { title: 'Upload Image' });
});

router.post('/get_image', function(req, res) {
    let parent = __dirname + '/../';
    let imageDir = path.join(parent, 'private_access/Images/');
    let imageBlobs = [];

    fs.readdir(imageDir, async (err, files) => {
        files.forEach(file => {
            readImage(imageDir + file).then(blob => {
                imageBlobs.push(blob)
                if (imageBlobs.length === files.length) {
                    res.end(JSON.stringify({file: imageBlobs}));
                }
            }).catch(err => {
                console.log(err);
                imageBlobs.push(null);
            })
        });
    });

    async function readImage(file) {
        let imageBase64 = await fs.readFileSync(file, 'base64')
        let blob = "data:image/jpeg;base64," + imageBase64;
        return blob;
    }
});

router.post('/upload_image', function(req, res) {
    let parent = __dirname + '/../';
    let imagePath = path.join(parent, 'private_access/Images/');
    let imageFile = imagePath + req.body.title + '.jpg'

    let imageBlob = req.body.imageBlob.replace(/^data:image\/\w+;base64,/, "");
    let buf = Buffer.from(imageBlob, 'base64');
    fs.writeFile(imageFile, buf, function(err) {
        if (err) {
            console.log(err);
        }
    });

    // @TODO mongodb.save(imageFile, req.body.title, req.body.author, req.body.description)


    res.end(JSON.stringify({file:imageFile}));

});


module.exports = router;
