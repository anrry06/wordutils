var natural = require('natural');
var NGrams = natural.NGrams;
var mongoPackage = require('mongodb');
var clusterprocess = require('clusterprocess');
var phonex = require('phonex');
var grammar = require('./grammar.js');
var didumean = require('./didumean.js');
var occur = require('./occur.js');

//http://www.larousse.fr/dictionnaires/francais/alors%20que/2491

var dicodb = {
    'collectionName': 'dico',

    'db': null,

    'setDb': function setDb(db, next) {
        var that = this;
        if(typeof db.dbName != 'undefined'){
            this.getMongoClient(db, function(error, db) {
                that.db = db;
                next();
            })
        } else {
            this.db = db;
        }
    },
    
    'getMongoClient': function getMongoClient(config, next) {
        var dbName = config.dbName;
        console.log("Enabling mongoDB connection to " + dbName);
        var connector = new mongoPackage.Db(dbName, new mongoPackage.Server(config.host, config.port, {
            auto_reconnect: true
        }), {
            safe: false
        });
        connector.open(function(error, db) {
            if (config.password != '') {
                db.authenticate(config.user, config.password, function(error, res) {
                    if (res) {
                        console.log('Connected to ' + dbName);
                        return next(null, db);
                    }
                    else {
                        console.log(error);
                        return next(error, null);
                    }
                });
            }
            else {
                if (!error) {
                    console.log('Connected to ' + dbName);
                    return next(null, db);
                }
                else {
                    console.log(error);
                    return next(error, null);
                }
            }
        });
    },

    'checkIfDataExist': function checkIfDataExist(next) {
        this.db.collection(this.collectionName).count(function(error, count) {
            if (error) {
                return next(error, false)
            }

            return next(null, count == 0 ? false : true);
        });
    },

    'getPhonex': function getPhonex(str) {
        var _phonex = '';
        if (str.match(/\s/)) {
            var _t = str.split(/\s/g);
            for (var j = 0; j < _t.length; j++) {

                if (_t[j].match(/\-/)) {
                    var __t = _t[j].split(/\-/g);
                    for (var jj = 0; jj < __t.length; jj++) {
                        _phonex += (j == 0 ? '' : ' ') + (jj == 0 ? '' : ' ') + phonex.get(__t[jj].trim().toLowerCase().replace(/\'/, ''));
                    }
                }
                else {
                    _phonex += (j == 0 ? '' : ' ') + phonex.get(_t[j].trim().toLowerCase().replace(/\'/, ''));
                }
            }
        }
        else if (str.match(/\-/)) {
            var _t = str.split(/\-/g);
            for (var j = 0; j < _t.length; j++) {
                _phonex += (j == 0 ? '' : ' ') + phonex.get(_t[j].trim().toLowerCase().replace(/\'/, ''));
            }
        }
        else {
            _phonex = phonex.get(str.trim().toLowerCase().replace(/\'/, ''));
        }
        
        _phonex = _phonex.replace(/\s\s/g, ' ');
        
        var groupLetter = phonex.accents + phonex.consonant + phonex.vowel;
        var reg = new RegExp('^[' + groupLetter + ']\\[|\\][' + groupLetter + ']|[' + groupLetter + ']\\[|\\][' + groupLetter + ']$');

        if(_phonex.match(reg)){
            _phonex = '';
        }
            
        return _phonex;
    },

    'clusterImportCountries': function clusterImportCountries(next) {
        var that = this;

        var nbWorker = 4;
        var stats = {
            'find': 0,
            'not_exist': 0
        };
        
        var run = function(index, country, _next) {
            var word = country.toLowerCase().replace(/\([^\)]+\)/, '').trim();
            var find = {
                'lemma.text': word,
                'lemma.pos': 'noun'
            };
            that.exist(find, function(error, doc) {
                if (error) {
                    console.log(error);
                    return next(error);
                }
                
                var b = false;
                if(doc){
                    for(var i = 0, l = doc.features.length; i < l; i++){
                        if(doc.features[i].name == 'number' && doc.features[i].value == 'singular'){
                            b = true;
                        }
                    }
                }
                
                
                if (doc == false || b == false) {
                    stats.not_exist++;
                    console.log('Index : ' + index + ' - ' + word);
                    
                    var _phonex = that.getPhonex(word);
                    _phonex = _phonex.replace(/[\[\]]/g, '');


                    var data = {
                        'form': word,
                        'features': [
                            {
                                'name': 'number',
                                'value': 'singular'
                            }
                        ],
                        'lemma': {
                            'text': word,
                            'pos': 'noun',
                            'features': []
                        },
                        'phonex': _phonex,
                        'iscountry': 1
                    };

                    _next(data);
                }
                else {
                    console.log('Index : ' + index + ' - ' + word + ' ------------- EXIST');
                    stats.exist++;
                    
                    var $set = {
                        'iscountry': 2
                    };
                    
                    _next({
                        'find': find,
                        '$set': $set
                    });
                }
            });
        };
        
        var getData = function(_next) {
            var countries = require('./lexiques/french_countries.json');
            var docs = [];
            for(var k in countries){
                docs.push(countries[k]);
            }
            console.log('Total : ' + docs.length);
            _next(docs)
        };
        
        var options = {
            'getData': getData,
            'nbWorker': nbWorker,
            'process': run,
            'done': function(result) {
                console.log('DONE');
                console.log(stats);
                console.log(result.length);
                next(null, result);
            }
        };
        
        if(!that.db){
            that.setDb(that.config, function() {
                new clusterprocess(options);
            });
        } else {
            new clusterprocess(options);
        }
    },

    'getListUpdatePhonexes': function getListUpdatePhonexes(next) {
        var that = this;
        var col = this.db.collection(this.collectionName);
        var chunkSize = 100000;
        var toProcess = [];
        
        var run = function(index, _next) {
            console.log('run index ' + index);
            
            col.find().skip(chunkSize * index).limit(chunkSize).toArray(function(error, docs) {
                if(error){
                    return _next(error);
                }
                console.log('data retrieved - skip ' + (chunkSize * index));
                // var bulk = 
                
                for(var i = 0, l = docs.length; i < l; i++){
                    var _phonex = that.getPhonex(docs[i].form);
                    _phonex = _phonex.replace(/[\[\]]/g, '');
                    if(_phonex != docs[i].phonex){
                        // console.log(docs[i].form + ' : ' + docs[i].phonex + ' != ' + _phonex);
                        toProcess.push(docs[i]._id.toString());
                    }
                    
                    if(i%10000 == 0){
                        console.log('document ' + i);
                        console.log('toProcess ' + toProcess.length);
                    }
                }
                if(docs.length < chunkSize){
                    _next();
                } else {
                    run(index + 1, _next);
                }
            });
        };
        
        run(0, function(error) {
            if(error){
                return next(error);
            }
            
            console.log(toProcess.length);
            next(null, toProcess);
        });
    },

    'get': function get(options, next) {
        var col = this.db.collection(this.collectionName);
        col.find(options).toArray(next);
    },

    'validWords': function validWords(options, next) {
        var col = this.db.collection(this.collectionName);
        col.distinct('form', options, next);
    },

    'exist': function exist(options, next) {
        var col = this.db.collection(this.collectionName);
        col.findOne(options, function(error, doc) {
            if (error) {
                return next(error, null);
            }

            return next(null, !doc ? false : doc);
        });
    },
    
    'getWordArray': function getWordArray(data) {
        var accentedCharacters = "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";
        if (typeof data == 'string') {
            data = data.replace(/([a-z\.\,\;\!\?\…\(\)])([\.\,\;\!\?\…\(\)])/g, '$1 $2');
            data = data.replace(/([\(\)])([a-z0-9])/g, '$1 $2');
            data = data.replace(/([0-9\.\,\;\!\?\…\(\)])([\.\,\;\!\?\…\(\)])$/g, '$1 $2');
            data = data.replace(/([a-z])\-(t)\-([a-z])/g, '$1 $2 $3');
            data = data.replace(/(\s)t\'(y\s)/g, '$1 $2');
            data = data.replace(/(\s)t\s(y\s)/g, '$1 $2');
            data = data.replace(/\-([je|tu|il|elle|nous|vous|ils|elles|on])/g, ' $1');
            var reg = new RegExp('([0-9])\_?([' + accentedCharacters + 'a-zA-Z])', 'g');
            data = data.replace(reg, '$1 $2');
            var reg = new RegExp('([' + accentedCharacters + 'a-zA-Z])\_?([0-9])', 'g');
            data = data.replace(reg, '$1 $2');
            
            if(data.match(/\bque\s.*va\sêtre/)){
                data = data.replace(/(\bque\s.*)(va\sêtre)/, '$1soit');
            }
            
            var _wordsArray = data.split(/[\s\'\’’]/g);
        }
        else {
            var _wordsArray = data;
        }
        
        var wordsArray = [];
        for(var i = 0, l = _wordsArray.length; i < l; i++){
            if(_wordsArray[i] != ''){
                wordsArray.push(_wordsArray[i]);
            }
        }
        
        return wordsArray;
    },

    'tag': function tag(data, next) {
        var that = this;
        if (typeof data == 'string') {
            data = data.split(/[\s\'\’’]/g);
        }
        
        // console.log('TAG : ', data);
        
        var start = new Date().getTime();

        var col = this.db.collection(this.collectionName);
        col.find({
            'form': {
                $in: data
            },
            'lemma.pos': {
                $nin: ['GN', 'GNP', 'GNPX', 'X', 'prefix']
            }
        }).toArray(function(error, docs) {
            if (error) {
                return next(error);
            }
            
            var diff = (new Date().getTime() - start) / 1000;
            // console.log('find : ' + diff);
            
            var treetag = data.slice(0);
            for (var i = 0, l = docs.length; i < l; i++) {
                var index = data.indexOf(docs[i].form);
                if (typeof treetag[index] == 'string') {
                    treetag[index] = [];
                }

                treetag[index].push(docs[i]);

                var lastIndex = index + 1;
                var nextPart = data.slice(lastIndex);
                index = nextPart.indexOf(docs[i].form);
                while (index != -1) {
                    if (typeof treetag[index + lastIndex] == 'string') {
                        treetag[index + lastIndex] = [];
                    }

                    treetag[index + lastIndex].push(docs[i]);

                    lastIndex = index + lastIndex + 1;
                    nextPart = data.slice(lastIndex);
                    index = nextPart.indexOf(docs[i].form);
                }
            }

            for (var i = 0, l = treetag.length; i < l; i++) {
                if(!treetag[i].form && (!treetag[i][0] || !treetag[i][0].form)){
                    if(!isNaN(treetag[i])){
                        treetag[i] = [{
                            'form': treetag[i],
                            'features': [],
                            'lemma': {
                                'text': treetag[i],
                                'pos': 'card',
                                'features': []
                            }
                        }];
                    } else {
                        treetag[i] = [{
                            'form': treetag[i],
                            'features': [],
                            'lemma': {
                                'text': treetag[i],
                                'pos': 'unknown',
                                'features': []
                            }
                        }];
                    
                        if(that.isDate(treetag[i][0].form)){
                            treetag[i][0].lemma.pos = 'date';
                        }
                        
                    }
                } else {
                    //suppression des invariables ou sans genre
                    var _t = [];
                    for(var j = 0, m = treetag[i].length; j < m; j++){
                        if(treetag[i][j] != undefined && treetag[i][j + 1] != undefined){
                            var _diff = that.findDiffFeaturesBetweenTags(treetag[i][j], treetag[i][j + 1]);
                            if(_diff.length == 1 && ['gender', 'number'].indexOf(_diff[0].name) != -1){
                                delete(treetag[i][j + 1]);
                                var _f = [];
                                for(var k = 0, n = treetag[i][j].features.length; k < n; k++){
                                    if(treetag[i][j].features[k].name != _diff[0].name){
                                        _f.push(treetag[i][j].features[k]);
                                    }
                                }
                                treetag[i][j].features = _f;
                                _t.push(treetag[i][j]);
                            } else {
                                _t.push(treetag[i][j]);
                            }
                        } else if(treetag[i][j] != undefined){
                            _t.push(treetag[i][j]);
                        }
                    }
                    
                    // var _t = [];
                    // for(var j = 0, m = treetag[i].length; j < m; j++){
                    //     if(treetag[i][j] != undefined){
                    //         _t.push(treetag[i][j]);
                    //     }    
                    // }
                    treetag[i] = _t;
                    
                }
            }

            next(null, treetag);
        });
    },
    
    'findDiffFeaturesBetweenTags': function findDiffFeaturesBetweenTags(tag1, tag2) {
        var diff = [];
        if(tag1.form == tag2.form && tag1.lemma.text == tag2.lemma.text && tag1.lemma.pos == tag2.lemma.pos && tag1.features.length == tag2.features.length){
            var kv = tag2.features.map(function(item) {
                return item.name + item.value;
            });
            for(var i = 0, l = tag1.features.length; i < l; i++){
                var k = tag1.features[i].name + tag1.features[i].value;
                if(kv.indexOf(k) == -1){
                    diff.push(tag1.features[i])
                }
            }
        }
        
        return diff;
    },

    'gramsTags_': function gramsTags_(data, next) {
        var that = this;
        var result = [];
        var temp = [];
        
        var wordsArray = this.getWordArray(data);
        
        var sentence = wordsArray.join(' ');
        
        // console.log(wordsArray);

        var run = function(index, _next) {
            if (index == 1) {
                return _next(null);
            }
            //trigrams
            var ngrams = NGrams.ngrams(wordsArray, index);
            for (var i = 0, l = ngrams.length; i < l; i++) {
                ngrams[i] = ngrams[i].join(' ');
            }
            if (ngrams.length == 0) {
                ngrams = [wordsArray.join(' ')];
            }
            var start = new Date().getTime();

            that.tag(ngrams, function(error, treetag) {
                if (error) {
                    return _next(error);
                }
                
                var diff = (new Date().getTime() - start) / 1000;
                // console.log('tag : ' + diff);
                var unknowns = [];
                var previousKnownLength = 0;
                for (var i = 0, l = treetag.length; i < l; i++) {
                    if (typeof treetag[i] != 'string') {
                        
                        if(treetag[i][0].lemma && treetag[i][0].lemma.pos == 'unknown'){
                            unknowns.push(treetag[i]);
                        } else {
                            temp.push({
                                'index': i - previousKnownLength,
                                'tag': treetag[i]
                            });
                            previousKnownLength = treetag[i][0].form.split(/\s/g).length;
                            var _form = treetag[i][0] ? treetag[i][0].form : treetag[i].form;
                            var reg = new RegExp(that.escapeRegExp(_form));
                            sentence = sentence.replace(reg, '');
                        }
                    }
                    else {
                        unknowns.push(treetag[i]);
                    }
                }

                if (unknowns.length == 0 && treetag.length != 0) {
                    return next(null, treetag);
                }

                wordsArray = sentence.trim().replace(/\s\s/g, ' ').split(/\s/g);
                var nextIndex = wordsArray.length != 0 && wordsArray.length < index - 1 ? wordsArray.length : index - 1;
                run(nextIndex, _next);
            });
        };
        
        var mlength = wordsArray.length < 11 ? wordsArray.length : 10;

        run(mlength, function(error) {
            if (error) {
                return next(error);
            }
            wordsArray = sentence.trim().replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').split(/\s/g);
            // console.log(sentence.trim().replace(/\s\s/g, ' ').replace(/\s\s/g, ' '));
            that.tag(wordsArray, function(error, treetag) {
                if (error) {
                    return next(error);
                }

                // temp = temp.sort(function(a, b) {
                //     return b.index - a.index;
                // });
                
                temp = temp.sort(
                    that.firstBy(function (v1, v2) { return v2.tag[0].form.split(/\s/g).length - v1.tag[0].form.split(/\s/g).length; })
                    .thenBy(function (v1, v2) { return v1.index - v2.index; })
                );
                // console.log(JSON.stringify(temp, null, 4));
                for (var ii = 0, ll = temp.length; ii < ll; ii++) {
                    
                    if(temp[ii + 1] && temp[ii + 1].tag[0].form.split(/\s/g).length != temp[ii].tag[0].form.split(/\s/g).length && temp[ii].index > temp[ii + 1].index + temp[ii].tag[0].form.split(/\s/g).length){
                        temp[ii].index -= temp[ii + 1].tag[0].form.split(/\s/g).length;
                    }
                    else if(temp[ii - 1] && temp[ii - 1].tag[0].form.split(/\s/g).length != temp[ii].tag[0].form.split(/\s/g).length && temp[ii].index > temp[ii - 1].index){
                        temp[ii].index += temp[ii - 1].tag[0].form.split(/\s/g).length - temp[ii].tag[0].form.split(/\s/g).length;
                    }
                    else if(temp[ii - 1] && temp[ii - 1].tag[0].form.split(/\s/g).length == temp[ii].tag[0].form.split(/\s/g).length && temp[ii].index > temp[ii - 1].index){
                        var diff = temp[ii - 1].tag[0].form.split(/\s/g).length - temp[ii].tag[0].form.split(/\s/g).length;
                        var t = temp[ii].index + (diff == 0 ? 1 : diff);
                        if(t < treetag.length){
                            temp[ii].index += diff == 0 ? 1 : diff;
                        }
                    }
                    else if(temp[ii - 1] && temp[ii].index == temp[ii - 1].index && temp[ii - 1].tag[0].form.split(/\s/g).length == temp[ii].tag[0].form.split(/\s/g).length){
                        temp[ii].index += 1; //temp[ii - 1].tag[0].form.split(/\s/g).length;
                    }
                    
                    // if(temp[ii].index < treetag.length){
                    // console.log(treetag.map(item => item[0].form));
                    // console.log(treetag.length, temp[ii].index, temp[ii].tag[0].form);
                        treetag = that.insertIntoArray(treetag, temp[ii].index, temp[ii].tag);
                    //     temp[ii] = null;
                    // }
                }

                // for (var i = 0, l = treetag.length; i < l; i++) {
                //     for (var ii = 0, ll = temp.length; ii < ll; ii++) {
                //         if (temp[ii] != null && temp[ii].index == i) {
                //             result.push(temp[ii].tag);
                //             temp[ii] = null;
                //         }
                //     }
                //     result.push(treetag[i]);
                // }
                // for (var ii = 0, ll = temp.length; ii < ll; ii++) {
                //     if (temp[ii] != null) {
                //         treetag.push(temp[ii].tag);
                //     }
                // }
                
                result = treetag;
                
                var _run = function(index) {
                    if(result[index] == undefined){
                        return next(null, result);
                    }
                    
                    if(result[index][0].lemma.pos == 'unknown'){
                        that.missingSpace(result[index][0].form, function(error, _treetag) {
                            if(error){
                                return next(error, null);
                            }
                            
                            if(_treetag.length == 0){
                                return _run(index + 1);
                            }
                            for(var i = 0, l = _treetag.length; i < l; i++){
                                if(i == 0){
                                    result[index] = _treetag[i];
                                } else {
                                    result = that.insertIntoArray(result, index + i, _treetag[i]);
                                }
                            }
                            
                            return next(null, result);
                            
                        });
                    } else {
                        _run(index + 1);
                    }
                    
                }
                
                _run(0);
                
                // console.log(JSON.stringify(result, null, 4));
                // next(null, result);
            });
        });
    },
    
    'gramsTags': function gramsTags(data, next) {
        var that = this;
        var result = [];
        var temp = [];
        
        var wordsArray = this.getWordArray(data);
        var originalWordArray = wordsArray.slice(0);
        
        var sentence = wordsArray.join(' ');
        
        // console.log(originalWordArray);

        var run = function(index, _next) {
            if (index == 1) {
                return _next(null);
            }
            //trigrams
            var ngrams = NGrams.ngrams(wordsArray, index);
            for (var i = 0, l = ngrams.length; i < l; i++) {
                ngrams[i] = ngrams[i].join(' ');
            }
            if (ngrams.length == 0) {
                ngrams = [wordsArray.join(' ')];
            }
            var start = new Date().getTime();

            that.tag(ngrams, function(error, treetag) {
                if (error) {
                    return _next(error);
                }
                
                var diff = (new Date().getTime() - start) / 1000;
                // console.log('tag : ' + diff);
                var unknowns = [];
                var previousKnownLength = 0;
                for (var i = 0, l = treetag.length; i < l; i++) {
                    if (typeof treetag[i] != 'string') {
                        
                        if(treetag[i][0].lemma && treetag[i][0].lemma.pos == 'unknown'){
                            unknowns.push(treetag[i]);
                        } else {
                            var fword = treetag[i][0].form.split(/\s/)[0];
                            var sword = treetag[i][0].form.split(/\s/)[1];
                            // console.log(fword);
                            var _index = originalWordArray.indexOf(fword);
                            // console.log(_index);
                            // console.log(originalWordArray.indexOf(sword));
                            
                            if(originalWordArray.indexOf(sword) != _index + 1){
                                var _t = originalWordArray.slice(_index + 1);
                                _index += _t.indexOf(fword) + 1; 
                            }
                            // console.log(_index);
                            temp.push({
                                // 'index': i - previousKnownLength,
                                'index': _index,
                                'tag': treetag[i]
                            });
                            previousKnownLength = treetag[i][0].form.split(/\s/g).length;
                            var _form = treetag[i][0] ? treetag[i][0].form : treetag[i].form;
                            var reg = new RegExp(that.escapeRegExp(_form));
                            sentence = sentence.replace(reg, '');
                        }
                    }
                    else {
                        unknowns.push(treetag[i]);
                    }
                }

                if (unknowns.length == 0 && treetag.length != 0) {
                    return next(null, treetag);
                }

                wordsArray = that.getWordArray(sentence);
                // wordsArray = sentence.trim().replace(/\s\s/g, ' ').split(/\s/g);
                var nextIndex = wordsArray.length != 0 && wordsArray.length < index - 1 ? wordsArray.length : index - 1;
                run(nextIndex, _next);
            });
        };
        
        var mlength = wordsArray.length < 11 ? wordsArray.length : 10;

        run(mlength, function(error) {
            if (error) {
                return next(error);
            }
            wordsArray = that.getWordArray(sentence);
            // wordsArray = sentence.trim().replace(/\s\s/g, ' ').replace(/\s\s/g, ' ').split(/\s/g);
            // console.log(sentence.trim().replace(/\s\s/g, ' ').replace(/\s\s/g, ' '));
            that.tag(originalWordArray, function(error, treetag) {
                if (error) {
                    return next(error);
                }

                // temp = temp.sort(function(a, b) {
                //     return b.index - a.index;
                // });
                
                // temp = temp.sort(
                //     that.firstBy(function (v1, v2) { return v2.tag[0].form.split(/\s/g).length - v1.tag[0].form.split(/\s/g).length; })
                //     .thenBy(function (v1, v2) { return v1.index - v2.index; })
                // );
                // console.log(JSON.stringify(temp, null, 4));
                for (var ii = 0, ll = temp.length; ii < ll; ii++) {
                    
                    // if(temp[ii + 1] && temp[ii + 1].tag[0].form.split(/\s/g).length != temp[ii].tag[0].form.split(/\s/g).length && temp[ii].index > temp[ii + 1].index + temp[ii].tag[0].form.split(/\s/g).length){
                    //     temp[ii].index -= temp[ii + 1].tag[0].form.split(/\s/g).length;
                    // }
                    // else if(temp[ii - 1] && temp[ii - 1].tag[0].form.split(/\s/g).length != temp[ii].tag[0].form.split(/\s/g).length && temp[ii].index > temp[ii - 1].index){
                    //     temp[ii].index += temp[ii - 1].tag[0].form.split(/\s/g).length - temp[ii].tag[0].form.split(/\s/g).length;
                    // }
                    // else if(temp[ii - 1] && temp[ii - 1].tag[0].form.split(/\s/g).length == temp[ii].tag[0].form.split(/\s/g).length && temp[ii].index > temp[ii - 1].index){
                    //     var diff = temp[ii - 1].tag[0].form.split(/\s/g).length - temp[ii].tag[0].form.split(/\s/g).length;
                    //     var t = temp[ii].index + (diff == 0 ? 1 : diff);
                    //     if(t < treetag.length){
                    //         temp[ii].index += diff == 0 ? 1 : diff;
                    //     }
                    // }
                    // else if(temp[ii - 1] && temp[ii].index == temp[ii - 1].index && temp[ii - 1].tag[0].form.split(/\s/g).length == temp[ii].tag[0].form.split(/\s/g).length){
                    //     temp[ii].index += 1; //temp[ii - 1].tag[0].form.split(/\s/g).length;
                    // }
                    
                    treetag = that.replaceIntoArray(treetag, temp[ii].index, [temp[ii].tag]);
                    
                }
                result = [];
                var diff = 0;
                for (var i = 0, l = treetag.length; i < l; i++) {
                    var length = treetag[i][0].form.split(/\s/).length;
                    if(length > 1){
                        diff = length;
                        // console.log('diff = ' + treetag[i][0].form, diff);
                        result.push(treetag[i]);
                    } else if(length == 1){
                        
                        if(diff > 0){
                            diff--;
                            // console.log('diff-- ' + treetag[i][0].form, diff);
                        } 
                        if(diff == 0){
                            result.push(treetag[i]);
                        } else {
                            // console.log('drop ' + treetag[i][0].form);
                        }
                    }

                }
                // for (var i = 0, l = treetag.length; i < l; i++) {
                //     for (var ii = 0, ll = temp.length; ii < ll; ii++) {
                //         if (temp[ii] != null && temp[ii].index == i) {
                //             result.push(temp[ii].tag);
                //             temp[ii] = null;
                //         }
                //     }
                //     result.push(treetag[i]);
                // }
                // for (var ii = 0, ll = temp.length; ii < ll; ii++) {
                //     if (temp[ii] != null) {
                //         treetag.push(temp[ii].tag);
                //     }
                // }
                
                // result = treetag;
                
                // console.Log()
                
                var _run = function(index) {
                    if(result[index] == undefined){
                        return next(null, result);
                    }
                    
                    if(result[index][0].lemma.pos == 'unknown'){
                        that.missingSpace(result[index][0].form, function(error, _treetag) {
                            if(error){
                                return next(error, null);
                            }
                            
                            if(_treetag.length == 0){
                                return _run(index + 1);
                            }
                            for(var i = 0, l = _treetag.length; i < l; i++){
                                if(i == 0){
                                    result[index] = _treetag[i];
                                } else {
                                    result = that.insertIntoArray(result, index + i, _treetag[i]);
                                }
                            }
                            
                            return next(null, result);
                            
                        });
                    } else {
                        _run(index + 1);
                    }
                    
                }
                
                _run(0);
                
                // console.log(JSON.stringify(result, null, 4));
                // next(null, result);
            });
        });
    },
    
    'firstBy': (function() {
        function makeCompareFunction(f, direction){
          if(typeof(f)!="function"){
            var prop = f;
            f = function(v1,v2){return v1[prop] < v2[prop] ? -1 : (v1[prop] > v2[prop] ? 1 : 0);}
          }
          if(f.length === 1) {
            // f is a unary function mapping a single item to its sort score
            var uf = f;
            f = function(v1,v2) {return uf(v1) < uf(v2) ? -1 : (uf(v1) > uf(v2) ? 1 : 0);}
          }
          if(direction === -1)return function(v1,v2){return -f(v1,v2)};
          return f;
        }
        /* mixin for the `thenBy` property */
        function extend(f, d) {
          f=makeCompareFunction(f, d);
          f.thenBy = tb;
          return f;
        }
    
        /* adds a secondary compare function to the target function (`this` context)
           which is applied in case the first one returns 0 (equal)
           returns a new compare function, which has a `thenBy` method as well */
        function tb(y, d) {
            var x = this;
            y = makeCompareFunction(y, d);
            return extend(function(a, b) {
                return x(a,b) || y(a,b);
            });
        }
        return extend;
    })(),
    
    'insertIntoArray': function insertIntoArray(array, index) {
        function insertArrayAt(array, index, arrayToInsert) {
            Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
            return array;
        }
        var arrayToInsert = Array.prototype.splice.apply(arguments, [2]);
        return insertArrayAt(array, index, arrayToInsert);
    },
    
    'replaceIntoArray': function replaceIntoArray(array, index, replacement) {
        return [].concat(array.slice(0, index), replacement, array.slice(index + 1));
    },
    
    'escapeRegExp': function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
            
    'cleanText': function cleanText(text) {
        // text = text.replace(/\n/g, " ");
        text = text.replace(/\.\.\.\.|\.\.\./g, '…');
        text = text.replace(/\"/g, '');
        text = text.replace(/\s\s/g, ' ');
        text = text.replace(/\œ/g, 'oe');
        text = text.replace(/\œ/g, 'oe');
        text = text.replace(/\,/g, ' , ');

        if(text.match(/\.[^\.]*\.[^\.]*\.[^\.]*\.[^\.]*\./)){
            text = text.replace(/\./g, ' ');
        }
        
        return text;
    },
    
    'getTextArray': function getTextArray(text) {
        var _textArray = text.replace(/\s\s/g, ' ')
                             .split(/([\.\;\?\:\!\…])/);
        var textArray = [];
        // console.log(_textArray);
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
                else if(_textArray[i] != null && _textArray[i-1] == null && _textArray[i].length != 0 && i == l - 1) {
                    textArray.push(_textArray[i]);
                } else {
                    // console.log(_textArray[i])
                    // console.log(_textArray[i - 1])
                }
            }
        }

        for(var i = 0, l = textArray.length; i < l; i++){
            var _isnan = isNaN(textArray[i].replace(/\./, ''));
            if(i != 0 && _isnan == false){
                var _index = 1;
                var prev =  textArray[i - _index];
                while(typeof prev != 'string'){
                    _index++;
                    prev = textArray[i - _index];
                }
                textArray[i - _index] += textArray[i];
                textArray[i] = null;
            }
        }

        _textArray = [];
        for(var i = 0, l = textArray.length; i < l; i++){
            if(textArray[i] !== null && textArray[i].length > 2){
                if(!textArray[i].match(/[\.\;\?\:\!\(\)\[\]\«\»\…]$/)){
                    textArray[i] += '.';
                }
                _textArray.push(textArray[i]);
            }
        }
        
        
        return _textArray;
    },
    
    'processArray': function processArray(textArray, next, fromsplit) {
        fromsplit = fromsplit || false;
        var grams = [];
        var that =this;
        
        var _run = function(_index, tag, __next) {
            if(tag[_index] == undefined){
                return __next(tag);
            }
            // if(tag[_index][0].lemma.pos == 'unknown'){
            //     return that.findReplacement(tag[_index][0].lemma.text, _index, tag, function(replacement) {
            //         if(replacement == tag[_index][0].form){
            //             return _run(_index + 1, tag, __next);
            //         }
                    
            //         that.tag(replacement, function(error, treetag) {
            //             if(treetag && treetag[0]){
            //                 tag[_index] = treetag[0];
            //             }
            //             _run(_index + 1, tag, __next);
            //         });
                    
            //     });
            // }
            
            _run(_index + 1, tag, __next);
        };
                
        var run = function(index, _next) {
            var sentence = textArray[index];
            if(sentence == undefined){
                return _next();
            }
            
            sentence = textArray[index].toLowerCase().trim();
            if(sentence == ''){
                return run(index + 1, _next);
            }
            
            sentence = didumean.replaceSMS(sentence);

            that.gramsTags(sentence, function(error, tag) {
                if(error) throw error;
                
                _run(0, tag, function(tag) {

                    var g = grammar.buildGramsFromTag(tag, sentence);
                    var gramError = g.gramError;
                    
                    if(!fromsplit && gramError && gramError.pos && gramError.pos.match(/pronoun\:personal\:[1-3]/) && gramError.lastRules.indexOf("\\bnoun:[^,]*,pronoun:personal:[^s]") == gramError.lastRules.length - 1){
                        // console.log(gramError);
                        // console.log('SPLIT STRING');
                        var _textArray = [];
                        for(var i = 0, l = textArray.length; i < l; i++){
                            if(i == index){
                                var wordsArray = that.getWordArray(textArray[i]);
                                // console.log(wordsArray);
                                // console.log(gramError.index);
                                var s = '';
                                for(var j = 0, m = wordsArray.length; j < m; j++){
                                    if(wordsArray[j] == gramError.lastWord && (j == gramError.index || j == gramError.index + 1 || j == gramError.index + 2 || j == gramError.index - 2 || j == gramError.index - 1)){
                                        s += '.';
                                        _textArray.push(s);
                                        s = wordsArray[j];
                                    } else {
                                        s += (j == 0 ? '' : ' ') + wordsArray[j];
                                    }
                                }
                                _textArray.push(s);
                                
                            } else {
                                _textArray.push(textArray[i]);
                            }
                        }
                        // console.log(_textArray);
                        
                        return that.processArray(_textArray, next, true);
                    } // insert point before pronoun personal if error
                    
                    if(gramError && gramError.lastRules && gramError.lastRules.indexOf('det:pos:[^,]*,noun:[^,]*,det:pos:') == gramError.lastRules.length - 1 && gramError.lastWord == 'ma'){
                        var reg = new RegExp('(' + tag[gramError.index - 1][0].form + ')\\s' + 'ma');
                        textArray[index] = textArray[index].toLowerCase().replace(reg, '$1 m a');
                        return run(index, _next);
                    } // ma compagne ma quitter
                    
                    if(g._ngramsKeys.length == 0 && gramError && gramError.lastWord){
                        that.loopForGrammar(gramError, tag, sentence, function(ntreetag, rerun, split, gramError) {
                            if(ntreetag === null && split === null){
                                textArray[index] = rerun;
                                return run(index, _next);
                            }
                            else if(ntreetag === null && rerun === null && split === true){
                                if(!fromsplit && gramError && gramError.pos && gramError.pos.match(/pronoun\:personal\:[1-3]/) && gramError.lastRules.indexOf("\\bnoun:[^,]*,pronoun:personal:[^s]") == gramError.lastRules.length - 1){
                                    // console.log(gramError);
                                    // console.log('SPLIT STRING');
                                    var _textArray = [];
                                    for(var i = 0, l = textArray.length; i < l; i++){
                                        if(i == index){
                                            var wordsArray = that.getWordArray(textArray[i]);
                                            // console.log(wordsArray);
                                            // console.log(gramError.index);
                                            var s = '';
                                            for(var j = 0, m = wordsArray.length; j < m; j++){
                                                if(wordsArray[j] == gramError.lastWord && (j == gramError.index || j == gramError.index + 1 || j == gramError.index + 2 || j == gramError.index - 2 || j == gramError.index - 1)){
                                                    s += '.';
                                                    _textArray.push(s);
                                                    s = wordsArray[j];
                                                } else {
                                                    s += (j == 0 ? '' : ' ') + wordsArray[j];
                                                }
                                            }
                                            _textArray.push(s);
                                            
                                        } else {
                                            _textArray.push(textArray[i]);
                                        }
                                    }
                                    // console.log(_textArray);
                                    
                                    return that.processArray(_textArray, next, true);
                                } // insert point before pronoun personal if error
                            }
                            grams.push(ntreetag);
                            run(index + 1, _next);
                        })
                    } else {
                        grams.push(g._ntreetag);
                        run(index + 1, _next);
                    }
                })
                
            });
        };
        
        run(0, function() {

            next(grams);
        });
    },
    
    'loopForGrammar': function loopForGrammar(gramError, ftag, sentence, next) {
        var that = this;
        var ntreetag;
        var exclude = [gramError.lastWord];
        var firstError = gramError;
        var cpt = 0;
        var stag = ftag.slice(0);
        
        var run = function() {
            if(cpt > 15 || gramError == undefined || Object.keys(gramError).length == 0){
                return next(ntreetag);
            }
            
            if(firstError.index != gramError.index){
                firstError = gramError;
            }
            
            that.findReplacement(firstError.lastWord, firstError.index, ftag, exclude, function(replacement) {
                that.tag(replacement, function(error, treetag) {
                    if(treetag && treetag[0]){
                        stag[firstError.index] = treetag[0];
                    }
                    // console.log(ftag[firstError.index]);
                    
                    var g = grammar.buildGramsFromTag(stag, sentence);
                    gramError = g.gramError;
                    // console.log(gramError);
                    
                    if(gramError && gramError.pos && gramError.pos.match(/pronoun\:personal\:[1-3]/) && gramError.lastRules.indexOf("\\bnoun:[^,]*,pronoun:personal:[^s]") == gramError.lastRules.length - 1){
                        return next(null, null, true, gramError);
                    } // insert point before pronoun personal if error
                    
                    if(gramError && gramError.lastRules && gramError.lastRules.indexOf('det:pos:[^,]*,noun:[^,]*,det:pos:') == gramError.lastRules.length - 1 && gramError.lastWord == 'ma'){
                        var reg = new RegExp('(' + stag[gramError.index - 1][0].form + ')\\s' + 'ma');
                        sentence = sentence.replace(reg, '$1 m a');
                        return next(null, sentence, null);
                    } // ma compagne ma quitter
                    
                    ntreetag = g._ntreetag;
                    exclude.push(replacement);
                    cpt++;
                    run();
                });
                
            });
        };
        
        run();
    },
    
    'findReplacement': function findReplacement(text, index, treetag, exclude, next) {
        if(typeof exclude == 'function'){
            next = exclude;
            exclude = [];
        }
        // var text = treetag[index][0].form;
        var that = this;
        didumean.dicodb = this;
        didumean.search(text, function(error, replacements) {
            var _replacements = [];
            for(var i = 0, l = replacements.length; i < l; i++){
                if(exclude.indexOf(replacements[i]) == -1){
                    _replacements.push(replacements[i]);
                }
            }
            
            replacements = _replacements;
            
            that.findConjugaisons(text, index, treetag, function(error, conjugaisons) {
                for(var i = 0, l = replacements.length; i < l; i++){
                    if(conjugaisons.indexOf(replacements[i]) == -1 && exclude.indexOf(replacements[i]) == -1){
                        conjugaisons.push(replacements[i]);
                    }
                }
                
                replacements = [];
                
                for(var i = 0, l = conjugaisons.length; i < l; i++){
                    if(exclude.indexOf(conjugaisons[i]) == -1){
                        replacements.push(conjugaisons[i]);
                    }
                }

                // console.log('replacements for ' + text);
                // console.log(JSON.stringify(replacements));
                // console.log('didumean execution time : ' + (((new Date().getTime()) - start) / 1000));
            
                if(replacements.length > 1){
                    if(text == 'et' && replacements.indexOf('est') != -1){
                        replacement = 'est';
                    } else {
                    
                        var data = [];
                        for(var c in replacements){
                            if(replacements[c] != ''){
                                var d = that.buildOccurData(replacements[c], index, treetag);
                                data.push(d);
                            }
                        }
                        // console.log(data);
                        var replacement = occur.bestOccur(data);
                        if(replacement == ''){
                            replacement = replacements[0] || text;
                        }
                    }
                } else {
                    var replacement = replacements[0] || text;
                }
                // console.log('replacement : ' + replacement);
                
                next(replacement);
            })
            
        });
    },
    
    'buildOccurData': function buildOccurData(search, index, treetag) {
        var that = this;
        var d = { 'search': search };
        for(var i = 1; i <= 2; i++){
            if(treetag[index - i] && treetag[index - i][0]){
                d['n-' + i] = treetag[index - i][0].form;
                if(treetag[index - i][0].isfirstname && treetag[index - i][0].lemma.pos == 'noun'){
                    d['n-' + i] = '[firstname]';
                } else if(this.isDate(d['n-' + i])){
                    d['n-' + i] = '[date]';
                } else if(treetag[index - i][0].lemma.pos == 'card'){
                    d['n-' + i] = '[card]';
                }
            }
            
            if(treetag[index + i] && treetag[index + i][0]){
                d['n+' + i] = treetag[index + i][0].form;
                if(treetag[index + i][0].isfirstname && treetag[index + i][0].lemma.pos == 'noun'){
                    d['n+' + i] = '[firstname]';
                } else if(this.isDate(d['n+' + i])){
                    d['n+' + i] = '[date]';
                } else if(treetag[index + i][0].lemma.pos == 'card'){
                    d['n+' + i] = '[card]';
                }
            }
            
        }
        
        return d;
    },
    
    'findConjugaisons': function findConjugaisons(text, index, treetag, next) {
        
        // console.log('findConjugaisons ' + text, treetag[index][0].form);

        for(var i = 0, l = treetag.length; i < l; i++){
            if(treetag[i][0].form == text){
                index = i;
            }
        }
        var tag = treetag[index][0];
        
        if(tag.lemma.pos != 'verb'){
            return next(null, []);
        }
        var find  = {
            'lemma.text': tag.lemma.text,
            'lemma.pos': {
                $nin: ['GN', 'GNP', 'GNPX', 'X', 'prefix']
            }
        };
        
        var elemMatch = null;
        
        var b = false;
        if(treetag[index - 1] && treetag[index - 1][0].lemma.pos == 'pronoun'){
            var kv = treetag[index - 1][0].lemma.features.map(function(item) {
                return item.value;
            });
            if(kv.indexOf('personal') != -1 && kv.indexOf('secondary') == -1){
                var number = null;
                var person = null;
                for(var i = 0, l = treetag[index - 1][0].features.length; i < l; i++){
                    if(treetag[index - 1][0].features[i].name == 'number'){
                        // elemMatch.push(treetag[index - 1][0].features[i]);
                        number = treetag[index - 1][0].features[i].value;
                    }
                    if(treetag[index - 1][0].features[i].name == 'person'){
                        person = treetag[index - 1][0].features[i].value;
                    }
                }
                
                if(person !== null && person != null){
                    person = person * (number == 'singular' ? 1 : 2);
                    elemMatch = {'name': 'person', 'value': person};
                }
            }
        }
        else if(treetag[index - 1] && treetag[index - 1][0].lemma.pos == 'verb' && treetag[index - 1][0].lemma.text == 'être'){
            elemMatch = {'name': 'tense', 'value': 'past-participle'};
        }
        
        if(elemMatch !== null){
            find['features'] = { $elemMatch: elemMatch };
        }
        
        // console.log(find);
        
        var col = this.db.collection(this.collectionName);
        col.distinct('form', find, function(error, docs) {
            next(error, docs);
        });
    },
    
    'missingSpace': function missingSpace(word, next) {
        // console.log('missingSpace : ' + word);
        var that = this;
        var bigrams = [];
        for(var i = 1, l = word.length; i < l; i++){
            bigrams.push([word.substring(0, i), word.substring(i, l)]);
        }
        
        var run = function(index, _next) {
            if(bigrams[index] == undefined){
                return _next();
            }
            
            that.tag(bigrams[index], function(error, treetag) {
                if(error){
                    return next(error, null);
                }

                if(treetag[0][0].lemma.pos != 'unknown' && treetag[0][0].form.length > 1 && 
                    treetag[1][0].lemma.pos != 'unknown' && treetag[1][0].form.length > 1 &&
                    (treetag[0][0].form.length == 2 || treetag[1][0].form.length == 2)){
                    return next(null, treetag);
                }
                
                run(index + 1, _next);
            });
            
        };
        
        run(0, function() {
            return next(null, []);
        });
    },
    
    'clusterRawQuestion': function clusterRawQuestion(next) {
        var that = this;
        // var grammarErrorList = [];

        var nbWorker = 6;
        var stats = {
            'correct': {
                'tot': 0,
                'max_length': 0,
                'min_length': 0
            },
            'wrong': {
                'tot': 0,
                'max_length': 0,
                'min_length': 0,
                'details': {
                    'multi': 0,
                    'none': 0
                }
            }
        };
        
        var run = function(index, question, _next) {
            // console.log('################### ' + index + ' #######################');
            question.question = that.cleanText(question.question);
            var textArray = that.getTextArray(question.question);
            // console.log(textArray);
            
            that.processArray(textArray, function(treetags){
                for(var i = 0, l = treetags.length; i < l; i++){
                    if(treetags[i] === null){
                        
                    }
                    else if(treetags[i].length == 1){
                        // process.stdout.write('1', 'utf8');
                        // console.log(' ')
                        console.log(question.question);
                        stats.correct.tot++;
                        if(question.question.length > stats.correct.max_length){
                            stats.correct.max_length = question.question.length;
                        }
                        else if(question.question.length < stats.correct.min_length || stats.correct.min_length == 0){
                            stats.correct.min_length = question.question.length;
                        }                    
                    } 
                    else if(treetags[i].length == 0){
                        // process.stdout.write('0', 'utf8');
                        stats.wrong.tot++;
                        stats.wrong.details.none++;
                        // grammarErrorList.push(d.gramError);
                        if(question.question.length > stats.wrong.max_length){
                            stats.wrong.max_length = question.question.length;
                        }
                        else if(question.question.length < stats.wrong.min_length || stats.wrong.min_length == 0){
                            stats.wrong.min_length = question.question.length;
                        }
                    }
                    else if(treetags[i].length > 1){
                        // process.stdout.write('2', 'utf8');
                        stats.wrong.tot++;
                        stats.wrong.details.multi++;
                        // grammarErrorList.push(d.gramError);
                        if(question.question.length > stats.wrong.max_length){
                            stats.wrong.max_length = question.question.length;
                        }
                        else if(question.question.length < stats.wrong.min_length || stats.wrong.min_length == 0){
                            stats.wrong.min_length = question.question.length;
                        }
                    }
                }
                _next();
            });
        };
        
        var getData = function(_next) {
            that.db.collection('raw_questions').find({}, {skip:8000, limit: 200}).toArray(function(error, docs) {
                if (error) {
                    return next(error);
                }
    
                console.log('Total : ' + docs.length);
                _next(docs)
            });
        };
        
        var options = {
            'getData': getData,
            'nbWorker': nbWorker,
            'process': run,
            'done': function(result) {
                console.log('DONE');
                // console.log(stats);
                // console.log(result.length);
                next(null, stats);
            }
        };
        
        if(!that.db){
            that.setDb(that.config, function() {
                new clusterprocess(options);
            });
        } else {
            new clusterprocess(options);
        }
    }
};

var getTime = function() {
    return new Date().getTime();
};

var getTimeDiff = function(start) {
    var now = getTime();
    return (now - start);
};

module.exports = dicodb;