"use strict";

const request  =require('request');

module.exports = function(url, callback) {
	request({
		url: url,
		json: true
	}, function (err, response, body) {
		if(err){
			console.error(err);
			return callback(err);
		}
		if(response.statusCode === 200){
			return callback(null, body);
		}
		console.error('StatusCode: ' + response.statusCode);
		return callback('StatusCode: ' + response.statusCode);
	});
}