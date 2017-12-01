"use strict";

const assert = require('assert');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const currencyAddMessage = require('../../../src/messages/currency/add.js');

function generateMessage(amount){
	return 'give ' + amount;
}

describe('Currency', function(){
	before(testUtils.dbBefore);
	describe('Add', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				return currencyAddMessage(true, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencyAddMessage(null, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error when no users are mentioned', function(done){
				return currencyAddMessage(null, {text: 'hello', users: null, isAdmin: true}, function(err, reply){
					if(err){
						return currencyAddMessage(null, {text: 'hello', users: [], isAdmin: true}, function(err, reply){
							if(err){
								return done();
							}
							return done('Did not reuturn error.');
						});
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error for non admin', function(done){
				let user = {discordId: randomString(), name: randomString(), money: 0};
				let startingBallance = user.money;
				let amountToAdd = 22;
				let expectedBallance = startingBallance + amountToAdd;
				let message = generateMessage(amountToAdd);
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return currencyAddMessage(null, {text: message, db: collection, users: [user], isAdmin: false}, function(err){
						if(err){
							return done();
						}
						return done('Did not reuturn error.');
					});
				});
			});
			it('should return a reply', function(done){
				let user = {discordId: randomString(), name: randomString(), money: 0};
				let startingBallance = user.money;
				let amountToAdd = 22;
				let expectedBallance = startingBallance + amountToAdd;
				let message = generateMessage(amountToAdd);
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return currencyAddMessage(null, {text: message, db: collection, users: [user], isAdmin: true}, function(err){
						if(err){
							return done(err);
						}
						return collection.find({discordId: user.discordId}).limit(1).toArray(function(err, docs){
							if(err){
								return done(err);
							}
							let doc = docs[0];
							assert.equal(expectedBallance, doc.money);
							return done();
						});
					});
				});
			});
			it('should add money to existing user', function(done){
				let startingBallance = 0;
				let amountToAdd = 22;
				let users = [{discordId: randomString(), name: randomString(), money: startingBallance, expectedBallance: startingBallance + amountToAdd}];
				let discordIds = users.map(function(x){return {discordId: x.discordId}});
				let message = generateMessage(amountToAdd);
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err, docs){
						if(err){
							return done(err);
						}
						return currencyAddMessage(null, {text: message, db: collection, users: users, isAdmin: true}, function(err){
							if(err){
								return done(err);
							}
							return collection.find({$or: discordIds}).limit(1).toArray(function(err, docs){
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
			it('should add money to multiple users', function(done){
				let amountToAdd = 22;
				let users = [{discordId: randomString(), name: randomString(), money: 0, expectedBallance: amountToAdd}];
				let discordIds = users.map(function(x){return {discordId: x.discordId}});
				let message = generateMessage(amountToAdd);
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err, docs){
						if(err){
							return done(err);
						}
						//Add a missing user
						users.push({discordId: randomString(), name: randomString(), money: 0, expectedBallance: amountToAdd});
						return currencyAddMessage(null, {text: message, db: collection, users: users, isAdmin: true}, function(err){
							if(err){
								return done(err);
							}
							return collection.find({$or: discordIds}).toArray(function(err, docs){
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
		});
	});
	after(testUtils.dbAfter);
});