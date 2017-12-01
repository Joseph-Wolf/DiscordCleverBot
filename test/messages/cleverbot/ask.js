"use strict";

const assert = require('assert');
const cleverbot = require('../../../src/cleverbot.js');
const cleverbotAskMessage = require('../../../src/messages/cleverbot/ask.js');

describe('Message', function(){
	describe('Ask', function(){
		it('should return sanatize error message', function(done){
		return cleverbotAskMessage(true, null, function(err, reply){
			if(err){
				return done();
			}
			return done('Did not reuturn error.');
		});
		});
		it('should return error message for null text', function(done){
			return cleverbotAskMessage(null, null, function(err, reply){
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
			return cleverbotAskMessage(null, {text: message, cleverbot: bot}, done);
		});
	});
});