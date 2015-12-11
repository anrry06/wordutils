var mygram = {
    'bool': {
        "det[^,]*:m[^,]*,adj:f": false
    },
    
    "true": [],

    "false": [
        "pronoun:personal[^,]*,noun",
        "det[^,]*:s,adj[^,]*:p",
        // "det[^,]*:m[^,]*,adj:f",
        "det[^,]*:m[^,]*,noun:f",
        "det[^,]*,adj[^,]*,verb",
        "det[^,]*:m:s,noun:m:s,verb:ind:[^,]*:1:s",
        "det[^,]*:m:s,noun:m:s,verb:sub:[^,]*:1:s",
        "det[^,]*:m:s,noun:m:s,verb:imp:[^,]*:2:s",
        "nounp,verb:imp",
        "nounp,verb:ind:[^,]*:1:s",
        "pronoun:personal:1:s,verb:ind:[^,]*:3:s",
        "pronoun:personal:1:s,verb:imp:[^,]*:2:s",
        "det[^,]*,adj[^,]*,conjc",
        "det:art[^,]*,det",
        "det:dem[^,]*,det",
        "det:pos[^,]*,det",
        "^adj[^,]*,noun:[^,]*,det[^,]*,noun",
        // "pronoun:personal[^,]*,det[^,]*,noun",
        "pronoun:undefined[^,]*,det[^,]*,noun",
        "det[^,]*,verb",
        "pronoun:personal:1[^,]*,verb[^,]*:2",
        "nounp,noun",
        "\\bnoun:[^,]*,verb:inf",
        "\\bverb:inf,nounp,verb",
        "\\bverb:inf,pronoun:[^,]*,verb",
        "\\bverb:[^,]*:ppast[^,]*,adj[^,]*,noun",
        "\\bverb:[^,]*:ppast[^,]*,noun:[^,]*,noun",
        "\\bverb:[^,]*:ppast[^,]*,pronoun:[^,]*,noun",
        "pronoun:personal:3[^,]*,verb[^,]*2",
        "nounp,verb[^,]*2",
        "\\bnoun:f[^,]*,noun:m[^,]*",
        "\\bnoun:f[^,]*,adj:m[^,]*",
        "pronoun:personal:3[^,]*,verb[^,]*1",
        "prep,verb:ind",
        "prep,verb:sub",
        "prep,verb:imp",
        "det[^,]*:f[^,]*,noun:m",
        "adj:m[^,]*,adj:f",
        "adj[^,]*:s,adj[^,]*:p",
        "adj[^,]*,adj[^,]*,det[^,]*,noun",
        "\\bnoun:m[^,]*,noun:f",
        "\\bnoun:[^,]*:p,noun:[^,]*:s",
        // "\\bverb[^,]*,noun",
        "\\bverb[^,]*,verb:inf[^,]*,verb:ind:[^,]*",
        "\\bverb[^,]*,verb:inf[^,]*,verb:imp[^,]*",
        "\\bverb[^,]*,verb:inf[^,]*,verb:con[^,]*",
        "\\bverb[^,]*,verb:inf[^,]*,verb:sub[^,]*",
        "adverb,noun",
        "det[^,]*:f[^,]*,noun:m[^,]*",
        "intj,pronoun:personal",
        "\\bverb[^,]*:2[^,]*,pronoun:personal[^,]*:3[^,]*",
        "conjc,noun:",
        "\\bverb[^,]*,pronoun:undefined,noun",
        "\\bverb[^,]*,adj[^,]*,noun",
        "\\bnoun:m[^,]*,adj:f",
        "\\bverb[^,]*,det[^,]*,noun:[^,]*,verb",
        // "prep,noun:[^,]*,prep",
        // "prep,verb[^,]*,prep",
        "^noun:[^,]*,adverb",
        "prep,verb:[^,]*:ppast[^,]*,conjc",
        "prep,noun:[^,]*,noun",
        "prep,adj:car[^,]*,noun",
        "prep,pronoun:[^,]*,noun",
        "\\bnoun:comp[^,]*,noun",
        "\\bnoun:[^,]*,verb[^,]*:1",
        "\\bnoun:[^,]*,verb[^,]*:2",
        "^noun:[^,]*,nounp",
        "^noun:[^,]*,noun",
        "^noun:[^,]*,verb",
        "pronoun:personal:sec[^,]*,pronoun:personal:[^s]",
        "pronoun:undefined,noun:",
        "noun:[^,]*,noun:[^,]*,pronoun:personal",
        "adj[^,]*,noun:[^,]*,pronoun:personal",
        // "adverb,det:[^,]*,noun:[^,]*,verb:",
        "conjs,verb:inf",
        // "adverb,det:[^,]*,noun:[^,]*,pronoun:personal:sec[^,]*,verb:",
        "^verb:ind:[^,]*,ponct",
        "\\bverb:ind:[^,]*:1:s,pronoun:personal:1:s,verb:ind:[^,]*:1:s",
        "\\bnoun:[^,]*,noun:",
        "\\bnoun:[^,]*:s,adj[^,]*:p",
        // "\\bverb:[^,]*,det:und:",
        "det:[^,]*,adverb,adj",
        "pronoun:personal:[^,]*,adverb,adj",
        "adj[^,]*:p,noun:[^,]*:s",
        "adj[^,]*:p,adj[^,]*:s",
        "\\bnoun:[^,]*:p,adj[^,]*:s",
        "det:[^,]*:p,noun:[^,]*:s",
        "det:pos:f[^,]*,adj[^,]*,noun:m",
        "det:pos:f[^,]*,adj[^,]*,adj:m",
        "det[^,]*,adj[^,]*,adj[^,]*,ponct",
        "pronoun:[^,]*:1[^,]*,adverb,verb:[^,]*:2",
        "prep,noun[^,]*,pronoun[^,]*,adj",
        "prep,adj[^,]*,pronoun[^,]*,adj",
        "det[^,]*,pronoun[^,]*,adj",
        "pronoun:undefined,pronoun:undefined,adj",
        "pronoun:personal:1[^,]*,pronoun:personal:sec:[^,]*,verb[^,]*:2",
        "det:art:und[^,]*:s,noun[^,]*:s,pronoun:personal:sec:[^,]*,verb:ind:[^,]*:1:s",
        "pronoun:personal:3[^,]*:s,pronoun:personal:sec[^,]*,verb:ind:[^,]*:1",
        "pronoun:personal:1[^,]*:s,pronoun:personal:sec[^,]*,verb:ind:[^,]*:3",

        "prep,pronoun:personal:sec[^,]*,verb:ind",

        "det:pos[^,]*,adj[^,]*,pronoun:personal:sec",
        "prep,adj[^,]*,adj",
        "prep,adj[^,]*,pronoun:undefined",
        "prep,pronoun:undefined,pronoun:undefined",
        "det:[^,]*f:s,adj[^,]*:m",
        "prep,pronoun:undefined,adj",
        // "det:[^,]*,adj[^,]*,ponct",
        // "adverb,adverb",
        "verb:[^,]*:2[^,]*,pronoun:personal:1",
        "intj,intj",
        "intj,verb",
        "adverb,verb:imp",
        "pronoun:personal:1[^,]*,adverb,verb:[^,]*:3[^,]*",
        "det:[^,]*:m[^,]*,noun:f",
        "noun:[^,]*,pronoun:interrogative",
        "adj[^,]*,pronoun:interrogative",
        // "prep,noun:[^,]*,conjs",
        "verb:[^,]*,adj[^,]*,pronoun:relative",
        // "^conjs",
        // "^pronoun:relative",
        "verb:[^,]*:1:[^,]*,pronoun:personal:3:[^,]*",
        "adj:f:[^,]*,prep,adj:m:[^,]*",
        "verb:ind[^,]*[^(?!^ponct)],verb:ind",

        "det:[^,]*,noun:[^,]*,adj[^,]*,noun:[^,]*",
        // "det:[^,]*,noun:[^,]*,adj[^,]*,adj[^,]*",
        "det:pos:[^,]*,adj:[^,]*,noun:[^,]*,adj:",
        "det:pos:[^,]*,adj:[^,]*,adj:[^,]*,adj:[^,]*,ponct",

        "prep,nounp,verb:[^,]*:ppast[^,]*",
        "pronoun:personal:sec:[^,]*,card",
        "verb:[^,]*,adj[^,]*,verb:inf",
        "verb:[^,]*,adj[^,]*,det:pos:",
        "verb:inf,adj:car[^,]*,pronoun:undefined",
        "adj:m:[^,]*,noun:f",
        "verb:ind:[^,]*,pronoun:personal:sec:[^,]*,verb:ind",
        // "adj[^,]*,det:art:def:[^,]*,date",
        "adj[^,]*,pronoun:personal:sec[^,]*,date",
        "pronoun:personal:sec[^,]*,date",
        "pronoun:personal:[^,]*,adverb,conjs,verb:ind:",
        "card,noun:[^,]*:s",
        "det:pos:[^,]*,adj[^,]*,prep",
        "pronoun:undefined,adj[^,]*,noun:",
        "conjc,adj:car:[^,]*,adj[^,]*,noun:",
        "det:art:und:f:[^,]*,noun:comp:m:",
        "pronoun:undefined,pronoun:undefined",
        "adj:car:f:s,pronoun:undefined",
        "det:art:und:f:s,pronoun:undefined",
        
        "verb:ind:sim:[^,]*,verb:con:pre:",
        "pronoun:personal:3:[^,]*,pronoun:personal:sec:[^,]*,pronoun:personal:sec:[^,]*,verb:ind:pre:1:",
        "pronoun:personal:1:[^,]*,verb:sub:pre:3:",
        "det:pos:[^,]*,noun:[^,]*,nounp",
        "det:pos:[^,]*,adj[^,]*,nounp",
        // "pronoun:personal:[1-3]:[^,]*,prep",
        "pronoun:personal:[1-3]:[^,]*,verb:par:ppast:",
        "adverb,prep,verb:par:ppast",
        "pronoun:personal:sec:[^,]*,verb:par:ppast:",
        "pronoun:interrogative,verb:imp",
        "\\bnoun:[^,]*,pronoun:undefined",
        // "ponct,noun:",
        "unknown",
        "prep,verb:par:ppast:",
        "pronoun:personal:1:[^,]*,pronoun:personal:[^,]*,verb:ind:pre:3:",
        "verb:par:ppast:[^,]*,verb:ind:pre:",
        "det:pos:[^,]*,adj[^,]*,adj[^,]*,verb:ind:",
        "det:pos:[^,]*,noun[^,]*,noun[^,]*,verb:ind:",
        "prep,card,verb:",
        "card,noun:[^,]*:s",
        // "adverb,pronoun:interrogative,noun:",
        // "adverb,pronoun:interrogative,verb:par:ppast",
        // "adverb,pronoun:interrogative,pronoun:personal",
        // "adverb,pronoun:interrogative,prep",
        ",pronoun:interrogative",
        "pronoun:relative,conjc",
        // "pronoun:relative,prep",
        // "pronoun:relative,pronoun:personal:sec",
        // "pronoun:relative,verb:par:ppast",
        // "pronoun:relative,noun:",
        
        "pronoun:relative,noun:[^,]*,adverb",
        "pronoun:personal:1[^,]*((?!pronoun:personal:[1-3]).)*verb:ind:pre:2", // je verb mais verb (sujet sous entendu)
        "pronoun:demonstrative,pronoun:personal:sec:[^,]*,verb:ind:pre:1",
        "det:pos:[^,]*,noun:[^,]*,det:pos:",
        "verb:ind:[^,]*:avoir,verb:inf",
        "verb:ind:[^,]*:etre,verb:inf",
        "conjc,det:art:def:[^,]*,date",
        "pronoun:personal:1:[^,]*,pronoun:personal:sec:[^,]*,adverb,verb:ind:pre:3",
        
        "conjs,verb:ind:[^,]*,det:[^,]*,adj:",
        "conjs,noun:[^,]*,det:[^,]*,adj:",
        "^pronoun:relative",
        "pronoun:interrogative,noun:[^,]*,det:art:[^,]*,noun:",
        "pronoun:relative,pronoun:personal:sec:1:s,verb:ind:pre:1:s",
        
        "verb:inf[^,]*,verb:par:ppast[^,]*,adj:",
        "pronoun:relative,noun:[^,]*,verb:ind:sim:",
        // "pronoun:relative,det:[^,]*,noun:[^,]*.*,pronoun:relative",
        // "adverb,verb:par:ppast:",
        "conjs,verb:par:ppast:",
        "verb:sub:pre:[^,]*:etre,verb:ind:",
        "verb:sub:pre:[^,]*:etre,verb:sub:",
        "verb:sub:pre:[^,]*:etre,verb:inf",
        "det:pos:m:[^,]*,noun:comp:m:[^,]*.*,pronoun:relative,.*,verb:sub:pre:[^,]*:etre,verb:par:ppast:f:",
        "det:pos:m:[^,]*,noun:m:[^,]*.*,pronoun:relative,.*,verb:sub:pre:[^,]*:etre,verb:par:ppast:f:",
        
        // "verb:sub:pre:[^,]*,pronoun:personal:sec:[^,]*,verb:sub:pre:",
        // "verb:sub:pre:[^,]*,pronoun:personal:sec:[^,]*,verb:inf",
        
        // "det:art:[^,]*,noun:[^,]*,([^v][^e][^r][^b].*)?pronoun:relative,([^v][^e][^r][^b]).*verb:[^,]*,([^v][^e][^r][^b]).*verb:ind:pre:1",
        
        "prep,noun:[^,]*,det:art:und:[^,]*,card,noun:",
        "prep,adj:[^,]*,det",
        "prep,noun:[^,]*,adj:[^,]*,noun:",
        // "pronoun:relative,det:[^,]*,noun:[^,]*$",
        
        "prep,noun:[^,]*,adj,pronoun:relative",
        "prep,det:art:und:[^,]*,adj,pronoun:relative",
        "prep,det:art:und:[^,]*,adj,conjs",
        "conjs,noun:[^,]*,verb:ind:",
        
        "det:pos:[^,]*:s,noun:[^,]*:s,pronoun:personal:sec:[^,]*,verb:ind:pre:1",
        
        "verb:par:[^,]*,adj:car:[^,]*,adj:",
        "verb:par:[^,]*,pronoun:undefined,adj:",
        "verb:par:[^,]*,det:art:und:[^,]*,adj:[^,]*,ponct",
        "^noun:[^,]*,pronoun:demonstrative",
        
        "prep,adj:car:[^,]*,verb:ind:",
        "prep,pronoun:undefined,verb:ind:",
        
        "pronoun:interrogative,verb:ind:[^,]*,pronoun:personal:sec",
        "verb:ind:[^,]*,pronoun:personal:sec:[^,]*,det:",
        "pronoun:personal:1:s,pronoun:personal:[^s]",
        
        "prep,noun:[^,]*,verb:ind:",
        
        "det:pos:[^,]*,adverb,ponct",
        "pronoun:personal:sec:[^,]*,adj:",
        "det:art:def:[^,]*,adj:[^,]*,prep,noun:[^,]*,prep",
        "verb:[^,]*,adj:car:[^,]*,adj:[^,]*,noun",
        "verb:[^,]*,pronoun:undefined,adj:[^,]*,noun",
        
        "det:pos:s,noun:[^,]*:s,pronoun:personal:sec:[^,]*,verb:ind:pre:1:s",
        "pronoun:personal:[1-3]:[^,]*,adj:[^,]*,det",
        "pronoun:personal:[1-3]:[^,]*,adj:car:[^,]*,noun:",
        
        "verb:ind:pre:[^,]*,pronoun:personal:[1-3]:[^,]*,pronoun:personal:sec:[^,]*,verb:ind:",
        
        "\\bnoun:[^,]*,pronoun:personal:[^s]"
    ],

    "rules": {
        "subjonctif": function(gramtag, sentence, words, treetag) {
            //si match sub
            // if (gramtag.match(/sub/)) {
            //     var array = gramtag.split(/\,/g);
            //     for (var i = 0, l = array.length; i < l; i++) {
            //         if (array[i].match(/sub/)) {
            //             //get index
            //             var index = i;
            //             i = l;
            //         }
            //     }
            //     if (typeof index != 'undefined') {
            //         var before = sentence.split(/[\s\'\’’]/g).splice(0, index);
            //         //si que avant sub ok
            //         if (before.indexOf('que') == -1) {
            //             return false;
            //         }
            //         else if (gramtag.match(/^pronoun:interrogative/)) {
            //             return false;
            //         }
            //         return true;
            //     }
            // }
            if (gramtag.match(/sub/)) {
                for(var i = 0, l = treetag.length; i < l; i++){
                    // console.log(treetag[i].features.map(item => item.value));
                    if(treetag[i].lemma.pos == 'verb' && (treetag[i].features.map(item => item.value).indexOf('subjunctive') != -1 || treetag[i].features.map(item => item.value).indexOf('subj') != -1)){
                        var b = false;
                        var index = i;
                        for(var j = i - 1; j >= 0; j--){
                            // console.log(treetag[j].lemma.text);
                            if(treetag[j].lemma.text == 'que'){ // && treetag[j].lemma.pos == 'pronoun' && treetag[j].lemma.features.map(item => item.value).indexOf('relative') != -1){
                                index = j;
                            }
                        }
                        if(index == i){
                            return false;
                        }
                        for(var j = index; j >= 0; j--){
                            if(treetag[j].lemma.pos == 'verb' && treetag[j].lemma.express && ['doubt', 'probability'].indexOf(treetag[j].lemma.express) != -1){
                                b = true;
                            }
                            if(treetag[j].lemma.pos == 'verb' && ['avoir', 'être'].indexOf(treetag[j].lemma.text) != -1 && 
                                ( treetag[j + 1] && ['probable', 'peur', 'chance'].indexOf(treetag[j + 1].lemma.text) != -1 ||
                                 treetag[j + 2] && ['probable', 'peur', 'chance'].indexOf(treetag[j + 2].lemma.text) != -1)){
                                b = true;
                            }
                        }
                        if(b == false){
                            return false;
                        }
                    }
                }
            }

            return true;
        },
        "depuis": function(gramtag, sentence, words) {
            if (sentence.match(/depuis/)) {
                var array = gramtag.split(/\,/g);
                var index = words.indexOf('depuis');
                if (array[index] == 'adverb' && index != words.length - 1) {
                    return false;
                }
            }

            return true;
        },
        "intj": function(gramtag, sentence) {
            if (gramtag.match(/intj/) && gramtag.indexOf('intj') != 0) {
                return false;
            }

            return true;
        },
        "imp": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].lemma.pos == 'verb' && treetag[i].features.map(item => item.value).indexOf('imperative') != -1){
                    if(i > 1){
                        return false;
                    }
                }
            }

            return true;

        },
        "det,nounp": function(gramtag, sentence) {
            if (gramtag.match(/det[^,]+,nounp/)) {
                var array = gramtag.split(/\,/g);
                for (var i = 0, l = array.length; i < l; i++) {
                    if (array[i].match(/nounp/) && array[i - 1] && array[i - 1].match(/det/) && !array[i].match(/country/)) {
                        return false;
                    }
                }
            }

            return true;
        },
        "prep,noun": function(gramtag, sentence, words, treetag) { 
            if (gramtag.match(/prep,noun:[^,]*/)) {
                var array = gramtag.split(/\,/g);
                for (var i = 0, l = treetag.length; i < l; i++) {
                    if (treetag[i].lemma.pos == 'prep' && treetag[i + 1] && treetag[i + 1].lemma.pos == 'noun' && !treetag[i + 1].isfirstname && !treetag[i].form.match(/^de$|^en$|^sans$|\sde$|^d$/)) {
                        return false;
                    }
                }
            }

            return true;
        }, // de [noun] != avec [det] [noun]
        "que": function(gramtag, sentence, words, treetag) { // gestion de que (pronom interrogatif, relatif ou conjonction de subordination)
            if (sentence.match(/^que\s/) && gramtag.match(/^conjs/)) {
                return false;
            }
            if (sentence.match(/^que\s/) && gramtag.match(/^pronoun\:relative/)) {
                return false;
            }

            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].lemma.text == 'que' && treetag[i].lemma.pos == 'conjs'){
                    // if(treetag[i + 1] && treetag[i + 1].lemma.pos == 'pronoun' && treetag[i + 1].lemma.features[0].value == 'personal' && !treetag[i + 1].lemma.features[1]){
                    //     return false;
                    // }
                    // if((treetag[i + 2] && treetag[i + 2].lemma.pos.match(/verb/)) || 
                    //     (treetag[i + 3] && treetag[i + 3].lemma.pos.match(/verb/)) ){
                    //         return false;
                    //     }
                    if((treetag[i - 3] && treetag[i - 2] && treetag[i - 2].lemma.pos == 'noun' && treetag[i - 3].lemma.pos == 'noun') || 
                        (treetag[i - 2] && treetag[i - 2].lemma.pos == 'noun') ){
                            return false;
                        }
                }
                if(treetag[i].lemma.text == 'que' && treetag[i].lemma.pos == 'pronoun' && treetag[i].lemma.features.map(item => item.value).indexOf('relative') != -1){
                    if((treetag[i - 3] && treetag[i - 2] && treetag[i - 2].lemma.pos != 'noun' && treetag[i - 3].lemma.pos != 'noun') || 
                        (treetag[i - 2] && treetag[i - 2].lemma.pos != 'noun') ){
                            return false;
                        }
                }
                // if(treetag[i].lemma.text == 'que' && treetag[i].lemma.pos == 'pronoun' && treetag[i].lemma.features.map(item => item.value).indexOf('relative') != -1){
                //     // var b = false;
                //     // for(var j = i + 1; j < l; j++){
                //     //     if(treetag[j].lemma.pos == 'verb'){
                //     //         b = true;
                //     //     }
                //     // }
                //     // if(b == true){
                //     //     return true;
                //     // }
                //     if((treetag[i + 2] && treetag[i + 2].lemma.pos.match(/verb/)) || 
                //         (treetag[i + 3] && treetag[i + 3].lemma.pos.match(/verb/)) ||
                //         (treetag[i + 4] && treetag[i + 4].lemma.pos.match(/verb/)) ){
                //             return false;
                //         }
                // }
            }

            return true;
        },
        "maispas": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(['mais', 'pas'].indexOf(treetag[i].form) != -1 && treetag[i].lemma.pos == 'noun'){
                    if(!treetag[i - 1] || !treetag[i - 1].lemma.pos.match(/det/)){
                            return false;
                    }
                }
            }

            return true;
        },
        "si": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(['si'].indexOf(treetag[i].form) != -1 && treetag[i].lemma.pos == 'adverb'){
                    if(!treetag[i + 1] || !treetag[i + 1].lemma.pos.match(/adj/)){
                            return false;
                    }
                } else if(['si'].indexOf(treetag[i].form) != -1 && treetag[i].lemma.pos == 'conjs'){
                    if(treetag[i + 2] && treetag[i + 2].lemma.pos == 'verb'){
                        var pos = '';
                        for(var j = 0, m = treetag[i + 2].features.length; j < m; j++){
                            if(treetag[i + 2].features[j].name == 'mode'){
                                pos += treetag[i + 2].features[j].value;
                            }
                            if(treetag[i + 2].features[j].name == 'tense'){
                                pos += treetag[i + 2].features[j].value;
                            }
                        }
                        if(pos == 'conditionalpresent'){
                            return false;
                        }
                    }
                    else if(treetag[i + 3] && treetag[i + 3].lemma.pos == 'verb'){
                        var pos = '';
                        for(var j = 0, m = treetag[i + 3].features.length; j < m; j++){
                            if(treetag[i + 3].features[j].name == 'mode'){
                                pos += treetag[i + 3].features[j].value;
                            }
                            if(treetag[i + 3].features[j].name == 'tense'){
                                pos += treetag[i + 3].features[j].value;
                            }
                        }
                        if(pos == 'conditionalpresent'){
                            return false;
                        }
                    }
                }
            }

            return true;
        },
        "qui": function(gramtag, sentence, words, treetag) { // gestion de qui (pronom interrogatif, relatif ou indefini)
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].lemma.text == 'qui' && treetag[i].lemma.pos == 'pronoun'){
                    if(treetag[i].lemma.features[0].value == 'undefined'){
                        return false;
                    }
                    if(treetag[i].lemma.features[0].value == 'interrogative' && i != 0){
                        return false;
                    }
                }
            }

            return true;
        },
        "tout/toute": function(gramtag, sentence, words, treetag) { // gestion de qui (pronom interrogatif, relatif ou indefini)
            for(var i = 0, l = treetag.length; i < l; i++){
                if(['tout', 'toute'].indexOf(treetag[i].form) != -1 && treetag[i].lemma.pos == 'adverb'){
                    if(treetag[i + 1] && treetag[i + 1].lemma.pos == 'det'){
                        return false;
                    }
                }
            }

            return true;
        },
        "est": function(gramtag, sentence, words, treetag) {
            if (words.indexOf('est') != -1) {
                var index = words.indexOf('est');
                var array = gramtag.split(/\,/g);
                if (array[index] && array[index].match(/adj/)) {
                    if (array[index - 1] === undefined) {
                        return false;
                    }

                    if (words[index - 1] != 'd') {
                        return false;
                    }
                }
            }
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].form == 'est' && treetag[i].lemma.pos == 'noun' && treetag[i - 1] && treetag[i - 1].lemma.pos != 'det'){
                    return false;
                }
            }

            return true;
        },
        "après": function(gramtag, sentence, words) { // "après" est un adverbe en fin de phrase
            if (words.indexOf('après') != -1) {
                var index = words.indexOf('après');
                var array = gramtag.split(/\,/g);
                if (array[index].match(/adverb/) && !(index == array.length - 1 || index == array.length - 2)) {
                    return false;
                }
            }


            return true;
        },
        "suivre": function(gramtag, sentence, words, treetag) { // suivre n'est pas suivi de adj, prep ou ppast ou 'bien'
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].lemma.text == 'suivre'){
                    
                    if(treetag[i].form == 'suis'){
                        return false;
                    }
                    
                    
                    if(treetag[i + 1] && ( treetag[i + 1].lemma.pos == 'adj' || treetag[i + 1].lemma.pos == 'prep' )){
                        return false;
                    }
                    if(treetag[i + 1] && treetag[i + 1].features){
                        for(var j = 0, m = treetag[i + 1].features.length; j < m; j++){
                            if(treetag[i + 1].features[j].name == 'tense' && treetag[i + 1].features[j].value == 'past-participle'){
                                return false;
                            }
                        }
                    }
                    if(treetag[i + 2] && ( treetag[i + 2].form == 'bien')){
                        return false;
                    }
                }
            }

            return true;
        },
        "bien": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].lemma.text == 'bien' && treetag[i].lemma.pos == 'adverb'){
                    return false;
                }
            }

            return true;
        },
        "quand": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].lemma.text == 'quand' && treetag[i].lemma.pos == 'adverb' && treetag[i + 1] && treetag[i + 1].lemma.pos != 'verb'){
                    return false;
                }
                if(treetag[i].lemma.text == 'quand' && treetag[i].lemma.pos == 'conjs' && treetag[i + 1] && treetag[i + 1].lemma.pos == 'verb'){
                    return false;
                }
            }

            return true;
        },
        "ami": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(['ami', 'amie', 'amis', 'amies'].indexOf(treetag[i].form)!= -1 && treetag[i].lemma.pos == 'adj' && treetag[i + 1] && treetag[i + 1].lemma.pos.match(/^noun/)){
                    return false;
                }

            }

            return true;
        },
        "soit": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].lemma.text == 'soit' && (treetag[i].lemma.pos == 'adverb' || treetag[i].lemma.pos == 'conjs')){
                    if(treetag[i + 1] && treetag[i + 1].lemma.pos == 'verb'){
                        return false;
                    }
                }
            }

            return true;
        },
        "j": function(gramtag, sentence, words, treetag) {
            for(var i = 0, l = treetag.length; i < l; i++){
                if(treetag[i].form == 'j' && treetag[i + 1] && !treetag[i + 1].form.match(/^[aeiouéèêâîûùôàh]/)){
                    return false;
                }
            }

            return true;
        },
        "\\bverb[^,]*,noun": function(gramtag, sentence, words, treetag) {
            var reg = /\bverb[^,]*,noun/;
            if(gramtag.match(reg)){
                for(var i = 0, l = treetag.length; i < l; i++){
                    if(treetag[i].lemma.pos == 'verb' && treetag[i + 1] && treetag[i + 1].lemma.pos == 'noun' && ['envie', 'don'].indexOf(treetag[i + 1].form) == -1){
                        return false;
                    }
                }
            }
            return true;
        },
        "det[^,]*:m[^,]*,adj:f": function(gramtag, sentence, words, treetag) {
            if(mygram.bool["det[^,]*:m[^,]*,adj:f"] == true){
                return true;
            }
            var reg = /det[^,]*:m[^,]*,adj:f/;
            if(gramtag.match(reg)){
                console.log(words[words.length - 2], words[words.length - 1])
                if(words[words.length - 2] == 'mon' && ( words[words.length - 1].substring(0,1).match(/[aeiouéèêâîûùôà]/) || words[words.length - 1].substring(0,2).match(/he|hi|ha/) )){
                    mygram.bool["det[^,]*:m[^,]*,adj:f"] = true;
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        "^pronoun:personal:sec[^,]*,verb": function(gramtag, sentence, words, treetag) {
            var reg = /^pronoun:personal:sec[^,]*,verb[^,]*,/;
            var invreg = /^pronoun:personal:sec[^,]*,verb[^,]*,pronoun:personal:[1-3]/;
            if(gramtag.match(reg)){
                if(gramtag.match(invreg)){
                    return true;
                }
                
                return false;
            }
            return true;
        }
    },

    'ppast': function(data) {
        var result = {
            '_ngrams': [],
            '_ngramsKeys': [],
            '_nwords': [],
            '_ntreetag': [],
            'gramError': data.gramError
        };
        
        var addToResult = function(i) {
            result._ngrams.push(data._ngrams[i]);
            result._ngramsKeys.push(data._ngramsKeys[i]);
            result._nwords.push(data._nwords[i]);
            result._ntreetag.push(data._ntreetag[i]);
        };
        for (var i = 0, l = data._ngrams.length; i < l; i++) {
            if(data._ngrams[i + 1] === undefined){
                if(data._ngrams[i] !== null){
                    addToResult(i);
                }
            } else {
                var nextIndex = i + 1;
                while(data._ngrams[nextIndex] == null && nextIndex < data._ngrams.length){
                    nextIndex += 1;
                }
                if(data._ngrams[i] !== null && data._ngrams[i] !== undefined && data._ngrams[nextIndex] !== null && data._ngrams[nextIndex] !== undefined){
                    var diff1 = this.utils.compareArray(data._ngrams[i], data._ngrams[nextIndex]);
                    var diff2 = this.utils.compareArray(data._ngrams[nextIndex], data._ngrams[i]);
        
                    if ((diff1.length > 0 && diff2.length > 0) && ((diff1[0].match(/adj/) && diff2[0].match(/verb\:par\:ppast/)) || (diff1[0].match(/verb\:par\:ppast/) && diff2[0].match(/adj/)))) {
                        var index = data._ngrams[i].indexOf(diff1[0]);
                        if (typeof data._ntreetag[i][index - 1] != 'undefined') {
                            var previousLemma = data._ntreetag[i][index - 1].lemma.text;
                            if (previousLemma == 'être') {
                                if(diff1[0].match(/adj/)){
                                    addToResult(i);
                                    data._ngrams[nextIndex] = null;
                                }
                                if(data._ngrams.length > 2){
                                    i--;
                                }
                            }
                            else if (previousLemma == 'avoir') {
                                if(diff1[0].match(/verb\:par\:ppast/)){
                                    addToResult(i);
                                    data._ngrams[nextIndex] = null;
                                }
                                if(data._ngrams.length > 2){
                                    i--;
                                }                            }
                            else {
                                // if(data._ngrams[i] !== null){
                                //     addToResult(i);
                                // }
                                if(diff1[0].match(/verb\:par\:ppast/)){
                                    addToResult(i);
                                    data._ngrams[nextIndex] = null;
                                }
                                if(data._ngrams.length > 2){
                                    i--;
                                }                                
                                
                            }
                        }
                        else {
                            if(data._ngrams[i] !== null){
                                addToResult(i);
                            }
                        }
                    }
                    else {
                        if(data._ngrams[i] !== null){
                            addToResult(i);
                        }
                    }
                }
            }
        }

        return result;
    },

    'simplepast': function(data) {
        var result = {
            '_ngrams': [],
            '_ngramsKeys': [],
            '_nwords': [],
            '_ntreetag': [],
            'gramError': data.gramError
        };
        
        var addToResult = function(i) {
            result._ngrams.push(data._ngrams[i]);
            result._ngramsKeys.push(data._ngramsKeys[i]);
            result._nwords.push(data._nwords[i]);
            result._ntreetag.push(data._ntreetag[i]);
        };
        for (var i = 0, l = data._ngrams.length; i < l; i++) {
            if(data._ngrams[i + 1] === undefined){
                if(data._ngrams[i] !== null){
                    addToResult(i);
                }
            } else {
                var nextIndex = i + 1;
                while(data._ngrams[nextIndex] == null && nextIndex < data._ngrams.length){
                    nextIndex += 1;
                }
                if(data._ngrams[i] !== null && data._ngrams[i] !== undefined && data._ngrams[nextIndex] !== null && data._ngrams[nextIndex] !== undefined){
                    var diff1 = this.utils.compareArray(data._ngrams[i], data._ngrams[nextIndex]);
                    var diff2 = this.utils.compareArray(data._ngrams[nextIndex], data._ngrams[i]);
        
                    if ((diff1.length > 0 && diff2.length > 0) && ((diff1[0].match(/verb\:ind\:sim/) && diff2[0].match(/verb\:ind\:pre/)) || (diff1[0].match(/verb\:ind\:pre/) && diff2[0].match(/verb\:ind\:sim/)))) {
                        if(diff1[0].match(/verb\:ind\:pre/)){
                            addToResult(i);
                            data._ngrams[nextIndex] = null;
                        }
                        if(data._ngrams.length > 2){
                            i--;
                        }
                    }
                    else {
                        if(data._ngrams[i] !== null){
                            addToResult(i);
                        }
                    }
                }
            }
        }

        return result;
    },
    
    'indsub': function(data) {
        var result = {
            '_ngrams': [],
            '_ngramsKeys': [],
            '_nwords': [],
            '_ntreetag': [],
            'gramError': data.gramError
        };
        
        // console.log(data._ngramsKeys);
        
        var addToResult = function(i) {
            // console.log("addToResult " + i);
            result._ngrams.push(data._ngrams[i]);
            result._ngramsKeys.push(data._ngramsKeys[i]);
            result._nwords.push(data._nwords[i]);
            result._ntreetag.push(data._ntreetag[i]);
            data._ngrams[i] = null;
        };
        for (var i = 0, l = data._ngrams.length; i < l; i++) {
            if(data._ngrams[i + 1] === undefined){
                if(data._ngrams[i] !== null){
                    addToResult(i);
                }
            } else {
                var nextIndex = i + 1;
                while(data._ngrams[nextIndex] == null && nextIndex < data._ngrams.length){
                    nextIndex += 1;
                }
                if(data._ngrams[i] !== null && data._ngrams[i] !== undefined && data._ngrams[nextIndex] !== null && data._ngrams[nextIndex] !== undefined){
                    var diff1 = this.utils.compareArray(data._ngrams[i], data._ngrams[nextIndex]);
                    var diff2 = this.utils.compareArray(data._ngrams[nextIndex], data._ngrams[i]);
        
                    if ((diff1.length > 0 && diff2.length > 0) && ((diff1[0].match(/ind/) && diff2[0].match(/sub/)) || (diff1[0].match(/sub/) && diff2[0].match(/ind/)))) {
                        var index = data._ngrams[i].indexOf(diff1[0]);
                        if(diff1[0].match(/sub/)){
                            // console.log('ok 1');
                            addToResult(i);
                            data._ngrams[nextIndex] = null;
                        } 
                        else if(diff2[0].match(/sub/)){
                            // console.log('ok 2');
                            addToResult(nextIndex);
                            data._ngrams[i] = null;
                        } 
                        else if(data._ngrams[i] !== null){
                            addToResult(i);
                        }
                    }
                    else if(data._ngrams[i] !== null){
                        addToResult(i);
                    }
                } 
                else if(data._ngrams[i] !== null){
                    addToResult(i);
                }
            }
        }
        
        // console.log(result._ngramsKeys);

        return result;
    },
    
    'infnoun': function(data) {
        var result = {
            '_ngrams': [],
            '_ngramsKeys': [],
            '_nwords': [],
            '_ntreetag': [],
            'gramError': data.gramError
        };
        
        // console.log(data._ngramsKeys);
        
        var addToResult = function(i) {
            // console.log("addToResult " + i);
            result._ngrams.push(data._ngrams[i]);
            result._ngramsKeys.push(data._ngramsKeys[i]);
            result._nwords.push(data._nwords[i]);
            result._ntreetag.push(data._ntreetag[i]);
            data._ngrams[i] = null;
        };
        for (var i = 0, l = data._ngrams.length; i < l; i++) {
            if(data._ngrams[i + 1] === undefined){
                if(data._ngrams[i] !== null){
                    addToResult(i);
                }
            } else {
                var nextIndex = i + 1;
                while(data._ngrams[nextIndex] == null && nextIndex < data._ngrams.length){
                    nextIndex += 1;
                }
                if(data._ngrams[i] !== null && data._ngrams[i] !== undefined && data._ngrams[nextIndex] !== null && data._ngrams[nextIndex] !== undefined){
                    var diff1 = this.utils.compareArray(data._ngrams[i], data._ngrams[nextIndex]);
                    var diff2 = this.utils.compareArray(data._ngrams[nextIndex], data._ngrams[i]);
        
                    if ((diff1.length > 0 && diff2.length > 0) && ((diff1[0].match(/noun\:/) && diff2[0].match(/verb\:inf/)) || (diff1[0].match(/verb\:inf/) && diff2[0].match(/noun\:/)))) {
                        var index = data._ngrams[i].indexOf(diff1[0]);
                        if(diff1[0].match(/verb\:inf/)){
                            // console.log('ok 1');
                            addToResult(i);
                            data._ngrams[nextIndex] = null;
                        } 
                        else if(diff2[0].match(/verb\:inf/)){
                            // console.log('ok 2');
                            addToResult(nextIndex);
                            data._ngrams[i] = null;
                        } 
                        else if(data._ngrams[i] !== null){
                            addToResult(i);
                        }
                    }
                    else if(data._ngrams[i] !== null){
                        addToResult(i);
                    }
                } 
                else if(data._ngrams[i] !== null){
                    addToResult(i);
                }
            }
        }
        
        // console.log(result._ngramsKeys);

        return result;
    },

    'utils': {
        'getIndexes': function getIndexes(key, array) {
            var indexes = [];
            var index = array.indexOf(key);
            while (index != -1) {
                if (indexes.length > 0) {
                    index += indexes[indexes.length - 1];
                }
                indexes.push(index);
                array = array.slice(index);
                index = array.indexOf(key);
            }
            return indexes;
        },
        'compareString': function compareString(s1, s2, splitChar) {
            if (typeof splitChar == "undefined") {
                splitChar = " ";
            }
            var string1 = new Array();
            var string2 = new Array();

            string1 = s1.split(splitChar);
            string2 = s2.split(splitChar);
            var diff = new Array();

            if (s1.length > s2.length) {
                var long = string1;
            }
            else {
                var long = string2;
            }
            for (var x = 0; x < long.length; x++) {
                if (string1[x] != string2[x]) {
                    diff.push(string2[x]);
                }
            }

            return diff;
        },
        'compareArray': function compareArray(a, b) {
            var diff = [];
            for (var i = 0; i < b.length; i++){
                if(a[i] == undefined){
                    diff.push(a[i]);
                }
                else if(a[i] != b[i]){
                    diff.push(a[i]);
                }
            }
            return diff;
        }
    }
};

module.exports = mygram;