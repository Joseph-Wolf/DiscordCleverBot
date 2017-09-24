"use strict";

const getRandomInt = require('./getRandomInt.js');

module.exports = function(){
  return getRandomInt(0, Number.MAX_SAFE_INTEGER).toString();
}