const Image = require('../models/images');
var path = require('path');
var fs = require('fs');

exports.getImages = function (req, res) {
    let filter;
    if (req.body.author) {
        filter = {author: req.body.author}
    }
    else {
        filter = {}
    }

    try {
        Image.find(filter, function (err, images) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(images));
        })
    } catch (err) {
        console.log(err)
    }
}

exports.uploadImage = function (req, res) {
    let imageData = req.body;

    writeFile(imageData, res)
    try {
        let image = new Image({
            title: imageData.title,
            description: imageData.description,
            author: imageData.author,
            filepath: '/private_access/images/' + imageData.title + '.jpg'
        });

        image.save(function (err, results) {
            if (err) {
                res.status(500).send(err);
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(image));
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

function writeFile(imageData, res) {
    let parent = __dirname + '/../';
    let imagePath = path.join(parent, 'private_access/images/');
    if (imageData.title == null || imageData.imageBlob == null) {
        res.status(403).send('Image information missing')
    }

    let imageFile = imagePath + imageData.title + '.jpg'
    let imageBlob = imageData.imageBlob.replace(/^data:image\/\w+;base64,/, "");
    let buf = Buffer.from(imageBlob, 'base64');
    fs.writeFile(imageFile, buf, function(err) {
        if (err) {
            res.status(500).send('error ' + err);
        }
    });
}