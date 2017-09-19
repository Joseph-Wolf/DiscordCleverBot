"use strict";

const assert = require('assert');
const cleverbot = require('../src/cleverbot.js');
const cleverbotAskMessage = require('../src/messages/cleverbotAsk.js');

describe('cleverbot', function(){
	describe('constructor', function(){
		it('should exist', function(){
			let bot = new cleverbot();
			assert.ok(bot);
		});
	});
	describe('Message', function(){
		describe('Ask', function(){
			it('should return sanatize error message', function(done){
			cleverbotAskMessage(true, null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
			});
			it('should return error message for null text', function(done){
				cleverbotAskMessage(null, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return a reply', function(done){
				let message = 'Please choose x, y, or z.';
				let bot = new cleverbot();
				cleverbotAskMessage(null, {text: message, cleverbot: bot}, done)
			});
		});
		describe('Login', function(){
			it('should return sanatize error message', function(done){
			cleverbotAskMessage(true, null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
			});
			it('should return error message for null text', function(done){
				cleverbotAskMessage(null, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return a reply', function(done){
				let message = 'Please choose x, y, or z.';
				let bot = new cleverbot();
				cleverbotAskMessage(null, {text: message, cleverbot: bot}, done)
			});
		});
	});
});