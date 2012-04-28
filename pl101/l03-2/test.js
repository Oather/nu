var parser = require("mus")
var assert = require("assert")
var testMus = function(t, e) { assert.deepEqual(parser.parse(t), e) }

// pitch
testMus("a4", {tag:"note", pitch:"a4", dur:500})
testMus("g8", {tag:"note", pitch:"g8", dur:500})

// dur
testMus("a4'", 
    {
       "tag": "note",
       "pitch": "a4",
       "dur": 250
    } );
testMus("a4\"",
    {
       "tag": "note",
       "pitch": "a4",
       "dur": 125
    } );
testMus("a4''",
    {
      "tag": "note",
      "pitch": "a4",
      "dur": 125
    } );
testMus("a4.",
      {
        "tag": "note",
        "pitch": "a4",
        "dur": 1000
      } );

// par
testMus("a4c4", 
    {
       "tag": "par",
       "left": {
          "tag": "note",
          "pitch": "a4",
          "dur": 500
       },
       "right": {
          "tag": "note",
          "pitch": "c4",
          "dur": 500
       }
    } );
testMus("a4|c4", 
   {
      "tag": "par",
      "left": {
         "tag": "note",
         "pitch": "a4",
         "dur": 500
      },
      "right": {
         "tag": "note",
         "pitch": "c4",
         "dur": 500
      }
   } );

// seq
testMus("a4 c4",
    {
       "tag": "seq",
       "left": {
          "tag": "note",
          "pitch": "a4",
          "dur": 500
       },
       "right": {
          "tag": "note",
          "pitch": "c4",
          "dur": 500
       }
    } );

// rep
testMus("[a4]",
    {
       "tag": "repeat",
       "section": {
          "tag": "note",
          "pitch": "a4",
          "dur": 500
       },
       "count": 2
    } );

testMus("[a4]22",
    {
       "tag": "repeat",
       "section": {
          "tag": "note",
          "pitch": "a4",
          "dur": 500
       },
       "count": 22
    } );

// ()
testMus("(a2 c4)b1", 
    {
       "tag": "par",
       "left": {
          "tag": "seq",
          "left": {
             "tag": "note",
             "pitch": "a2",
             "dur": 500
          },
          "right": {
             "tag": "note",
             "pitch": "c4",
             "dur": 500
          }
       },
       "right": {
          "tag": "note",
          "pitch": "b1",
          "dur": 500
       }
    } );
