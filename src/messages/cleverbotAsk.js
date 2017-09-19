"use strict";

module.exports = function(err, params, callback){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined || params.cleverbot === null || params.cleverbot === undefined){
		return callback('Error asking cleverbot');
	}
	let cleverbot = params.cleverbot;
	let text = params.text;
	cleverbot.ask(text, function(err, response){
		if(err){
			return callback(err); //return no reply on errors
		}
		return callback(null, response);
	});
}