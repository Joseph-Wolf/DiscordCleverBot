"use strict";

const express = require('express');
const app = express();

module.exports = function(callback){
	app.set('port', (process.env.PORT || 5000));
	app.use(express.static(__dirname + '/public'));

	app.get('/', function(request, response) {
		response.send('Hello World!');
	});

	app.listen(app.get('port'), function() {
		return callback(null, 'Node app is running at localhost:' + app.get('port'));
	});
}