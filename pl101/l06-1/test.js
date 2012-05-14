// use:
// node test.js [--trace] [--verbose] [--parse-only]

var trace 	= process.argv.indexOf('--trace') > 1
var verbose = process.argv.indexOf('--verbose') > 1
var parseOnly = process.argv.indexOf('--parse-only') > 1

var evalM		= require("eval")
var parserM	  	= require("turtle")
var assertM		= require("assert")

var opts = {trace : trace, verbose : verbose}

var eq = function(t, e) {
	if(parseOnly) return parserM.parse(t);
	assertM.deepEqual(evalM.eval(parserM.parse(t), opts), e); 
	if(verbose) console.log('ok: ' + t + ' => ' + e)
}

eq('!2;', 0)
eq('!0;', 1)

eq( "1 + 1;",
    2 )

eq( "1 == 0 || 2 == 2;",
    1 )
eq( "0 == 1 && 2 == 2;",
    0 )

eq( "var x; x := 1; x;",
    1 )
	
eq( "var x; x := 0; repeat(3) x := x + 1; x;",
	3 )
	
eq('if(1) 2;',
	2)
eq('if(0) 2;',
	undefined)

eq('define f(x) x * 2; f(2);',
	4)
	
eq('define f(x) x * 2; f(2);',
	4)
	
eq('1 ? 2 : 3;', 2)
eq('0 ? 1 * 1 : 2 + 1;', 3)

eq('0 ? 1 : 1 ? 2 : 3;', 2)
eq('1 ? 0 ? 2 : 3 : 4;', 3)


eq('define f(x) { x ? x * f(x - 1) : 1; } f(4);', 24)

eq('var x; x := 0; define f() 1; define g() x := 1; f() || g(); x;', 0)
eq('var x; x := 0; define f() 1; define g() x := 1; f() && g(); x;', 1)

eq('define f(x) { x ? x * f(x - 1) : 1; } f(4);', 24)

