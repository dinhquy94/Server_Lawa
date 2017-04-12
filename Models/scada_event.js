var mongodb = require('./Mongodb');
var main_table = "scada_event";  
//THis function get all data from scada_location
module.exports.addNewEvent = function(data) {  
	mongodb.connect(function(db){ 
			var event = {
			    device_id: data.device_id,
			    type: "dataEvent",
			    EventName: data.EventName,
			    time: data.time,
			    data: data.data,
				flag: 0
		 	}
			console.log(event);
			db.collection(main_table).insert( event , function(err, result) {
				if (err) Errlog("scada_event.js - addNewEvent()");
				//db.close();
			}); 
	});
}
module.exports.getCurrentSystemState = function(device_id, callback) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({
					device_id: device_id, 
					EventName: "laserDetected", 
					flag: 0
				}).count(function(err, count) {
				if(err) console.log(err + " scada_event.js - getCurrentSystemState()");  
				
				if(count) {
					callback(false);
				}else{
					callback(true);
				}			
				//db.close();	 				
				}); 
			} catch (e) {
			   Errlog(e + "\n At scada_event.js getCurrentSystemState()");
			}
	});
}
module.exports.getCurrentLaserStateLaser1 = function(device_id,callback) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({
					device_id: device_id, 
					EventName: "laserDetected",		
					"data.laser1" : 1,
					flag: 0
				}).count(function(err, count) {
				if(err) console.log(err + " scada_event.js - getCurrentLaserStateLaser1()");   				
				if(count) {
					callback(false);
				}else{
					callback(true);
				}				 				
				//db.close();
				}); 
			} catch (e) {
			   Errlog(e + "\n At scada_event.js getCurrentLaserStateLaser1()");
			}
	});
}

module.exports.getCurrentLaserStateLaser2 = function(device_id,callback) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({
					device_id: device_id, 
					EventName: "laserDetected",		
					"data.laser2" : 1,
					flag: 0
				}).count(function(err, count) {
				if(err) console.log(err + " scada_event.js - getCurrentLaserStateLaser2");  
				 
				if(count) {
					callback(false);
				}else{
					callback(true);
				}		
				//db.close();		 				
				}); 
			} catch (e) {
			   Errlog(e + "\n At scada_event.js getCurrentLaserStateLaser2");
			}
	});
}
module.exports.getCurrentLaserStateLaser3 = function(device_id,callback) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({
					device_id: device_id, 
					EventName: "laserDetected",		
					"data.laser3" : 1,
					flag: 0
				}).count(function(err, count) {
				if(err) console.log(err + " scada_event.js - getCurrentLaserStateLaser3");  
				
				if(count) {
					callback(false);
				}else{
					callback(true);
				}	
				//db.close();			 				
				}); 

			} catch (e) {
			   Errlog(e + "\n At scada_event.js getCurrentLaserStateLaser3");
			}
	});
}
module.exports.getCurrentLaserStateLaser4 = function(device_id,callback) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({
					device_id: device_id, 
					EventName: "laserDetected",		
					"data.laser4" : 1,
					flag: 0
				}).count(function(err, count) {
				if(err) console.log(err + " scada_event.js - getCurrentLaserStateLaser4"); 				
				if(count) {
					callback(false);

				}else{
					callback(true);
				}			
				//db.close();	 				
				}); 
			} catch (e) {
			   Errlog(e + "\n At scada_event.js getCurrentLaserStateLaser2");
			}
	});
}
module.exports.getCurrentLaserState = function(device_id,callback) {  
	module.exports.getCurrentLaserStateLaser1(device_id, function(laser1) {
		module.exports.getCurrentLaserStateLaser2(device_id, function(laser2) {
			module.exports.getCurrentLaserStateLaser3(device_id, function(laser3) {		
				module.exports.getCurrentLaserStateLaser4(device_id, function(laser4) {
					  var laser = {
					 	laser1: laser1,
					 	laser2: laser2,
					 	laser3: laser3,
					 	laser4: laser4	 	
					  }
					  callback(laser);
				});
			});

		});
	});
	
}
module.exports.setSafe = function(device_id) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).update(
						    { 	
						    	device_id: device_id, 
								EventName: "laserDetected",									
								flag: 0
							},
						      { $set: { flag : 1 } },
						       {multi:true}
							);
				//db.close();
			} catch (e) {
			   Errlog(e + "\n At scada_event.js setSafe()");
			}
	});
}
