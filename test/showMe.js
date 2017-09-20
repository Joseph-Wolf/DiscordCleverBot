"use strict";

const assert = require('assert');
const showMe = require('../src/util/showMe.js');
const showMeMessage = require('../src/messages/showMe.js');

describe('showMe', function(){
	it('should return abstract', function(done){
		let category = null;
		showMe('abstract', done);
	});
	it('should return animals', function(done){
		let category = null;
		showMe('animals', done);
	});
	it('should return cats', function(done){
		let category = null;
		showMe('cats', done);
	});
	it('should return city', function(done){
		let category = null;
		showMe('city', done);
	});
	it('should return food', function(done){
		let category = null;
		showMe('food', done);
	});
	it('should return nature', function(done){
		let category = null;
		showMe('nature', done);
	});
	it('should return dogs', function(done){
		let category = null;
		showMe('dogs', done);
	});
	it('should not return invalid category', function(done){
		let category = null;
		showMe('invalid', function(err){
			if(err){
				return done();
			}
			return done('Did not throw error to callback');
		});
	});
	describe('Message', function(){
		it('should return sanatized error message', function(done){
			showMeMessage(true, function(err){
				if(err){
					return done();
				}
				return done('Did not replicate error');
			});
		});
		it('should return error is text message is null', function(done){
			showMeMessage(null, function(err){
				if(err){
					return done();
				}
				return done('Did not replicate error');
			});
		});
		it('should return error message for invalid subject', function(done){
			showMeMessage(null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not provide user with command list');
			}, {text: "show me fkdsflsjk"});
		});
		it('should return a reply', function(done){
			let message = 'Please show me dogs';
			showMeMessage(null, done, {text: message});
		});
	});
});