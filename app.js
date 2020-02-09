
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:admin@valentine-abe6i.mongodb.net/test?retryWrites=true&w=majority";
//var url2 = "mongodb+srv://admin:admin@cluster0-uxcga.mongodb.net/test?retryWrites=true&w=majority";

//db.copyDatabase(fromdb, todb, fromhost, username, password, mechanism)
//var MongoClient = require('mongodb').MongoClient;


//same answer category
var sameAnswersCat = new Set();
sameAnswersCat.add(0);
sameAnswersCat.add(1);
sameAnswersCat.add(2);
sameAnswersCat.add(6);
sameAnswersCat.add(8);
sameAnswersCat.add(11);
sameAnswersCat.add(12);
sameAnswersCat.add(13);
sameAnswersCat.add(19);
sameAnswersCat.add(21);
sameAnswersCat.add(24);
sameAnswersCat.add(25);
//opposite answer category
var oppositeAnswerCat = new Set();
oppositeAnswerCat.add(5);
oppositeAnswerCat.add(18);
//almost opposite answer category
var almostOppositeAnswerCat = new Set();
almostOppositeAnswerCat.add(15);
almostOppositeAnswerCat.add(23);
var almostOppositeNeutralAnswer = [];
almostOppositeNeutralAnswer[15] = "I split it, it's 2020 honey."
almostOppositeNeutralAnswer[23] = "Sometimes I’m a passenger, sometimes I’m a pilot… what can I say?"
//% of compatible
compatibilities = [5, 6, 5, 3, 0, 3, 3, 5, 3, 3, 3, 2, 3, 3, 5, 6, 3, 2, 6, 3, 3, 6, 5, 6, 2, 3];



MongoClient.connect(url, {poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: false}, function(err, db){
//MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log(err);
    }
    else {
      var dbTest = db.db("test");
      
      //tidying algorithm
      function tidy(untidyAnswerList){
        return new Promise((resolve, reject) => {
        var count = 0;
        var answerList = [];
        untidyAnswerList.forEach(function(answerObj, index){
          var id = answerObj._id;
          dbTest.collection('answers').find({'_id':id}).toArray( function(err, answer){
            var questionIndex = answer[0].question.question.substring(0,2);
            if(questionIndex[1] === '.'){
              questionIndex = questionIndex.substring(0,1);
            }
            count++;
            answerList[Number(questionIndex)-1] = answer[0].choice;
            if(count === 26){
              resolve(answerList);
            }
          });
        });
        });
      }

      dbTest.collection('users').find({}).toArray(function(err, users){
        //get userss
        usersAnswered = [];
        users.forEach(function(user){
          if(user.answerList.length > 0){
            usersAnswered.push(user);
          }
        });

        //iterate (for now just the first two)
        var userA = usersAnswered[0];
        var userB = usersAnswered[1];
        var compatibility = 0;
        //tidy answers
        tidy(userA.answerList).then(answerListA => {
          tidy(userB.answerList).then(answerListB => {
            answerListA.forEach(function(answer, index){
              answerB = answerListB[index];
              if(sameAnswersCat.has(index)){
                if(answer === answerListB[index]){
                  compatibility += compatibilities[index];
                }
              }
              if(oppositeAnswerCat.has(index)){
                if(answer != answerListB[index]){
                  compatibility += compatibilities[index];
                }
              }
              if(almostOppositeAnswerCat.has(index)){
                if(answer === almostOppositeNeutralAnswer[index] && answerListB[index] === almostOppositeNeutralAnswer[index]){
                  compatibility += compatibilities[index];
                }
                if(answer != almostOppositeNeutralAnswer[index] && answerListB[index] != almostOppositeNeutralAnswer[index]){
                  if(answer != answerListB[index]){
                    compatibility += compatibilities[index];
                  }
                }
              }
              if(index === 7){
                switch (answer) {
                  case "The scent of your lover." : {
                    if(answerB === "The scent of your lover."){
                      compatibility += compatibilities[index];
                    }
                    break;
                  }
                  case "Pancakes being cooked." : {
                    if(answerB === "The musty smell of a wooden cabin isolated from the hustle and bustle of the city."){
                      compatibility += compatibilities[index];
                    }
                    break;
                  }
                  case "A fresh rain shower." : {
                    if(answerB === "The salty ocean breeze from the deck of your house boat."){
                      compatibility += compatibilities[index];
                    }
                    break;
                  }
                  case "A jasmine scented bubble bath." : {
                    if(answerB === "An orange tree growing outside your window."){
                      compatibility += compatibilities[index];
                    }
                    break;
                  }
                }
                switch (answerB) {
                  case "Pancakes being cooked." : {
                    if(answer === "The musty smell of a wooden cabin isolated from the hustle and bustle of the city."){
                      compatibility += compatibilities[index];
                    }
                    break;
                  }
                  case "A fresh rain shower." : {
                    if(answer === "The salty ocean breeze from the deck of your house boat."){
                      compatibility += compatibilities[index];
                    }
                    break;
                  }
                  case "A jasmine scented bubble bath." : {
                    if(answer === "An orange tree growing outside your window."){
                      compatibility += compatibilities[index];
                    }
                    break;
                  }
                }
              }
            });
            console.log('this two people have a compatibility of: ' + compatibility + '%');
          });
        });
      });
    }
});