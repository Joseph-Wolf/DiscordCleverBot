"use strict";

const assert = require('assert');
const randomString = require('random-string');
const testUtils = require('../../testUtils.js');
const setName = require('../../../src/messages/currency/setName.js');

describe('Currency', function(){
	before(testUtils.dbBefore);
	describe('setName', function(){
		it('should return a friendly error if an error is passed to it', function(done){
			setName(true, function(err){
				if(err){
					return done();
				}
				return done('Did not return an error');
			});
		});
		it('should require expected parameters', function(done){
			let expected = randomString();
			let key = randomString();
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, function(err){
					if(err){
						return setName(null, function(err){
							if(err){
								return setName(null, function(err){
									if(err){
										return setName(null, function(err){
											if(err){
												return setName(null, done, {text: expected, db: collection, key: key, isAdmin: true})
											}
											return done('Should be an admin');
										}, {text: expected, db: collection, key: key})
									}
									return done('Should require currency name key');
								}, {text: expected, db: collection});
							}
							return done('Should require the database');
						}, {text: expected});
					}
					return done('Should require the text');
				});
			});
		});
		it('should fail for non admins', function(done){
			let expected = 'crystal';
			let message = 'set currency name to ' + expected + 's';
			let query = {key: randomString()};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Should have returned an error');
				}, {text: message, db: collection, key: query.key, isAdmin: false});
			});
		});
		it('should ignore empty text', function(done){
			let message = '        ';
			let key = randomString();
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Should have returned an error if there is no last word.');
				}, {text: message, db: collection, key: key, isAdmin: true});
			});
		});
		it('should trim any trailing s characters', function(done){
			let expected = 'crystal';
			let message = 'set currency name to ' + expected + 's';
			let query = {key: randomString()};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, function(err, reply){
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
				}, {text: message, db: collection, key: query.key, isAdmin: true});
			});
		});
		it('should set valid name in the database', function(done){
			let expected = randomString();
			let message = 'set currency name to ' + expected;
			let query = {key: randomString()};
			return testUtils.dbExecute(function(err, collection){
				if(err){
					return done(err);
				}
				return setName(null, function(err, reply){
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
				}, {text: message, db: collection, key: query.key, isAdmin: true});
			});
		});
	});
	after(testUtils.dbAfter);
});