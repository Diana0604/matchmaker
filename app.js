var query = require('cli-interact').getYesNo;
var fs = require('fs');
var DEBUG = 6;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:admin@valentine-abe6i.mongodb.net/test?retryWrites=true&w=majority";
//var url2 = "mongodb+srv://admin:admin@cluster0-uxcga.mongodb.net/test?retryWrites=true&w=majority";

//db.copyDatabase(fromdb, todb, fromhost, username, password, mechanism)
//var MongoClient = require('mongodb').MongoClient;


//same answer category
var sameAnswersCat = new Set();
sameAnswersCat.add(0); sameAnswersCat.add(1); sameAnswersCat.add(2); sameAnswersCat.add(6); sameAnswersCat.add(8); sameAnswersCat.add(11); sameAnswersCat.add(12);
sameAnswersCat.add(13); sameAnswersCat.add(19); sameAnswersCat.add(21); sameAnswersCat.add(24); sameAnswersCat.add(25);
//opposite answer category
var oppositeAnswerCat = new Set(); oppositeAnswerCat.add(5); oppositeAnswerCat.add(18);
//almost opposite answer category
var almostOppositeAnswerCat = new Set(); almostOppositeAnswerCat.add(15); almostOppositeAnswerCat.add(23);
var almostOppositeNeutralAnswer = [];
almostOppositeNeutralAnswer[15] = "I split it, it's 2020 honey."
almostOppositeNeutralAnswer[23] = "Sometimes I’m a passenger, sometimes I’m a pilot… what can I say?"
//special questions
var specialQuestionsCat = new Set(); specialQuestionsCat.add(7); specialQuestionsCat.add(9); specialQuestionsCat.add(10);
specialQuestionsCat.add(14); specialQuestionsCat.add(16); specialQuestionsCat.add(20); specialQuestionsCat.add(22);
var specialQuestions = [];
specialQuestions[7] = new Map();
specialQuestions[7].set("The scent of your lover.", "The scent of your lover.");
specialQuestions[7].set("Pancakes being cooked.", "The musty smell of a wooden cabin isolated from the hustle and bustle of the city.");
specialQuestions[7].set("A fresh rain shower.", "The salty ocean breeze from the deck of your house boat.");
specialQuestions[7].set("A jasmine scented bubble bath.", "An orange tree growing outside your window.");
specialQuestions[9] = new Map();
specialQuestions[9].set("Gin&Tonic", "A shot (or 12) of Tequila");
specialQuestions[9].set("IPA","Lager");
specialQuestions[9].set("Cider","A fruity cocktail");
specialQuestions[9].set("The most expensive thing at the bar","Nesquik");
specialQuestions[10] = new Map();
specialQuestions[10].set("Commedia dell’arte (A lot of character, but I don’t speak)","An escape room is not a genre of theatre (I refuse to answer this question)");
specialQuestions[10].set("Shakespeare (Romantic, but hard to understand)","An experimental piece (Good luck figuring me out!)");
specialQuestions[10].set("An escape room (once you enter, in I’ll never let you go)","A kid’s show (Friendly and innocent!)");
specialQuestions[10].set("A musical (Loud and in your face, with a lot of glitter)","A 2 act play (I’m everywhere)");
specialQuestions[10].set("Opera (People tend to dislike me and fall asleep)","A drama (I have a tragic backstory)");
specialQuestions[14] = new Map();
specialQuestions[14].set("Awkwardly dancing next to the other person and hoping they notice me.","I just yell ‘Hey I like you!’ while they walk by.");
specialQuestions[14].set("A lot of laughing and eye contact.","Impress them with my intelligence and wit.");
specialQuestions[14].set("Showing a little skin.","A flirty and forward text.");
specialQuestions[14].set("I don’t have any flirting moves. I’m taking this quiz to find true love.","Flirting is beneath me.");
specialQuestions[14].set("Asking them to be my study partner.","A vulnerable and deep talk.");
specialQuestions[16] = new Map();
specialQuestions[16].set("Travel to a different country.","Apply to Royal Central School of Speech and Drama (We’ll see how it goes ;) )");
specialQuestions[16].set("Pretended I was a different person.","Cut my hair.");
specialQuestions[16].set("Something kinky that I’m not proud of.","Bungee jumping.");
specialQuestions[16].set("Nothing, I’ve never had the need to be ridiculous for sex.","Nothing, I’ve never had the need to be ridiculous for sex.");
specialQuestions[16].set("Gave them a very expensive gift.","Took salsa dancing classes (FOR THREE YEARS. DIDN’T GET ME ANYTHING)");
specialQuestions[20] =  new Map();
specialQuestions[20].set("Something plain and boring, I wasn’t prepared!","My days of the week undies! Yaaay!");
specialQuestions[20].set("A little red and lacy thing.","Something black, sleek, and sexy.");
specialQuestions[20].set("Something funny and colorful.","Something funny and colorful.");
specialQuestions[20].set("I’m not wearing any underwear ;)","I'm entirely naked.");
specialQuestions[22] =  new Map();
specialQuestions[22].set("I put my hand on their knee and give them a knowing look.","I initiate a drunk make out.");
specialQuestions[22].set("I entice them back to my flat with the promise of a good movie and wine.","I entice them back to my flat with the promise of a good movie and wine.");
specialQuestions[22].set("I scream ‘Wanna have sex!?’ as they walk by.","After a year of planning, I walk up to them and say hi.");
specialQuestions[22].set("I write them a song about my feelings.","I perform my mating dance for them.");
horoscope = new Map()
horoscope.set("Aquarius", ["Gemini"]);
horoscope.set("Gemini",["Aquarius"]);
horoscope.set("Pisces",["Cancer", "Scorpio"]);
horoscope.set("Cancer",["Pisces", "Scorpio"]);
horoscope.set("Scorpio",["Cancer", "Pisces"]);
horoscope.set("Sagittarius",["Aries ", "Leo", "Libra"]);
horoscope.set("Leo",["Aries ", "Sagittarius", "Libra"]);
horoscope.set("Libra",["Aries ", "Leo", "Sagittarius"]);
horoscope.set("Taurus",["Virgo", "Capricorn"]);
horoscope.set("Virgo",["Taurus", "Capricorn"]);
horoscope.set("Capricorn",["Virgo", "Taurus"]);
horoscope.set("Aries ",["Leo", "Libra", "Sagittarius"]);
//% of compatible
compatibilities = [5, 6, 5, 3, 3, 3, 3, 5, 3, 3, 3, 2, 3, 3, 5, 6, 3, 2, 6, 3, 3, 6, 5, 6, 2, 3];
/*
totalC = 0;
compatibilities.forEach((comp) => {
  totalC += comp
});
console.log(totalC);
*/

answer3A = "";
answer3B = "";

function compareAnswers(index, answerA, answerB){
  var str = "";
  if(DEBUG != -1) str += "comparing " + answerA + " with " + answerB;
  if(sameAnswersCat.has(index)){
    if(DEBUG === 1 || DEBUG === 2) str += 'kind of answer: same answer \n';
    if(answerA === answerB){
      if(DEBUG === 1 || DEBUG === 2) str += ' add ' + compatibilities[index] + '% of comp \n';
      if(DEBUG === 1 || DEBUG === 2) fs.appendFile('answers.txt', str, function (err) { 
          if (err)
      console.log(err);
      });
     return compatibilities[index];
    }
    if(DEBUG === 1 || DEBUG === 2) fs.appendFile('answers.txt', str, function (err) { 
      if (err)
        console.log(err);
    });
    return 0;
  }
  if(oppositeAnswerCat.has(index)){
    if(DEBUG === 1 || DEBUG === 3) str += 'answers.txt', 'kind of answer: opposite answer \n';
    if(answerA != answerB){
      if(DEBUG === 1 || DEBUG === 3) fs.appendFile('answers.txt', str + ' add ' + compatibilities[index] + '% of comp \n', function (err) { 
        if (err)
        console.log(err);
      });
      return compatibilities[index];
    }
    if(DEBUG === 1 || DEBUG === 3) fs.appendFile('answers.txt', str, function (err) { 
      if (err)
      console.log(err);
    });
    return 0;
  }
  if(almostOppositeAnswerCat.has(index)){
    if(DEBUG === 1 || DEBUG === 4) str += 'kind of answer: almost opposite answer \n';
    if(answerA === almostOppositeNeutralAnswer[index] && answerB === almostOppositeNeutralAnswer[index]){
      if(DEBUG === 1 || DEBUG === 4) fs.appendFile('answers.txt', str + ' add ' + compatibilities[index] + '% of comp \n', function (err) { 
        if (err)
          console.log(err);
      });
      return compatibilities[index];
    }
    if(answerA != almostOppositeNeutralAnswer[index] && answerB != almostOppositeNeutralAnswer[index]){
      if(answerA != answerB){
        if(DEBUG === 1 || DEBUG === 4) fs.appendFile('answers.txt', str + ' add ' + compatibilities[index] + '% of comp \n', function (err) { 
          if (err)
            console.log(err);
        });
      return compatibilities[index];
      }
    }
    if(DEBUG === 1 || DEBUG === 4) fs.appendFile('answers.txt', str, function (err) { 
      if (err)
        console.log(err);
    });
    return 0;
  }
  //special
  if(specialQuestionsCat.has(index)){
    if(DEBUG === 1 || DEBUG === 5) str += 'kind of answer: special question \n';
    if(DEBUG === 1 || DEBUG === 5) str += answerA + ' has ' + specialQuestions[index].get(answerA) + '\n';
    if(DEBUG === 1 || DEBUG === 5) str += answerB + ' has ' + specialQuestions[index].get(answerB) + '\n';
    if(specialQuestions[index].get(answerA) === answerB || specialQuestions[index].get(answerB) === answerA){
      if(DEBUG === 1 || DEBUG === 5) fs.appendFile('answers.txt', str + ' add ' + compatibilities[index] + '% of comp \n', function (err) { 
        if (err)
        console.log(err);
      });
      return compatibilities[index];
    }
    if(DEBUG === 1 || DEBUG === 5) fs.appendFile('answers.txt', str, function (err) { 
      if (err)
      console.log(err);
    });
    return 0;
  }
  //horoscope
  if(index === 17){
    if(DEBUG === 1 || DEBUG === 6) str += ' \n kind of answer: horoscope \n';
    if(DEBUG === 1 || DEBUG === 6) str += 'horoscope a: ' + answerA + ' horoscopeB: ' + answerB + '\n';
    if(DEBUG === 1 || DEBUG === 6) str += 'compatibility of a: ' + horoscope.get(answerA) + '\n';
    if(DEBUG === 1 || DEBUG === 6) fs.appendFile('answers.txt', str, function(err){
      if(err) console.log(err);
    });
    if(horoscope.get(answerA).includes(answerB)){
      if(DEBUG === 1 || DEBUG === 6) str += 'matched!';
      if(DEBUG === 1 || DEBUG === 6) fs.appendFile('answers.txt', str, function(err){
        if(err) console.log(err);
      });
      return compatibilities[index];
    }
    if(DEBUG === 1 || DEBUG === 6) fs.appendFile('answers.txt', str, function(err){
      if(err) console.log(err);
    });
    return 0;
  }
  //love languages
  if(index === 3){
    answer3A = answerA;
    answer3B = answerB;
    return 0;
  }
  if(index === 4){
    var comp = 0;
    if(answer3A === answerB){
      comp += compatibilities[3];
    }
    if(answer3B === answerA){
      comp += compatibilities[4];
    }
    return comp;
  }
  return 0;
};

MongoClient.connect(url, {poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: false}, function(err, db){
    if (err) {
        console.log(err);
    }
    else {
      var dbTest = db.db("test");
      //tidying algorithm
      function tidy(user){
        var untidyAnswerList = user.answerList;
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
                  //user.answerList = answerList;
                  resolve({username:user.username, answerList:answerList});
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

        //iterate
        usersAnswered.forEach(function(userA, userIndex){
          //var userA = usersAnswered[1];
          userA.compatibility = [];
          tidy(userA).then(infoUserA => {
            for(var i = userIndex + 1; i < usersAnswered.length; i++){
              //console.log('index: ' + i);
              var userB = usersAnswered[i];
              //var userB = usersAnswered[2];
              //tidy answers
              tidy(userB).then(infoUserB => {
                answerListA = infoUserA.answerList;
                usernameA = infoUserA.username;
                answerListB = infoUserB.answerList;
                usernameB = infoUserB.username;
                var str = 'Comparing: ' + usernameA + ' with ' + usernameB + '\n';
                userA.compatibility[userB._id] = 0;
                answerListA.forEach(function(answerA, index){
                var answerB = answerListB[index];
                userA.compatibility[userB._id] += compareAnswers(index, answerA, answerB);
              });
              fs.appendFile('results.txt',str + 'these two people have a compatibility of: ' + userA.compatibility[userB._id] + '%\n' , function (err) { 
                if (err)
                console.log(err);
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