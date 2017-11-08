"use strict";

const assert = require('assert');
const data = require('nedb');
const testUtils = require('../../testUtils.js');
const getRandomString = require('../../../src/util/getRandomString.js');
const currencyAddMessage = require('../../../src/messages/currency/add.js');

let db = null;

describe('Currency', function(){
	before(function (done) {
		let dbFilename = testUtils.generateDataFilePath();
		db = new data({filename: dbFilename, autoload: true, onload: done});
	});
	describe('Add', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				currencyAddMessage(true, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				currencyAddMessage(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return a reply', function(done){
				let userId = getRandomString();
				let user = {discordId: userId, name: 'name', money: 0};
				let startingBallance = user.money;
				let amountToAdd = 22;
				let expectedBallance = startingBallance + amountToAdd;
				let message = 'Please give ' + amountToAdd + ' to ' + user.name;
				currencyAddMessage(null, function(err){
					if(err){
						return done(err);
					}
					db.find({name: user.name}).limit(1).exec(function(err, docs){
						if(err){
							return done(err);
						}
						let doc = docs[0];
						assert.equal(expectedBallance, doc.money);
						return done();
					});
				}, {text: message, db: db, users: [user], isAdmin: true});
			});
			it('should add money to existing user', function(done){
				let userId = getRandomString();
				let user = {discordId: userId, name: 'name', money: 0};
				let startingBallance = user.money;
				let amountToAdd = 22;
				let expectedBallance = startingBallance + amountToAdd;
				let message = 'Please give ' + amountToAdd + ' to ' + user.name;
				db.insert(user, function(err, doc){
					if(err){
						return done(err);
					}
					currencyAddMessage(null, function(err){
						if(err){
							return done(err);
						}
						db.find({name: user.name}).limit(1).exec(function(err, docs){
							if(err){
								return done(err);
							}
							let doc = docs[0];
							assert.equal(expectedBallance, doc.money);
							return done();
						});
					}, {text: message, db: db, users: [user], isAdmin: true});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});