"use strict";

module.exports = function (db, cleverbot){
	db.find({key: cleverbot.DBKey}).limit(1).toArray(function(err, items){
		if(err){
			throw err;
		}
		let doc = items[0];
		if(doc === null || doc === undefined || doc.value === null || doc.value === undefined) {
			console.info('No cleverbot credentials are recorded');
			doc = {value: {user: null, pass: null}};
		}
		return cleverbot.authenticate(doc.value, function(err, accepted){
			if(err){
				console.error('rejected cleverbot credentials');
				return console.error(err);
			}
			return console.info('accepted cleverbot credentials');
		});
	});
}