"use strict";

const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const data = require('../src/db/users.js');
const getRandomString = require('../src/util/getRandomString.js');
const currencyAddMessage = require('../src/messages/currencyAdd.js');
const currencySubtractMessage = require('../src/messages/currencySubtract.js');
const tmpDataPath = path.join('test','data');

function generateDataFilePath(){
	return path.join(tmpDataPath, getRandomString());
}

describe('Currency', function(){
	describe('Add', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				currencyAddMessage(true, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				currencyAddMessage(null, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return a reply', function(done){
				let message = 'Please give 22 to dummyman';
				let db = new data(generateDataFilePath());
				currencyAddMessage(null, {text: message, db: db, userName: 'dummymanId'}, done)
			});
		});
	});
	describe('Subtract', function(){
		describe('Message', function(){
			it('should return sanatize error message', function(done){
				currencySubtractMessage(true, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should return error message for null text', function(done){
				currencySubtractMessage(null, null, function(err, reply){
					if(err){
						return done();
					}
					return done('Did not reuturn error.');
				});
			});
			it('should throw error for insufficient funds', function(done){
				let message = 'Please take 55 from dummyman';
				let db = new data(generateDataFilePath());
				currencySubtractMessage(null, {text: message, db: db, userName: 'dummymanId'}, function(err, ballance){
					if(err){
						return done();
					}
					return done('Returned successful despite not having enough funds');
				})
			});
			it('should return a reply', function(done){
				let userName = 'dummyman';
				let userId = userName + 'Id';
				let message = 'Please take 55 from ' + userName;
				let db = new data(generateDataFilePath());
				db.set({name: userId, money: 66}, function(err, doc){
					currencySubtractMessage(null, {text: message, db: db, userName: userId}, done);
					//TODO: get the user from the DB and revalidate the amount
				});
			});
		});
	});
	after(function(){
		if (fs.existsSync(tmpDataPath)){
			rimraf.sync(tmpDataPath);
		}
	});
});