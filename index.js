const CronJob = require('cron').CronJob;
const DiscordClass = require('./src/discordbot.js');
const CleverbotClass = require('./src/cleverbot.js');
const getConsoleInput = require('./src/util/getConsoleInput.js');
const config = require('./config.json');
const Settings = require('./src/db/settings.js');
const Users = require('./src/db/users.js');
const choose = require('./src/choose.js');

const discord = new DiscordClass();
const cleverbot = new CleverbotClass();
const settingsDb = new Settings('data/settings');
const usersDb = new Users('data/users');

//Register new bot is playing
let BotIsPlaying = new CronJob({ //A job that changes the game the bot is playing periodically
	cronTime: `*/${config.BotIsPlaying.TicksPerMinute} * * * *`,
	onTick: function(){
		discord.client.user.setGame(action.choose(config.BotIsPlaying.Options));
	},
	start: false //Don't start it here
});

//Register commands with the discord bot
require('./src/messages/showMe.js')(discord);
require('./src/messages/choose.js')(discord);
require('./src/messages/coinFlip.js')(discord);
require('./src/messages/facts.js')(discord);
require('./src/messages/cleverbotLogin.js')(discord);

//Welcome Users
settingsDb.get({key: 'WelcomeUsers'}, function(err, doc){
	if(err){
		return;
	}
	if(doc === null){
		return discord.welcomeUsers(false);
	}
	return discord.welcomeUsers(true);
});

//Get Currency
settingsDb.get({key: 'CurrencyName'}, function(err, doc){
	if(err){
		return;
	}
	if(doc === null){ //set default currency if one is not provided
		doc.value = 'onion';
	}
	let CurrencyName = doc.value;
	//Register currency commands
	require('./src/messages/currencyAdd.js')(discord, usersDb, CurrencyName);
	require('./src/messages/currencySubtract.js')(discord, usersDb, CurrencyName);
});

//Register cleverbot
settingsDb.get({key: 'CleverbotToken'}, function(err, doc){
		if(err || doc === null || doc.user === null || doc.value === null) {
			return;
		}
		return cleverbot.authenticate(credentials, function(err, accepted){
			if(err){
				return console.log('rejected cleverbot credentials');
			}
			let data = keys.CleverbotKey;
			data.user = accepted.user;
			data.value = accepted.key;
			settingsDb.set(data);
			return console.log('accepted cleverbot credentials');
		});
	});

//Register Discord
function authenticateDiscordWithKey(key, callback){
	discord.authenticate(key, function(err, accepted){
		if(err){ //Loop until valid credentials are passed
			return getConsoleInput('Discord Bot Key > ', function(answer) {
				return authenticateDiscordWithKey(answer, callback); //Loop until valid
			});
		}
		return callback(null, accepted);
	});
}
settingsDb.get({key: 'DiscordToken'}, function(err, doc){
	if(err || doc === null) {
		doc = {value: null};
	}
	return authenticateDiscordWithKey(doc.value, function(err, key){
		if(err){
			return console.log('rejected Discord key');
		}
		let data = keys.DiscordKey;
		data.value = key;
		settingsDb.set(data);
		if(config.BotIsPlaying.StartOnLoad){
			BotIsPlaying.start();
		}
		//Match all other cases to cleverbot
		require('./src/messages/cleverbotAsk.js')(discord);
		return console.log('accepted Discord key');
	});
});