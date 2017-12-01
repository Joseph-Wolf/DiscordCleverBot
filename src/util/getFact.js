"use strict";

const catFact = require('cat-facts');
const dogFacts = require('dog-facts');
const request = require('request');

function parseNumbers(text){
	let matches = text.match(/[\d]+/g);
	if(matches === null || matches === undefined){
		return [];
	}
	return matches.map(function(number){return parseInt(number)});
}

function callURL(url, callback){
	if(url === null || url === undefined){
		return;
	}
	return request({url:url}, function(err, response, body){
		if(err){
			console.error(err);
			return callback(err);
		}
		if(response.statusCode === 200){
			return callback(null, body);
		}
		console.error('StatusCode: ' + response.statusCode);
		return callback('StatusCode: ' + response.statusCode);
	});
}

function yearFacts(year, callback){
	if(year === null || year === undefined){
		year = 'random';
	}
	return callURL('http://numbersapi.com/' + year + '/year', callback);
}

function dateFacts(month, day, callback){
	let suffix = month + '/' + day;
	if(month === null || month === undefined || day === null || day === undefined || month > 12 || day > 32){
		suffix = 'random';
	}
	return callURL('http://numbersapi.com/' + suffix + '/date', callback);
}

function triviaFacts(number, callback){
	if(number === null || number === undefined){
		number = 'random';
	}
	return callURL('http://numbersapi.com/' + number + '/trivia', callback);
}

function mathFacts(number, callback){
	if(number === null || number === undefined){
		number = 'random';
	}
	return callURL('http://numbersapi.com/' + number + '/math', callback);
}

module.exports = function(subject, callback) { 
	let numbers = parseNumbers(subject);
	try {
		if(/cat/i.test(subject)) {
			return callback(null, catFact.random());
		} 
		if(/dog/i.test(subject)) {
			return callback(null, dogFacts.random());
		}
		if (/year/i.test(subject)) {
			return yearFacts(numbers[0], callback);
		}
		if (/date/i.test(subject)) {
			return dateFacts(numbers[0], numbers[1], callback);
		}
		if (/trivia/i.test(subject)) {
			return triviaFacts(numbers[0], callback);
		}
		if (/number/i.test(subject)) {
			return mathFacts(numbers[0], callback);
		}
		return callback(null, 'I have facts about cats, dogs, years, dates (month/day), numbers, and number trivia.');
	} catch (e) {
		console.error(e.message);
		return callback('I encountered an error getting the fact for you.');
	}
}