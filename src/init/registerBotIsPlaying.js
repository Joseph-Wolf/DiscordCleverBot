"use strict";

const choose = require('../util/choose.js');
const CronJob = require('cron').CronJob;
//TODO: if values are missing from settingsDB convert them from the config.json
//TODO: read from the settingsDB
module.exports = function (discord, config){
	if(config === null || config === undefined || config.start === null || config.start === undefined || config.cronTime === null || config.cronTime === undefined || config.options === null || config.options === undefined){
		return;
	}
	return new CronJob({ //A job that changes the game the bot is playing periodically
		cronTime: config.cronTime,
		onTick: function(){
			if(discord === null || discord === undefined || discord.client === null || discord.client === undefined || discord.client.user === null || discord.client.user === undefined) {
				return; //Might not yet be initialized
			}
			let game = choose(config.options);
			return discord.client.user.setGame(game);
		},
		start: config.start
	});
};