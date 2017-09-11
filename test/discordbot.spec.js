"use strict";

const assert = require('assert');
const discordbot = require('../src/discordbot.js');

describe('discordbot', function(){
	describe('constructor', function(){
		it('should exist', function(){
			assert.ok(discordbot);
		});
		it('should create a client', function(){
			assert.ok(discordbot.client);
		});
		it('should initialize messageRegistrations', function(){
			assert.ok(discordbot.messageRegistrations);
			assert.ok(discordbot.messageRegistrations.length === 0);
		});	
	});
	/*describe('authenticate', function(){
		it('should reject invalid key', function(){
			discordbot.authenticate('dfjjsj', function(err, done){
				if(err){
					return done();
				}
				done('Did not throw exception.');
			});
		});
	});*/
	describe('registerMessage', function(){
		it('should add messages', function(){
			let initialLength = discordbot.messageRegistrations.length;
			discordbot.registerMessage(/expression/, null);
			let secondaryLength = discordbot.messageRegistrations.length;
			assert.equal(initialLength + 1, secondaryLength);
		});
		/*it('should execute callback on expression match', function(done){
			discordbot.registerMessage(/blah/, null);
			discordbot.registerMessage(/hello/, done);
			//TODO: execute the hello message
		});*/
	});
	/*describe('welcomeUser', function(){
		it('should register the welcome message if true', function(){

		});
		it('should not register the welcome message if false', function(){

		});
	});*/
});