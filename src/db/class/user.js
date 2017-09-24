"use strict";

function isPositive(value){
	return value > 0;
}
function isInteger(value){
	return value === parseInt(value, 10)
}

module.exports = class User{
	constructor(user) {
		let self = this;
		self._id;
		self.discordId;
		self.name;
		self.money = 0;
		if(user === null || user === undefined){
			return;
		}
		self._id = user._id;
		self.name = user.name;
		self.discordId = user.discordId;
		if(user.discordId === null || user.discordId === undefined){
			self.discordId = self.name;
		}
		if(isInteger(user.money) && isPositive(user.money)) {
			self.money = user.money;
		}
		return;
	}
	addMoney(value){
		let self = this;
		if(isInteger(value) && isPositive(value)){
			self.money = self.money + value;
		}
	}
	subtractMoney(value, callback){
		let self = this;
		if(isInteger(value) && isPositive(value)){
			if(self.money < value){
				return callback('Insufficient funds.');
			}
			self.money = self.money - value;
		}
		return callback(null, self.money);
	}
};