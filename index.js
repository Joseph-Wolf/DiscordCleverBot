const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const init = require('./src/init.js');

let DBUrl = 'mongodb://localhost:27017/test';

if(process !== null && process !== undefined && process.env !== null && process.env !== undefined && process.env.MongoURL !== null && process.env.MongoURL !== undefined){
	DBUrl = process.env.MongoURL;
}

MongoClient.connect(DBUrl, function(err, db){
	let collection = db.collection('mycollection');
	init(collection, new Discordbot(), new Cleverbot(), config);
	db.close();
});