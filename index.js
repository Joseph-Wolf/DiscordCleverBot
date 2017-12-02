const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const init = require('./src/init.js');

require('dotenv').config();

MongoClient.connect(process.env.DBURL, function(err, db){
	init(db.collection('settings'), db.collection('users'), new Discord.Client(), config, function(err, reply){
		if(err){
			throw err;
		}
		return console.log(reply);
	});
});