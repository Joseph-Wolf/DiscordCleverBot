"use strict";

module.exports = function (db, discord, key, message){
	db.find({key: WelcomeUsersSettingKey}).limit(1).toArray(function(err, items){
		if(err){
			console.error(err);
			return discord.client.removeAllListeners('guildMemberAdd');
		}
		if(items === null || items === undefined || items[0] === null || items[0] === undefined || !items[0].value){
			return discord.client.removeAllListeners('guildMemberAdd');
		}
		message = (message || `Welcome to ${guild.name} ${member.username}!!!`);
		return self.client.on('guildMemberAdd', (guild, member) =>  guild.defaultChannel.sendMessage(message)); //Message to display when adding a member
	});
}