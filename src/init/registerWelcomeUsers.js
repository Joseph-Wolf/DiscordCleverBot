"use strict";

const WelcomeUsersSettingKey = 'WelcomeUsers';

module.exports = function (db, discord){
	db.find({key: WelcomeUsersSettingKey}).limit(1).toArray(function(err, items){
		if(err || items === null || items === undefined || items[0] === null || items[0] === undefined || !items[0].value){
			return discord.welcomeUsers(false);
		}
		return discord.welcomeUsers(true);
	});
}