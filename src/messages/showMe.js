"use strict";

const showMe = require('../util/showMe.js');

module.exports = function(err, params, callback){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined){
		return callback("I can't show you anything");
	}
	let text = params.text;
	
	let trimmedContent = text.split(/show me/i)[1].trim();
	let response = showMe(trimmedContent, function(err, image){
		if(err){
			return callback(err);
		}
		return callback(null, image);
	});
}