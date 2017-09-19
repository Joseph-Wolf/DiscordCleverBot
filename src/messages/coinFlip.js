"use strict";

const coinFlip = require('../util/coinFlip.js');

module.exports = function(err, params, callback){
	if(err){
		return callback("I don't have a coin");
	}
	if(coinFlip()){
		return callback(null, 'Heads...');
	}
	return callback(null, 'Tails...');
}