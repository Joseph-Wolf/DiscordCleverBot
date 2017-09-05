"use strict";

const assert = require('assert');
const getFact = require('../src/getFact.js');
const getRandomInt = require('../src/util/getRandomInt.js');

describe('getFact', function(){
	describe('cats', function(){
		it('should return a random fact', function(done){
			getFact('cat', function(response){
				assert.ok(response);
				done();
			})
		});
	});
	describe('years', function(){
		it('should return a random fact', function(done){
			getFact('year', function(response){
				assert.ok(response);
				done();
			});
		});
		it('should return a specific fact', function(done){
			let number = getRandomInt(100, 2000);
			getFact('year ' + number, function(response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
	describe('date', function(){ //TODO: Fix
		it('should return a random fact', function(done){
			getFact('date', function(response){
				assert.equal('sdfks', response);
				done();
			});
		})
	});
	describe('number', function(){
		it('should return a random fact', function(done){
			getFact('number', function(response){
				assert.ok(response);
				done();
			});
		});
		it('should return a specific fact', function(done){
			let number = getRandomInt(0, 99999);
			getFact('number ' + number, function(response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
	describe('trivia', function(){
		it('should return a random fact', function(done){
			getFact('trivia', function(response){
				assert.ok(response);
				done();
			});
		});
		it('should return a specific fact', function(done){
			let number = getRandomInt(0, 99999);
			getFact('trivia ' + number, function(response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
});