"use strict";

module.exports = function (db, cleverbot){
	db.get({key: cleverbot.DBKey}, function(err, doc){
		if(err || doc === null || doc === undefined || doc.value === null || doc.value === undefined || doc.value.user === null || doc.value.user === undefined) {
			return;
		}
		return cleverbot.authenticate(doc.value, function(err, accepted){
			if(err){
				console.log('rejected cleverbot credentials');
				console.error(err);
				return
			}
			console.log('accepted cleverbot credentials');
			return
		});
	});
}