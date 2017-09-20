"use strict";

const choose = require('../util/choose.js');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined){
		return callback("I can't choose!");
	}
	let text = params.text;
	let trimmedContent = text.split(/choose/i)[1].trim();
	let response = choose(trimmedContent);
	return callback(null, 'I choose ' + response);
}