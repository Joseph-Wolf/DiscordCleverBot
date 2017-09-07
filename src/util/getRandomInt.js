"use strict";

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function(min, max) {
	if(!isNumeric(min) || !isNumeric(max)){
		throw new Error('getRandomInt requires numeric parameters.');
	}
	if(min < max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	} else if(min > max) {
		min = Math.floor(min);
		max = Math.ceil(max);
		return Math.floor(Math.random() * (min - max)) + max;
	} else {
		return max;
	}
}