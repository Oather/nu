
var str         = function(a)       { return a.join("") }
var cons        = function(a, as)   { return [a].concat(as) }
var cdr         = function(a)       { return a.slice(1) }
var back        = function(a)       { return a[a.length-1] }
    
var is_num      = function(e)       { return typeof e === 'number' }
var is_str      = function(e)       { return typeof e === 'string' }
var is_func     = function(e)       { return typeof e === 'function' }
var is_array    = function(e)       { return typeof e === 'array' }
var is_object	= function(e)       { return typeof e === 'object' }

var pop_front   = function(a)       { return a.splice(0, 1)[0] }

var shallow_copy= function(o)       { var c = {}; for(i in o) c[i] = o[i]; return c }

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

var mkDefEnv = function() {
    
    var consts = {
        'true' :  '1',
        'false':  '0'
    }

    var binOps = {
        '+'  : function(l,r) { return l + r },
        '-'  : function(l,r) { return l - r },
        '*'  : function(l,r) { return l * r },
        '/'  : function(l,r) { return l / r },
        '==' : function(l,r) { return l == r ? 1 : 0 },
        '<'  : function(l,r) { return l <  r ? 1 : 0 },
        '>'  : function(l,r) { return l >  r ? 1 : 0 },
        '<=' : function(l,r) { return l <= r ? 1 : 0 },
        '>=' : function(l,r) { return l <= r ? 1 : 0 },
        '||' : function(l,r) { return l || r ? 1 : 0 },
        '&&' : function(l,r) { return l && r ? 1 : 0 },
    }

    var builtIn = {
        cons : cons,
        car  : function(a) { return a[0] },
        cdr  : cdr,
		log  : function(e) { return console.log(e) },
		'!'	 : function(r) { return r ? 0 : 1 },
    }
    
    var env = shallow_copy(emptyEnv)
    var insert_many = function(a) { for(i in a) env.i(i, a[i]) }
    
    insert_many(consts)
    insert_many(binOps)
    insert_many(builtIn)
    
    return env
}


var evalR = function(e, env)
{
    if(is_num(e))       return e
    if(is_str(e))       return env.g(e)
    
    var r  = function(e) { return evalR(e, env) }
    
	switch(e.tag) {
		case ':=':
			var v = r(e.right)
            env.s(e.left, v); return v
		case '?':
			return r(e.expr) ? r(e.left) : r(e.right)
		case '&&':
			return r(e.left) && r(e.right) ? 1 : 0;
		case '||':
			return r(e.left) || r(e.right) ? 1 : 0;

		case 'var':
			env.i(e.name, undefined); return e.name;
		case 'ident':
			return env.g(e.name);
		
		case 'if':
			if(r(e.expr) !== 0) return r(e.body);
		case 'repeat':
			var c = r(e.expr);
			var l = undefined;
			while(c-- > 0) l = r(e.body);
			return l;
		case 'define':
			env.i(e.name,
	            function() {
	                var ns = e.args, vs = arguments
	                if(ns.length !== vs.length)     throw "arity mismatch for: " + e.name
	                env = shallow_copy(env)
	                for(i in ns) env.i(ns[i], vs[i])
	                return r(e.body)
	            });
			return e.name;
		case 'scope':
			env = shallow_copy(env)
			return back(e.ss.map(r))
		case 'call':
            var f = r(e.name)
            if(!is_func(f)) throw "function expected: " + f
            return f.apply({}, e.args.map(r))
		default:
			throw "unkown tag: " + e.tag + " in: " + e;
	}
}

var evalN = evalR

var evalS = function(e, o)
{
	if(o == undefined) o = {}
	var log = o.log ? o.log : console.log.bind(console);
	
	var env = mkDefEnv()
	
	env.i('log', log)
	
	for(i in o.env)
		env.i(i, o.env[i])
	
	var evalT = function(e, env) {
	    log(e)
	    var r = evalN(e, env)
	    log(" => ", r)
	    return r
	}
	
	evalR = o.trace ? evalT : evalN
	
    return evalR(e, env)
}

module.exports = {
	eval : evalS
}

