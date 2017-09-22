"use strict";

const catFact = require('cat-facts');
const getFromURL = require('./getFromURL.js');

module.exports = function(subject, callback) { 
	let number = parseInt(subject.match(/[\d]+/));
	let url = 'http://numbersapi.com/';
	if (!Number.isInteger(number)) {
		number = 'random'
	}
	try {
		if(/cat/i.test(subject)) {
			return callback(null, catFact.random());
		} else if (/year/i.test(subject)) {
			url = url + number + '/year';
		} else if (/date/i.test(subject)) {
			let matches = subject.match(/[\d]+/g);
			let numberTwo;
			if(matches !== null && matches.length >= 2){
				numberTwo = parseInt(matches[1]);
			}
			if(number === 'random' || numberTwo === undefined || number > 12 || numberTwo > 32) { //try to make sure the date is simi accurate
				url = url + 'random';
			} else {
				url = url + number + '/' + numberTwo;
			}
			url = url + '/date';
		} else if (/trivia/i.test(subject)) {
			url = url + number + '/trivia';
		} else if (/number/i.test(subject)) {
			url = url + number + '/math';
		} else {
			return callback(null, 'I have facts about cats, years, dates (month/day), numbers, and number trivia.');
		}
		getFromURL(url, callback);
	} catch (e) {
		console.error(e.message);
		return callback('I encountered an error getting the fact for you.');
	}
}