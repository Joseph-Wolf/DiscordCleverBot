"use strict";

const assert = require('assert');
const getRandomInt = require('../../src/util/getRandomInt.js');
const numberOfTries = 10;

describe('getRandomInt', function(){
	it('should return a number between specified range', function(){
		let max = 10;
		let min = -10;
		let index = 0;
		for(index = 0; index < numberOfTries; index++){
			let number = getRandomInt(min, max);
			assert.ok(min <= number);
			assert.ok(number < max);
			assert.ok(number != max);
		}
	});
	it('should swap the two if max < min', function(){
		let max = 10;
		let min = -10;
		let number = getRandomInt(max, min);
		assert.ok(min <= number);
		assert.ok(number < max);
		assert.ok(number != max);
	});
	it('should return the number if max == min', function(){
		let max = 10;
		let number = getRandomInt(max, max);
		assert.equal(max, number);
	});
	it('should throw an error if parameters are not integers', function(){
		let max = 'fsdfsd';
		let min = 'dsfkjsdfks';
		assert.throws(function(){getRandomInt(max, max)}, Error);
	});
});