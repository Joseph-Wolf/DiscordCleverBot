"use strict";

const http = require('http');

module.exports = function(url, callback) {
	http.get(url, (res) => {
		const statusCode = res.statusCode;

		let error;
		if (statusCode !== 200) {
			error = new Error(`Request Failed.\n` + `Status Code: ${statusCode}`);
		}
		if (error) {
			console.log(error.message);
	    // consume response data to free up memory
	    res.resume();
	    return;
		}

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => rawData += chunk);
		res.on('end', () => {
			callback(rawData);
			return;
		});
	}).on('error', (e) => {
		console.log(`Got error: ${e.message}`);
	});
}