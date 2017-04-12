var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://14.162.94.30:1883',
{
	username: 'owntracks',
	password: '123456'
}
);  
client.on('connect', function () {
	console.log("client connected"); 
	client.subscribe('device/command/DMN1001', { qos: 2 }, function(err, granted) {
      if (err)
        console.log(err);
      else
        console.log("dawng ky nhan command : ", granted);
    });  
});
var SerialPort = require("serialport").SerialPort; 
    var serialPort = new SerialPort("/dev/ttyAMA0", {
        baudrate: 9600,
        parser: SerialPort.parsers.readline("\n")
    }); 
	serialPort.on('data', function(data) {  
		console.log(data);
		 try {
	    	object_dulieu = JSON.parse(data);   
	    	var MATHIETBI = object_dulieu.MaTB;
	    	console.log("DL nhan duoc:" + data); 
	    	client.publish('data/data/' + MATHIETBI , data); 
		 } catch (e) {
		 	console.log("cant parse");
		 }
	}); 
	serialPort.on("open", function () {
		console.log("SerialPort connected"); 
	});
	client.on('message', function (topic, message) {  
		if(topic.startsWith("device/command/")) {
			var command = JSON.parse(message);
			var control_obj = {
					time: (Math.floor(new Date() / 1000)),
			 		device_id: data.MaTB,
			 		dungluongpin: 0,
			 		mucnuoc: command.MucNuoc,
			 		cambien_laser: {
			 			laser1: 0,
			 			laser2: 0,
			 			laser3: 0,
			 			laser4: 0
			 		}					 
			}; 
			console.log(control_obj);
			serialPort.write(JSON.stringify(control_obj) + "\n", function(err, results) {
			    console.log("ghi du lieu nhan duoc ra Serial ");
			  }); 
		}  
		client.subscribe(topic , { qos: 2 }, function(err, granted) {
			if (err)
			  console.log(err);
			else
			  console.log("re-subcribed", granted);
		});
	});