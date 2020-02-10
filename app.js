
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
      function tidy(user){
        var untidyAnswerList = user.answerList;
        return new Promise((resolve, reject) => {
          if(user.isTidy){
            resolve (user.answerList);
          } else{
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
                  user.answerList = answerList;
                  user.isTidy = true;
                  resolve(answerList);
                }
              });
            });
          }
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
        usersAnswered.forEach(function(userA, userIndex){
          userIndex = 0;
          userA.compatibility = [];
          tidy(userA).then(answerListA => {
            for(var i = userIndex + 1; i < usersAnswered.length; i++){
              var userB = usersAnswered[i];
              //tidy answers
              tidy(userB).then(answerListB => {
                userA.compatibility[userB._id] = 0;
                answerListA.forEach(function(answer, index){
                answerB = answerListB[index];
                if(sameAnswersCat.has(index)){
                if(answer === answerListB[index]){
                  userA.compatibility[userB._id] += compatibilities[index];
                }
                }
                if(oppositeAnswerCat.has(index)){
                  if(answer != answerListB[index]){
                    userA.compatibility[userB._id] += compatibilities[index];
                  }
                }
                if(almostOppositeAnswerCat.has(index)){
                  if(answer === almostOppositeNeutralAnswer[index] && answerListB[index] === almostOppositeNeutralAnswer[index]){
                    userA.compatibility[userB._id] += compatibilities[index];
                  }
                  if(answer != almostOppositeNeutralAnswer[index] && answerListB[index] != almostOppositeNeutralAnswer[index]){
                    if(answer != answerListB[index]){
                      userA.compatibility[userB._id] += compatibilities[index];
                    }
                  }
                }
                if(index === 7){
                  switch (answer) {
                    case "The scent of your lover." : {
                      if(answerB === "The scent of your lover."){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Pancakes being cooked." : {
                      if(answerB === "The musty smell of a wooden cabin isolated from the hustle and bustle of the city."){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A fresh rain shower." : {
                      if(answerB === "The salty ocean breeze from the deck of your house boat."){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A jasmine scented bubble bath." : {
                      if(answerB === "An orange tree growing outside your window."){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                  switch (answerB) {
                    case "Pancakes being cooked." : {
                      if(answer === "The musty smell of a wooden cabin isolated from the hustle and bustle of the city."){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A fresh rain shower." : {
                      if(answer === "The salty ocean breeze from the deck of your house boat."){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A jasmine scented bubble bath." : {
                      if(answer === "An orange tree growing outside your window."){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                }
                if(index === 9){
                  switch (answer) {
                    case "Gin&Tonic" : {
                      if(answerB === "A shot (or 12) of Tequila"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "IPA" : {
                      if(answerB === "Lager"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Cider" : {
                      if(answerB === "A fruity cocktail"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "The most expensive thing at the bar" : {
                      if(answerB === "Nesquick"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                  switch (answerB) {
                    case "Gin&Tonic" : {
                      if(answer === "A shot (or 12) of Tequila"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "IPA" : {
                      if(answer === "Lager"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Cider" : {
                      if(answer === "A fruity cocktail"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "The most expensive thing at the bar" : {
                      if(answer === "Nesquick"){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    
                  }
                }
                if(index === 10){
                  switch(answer) {
                    case "Commedia dell'arte (A lot of character, but I don't speak)" : {
                      if(answerB.includes("not a genre of theatre")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Shakespeare (Romantic, but hard to understand)" : {
                      if(answerB.includes("experimental piece")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "An escape room (once you enter, in I'll never let you go)" : {
                      if(answerB.includes("kid's show")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A musical (Loud and in your face, with a lot of glitter)" : {
                      if(answerB.includes("A 2 act play")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Opera (People tend to dislike me and fall asleep)" : {
                      if(answerB.includes("A drama")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                  switch(answerB) {
                    case "A kid's show (Friendly and innocent!)" : {
                      if(answer.includes("once you enter")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A drama (I have a tragic backstory)" : {
                      if(answer.includes("Opera")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A 2 act play (I'm everywhere)" : {
                      if(answer.includes("musical")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "An escape room is not a genre of theatre (I refuse to answer this question)" : {
                      if(answer.includes("Commedia")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "An experimental piece (Good luck figuring me out!)" : {
                      if(answer.includes("Shakespeare")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                }
                if(index === 14){
                  switch(answer) {
                    case "Awkwardly dancing next to the other person and hoping they notice me." : {
                      if(answerB.includes("I just yell")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A lot of laughing and eye contact." : {
                      if(answerB.includes("Impress them with my")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Showing a little skin" : {
                      if(answerB.includes("forward text")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "I don't have any flirting moves. I'm taking this quiz to find true love." : {
                      if(answerB.includes("beneath me")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Asking them to be my study partner." : {
                      if(answerB.includes("deep talk.")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                  switch(answerB) {
                    case "A vulnerable and deep talk." : {
                      if(answer.includes("study partner")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Flirting is beneath me." : {
                      if(answer.includes("flirting moves")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "I just yell 'Hey I like you!' while they walk by." : {
                      if(answer.includes("dancing next to the other person")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A flirty and forward text." : {
                      if(answer.includes("skin")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Impress them with my intelligence and wit." : {
                      if(answer.includes("eye contact")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                }
                if(index === 16){
                  switch(answer) {
                    case "Travel to a different country." : {
                      if(answerB.includes("Royal Central School")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Pretended I was a different person." : {
                      if(answerB.includes("hair")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Something kinky that I'm not proud of." : {
                      if(answerB.includes("jumping")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Nothing, I've never had the need to be ridiculous for sex." : {
                      if(answerB.includes("Nothing")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Gave them a very expensive gift." : {
                      if(answerB.includes("salsa dancing")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                  switch(answerB) {
                    case "Bungee jumping." : {
                      if(answer.includes("kinky")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Apply to Royal Central School of Speech and Drama (We'll see how it goes ;) )" : {
                      if(answer.includes("country")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Cut my hair." : {
                      if(answer.includes("different person")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Took salsa dancing classes (FOR THREE YEARS. DIDN'T GET ME ANYTHING)" : {
                      if(answer.includes("expensive gift")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                }
                if(index === 17){
                  switch(answer) {
                    case "Aquarius" : {
                      if(answerB.includes("Gemini")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Gemini" : {
                      if(answerB.includes("Aquarius")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Pisces" : {
                      if(answerB.includes("Cancer" || answerB.includes("Scorpio"))){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Cancer" : {
                      if(answerB.includes("Pisces" || answerB.includes("Scorpio"))){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Scorpio" : {
                      if(answerB.includes("Pisces" || answerB.includes("Cancer"))){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Aries" : {
                      if(answerB.includes("Leo") || answerB.includes("Libra") || answerB.includes("Sagittarius")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Leo" : {
                      if(answerB.includes("Aries") || answerB.includes("Libra") || answerB.includes("Sagittarius")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Libra" : {
                      if(answerB.includes("Leo") || answerB.includes("Aries") || answerB.includes("Sagittarius")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Sagittarius" : {
                      if(answerB.includes("Leo") || answerB.includes("Libra") || answerB.includes("Aries")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Taurus" : {
                      if(answerB.includes("Virgo") || answerB.includes("Capricorn")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Capricorn" : {
                      if(answerB.includes("Virgo") || answerB.includes("Taurus")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Virgo" : {
                      if(answerB.includes("Taurus") || answerB.includes("Capricorn")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                }
                if(index === 20){
                  switch(answer) {
                    case "Something plain and boring, I wasn't prepared!" : {
                      if(answerB.includes("week undies")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "A little red and lacy thing." : {
                      if(answerB.includes("sleek, and sexy")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Something funny and colorful" : {
                      if(answerB.includes("Something funny and colorful")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "I'm not wearing any underwear ;)" : {
                      if(answerB.includes("entirely naked")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                  switch(answerB) {
                    case "I'm entirely naked." : {
                      if(answer.includes("not wearing any")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "My days of the week undies! Yaaay!" : {
                      if(answer.includes("prepared")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "Something black, sleek, and sexy." : {
                      if(answer.includes("red and lacy")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                }
                if(index === 22){
                  switch(answer) {
                    case "I put my hand on their knee and give them a knowing look." : {
                      if(answerB.includes("initiate a drunk")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "I entice them back to my flat with the promise of a good movie and wine." : {
                      if(answerB.includes("I entice them back to my flat with the promise of a good movie and wine.")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "I scream 'Wanna have sex!?' as they walk by." : {
                      if(answerB.includes("After a year of planning")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "I write a song about my feelings." : {
                      if(answerB.includes("I perform my mating dance for them.")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                  switch(answerB) {
                    case "I perform my mating dance for them." : {
                      if(answer.includes("song about")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "After a year of planning, I walk up to them and say hi." : {
                      if(answer.includes("scream")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                    case "I initiate a drunk make out." : {
                      if(answer.includes("knee")){
                        userA.compatibility[userB._id] += compatibilities[index];
                      }
                      break;
                    }
                  }
                }
              });
              console.log('these two people have a compatibility of: ' + userA.compatibility[userB._id] + '%');
            }).catch((error)=>{
              console.log(error);
            });
            }
          }).catch((error) => {
            console.log(error);
          });
        });
      });
    }
});