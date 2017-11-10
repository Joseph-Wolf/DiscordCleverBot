"use strict";

const assert = require('assert');
const data = require('nedb');
const testUtils = require('../../testUtils.js');
const getRandomString = require('../../../src/util/getRandomString.js');
const currencySubtractMessage = require('../../../src/messages/currency/subtract.js');

let db = null;

describe('Currency', function(){
	before(function (done) {
		let dbFilename = testUtils.generateDataFilePath();
		db = new data({filename: dbFilename, autoload: true, onload: done});
	});
	describe('Subtract', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				return currencySubtractMessage(true, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencySubtractMessage(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencySubtractMessage(null, function(err, reply){
					if(err){
						return currencySubtractMessage(null, function(err, reply){
							if(err){
								return done();
							}
							return done('Did not reuturn error.');
						}, {text: 'hello', users: [], isAdmin: true});
					}
					return done('Did not reuturn error.');
				}, {text: 'hello', users: null, isAdmin: true});
			});
			it('should return error message for non admins', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let users = [{discordId: getRandomString(), name: getRandomString(), money: startingBallance, expectedBallance: startingBallance - amountToTake}];
				let message = 'Please take ' + amountToTake;
				return db.insert(users, function(err, docs){
					if(err){
						return done(err);
					}
					return currencySubtractMessage(null, function(err){
						if(err){
							return done();
						}
						return done('Did not reuturn error.');
					}, {text: message, db: db, users: users, isAdmin: false});
				});
			});
			it('should throw error for insufficient funds', function(done){
				let startingBallance = 54;
				let amountToTake = 55;
				let user = {discordId: getRandomString(), name: getRandomString(), money: startingBallance};
				let message = 'Please take ' + amountToTake;
				return currencySubtractMessage(null, function(err, ballance){
					if(err){
						return done();
					}
					return done('Returned successful despite not having enough funds');
				}, {text: message, db: db, users: [user]});
			});
			it('should return a reply', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let users = [{discordId: getRandomString(), name: getRandomString(), money: startingBallance, expectedBallance: startingBallance - amountToTake}];
				let message = 'Please take ' + amountToTake;
				return db.insert(users, function(err, docs){
					if(err){
						return done(err);
					}
					return currencySubtractMessage(null, function(err){
						if(err){
							return done(err);
						}
						return db.find({discordId: {$in: docs.map(x => x.discordId)}}).limit(1).exec(function(err, docs){
							if(err){
								return done(err);
							}
							let doc = docs[0];
							let matchedUser = users.filter(x => x.discordId === doc.discordId)[0];
							assert.equal(matchedUser.expectedBallance, doc.money);
							return done();
						});
					}, {text: message, db: db, users: users, isAdmin: true});
				});
			});
			it('should return a reply for multiple users', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let numberOfUsers = 3;
				let users = [];
				for(let index = 0; index < numberOfUsers; index++){
					users.push({discordId: getRandomString(), name: getRandomString(), money: startingBallance, expectedBallance: startingBallance - amountToTake});
				}
				let message = 'Please take ' + amountToTake;
				return db.insert(users, function(err, docs){
					if(err){
						return done(err);
					}
					return currencySubtractMessage(null, function(err){
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
			it('should return fail if a single user is not present', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let numberOfUsers = 3;
				let users = [];
				let expectedBallance = [];
				for(let index = 0; index < numberOfUsers; index++){
					users.push({discordId: getRandomString(), name: getRandomString(), money: startingBallance});
					expectedBallance.push(startingBallance - amountToTake);
				}
				let message = 'Please take ' + amountToTake;
				return db.insert(users, function(err, docs){
					if(err){
						return done(err);
					}
					//Add the missing user
					users.push({discordId: getRandomString(), name: getRandomString(), money: startingBallance});
					return currencySubtractMessage(null, function(err){
						if(err){
							return db.find({discordId: {$in: docs.map(x => x.discordId)}}).exec(function(err, docs){
								if(err){
									return done(err);
								}
								for(let index = 0; index < docs.length; index++){
									let matchedUser = users.filter(x => x.discordId === docs[index].discordId)[0];
									assert.equal(matchedUser.money, docs[index].money);
								}
								return done();
							});
						}
						return done('Should have failed because a nonexistant user was referenced');
					}, {text: message, db: db, users: users, isAdmin: true});
				});
			});
			it('should return fail if a single user does not have enough', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let numberOfUsers = 3;
				let users = [];
				let expectedBallance = [];
				for(let index = 0; index < numberOfUsers; index++){
					users.push({discordId: getRandomString(), name: getRandomString(), money: startingBallance});
					expectedBallance.push(startingBallance - amountToTake);
				}
				//Make sure one user does not have enough
				users[0].money = amountToTake - 1;
				let message = 'Please take ' + amountToTake;
				return db.insert(users, function(err, docs){
					if(err){
						return done(err);
					}
					return currencySubtractMessage(null, function(err){
						if(err){
							return db.find({discordId: {$in: docs.map(x => x.discordId)}}).exec(function(err, docs){
								if(err){
									return done(err);
								}
								for(let index = 0; index < docs.length; index++){
									let matchedUser = users.filter(x => x.discordId === docs[index].discordId)[0];
									assert.equal(matchedUser.money, docs[index].money);
								}
								return done();
							});
						}
						return done('Should have failed because a nonexistant user was referenced');
					}, {text: message, db: db, users: users, isAdmin: true});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});