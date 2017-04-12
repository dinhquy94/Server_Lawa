"use strict";
var mqtt    = require('mqtt');
const socketserver= require("./Server/socketserver");
var location_device = require('./Models/location_device');
var handle_message = require("./Modules/handle_messages");
var client  = mqtt.connect('mqtt://localhost:1883', 
{
	username: 'client1',
	password: 'passwd1'
}
);   
socketserver.startSocketServer(); 
 String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};
client.on('connect', function () { 
  location_device.getAllDevices(function(result){ 
    for(var i = 0; i< result.length; i++){ 
      console.log(result[i]._id); 
        client.subscribe('event/data/' + result[i]._id , { qos: 2 }, function(err, granted) {
          if (err)
            console.log(err);
          else
            console.log("subcribed event/detector/" , granted);
        });
        client.subscribe('data/mucnuoc/' + result[i]._id , { qos: 2 }, function(err, granted) {
          if (err)
            console.log(err);
          else
            console.log("client connected : ", granted);
        });
        client.subscribe('data/bienled/' + result[i]._id , { qos: 2 }, function(err, granted) {
          if (err)
            console.log(err);
          else
            console.log("client connected : ", granted);
        }); 
        client.subscribe('data/data/' + result[i]._id , { qos: 2 }, function(err, granted) {
          if (err)
            console.log(err);
          else
            console.log("client connected : ", granted);
        });
         client.subscribe('device/state/' + result[i]._id , { qos: 2 }, function(err, granted) {
          if (err)
            console.log(err);
          else
            console.log("client connected : ", granted);
        });
        client.subscribe('system/warning/' + result[i]._id , { qos: 2 }, function(err, granted) {
          if (err)
            console.log(err);
          else
            console.log(" subcribed system/warning", granted);
        });  
    }
  }); 
}); 
client.on('message', function (topic, message) {    
  handle_message.handle(topic, message.toString());
  client.subscribe(topic , { qos: 2 }, function(err, granted) {
    if (err)
      console.log(err); 
  });
});
