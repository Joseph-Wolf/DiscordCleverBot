"use strict";

const WelcomeUsersSettingKey = 'WelcomeUsers';

module.exports = function (db, discord){
	db.find({key: WelcomeUsersSettingKey}).limit(1).toArray(function(err, doc){
		if(err){
			return;
		}
		if(doc === null){
			return discord.welcomeUsers(false);
		}
		return discord.welcomeUsers(true);
	});
}