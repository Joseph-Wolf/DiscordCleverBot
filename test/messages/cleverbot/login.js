"use strict";

const assert = require('assert');
const cleverbot = require('better-cleverbot-io');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const cleverbotLoginMessage = require('../../../src/messages/cleverbot/login.js');

function generateMessage(user, key){

	return (user || randomString()) + ':' + (key || randomString());
}

describe('Message', function(){
	before(testUtils.dbBefore);
	describe('Login', function(){
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
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				let user = randomString();
				let key = randomString();
				let settingKey = randomString();
				return cleverbotLoginMessage(null, {text: generateMessage(user, key), db: collection, key: settingKey, isAdmin: false}, function(err){
					if(err){
						return done();
					}
					return done('Did not return error for non admin');
				});
			});
		});
		it('should insert correct setting into the database', function(done){
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				let user = randomString();
				let key = randomString();
				let settingKey = randomString();
				return cleverbotLoginMessage(null, {text: generateMessage(user, key), db: collection, key: settingKey, isAdmin: true}, function(err){
					if(err){
						return done(err);
					}
					let expectedValue = {user: user, key: key};
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
		it.skip('should update correct setting into the database', function(done){
			return done();
		});
		it.skip('should return error for invalid credentials', function(done){
			return done();
		});
		it.skip('should return success for valid credentials', function(done){
			return done();
		});
	});
	after(testUtils.dbAfter);
});