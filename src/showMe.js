"use strict";

const getRandomInt = require('./util/getRandomInt.js');

function showMe(message) {
	let desiredCategory = message.cleanContent.split(/show me/i)[1].trim()
	let randomSizes = [240, 250, 300, 350, 400, 450, 500, 550, 600];
	let availableCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature', 'dogs'];
	let width = randomSizes[getRandomInt(0, randomSizes.length)];
	let height = randomSizes[getRandomInt(0, randomSizes.length)];
	let urlParts = [width, height, desiredCategory];

	if(availableCategories.includes(desiredCategory.toLowerCase())) {
		message.reply('http://loremflickr.com/' + urlParts.join('/'));
	} else {
		message.reply('No. I only have pictures of ' + availableCategories.join(', '));
	}
}

module.exports = showMe;