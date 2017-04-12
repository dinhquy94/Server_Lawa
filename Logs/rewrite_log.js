var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'a'});
var data_log_file = fs.createWriteStream(__dirname + '/data_log_file.log', {flags : 'a'});
var err_log_file = fs.createWriteStream(__dirname + '/err_log_file.log', {flags : 'a'});
var log_stdout = process.stdout; 
console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
}; 
global.Datalog = function(d) {
	data_log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
}
global.Errlog = function(d) {
	err_log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
}