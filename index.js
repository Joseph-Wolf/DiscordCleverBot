require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const init = require('./src/init.js');

if(process !== null && process !== undefined && process.env !== null && process.env !== undefined && process.env.DBURL !== null && process.env.DBURL !== undefined){
	MongoClient.connect(process.env.DBURL, function(err, db){
		init(db.collection('mycollection'), new Discordbot(), new Cleverbot(), config);
	});
}
