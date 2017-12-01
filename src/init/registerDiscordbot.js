"use strict";

module.exports = function (discord, callback){
	return discord.client.login(process.env.DiscordToken).then(() => {
		return callback();
	}).catch(err => {
		return callback('rejected Discord key');
	});
}
