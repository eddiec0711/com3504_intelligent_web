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
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(images));
            }
        })
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.uploadImage = function (req, res) {
    let imageData = req.body;

    try {
        let image = new Image({
            title: imageData.title,
            description: imageData.description,
            author: imageData.author,
            filepath: '/private_access/images/' + imageData.author + "_" + imageData.title + '.jpg'
        });

        image.save(function (err, results) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                writeFile(imageData, res)
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(image));
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

function writeFile(imageData) {
    let parent = __dirname + '/../';
    let imagePath = path.join(parent, 'private_access/images/');
    let imageFile = imagePath + imageData.author + "_" + imageData.title + '.jpg'

    let imageBlob = imageData.imageBlob.replace(/^data:image\/\w+;base64,/, "");
    let buf = Buffer.from(imageBlob, 'base64');
    fs.writeFileSync(imageFile, buf)
}