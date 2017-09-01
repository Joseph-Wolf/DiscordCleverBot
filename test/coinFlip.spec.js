"use strict";

const assert = require('assert');
const coinFlip = require('../src/coinFlip.js');
const coinFaceOptions = ['heads', 'tails'];
const numberOfTrials = 10;

describe('coinFlip', function(){
	it('should choose either heads or tails', function(){
		let index = 0;
		for(index = 0; index < numberOfTrials; index++){
			assert.ok(coinFaceOptions.indexOf(coinFlip()) != -1);
		}
	});
});