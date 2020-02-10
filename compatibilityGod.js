var fs = require('fs');

var matchings = fs.readFileSync('./results.txt', 'utf8').split('\n');

var people = new Map();

function addNewPossibleMatches(personA, personB, score){
    var possibleMatches = people.get(personA);
    //empty
    if(possibleMatches === undefined){
        possibleMatches = [{score: score, possibleMatch:personB}];
        people.set(personA, possibleMatches);
        return;
    }
    //not empty
    var i = 0;
    var current = possibleMatches.length;
    console.log('current length: ' + current);
    while(i < possibleMatches.length){
        var nextMatch = possibleMatches[i];
        if(score > nextMatch.score){
            possibleMatches.splice(i,0,{score:score, possibleMatch:personB});
            people.set(personA, possibleMatches);
            return;
        }
        i++;
    }
    possibleMatches.push({score:score, possibleMatch:personB});
    people.set(personA, possibleMatches);
    return;
}

var i = 0;
for(var i =0 ; i < matchings.length; i += 3){
    var personA = matchings[i];
    var personB = matchings[i+1];
    var score = matchings[i+2];
    addNewPossibleMatches(personA, personB, score);
    addNewPossibleMatches(personB, personA, score);
}

console.log(people);