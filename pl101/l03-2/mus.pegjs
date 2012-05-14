{
    var baseNoteTime_ms = 500; //??
    
    var str     = function(a)       { return a.join("") }
    var cons    = function(a, as)   { return [a].concat(as) }
    
    var traverseNotes = function(t, f) { 
        var r = function(t) { traverseNotes(t, f) }
        switch (t.tag) {
            case 'note':
                return f(t)
            case 'par': 
            case 'seq':
                return [r(t.left), r(t.right)]
            case 'repeat':
                return r(t.section)
        }
    }
    
    var durationArrayToMultiplier = function(a) { 
        var c2f = function(c) { return {'\'': 1/2, '"': 1/4, '.': 2}[c] }
        var t = 1
        for(i in a) t *= c2f(a[i])
        return t
    }
    
    if(false)
    {
        // native AST
        var note    = function(p, d)    { return p }
        var par     = function(l, r)    { return {p: cons(l,r)} }
        var seq     = function(l, r)    { return {s: cons(l,r)} }
        var dur     = function(e, d)    { return {e: e, d: d} }
        var rep     = function(e, n)    { return {r: e, n: n} }
    }
    else
    {
        // MUS AST
        var note    = function(p, d)    { return {tag: 'note', pitch: p, dur: d || baseNoteTime_ms} }
        var par     = function(l, r)    { return {tag: 'par',  left: l,  right: r} }
        var seq     = function(l, r)    { return {tag: 'seq',  left: l,  right: r} }
        var rep     = function(e, n)    { return {tag: 'repeat', section: e, count: n} }
        var dur     = function(e, d)    { traverseNotes(e, function(n) { n.dur *= d }); return e; }
    }
}

/* 
 * Note: Scientific pitch notation. ex: c4
 * Sequential: seporate by space. ex: c4 a7
 * Parallel: seporate by | (low precedence). ex: c4 | a7
 *           adjacent (high precedence). ex: c4a7
 * Duration modifiers: ': half, ":quarter, .:double. ex: c4'
 * Repeate: square brackets and optional repeat count. ex: [a1 b2]3
 * Group: brackets: ex: (a2c1 d4)
 * Precedenece: brackets, parallel (adjacent notes), duration modifier, squential, parallel (|)
 */

start = w* e:e w*                   { return e }

 w       = [ \t\n]
 int     = n:([1-9][0-9]*)          { return parseInt(str(n)) }

e = par2

par2    = l:seq w* '|' w* r:seq     { return par(l, r) }
        / seq

seq     = l:dur w+ r:e              { return seq(l, r) }
        / dur

dur     = e:par d:['".]+            { return dur(e, durationArrayToMultiplier(d)) }
        / par

par     = l:pitch r:par             { return par(l, r) }
        / pitch

pitch   = p:([a-g][0-9])            { return note(str(p)) }
        / rep

rep     = '[' w* e:e w* ']' n:int?  { return rep(e, n || 2) }
        / paren

paren   = '(' w* e:e w* ')'         { return e }


