const Image = require('../models/images');
var path = require('path');
var fs = require('fs');


exports.getAuthors = function (res) {
    try {
        Image.find({}, {author: 1, _id: 0}, function (err, authors) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(authors));
        })
    } catch (err) {
        console.log(err)
    }
}
//     MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("g11");
//     var target = {author: 1};
//     res = dbo.collection("image").find({}, target, function(err) {
//         if (err) throw err;
//         console.log("list all authors");
//         db.close();
//     });
//   });

//
// exports.getImages = function (req, res) {
    // MongoClient.connect(url, function(err, db) {
    // if (err) throw err;
    // var dbo = db.db("g11");
    // var target = {author: req.body.author};
    // res = dbo.collection("image").find(target, function(err) {
    //     if (err) throw err;
    //     db.close();
    // });
//   });
// }

exports.uploadImage = function (req, res) {
    let imageData = req.body;

    writeFile(imageData, res)
        .then(imageFile => {
        try {
            let image = new Image({
                title: imageData.title,
                description: imageData.description,
                author: imageData.author,
                filepath: imageFile
            });

            image.save(function (err, results) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    console.log(results)
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(image));
                }
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }).catch (err => res.status(500).send(err))
}

async function writeFile(imageData, res) {
    let parent = __dirname + '/../';
    let imagePath = path.join(parent, 'private_access/Images/');
    if (imageData.title == null || imageData.imageBlob == null) {
        res.status(403).send('Image information missing')
    }

    let imageFile = imagePath + imageData.title + '.jpg'
    let imageBlob = imageData.imageBlob.replace(/^data:image\/\w+;base64,/, "");
    let buf = Buffer.from(imageBlob, 'base64');
    await fs.writeFile(imageFile, buf, function(err) {
        if (err) {
            res.status(500).send('error ' + err);
        }
    });

    return imageFile;
}