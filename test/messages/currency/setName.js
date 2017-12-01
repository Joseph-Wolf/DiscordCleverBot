"use strict";

const assert = require('assert');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const setName = require('../../../src/messages/currency/setName.js');

function generateName(){
	return randomString().replace(/s+$/, ''); //Removes trailing s characters;
}

function generateMessage(name){
	return 'set currency name to ' + name;
}

describe('Currency', function(){
	before(testUtils.dbBefore);
	describe('setName', function(){
		it('should return a friendly error if an error is passed to it', function(done){
			setName(true, null, function(err){
				if(err){
					return done();
				}
				return done('Did not return an error');
			});
		});
		it('should require expected parameters', function(done){
			let expected = generateName();
			let key = randomString();
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, null, function(err){
					if(err){
						return setName(null, {text: expected}, function(err){
							if(err){
								return setName(null, {text: expected, db: collection}, function(err){
									if(err){
										return setName(null, {text: expected, db: collection, key: key}, function(err){
											if(err){
												return setName(null, {text: expected, db: collection, key: key, isAdmin: true}, done);
											}
											return done('Should be an admin');
										});
									}
									return done('Should require currency name key');
								});
							}
							return done('Should require the database');
						});
					}
					return done('Should require the text');
				});
			});
		});
		it('should fail for non admins', function(done){
			let expected = generateName();
			let message = generateMessage(expected);
			let query = {key: randomString()};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, {text: message, db: collection, key: query.key, isAdmin: false}, function(err, reply){
					if(err){
						return done();
					}
					return done('Should have returned an error');
				});
			});
		});
		it('should ignore empty text', function(done){
			let message = '        ';
			let key = randomString();
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, {text: message, db: collection, key: key, isAdmin: true}, function(err, reply){
					if(err){
						return done();
					}
					return done('Should have returned an error if there is no last word.');
				});
			});
		});
		it('should trim any trailing s characters', function(done){
			let expected = generateName();
			let message = generateMessage(expected + 's');
			let query = {key: randomString()};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, {text: message, db: collection, key: query.key, isAdmin: true}, function(err, reply){
					if(err){
						return done(err);
					}
					return collection.find(query).limit(1).toArray(function(err, doc){
						if(err){
							return done(err);
						}
						assert.equal(expected, doc[0].value);
						return done();
					});
				});
			});
		});
		it('should set valid name in the database', function(done){
			let expected = generateName();
			let message = generateMessage(expected);
			let query = {key: randomString()};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, {text: message, db: collection, key: query.key, isAdmin: true}, function(err, reply){
					if(err){
						return done(err);
					}
					return collection.find(query).limit(1).toArray(function(err, doc){
						if(err){
							return done(err);
						}
						assert.ok(doc);
						assert.equal(expected, doc[0].value);
						return done();
					});
				});
			});
		});
	});
	after(testUtils.dbAfter);
});