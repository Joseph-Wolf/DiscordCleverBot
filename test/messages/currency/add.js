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
				return currencyAddMessage(true, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencyAddMessage(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return a reply', function(done){
				let user = {discordId: getRandomString(), name: getRandomString(), money: 0};
				let startingBallance = user.money;
				let amountToAdd = 22;
				let expectedBallance = startingBallance + amountToAdd;
				let message = 'Please give ' + amountToAdd + ' to ' + user.name;
				return currencyAddMessage(null, function(err){
					if(err){
						return done(err);
					}
					return db.find({name: user.name}).limit(1).exec(function(err, docs){
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
				let startingBallance = 0;
				let amountToAdd = 22;
				let users = [{discordId: getRandomString(), name: getRandomString(), money: startingBallance, expectedBallance: startingBallance + amountToAdd}];
				let message = 'Please give ' + amountToAdd;
				return db.insert(users, function(err, docs){
					if(err){
						return done(err);
					}
					return currencyAddMessage(null, function(err){
						if(err){
							return done(err);
						}
						return db.find({discordId: {$in: docs.map(x => x.discordId)}}).limit(1).exec(function(err, docs){
							if(err){
								return done(err);
							}
							for(let index = 0; index < docs.length; index++){
								let matchedUser = users.filter(x => x.discordId === docs[index].discordId)[0];
								assert.equal(matchedUser.expectedBallance, docs[index].money);
							}
							return done();
						});
					}, {text: message, db: db, users: users, isAdmin: true});
				});
			});
			it('should add money to multiple users', function(done){
				let amountToAdd = 22;
				let users = [{discordId: getRandomString(), name: getRandomString(), money: 0, expectedBallance: amountToAdd}];
				let message = 'Please give ' + amountToAdd;
				return db.insert(users, function(err, docs){
					if(err){
						return done(err);
					}
					//Add a missing user
					users.push({discordId: getRandomString(), name: getRandomString(), money: 0, expectedBallance: amountToAdd});
					return currencyAddMessage(null, function(err){
						if(err){
							return done(err);
						}
						return db.find({discordId: {$in: docs.map(x => x.discordId)}}).exec(function(err, docs){
							if(err){
								return done(err);
							}
							for(let index = 0; index < docs.length; index++){
								let matchedUser = users.filter(x => x.discordId === docs[index].discordId)[0];
								assert.equal(matchedUser.expectedBallance, docs[index].money);
							}
							return done();
						});
					}, {text: message, db: db, users: users, isAdmin: true});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});