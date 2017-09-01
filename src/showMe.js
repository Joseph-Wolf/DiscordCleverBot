"use strict";

const getRandomInt = require('./util/getRandomInt.js');

module.exports = function(desiredCategory) {
	let randomSizes = [240, 250, 300, 350, 400, 450, 500, 550, 600];
	let availableCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature', 'dogs'];
	let width = randomSizes[getRandomInt(0, randomSizes.length)];
	let height = randomSizes[getRandomInt(0, randomSizes.length)];
	let urlParts = [width, height, desiredCategory];

	if(availableCategories.includes(desiredCategory.toLowerCase())) {
		return 'http://loremflickr.com/' + urlParts.join('/');
	} else {
		return 'No. I only have pictures of ' + availableCategories.join(', ');
	}
}