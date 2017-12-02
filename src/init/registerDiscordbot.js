"use strict";

module.exports = function registerDiscord(client, callback){
	client.login(process.env.DiscordToken).then(() => {
		return callback(null, client);
	}).catch(err => {
		console.error(err);
		return callback('rejected Discord key');
	});
}