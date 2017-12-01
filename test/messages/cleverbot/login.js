"use strict";

const assert = require('assert');
const cleverbot = require('better-cleverbot-io');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const cleverbotLoginMessage = require('../../../src/messages/cleverbot/login.js');

let mockedCleverbot = require('better-cleverbot-io');
let expectedReply = randomString();

const realCreate = mockedCleverbot.prototype.create;
const realAsk = mockedCleverbot.prototype.ask;
const mockedCreate = function(){ //Mock create to ignore invalid credentials
	return new Promise((resolve, reject) => {
		resolve();
	});
};
const mockedAsk = function(query){ //Mock ask to return an expected response
	return new Promise((resolve, reject) => {
		resolve(expectedReply);
	});
};

function generateMessage(user, key){

	return (user || randomString()) + ':' + (key || randomString());
}

describe('Message', function(){
	before(testUtils.dbBefore);
	describe('Login', function(){
		beforeEach(function(){
			mockedCleverbot.prototype.create = mockedCreate;
			mockedCleverbot.prototype.ask = mockedAsk;
		});
		it('should return error for invalid parameters', function(done){
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return cleverbotLoginMessage(null, null, function(err){
					if(err){
						return cleverbotLoginMessage(null, {}, function(err){
							if(err){
								return cleverbotLoginMessage(null, {text: generateMessage()}, function(err){
									if(err){
										return cleverbotLoginMessage(null, {text: generateMessage(), db: collection}, function(err){
											if(err){
												return done();
											}
											return done('Did not return error for null key');
										});
									}
									return done('Did not return error for null db');
								})
							}
							return done('Did not return error for null text');
						});
					}
					return done('Did not return error for null params');
				});
			});
		});
		it('should require you to be an admin', function(done){
			let user = randomString();
			let key = randomString();
			let settingKey = randomString();
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return cleverbotLoginMessage(null, {text: generateMessage(user, key), db: collection, key: settingKey, isAdmin: false}, function(err){
					if(err){
						return done();
					}
					return done('Did not return error for non admin');
				});
			});
		});
		it('should insert correct setting into the database', function(done){
			let user = randomString();
			let key = randomString();
			let settingKey = randomString();
			let expectedValue = {user: user, key: key};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return cleverbotLoginMessage(null, {text: generateMessage(user, key), db: collection, key: settingKey, isAdmin: true}, function(err){
					if(err){
						return done(err);
					}
					return collection.find({key: settingKey}).limit(1).toArray(function(err, items){
						if(err){
							return done(err);
						}
						assert.equal(items[0].key, settingKey);
						assert.deepEqual(items[0].value, expectedValue);
						return done();
					});
				});
			});
		});
		it('should update correct setting into the database', function(done){
			let user = randomString();
			let key = randomString();
			let settingKey = randomString();
			let expectedValue = {user: user, key: key};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return collection.insert({key: settingKey, value: {user: randomString(), key: randomString()}}, null, function(err){
					if(err){
						return done(err);
					}
					return cleverbotLoginMessage(null, {text: generateMessage(user, key), db: collection, key: settingKey, isAdmin: true}, function(err){
						if(err){
							return done(err);
						}
						return collection.find({key: settingKey}).limit(1).toArray(function(err, items){
							if(err){
								return done(err);
							}
							assert.equal(items[0].key, settingKey);
							assert.deepEqual(items[0].value, expectedValue);
							return done();
						});
					});
				});
			});
		});
		it('should return error for invalid credentials', function(done){
			mockedCleverbot.prototype.create = realCreate;
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return cleverbotLoginMessage(null, {text: generateMessage(), db: collection, key: randomString(), isAdmin: true, cleverbot: mockedCleverbot}, function(err){
					if(err){
						return done();
					}
					return done('Did not return error for invalid credentials.');
				});
			});
		});
		afterEach(function(){
			mockedCleverbot.prototype.create = realCreate;
			mockedCleverbot.prototype.ask = realAsk;
		});
	});
	after(testUtils.dbAfter);
});