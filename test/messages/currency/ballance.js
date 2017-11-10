"use strict";

const assert = require('assert');
const data = require('nedb');
const testUtils = require('../../testUtils.js');
const getRandomString = require('../../../src/util/getRandomString.js');
const currencyBallanceMessage = require('../../../src/messages/currency/ballance.js');

let db = null;

describe('Currency', function(){
	before(function (done) {
		let dbFilename = testUtils.generateDataFilePath();
		db = new data({filename: dbFilename, autoload: true, onload: done});
	});
	describe('Ballance', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				return currencyBallanceMessage(true, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				return currencyBallanceMessage(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return an error is the user does not exist', function(done){
				let users = [{discordId: getRandomString(), name: getRandomString(), money: 55}];
				let message = 'Please check the ballance';
				return currencyBallanceMessage(null, function(err){
					if(err){
						return currencyBallanceMessage(null, function(err){
							if(err){
								return currencyBallanceMessage(null, function(err){
									if(err){
										return done();
									}
									return done('Returned ballance of non existant user');
								}, {text: message, db: db, users: users});
							}
							return done('Returned ballance of non existant user');
						}, {text: message, db: db, users: []});
					}
					return done('Returned ballance of non existant user');
				}, {text: message, db: db, users: null});
			});
			it('should return a ballance from the database', function(done){
				let user = {discordId: getRandomString(), name: getRandomString(), money: 55};
				let message = 'Please check the ballance of ' + user.name;
				return db.insert(user, function(err, doc){
					if(err){
						return done(err);
					}
					return currencyBallanceMessage(null, function(err, reply){
						if(err){
							return done(err);
						}
						assert.equal(doc.name + ' has a ballance of ' + doc.money, reply);
						return done();
					}, {text: message, db: db, users: [user]});
				});
			});
			it('should return multiple ballances from the database', function(done){
				let users = [];
				let numberOfUsers = 3;
				for(let index = 0; index < numberOfUsers; index++){
					let money = 55;
					users.push({discordId: getRandomString(), name: getRandomString(), money: money});
				}
				//Need to sort users so the results will match. Replies from NEDB are async so the documents aren't always in the right order.
				users = users.sort(function(a, b){return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;});
				let message = 'Please check the ballance of';
				let expectedReply;
				for(let index = 0; index < users.length; index++){
					message = message + (index > 0?', ': '') + users[index];
					expectedReply = expectedReply + index > 0 ? '\n':'' + users[index].name + ' has a ballance of ' + users[index].money;
				}
				return db.insert(users, function(err, doc){
					if(err){
						return done(err);
					}
					return currencyBallanceMessage(null, function(err, reply){
						if(err){
							return done(err);
						}
						assert.ok(reply);
						assert.equal(expectedReply, reply);
						return done();
					}, {text: message, db: db, users: users});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});