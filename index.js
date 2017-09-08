const discord = require('./src/discordbot.js');
const cleverbot = require('./src/cleverbot.js');
const config = require('./config.json');
const Settings = require('./src/db/settings.js');
const Users = require('./src/db/users.js');
const BotIsPlaying = require('./src/botIsPlaying.js');
const settingsDb = new Settings('data/settings');
const usersDb = new Users('data/users');
const action = {
	choose: require('./src/choose.js'),
	coinFlip: require('./src/coinFlip.js'),
	getFact: require('./src/getFact.js'),
	showMe: require('./src/showMe.js')
}
const keys = {
	DiscordKey: {name: 'DiscordKey'},
	CleverbotKey: {name: 'CleverbotKey'},
	CurrencyName: {name: 'CurrencyName'}
}
//TODO: get/set this value
var CurrencyName = 'onion';

//Register commands with the discord bot
discord.registerMessage(/show me/i, function(err, message){
	if(!err){
		let trimmedContent = message.cleanContent.split(/show me/i)[1].trim();
		let response = action.showMe(trimmedContent, function(err, image){
			if(err){
				return message.reply(err);
			}
			return message.reply(image);
		});
	}
});
discord.registerMessage(/choose/i, function(err, message){
	if(!err){
		let trimmedContent = message.cleanContent.split(/choose/i)[1].trim();
		let response = action.choose(trimmedContent);
		message.reply('I choose ' + response);
	}
});
discord.registerMessage(/flip a coin/i, function(err, message){
	if(!err){
		let response = action.coinFlip();
		message.reply(response + '...');
	}
});
discord.registerMessage(/fact[s]? about/i, function(err, message){
	if(!err){
		let trimmedContent = message.cleanContent.split(/fact[s]? about/i)[1].trim();
		action.getFact(trimmedContent, function(response){
			message.reply(response);
		});
	}
});
discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(to)','i'), function(err, message){
	if(!err){
		let amount = parseInt(message.cleanContent.match(/[\d]+/));
		let user = message.mentions.users[0];
		usersDb.addCurrency(amount, user);
		message.reply('I gave ' + amount + ' to ' + user);
	}
});
discord.registerMessage(new RegExp('[\\d]+[\\s]+' + CurrencyName + '[s]?[\\s]+(from)', 'i'), function(err, message){
	if(!err){
		let amount = parseInt(message.cleanContent.match(/[\d]+/));
		let user = message.mentions.users[0];
		usersDb.subtractCurrency(amount, user);
		message.reply('I took ' + amount + ' to ' + user);
	}
});
discord.registerMessage(/(auth|login).+?cleverbot/i, function(err, message){
	if(!err){
		let user = message.cleanContent.split(/:/)[0].match(/[\S]+$/)[0];
		let token = message.cleanContent.split(/:/)[1].match(/^[\S]+/)[0];
		cleverbot.authenticate(user, token, function(success, acceptedUser, acceptedKey){
			if(success){
				let data = keys.CleverbotKey;
				data.user = acceptedUser;
				data.value = acceptedKey;
				settingsDb.set(data);
				message.reply('Success!!');
			} else {
				message.reply('Failed to authenticate with provided credentials.\n(auth|login) cleverbot {user}:{token}')
			}
		});
		message.delete().catch(message.reply('I can not delete the message your credentials.\nPlease grant permission or manually remove them for security.'));
	}
});
//Match all other cases to cleverbot
discord.registerMessage(/./i, function(err, message){
	if(!err){
		cleverbot.ask(message); //need to call it directly due to scoping
	}
});

//Start Discord
settingsDb.get(keys.DiscordKey, function(err, doc){
	if(err || doc === null) {
		doc = {value: null};
	}
	discord.authenticate(doc.value, function(acceptedKey){
		let data = keys.DiscordKey;
		data.value = acceptedKey;
		settingsDb.set(data);

		//Start Cleverbot
		settingsDb.get(keys.CleverbotKey, function(err, doc){
			if(err || doc === null) {
				doc = {user: null, value: null};
			}
			cleverbot.authenticate(doc.user, doc.value, function(err, accepted){
				if(!err){
					let data = keys.CleverbotKey;
					data.user = accepted.user;
					data.value = accepted.key;
					settingsDb.set(data);
				}
			});
		});

		discord.welcomeUsers(false);

		//Register new bot is playing
		new CronJob({ //A job that changes the game the bot is playing periodically
			cronTime: `*/${config.BotIsPlaying.TicksPerMinute} * * * *`,
			onTick: function(){
				callback.user.setGame(action.choose(config.BotIsPlaying.Options));
			},
			start: config.BotIsPlaying.StartOnLoad
		});
	});
});