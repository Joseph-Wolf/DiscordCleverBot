"use strict";

function isPositive(value){
	return value > 0;
}
function isInteger(value){
	return value === parseInt(value, 10)
}

module.exports = function(value){
	return isPositive(value) && isInteger(value);
}