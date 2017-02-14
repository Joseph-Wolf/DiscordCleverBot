const Discord = require('discord.js');
const CronJob = require('cron').CronJob;
const http = require('http');
const querystring = require('querystring');
const config = require('./config.json');

const client = new Discord.Client();

var cleverbotConversationToken;

client.on('ready', () => { //display message to the console when up and running
	console.log('I am ready!');
});

client.on('message', message => { //Handle messages directed to bot
	var content = message.cleanContent.trim() //trim any excess spaces and make it a happy string
	var authorIsNotBot = message.author.id !== client.user.id; //is the author the bot? don't want infinite loops
	var botIsMentioned = message.mentions.users.has(client.user.id); //is the bot mentioned?
	if (authorIsNotBot && botIsMentioned) { //send cleaned message to cleverbot
		if(/show me/i.test(content)) {
			showMe(message);
		} else if(/choose/i.test(content)) {
			choose(message);
		} else {
			askCleverbot(message);
		}
	}
});

client.on('guildMemberAdd', m =>  m.guild.defaultChannel.sendMessage(`Welcome to ${m.guild.name} ${m.user.username}!!!`)); //Message to display when adding a member

function askCleverbot(message){
	var queryString = {
		key: config.Cleverbot.APIKey,
		input: message.cleanContent.trim(),
		cs: cleverbotConversationToken
	}
	var options = {
		host: 'www.cleverbot.com',
		path: '/getreply?' + querystring.stringify(queryString),
		port: '80',
		method: 'GET'
	}
	http.get(options, (res) => {
		let rawData = '';
		//concatenate large replies that have been split into packets
		res.on('data', (chunk) => rawData += chunk);
		//parse the message on end
		res.on('end', () => {
			try {
				let parsedData = JSON.parse(rawData);
				cleverbotConversationToken = parsedData.conversation_id;
				message.reply(parsedData.output);
			} catch (e) {
				message.reply('I am broken!!?!@`~~##');
				console.log(e.message);
			}
		});
}).on('error', (e) => {
	console.log(`Got error: ${e.message}`);
});
}

function choose(message) {
	var listOfObjects = message.cleanContent.split(/choose/i)[1].split(',');
	var numberOfObjectsToChooseFrom = listOfObjects.length;
	message.reply('I choose ' + listOfObjects[getRandomInt(0, numberOfObjectsToChooseFrom)]);
}

function showMe(message) {
	var desiredCategory = message.cleanContent.split(/show me/i)[1].trim()
	var randomSizes = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
	var availableCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature'];
	var width = randomSizes[getRandomInt(0, randomSizes.length)];
	var height = randomSizes[getRandomInt(0, randomSizes.length)];
	var urlParts = [width, height, desiredCategory];

	if(availableCategories.includes(desiredCategory.toLowerCase())) {
		message.reply('http://lorempixel.com/' + urlParts.join('/'));
	} else {
		message.reply('No. I only have pictures of ' + availableCategories.join(', '));
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

new CronJob({ //A job that changes the game the bot is playing periodically
	cronTime: `*/${config.BotIsPlaying.TicksPerMinute} * * * *`,
	onTick: function changeGame() {
		var listSize = config.BotIsPlaying.Options.length;
		client.user.setGame(config.BotIsPlaying.Options[getRandomInt(0, listSize)]);
	},
	start: config.BotIsPlaying.StartOnLoad
});

//Login and start the bot
client.login(config.Discord.Token);