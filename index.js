const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const init = require('./src/init.js');

if(process !== null && process !== undefined && process.env !== null && process.env !== undefined && process.env.DBUrl !== null && process.env.DBUrl !== undefined){
	MongoClient.connect(process.env.DBUrl, function(err, db){
	let collection = db.collection('mycollection');
	init(collection, new Discordbot(), new Cleverbot(), config);
	db.close();
});
}
