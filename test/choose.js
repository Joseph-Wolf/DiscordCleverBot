"use strict";

const assert = require('assert');
const choose = require('../src/util/choose.js');
const chooseMessage = require('../src/messages/choose.js');
const optionsList = ['one', 'two', 'three', 'four'];
const numberOfTrials = 10;

describe('Choose', function(){
	it('should pick from [or] separated list', function(){
		let orOptionsList = optionsList.join(' or ');
		let index = 0;
		for(index = 0; index < numberOfTrials; index++){
			assert.ok(optionsList.indexOf(choose(orOptionsList)) !== -1);
		}
	});
	it('should pick from [,] separated list', function(){
		let commaOptionsList = optionsList.join(', ');
		let index = 0;
		for(index = 0; index < numberOfTrials; index++){
			assert.ok(optionsList.indexOf(choose(commaOptionsList)) !== -1);
		}
	});
	it('should pick from [,] or [or] separated list', function(){
		let commaAndOrSeparatesList = null
		let joinCharToggle = false;
		let index = 0;
		optionsList.forEach(function(item){
			joinCharToggle = !joinCharToggle;
			if(commaAndOrSeparatesList === null){
				commaAndOrSeparatesList = item;
			} else if(joinCharToggle){
				commaAndOrSeparatesList = commaAndOrSeparatesList + ', ' + item;
			} else {
				commaAndOrSeparatesList = commaAndOrSeparatesList + ' or ' + item;
			}
		});
		for(index = 0; index < numberOfTrials; index++){
			assert.ok(optionsList.indexOf(choose(commaAndOrSeparatesList)) !== -1);
		}
	});
	it('should pick an option from an array', function(){
		let index = 0;
		for(index = 0; index < numberOfTrials; index++) {
			assert.ok(optionsList.indexOf(choose(optionsList)) !== -1);
		}
	});
	describe('Message', function(){
		it('should return sanatize error message', function(done){
			chooseMessage(true, null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
		});
		it('should return error message for null text', function(done){
			chooseMessage(null, null, function(err, reply){
				if(err){
					return done();
				}
				return done('Did not reuturn error.');
			});
		});
		it('should return a reply', function(done){
			let message = 'Please choose x, y, or z.';
			chooseMessage(null, {text: message}, done)
		});
	});
});