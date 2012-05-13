
var str         = function(a)       { return a.join("") }
var cons        = function(a, as)   { return [a].concat(as) }
var cdr         = function(a)       { return a.slice(1) }
var back        = function(a)       { return a[a.length-1] }
    
var is_num      = function(e)       { return typeof e === 'number' }
var is_str      = function(e)       { return typeof e === 'string' }
var is_func     = function(e)       { return typeof e === 'function' }

var pop_front   = function(a)       { return a.splice(0, 1)[0] }

var shallow_copy= function(o)       { var c = {}; for(i in o) c[i] = o[i]; return c }

// javascript dosn't alias functions correctly :/
var alias_f		= function(f)		{ return function(){ return f.apply(this, arguments) } }

var emptyEnv = {
    o : { n: null, v: null, o: null },
    _r: function(n, f)              { return function r(o) {
                                        switch(o.n) {
                                            case null:      throw "unknown var: `" + n + "'"
                                            case n:         return f(o)
                                            default:        return r(o.o)
                                    } }(this.o) },
    
    g : function(n)                 { return this._r(n, function(x) { return x.v })     },
    s : function(n, v)              { return this._r(n, function(x) { return x.v = v }) },
    i : function(n, v)              { this.o = {n : n, v : v, o : this.o}; return this }
}

var envToArray = function(o)        { return o.n === null ? [] : cons({n : o.n, v : o.v}, envToArray(o.o)) }

var defEnv = function() {
    
    var consts = {
        '#t':  '#t',
        '#f':  '#f'
    }

    var binOps = {
        '+'  : function(l,r) { return l + r },
        '-'  : function(l,r) { return l - r },
        '*'  : function(l,r) { return l * r },
        '/'  : function(l,r) { return l / r },
        '='  : function(l,r) { return l == r ? '#t' : "#f" },
        '<'  : function(l,r) { return l <  r ? '#t' : "#f" },
        '>'  : function(l,r) { return l >  r ? '#t' : "#f" },
        '<=' : function(l,r) { return l <= r ? '#t' : "#f" },
        '>=' : function(l,r) { return l <= r ? '#t' : "#f" }
    }

    var builtIn = {
        cons : cons,
        car  : function(a) { return a[0] },
        cdr  : cdr,
		alert: function(e) { return console.log(e) },
    }
    
    var env = shallow_copy(emptyEnv)
    var insert_many = function(a) { for(i in a) env.i(i, a[i]) }
    
    insert_many(consts)
    insert_many(binOps)
    insert_many(builtIn)
    
    return env
}()


var evalScheem = function(e, env)
{
    if(is_num(e))       return e
    if(is_str(e))       return env.g(e)
    
    var re = function(e) { return evalScheem(e, env) }
    var r  = function(i) { return re(e[i]) }
    
    var op = e[0], e = cdr(e)
    
    switch(op) {
        case 'begin':
            env = shallow_copy(env)
            return back(e.map(re))
        case 'define':
            env.i(e[0], r(1)); return 0
        case 'set!':
            env.s(e[0], r(1)); return 0
        case 'quote':
            return e[0]
        case 'if':
            switch(r(0)) {
                case '#t': return r(1)
                case '#f': return r(2)
                default  : console.log(e); throw e
            }
        case 'lambda':
            return function() {
                    var ns = e[0], vs = arguments
                    if(e.length !== 2)              throw "arity mismatch in: " + op
                    if(ns.length !== vs.length)     throw "arity mismatch"
                    env = shallow_copy(env)
                    for(i in ns) env.i(ns[i], vs[i])
                    return r(1)
                }
            
        default:
            var f = re(op)
            if(!is_func(f)) throw "function expected: " + f
            return f.apply({}, e.map(re))
    }
}

var evalScheemN = evalScheem

var evalScheemS = function(e, o)
{
	if(o == undefined) o = {}
	var log = alias_f(o.log ? o.log : console.log);
	
	var env = shallow_copy(defEnv)
	
	env.i('alert', log);
	
	for(i in o.env)
		env.i(i, o.env(i));
	
	var evalScheemT = function(e, env) {
	    log(e)
	    var r = evalScheemN(e, env)
	    log(" => ", r)
	    return r
	}
	
	evalScheem = o.trace ? evalScheemT : evalScheemN
	
    return evalScheem(e, env)
}

module.exports = {
	evalScheem : evalScheemS
}

