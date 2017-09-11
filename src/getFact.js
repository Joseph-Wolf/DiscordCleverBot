"use strict";

const getFromURL = require('./util/getFromURL.js');

module.exports = function(subject, callback) { 
	let number = parseInt(subject.match(/[\d]+/));
	let url;
	let reply = callback;
	if (!Number.isInteger(number)) {
		number = 'random'
	}
	try {
		if(/cat/i.test(subject)) {
			url = 'https://catfact.ninja/fact';
			reply = function(err, data) {
				if(err){
					return callback(err);
				} else if(data){
					return callback(null, data.fact);
				}
				return callback('Reply was not in the expected format.');
			}
		} else if (/year/i.test(subject)) {
			url = 'http://numbersapi.com/' + number + '/year';
		} else if (/date/i.test(subject)) {
			let matches = subject.match(/[\d]+/g);
			let numberTwo;
			if(matches !== null && matches.length >= 2){
				numberTwo = parseInt(matches[1]);
			}
			url = 'http://numbersapi.com/';
			if(number === 'random' || numberTwo === undefined || number > 12 || numberTwo > 32) { //try to make sure the date is simi accurate
				url = url + 'random';
			} else {
				url = url + number + '/' + numberTwo;
			}
			url = url + '/date';
		} else if (/trivia/i.test(subject)) {
			url = 'http://numbersapi.com/' + number + '/trivia';
		} else if (/number/i.test(subject)) {
			url = 'http://numbersapi.com/' + number + '/math';
		} else {
			return callback(null, 'I have facts about cats, years, dates (month/day), numbers, and number trivia.');
		}
		getFromURL(url, reply);
	} catch (e) {
		console.log(e.message);
		return callback('I encountered an error getting the fact for you.');
	}
}