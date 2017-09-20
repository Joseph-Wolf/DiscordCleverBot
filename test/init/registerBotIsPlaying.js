"use strict";

const assert = require('assert');
const sinon = require('sinon')
const CronJob = require('cron').CronJob;
const registerBotIsPlaying = require('../../src/init/registerBotIsPlaying.js');

describe('registerBotIsPlaying', function(){
	it('should accept a discord and config parameters', function(){
		var clock = sinon.useFakeTimers();
		let config = {cronTime: '* * * * * *', start: true, options: ['one', 'two', 'three']};
		let discord = { 
			client: {
				user: {
					setGame: function(string){
						assert.ok(config.options.indexOf(string) !== -1);
					}
				}
			}
		};
		let job = registerBotIsPlaying(discord, config);

		clock.tick(1000);
		assert.ok(job.running);
		job.stop();
		clock.restore();
	});
});