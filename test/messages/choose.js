"use strict";

const assert = require('assert');
const chooseMessage = require('../../src/messages/choose.js');
const optionsList = ['one', 'two', 'three', 'four'];
const numberOfTrials = 10;

describe('Choose', function(){
	describe('Message', function(){
		it('should return sanatize error message', function(done){
			chooseMessage(true, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
		});
		it('should return error message for null text', function(done){
			chooseMessage(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
		});
		it('should return a reply', function(done){
			let message = 'Please choose x, y, or z.';
			chooseMessage(null, done, {text: message})
		});
	});
});