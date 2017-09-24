"use strict";

const assert = require('assert');
const showMe = require('../../src/util/showMe.js');
const showMeMessage = require('../../src/messages/showMe.js');

describe('showMe', function(){
	describe('Message', function(){
		it('should return sanatized error message', function(done){
			showMeMessage(true, function(err){
				if(err){
					return done();
				}
				return done('Did not replicate error');
			});
		});
		it('should return error is text message is null', function(done){
			showMeMessage(null, function(err){
				if(err){
					return done();
				}
				return done('Did not replicate error');
			});
		});
		it('should return error message for invalid subject', function(done){
			showMeMessage(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not provide user with command list');
			}, {text: "show me fkdsflsjk"});
		});
		it('should return a reply', function(done){
			let message = 'Please show me dogs';
			showMeMessage(null, done, {text: message});
		});
	});
});