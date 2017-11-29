"use strict";

const randomItem = require('random-item');
const CronJob = require('cron').CronJob;

function validate(params, callback){
	if(params === null || params === undefined){
		console.error('null or undefined params');
		return callback('Invalid input parameters.');
	}
	if(params.start === null || params.start === undefined){
		console.error('null or undefined start');
		return callback('Invalid input parameters.');
	}
	if(params.cronTime === null || params.cronTime === undefined){
		console.error('null or undefined cronTime');
		return callback('Invalid input parameters.');
	}
	if(params.options === null || params.options === undefined){
		console.error('null or undefined options');
		return callback('Invalid input parameters.');
	}
	return callback(null);
}
//TODO: if values are missing from settingsDB convert them from the config.json
//TODO: read from the settingsDB
module.exports = function (discord, params){
	return validate(params, function(err){
		if(err){
			return console.error(err);
		}
		return new CronJob({ //A job that changes the game the bot is playing periodically
			cronTime: params.cronTime,
			onTick: function(){
				if(discord === null || discord === undefined || discord.client === null || discord.client === undefined || discord.client.user === null || discord.client.user === undefined) {
					return; //Might not yet be initialized
				}
				let game = randomItem(params.options);
				return discord.client.user.setGame(game);
			},
			start: params.start
		});
	});
};