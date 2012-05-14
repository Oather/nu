{
	var embedLineCol = false;
	
    var str     = function(a)       { return a.join("") }
    var cons    = function(a, as)   { return [a].concat(as) }
    
    var lce		= embedLineCol
				? function(e) 		{ return {l : lce.caller.arguments[1], c : lce.caller.arguments[2], e : e} }
				: function(e) 		{ return e }
}

start = stmt

stmt = s* e:e s*            { return e }

e = w
    / '(' s* ws:ws s* ')'   { return lce(ws); }
    / ['] e:e               { return lce(['quote', e]); }

ws  = w:e s+ ws:ws          { return cons(w, ws); }
    / w:e                   { return cons(w, []); }

s   = [ \t\n] / ';;' [^\n]*

n   = [0-9]
c   = [0-9a-zA-Z_?!+\-=@#$%^&*/.]
w   = ns:n+                 { return lce(parseInt(str(ns))) }
    / cs:c+                 { return lce(str(cs)) }
