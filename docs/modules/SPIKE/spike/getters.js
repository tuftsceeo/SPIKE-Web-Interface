/**  Get the information of all the ports and devices connected to them
 * @ignore
 * @returns {object} <p> An object with keys as port letters and values as objects of device type and info </p>
 * @example
 * // USAGE 
 * 
 * var portsInfo = await mySPIKE.getPortsInfo();
 * // ports.{yourPortLetter}.device --returns--> device type (ex. "smallMotor" or "ultrasonic") </p>
 * // ports.{yourPortLetter}.data --returns--> device info (ex. {"speed": 0, "angle":0, "uAngle": 0, "power":0} ) </p>
 * 
 * // Motor on port A
 * var motorSpeed = portsInfo["A"]["speed"]; // motor speed
 * var motorDegreesCounted = portsInfo["A"]["angle"]; // motor angle
 * var motorPosition = portsInfo["A"]["uAngle"]; // motor angle in unit circle ( -180 ~ 180 )
 * var motorPower = portsInfo["A"]["power"]; // motor power
 * 
 * // Ultrasonic Sensor on port A
 * var distance = portsInfo["A"]["distance"] // distance value from ultrasonic sensor
 * 
 * // Color Sensor on port A
 * var reflectedLight = portsInfo["A"]["reflected"]; // reflected light
 * var color = portsInfo["A"]["color"]; // name of detected color
 * var RGB = portsInfo["A"]["RGB"]; // [R, G, B]
 * 
 * // Force Sensor on port A
 * var forceNewtons = portsInfo["A"]["force"]; // Force in Newtons ( 1 ~ 10 ) 
 * var pressedBool = portsInfo["A"]["pressed"] // whether pressed or not ( true or false )
 * var forceSensitive = portsInfo["A"]["forceSensitive"] // More sensitive force output( 0 ~ 900 )
 */
Service_SPIKE.prototype.getPortsInfo = function () {
    return this.ports;
}

/**  get the info of a single port
 * @ignore
 * @param {string} letter Port on the SPIKE hub
 * @returns {object} Keys as device and info as value
 */
Service_SPIKE.prototype.getPortInfo = function (letter) {
    return this.ports[letter];
}

/**  Get battery status
 * @ignore
 * @returns {integer} battery percentage
 */
Service_SPIKE.prototype.getBatteryStatus = function () {
    return this.batteryAmount;
}

/**  Get info of the hub
 * @ignore
 * @returns {object} Info of the hub
 * @example
 * var hubInfo = await mySPIKE.getHubInfo();
 * 
 * var upDownDetector = hubInfo["gyro"][0];
 * var rightSideLeftSideDetector = hubInfo["gyro"][1];
 * var frontBackDetector = hubInfo["gyro"][2];
 * 
 * var rollAcceleration = hubInfo["pos"][0];  
 * var pitchAcceleration = hubInfo["pos"][1]; 
 * var yawAcceleration = hubInfo["pos"][2];   
 * 
 * var yawAngle = hubInfo["pos"][0];
 * var pitchAngle = hubInfo["pos"][1];
 * var rollAngle = hubInfo["pos"][2];
 * 
 * 
 */
Service_SPIKE.prototype.getHubInfo = function () {
    return this.hub;
}

/**  Get the name of the hub
 * 
 * @public
 * @returns name of hub
 */
Service_SPIKE.prototype.getHubName = function () {
    return this.hubName;
}