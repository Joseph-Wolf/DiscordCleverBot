"use strict";

const getRandomInt = require('./util/getRandomInt.js');

function choose(message) {
	let listOfObjects = message.cleanContent.split(/choose/i)[1].split(/[,]|[\s]or[\s]/);
	let numberOfObjectsToChooseFrom = listOfObjects.length;
	message.reply('I choose ' + listOfObjects[getRandomInt(0, numberOfObjectsToChooseFrom)].trim());
}

module.exports = choose;