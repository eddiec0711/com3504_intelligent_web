var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function listauthor (res) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("g11");
    var target = {author: 1};
    res = dbo.collection("image").find({}, target, function(err) {
        if (err) throw err;
        console.log("list all authors");
        db.close();
    }); 
  });
}

function listauthorimage (req, res) {
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("g11");
    var target = {author: req.body.author};
    res = dbo.collection("image").find(target, function(err) {
        if (err) throw err;
        db.close();
    }); 
  });
}

function uploadimage (req) {
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
}