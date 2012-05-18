- language 
    - C like operators (`+`, `/`, `?`, `&&`, `==`, `>`, etc)
    - C like scoping (`{...}`)
    - `var x`; -- declare a variable x
    - `:=` -- pascal style assignment operator
    - `define f(a, b)` -- declare a function `f` taking parameters `a`, `b` 

- lib turtle procedures
    - `forward(n)` -- draw a line from the pen to `n` units forward
    - `right(d)`, `left(d)` -- rotate left/right by `d` decimal degrees
    - `rot(r)` -- rotate by `n` radians
    - `move(x,y)` -- move the cursor by (`x`,`y`) relative to the pen (including rotations)
    - `scale(s)` -- scale subsequent commands by `s`
    - `scaleXY(x,y)` -- scale subsequent commands independently in x and y
    - `push()` -- save the current state
    - `pop()` -- restore the lasted pushed state
    - `PI` -- constant for π
    