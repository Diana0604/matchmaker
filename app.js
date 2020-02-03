
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:admin@valentine-abe6i.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");

  dbo.collection('users').find({}).toArray(function(err, docs){
      //console.log(docs);
      console.log(docs.length);
  })
/*
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
*/
  /*
  dbo.collection("users").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
  */
});
/*
//db
var mongoose = require('mongoose'),
    User = require("../valentine/models/user"),
    Question = require('../valentine/models/questions').Question,
    Answer = require('../valentine/models/answer').Answer;

function retreiveAllUsers(){
    User.find({}, function(err, users){
        if(err){
            console.log('error: ' + err);
        } else{
            console.log(users);
        }
    });
};

mongoose.connect("mongodb+srv://admin:admin@valentine-abe6i.mongodb.net/test?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to db');
    retreiveAllUsers();
}).catch(err => {
    console.log('error: ' + err);
});
*/