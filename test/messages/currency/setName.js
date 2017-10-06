"use strict";

const assert = require('assert');
const data = require('nedb');
const testUtils = require('../../testUtils.js');
const setName = require('../../../src/messages/currency/setName.js');
const getRandomString = require('../../../src/util/getRandomString.js');

let db = null;

describe('Currency', function(){
	before(function (done) {
		let dbFilename = testUtils.generateDataFilePath();
		db = new data({filename: dbFilename, autoload: true, onload: done});
	});
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
			setName(null, function(err){
				if(err){
					return setName(null, function(err){
						if(err){
							return setName(null, function(err){
								if(err){
									return setName(null, function(err){
										if(err){
											return setName(null, done, {text: expected, db: db, key: key, isAdmin: true})
										}
										return done('Should be an admin');
									}, {text: expected, db: db, key: key})
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
			setName(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Should have returned an error if there is no last word.');
			}, {text: message, db: db, key: key, isAdmin: true});
		});
		it('should trim any trailing s characters', function(done){
			let expected = 'crystal';
			let message = 'set currency name to ' + expected + 's';
			let key = getRandomString();
			setName(null, function(err, reply){
				if(err){
					return done(err);
				}
				db.findOne({key: key}, function(err, doc){
					if(err){
						return done(err);
					}
					assert.ok(doc);
					assert.equal(expected, doc.value);
					return done();
				});
			}, {text: message, db: db, key: key, isAdmin: true});
		});
		it('should set valid name in the database', function(done){
			let expected = getRandomString();
			let message = 'set currency name to ' + expected;
			let key = getRandomString();
			setName(null, function(err, reply){
				if(err){
					return done(err);
				}
				db.findOne({key: key}, function(err, doc){
					if(err){
						return done(err);
					}
					assert.ok(doc);
					assert.equal(expected, doc.value);
					return done();
				});
			}, {text: message, db: db, key: key, isAdmin: true});
		});
	});
	after(testUtils.deleteTempDataPath);
});