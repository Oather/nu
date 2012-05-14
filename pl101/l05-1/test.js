// use:
// node test.js [--trace] [--verbose]

var trace 	= process.argv.indexOf('--trace') > 1
var verbose = process.argv.indexOf('--verbose') > 1

var evalScheemM	= require("eval")
var parserM	  	= require("scheem")
var assertM		= require("assert")
//var assert = require('chai').assert // it's actually worse...

var opts = {trace : trace, verbose : verbose}

var eq = function(t, e) {
	assertM.deepEqual(evalScheemM.evalScheem(parserM.parse(t), opts), e); 
	if(verbose) console.log('ok: ' + t + ' => ' + e)
}

eq( "(+ 1 1)",
    2 )

eq( "(cons 1 '(2))",
    [1, 2] )

eq( "(car '(1))",
    1 )

eq( "(cdr '(1))",
    [] )

eq( "(if #t 1 2)",
    1 )
eq( "(if #f 1 2)",
    2 )

eq( '(quote (1 2))',
    [1, 2])

eq( '(begin 1 2)',
    2)
    
eq( '(begin (define x 2) x)',
    2)
eq( '(begin (define x 1) (set! x 2) x)',
    2)
eq( '(begin (define x 1) (begin (set! x 2)) x)',
    2)
    
eq( '(begin (define x 1) (begin (define x 2) (set! x 3)) x)',
    1)

// even allowed?
eq( '(begin ((lambda (x) x) 1))',
    1)
    
eq( '(begin (define f (lambda (x) x)) (f 1))',
    1)
    
eq( '(begin (define f (lambda (x y) (+ x y))) (f 1 2))',
    3)
    
eq( '(begin                               \n\
        (define f (lambda (x)             \n\
            (if (= x 0)                   \n\
                0                         \n\
                (+ 1 (f (- x 1)))         \n\
            )                             \n\
        ))                                \n\
        (f 2)                             \n\
    )',                                     
    2)                                      
                                            
eq('(begin                                \n\
        (define f                         \n\
            (lambda (x)                   \n\
                (lambda (y)               \n\
                    (+ x y)               \n\
                )                         \n\
            )                             \n\
        )                                 \n\
        (define g (f 1))                  \n\
        (g 2)                             \n\
    )',
    3 )
    
eq('(begin                                \n\
        (define f                         \n\
            (lambda (x)                   \n\
                (lambda (y)               \n\
                    (begin                \n\
                        (set! x (+ x y))  \n\
                        x)                \n\
                )                         \n\
            )                             \n\
        )                                 \n\
        (define g (f 1))                  \n\
        (g 2)                             \n\
        (g 5)                             \n\
    )',
    8 )

eq('(begin                               \n\
        (define x 1)                     \n\
        (define f                        \n\
            (lambda (x)                  \n\
                (set! x 2)))             \n\
        (f 1)                            \n\
        x)',
    1)

eq('( ( lambda (x y) (+ x y) )  2  ((lambda (z) (+ 1 z)) 0) )', 3)
eq('(begin (define factorial (lambda (n) (if (= n 1) 1 (* n (factorial (- n 1))) ))) (factorial 4))', 24)

//eq('(alert 1)', undefined)
