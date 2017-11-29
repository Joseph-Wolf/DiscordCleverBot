"use strict";

const assert = require('assert');
const coinFlipMessage = require('../../src/messages/coinFlip.js');
const numberOfTrials = 10;


describe('coinFlip', function(){
	describe('Message', function(){
		it('should return a reply', function(done){
			coinFlipMessage(null, function(err, reply){
				if(err){
					return done(err);
				}
				assert.ok(reply.indexOf('Heads') >= 0 || reply.indexOf('Tails') >= 0);
				return done();
			});
		});
	});
});