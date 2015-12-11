var config = {
    "dbName"       : "wordutils",
    "host"         : process.env.MONGO_HOST || "127.0.0.1",
    "port"         : "27017",
    "user"         : process.env.MONGO_USER || "",
    "password"     : process.env.MONGO_PASS || "",
};

var errors = {};
var grammar = require('./lib/grammar.js');
var dicodb = require('./lib/dicodb.js');
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
                grams.push({'sentence': sentence, 'ngramsKeys': d._ngramsKeys, /*'ntreetag': d._ntreetag,*/ 'gramError': d.gramError}); //, 'grams': d._ngrams});

                run(index + 1, _next);
            });
        };
        
        run(0, function() {
            next(grams);
        });
    };
    
    var runTest = function(tests, next) {
        var keys = Object.keys(tests);
        
        var run = function(index, _next) {
            var sentence = keys[index];
            if(sentence == undefined){
                return _next();
            }
            
            sentence = sentence.toLowerCase().trim();
            if(sentence == ''){
                return run(index + 1, _next);
            }
            
            // console.log(sentence);
            var start = new Date().getTime();

            dicodb.gramsTags(sentence, function(error, tag) {
                if(error) throw error;
                var diff = (new Date().getTime() - start ) / 1000;
                console.log(sentence + ' ' + diff);
                
                var d = grammar.buildGramsFromTag(tag, sentence);
                if(d._ngramsKeys.length > 1){
                    console.log('-------------------------------------------------');
                    console.log('Error : Multiples grams for "' + keys[index] + '"');
                    console.log(d._ngramsKeys);
                    console.log('-------------------------------------------------');
                }
                else if(d._ngramsKeys.length  == 1 && d._ngramsKeys[0] != tests[keys[index]]){
                    console.log('-------------------------------------------------');
                    console.log('Error : ' + d._ngramsKeys[0] + ' != ' + tests[keys[index]] + ' for "' + keys[index] + '"');
                    console.log('-------------------------------------------------');
                    // errors[keys[index]] = d._ngramsKeys[0];
                }
                else if(d._ngramsKeys.length  == 0){
                    console.log('-------------------------------------------------');
                    console.log('Error : No grams for "' + keys[index] + '"');
                    console.log('-------------------------------------------------');
                }
                else {
                    // errors[keys[index]] = d._ngramsKeys[0];
                }
                
                run(index + 1, _next);
            });
        };
        
        run(0, next);
    };

    var tests = {
        "Henri mange du pain.": "nounp,verb:ind:pre:3:s,det:art:par:m:s,noun:m:s,ponct",
        "Je mange salement.": "pronoun:personal:1:s,verb:ind:pre:1:s,adverb,ponct",
        "Ils mangent avec Henri.": "pronoun:personal:3:m:p,verb:ind:pre:6:p,prep,nounp,ponct",
        "Ils mangent avec des fourchettes.": "pronoun:personal:3:m:p,verb:ind:pre:6:p,prep,det:art:und:p,noun:f:p,ponct",
        "Le chien mange des croquettes et Henri mange du pain.": "det:art:def:m:s,noun:m:s,verb:ind:pre:3:s,det:art:und:p,noun:f:p,conjc,nounp,verb:ind:pre:3:s,det:art:par:m:s,noun:m:s,ponct",
        "Le chien et Henri mangent du pain.": "det:art:def:m:s,noun:m:s,conjc,nounp,verb:ind:pre:6:p,det:art:par:m:s,noun:m:s,ponct",
        "Le chien et Henri mangent salement du pain.": "det:art:def:m:s,noun:m:s,conjc,nounp,verb:ind:pre:6:p,adverb,det:art:par:m:s,noun:m:s,ponct",
        "Le chien et Henri mangent salement du pain avec des fourchettes.": "det:art:def:m:s,noun:m:s,conjc,nounp,verb:ind:pre:6:p,adverb,det:art:par:m:s,noun:m:s,prep,det:art:und:p,noun:f:p,ponct",
        "Henri a mangé tout le pain.": "nounp,verb:ind:pre:3:s:avoir,verb:par:ppast:m:s,det:und:m:s,det:art:def:m:s,noun:m:s,ponct",
        "Je suis allé au marché vendredi.": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,verb:par:ppast:m:s,det:art:def:m:s,noun:m:s,adverb,ponct",
        "Je suis allé au marché vendredi pour faire les courses.": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,verb:par:ppast:m:s,det:art:def:m:s,noun:m:s,adverb,prep,verb:inf,det:art:def:p,noun:f:p,ponct",
        "J'ai acheté une maison dans les Alpes Maritimes.": "pronoun:personal:1:s,verb:ind:pre:1:s:avoir,verb:par:ppast:m:s,det:art:und:f:s,noun:f:s,prep,det:art:def:p,noun:f:p,adj:p,ponct",
        "Elle habite à Paris.": "pronoun:personal:3:f:s,verb:ind:pre:3:s,prep,nounp,ponct",
        "Est-ce que je vais me mettre en couple dans l'été ?": "adverb,pronoun:personal:1:s,verb:ind:pre:1:s,pronoun:personal:sec:1:s,verb:inf,prep,noun:m:s,prep,det:art:def:s,noun:m:s,ponct:interrogative",
        "Quel est mon avenir professionnel ?": "adj:m:s,verb:ind:pre:3:s:etre,det:pos:m:s,noun:comp:m:s,ponct:interrogative",
        "Est-ce que mes finances vont s'améliorer ?": "adverb,det:pos:p,noun:f:p,verb:ind:pre:6:p,pronoun:personal:sec:3,verb:inf,ponct:interrogative",
        "je me sens seule sentimentalement.": "pronoun:personal:1:s,pronoun:personal:sec:1:s,verb:ind:pre:1:s,adj:f:s,adverb,ponct",
        "j'aimerais être plus heureuse.": "pronoun:personal:1:s,verb:con:pre:1:s,verb:inf:etre,adverb,adj:f:s,ponct",
        "est-ce que je vais réussir mes projets.": "adverb,pronoun:personal:1:s,verb:ind:pre:1:s,verb:inf,det:pos:p,noun:m:p,ponct",
        "va-t-il me revenir bientôt ou pas.": "verb:ind:pre:3:s,pronoun:personal:3:m:s,pronoun:personal:sec:1:s,verb:inf,adverb,conjc,adverb,ponct",
        "vais trouver un travail fixe.": "verb:ind:pre:1:s,verb:inf,det:art:und:m:s,noun:m:s,adj:s,ponct",
        "je voudrais trouver l'amour.": "pronoun:personal:1:s,verb:con:pre:1:s,verb:inf,det:art:def:s,noun:m:s,ponct",
        "rien ne va.": "pronoun:undefined,adverb,verb:ind:pre:3:s,ponct",
        "j'habite où avec lui et les enfants?": "pronoun:personal:1:s,verb:ind:pre:1:s,adverb,prep,pronoun:personal:sec:3:m:s,conjc,det:art:def:p,noun:m:p,ponct:interrogative",
        "je veux refaire ma vie avec un homme.": "pronoun:personal:1:s,verb:ind:pre:1:s,verb:inf,det:pos:f:s,noun:f:s,prep,det:art:und:m:s,noun:m:s,ponct",
        "vais-je obtenir la garde de ma petite fille?": "verb:ind:pre:1:s,pronoun:personal:1:s,verb:inf,det:art:def:f:s,noun:s,prep,det:pos:f:s,noun:comp:f:s,ponct:interrogative",
        "quel est mon avenir ?": "adj:m:s,verb:ind:pre:3:s:etre,det:pos:m:s,noun:m:s,ponct:interrogative",
        "je suis célibataire.": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,adj:s,ponct",
        "s'il me trompe?": "conjs,pronoun:personal:3:m:s,pronoun:personal:sec:1:s,verb:ind:pre:3:s,ponct:interrogative",
        "je veux savoir si un homme m'aime ?": "pronoun:personal:1:s,verb:ind:pre:1:s,verb:inf,conjs,det:art:und:m:s,noun:m:s,pronoun:personal:sec:1:s,verb:ind:pre:3:s,ponct:interrogative",
        "je voudrais changer de vie.": "pronoun:personal:1:s,verb:con:pre:1:s,verb:inf,prep,noun:f:s,ponct",
        "je vais trouver le vrai amour ?": "pronoun:personal:1:s,verb:ind:pre:1:s,verb:inf,det:art:def:m:s,adj:m:s,noun:m:s,ponct:interrogative",
        "je cherche du travail.": "pronoun:personal:1:s,verb:ind:pre:1:s,det:art:par:m:s,noun:m:s,ponct",
        "je ne sais pas.": "pronoun:personal:1:s,adverb,verb:ind:pre:1:s,adverb,ponct",
        "mon ami m'a quitté pour une autre.": "det:pos:m:s,noun:m:s,pronoun:personal:sec:1:s,verb:ind:pre:3:s:avoir,verb:par:ppast:m:s,prep,det:art:und:f:s,adj:s,ponct",
        "est-ce que ma vie va changer?": "adverb,det:pos:f:s,noun:f:s,verb:ind:pre:3:s,verb:inf,ponct:interrogative",
        "est ce je suis enceinte ?": "adverb,pronoun:personal:1:s,verb:ind:pre:1:s:etre,adj:f:s,ponct:interrogative",
        "je ne suis pas bien dans mon travail.": "pronoun:personal:1:s,adverb,verb:ind:pre:1:s:etre,adverb,adj,prep,det:pos:m:s,noun:m:s,ponct",
        "j'attends l'homme de ma vie.": "pronoun:personal:1:s,verb:ind:pre:1:s,det:art:def:s,noun:m:s,prep,det:pos:f:s,noun:f:s,ponct",
        "vais je aimer de nouveau ?": "verb:ind:pre:1:s,pronoun:personal:1:s,verb:inf,adverb,ponct:interrogative",
        "je suis amoureuse.": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,adj:f:s,ponct",
        "dois-je espérer ou pas du tout.": "verb:ind:pre:1:s,pronoun:personal:1:s,verb:inf,conjc,adverb,ponct",
        "avons -nous un avenir ensemble ?": "verb:ind:pre:4:p:avoir,pronoun:personal:1:p,det:art:und:m:s,noun:m:s,adverb,ponct:interrogative",
        "comment va évoluer mon avenir sentimental ?": "adverb,verb:ind:pre:3:s,verb:inf,det:pos:m:s,noun:m:s,adj:m:s,ponct:interrogative",
        "je n'arrive pas à refaire ma vie.": "pronoun:personal:1:s,adverb,verb:ind:pre:1:s,adverb,prep,verb:inf,det:pos:f:s,noun:f:s,ponct",
        "reviendra-t-il?": "verb:ind:fut:3:s,pronoun:personal:3:m:s,ponct:interrogative",
        "vais je enfin rencontrer l'âme soeur ?": "verb:ind:pre:1:s,pronoun:personal:1:s,adverb,verb:inf,det:art:def:s,noun:f:s,ponct:interrogative",
        "problèmes d'argent que je veux absolument résoudre.": "noun:m:p,prep,noun:m:s,conjs,pronoun:personal:1:s,verb:ind:pre:1:s,adverb,verb:inf,ponct",
        "il est clair que le ciel est bleu.": "pronoun:personal:3:m:s,verb:ind:pre:3:s:etre,adj:m:s,conjs,det:art:def:m:s,noun:m:s,verb:ind:pre:3:s:etre,adj:m:s,ponct",
        "Que m'arrive-t-il?": "pronoun:interrogative,pronoun:personal:sec:1:s,verb:ind:pre:3:s,pronoun:personal:3:m:s,ponct:interrogative",
        "je suis amoureuse de pascal.": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,adj:f:s,prep,nounp,ponct",
        "je me pose des questions comme tout le monde , sur ma vie , rencontrer une personne sérieuse et être heureuse et d'autres questions…": "pronoun:personal:1:s,pronoun:personal:sec:1:s,verb:ind:pre:1:s,det:art:und:p,noun:f:p,adverb,ponct,adverb,ponct,verb:inf,det:art:und:f:s,noun:f:s,adj:f:s,conjc,verb:inf:etre,adj:f:s,conjc,prep,adj:p,noun:f:p,ponct",
        "mon mari va prendre sa retraite dans 15 jours.": "det:pos:m:s,noun:m:s,verb:ind:pre:3:s,verb:inf,det:pos:f:s,noun:f:s,prep,card,noun:m:p,ponct",
        "je présente des problèmes financiers et donc une mauvaise ambiance.": "pronoun:personal:1:s,verb:ind:pre:1:s,det:art:und:p,noun:comp:m:p,conjc,conjc,det:art:und:f:s,adj:f:s,noun:f:s,ponct",
        "mais je ne sais pas si cela peut devenir plus sérieux même s'il me le laisse entendre de temps en temps": "conjc,pronoun:personal:1:s,adverb,verb:ind:pre:1:s,adverb,conjs,pronoun:demonstrative,verb:ind:pre:3:s,verb:inf,adverb,adj:m,conjs,pronoun:personal:3:m:s,pronoun:personal:sec:1:s,pronoun:personal:sec:3:m:s,verb:ind:pre:3:s,verb:inf,adverb",
        "j'ai quitté un homme que j'aime mais qui vient de s'installer avec une autre.": "pronoun:personal:1:s,verb:ind:pre:1:s:avoir,verb:par:ppast:m:s,det:art:und:m:s,noun:m:s,conjs,pronoun:personal:1:s,verb:ind:pre:1:s,conjc,pronoun:relative,verb:ind:pre:3:s,prep,pronoun:personal:sec:3,verb:inf,prep,det:art:und:f:s,adj:s,ponct",
        "je suis très malade et mon ami vient de me quitter.": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,adverb,adj:s,conjc,det:pos:m:s,noun:m:s,verb:ind:pre:3:s,prep,pronoun:personal:sec:1:s,verb:inf,ponct",
        "pas de compagne , pas de revenus , pas de bonne santé , pas d'équilibre filial!": "adverb,prep,noun:f:s,ponct,adverb,prep,noun:m:p,ponct,adverb,prep,adj:f:s,noun:f:s,ponct,adverb,prep,noun:m:s,adj:m:s,ponct:exclamative",
        "que voyez vous avec yann?": "pronoun:interrogative,verb:ind:pre:5:p,pronoun:personal:2:p,prep,nounp,ponct:interrogative",
        "je voudrai savoir si avec mon compagnon avec qui je suis actuellement cela va durer et comment voyez vous ma vie avec lui?": "pronoun:personal:1:s,verb:ind:fut:1:s,verb:inf,conjs,prep,det:pos:m:s,noun:m:s,prep,pronoun:relative,pronoun:personal:1:s,verb:ind:pre:1:s:etre,adverb,pronoun:demonstrative,verb:ind:pre:3:s,verb:inf,conjc,adverb,verb:ind:pre:5:p,pronoun:personal:2:p,det:pos:f:s,noun:f:s,prep,pronoun:personal:sec:3:m:s,ponct:interrogative",
        "je vous remercie d'avance pour votre aide.": "pronoun:personal:1:s,pronoun:personal:sec:2:p,verb:ind:pre:1:s,prep,noun:f:s,prep,det:pos:s,noun:s,ponct",
        "je désire savoir si philippe né le 19 septembre 1970 a des sentiments pour moi ?": "pronoun:personal:1:s,verb:ind:pre:1:s,verb:inf,conjs,nounp,verb:par:ppast:m:s,det:art:def:m:s,date,verb:ind:pre:3:s:avoir,det:art:und:p,noun:m:p,adverb,ponct:interrogative",
        "je suis entre 2 prétendants mais ne sais pas le quel est le plus sincère et honnête dans ses intentions": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,prep,card,noun:m:p,conjc,adverb,verb:ind:pre:1:s,adverb,pronoun:relative,verb:ind:pre:3:s:etre,adverb,adj:s,conjc,adj:s,prep,det:pos:p,noun:f:p",
        "je voudrais savoir mon avenir et si je n'aurai pas d'ennuis à cause d'un héritage , en plus j'ai le parkinson et cela m'inquiète.": "pronoun:personal:1:s,verb:con:pre:1:s,verb:inf,det:pos:m:s,noun:m:s,conjc,conjs,pronoun:personal:1:s,adverb,verb:ind:fut:1:s:avoir,adverb,prep,noun:m:p,adverb,prep,det:art:und:m:s,noun:m:s,ponct,adverb,pronoun:personal:1:s,verb:ind:pre:1:s:avoir,det:art:def:m:s,noun:m:s,conjc,pronoun:demonstrative,pronoun:personal:sec:1:s,verb:ind:pre:3:s,ponct",
        "savoir si mon amant a des sentiments": "verb:inf,conjs,det:pos:m:s,noun:m:s,verb:ind:pre:3:s:avoir,det:art:und:p,noun:m:p",
        "je voudrais savoir si marie mon ancienne chérie va revenir avec moi ?": "pronoun:personal:1:s,verb:con:pre:1:s,verb:inf,conjs,nounp,det:pos:m:s,adj:f:s,noun:f:s,verb:ind:pre:3:s,verb:inf,prep,pronoun:personal:sec:1:s,ponct:interrogative",
        "qui est l'homme qui me demande sans cesse de l'argent ?": "pronoun:interrogative,verb:ind:pre:3:s:etre,det:art:def:s,noun:m:s,pronoun:relative,pronoun:personal:sec:1:s,verb:ind:pre:3:s,adverb,prep,det:art:def:s,noun:m:s,ponct:interrogative",
        "je voudrais savoir si mon mari a une chance que son contrat de travail qui finit le 24 juillet soit renouvelé en septembre.": "pronoun:personal:1:s,verb:con:pre:1:s,verb:inf,conjs,det:pos:m:s,noun:m:s,verb:ind:pre:3:s:avoir,det:art:und:f:s,noun:f:s,conjs,det:pos:m:s,noun:comp:m:s,pronoun:relative,verb:ind:pre:3:s,det:art:def:m:s,date,verb:sub:pre:3:s:etre,verb:par:ppast:m:s,prep,noun:m:s,ponct",
        "se passera t il quelque chose entre nous ?": "pronoun:personal:sec:3,verb:ind:fut:3:s,pronoun:personal:3:m:s,pronoun:undefined,adverb,ponct:interrogative",
        "je voudrais savoir quand vais je rencontrer l'amour ?": "pronoun:personal:1:s,verb:con:pre:1:s,verb:inf,adverb,verb:ind:pre:1:s,pronoun:personal:1:s,verb:inf,det:art:def:s,noun:m:s,ponct:interrogative",
        "vais je trouver l'amour auprès d'une des 2 femmes que je convoite": "verb:ind:pre:1:s,pronoun:personal:1:s,verb:inf,det:art:def:s,noun:m:s,adverb,prep,pronoun:undefined,det:art:und:p,card,noun:f:p,conjs,pronoun:personal:1:s,verb:ind:pre:1:s",
        "je suis amoureuse d'un autre homme que mon mari": "pronoun:personal:1:s,verb:ind:pre:1:s:etre,adj:f:s,prep,det:art:und:m:s,adj:s,noun:m:s,conjs,det:pos:m:s,noun:m:s",
        "est ce que je vais avoir des nouvelles favorables d un ex que j attends depuis un moment": "adverb,pronoun:personal:1:s,verb:ind:pre:1:s,verb:inf:avoir,det:art:und:p,noun:comp:f:p,prep,det:art:und:m:s,noun,conjs,pronoun:personal:1:s,verb:ind:pre:1:s,prep,adverb",
        "si c'était un cétacé , il surpassait en volume tous ceux que la science avait classés jusqu'alors.": "conjs,pronoun:demonstrative,verb:ind:imp:3:s:etre,det:art:und:m:s,noun:m:s,ponct,pronoun:personal:3:m:s,verb:ind:imp:3:s,prep,noun:m:s,det:und:m:p,pronoun:demonstrative,conjs,det:art:def:f:s,noun:f:s,verb:ind:imp:3:s:avoir,verb:par:ppast:m:p,prep,adverb,ponct",
        "quand la vie vous a fait don d'un rêve qui a dépassé toutes vos espérances , il serait déraisonnable de pleurer sur sa fin.": "conjs,det:art:def:f:s,noun:f:s,pronoun:personal:sec:2:p,verb:ind:pre:3:s:avoir,verb:par:ppast:m:s,prep,det:art:und:m:s,noun:m:s,pronoun:relative,verb:ind:pre:3:s:avoir,verb:par:ppast:m:s,det:und:f:p,det:pos:p,noun:f:p,ponct,pronoun:personal:3:m:s,verb:con:pre:3:s:etre,adj:s,prep,verb:inf,prep,det:pos:f:s,noun:s,ponct",
        "c est le vide en amour depuis plus de 2 ans , j ai un ami eric , né le 21/04/1963 , très proche mais homosexuel , notre relation me perturbe , peut on s aimer d amour un jour ou bien sommes nous proches à cause de notre vide affectif commun ?": "pronoun:demonstrative,verb:ind:pre:3:s:etre,det:art:def:m:s,noun:m:s,prep,noun:m:s,prep,adverb,prep,card,noun:m:p,ponct,pronoun:personal:1:s,verb:ind:pre:1:s:avoir,det:art:und:m:s,noun:m:s,nounp,ponct,verb:par:ppast:m:s,det:art:def:m:s,date,ponct,adverb,adj:s,conjc,adj:m:s,ponct,det:pos:s,noun:f:s,pronoun:personal:sec:1:s,verb:ind:pre:3:s,ponct,verb:ind:pre:3:s,pronoun:personal:3:s,pronoun:personal:sec:3,verb:inf,prep,noun:m:s,adverb,conjc,adj,verb:ind:pre:4:p:etre,pronoun:personal:1:p,adj:p,prep,det:pos:s,noun:m:s,adj:m:s,adj:m:s,ponct:interrogative"
    };

    
    var tests = {};
    
    var start = new Date().getTime();
    
    runTest(tests, function(error) {
        if(error){
            throw error;
        }
        var diff = (new Date().getTime() - start ) / 1000;
        console.log('Tests done in ' + diff);
        // var text = 'Henri mange du pain.';
        // var text = 'est ce je suis enceinte ?';
        // var text = '21 sophie est partie va t\'elle revenir?';
        // var text = 'je suis tomber amoureux de fabienne née le 14 août 1975 mais je sais pas si notre relation va devenir sérieuse.';
        // var text = 'je suis en couple avec dominique né le 6/12/57 mais on ne s\'entend pas vraiment ,  on vit ensemble depuis 4 mois après 3 années de relations mais je suis déçu de notre relation! comment va évoluer ma vie sentimentale?';
        // var text = "je suis en couple avec dominique né le 6/12/57 mais on ne s'entend pas vraiment ,  on vis ensemble depuis 4 mois après 3 années de relations mais je suis déçu de notre relation! comment va évoluer ma vie sentimental?";
        // var text = 'je suis en couple mais je suis déçu.';
        // var text = 'après 3 années de relations, je suis déçu dse notre relation! comment va évoluer ma vie sentimental?';
        // var text = 'il y a 2 mois , et plus de contact.';
        // var text = 'pourquoi rien ne me réussit';
        // var text = 'vais-je être embauché au poste que j\'occupe ?';
        // var text = 'j\'ai quitté un homme que j\'aime mais qui vient de s\'installer avec une autre.';
        // var text = 'ma compagne m a quitté il y a 1 mois et demi et ma date de naissance et le 02/05/1961.';
        // var text = 'savoir si mon amant a des sentiments';
        // var text = 'est ce que je vais avoir des nouvelles favorables d un ex que j attends depuis un moment';
        // var text = 'est ce que mon mari me trompe';
        // var text = 'je voudrais savoir si mon mari a une chance que son contra de travail qui finit le 24 juillet soit renouvelé en septembre';
        // var text = 'problèmes d\'argent que je veux absolument résoudre.';
        // var text = 'si c\'était un cétacé, il surpassait en volume tous ceux que la science avait classés jusqu\'alors.';
        // var text = 'Quand la vie vous a fait don d\'un rêve qui a dépassé toutes vos espérances, il serait déraisonnable de pleurer sur sa fin.';
        var text = 'un homme me préoccupe que va t il se passait avec lui?';
        getGrams(text, function(grams) {
            console.log(JSON.stringify(grams, null, 4));
            console.log(JSON.stringify(errors, null, 4));
            
            process.exit();
        })
    });
});