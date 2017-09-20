"use strict";

const CronJob = require('cron').CronJob;
const choose = require('../util/choose.js');

module.exports = function (discord, config){
	return new CronJob({ //A job that changes the game the bot is playing periodically
		cronTime: `*/${config.BotIsPlaying.TicksPerMinute} * * * *`,
		onTick: function(){
			discord.client.user.setGame(action.choose(config.BotIsPlaying.Options));
		},
		start: false //don't start it here
	});
}