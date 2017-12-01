"use strict";

const randomItem = require('random-item');

module.exports = function(err, params, callback){
	if(err){
		return callback("I don't have a coin");
	}
	return callback(null, randomItem(['Heads...', 'Tails...']));
}