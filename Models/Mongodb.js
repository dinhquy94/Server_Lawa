var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
//the MongoDB connection
var connectionInstance;

module.exports.connect = function(callback) {
  //if already we have a connection, don't connect to database again
  if (connectionInstance) {
    callback(connectionInstance);
    return;
  } 
  var db = new Db('scada', new Server("0.0.0.0", "18084", { auto_reconnect: true }));
  db.open(function(error, databaseConnection) {
    if(error) {console.log("Can't Connect to mongodb (mongodb.js - connect())"); }
    connectionInstance = databaseConnection;
    callback(databaseConnection);
  });
}; 