var words_occurrences = require('./lexiques/words_occurrences_big.json');

var findOccur = function(options){
    var results = {};
    var index = words_occurrences.wordsArray.indexOf(options.search);
    
    if(index == -1){
        // console.log('search ' + options.search + ' not find in words_occurrences.wordsArray');
        return results;
    }
    
    for(var k in options){
        if(k != 'search'){
            if(words_occurrences.words[index][k] && words_occurrences.words[index][k][options[k]]){
                results[k] = words_occurrences.words[index][k][options[k]];
            }
            // else {
            //     console.log('no occur for ' + k + ' ' + options[k]);
            // }
        }
    }
    
    return results;
};

var bestOccur = function(data){
    var bestWord = '';
    var bestCount = 0;
    var maxLength = 0;
    var _data = [];
    
    for(var i in data){
        var _result = findOccur(data[i]);
        _data.push(_result);
        if(Object.keys(_result).length > maxLength){
            maxLength = Object.keys(_result).length;
        }
    }
    
    // console.log(_data);
    
    for(var i in _data){
        _result = _data[i];
        if(Object.keys(_result).length == maxLength){
            var count = 0;
            for(var j in _result){
                count += _result[j];
            }
            if(count >  bestCount){
                bestCount = count;
                bestWord = data[i].search;
            }
        }
    }

    return bestWord;
};

module.exports = {
    'findOccur': findOccur,
    'bestOccur': bestOccur
};