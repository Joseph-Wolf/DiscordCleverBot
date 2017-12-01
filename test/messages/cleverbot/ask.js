"use strict";

const assert = require('assert');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const cleverbotAskMessage = require('../../../src/messages/cleverbot/ask.js');

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

describe('Message', function(){
	before(testUtils.dbBefore);
	describe('Ask', function(){
		beforeEach(function(){
			mockedCleverbot.prototype.create = mockedCreate;
			mockedCleverbot.prototype.ask = mockedAsk;
		});
		it('should return error for invalid parameters', function(done){
			return testUtils.dbExecute(function(err){
				if(err){
					return done(err);
				}
				return cleverbotAskMessage(null, null, function(err){
					if(err){
						return cleverbotAskMessage(null, {}, function(err){
							if(err){
								return cleverbotAskMessage(null, {text: randomString()}, function(err){
									if(err){
										return cleverbotAskMessage(null, {text: randomString(), db: randomString()}, function(err){
											if(err){
												return done();
											}
											return done('Did not return error for null key');
										});
									}
									return done('Did not return error for null db');
								});
							}
							return done('Did not return error for null text');
						});
					}
					return done('Did not reuturn error for null parameters.');
				});
			});
		});
		it('should return error for invalid setting', function(done){
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				let invalidKey1 = {key: randomString()};
				let invalidKey2 = {key: randomString(), value: {}};
				let invalidKey3 = {key: randomString(), value: {user: randomString()}};
				return collection.insert([invalidKey1, invalidKey2, invalidKey3], null, function(err){
					if(err){
						return done(err);
					}
					return cleverbotAskMessage(null, {text: randomString(), db: collection, key: invalidKey1.key}, function(err){
						if(err){
							return cleverbotAskMessage(null, {text: randomString(), db: collection, key: invalidKey2.key}, function(err){
								if(err){
									return cleverbotAskMessage(null, {text: randomString(), db: collection, key: invalidKey3.key}, function(err){
										if(err){
											return done();
										}
										return done('Did not return error for null key');
									});
								}
								return done('Did not return error for null user');
							});
						}
						return done('Did not return error for null value');
					});
				});
			});
		});
		it('should create an instance of the passed class', function(done){
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				let validSetting = {key: randomString(), value: {user: randomString(), key: randomString()}};
				return collection.insert(validSetting, null, function(err){
					if(err){
						return done(err);
					}
					class mockClass{
						constructor(value){
							assert.deepEqual(value, validSetting.value);
							return done();
						}
					}
					return cleverbotAskMessage(null, {text: randomString(), db: collection, key: validSetting.key, cleverbot: mockClass});
				});
			});	
		});
		it('should return an error if the credentials are invalid', function(done){
			mockedCleverbot.prototype.create = realCreate; //Enable the real create
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				let message = randomString();
				let response = randomString();
				let validSetting = {key: randomString(), value: {user: randomString(), key: randomString()}};
				return collection.insert(validSetting, null, function(err){
					if(err){
						return done(err);
					}
					return cleverbotAskMessage(null, {text: message, db: collection, key: validSetting.key, cleverbot: mockedCleverbot}, function(err){
						if(err){
							return done();
						}
						return done('Did not return error for invalid credentials');
					});
				});
			});	
		});
		it('should ask cleverbot if everything is valid', function(done){
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				let message = randomString();
				let response = randomString();
				let validSetting = {key: randomString(), value: {user: randomString(), key: randomString()}};
				return collection.insert(validSetting, null, function(err){
					if(err){
						return done(err);
					}
					return cleverbotAskMessage(null, {text: message, db: collection, key: validSetting.key, cleverbot: mockedCleverbot}, done);
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