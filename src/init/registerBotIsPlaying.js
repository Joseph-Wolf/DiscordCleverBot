"use strict";

const randomItem = require('random-item');
const CronJob = require('cron').CronJob;

function validate(client, params, callback){
	if(client === null || client === undefined){
		console.error('null or undefined client');
		return callback('Invalid input parameters.');
	}
	if(client.user === null || client.user === undefined){
		console.error('null or undefined user');
		return callback('Invalid input parameters.');
	}
	if(client.user.setGame === null || client.user.setGame === undefined){
		console.error('null or undefined setGame');
		return callback('Invalid input parameters.');
	}
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

module.exports = function (client, params, callback){
	return validate(client, params, function(err){
		if(err){
			console.error(err);
			if(callback){
				return callback(err);
			}
			return;
		}
		new CronJob({ //A job that changes the game the bot is playing periodically
			cronTime: params.cronTime,
			onTick: function(){
				return client.user.setGame(randomItem(params.options));
			},
			start: params.start
		});
		if(callback){
			return callback();
		}
		return;
	});
};