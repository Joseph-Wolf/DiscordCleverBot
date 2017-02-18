const Discord = require('discord.js');
const CronJob = require('cron').CronJob;
const Cleverbot = require('cleverbot');
const http = require('http');
const config = require('./config.json');
const privateConfig = require('./private.json');
const client = new Discord.Client();

let clev = new Cleverbot({
  key: privateConfig.CleverbotKey // Can be obtained at http://cleverbot.com/api 
});

client.on('ready', () => { //display message to the console when up and running
	console.log('I am ready!');
});

client.on('message', message => { //Handle messages directed to bot
	let content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
	let authorIsNotBot = message.author.id !== client.user.id; //is the author the bot? don't want infinite loops
	let botIsMentioned = message.mentions.users.has(client.user.id); //is the bot mentioned?
	if (authorIsNotBot && botIsMentioned) { //send cleaned message to cleverbot
		if(/show me/i.test(content)) {
			showMe(message);
		} else if(/choose/i.test(content)) {
			choose(message);
		} else if(/flip a coin/i.test(content)) {
			coinFlip(message)
		} else if(/fact[s]? about/i.test(content)) {
			getFact(message);
		} else {
			askCleverbot(message);
		}
	}
});

client.on('guildMemberAdd', m =>  m.guild.defaultChannel.sendMessage(`Welcome to ${m.guild.name} ${m.user.username}!!!`)); //Message to display when adding a member

let conversationToken;
function askCleverbot(message){
	if(conversationToken) {
		clev.query(message.cleanContent.trim(), {
			cs: conversationToken
		})
		.then(function (response) {
			conversationToken = response.cs;
			if(response.output === undefined) { 
				message.reply('what do you mean?');
			} else {
				message.reply(response.output);
			}
		});
	} else {
		clev.query(message.cleanContent.trim())
		.then(function (response) {
			conversationToken = response.cs;
			if(response.output === undefined) { 
				message.reply('what do you mean?');
			} else {
				message.reply(response.output);
			}
		});
	}
	
}

function choose(message) {
	let listOfObjects = message.cleanContent.split(/choose/i)[1].split(/(\,)|( or )/);
	let numberOfObjectsToChooseFrom = listOfObjects.length;
	message.reply('I choose ' + listOfObjects[getRandomInt(0, numberOfObjectsToChooseFrom)]);
}

function showMe(message) {
	let desiredCategory = message.cleanContent.split(/show me/i)[1].trim()
	let randomSizes = [240, 250, 300, 350, 400, 450, 500, 550, 600];
	let availableCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature', 'dogs'];
	let width = randomSizes[getRandomInt(0, randomSizes.length)];
	let height = randomSizes[getRandomInt(0, randomSizes.length)];
	let urlParts = [width, height, desiredCategory];

	if(availableCategories.includes(desiredCategory.toLowerCase())) {
		message.reply('http://loremflickr.com/' + urlParts.join('/'));
	} else {
		message.reply('No. I only have pictures of ' + availableCategories.join(', '));
	}
}

function coinFlip(message) {
	if(getRandomIntInclusive(0,1)) {
		message.reply('heads...');
	} else {
		message.reply('tails...');
	}
}

function getFact(message) { 
	let subject = message.cleanContent.split(/fact[s]? about/i)[1].trim();
	let number = parseInt(subject.match(/[\d]+/));
	let url;
	let callback = function(data) {
		message.reply(data);
	}
	if (!Number.isInteger(number)) {
		number = 'random'
	}
	try {
		if(/cat/i.test(subject)) {
			url = 'http://catfacts-api.appspot.com/api/facts';
			callback = function(data) {
				try { 
					return message.reply(JSON.parse(data).facts[0]);
				} catch (e) {
					console.log(e.message);
				}
			}
		} else if (/year/i.test(subject)) {
			url = 'http://numbersapi.com/' + number + '/year';
		} else if (/date/i.test(subject)) {
			let numberTwo = parseInt(subject.match(/[\d]+/g)[1]);
			url = 'http://numbersapi.com/';
			if(number === 'random' || numberTwo === undefined || number > 12 || numberTwo > 32) { //try to make sure the date is simi accurate
				url = url + 'random';
			} else {
				url = url + number + '/' + numberTwo;
			}
			url = url + '/date';
		} else if (/trivia/i.test(subject)) {
			url = 'http://numbersapi.com/' + number + '/trivia';
		} else if (/number/i.test(subject)) {
			url = 'http://numbersapi.com/' + number + '/math';
		} else {
			message.reply('I have facts about cats, years, dates (month/day), numbers, and number trivia.');
			return;
		}
		getFromURL(url, callback);
	} catch (e) {
		console.log(e.message);
		message.reply('I encountered an error getting a fact for you.');
	}
}

function getFromURL(url, callback) {
	http.get(url, (res) => {
		const statusCode = res.statusCode;

		let error;
		if (statusCode !== 200) {
			error = new Error(`Request Failed.\n` + `Status Code: ${statusCode}`);
		}
		if (error) {
			console.log(error.message);
	    // consume response data to free up memory
	    res.resume();
	    return;
		}

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => rawData += chunk);
		res.on('end', () => {
			callback(rawData);
			return;
		});
	}).on('error', (e) => {
		console.log(`Got error: ${e.message}`);
	});
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

new CronJob({ //A job that changes the game the bot is playing periodically
	cronTime: `*/${config.BotIsPlaying.TicksPerMinute} * * * *`,
	onTick: function changeGame() {
		let listSize = config.BotIsPlaying.Options.length;
		client.user.setGame(config.BotIsPlaying.Options[getRandomInt(0, listSize)]);
	},
	start: config.BotIsPlaying.StartOnLoad
});

//Login and start the bot
client.login(privateConfig.DiscordKey);