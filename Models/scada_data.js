var mongodb = require('./Mongodb');
var main_table = "scada_data";   
//THis function get all data from scada_location
module.exports.updateData = function(data) {  
	mongodb.connect(function(db){ 		
			try {				 
					var dataInsert = {
						"device_id" :  data.device_id,		
						"time" : data.time,
						"data" : {
							"dungluongpin": data.dungluongpin,
							"mucnuoc" : data.mucnuoc, 
							"cambien_laser": {
					      		cb_laser1: data.cambien_laser.laser1,
					      		cb_laser2: data.cambien_laser.laser2,
					      		cb_laser3: data.cambien_laser.laser3,
					      		cb_laser4: data.cambien_laser.laser4
				      		}
						}
					};
				    db.collection(main_table).insert(dataInsert);				 
			  		//db.close();
			} catch (e) {
			   Errlog(e + "\n At scadat_data.js addNewEvent()");
			}
	});
}
module.exports.getCurrentState = function(device_id, callback) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({device_id: device_id}).sort({ time: -1 }).limit(1).toArray(function(err, items) {
				if(err) console.log(err + " scada_data.js - getCurrentState()");  				
				callback(items[0]); 		
				//db.close();
				}); 
			} catch (e) {
			   Errlog(e + "\n At scadat_data.js getCurrentState()");
			}
	});
}
 module.exports.getHistoryState = function(device_id, callback) {  
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({device_id: device_id}).sort({ time: -1 }).limit(15).toArray(function(err, items) {
				if(err) console.log(err + " scada_data.js - getCurrentState()");  				
				callback(items); 		
				//db.close();		
				}); 
			} catch (e) {
			   Errlog(e + "\n At scadat_data.js getCurrentState()");
			}
	});
}

 module.exports.getHistoryByMin = function(device_id, callback) {
	mongodb.connect(function(db){ 		
			try {				 
				db.collection(main_table).find({device_id: device_id}).sort({ time: -1 }).limit(84).toArray(function(err, items) {
				if(err) console.log(err + " scada_data.js - getCurrentState()");
				var valueByMin = [0,0,0,0,0,0];
				var j = 0;
				for(var i = 0; i< items.length; i++) {
					//console.log(items[i].data.mucnuoc);
					valueByMin[j] += items[i].data.mucnuoc / 14;
					if( i >= 14*(j+1) - 1) { 
						var n = parseFloat(valueByMin[j]); 
						valueByMin[j] = Math.round(n * 1000)/1000;
						//console.log(valueByMin[j]);
						j++;
					}
				}
				//	console.log(items[1]);
				callback(valueByMin); 		
				//db.close();		
				}); 
			} catch (e) {
			   Errlog(e + "\n At scadat_data.js getCurrentState()");
			}
	});
}
module.exports.getHistoryByMonth = function(device_id, callback) { 
	mongodb.connect(function(db){
			try {
				db.collection(main_table).find({device_id: device_id}).sort({ time: -1 }).limit(51840).toArray(function(err, items) {
				if(err) console.log(err + " scada_data.js - getCurrentState()");  
				//86400
				calAvgByList(items, 8640, function(valueByMin) {
					//db.close();		
					callback(valueByMin); 		
				}); 
				}); 
			} catch (e) {
			   Errlog(e + "\n At scadat_data.js getCurrentState()");
			}
	});
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}; 
function calAvgByList(items, frequency, callback) {
	var valueByMin = [0,0,0,0,0,0]; 
	var j = 0;
	var checkenough = 0;
	for(var i = 0; i< items.length; i++) {
		checkenough ++;
		valueByMin[j] += items[i].data.mucnuoc / frequency; 
		if( i >= frequency*(j+1) - 1) { 
			checkenough = 0;
			var n = parseFloat(valueByMin[j]);
			valueByMin[j] = Math.round(n * 1000)/1000; 
			j++;
		}
		 
	} 
	valueByMin[j] = Math.round(((parseFloat(valueByMin[j]) * frequency) / checkenough ) * 1000)/1000;
	valueByMin.remove(0);
	callback(valueByMin);
}

