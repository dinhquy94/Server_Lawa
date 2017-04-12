var mongodb = require('./Mongodb');
var main_table = "scada_location";  
//THis function get all data from scada_location
module.exports.getAllDevices = function(callback) {  
	mongodb.connect(function(db){ 
	db.collection(main_table).find().toArray(function(err, items) {
		if(err) console.log(err + " location_device.js - getAllDevices()");   
		//console.log(items);
		callback(items); 
		//db.close();
	}); 
   
}); 
}
module.exports.getLocationName = function(device_id, callback) {  
	mongodb.connect(function(db){ 
	db.collection(main_table).find({_id: device_id}).toArray(function(err, items) {
		if(err) console.log(err + " location_device.js - getAllDevices()");   
		if(!items) callback(null); 
		console.log(items);
		callback(items[0].locationname); 
		//db.close();
	}); 
   
}); 
}
 