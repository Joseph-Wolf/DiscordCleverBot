"use strict";

const assert = require('assert');
const cleverbot = require('../../../src/cleverbot.js');
const cleverbotLoginMessage = require('../../../src/messages/cleverbot/login.js');

describe('Message', function(){
	describe('Login', function(){
		it('should return sanatize error message', function(done){
		return cleverbotLoginMessage(true, null, function(err, reply){
			if(err){
				return done();
			}
			return done('Did not reuturn error.');
		});
		});
		it('should return error message for null text', function(done){
			return cleverbotLoginMessage(null, null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
		});
		//TODO: fix
		it.skip('should return a reply', function(done){
			let message = 'Please choose x, y, or z.';
			let bot = new cleverbot();
			return cleverbotLoginMessage(null, {text: message, cleverbot: bot}, done);
		});
	});
});