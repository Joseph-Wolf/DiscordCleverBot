"use strict";

const assert = require('assert');
const showMe = require('../src/showMe.js');
const availableCategories = ['abstract', 'animals', 'cats', 'city', 'food', 'nature', 'dogs'];

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
});