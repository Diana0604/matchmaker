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
specialQuestions[7] = {
  "The scent of your lover.":"The scent of your lover.",
  "Pancakes being cooked.":"The musty smell of a wooden cabin isolated from the hustle and bustle of the city.",
  "A fresh rain shower.":"The salty ocean breeze from the deck of your house boat.",
  "A jasmine scented bubble bath.":"An orange tree growing outside your window."
}
specialQuestions[9] = {
  "Gin&Tonic":"A shot (or 12) of Tequila",
  "IPA":"Lager",
  "Cider":"A fruity cocktail",
  "The most expensive thing at the bar":"Nesquik"
}
specialQuestions[10] = {
  "Commedia dell’arte (A lot of character, but I don’t speak)":"An escape room is not a genre of theatre (I refuse to answer this question)",
  "Shakespeare (Romantic, but hard to understand)":"An experimental piece (Good luck figuring me out!)",
  "An escape room (once you enter, in I’ll never let you go)":"A kid’s show (Friendly and innocent!)",
  "A musical (Loud and in your face, with a lot of glitter)":"A 2 act play (I’m everywhere)",
  "Opera (People tend to dislike me and fall asleep)":"A drama (I have a tragic backstory)"
}
specialQuestions[14] = {
  "Awkwardly dancing next to the other person and hoping they notice me.":"I just yell ‘Hey I like you!’ while they walk by.",
  "A lot of laughing and eye contact.":"Impress them with my intelligence and wit.",
  "Showing a little skin.":"A flirty and forward text.",
  "I don’t have any flirting moves. I’m taking this quiz to find true love.":"Flirting is beneath me.",
  "Asking them to be my study partner.":"A vulnerable and deep talk."
}
specialQuestions[16] = {
  "Travel to a different country.":"Apply to Royal Central School of Speech and Drama (We’ll see how it goes ;) )",
  "Pretended I was a different person.":"Cut my hair.",
  "Something kinky that I’m not proud of.":"Bungee jumping.",
  "Nothing, I’ve never had the need to be ridiculous for sex.":"Nothing, I’ve never had the need to be ridiculous for sex.",
  "Gave them a very expensive gift.":"Took salsa dancing classes (FOR THREE YEARS. DIDN’T GET ME ANYTHING)"
}
specialQuestions[20] = {
  "Something plain and boring, I wasn’t prepared!":"My days of the week undies! Yaaay!",
  "A little red and lacy thing.":"Something black, sleek, and sexy.",
  "Something funny and colorful.":"Something funny and colorful.",
  "I’m not wearing any underwear ;)":"I'm entirely naked."
}
specialQuestions[22] = {
  "I put my hand on their knee and give them a knowing look.":"I initiate a drunk make out.",
  "I entice them back to my flat with the promise of a good movie and wine.":"I entice them back to my flat with the promise of a good movie and wine.",
  "I scream ‘Wanna have sex!?’ as they walk by.":"After a year of planning, I walk up to them and say hi.",
  "I write them a song about my feelings.":"I perform my mating dance for them."
}
horoscope = {
  "Aquarius":["Gemini"],
  "Gemini":["Aquarius"],
  "Pisces":["Cancer", "Scorpio"],
  "Cancer":["Pisces", "Scorpio"],
  "Scorpio":["Cancer", "Pisces"],
  "Aries":["Leo", "Libra", "Sagittarius"],
  "Sagittarius":["Aries", "Leo", "Libra"],
  "Leo":["Aries", "Sagittarius", "Libra"],
  "Libra":["Aries", "Leo", "Sagittarius"],
  "Taurus":["Virgo", "Capricorn"],
  "Virgo":["Taurus", "Capricorn"],
  "Capricorn":["Virgo", "Taurus"]
}
//% of compatible
compatibilities = [5, 6, 5, 3, 0, 3, 3, 5, 3, 3, 3, 2, 3, 3, 5, 6, 3, 2, 6, 3, 3, 6, 5, 6, 2, 3];
/*
totalC = 0;
compatibilities.forEach((comp) => {
  totalC += comp
});
console.log(totalC);
*/

function compareAnswers(index, answerA, answerB){
  if(sameAnswersCat.has(index)){
    if(answerA === answerB){
      return compatibilities[index];
    }
    return 0;
  }
  if(oppositeAnswerCat.has(index)){
    if(answerA != answerB){
      return compatibilities[index];
    }
    return 0;
  }
  if(almostOppositeAnswerCat.has(index)){
    if(answerA === almostOppositeNeutralAnswer[index] && answerB === almostOppositeNeutralAnswer[index]){
      return compatibilities[index];
    }
    if(answerA != almostOppositeNeutralAnswer[index] && answerB != almostOppositeNeutralAnswer[index]){
      if(answerA != answerB){
        return compatibilities[index];
      }
    }
    return 0;
  }
  if(specialQuestionsCat.has(index)){
    if(specialQuestions[index].answerA === answerB || specialQuestions[index].answerB === answerA){
      return compatibilities[index];
    }
    return 0;
  }
  if(index === 17){
    if(horoscope.answerA.includes(answerB) || horoscope.answerB.includes(answerA)){
      return compatibilities[index];
    }
    return 0;
  }
  return 0;
};

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
                userA.compatibility[userB._id] += compareAnswers(index, answer, answerB);
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