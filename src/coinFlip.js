"use strict";

const getRandomIntInclusive = require('./util/getRandomIntInclusive.js');

module.exports = function() {
	return getRandomIntInclusive(0,1);
}