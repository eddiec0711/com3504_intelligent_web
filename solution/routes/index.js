var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


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


/* POST retrieve images */
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
        let blob = "data:image/jpg;base64," + imageBase64;
        return blob;
    }
});


/* POST upload image */
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

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("g11");
        var myobj = {title: req.body.title, description: req.body.description, author: req.body.author, filepath: imageFile};
        dbo.collection("image").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 image uploaded to mongodb");
          db.close();
        });
      });
    res.end(JSON.stringify({file:imageFile}));
});

//Search function
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("g11");
//     var myobj = {author: req.body.author};
//     dbo.collection("image").find(myobj, function(err, res) {
//       if (err) throw err;
//       console.log("1 image uploaded to mongodb");
//       console.log(res);
//       db.close();
//     });
//   });
// res.end(JSON.stringify({file:imageFile}));
module.exports = router;
