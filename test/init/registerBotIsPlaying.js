"use strict";

const assert = require('assert');
const sinon = require('sinon')
const registerBotIsPlaying = require('../../src/init/registerBotIsPlaying.js');

describe('registerBotIsPlaying', function(){
	it('should require a client', function(done){
		let config = {cronTime: '* * * * * *', start: false, options: ['one', 'two', 'three']};
		registerBotIsPlaying(null, config, function(err){
			if(err){
				return done();
			}
			return done('Did not require a config');
		});
	});
	it('should require a user', function(done){
		let config = {cronTime: '* * * * * *', start: false, options: ['one', 'two', 'three']};
		let client = {};
		registerBotIsPlaying(client, config, function(err){
			if(err){
				return done();
			}
			return done('Did not require a user');
		});
	});
	it('should require a setGame', function(done){
		let config = {cronTime: '* * * * * *', start: false, options: ['one', 'two', 'three']};
		let client = { 
			user: {}
		};
		registerBotIsPlaying(client, config, function(err){
			if(err){
				return done();
			}
			return done('Did not require a setGame');
		});
	});
	it('should require a cronTime', function(done){
		let config = {start: false, options: ['one', 'two', 'three']};
		let client = { 
			user: {
				setGame: function(string){
					assert.ok(config.options.indexOf(string) !== -1);
				}
			}
		};
		registerBotIsPlaying(client, config, function(err){
			if(err){
				return done();
			}
			return done('Did not require a cronTime');
		});
	});
	it('should require a start', function(done){
		let config = {cronTime: '* * * * * *', options: ['one', 'two', 'three']};
		let client = { 
			user: {
				setGame: function(string){
					assert.ok(config.options.indexOf(string) !== -1);
				}
			}
		};
		registerBotIsPlaying(client, config, function(err){
			if(err){
				return done();
			}
			return done('Did not require a start');
		});
	});
	it('should require a options', function(done){
		let config = {cronTime: '* * * * * *', start: false};
		let client = { 
			user: {
				setGame: function(string){
					assert.ok(config.options.indexOf(string) !== -1);
				}
			}
		};
		registerBotIsPlaying(client, config, function(err){
			if(err){
				return done();
			}
			return done('Did not require a options');
		});
	});
	it('should not run if start is set to false', function(){
		let config = {cronTime: '* * * * * *', start: false, options: ['one', 'two', 'three']};
		let client = { 
			user: {
				setGame: function(string){
					assert.ok(config.options.indexOf(string) !== -1);
				}
			}
		};
		let clock = sinon.useFakeTimers();
		let job = registerBotIsPlaying(client, config);
		clock.tick(5000);
		assert.ok(!job.running);
		job.stop();
		clock.restore();
	});
	it('should accept a discord and config parameters', function(){
		let clock = sinon.useFakeTimers();
		let config = {cronTime: '* * * * * *', start: true, options: ['one', 'two', 'three']};
		let client = { 
			user: {
				setGame: function(string){
					assert.ok(config.options.indexOf(string) !== -1);
				}
			}
		};
		let job = registerBotIsPlaying(client, config);
		clock.tick(5000);
		assert.ok(job.running);
		job.stop();
		clock.restore();
	});
});