var mongodb = require('../Models/Mongodb');
var main_table = "scada_users";   
var login = false;
var crypto = require('crypto-js');
var encrypt_key = "21041994";  
 
 // Mã hóa 
/** var @username: String
*	var @password: String
*	callback(err, result: Boolean)
*/	 
 
module.exports.Login = function(username, password, callback) { 
 		mongodb.connect(function(db){ 
 			db.collection(main_table).find(
 			{
 				username: username,
 				passwordvalue: password	
 			}
 			).count(function (e, count) {
 				if(count == 0){
				  callback('null');
				}else{
					createToken(username, function(token_key){
						callback(token_key);
					})					
				}  
				//db.close();
 			}); 
 		}); 
}
 var generateToken = function(username, callback) { 
	var time = Math.floor(new Date() / 1000);
	var token_key = crypto.AES.encrypt( time + username, encrypt_key).toString();
	var expire_time = time + 30*60;
	callback(token_key, time, expire_time);
}
var createToken = function(username, callback){
	generateToken(username, function(token_key, time, expire_time){
		 var Token_key = {
		 	username: username,
		 	token_key: token_key,
		 	time: time,
		 	expire_time: expire_time,
		 }; 
		 mongodb.connect(function(db){ 
			db.collection('token_key').insert( Token_key , function(err, result) {
				if (err) Errlog("authentication.js - createToken()");
				callback(token_key);
				//db.close();
			});

		});
	});
} 
module.exports.isLogin = function(token_key, callback){ 
	var time = Math.floor(new Date() / 1000);
 	mongodb.connect(function(db){ 
			db.collection('token_key').find( {
					"token_key" : token_key,
					"expire_time": { $gt: time }
				} ).toArray(function(err, items) {
					if (err) Errlog("authentication.js - isLogin()"+ err.toString()); 
					if(items){
						callback(null);
					}else{
						try {
						   db.collection('token_key').updateOne(
						      { "token_key" :  token_key },
						      { $set: { "expire_time" : time + 30*60 } }
						   );
						} catch (e) {
						   Errlog(e + "\n At authentication isLogin()");
						}
					}
				//db.close();
			});
	});  
}
module.exports.getMaThietBibyToken = function(token_key, callback){
	var time = Math.floor(new Date() / 1000);
	 mongodb.connect(function(db){ 
	 	db.collection('token_key').find({
					"token_key" : token_key					 
		}).toArray(function(err, items) {
			if(err) Errlog("cant get getMaThietBibyToken");
			//console.log(items);
			if(!items) {
				callback(null); 
			} else {
				var username = items[0].username;
				db.collection('scada_users').find({
						"username" : username					 
				}).toArray(function(err, user) { 
					if (err) {Errlog("getMaThietBibyToken() - find deviceid from user ")}
					if(user.length == 0){callback(null);}
					else { 
						//console.log(user);
						callback(user[0].deviceid)
					}
					//db.close();
				});
			}
			
		});
	});
}
 