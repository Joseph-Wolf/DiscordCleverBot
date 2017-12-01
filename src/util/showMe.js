"use strict";

const randomItem = require('random-item');
const validSizes = [240, 250, 300, 350, 400, 450, 500, 550, 600];
const validCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature', 'dogs']

function isValidCategory(category){
	return validCategories.indexOf(category.toLowerCase()) !== -1;
}

module.exports = function(category, callback) {
	if(isValidCategory(category)) {
		let urlParts = [randomItem(validSizes), randomItem(validSizes), category];
		return callback(null, 'http://loremflickr.com/' + urlParts.join('/'));
	}
	return callback('No. I only have pictures of ' + validCategories.join(', '));
}