"use strict";

const assert = require('assert');
const data = require('nedb');
const testUtils = require('../../testUtils.js');
const getRandomString = require('../../../src/util/getRandomString.js');
const currencyBallanceMessage = require('../../../src/messages/currency/ballance.js');

let db = null;

describe('Currency', function(){
	before(function (done) {
		let dbFilename = testUtils.generateDataFilePath();
		db = new data({filename: dbFilename, autoload: true, onload: done});
	});
	describe('Message', function(){
		describe('Ballance', function(){
			it('should return sanatize error message', function(done){
				currencyBallanceMessage(true, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				currencyBallanceMessage(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return an error is the user does not exist', function(done){
				let userId = getRandomString();
				let startingAmount = 55;
				let user = {discordId: userId, name: userId, money: startingAmount};
				let message = 'Please check the ballance of ' + user.name;
				currencyBallanceMessage(null, function(err){
					if(err){
						return done();
					}
					return done('Returned ballance of non existant user');
				}, {text: message, db: db, user: user});
			});
			it('should return a ballance from the database', function(done){
				let userId = getRandomString();
				let startingAmount = 55;
				let user = {discordId: userId, name: userId, money: startingAmount};
				let message = 'Please check the ballance of ' + user.name;
				db.insert(user, function(err, doc){
					if(err){
						return done(err);
					}
					currencyBallanceMessage(null, function(err, reply){
						if(err){
							return done(err);
						}
						assert.equal(doc.name + ' has a ballance of ' + doc.money, reply);
						return done();
					}, {text: message, db: db, user: user});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});