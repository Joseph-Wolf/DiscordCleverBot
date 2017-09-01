"use strict";

const assert = require('assert');
const getRandomString = require('../src/util/getRandomString.js');
const numberOfTrials = 10;

describe('GetRandomString', function(){
	it('should return a string', function(){
		let newString = getRandomString();
		assert.ok(typeof newString === 'string');
	});
	it('should return a unique string each time', function(){
		let stringArray = [];
		let index = 0;
		for(index = 0; index < numberOfTrials; index++){
			let newString = getRandomString();
			if(stringArray.indexOf(newString) !== -1){
				assert.fail(newString, stringArray);
			}
			stringArray.push(newString);
		}
	});
})