"use strict";

const assert = require('assert');
const coinFlip = require('../src/coinFlip.js');
const numberOfTrials = 10;

describe('coinFlip', function(){
	it('should choose either heads or tails', function(){
		let index = 0;
		for(index = 0; index < numberOfTrials; index++){
			let answer = coinFlip();
			assert.ok(answer === 0 || answer === 1);
		}
	});
});