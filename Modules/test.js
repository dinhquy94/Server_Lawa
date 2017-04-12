var hardware_controller    = require('./hardware_controller'); 
 

function blink() {
setTimeout(function () {
  	hardware_controller.ControlDevice("DMN1001", {
	MucNuoc: 1 
}) ; 
}, 0); 
setTimeout(function () {
  	hardware_controller.ControlDevice("DMN1001", {
	MucNuoc: 0
}) ; 
}, 200); 
setTimeout(function () {
  	 blink();
}, 400); 
}
blink();
