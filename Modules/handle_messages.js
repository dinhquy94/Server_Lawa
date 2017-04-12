var mongodb = require('../Models/Mongodb');
var main_table = "scada_event";  
var scada_event = require("../Models/scada_event");
var scada_data = require("../Models/scada_data");
var scada_device_state = require("../Models/scada_device_state");
//THis function get all data from scada_location
module.exports.handle = function(topic, data, callback) { 
	console.log(topic + data); 
	 //scada_event.addNewEvent();
	 data = JSON.parse(data);
	 if(topic.startsWith("event/data/")) {
	 	var event_data =
	 	{ 
	 		time : (Math.floor(new Date() / 1000)),
		 	device_id : data.mathietbi,
		 	EventName : data.EventName,
		 	data : {
		 		laser1: data.data[0],
		 		laser2: data.data[1],
		 		laser3: data.data[2],
		 		laser4: data.data[3],
	 		}
	 	}
	 	scada_event.addNewEvent(event_data);
	 } 	 
	 if(topic.startsWith("data/data/")) {
		 console.log(data);
		 //data.congsuatpinmattroi = 0;
		 //data.mathietbi = ;
		 if(data.header == "MucNuoc") {
			var data_data = {
	 		time: (Math.floor(new Date() / 1000)),
	 		device_id: data.MaTB,
	 		dungluongpin: 0,
	 		mucnuoc: data.data,
	 		cambien_laser: {
	 			laser1: 0,
	 			laser2: 0,
	 			laser3: 0,
	 			laser4: 0
	 		}
	 	};
		 
	 	scada_data.updateData(data_data);
		 }
	 	
	 }
	 if(topic.startsWith("data/mucnuoc/")) {
	 	var data_data = {
	 		time: (Math.floor(new Date() / 1000)),
	 		device_id: data.MaTB,
	 		dungluongpin: 0,
	 		mucnuoc: data.data,
	 		cambien_laser: {
	 			laser1: 0,
	 			laser2: 0,
	 			laser3: 0,
	 			laser4: 0
	 		}
	 	};
	 	scada_data.updateData(data_data);
	 }
	 if(topic.startsWith("device/state/")) {
	 	var device_state = { 
	 		device_id: data.mathietbi,
	 		devices: data.devices
	 	};
	 	console.log(JSON.stringify(device_state));
	 	scada_device_state.updateData(device_state);
	 }
	 if(topic.startsWith("data/bienled/")) {
	 	var devices = [{
	 					port: 1,
	 					value: data.data
	 				   }];
	 	var device_state = { 
	 		device_id: data.MaTB,
	 		devices: devices
	 	};
	 	console.log(JSON.stringify(device_state.devices[0]));
	 	scada_device_state.updateData(device_state);
	 }
	 
}