"use strict";

module.exports = function(discord){
	discord.registerMessage(/(auth|login).+?cleverbot/i, function(err, message){
		if(err){
			return message.reply(err);
		}
		let user = message.cleanContent.split(/:/)[0].match(/[\S]+$/)[0];
		let token = message.cleanContent.split(/:/)[1].match(/^[\S]+/)[0];
		cleverbot.authenticate(user, token, function(err, accepted){
			if(success){
				let data = keys.CleverbotKey;
				data.user = accepted.user;
				data.value = accepted.key;
				settingsDb.set(data);
				message.reply('Success!!');
			} else {
				message.reply('Failed to authenticate with provided credentials.\n(auth|login) cleverbot {user}:{token}');
			}
		});
		message.delete().catch(message.reply('I can not delete the message your credentials.\nPlease grant permission or manually remove them for security.'));
	});
}