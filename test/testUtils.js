"use strict";

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const randomString = require('random-string');

let server = null;

module.exports = {
	dbBefore: function(callback){
		return MongoClient.connect(process.env.DBURL, function(err, db){
			if(err){
				console.error(err);
			}
			server = db;
			return callback(null);
		});
	},
	dbAfter: function(callback){
		if(server === null || server === undefined){
			return callback('Call dbBefore first!');
		}
		return server.dropDatabase(function(err){
			if(err){
				return callback(err);
			}
			return server.close(callback);
		});
	},
	dbExecute: function(callback){
		if(server === null || server === undefined){
			return callback('Call dbBefore first!');
		}
		return server.collection(randomString(), callback);
	}
};