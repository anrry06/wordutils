var config = {
    "dbName"       : "wordutils",
    "host"         : process.env.MONGO_HOST || "127.0.0.1",
    "port"         : "27017",
    "user"         : process.env.MONGO_USER || "",
    "password"     : process.env.MONGO_PASS || "",
};


var errors = {};
var grammar = require('./../lib/grammar.js');
var dicodb = require('./../lib/dicodb.js');
dicodb.config = config;
dicodb.setDb(dicodb.config, function() {

    var getGrams = function(text, next) {
        text = dicodb.cleanText(text);
    
        var _textArray = text.replace(/\s\s/g, ' ').split(/([\.\;\?\:\!\(\)\[\]\«\»\…])/);
        var textArray = [];
        if(_textArray.length == 1){
            textArray = _textArray;
        } else {
            for(var i = 0, l = _textArray.length; i < l; i++){
                if(_textArray[i] != null && _textArray[i-1] != null && _textArray[i].length == 1 && i != 0){
                    textArray.push(_textArray[i-1] + _textArray[i]);
                    _textArray[i - 1] = null;
                    _textArray[i] = null;
                }
                else if(_textArray[i] != null && _textArray[i-1] != null && _textArray[i].length != 0 && i != 0) {
                    textArray.push(_textArray[i-1]);
                    _textArray[i - 1] = null;
                }
            }
        }
        // console.log(textArray);
        var grams = [];
    
        var run = function(index, _next) {
            var sentence = textArray[index];
            if(sentence == undefined){
                return _next();
            }
            
            sentence = textArray[index].toLowerCase().trim();
            if(sentence == ''){
                return run(index + 1, _next);
            }
            
            // console.log(sentence.split(/[\s\'\’’]/g));
            
            dicodb.gramsTags(sentence, function(error, tag) {
                if(error) throw error;

                var d = grammar.buildGramsFromTag(tag, sentence);
                // console.log(d.gramError);
                grams.push({'sentence': sentence, 'd': d});

                run(index + 1, _next);
            });
        };
        
        run(0, function() {
            next(grams);
        });
    };
    
    // var text = 'Henri mange du pain.';
    // var text = 'le lapin a tué un chasseur.';
    // var text = 'vais je gagner au loto ?';
    var text = 'Est-ce que je vais me mettre en couple dans l\'été ?';
    getGrams(text, function(grams) {
        console.log(JSON.stringify(grams[0].sentence, null, 4));
        console.log(JSON.stringify(grams[0].d._ngramsKeys, null, 4));
        if(grams[0].d._ngramsKeys.length == 1){
            grammar.analysis(grams[0].d, function(error, analysis) {
                console.log(JSON.stringify(analysis, null, 4));
                process.exit();
            });
        } else {
            console.log('Multiple grams !');
            process.exit();
        }
    })

});