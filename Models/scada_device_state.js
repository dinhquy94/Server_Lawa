var mongodb = require('./Mongodb');
var main_table = "scada_device_state";  
//THis function get all data from scada_location
module.exports.updateData = function(data) {  
	mongodb.connect(function(db){ 
			try {
			   db.collection(main_table).updateOne(			   	
			      { 
			      	"device_id" :  data.device_id,
			      	"type":"dataDevice"
			  	  },
			      { $set: { 
			      	 "devices": data.devices 
			      } 
			  }
			  ); 
			 // db.close();
			} catch (e) {
			   Errlog(e + "\n At scadat_device_state.js updateData()");
			}
	});
}
module.exports.getCurrentWarning  = function(device_id, callback) {  	
	 module.exports.getCurrentLogicDeviceStatus(device_id, 12, function(device1){
	 	module.exports.getCurrentLogicDeviceStatus(device_id, 13, function(device2){
	 		if(device1 || device2 ) {
				callback(true);
			}else{
				callback(false);
			}
	 	});
	 });
	
 }
module.exports.getCurrentLogicDeviceStatus  = function(device_id, port, callback) {  
	mongodb.connect(function(db){ 
	db.collection(main_table).find( 
	    { 
            device_id: device_id, 
                devices: { 
                    $elemMatch: { port: port, value: 1  }                   
                    }
             }              
		).count(function(err, count) {
		if(err) console.log(err + " location_device.js - getCurrentWarning()");   
			if(count > 0) {
				callback(true);
			}else{
				callback(false);
			}
		//db.close();	
	}); 
}); 
} 
module.exports.getCurrentLed  = function(device_id, port, callback) {  
	//console.log(device_id);
	mongodb.connect(function(db){ 
	db.collection(main_table).find( 
	    {
            device_id: device_id, 
                devices: { 
                    $elemMatch: { port: port }                   
                 }
        }              
		).toArray(function(err, items) {
			if(items[0].devices[0].value == 1) 
				callback(true);
			else callback(false);
		});
	//db.close();	
}); 
};
 