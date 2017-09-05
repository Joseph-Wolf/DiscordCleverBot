"use strict";

const request  =require('request');

module.exports = function(url, callback) {
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			callback(body);
		} else {
			console.log(error);
		}
	});
}