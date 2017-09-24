"use strict";

module.exports = function(min, max) {
	if(!Number.isInteger(min) || !Number.isInteger(max)){
		throw new Error('getRandomInt requires numeric parameters.');
	}
	if(min < max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else if(min > max) {
		min = Math.floor(min);
		max = Math.ceil(max);
		return Math.floor(Math.random() * (min - max + 1)) + max;
	} else {
		return max;
	}
}