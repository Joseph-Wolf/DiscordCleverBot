"use strict";

const prompt = require('prompt');

module.exports = function(question, callback){
	prompt.start();

	prompt.get(question, function (err, result) {
		if (err) {
			return 1;
		}
		callback(result[question]);
	});
}