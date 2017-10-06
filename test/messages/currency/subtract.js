"use strict";

const assert = require('assert');
const data = require('nedb');
const testUtils = require('../../testUtils.js');
const getRandomString = require('../../../src/util/getRandomString.js');
const currencySubtractMessage = require('../../../src/messages/currency/subtract.js');

let db = null;

describe('Currency', function(){
	before(function (done) {
		let dbFilename = testUtils.generateDataFilePath();
		db = new data({filename: dbFilename, autoload: true, onload: done});
	});
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
				let user = {discordId: userId, name: userId, money: startingBallance};
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
				let user = {discordId: userId, name: userId, money: startingBallance};
				let message = 'Please take ' + amountToTake + ' from ' + user.name;
				db.insert(user, function(err, doc){
					if(err){
						return done(err);
					}
					currencySubtractMessage(null, function(err){
						if(err){
							return done(err);
						}
						db.findOne({_id: doc._id}, function(err, doc){
							if(err){
								return done(err);
							}
							assert.equal(expectedBallance, doc.money);
							return done();
						});
					}, {text: message, db: db, user: doc, isAdmin: true});
				});
			});
		});
	});
	after(testUtils.deleteTempDataPath);
});