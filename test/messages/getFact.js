"use strict";

const assert = require('assert');
const getFact = require('../../src/util/getFact.js');
const getFactMessage = require('../../src/messages/getFact.js');

describe('getFact', function(){
	describe('Message', function(){
		it('should return sanatized error', function(done){
			getFactMessage(true, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not return error.');
			});
		});
		it('should return error for null input', function(done){
			getFactMessage(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not return error.');
			});
		});
		it('should return a reply', function(done){
			let message = 'Please get facts about cats';
			getFactMessage(null, done, {text: message});
		});
	});
});