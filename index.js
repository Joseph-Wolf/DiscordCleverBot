require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const init = require('./src/init.js');
const app = express()

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
	if(process !== null && process !== undefined && process.env !== null && process.env !== undefined && process.env.DBURL !== null && process.env.DBURL !== undefined){
		MongoClient.connect(process.env.DBURL, function(err, db){
			init(db.collection('mycollection'), new Discordbot(), new Cleverbot(), config);
		});
	}
});