const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const Discordbot = require('./src/discordbot.js');
const Cleverbot = require('./src/cleverbot.js');
const init = require('./src/init.js');

require('dotenv').config();

MongoClient.connect(process.env.DBURL, function(err, db){
	init(db.collection('mycollection'), new Discordbot(), new Cleverbot(), config);
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});