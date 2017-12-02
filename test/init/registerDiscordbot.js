"use strict";

const assert = require('assert');
const registerDiscord = require('../../src/init/registerDiscordbot.js');

describe('registerDiscord', function(done){
	it('should return success with valid credentials', function(done){
		registerDiscord({login: function(){
			return new Promise((resolve, reject) => {
				resolve();
			});
		}}, done);
	});
	it('should return failure with invalid credentials', function(done){
		registerDiscord({login: function(){
			return new Promise((resolve, reject) => {
				reject();
			});
		}}, function(err){
			if(err){
				return done();
			}
			return done('Did not throw error for invalid credentials');
		});
	});
});