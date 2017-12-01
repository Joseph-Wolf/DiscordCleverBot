"use strict";

const assert = require('assert');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const currencySubtractMessage = require('../../../src/messages/currency/subtract.js');

function generateMessage(amount){
	return 'take ' + amount;
}

describe('Currency', function(){
	before(testUtils.dbBefore);
	describe('Subtract', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				return currencySubtractMessage(true, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencySubtractMessage(null, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencySubtractMessage(null, {text: 'hello', users: null, isAdmin: true}, function(err, reply){
					if(err){
						return currencySubtractMessage(null, {text: 'hello', users: [], isAdmin: true}, function(err, reply){
							if(err){
								return done();
							}
							return done('Did not reuturn error.');
						});
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for non admins', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let users = [{discordId: randomString(), name: randomString(), money: startingBallance, expectedBallance: startingBallance - amountToTake}];
				let message = generateMessage(amountToTake);
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err, docs){
						if(err){
							return done(err);
						}
						return currencySubtractMessage(null, {text: message, db: collection, users: users, isAdmin: false}, function(err){
							if(err){
								return done();
							}
							return done('Did not reuturn error.');
						});
					});
				});
			});
			it('should throw error for insufficient funds', function(done){
				let startingBallance = 54;
				let amountToTake = 55;
				let user = {discordId: randomString(), name: randomString(), money: startingBallance};
				let message = generateMessage(amountToTake);
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return currencySubtractMessage(null, {text: message, db: collection, users: [user]}, function(err, ballance){
						if(err){
							return done();
						}
						return done('Returned successful despite not having enough funds');
					});
				});
			});
			it('should return a reply', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let users = [{discordId: randomString(), name: randomString(), money: startingBallance, expectedBallance: startingBallance - amountToTake}];
				let message = generateMessage(amountToTake);
				let userIds = users.map(function(user){return {discordId: user.discordId}});
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err, docs){
						if(err){
							return done(err);
						}
						return currencySubtractMessage(null, {text: message, db: collection, users: users, isAdmin: true}, function(err){
							if(err){
								return done(err);
							}
							return collection.find({$or: userIds}).limit(1).toArray(function(err, docs){
								if(err){
									return done(err);
								}
								let doc = docs[0];
								let matchedUser = users.filter(x => x.discordId === doc.discordId)[0];
								assert.equal(matchedUser.expectedBallance, doc.money);
								return done();
							});
						});
					});
				});
			});
			it('should return a reply for multiple users', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let numberOfUsers = 3;
				let users = [];
				for(let index = 0; index < numberOfUsers; index++){
					users.push({discordId: randomString(), name: randomString(), money: startingBallance, expectedBallance: startingBallance - amountToTake});
				}
				let message = generateMessage(amountToTake);
				let userIds = users.map(function(user){return {discordId: user.discordId}});
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err, docs){
						if(err){
							return done(err);
						}
						return currencySubtractMessage(null, {text: message, db: collection, users: users, isAdmin: true}, function(err){
							if(err){
								return done(err);
							}
							return collection.find({$or: userIds}).toArray(function(err, docs){
								if(err){
									return done(err);
								}
								for(let index = 0; index < docs.length; index++){
									let matchedUser = users.filter(x => x.discordId === docs[index].discordId)[0];
									assert.equal(matchedUser.expectedBallance, docs[index].money);
								}
								return done();
							});
						});
					});
				});
			});
			it('should return fail if a single user is not present', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let numberOfUsers = 3;
				let users = [];
				let expectedBallance = [];
				for(let index = 0; index < numberOfUsers; index++){
					users.push({discordId: randomString(), name: randomString(), money: startingBallance});
					expectedBallance.push(startingBallance - amountToTake);
				}
				let message = generateMessage(amountToTake);
				let userIds = users.map(function(user){return {discordId: user.discordId}});
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err, docs){
						if(err){
							return done(err);
						}
						//Add the missing user
						users.push({discordId: randomString(), name: randomString(), money: startingBallance});
						return currencySubtractMessage(null, {text: message, db: collection, users: users, isAdmin: true}, function(err){
							if(err){
								return collection.find({$or: userIds}).toArray(function(err, docs){
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
						});
					});
				});
			});
			it('should return fail if a single user does not have enough', function(done){
				let startingBallance = 66;
				let amountToTake = 55;
				let numberOfUsers = 3;
				let users = [];
				let expectedBallance = [];
				for(let index = 0; index < numberOfUsers; index++){
					users.push({discordId: randomString(), name: randomString(), money: startingBallance});
					expectedBallance.push(startingBallance - amountToTake);
				}
				//Make sure one user does not have enough
				users[0].money = amountToTake - 1;
				let message = generateMessage(amountToTake);
				let userIds = users.map(function(user){return {discordId: user.discordId}});
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err, docs){
						if(err){
							return done(err);
						}
						return currencySubtractMessage(null, {text: message, db: collection, users: users, isAdmin: true}, function(err){
							if(err){
								return collection.find({$or: userIds}).toArray(function(err, docs){
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
						});
					});
				});
			});
		});
	});
	after(testUtils.dbAfter);
});