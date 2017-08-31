"use strict";

const getRandomIntInclusive = require('./util/getRandomIntInclusive.js');

function coinFlip(message) {
	if(getRandomIntInclusive(0,1)) {
		message.reply('heads...');
	} else {
		message.reply('tails...');
	}
}

module.exports = coinFlip;