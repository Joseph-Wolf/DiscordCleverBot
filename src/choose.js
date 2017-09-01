"use strict";

const getRandomInt = require('./util/getRandomInt.js');

module.exports = function(message) {
	let listOfObjects = message.split(/[,]|[\s]or[\s]/);
	let chosenIndex = getRandomInt(0, listOfObjects.length);
	return listOfObjects[chosenIndex].trim();
}