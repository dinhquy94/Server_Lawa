var mongodb = require('./Mongodb');
var main_table = "scada_log";  
var scada_log = function() {
    var getData = function (device_id) {
        mongodb.connect(function(db){ 		
            try {
                db.collection(main_table).find({device_id: device_id}).sort({ time: -1 }).toArray(function(err, items) {
                if(err) console.log(err + " scada_log.js - getData()");  				
                    return items[0]; 		
               // db.close();
                }); 
            } catch (e) {
                Errlog(e + "\n At scada_log.js getData()");
            }
        });
    }
   var insertData = function (device_id, data) {
       var event = {
			    device_id: device_id,
			    time: data.time,
			    EventName: data.EventName,
                user: data.user
		 	}
        mongodb.connect(function(db){ 		
            try {				 
                db.collection(main_table).insert(event, function(err, result) {
                if(err) console.log(err + " scada_log.js - insertData()");  				
                    return true; 		
               // db.close();
                }); 
            } catch (e) {
            Errlog(e + "\n At scada_log.js insertData()");
                return false;
            }
        });
    }
    return {
        getData: getData,
        insertData: insertData
    }
}
module.exports.scada_log = scada_log;
var log = new scada_log();
log.insertData("TB210494", {
    time: 1221232356323,
    EventName: "setSafe",
    user: "admin"
});
//console.log(log.getData());
