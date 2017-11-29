"use strict";

const assert = require('assert');
const randomInt = require('random-int');
const getFact = require('../../src/util/getFact.js');

describe('getFact', function(){
	describe('cats', function(){
		it('should return a random fact', function(done){
			getFact('cat', done);
		});
	});
	describe('dogs', function(){
		it('should return a random fact', function(done){
			getFact('dogs', done);
		});
	});
	describe('years', function(){
		it('should return a random fact', function(done){
			getFact('year', done);
		});
		it('should return a specific fact', function(done){
			let number = randomInt(100, 2000);
			getFact('year ' + number, function(err, response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
	describe('date', function(){
		it('should return a random fact', function(done){
			getFact('date', done);
		});
		it('should return a specific fact', function(done){
			let month = randomInt(1, 12);
			let day = randomInt(1, 32);
			getFact('date ' + month + ' ' + day, done);
		});
		it('should return an random fact for invalid month', function(done){
			let month = randomInt(-99999, 0);
			let day = randomInt(1, 32);
			getFact('date ' + month + ' ' + day, done);
		});
		it('should return an random fact for invalid day', function(done){
			let month = randomInt(1, 12);
			let day = randomInt(50, 9999);
			getFact('date ' + month + ' ' + day, done);
		});
	});
	describe('number', function(){
		it('should return a random fact', function(done){
			getFact('number', done);
		});
		it('should return a specific fact', function(done){
			let number = randomInt(0, 99999);
			getFact('number ' + number, function(err, response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
	describe('trivia', function(){
		it('should return a random fact', function(done){
			getFact('trivia', done);
		});
		it('should return a specific fact', function(done){
			let number = randomInt(0, 99999);
			getFact('trivia ' + number, function(err, response){
				assert.ok(response);
				assert.ok(response.indexOf(number) !== -1);
				done();
			});
		});
	});
});