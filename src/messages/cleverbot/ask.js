"use strict";

function validate(params, callback){
	if(params === null || params === undefined){
		console.error('null or undefined params.');
		return callback('Invalid parameters passed to ask function.');
	}
	if(params.text === null || params.text === undefined){
		console.error('null or undefined text.');
		return callback('Invalid parameters passed to ask function.');
	}
	if(params.cleverbot === null || params.cleverbot === undefined){
		console.error('null or undefined cleverbot.');
		return callback('Invalid parameters passed to ask function.');
	}
	return callback(null);
}

module.exports = function(err, callback, params){
	if(err){
		console.log(err);
		return callback('I encountered an error asking cleverbot.');
	}
	return validate(params, function(err){
		if(err){
			return callback(err);
		}
		let cleverbot = params.cleverbot;
		let text = params.text;

		return cleverbot.ask(text, callback);
	});
}