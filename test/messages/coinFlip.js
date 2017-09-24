"use strict";

const assert = require('assert');
const coinFlip = require('../../src/util/coinFlip.js');
const coinFlipMessage = require('../../src/messages/coinFlip.js');
const numberOfTrials = 10;

describe('coinFlip', function(){
	describe('Message', function(){
		it('should return a reply', function(done){
			coinFlipMessage(null, done);
		});
	});
});