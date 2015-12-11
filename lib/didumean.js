var smsTerms = require('./lexiques/sms.json');

var didUMean = {
    
    'dicodb': null,

    'alphabet': 'abcdefghijklmnopqrstuvwxyzéèùàîiâäôö'.split(""),
    
    'accents': [
		/[\300-\306]/g, /[\340-\346]/g,
		/[\310-\313]/g, /[\350-\353]/g,
		/[\314-\317]/g, /[\354-\357]/g,
		/[\322-\330]/g, /[\362-\370]/g,
		/[\331-\334]/g, /[\371-\374]/g,
		/[\321]/g, /[\361]/g,
		/[\307]/g, /[\347]/g
	],
	
    'noAccents': ["A", "a", "E", "e", "I", "i", "O", "o", "U", "u", "N", "n", "C", "c"],
    
    'cache': {},
    
    'known': function known(word) {
        var exist = this.dicodb.exist(word);
        return exist == false ? false : word;
    },
    
    'knownWithoutAccent': function knownWithoutAccent(word, next) {
        // console.log('knownWithoutAccent ' + word);
    	word = this.removeAccents(word);
    	return this.known2(word, false, next);
    },
    
    'knownWithAccent': function knownWithAccent(word, next) {
        // console.log('knownWithAccent ' + word);
        var that = this;
        var results = [];
        var handleAccent = function(word, reg, replacement, check, _next){
        	var _word = word.replace(reg, replacement);
        	if(_word == word){
        	    return _next([]);
        	}
        	that.known2(_word, false, function(error, isKnown2) {
        	    if(error){
        	        return next(error, null);
        	    }
        	    
        	    isKnown2 = isKnown2.filter(function(item) {
        	        return item.match(check);
        	    });

        	    _next(isKnown2)
        	});
        };
        
        var accents = [
            {
                'reg': /e([^ui])/,
                'replacement': 'é$1',
                'check': /é/
            },
            {
                'reg': /e([^ui])/,
                'replacement': 'è$1',
                'check': /è/
            },
            {
                'reg': /e([^ui])/,
                'replacement': 'ê$1',
                'check': /ê/
            },
            {
                'reg': /([^ea])u/,
                'replacement': '$1û',
                'check': /û/
            },
            {
                'reg': /([^ea])u/,
                'replacement': '$1ù',
                'check': /ù/
            },
            {
                'reg': /i/,
                'replacement': 'î',
                'check': /î/
            }
        ];
        
        var run = function(index){
            if(accents[index] === undefined) {
                return next(null, results);
            }
            
            handleAccent(word, accents[index].reg, accents[index].replacement, accents[index].check, function(r) {
                results = results.concat(r);
                run(index + 1);
            });
        };
        
        run(0);
        
    },
    
    'knownWithDifferentAccent': function knownWithDifferentAccent(word, next) {
        // console.log('knownWithDifferentAccent ' + word);
        var that = this;
    	var _match = word.match(/é/gi);
    	if(_match && _match.length == 1){
        	var _word = word.replace(/é/, 'è');
        	return this.known2(_word, false, function(error, isKnown2) {
        	    if(error){
        	        return next(error, null);
        	    }
            	if(isKnown2.length > 0){
            	    return next(null, isKnown2);
            	}
            	
            	var _match = word.match(/è/gi);
            	if(_match && _match.length == 1){
                	var _word = word.replace(/è/, 'é');
                	return that.known2(_word, false, function(error, isKnown2) {
                	    if(error){
                	        return next(error, null);
                	    }
                    	if(isKnown2.length > 0){
                    	    return next(null, isKnown2);
                    	}            	    
                    	return next(null, []);
                	});
            	}
        	    return next(null, []);
        	});
    	}
    	else {
        	var _match = word.match(/è/gi);
    	    if(_match && _match.length == 1){
            	var _word = word.replace(/è/, 'é');
            	return this.known2(_word, false, function(error, isKnown2) {
            	    if(error){
            	        return next(error, null);
            	    }
                	if(isKnown2.length > 0){
                	    return next(null, isKnown2);
                	}            	    
                	return next(null, []);
            	});
        	} else {
        	    return next(null, []);
        	}
    	}
    },
    
    'getAccent': function getAccent(req) {
        // console.log('getAccent ' + req);
    	var search = req.toLowerCase();
    	
    	if(this.cache['getAccent' + search]){
    	    // console.log('cache');
    	    return this.cache['getAccent' + search];
    	}
    	
    	var words = [];
    	words.push(this.removeAccents(req));
        
        var accents = [
            {
                'reg': /e([^ui])/,
                'replacement': 'é$1',
                'check': /é/
            },
            {
                'reg': /e([^ui])/,
                'replacement': 'è$1',
                'check': /è/
            },
            {
                'reg': /e([^ui])/,
                'replacement': 'ê$1',
                'check': /ê/
            },
            {
                'reg': /([^ea])u/,
                'replacement': '$1û',
                'check': /û/
            },
            {
                'reg': /([^ea])u/,
                'replacement': '$1ù',
                'check': /ù/
            },
            {
                'reg': /i/,
                'replacement': 'î',
                'check': /î/
            }
        ];
        
        for(var i = 0, l = accents.length; i < l; i++){
        	var _word = req.replace(accents[i].reg, accents[i].replacement);
            if(_word != req && _word.match(accents[i].check)){
                words.push(_word);
            }
        }

    	var _match = req.match(/é/gi);
    	if(_match && _match.length == 1){
        	var _word = req.replace(/é/, 'è');
        	words.push(_word);
    	}
    	var _match = req.match(/è/gi);
    	if(_match && _match.length == 1){
    	    var _word = req.replace(/è/, 'é');
    	    words.push(_word)
    	}
    	
    	var _words = [];
    	for(var i = 0, l = words.length; i < l; i++){
    	    if(_words.indexOf(words[i]) == -1){
    	        _words.push(words[i]);
    	    }
    	}    	
    	
    	this.cache['getAccent' + search] = _words;
    	
        return _words;
    },
    
    'knownAccent': function knownAccent(req, noaccent, next) {
        console.log('knownAccent ' + req);
        var that = this;
    	var search = req.toLowerCase();
    	
    	if(this.cache['accent' + search]){
    	    // console.log('cache');
    	    return next(null, this.cache['accent' + search])
    	}
    	
    	var splits = search.split('');
    	var words = [];
    	
    	var run = function() {
        	that.soundAlike(search, function(error, soundAlike) {
        	    if(error){
        	        return next(error, null);
        	    }
            	words = words.concat(soundAlike.map(function(item) {
            	    return item.form;
            	}).filter(function(item) {
            	    return words.indexOf(item) == -1;
            	}));

            	var _words = [];
            	for(var i = 0, l = words.length; i < l; i++){
            	    if(_words.indexOf(words[i]) == -1){
            	        _words.push(words[i]);
            	    }
            	}
            	
            	that.cache['accent' + search] = _words;

            	next(null, _words);
        	});
    	};
    		
    	/* Unaccentement */
    	if(noaccent === true && search.match(/[éèêàâäôöîïù]/i)){
    	   // console.log('Unaccentement');
    	    return this.knownWithoutAccent(search, function(error, isKnownWithoutAccent) {
        	    if(error){
        	        return next(error, null);
        	    }
            	if (isKnownWithoutAccent.length > 0) {
            		words = words.concat(isKnownWithoutAccent);
            	}
            	
            	/* accentement */
            	var _match = search.match(/e[^ui]|[^ea]u|i/gi);
            	if(noaccent === true && _match && _match.length == 1){
            	   // console.log('accentement');
                	return that.knownWithAccent(search, function(error, isKnownWithAccent) {
                	    if(error){
                	        return next(error, null);
                	    }
                    	if (isKnownWithAccent.length > 0) {
                    		words = words.concat(isKnownWithAccent);
                    	}
                    	
                    	/* change accentement */
                    	var _match = search.match(/[éè]/gi);
                    	if(noaccent === true && _match && _match.length == 1){
                    	   // console.log('change accentement');
                            return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
                        	    if(error){
                        	        return next(error, null);
                        	    }
                            	if (isKnownWithDifferentAccent.length > 0) {
                            		words = words.concat(isKnownWithDifferentAccent);
                            	}
                            	
                            	return run();
                        	});
                    	}
                    	
                    	return run();
                	});
            	}
            	
            	/* change accentement */
            	var _match = search.match(/[éè]/gi);
            	if(noaccent === true && _match && _match.length == 1){
            	   // console.log('change accentement');
                    return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
                	    if(error){
                	        return next(error, null);
                	    }
                    	if (isKnownWithDifferentAccent.length > 0) {
                    		words = words.concat(isKnownWithDifferentAccent);
                    	}
                    	
                    	return run();
                	});
            	}
            	
            	return run();
        	});
    	}
    	
    	/* accentement */
    	var _match = search.match(/e[^ui]|[^ea]u|i/gi);
    	if(noaccent === true && _match && _match.length == 1){
    	   // console.log('accentement');
        	return this.knownWithAccent(search, function(error, isKnownWithAccent) {
        	    if(error){
        	        return next(error, null);
        	    }
            	if (isKnownWithAccent.length > 0) {
            		words = words.concat(isKnownWithAccent);
            	}
            	
            	/* change accentement */
            	var _match = search.match(/[éè]/gi);
            	if(noaccent === true && _match && _match.length == 1){
            	   // console.log('change accentement');
                    return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
                	    if(error){
                	        return next(error, null);
                	    }
                    	if (isKnownWithDifferentAccent.length > 0) {
                    		words = words.concat(isKnownWithDifferentAccent);
                    	}
                    	
                    	return run();
                	});
            	}
            	
            	return run();
            	
        	});
    	}

    	/* change accentement */
    	var _match = search.match(/[éè]/gi);
    	if(noaccent === true && _match && _match.length == 1){
    	   // console.log('change accentement');
            return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
        	    if(error){
        	        return next(error, null);
        	    }
            	if (isKnownWithDifferentAccent.length > 0) {
            		words = words.concat(isKnownWithDifferentAccent);
            	}
            	
            	return run();
            	
        	});
    	} 
    	
    	return run();
    },
    
    'getManipulationWords': function getManipulationWords(req) {
        // console.log('getManipulationWords ' + req);
        var that = this;
    	var search = req.toLowerCase();
    	
    	if(this.cache['manip' + search]){
    	    // console.log('cache');
    	    return this.cache['manip' + search];
    	}
    	
    	var splits = search.split('');
    	var length = splits.length;
    	var letter;
    	var aLength = this.alphabet.length;
    	var word;

	    var _words = [];
	    
    	for (var i = 0; i < length; i++) {
    	    /* Doublement */
    		word = search.substring(0, i + 1) + search.substring(i, i + 1) + search.substring(i + 1, length);
    		_words.push(word);
    		
    		/* Transposement */
    		word = search.substring(0, i) + splits[i + 1] + splits[i] + search.substring(i + 2, length);
    		_words.push(word);
    		
    		/* Deletion */
    		word = search.substring(0, i) + search.substring(i + 1, length);
    		_words.push(word);
    		
    		/* Replacement */
    		for (var a = 0; a < aLength; a++) {
    		    letter = that.alphabet[a];
    			var i_ = i !== length ? i_ = i + 1 : 0;
    			word = search.substring(0, i_) + letter + search.substring(i_ + 1, length);
        		_words.push(word);
    		}
    	}    	
    	
    	/* Inseriont */
    	for (var i = length; i >= 0; i--) {
    		for (var a = 0; a < aLength; a++) {
    		    letter = that.alphabet[a];
    			word = search.substring(0, i) + letter + search.substring(i, length);
        		_words.push(word);
    		}
    	}
    	
    	that.cache['manip' + search] = _words;
    	
    	return _words;
    },
    
    'known2': function known2(req, noaccent, next) {
        // console.log('known2 ' + req);
        var that = this;
    	var search = req.toLowerCase();
    	
    	if(this.cache[search]){
    	    // console.log('cache');
    	    return next(null, this.cache[search])
    	}
    	
    	var splits = search.split('');
    	var length = splits.length;
    	var letter;
    	var aLength = this.alphabet.length;
    	var word;
    	var words = [];
    	
    	var run = function() {
    	    var _words = [];
    	    
        	for (var i = 0; i < length; i++) {
        	    /* Doublement */
        		word = search.substring(0, i + 1) + search.substring(i, i + 1) + search.substring(i + 1, length);
        		_words.push(word);
        		if(!word.match(/s$/)){
        		    _words.push(word + 's');
        		}
        		
        		/* Transposement */
        		word = search.substring(0, i) + splits[i + 1] + splits[i] + search.substring(i + 2, length);
        		_words.push(word);
        		if(!word.match(/s$/)){
        		    _words.push(word + 's');
        		}
        		
        		/* Deletion */
        		word = search.substring(0, i) + search.substring(i + 1, length);
        		_words.push(word);
        		if(!word.match(/s$/)){
        		    _words.push(word + 's');
        		}
        		
        		/* Replacement */
        		for (var a = 0; a < aLength; a++) {
        		    letter = that.alphabet[a];
        			var i_ = i !== length ? i_ = i + 1 : 0;
        			word = search.substring(0, i_) + letter + search.substring(i_ + 1, length);
            		_words.push(word);
            		if(!word.match(/s$/)){
            		    _words.push(word + 's');
            		}
        		}
        	}    	
        	
        	/* Inseriont */
        	for (var i = length; i >= 0; i--) {
        		for (var a = 0; a < aLength; a++) {
        		    letter = that.alphabet[a];
        			word = search.substring(0, i) + letter + search.substring(i, length);
            		_words.push(word);
            		if(!word.match(/s$/)){
            		    _words.push(word + 's');
            		}
        		}
        	}
        	
        	
        	
        	that.dicodb.validWords({'form': { $in: _words}}, function(error, docs) {
        	    if(error){
        	        return next(error, null);
        	    }
        	    
        	    words = words.concat(docs);

            	that.soundAlike(search, function(error, soundAlike) {
            	    if(error){
            	        return next(error, null);
            	    }
                	words = words.concat(soundAlike.map(function(item) {
                	    return item.form;
                	}).filter(function(item) {
                	    return words.indexOf(item) == -1;
                	}));

                	var _words = [];
                	for(var i = 0, l = words.length; i < l; i++){
                	    if(_words.indexOf(words[i]) == -1){
                	        _words.push(words[i]);
                	    }
                	}
                	
                	that.cache[search] = _words;

                	next(null, _words);
            	});
        	});
    	};
    		
    	/* Unaccentement */
    	if(noaccent === true && search.match(/[éèêàâäôöîïù]/i)){
    	   // console.log('Unaccentement');
    	    return this.knownWithoutAccent(search, function(error, isKnownWithoutAccent) {
        	    if(error){
        	        return next(error, null);
        	    }
            	if (isKnownWithoutAccent.length > 0) {
            		words = words.concat(isKnownWithoutAccent);
            	}
            	
            	/* accentement */
            	var _match = search.match(/e[^ui]|[^ea]u|i/gi);
            	if(noaccent === true && _match && _match.length == 1){
            	   // console.log('accentement');
                	return that.knownWithAccent(search, function(error, isKnownWithAccent) {
                	    if(error){
                	        return next(error, null);
                	    }
                    	if (isKnownWithAccent.length > 0) {
                    		words = words.concat(isKnownWithAccent);
                    	}
                    	
                    	/* change accentement */
                    	var _match = search.match(/[éè]/gi);
                    	if(noaccent === true && _match && _match.length == 1){
                    	   // console.log('change accentement');
                            return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
                        	    if(error){
                        	        return next(error, null);
                        	    }
                            	if (isKnownWithDifferentAccent.length > 0) {
                            		words = words.concat(isKnownWithDifferentAccent);
                            	}
                            	
                            	return run();
                        	});
                    	}
                    	
                    	return run();
                	});
            	}
            	
            	/* change accentement */
            	var _match = search.match(/[éè]/gi);
            	if(noaccent === true && _match && _match.length == 1){
            	   // console.log('change accentement');
                    return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
                	    if(error){
                	        return next(error, null);
                	    }
                    	if (isKnownWithDifferentAccent.length > 0) {
                    		words = words.concat(isKnownWithDifferentAccent);
                    	}
                    	
                    	return run();
                	});
            	}
            	
            	return run();
        	});
    	}
    	
    	/* accentement */
    	var _match = search.match(/e[^ui]|[^ea]u|i/gi);
    	if(noaccent === true && _match && _match.length == 1){
    	   // console.log('accentement');
        	return this.knownWithAccent(search, function(error, isKnownWithAccent) {
        	    if(error){
        	        return next(error, null);
        	    }
            	if (isKnownWithAccent.length > 0) {
            		words = words.concat(isKnownWithAccent);
            	}
            	
            	/* change accentement */
            	var _match = search.match(/[éè]/gi);
            	if(noaccent === true && _match && _match.length == 1){
            	   // console.log('change accentement');
                    return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
                	    if(error){
                	        return next(error, null);
                	    }
                    	if (isKnownWithDifferentAccent.length > 0) {
                    		words = words.concat(isKnownWithDifferentAccent);
                    	}
                    	
                    	return run();
                	});
            	}
            	
            	return run();
            	
        	});
    	}

    	/* change accentement */
    	var _match = search.match(/[éè]/gi);
    	if(noaccent === true && _match && _match.length == 1){
    	   // console.log('change accentement');
            return that.knownWithDifferentAccent(search, function(error, isKnownWithDifferentAccent) {
        	    if(error){
        	        return next(error, null);
        	    }
            	if (isKnownWithDifferentAccent.length > 0) {
            		words = words.concat(isKnownWithDifferentAccent);
            	}
            	
            	return run();
            	
        	});
    	} 
    	
    	return run();
    },
    
    'known3': function known3(req, noaccent, next) {
        // console.log('known3 ' + req);
        var that = this;
    	var search = req.toLowerCase();
    	
    	if(this.cache['3' + search]){
    	    // console.log('cache');
    	    return next(null, this.cache['3' + search]);
    	}
    	
    	var splits = search.split('');
    	var length = splits.length;
    	var word;
    	var words = [];
	    var _words = [];
	    
    	for (var i = 0; i < length; i++) {
    		/* Deletion */
    		word = search.substring(0, i) + search.substring(i + 2, length);
    		_words.push(word);
    	}
    	
    	var start = new Date().getTime();
    	
    	var Mwords = this.getManipulationWords(req);
    	var MAwords = [];
    	var MAMwords = [];
    	var MAMAwords = [];
    	for (var i = 0, l = Mwords.length; i < l; i++) {
    	    var __words = this.getAccent(Mwords[i]);
    	    MAwords = MAwords.concat(__words);
    	    
    	}
	    for(var j = 0, m = MAwords.length; j < m; j++){
	        var ___words = this.getAccent(MAwords[j]);
	        MAMwords = MAMwords.concat(___words);
	    }
    	        
        for(var k = 0, n = MAMwords.length; k < n; k++){
	        var ____words = this.getAccent(MAMwords[k]);
	        MAMAwords = MAMAwords.concat(____words);
	    }
    	    
    // 	for (var i = 0, l = Mwords.length; i < l; i++) {
    // 	    var __words = this.getAccent(Mwords[i]);
    // 	    MAwords = MAwords.concat(__words);
    	    
    // 	    for(var j = 0, m = __words.length; j < m; j++){
    // 	        var ___words = this.getAccent(__words[j]);
    // 	        MAMwords = MAMwords.concat(___words);
    	        
    // 	        for(var k = 0, n = ___words.length; k < n; k++){
    //     	        var ____words = this.getAccent(___words[k]);
    //     	        MAMAwords = MAMAwords.concat(____words);
        	        
    //     	    }
    // 	    }
    	    
    // 	}
    	
    	_words = _words.concat(MAwords);
    	_words = _words.concat(MAMwords);
    	_words = _words.concat(MAMAwords);
    	
    	var __words = [];
    	for(var i = 0, l = _words.length; i < l; i++){
    	    if(__words.indexOf(_words[i]) == -1){
    	        __words.push(_words[i]);
    	    }
    	}
    	
        // console.log('knonw3 execution time 1 : ' + (((new Date().getTime()) - start) / 1000));

    	
    	_words = __words.slice(0);
    	
    // 	console.log(_words.length);
    	
    	that.dicodb.validWords({'form': { $in: _words}}, function(error, docs) {
    	    if(error){
    	        return next(error, null);
    	    }
    	    
            // console.log('knonw3 execution time 2 : ' + (((new Date().getTime()) - start) / 1000));

    	    
    	    words = words.concat(docs);
    	    
    	    that.cache['3' + search] = words;
    	    
	        return next(null, words);
    	});

    },
    
    'soundAlike': function soundAlike(search, next) {
        var searchPhonex = this.dicodb.getPhonex(search, true);
        searchPhonex = searchPhonex.replace(/[\[\]]/g, '');
        if(searchPhonex == ''){
            return next(null, []);
        }
        this.dicodb.get({'phonex': searchPhonex }, function(error, docs) {
            if(error){
                return next(error, null);
            }
            
            return next(null, docs);
        });
    },
    
    'isSMS': function isSMS(search) {
        var r = [];
        for(var i = 0, l = smsTerms.length; i < l; i++){
            var k = smsTerms[i].key;
            if(k == search){
                r = r.concat(smsTerms[i].values.split(/[\s\,\']/));
            }
        }
        return r;
    },
    
    'replaceSMS': function replaceSMS(text) {
        
        text = text.replace(/(je|tu|il|elle)\s\bc\b/ig, '$1 sais');
        text = text.replace(/il\si\sa/ig, 'il y a');
        
        for(var i = 0, l = smsTerms.length; i < l; i++){
            var k = smsTerms[i].key;
            var reg = new RegExp('\\b' + this.escapeRegExp(k) + '\\b([^\'a-zéèàê])', 'ig');
            if(text.match(reg)){
                // console.log('match for ' + reg);
                text = text.replace(reg, smsTerms[i].values + '$1')
            }
        }
        return text;
    },
    
    'search': function search(search, next) {
        var that = this;
    	search = search.toLowerCase();

    	if(search.match(/raen/)){
    	    return this.known2(search.replace(/raen/, 'ren'), true, function(error, isKnown2) {
    	        if(error){
    	            return next(error, null);
    	        }
    	        if (isKnown2.length > 0) {
            		return next(null, isKnown2);
            	}
        	    that.known2(search.replace(/raen/, 'ran'), true, function(error, isKnown2) {
        	        if(error){
        	            return next(error, null);
        	        }
        	        if (isKnown2.length > 0) {
                		return next(null, isKnown2);
                	}
        	    });            	
            	
    	    });
    	}
    	
    	this.known2(search, true, function(error, isKnown2) {
	        if(error){
	            return next(error, null);
	        }
            if (isKnown2.length > 0) {
        		return next(null, isKnown2);
        	} else {
        	    return that.searchHarder(search, next)
        	}
    	   // return next(null, [search]);
    	});
    },
    
    'searchHarder': function search(search, next) {
        var that = this;
    	search = search.toLowerCase();
    	
    	this.known3(search, true, function(error, isKnown3) {
	        if(error){
	            return next(error, null);
	        }
            if (isKnown3.length > 0) {
        		return next(null, isKnown3);
        	}    	    
    	    return next(null, [search]);
    	});
    },
    
    'removeAccents': function removeAccents(str) {
    	for (var i = 0; i < this.accents.length; i++) {
    		str = str.replace(this.accents[i], this.noAccents[i]);
    	}
    	return str;
    },
    
    'escapeRegExp': function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
};

module.exports = didUMean;