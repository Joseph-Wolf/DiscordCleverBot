"use strict";

const getFact = require('../util/getFact.js');

module.exports = function(err, params, callback){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined) {
		return callback("You don't need facts.");
	}
	let text = params.text;
	
	let trimmedContent = text.split(/fact[s]? about/i)[1].trim();
	getFact(trimmedContent, function(err, response){
		if(err){
			return callback("I have failed to get a fact for you.");
		}
		return callback(null, response);
	});
}