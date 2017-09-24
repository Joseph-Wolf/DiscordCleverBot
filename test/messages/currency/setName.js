"use strict";

const assert = require('assert');
const testUtils = require('../../testUtils.js');
const setName = require('../../../src/messages/currency/setName.js');
const getRandomString = require('../../../src/util/getRandomString.js');
const data = require('../../../src/db/settings.js');

describe('Currency', function(){
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
			let expected = getRandomString();
			let key = getRandomString();
			let db = new data(testUtils.generateDataFilePath());
			setName(null, function(err){
				if(err){
					return setName(null, function(err){
						if(err){
							return setName(null, function(err){
								if(err){
									return setName(null, done, {text: expected, db: db, key: key})
								}
								return done('Should require currency name key');
							}, {text: expected, db: db});
						}
						return done('Should require the database');
					}, {text: expected});
				}
				return done('Should require the text');
			});
		});
		it('should ignore empty text', function(done){
			let message = '        ';
			let key = getRandomString();
			let db = new data(testUtils.generateDataFilePath());
			setName(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Should have returned an error if there is no last word.');
			}, {text: message, db: db, key: key});
		});
		it('should trim any trailing s characters', function(done){
			let expected = 'crystal';
			let message = 'set currency name to ' + expected + 's';
			let key = getRandomString();
			let db = new data(testUtils.generateDataFilePath());
			setName(null, function(err, reply){
				if(err){
					return done(err);
				}
				db.get({key: key}, function(err, doc){
					if(err){
						return done(err);
					}
					assert.ok(doc);
					assert.equal(expected, doc.value);
					return done();
				});
			}, {text: message, db: db, key: key});
		});
		it('should set valid name in the database', function(done){
			let expected = getRandomString();
			let message = 'set currency name to ' + expected;
			let key = getRandomString();
			let db = new data(testUtils.generateDataFilePath());
			setName(null, function(err, reply){
				if(err){
					return done(err);
				}
				db.get({key: key}, function(err, doc){
					if(err){
						return done(err);
					}
					assert.ok(doc);
					assert.equal(expected, doc.value);
					return done();
				});
			}, {text: message, db: db, key: key});
		});
	});
	after(testUtils.deleteTempDataPath);
});