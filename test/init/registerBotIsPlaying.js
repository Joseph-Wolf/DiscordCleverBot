"use strict";

const assert = require('assert');
const CronJob = require('cron').CronJob;
const registerBotIsPlaying = require('../../src/init/registerBotIsPlaying.js');

describe('registerBotIsPlaying', function(){
	it('should accept a discord and config parameters', function(done){
		let job = null;
		let config = {cronTime: '* * * * *', start: true, options: ['one', 'two', 'three']};
		let discord = { 
			client: {
				user: {
					setGame: function(string){
						console.log('jobrun');
						done();
					}
				}
			}
		};
		job = registerBotIsPlaying(discord, config);
		assert.ok(job.running);
		done();
	});
	/*
	it('should return a CronJob to be started', function(){

	});
*/
});