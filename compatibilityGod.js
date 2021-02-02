var fs = require('fs');

var matchings = fs.readFileSync('./results.txt', 'utf8').split('\n');

var people = new Map();
var setPeople = new Set();

function addNewPossibleMatches(personA, personB, score){
    var possibleMatches = people.get(personA);
    //empty
    if(possibleMatches === undefined){
        possibleMatches = [{score: Number(score), possibleMatch:personB}];
        people.set(personA, possibleMatches);
        return;
    }
    //not empty
    var i = 0;
    var current = possibleMatches.length;
    while(i < possibleMatches.length){
        var nextMatch = possibleMatches[i];
        if(score > nextMatch.score){
            possibleMatches.splice(i,0,{score:Number(score), possibleMatch:personB});
            people.set(personA, possibleMatches);
            return;
        }
        i++;
    }
    possibleMatches.push({score:Number(score), possibleMatch:personB});
    people.set(personA, possibleMatches);
    return;
}

var i = 0;
//order everything
for(var i =0 ; i < matchings.length; i += 3){
    var personA = matchings[i];
    var personB = matchings[i+1];
    var score = matchings[i+2];
    addNewPossibleMatches(personA, personB, score);
    addNewPossibleMatches(personB, personA, score);
    setPeople.add(personA);
    setPeople.add(personB);
}

//console.log(people);
//console.log(setPeople);
str = "";
for(let person of people){
    
    str += person[0] + ' matches with '  + '\n';
    console.log(person[0] + ' matches with ') 
    for(var i = 0; i < person[1].length; i++) {
        if(person[1][i]){
            //console.log(person[1][i]);
            str += "          " + person[1][i].possibleMatch + ' with a score of ' + person[1][i].score + '\n';
            console.log (person[1][i].possibleMatch + ' with a score of ' + person[1][i].score);
        }
    }

    fs.writeFileSync('./matching.txt', str);
}

/*while(setPeople.size > 0){
    var i = 1;
    
    var minMatch = undefined;
    var personAMatch = undefined;
    //for(let person of setPeople){
        /*
        console.log('next person (' + i + '): ' + person);
        i++;
        var bestMatch = people.get(person)[0];
        console.log('best match is: ' + bestMatch.possibleMatch + ' with a score of: ' + bestMatch.score);
        */
        /*
        if(!minMatch){
            minMatch = people.get(person)[0];
            personAMatch = person;
        } else{
            var i = 0;
            while(!setPeople.has(people.get(person)[i]) && i < people.get(person).length) i++;
            if(i != people.get(person).length){
                var possibleMatch = people.get(person)[i];
                if(possibleMatch.score < minMatch.score){
                    minMatch = possibleMatch;
                    personAMatch = person;
                }
            }
        }
    }
    console.log('person: ' + personAMatch + ' is matched with ' + minMatch.possibleMatch + ' with score ' + minMatch.score);
    setPeople.delete(minMatch.possibleMatch);
    setPeople.delete(personAMatch);
    */
//}