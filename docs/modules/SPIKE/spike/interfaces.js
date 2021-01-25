/**  Get the most recently detected event on the display of the hub
 * @public
 * @returns {string} ['tapped','doubletapped']
 * var event = await mySPIKE.getHubEvent();
 * if (event == "tapped" ) {
 *      console.log("SPIKE is tapped");
 * }
 */
Service_SPIKE.prototype.getHubEvent = function () {
    return hubFrontEvent;
}

/**  Get the most recently detected gesture of the hub ( Gesture names differ from SPIKE app )
 * @public
 * @returns {string} ['shaken', 'freefall', 'tapped', 'doubletapped']
 * @example
 * var gesture = await mySPIKE.getHubGesture();
 * if (gesture == "shaken") {
 *      console.log("SPIKE is being shaked");
 * }
 */
Service_SPIKE.prototype.getHubGesture = function () {
    return hubGesture;
}

/**  Get the most recently detected orientation of the hub
 * @public
 * @returns {string} ['up','down','front','back','leftside','rightside']
 * @example
 * var orientation = await mySPIKE.getHubOrientation();
 * if (orientation == "front") {
 *      console.log("SPIKE is facing up");
 * }
 */
Service_SPIKE.prototype.getHubOrientation = function () {
    return lastHubOrientation;
}


/**  Get the latest press event information on the "connect" button
 * @ignore
 * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
 * @example
 * var bluetoothButtonInfo = await mySPIKE.getBluetoothButton();
 * var pressedBool = bluetoothButtonInfo["pressed"];
 * var pressedDuration = bluetoothButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
 */
Service_SPIKE.prototype.getBluetoothButton = function () {
    return hubBluetoothButton;
}

/**  Get the latest press event information on the "center" button
 * @ignore
 * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER }
 * @example
 * var mainButtonInfo = await mySPIKE.getMainButton();
 * var pressedBool = mainButtonInfo["pressed"];
 * var pressedDuration = mainButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
 * 
 */
Service_SPIKE.prototype.getMainButton = function () {
    return hubMainButton;
}

/**  Get the latest press event information on the "left" button
 * @ignore
 * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
 * @example
 * var leftButtonInfo = await mySPIKE.getLeftButton();
 * var pressedBool = leftButtonInfo["pressed"];
 * var pressedDuration = leftButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
 * 
 */
Service_SPIKE.prototype.getLeftButton = function () {
    return hubLeftButton;
}

/**  Get the latest press event information on the "right" button
 * @ignore
 * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
 * @example
 * var rightButtonInfo = await mySPIKE.getRightButton();
 * var pressedBool = rightButtonInfo["pressed"];
 * var pressedDuration = rightButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
 */
Service_SPIKE.prototype.getRightButton = function () {
    return hubRightButton;
}

/**  Get the letters of ports connected to any kind of Motors
 * @public
 * @returns {(string|Array)} Ports that are connected to Motors
 * @example
 * var motorPorts = mySPIKE.getMotorPorts();
 *
 * // get the alphabetically earliest port connected to a motor
 * var randomPort = motorPorts[0];
 *
 * // get Motor object connected to the port
 * var mySensor = new Motor(randomPort);
 */
Service_SPIKE.prototype.getMotorPorts = function () {

    var portsInfo = this.getPortsInfo();
    var motorPorts = [];
    for (var key in portsInfo) {
        if (portsInfo[key].device == "smallMotor" || portsInfo[key].device == "bigMotor") {
            motorPorts.push(key);
        }
    }
    return motorPorts;

}

/**  Get the letters of ports connected to Small Motors
 * @public
 * @returns {(string|Array)} Ports that are connected to Small Motors
 * @example
 * var smallMotorPorts = mySPIKE.getSmallMotorPorts();
 *
 * // get the alphabetically earliest port connected to a small motor
 * var randomPort = smallMotorPorts[0];
 *
 * // get Motor object connected to the port
 * var mySensor = new Motor(randomPort);
 */
Service_SPIKE.prototype.getSmallMotorPorts = function () {

    var portsInfo = this.getPortsInfo();
    var motorPorts = [];
    for (var key in portsInfo) {
        if (portsInfo[key].device == "smallMotor") {
            motorPorts.push(key);
        }
    }
    return motorPorts;

}

/**  Get the letters of ports connected to Big Motors
 * @public
 * @returns {(string|Array)} Ports that are connected to Big Motors
 * @example
 * var bigMotorPorts = mySPIKE.getBigMotorPorts();
 *
 * // get the alphabetically earliest port connected to a big motor
 * var randomPort = bigMotorPorts[0];
 *
 * // get Motor object connected to the port
 * var mySensor = new Motor(randomPort);
 */
Service_SPIKE.prototype.getBigMotorPorts = function () {
    var portsInfo = this.getPortsInfo();
    var motorPorts = [];
    for (var key in portsInfo) {
        if (portsInfo[key].device == "bigMotor") {
            motorPorts.push(key);
        }
    }
    return motorPorts;
}

/**  Get the letters of ports connected to Distance Sensors
 * @public
 * @returns {(string|Array)} Ports that are connected to Distance Sensors
 * @example
 * var distanceSensorPorts = mySPIKE.getDistancePorts();
 *
 * // get the alphabetically earliest port connected to a DistanceSensor
 * var randomPort = distanceSensorPorts[0];
 *
 * // get DistanceSensor object connected to the port
 * var mySensor = new DistanceSensor(randomPort);
 */
Service_SPIKE.prototype.getUltrasonicPorts = function () {

    var portsInfo = this.getPortsInfo();
    var ultrasonicPorts = [];

    for (var key in portsInfo) {
        if (portsInfo[key].device == "ultrasonic") {
            ultrasonicPorts.push(key);
        }
    }

    return ultrasonicPorts;

}

/**  Get the letters of ports connected to Color Sensors
 * @public
 * @returns {(string|Array)} Ports that are connected to Color Sensors
 * @example
 * var colorSensorPorts = mySPIKE.getColorPorts();
 *
 * // get the alphabetically earliest port connected to a ColorSensor
 * var randomPort = colorSensorPorts[0];
 *
 * // get ColorSensor object connected to the port
 * var mySensor = new ColorSensor(randomPort);
 */
Service_SPIKE.prototype.getColorPorts = function () {

    var portsInfo = this.getPortsInfo();
    var colorPorts = [];

    for (var key in portsInfo) {
        if (portsInfo[key].device == "color") {
            colorPorts.push(key);
        }
    }

    return colorPorts;

}

/**  Get the letters of ports connected to Force Sensors
 * @public
 * @returns {(string|Array)} Ports that are connected to Force Sensors
 * @example
 * var forceSensorPorts = mySPIKE.getForcePorts();
 * 
 * // get the alphabetically earliest port connected to a ForceSensor
 * var randomPort = forceSensorPorts[0];
 * 
 * // get ForceSensor object connected to the port
 * var mySensor = new ForceSensor(randomPort);
 */
Service_SPIKE.prototype.getForcePorts = function () {

    var portsInfo = this.getPortsInfo();
    var forcePorts = [];

    for (var key in portsInfo) {
        if (portsInfo[key].device == "force") {
            forcePorts.push(key);
        }
    }

    return forcePorts;

}

/**  Get all motor objects currently connected to SPIKE
 * 
 * @public
 * @returns {object} All connected Motor objects
 * @example
 * var motors = await mySPIKE.getMotors();
 * 
 * // get Motor object connected to Port A
 * var myMotor = motors["A"]
 * 
 * // run motor for 10 seconds at 100 speed
 * myMotor.run_for_seconds(10,100);
 */
Service_SPIKE.prototype.getMotors = function () {
    var portsInfo = this.getPortsInfo();
    var motors = {};
    for (var key in portsInfo) {
        if (portsInfo[key].device == "smallMotor" || portsInfo[key].device == "bigMotor") {
            motors[key] = new Motor(key);
        }
    }
    return motors;
}

/**  Get all distance sensor objects currently connected to SPIKE
 * 
 * @public
 * @returns {object} All connected DistanceSensor objects
 * @example
 * var distanceSensors = await mySPIKE.getDistanceSensors();
 * 
 * // get DistanceSensor object connected to Port A
 * var mySensor = distanceSensors["A"];
 * 
 * // get distance in centimeters
 * console.log("distance in CM: ", mySensor.get_distance_cm())
 */
Service_SPIKE.prototype.getDistanceSensors = function () {
    var portsInfo = this.getPortsInfo();
    var distanceSensors = {};
    for (var key in portsInfo) {
        if (portsInfo[key].device == "ultrasonic") {
            distanceSensors[key] = new DistanceSensor(key);
        }
    }
    return distanceSensors;
}

/**  Get all color sensor objects currently connected to SPIKE
 * 
 * @public
 * @returns {object} All connected ColorSensor objects
 * @example
 * var colorSensors = await mySPIKE.getColorSensors();
 * var mySensor = colorSensors["A"];
 */
Service_SPIKE.prototype.getColorSensors = function () {
    var portsInfo = this.getPortsInfo();
    var colorSensors = {};
    for (var key in portsInfo) {
        if (portsInfo[key].device == "color") {
            colorSensors[key] = new ColorSensor(key);
        }
    }
    return colorSensors;
}

/**  Get all force sensor objects currently connected to SPIKE
 * 
 * @public
 * @returns {object} All connected ForceSensor objects
 * @example
 * var forceSensors = mySPIKE.getForceSensors();
 *
 * // get ForceSensor object connected to port A
 * var mySensor = forceSensors["A"];
 *
 * // when ForceSensor is pressed, indicate button state on console
 * mySensor.wait_until_pressed( function() {
 *      console.log("ForceSensor at port A was pressed");
 * })
 */
Service_SPIKE.prototype.getForceSensors = function () {
    var portsInfo = this.getPortsInfo();
    var forceSensors = {};
    for (var key in portsInfo) {
        if (portsInfo[key].device == "force") {
            forceSensors[key] = new ForceSensor(key);
        }
    }
    return forceSensors;
}