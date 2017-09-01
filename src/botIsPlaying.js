"use strict";

const CronJob = require('cron').CronJob;
const getRandomInt = require('./util/getRandomInt.js');

module.exports = class BotIsPlaying{
	constructor(intervalInMinutes, startOnLoad, playingOptions, callback){
		let self = this;
		self.options = playingOptions;
		self.playing = 
		self.job = new CronJob({ //A job that changes the game the bot is playing periodically
			cronTime: `*/${intervalInMinutes} * * * *`,
			onTick: function(){
				callback.user.setGame(self.pickOption());
			},
			start: startOnLoad
		});
	}
	pickOption(){
		let self = this;
		return self.options[getRandomInt(0, self.options.length)];
	}
}