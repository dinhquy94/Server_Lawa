require('../Logs/rewrite_log');
var io = require('socket.io').listen(18082);  
var login = require('./authentication');
var scada_data = require('../Models/scada_data');
var scada_event = require('../Models/scada_event');
var scada_device_state = require('../Models/scada_device_state');
var hardware_controller = require('../Modules/hardware_controller');
var location_device = require('../Models/location_device');

module.exports.startSocketServer = function(){
	console.log("["+ new Date() + "] "+ "Starting socket IO on port 8084");
	io.sockets.on('connection', function (socket) { 
    socket.on('unsubscribe', function(ID) {  
      }); 
      socket.on('Logindata', function(data) {  
    	if(data.username != null && data.password != null ){   
    		login.Login(data.username, data.password, function(token_key){
    			io.sockets.to(data.clientid).emit('login_result', token_key); 
  		  	});  
    	}else{
    		socket.join(data.username); 
    		io.sockets.in(data.username).emit('login_result', "null");
     	}
     });
         socket.on('isLogin', function(data) {   
		socket.join(data.token_key); 
		login.isLogin(data.token_key, function(isLogin){
			io.sockets.in(data.token_key).emit('isloginresult', isLogin);
 		}); 
    });
	  socket.on('requestCurrentState', function(data) {  
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){			
			//console.log(deviceid);
			scada_data.getCurrentState(deviceid, function(result_schema){
				//result_schema.locationname = "Null";
				location_device.getLocationName(deviceid, function(locationname) { 
					if(result_schema) {
						result_schema.locationname = locationname;
						io.sockets.in(data.token_key).emit('respondCurrentState', result_schema);
					} 
				});  
		});
		});		 
    });
	  socket.on('requestHistoryState', function(data) {  
		
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){			
			//console.log(deviceid);

			scada_data.getHistoryState(deviceid, function(result_schema){			 
			//	result_schema.sysStatus = sysStatus;
				io.sockets.in(data.token_key).emit('respondHistoryState', result_schema);
 			}); 
		});		 
    }); 
	socket.on('changeLaserEmitter', function(data) {   
		//console.log("testok");
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){  
				hardware_controller.changeLaserEmitter(deviceid, {
					command: "change_laser",
					val: data.value,
					laser_num: data.laser_num
				}); 
		});
    });
    socket.on('turnLed', function(data) {  
		//console.log(data);
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){ 
			if(data.data.value == true) {
				hardware_controller.ControlDevice(deviceid, {MucNuoc: 1});
			}else{
				hardware_controller.ControlDevice(deviceid, {MucNuoc: 0});
			}
			
		});
    });
    socket.on('requestCurrentLaserState', function(data) {
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){ 
			scada_event.getCurrentLaserState(deviceid, function(laserStatus){ 
				io.sockets.in(data.token_key).emit('respondCurrentLaserState', laserStatus);
 			});
		});
    });
    socket.on('requestCurrentLed', function(data) {
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){ 
			scada_device_state.getCurrentLed(deviceid, 1, function(ledStatus){ 
				io.sockets.in(data.token_key).emit('respondCurrentLed', ledStatus);
 				//console.log(ledStatus);
			});
		});
    });
    socket.on('requestHistoryByMonth', function(data) {
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){ 
			scada_data.getHistoryByMonth(deviceid, function(Arraylist){ 
				io.sockets.in(data.token_key).emit('respondHistoryByMonth', Arraylist);
 				//console.log(ledStatus);
			});
		});
    });

    
	socket.on('requestWarningChangeStatus', function(data) {  
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){  
			var port;
			var value;
			if(data.data.warning_number == 1) {
				port = 12
			}
			if(data.data.warning_number == 2) {
				port = 13
			}
				if(data.data.value) {
				value = 1
			} else{
				value = 0;
			}
			 hardware_controller.ControlDevice(deviceid, {
				type: "change",
				value:  value,
				id: data.data.warning_number
			});  
			 io.sockets.in(data.token_key).emit('respondWarningChangeStatus', true);
 		});
    }); 




	socket.on('requestWarningStatus', function(data) {  
	socket.join(data.token_key);  
	login.getMaThietBibyToken( data.token_key, function(deviceid){
		scada_device_state.getCurrentWarning(deviceid, function(WarningStatus){ 
			scada_device_state.getCurrentLogicDeviceStatus(deviceid, 12, function(WarningStatus1){
				scada_device_state.getCurrentLogicDeviceStatus(deviceid, 13, function(WarningStatus2){
					var dataRespond = {
						generalWarningstate: WarningStatus,
						WarningStatus1: WarningStatus1,
						WarningStatus2: WarningStatus2
					}; 
					io.sockets.in(data.token_key).emit('respondWarningStatus', dataRespond);
 				});
			});
			
		}); 
		
	});
    });
	socket.on('setCurrentSafe', function(data) {  
		socket.join(data.token_key); 
		login.getMaThietBibyToken( data.token_key, function(deviceid){ 
			scada_event.setSafe(deviceid);
		});
    });
});
} ;
