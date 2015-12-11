var grammar = {
    'mygram': require('./lexiques/mygram.extended.js'),

    'escapeRegExp': function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    'lightEscapeRegExp': function lightEscapeRegExp(str) {
        return str.replace(/[\:\,]/g, "\\$&");
    },
    'isDate': function isDate(word) {
        if(typeof word != 'string'){
            // console.log(word);
            return false;
        }
        if(word.match(/^[0-3]?[0-9]\/[0-3]?[0-9]\/(?:[0-9]{2})?[0-9]{2}$/)
            || word.match(/^(?:[0-9]{2})?[0-9]{2}\-[0-3]?[0-9]\-[0-3]?[0-9]$/)
            || word.match(/^(?:[0-9]{2})?[0-9]{2}[0-3]?[0-9][0-3]?[0-9]$/)
            || word.match(/^[0-3]?[0-9][0-3]?[0-9](?:[0-9]{2})?[0-9]{2}$/)
            || word.match(/^[0-3]?[0-9]\s?[0-3]?[0-9]\s?(?:[0-9]{2})?[0-9]{2}$/)
            || word.match(/^[0-3]?[0-9]\.[0-3]?[0-9]\.(?:[0-9]{2})?[0-9]{2}$/)
            || word.match(/^[0-3]?[0-9]\s(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s(?:[0-9]{2})?[0-9]{2}$/)
            || word.match(/^[0-3]?[0-9]\s(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)$/)
            ){
            return true;
        }
        
        return false;
    },  

    'cleanArray': function cleanArray(array, withKeys, sentence, _words, treetag) {
        if(array.length == 0){
            return {
                '_ngrams': [],
                '_ngramsKeys': [],
                '_nwords': [],
                '_ntreetag': []
            };
        }
        
        // console.log('start cleaning ' + array.length);
        var _ngrams = [];
        var _ngramsKeys = [];
        var doublonKeys = [];
        var _nwords = [];
        var _ntreetag = [];
        
        var lastRules = [];
        
        for (var y = 0, z = array.length; y < z; y++) {
            var key = array[y].join(',');
            var doublonkey = array[y].map(function(item, index) {
                return item + ( treetag[y][index] && treetag[y][index].lemma && treetag[y][index].lemma.pos == 'verb' && treetag[y][index].lemma.text ? ':' + treetag[y][index].lemma.text : '' );
            }).join(',');

            if (doublonKeys.indexOf(doublonkey) == -1) {
            
            // console.log(doublonkey)
                var b = true;

                for (var i = 0, l = this.mygram.false.length; i < l; i++) {
                    // if(this.mygram.false[i] == "det:pos:m:[^,]*,noun:comp:m:[^,]*,pronoun:relative,.*,verb:sub:pre:[^,]*:etre,verb:par:ppast:f:"){
                    //     console.log(key);
                    // }
                    var reg = new RegExp(this.lightEscapeRegExp(this.mygram.false[i]));
                    if (key.match(reg)) {
                        // console.log(key, reg);
                        if(lastRules.indexOf(this.mygram.false[i]) < 0){
                            lastRules.push(this.mygram.false[i]);
                        }
                        
                        b = false;
                        i = l;
                    }
                }

                if (b === true) {
                    for (var i in this.mygram.rules) {
                        if (b === true) {
                            b = this.mygram.rules[i](key, sentence, _words[y], treetag[y]);
                            if (b == false) {
                                // console.log(key, i);
                                if(lastRules.indexOf(i) < 0){
                                    lastRules.push(i);
                                }
                            }
                        }
                    }
                }

                if (b === true) {
                    doublonKeys.push(doublonkey);
                    _ngramsKeys.push(key);
                    _ngrams.push(array[y]);
                    _nwords.push(_words[y]);
                    _ntreetag.push(treetag[y]);
                }
            }
        }
        
        // console.log('end cleaning ' + _ngrams.length);
        var gramError = {};
        var result = {
            '_ngrams': _ngrams,
            '_ngramsKeys': _ngramsKeys,
            '_nwords': _nwords,
            '_ntreetag': _ntreetag,
            'gramError': gramError
        };
        
        if(_ngrams.length%2 == 0 && _ngrams.length != 0){
            result = this.mygram.ppast(result);
        }
        
        if(result._ngrams.length%2 == 0 && result._ngrams.length != 0){
            result = this.mygram.simplepast(result);
        }
        
        if(result._ngrams.length%2 == 0 && result._ngrams.length != 0){
            result = this.mygram.indsub(result);
        }
        
        if(result._ngrams.length%2 == 0 && result._ngrams.length != 0){
            result = this.mygram.infnoun(result);
        }
        
        if(_ngrams.length == 0){
            // console.log('GRAMMAR ERROR');
            var last = array[array.length - 1];
            var lastWords = _words[array.length - 1];
            
            if(lastRules.indexOf("conjc,det:art:def:[^,]*,date") != -1 && lastWords[last.length - 3] == 'et'){
                result.gramError.lastWord = lastWords[last.length - 3];
                result.gramError.index = last.length - 3;
                result.gramError.lastRules = lastRules;
                result.gramError.pos = last[last.length - 3];
                result.gramError._words = _words;
            } else {
                result.gramError.lastWord = lastWords[last.length - 1];
                result.gramError.index = last.length - 1;
                result.gramError.lastRules = lastRules;
                result.gramError.pos = last[last.length - 1];
                result.gramError._words = _words;
            }

            // console.log(result.gramError.lastWord);
            // console.log(result.gramError.lastRules);
            // console.log(result.gramError.pos);
        }

        if (!withKeys) {
            return result._ngrams;
        }
        
        return result;
    },
    
    'getFeatures': function getFeatures(pos, features) {
        for (var ii = 0, ll = features.length; ii < ll; ii++) {
            var name = features[ii].name;
            var value = features[ii].value;
            if (['mode', 'tense'].indexOf(name) != -1) {
                if(value == 'past-participle'){
                    pos += ':' + 'ppast';
                }
                else if(value == 'imperative-present'){
                    pos += ':' + 'pre';
                }
                else if(value == 'present-participle'){
                    pos += ':' + 'ppres';
                }
                else if(value != 'infinitive-present'){
                    pos += ':' + value.substring(0, 3);
                }
            }
            else if (typeof value == 'string' && name != 'language' && name != 'frequency') {
                pos += ':' + value.substring(0, 1);
            } 
            else if (!isNaN(value) && name != 'frequency'){
                pos += ':' + value;
            }
        }
        
        return pos;
    },
    
    'getPos': function getPos(tag, isNounpPassed, Jindex) {
        var auths = ['pronoun:personal', 'pronoun:personal:sec', 'verb', 'det', 'noun', 'noun:comp', 'noun:concret:comp', 'adj', 'adj:car'];
        var pos = tag && tag.lemma && tag.lemma.pos ? tag.lemma.pos : 'unknown';
        if (pos == 'unknown' && !isNaN(tag.form)) {
            pos = 'card'
        }
        if (pos == 'unknown' && tag.form.match(/\,/)) {
            pos = 'ponct';
        }
        if (pos == 'unknown' && this.isDate(tag.form)) {
            pos = 'date';
        }
        
        var bool = (tag.isfirstname || tag.iscity || tag.iscountry);
        if (pos == 'noun' && tag && bool && isNounpPassed === false) {
            pos = 'nounp';
        }
        if (pos == 'nounp' && tag && tag.iscountry) {
            pos = 'nounp:country';
        }

        if (tag && tag.lemma && tag.lemma.features.length > 0 && pos != 'adverb' && pos != 'det') {
            if (tag.lemma.features[0].value == 'cardinal') {
                pos += ':' + tag.lemma.features[0].value.substring(0, 3);
            }
            else {
                pos += ':' + tag.lemma.features[0].value;
            }
            if (tag.lemma.features[1] && tag.lemma.features[1].name == 'details') {
                pos += ':' + tag.lemma.features[1].value.substring(0, 3);
            }
        }
        if (tag && tag.features.length > 0 && auths.indexOf(pos) != -1) {

            if (pos == 'det') {
                for (var ii = 0, ll = tag.lemma.features.length; ii < ll; ii++) {
                    var name = tag.lemma.features[ii].name;
                    var value = tag.lemma.features[ii].value;
                    pos += ':' + value.substring(0, 3);
                }
            }

            pos = this.getFeatures(pos, tag.features);
        }
        
        if(tag && tag.lemma && ['être', 'avoir'].indexOf(tag.lemma.text) != -1){
            pos += ':' + tag.lemma.text.replace(/ê/, 'e');
        }
        
        return pos;
    },
    
    'buildGramsFromTag': function buildGramsFromTag(tag, sentence) {
        // console.log(tag);
        var treetag = [
            []
        ];
        var _grams = [
            []
        ];
        var _words = [
            []
        ];
        
        var gramError = {};
        
        for (var i = 0, l = tag.length; i < l; i++) {
            // console.log(tag[i]);
            if (typeof tag[i] != 'string') {
                //Remove 1 letter -> noun
                var _tag = tag[i].length < 2 ? tag[i] : tag[i].filter(function(item) {
                    return !(item.form.length == 1 && item.lemma.pos == 'noun');
                });

                //Remove english firstname which create conflict ( ex: elle )
                if (_tag.length > 1) {
                    _tag = _tag.filter(function(item) {
                        var b = false;
                        for (var ii = 0, ll = item.features.length; ii < ll; ii++) {
                            if (item.features[ii].name == 'language' && item.features[ii].value.match(/english/)) {
                                ii = ll;
                                b = true;
                            }
                        }
                        return !(item.isfirstname == 1 && b);
                    });
                }
            }
            else {
                var _tag = tag[i];
            }
            
            if(_tag[0] != undefined){
    
                // first pos
                var _tagpos = [];
                var Jindex = 0;
                var isNounpPassed = false;
                var pos = this.getPos(_tag[Jindex], isNounpPassed, Jindex);
    
                _tagpos.push(pos + _tag[Jindex].lemma.text);
    
                var form = _tag[Jindex] && _tag[Jindex].form ? _tag[Jindex].form : _tag[Jindex];
    
                // //add pos to all _grams
                for (var gggg = 0; gggg < _grams.length; gggg++) {
                    var _temp = _grams[gggg].slice(0);
                    _temp.push(pos);
                    _grams[gggg] = _temp.slice(0);
                    _words[gggg].push(form);
                    treetag[gggg].push(_tag[Jindex]);
                }
    
                var force = false;
                if (pos.match(/nounp/) && (_tag[Jindex].isfirstname == 3 || _tag[Jindex].iscity == 3 || _tag[Jindex].iscountry == 3)) {
                    force = true;
                }
                else {
                    Jindex = 1;
                }
    
                //if more than one tag
                if (typeof _tag != 'string' && (_tag.length > 1 || force === true)) {
                    
                    for (var j = Jindex; j < _tag.length; j++) {
                        
                        var pos = this.getPos(_tag[j], isNounpPassed, Jindex);
    
                        var form = _tag[j] && _tag[j].form ? _tag[j].form : _tag[j];
    
                        //if pos is not allready pass, duplicate currents _grams et switching last pos
                        if (_tagpos.indexOf(pos + _tag[j].lemma.text) == -1) {
                            _tagpos.push(pos + _tag[j].lemma.text);
                            var copy = _grams.slice(0);
                            var _wordCopy = _words.slice(0);
                            var treetagCopy = treetag.slice(0);
                            for (var ii = 0; ii < copy.length; ii++) {
                                copy[ii] = copy[ii].slice(0, copy[ii].length - 1);
                                copy[ii].push(pos);
                                _wordCopy[ii] = _wordCopy[ii].slice(0, _wordCopy[ii].length - 1);
                                _wordCopy[ii].push(form);
                                treetagCopy[ii] = treetagCopy[ii].slice(0, treetagCopy[ii].length - 1);
                                treetagCopy[ii].push(_tag[j]);
                            }
    
                            _grams = _grams.concat(copy);
                            _words = _words.concat(_wordCopy);
                            treetag = treetag.concat(treetagCopy);
                        }
                        
                        // console.log(_grams);
    
                        if (isNounpPassed === true) {
                            isNounpPassed = false;
                        }
                        if (pos.match(/nounp/) && isNounpPassed == false && (_tag[j].isfirstname == 3 || _tag[j].iscity == 3 || _tag[j].iscountry == 3)) {
                            isNounpPassed = true;
                            j--;
                        }
    
                    }
                }
    
                //intermediary clean
                var _d = this.cleanArray(_grams, true, sentence, _words, treetag);
                _grams = _d._ngrams.slice(0);
                _words = _d._nwords.slice(0);
                treetag = _d._ntreetag.slice(0);
                if(_d.gramError !== undefined){
                    gramError = _d.gramError;
                }
            }
        }

        //final clean
        var d = this.cleanArray(_grams, true, sentence, _words, treetag);
        if(d._ngrams.length == 0 && (d.gramError === undefined || Object.keys(d.gramError).length == 0)){
            d.gramError = gramError;
        }
        return d;
    },
    
    'questionWords': ['qui', 'quoi', 'où', 'quand', 'comment', 'combien', 'pourquoi', 'est-ce que', 'que'],
    'analysis': function analysis(data, next) {
        // console.log(JSON.stringify(data, null, 4));
        var subject = this.getSubject(data);
        var mainVerb = this.getMainVerb(data);
        var result = {
            'subject': subject,
            'mainVerb': mainVerb
        };
        next(null, result);
    },
    
    'getSubject': function getSubject(data) {
        var subject = [];
        if(data._ntreetag[0][0].lemma.pos != 'verb'){
            var b = false;
            var i = 0;
            while(b == false){
                if(data._ntreetag[0][i].lemma.pos == 'verb'){
                    b = true;
                } 
                else if(this.questionWords.indexOf(data._ntreetag[0][i].lemma.text) == -1){
                    subject.push(data._ntreetag[0][i]);
                }
                i++;
            }
        } else {
            var lemmaFeatures = data._ntreetag[0][1].lemma.features.map(item => item.value);
            // var features = data._ntreetag[1].features.map(item => item.value);
            if(data._ntreetag[0][1].lemma.pos == 'pronoun' && lemmaFeatures.indexOf('personal') != -1 && lemmaFeatures.indexOf('secondary') == -1){
                subject.push(data._ntreetag[0][1]);
            }
        }
        return subject;
    },
    
    'getMainVerb': function getMainVerb(data) {
        var mainVerb = [];
        if(data._ntreetag[0][0].lemma.pos != 'verb'){
            var b = false;
            var i = 0;
            while(b == false){
                var features = data._ntreetag[0][1].features.map(item => item.value);
                if(data._ntreetag[0][i].lemma.pos == 'verb' && features.indexOf('infinitive') == -1){
                    mainVerb.push(data._ntreetag[0][i]);
                } 
                else if(mainVerb.length > 0){
                    b = true;
                }
                i++;
            }
        } else {
            mainVerb.push(data._ntreetag[0][0]);
            if(data._ntreetag[0][2].lemma.pos == 'verb'){
                mainVerb.push(data._ntreetag[0][2]);
            }

            if(data._ntreetag[0][3].lemma.pos == 'verb'){
                mainVerb.push(data._ntreetag[0][3]);
            }
        }
        return mainVerb;
    }
};

module.exports = grammar;