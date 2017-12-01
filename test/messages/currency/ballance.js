"use strict";

const assert = require('assert');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const currencyBallanceMessage = require('../../../src/messages/currency/ballance.js');

function generateMessage(){
	return 'bal';
}

describe('Currency', function(){
	before(testUtils.dbBefore);
	describe('Ballance', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				return currencyBallanceMessage(true, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencyBallanceMessage(null, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return an error is the user does not exist', function(done){
				let users = [{discordId: randomString(), name: randomString(), money: 55}];
				let message = generateMessage();
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return currencyBallanceMessage(null, {text: message, db: collection, users: null}, function(err){
						if(err){
							return currencyBallanceMessage(null, {text: message, db: collection, users: []}, function(err){
								if(err){
									return currencyBallanceMessage(null, {text: message, db: collection, users: users}, function(err){
										if(err){
											return done();
										}
										return done('Returned ballance of non existant user');
									});
								}
								return done('Returned ballance of non existant user');
							});
						}
						return done('Returned ballance of non existant user');
					});
				});
			});
			it('should return a ballance from the database', function(done){
				let user = {discordId: randomString(), name: randomString(), money: 55};
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(user, null, function(err){
						if(err){
							return done(err);
						}
						return currencyBallanceMessage(null, {text: generateMessage(), db: collection, users: [user]}, function(err, reply){
							if(err){
								return done(err);
							}
							assert.equal(user.name + ' has a ballance of ' + user.money, reply);
							return done();
						});
					});
				});
			});
			it('should return multiple ballances from the database', function(done){
				let users = [];
				let numberOfUsers = 3;
				for(let index = 0; index < numberOfUsers; index++){
					let money = 55;
					users.push({discordId: randomString(), name: randomString(), money: money});
				}
				//Need to sort users so the results will match. Replies from NEDB are async so the documents aren't always in the right order.
				users = users.sort(function(a, b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;});
				let message = generateMessage();
				let expectedReply;
				for(let index = 0; index < users.length; index++){
					message = message + (index > 0?', ': '') + users[index];
					expectedReply = expectedReply + index > 0 ? '\n':'' + users[index].name + ' has a ballance of ' + users[index].money;
				}
				return testUtils.dbExecute(function(err, collection){
					if(err){
						return done(err);
					}
					return collection.insert(users, null, function(err){
						if(err){
							return done(err);
						}
						return currencyBallanceMessage(null, {text: message, db: collection, users: users}, function(err, reply){
							if(err){
								return done(err);
							}
							assert.ok(reply);
							assert.equal(expectedReply, reply);
							return done();
						});
					});
				});
			});
		});
	});
	after(testUtils.dbAfter);
});