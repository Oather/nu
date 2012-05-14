{
    var str     = function(a)                           { return a.join("") }
    var cons    = function(a, as)                       { return [a].concat(as) }
                
    // ast                                              
    var call    = function(n, as)                       { return { tag: "call", name: n, args: as} }
    var ident   = function(n)                           { return { tag: "ident", name: n} }
    var defFun  = function(n, as, ss)                   { return { tag: "define", name: n, args: as, body: ss} }
    var scope   = function(ss)                          { return { tag: 'scope', ss: ss } }
                
    var binOp   = function(n, l, r)                     { return call(n, [l, r]) }
    var unaryOp = function(n, r)                        { return call(n, [r]) }
    var ternaryOp = function(e, l, r)                   { return { tag: '?', expr: e, left: l, right: r} }
    var specialBinOp = function(n, l, r)                { return { tag: n, left: l, right: r } }
}

start = _ ss:ss? _                                      { return scope(ss) }

// Statements //
s   = s_var
    / s_assign
    / s_define
    / s_var
    / s_if
    / s_repeat
    / s_body
    / s_e
    
ss  = s:s _ ss:ss                                       { return cons(s, ss); }
    / s:s                                               { return cons(s, []); }
    
s_var   = 'var' w+ i:i _ ';'                            { return {tag: "var", name: i} }
s_assign= i:i _ o:':=' _ e:e _ ';'                      { return specialBinOp(o, i, e) }

s_if    = 'if' _ '(' _ e:e _ ')' _ b:s                  { return {tag: "if", expr: e, body: b} }

s_repeat= 'repeat' _ '(' _ e:e _ ')' _ b:s              { return {tag: "repeat", expr: e, body: b} }

s_define= 'define' w+ i:i _ '(' _ is:is? _ ')' _ b:s    { return defFun(i, is, b) }

s_body  = '{' _ ss:ss? _ '}'                            { return scope(ss) }

s_e     = e:e _ ';'                                     { return e; }

// Expressions //
e   = e_logi
es  = e:e _ ',' _ es:es                                 { return cons(e, es); }
    / e:e                                               { return cons(e, []); }

e_logi = e_logi_or
e_logi_or   = l:e_logi_and _ o:'||' _ r:e_logi_or       { return specialBinOp(o, l, r) }
            / e_logi_and
e_logi_and  = l:e_comp _ o:'&&' _ r:e_logi_and          { return specialBinOp(o, l, r) }
            / e_comp
                
e_comp_op   = '<=' / '>=' / '!=' / '==' / '<' / '>'     
e_comp      = l:e_math _ o:e_comp_op _ r:e_comp         { return binOp(o, l, r) }
            / e_math
                
e_math      = e_math_add                                
e_math_add  = l:e_math_mul _ o:[+-] _ r:e_math_add      { return binOp(o, l, r) }
            / e_math_mul
                
e_math_mul  = l:e_ternary _ o:[*/] _ r:e_math_mul       { return binOp(o, l, r) }
            / e_ternary
                                
e_ternary = e:e_unary _ '?' _ l:e _ ':' _ r:e           { return ternaryOp(e, l, r) }
            / e_unary
                            
e_unary     = o:'!' r:e_call                            { return unaryOp(o, r) }
            / e_call
                
e_call      = i:i _ '(' _ as:es? _ ')'                  { return call(i, as || []) }
            / e_prime
                
e_prime     = '(' _ e:e _ ')'                           { return e }
            / i:i                                       { return ident(i) }
            / n 

// Numbers -- oh regex where art thou //
n   = a:[-]? b:n_f          { return parseFloat(a + b) }
n_ds    = n_ds:[0-9]+               { return str(n_ds) }
n_i     = a:[1-9] b:n_ds?           { return '' + a + b }
        / [0]                       { return '0' }
n_f     = a:n_i [.]? b:n_ds?        { return '' + a + '.' + b }
        /       [.]  b:n_ds         { return '.' + b }

// Tokens //
i   = cs:[a-zA-Z_]+         { return str(cs) }

is  = i:i _ ',' _ is:is             { return cons(i, is); }
    / i:i                           { return cons(i, []); }

// Whitespace //
w   = [ \t\n] / '//' [^\n]*
_   = w*

