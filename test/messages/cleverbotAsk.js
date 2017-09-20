"use strict";

const assert = require('assert');
const cleverbot = require('../../src/cleverbot.js');
const cleverbotAskMessage = require('../../src/messages/cleverbotAsk.js');

describe('Message', function(){
	describe('Ask', function(){
		it('should return sanatize error message', function(done){
		cleverbotAskMessage(true, function(err, reply){
			if(err){
				return done();
			}
			return done('Did not reuturn error.');
		});
		});
		it('should return error message for null text', function(done){
			cleverbotAskMessage(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
		});
		it('should return a reply', function(done){
			let message = 'Please choose x, y, or z.';
			let bot = new cleverbot();
			cleverbotAskMessage(null, done, {text: message, cleverbot: bot})
		});
	});
});