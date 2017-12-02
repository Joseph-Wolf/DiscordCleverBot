const Discord = require('discord.js');
const express = require('express');
const http = require('http');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const init = require('./src/init.js');

require('dotenv').config();

MongoClient.connect(process.env.DBURL, function(err, db){
	init(db.collection('settings'), db.collection('users'), new Discord.Client(), config, function(err, reply){
		if(err){
			throw err;
		}
		if(reply){
			console.log(reply);
		}
		return;
	});
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
	response.send('Hello World!');
});

app.listen(app.get('port'), function() {
	console.log('Node app is running at localhost:' + app.get('port'));
});

if(process.env.APP_URL){
	//Ping the app periodically to keep it from sleeping
	setInterval(function() {
		http.get(process.env.APP_URL);
	}, 300000); // every 5 minutes (300000)
}