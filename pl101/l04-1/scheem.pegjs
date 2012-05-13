{
    var str     = function(a)       { return a.join("") }
    var cons    = function(a, as)   { return [a].concat(as) }
    
    var lc = function() { return [lc.caller.arguments[1], lc.caller.arguments[2]]}
}

start = stmt

stmt = s* e:e s*            { return e }

e = w
    / '(' s* ws:ws s* ')'   { return ws; }
    / ['] e:e               { return ['quote', e]; }

ws  = w:e s+ ws:ws          { return cons(w, ws); }
    / w:e                   { return cons(w, []); }

s   = [ \t\n] / ';;' [^\n]*

 
validchar = [0-9a-zA-Z_?!+\-=@#$%^&*/.]
w = cs:validchar+ { return str(cs) }
