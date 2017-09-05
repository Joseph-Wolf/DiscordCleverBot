"use strict";

const getRandomInt = require('./util/getRandomInt.js');

module.exports = function(message) {
	let listOfObjects = message;
	if(typeof listOfObjects === 'string' || listOfObjects instanceof String){
		listOfObjects = listOfObjects.split(/[,]|[\s]or[\s]/);
	}
	let chosenIndex = getRandomInt(0, listOfObjects.length);
	return listOfObjects[chosenIndex].trim();
}