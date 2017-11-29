const Datastore = require('mongodb').MongoClient;
const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const init = require('./src/init.js');

Datastore.connect('mongodb://localhost:27017/myproject', function(err, db){
	let collection = db.collection('mycollection');
	init(collection, new Discordbot(), new Cleverbot(), config);
	db.close();
});