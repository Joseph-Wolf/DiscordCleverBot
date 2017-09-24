"use strict";

const assert = require('assert');
const testUtils = require('../../testUtils.js');
const data = require('../../../src/db/users.js');
const getRandomString = require('../../../src/util/getRandomString.js');
const currencySubtractMessage = require('../../../src/messages/currency/subtract.js');
const User = require('../../../src/db/class/user.js');

describe('Currency', function(){
	describe('Subtract', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				currencySubtractMessage(true, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				currencySubtractMessage(null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should throw error for insufficient funds', function(done){
				let userId = getRandomString();
				let startingBallance = 54;
				let amountToTake = 55;
				let db = new data(testUtils.generateDataFilePath());
				let user = new User({name: userId, money: startingBallance});
				let message = 'Please take ' + amountToTake + ' from ' + user.name;
				currencySubtractMessage(null, function(err, ballance){
					if(err){
						return done();
					}
					return done('Returned successful despite not having enough funds');
				}, {text: message, db: db, user: user})
			});
			it('should return a reply', function(done){
				let userId = getRandomString();
				let startingBallance = 66;
				let amountToTake = 55;
				let expectedBallance = startingBallance - amountToTake;
				let db = new data(testUtils.generateDataFilePath());
				let user = new User({discordId: userId, name: userId, money: startingBallance});
				let message = 'Please take ' + amountToTake + ' from ' + user.name;
				db.set(user, function(err, doc){
					if(err){
						return done(err);
					}
					currencySubtractMessage(null, function(err){
						if(err){
							return done(err);
						}
						db.get({_id: doc._id}, function(err, doc){
							if(err){
								return done(err);
							}
							assert.equal(expectedBallance, doc.money);
							return done();
						});
					}, {text: message, db: db, user: doc});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});