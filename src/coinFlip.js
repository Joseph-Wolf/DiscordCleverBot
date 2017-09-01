"use strict";

const getRandomIntInclusive = require('./util/getRandomIntInclusive.js');

module.exports = function(message) {
	if(getRandomIntInclusive(0,1)) {
		message.reply('heads...');
	} else {
		message.reply('tails...');
	}
}