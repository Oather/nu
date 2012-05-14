
var str         = function(a)       { return a.join("") }
var cons        = function(a, as)   { return [a].concat(as) }
    
var is_num      = function(e)       { return typeof e === 'number' };
var is_string   = function(e)       { return typeof e === 'string' };
var pop_front   = function(a)       { return a.splice(0, 1)[0] }

var evalScheem  = function(e, env)
{   
    if(is_num(e))       return e;
    if(e === '#t' 
    || e === '#f')      return e;
    if(is_string(e))    return env[e];
    
    var r = function(i) { return evalScheem(e[i], env) };
    
    var binOps = {
        '+'  : function(l,r) { return l + r; },
        '-'  : function(l,r) { return l - r; },
        '*'  : function(l,r) { return l * r; },
        '/'  : function(l,r) { return l / r; },
        '='  : function(l,r) { return l == r ? '#t' : "#f"; },
        '<'  : function(l,r) { return l <  r ? '#t' : "#f"; },
        '>'  : function(l,r) { return l >  r ? '#t' : "#f"; },
        '<=' : function(l,r) { return l <= r ? '#t' : "#f"; },
        '>=' : function(l,r) { return l <= r ? '#t' : "#f"; }
    };
    
    
    
    
    var op = pop_front(e);
    
    if(binOps[op])      return binOps[op](r(0), r(1));
    
    switch(op) {
        case 'define':
        case 'set!':
            env[e[0]] = r(1); return 0;
        case 'begin':
            for(var i in e.slice(0,-1)) r(e[i]);
            return r(e.pop());
        case 'quote':
            return e[0];
        case 'cons':
            return cons(r(0), r(1));
        case 'car':
            return r(0)[0];
        case 'cdr':
            return r(0).splice(1);
        case 'if':
            switch(r(0)) {
                case '#t': return r(1);
                case '#f': return r(2);
                default  : throw e;
            }
    }
}

// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.evalScheem = evalScheem;
}
