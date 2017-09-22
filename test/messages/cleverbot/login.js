"use strict";

const assert = require('assert');
const cleverbot = require('../../../src/cleverbot.js');
const cleverbotLoginMessage = require('../../../src/messages/cleverbot/login.js');

describe('Message', function(){
	describe('Login', function(){
		it('should return sanatize error message', function(done){
		cleverbotLoginMessage(true, function(err, reply){
			if(err){
				return done();
			}
			return done('Did not reuturn error.');
		});
		});
		it('should return error message for null text', function(done){
			cleverbotLoginMessage(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
		});
		it('should return a reply', function(done){
			let message = 'Please choose x, y, or z.';
			let bot = new cleverbot();
			cleverbotLoginMessage(null, done, {text: message, cleverbot: bot})
		});
	});
});