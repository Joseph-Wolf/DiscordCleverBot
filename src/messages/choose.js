"use strict";

const randomItem = require('random-item');

module.exports = function(err, callback, params){
	if(err || params === null || params === undefined || params.text === null || params.text === undefined){
		return callback("I can't choose!");
	}
	let text = params.text;
	let trimmedContent = text.split(/choose/i)[1].trim();
	let listOfObjects = [];
	if(typeof trimmedContent === 'string' || trimmedContent instanceof String){
		listOfObjects = trimmedContent.split(/[,]|[\s]or[\s]/);
	}
	let response = randomItem(listOfObjects);
	return callback(null, 'I choose ' + response);
}