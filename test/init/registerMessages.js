"use strict";

const assert = require('assert');

//This test file is fairly finicky.
//Is there a way to get the expressions used automatically?

describe('registerMessages', function(){
	describe('Expressions', function(){
		describe('ShowMe', function(){
			it('Should match commands', function(){
				let expectedMatches = ['show me', 'please show me',' odosofshow meksksksks'];
				let expression = /show me/i;
				let index = 0;
				for(index = 0; index < expectedMatches.length; index++){
					assert.ok(expression.test(expectedMatches[index]));
				}
			});
		});
	});
});