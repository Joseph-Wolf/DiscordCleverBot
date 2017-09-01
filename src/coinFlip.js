"use strict";

const getRandomIntInclusive = require('./util/getRandomIntInclusive.js');

module.exports = function() {
	if(getRandomIntInclusive(0,1)) {
		return 'heads';
	} else {
		return 'tails';
	}
}