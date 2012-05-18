
var is_str      = function(e)       { return typeof e === 'string' }

var module = {exports : undefined}
importScripts('turtle.js');
var parseM = module.exports

var module = {exports : undefined}
importScripts('eval.js');
var evalM = module.exports
var module = {exports : undefined}

importScripts('libturtle.js');
var libturtleM = module.exports
var module = {exports : undefined}

var context = {
	path : function(p) {
		postMessage( { path : p } );
	}
}

var log = function(/*...*/) {
	postMessage( { log : Array.prototype.map.call(arguments, function(x){return is_str(x) ? x : JSON.stringify(x)}).join(' ')  } );
}

self.onmessage = function(event) {
	
	for(var i in event.data)
	{
		switch (i)
		{
			case 'run':
				self.postMessage( { start : 'running...' } );
				
				libturtleM.init(context);
            
				// center +ve up
				libturtleM.lib.move(300, 300);
				libturtleM.lib.rot(Math.PI);
	
				var opts = {log : log, trace : false};
				opts.env = libturtleM.lib;
				
				//try
				{
					self.postMessage( { done : 
					    evalM.eval(
					        parseM.parse(event.data[i]),
					        opts ) } );
				}
				//catch(e)
				{
					//self.postMessage( { error : e.toString() } )
				}
		}
	}
}
