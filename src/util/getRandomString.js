"use strict";

const getRandomInt = require('./getRandomInt.js');

module.exports = function(){
  return getRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER).toString();
}