module.exports = (function(){

	var cons        = function(a, as)   { return [a].concat(as) }
	var pop_front   = function(a)       { return a.splice(0, 1)[0] }

	var identity_m = {xx: 1, xy: 0, xo: 0, yx: 0, yy: 1, yo: 0};

	var mul_mv = function(m,v) { return { x: m.xx * v.x + m.xy * v.y + m.xo, y: m.yx * v.x + m.yy * v.y + m.yo } }

	var mul_mm = function(a,b) { return { 
			xx: a.xx * b.xx + a.xy * b.yx,
			xy: a.xx * b.xy + a.xy * b.yy,
			xo: a.xx * b.xo + a.xy * b.yo + a.xo,
			yx: a.yx * b.xx + a.yy * b.yx,
			yy: a.yx * b.xy + a.yy * b.yy,
			yo: a.yx * b.xo + a.yy * b.yo + a.yo } };
	var add_vv = function(a,b) { return { x: a.x + b.x, y: a.y + b.y } }

	var trans_m = function(v) { return {xx: 1, xy: 0, xo: v.x, yx: 0, yy: 1, yo: v.y} }
	var scale_m = function(v) { return {xx: v.x, xy: 0, xo: 0, yx: 0, yy: v.y, yo: 0} }

	// evil global state
	var g = {
		context : undefined,
		m : identity_m,
		s : []
	}

	var lib = 
	{
		forward : function(l) {
			var s = mul_mv(g.m, {x:0, y:0});
			lib.move(0, l);
			var e = mul_mv(g.m, {x:0, y:0});
			g.context.path('M' + s.x + ',' + s.y + 'L' + e.x + ',' + e.y);
		},
		right : function(d) { lib.rot(Math.PI * d / 180.) },
		left :  function(d) { lib.rot(Math.PI * -d / 180.) },
		rot : function(r) {
			var cosr = Math.cos(r);
			var sinr = Math.sin(r);
			g.m = mul_mm(g.m, {xx: cosr, xy: -sinr, xo: 0, yx: sinr, yy: cosr, yo: 0});
		},
		move : function(x, y) {
			g.m = mul_mm(g.m, trans_m({x:x, y:y}));
		},
		scale : function(s) {
			g.m = mul_mm(g.m, scale_m({x:s, y:s}));
		},
		scaleXY : function(x, y) {
			g.m = mul_mm(g.m, scale_m({x:x, y:y}));
		},
		push : function(x, y) {
			g.s = cons(g.m, g.s);
		},
		pop : function(x, y) {
			g.m = pop_front(g.s);
		},
		PI : Math.PI,
	}

	return {
		init : function(c) {g.context = c, g.m = identity_m},
		lib : lib,
	};

})();
