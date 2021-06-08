/*
Project Name: SPIKE Prime Web Interface
File name: Service_SPIKE.js
Author: Jeremy Jung
Last update: 3/14/21
Description: Main interface for users to interact with their SPIKE Primes.
Credits/inspirations:
    Based on code wrriten by Ethan Danahy, Chris Rogers
History:
    Created by Jeremy on 7/15/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/



/**
 * @class Service_SPIKE
 * @classdesc
 * ServiceDock library for interfacing with LEGO® SPIKE™ Prime
 * @example
 * // assuming you declared <service-spike> with the id, "service_spike"
 * var serviceSPIKE = document.getElemenyById("service_spike").getService();
 * serviceSPIKE.executeAfterInit(async function() {
 *     // write code here
 * })
 *
 * serviceSPIKE.init();
 */
function Service_SPIKE () {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    // Service Dock variables
    let virtualSpike = new _virtualSpike();
    let ujsonLib = _SpikeUjsonLib;
    let serviceActive = false; // flag for service initialization state

    // flag for development
    let dev = false;

    var funcAtInit = () => {}
    var funcAfterPrint = (m) => {}; // function to call for SPIKE python program print statements or errors
    var funcAfterError = (er) => {}; // function to call for errors in ServiceDock
    var funcAfterDisconnect = () => {}; // function to call after SPIKE Prime is disconnected
    var funcAfterConnect = () => {}; // function to call after SPIKE Prime is connected
    var funcWithStream = () => {} // function to call during SPIKE Prime data stream

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////
    /** Connect to a webserial port and begin data stream with hub
     * @public
     */
    const init = async function (isDev) {
        try {
            dev = isDev;
            console.log(dev);
            let serviceActive = await virtualSpike.init(isDev);
            
            if (serviceActive === true) {
                await sleep(1000);
            }
            
            devConsoleLog("serviceActive: " + serviceActive);
            return serviceActive;
        }
        catch (e) {
            consoleError(e);
        }


        // initialize web serial connection
        // var webSerialConnected = await initWebSerial();

        // if (webSerialConnected) {

            // start streaming UJSONRPC
            // streamUJSONRPC();

            // await sleep(1000);

            // triggerCurrentState();
            // getFirmwareInfo(function (version) {
            //     console.log("%cTuftsCEEO ", "color: #3ba336;", "This SPIKE Prime is using Hub OS ", version);
            // });
            // serviceActive = true;

            // await sleep(2000); // wait for service to init

            // // call funcAtInit if defined
            // if (funcAtInit !== undefined) {
            //     funcAtInit();
            // }
            // return true;
        // }
        // else {
            // return false;
        // }
    }

    const isActive = function () {
        return serviceActive;
    }

    /** The PrimeHub object includes controllable interfaces ("constants") for your SPIKE Prime, such as left_button, right_button, motion_sensor, and light_matrix.
    * @namespace
    * @memberof Service_SPIKE
    * @example
    * // Initialize the Hub
    * var hub = new serviceSPIKE.PrimeHub()
    */
    const PrimeHub = function () {
        var newOrigin = 0;

        /** The left button on the hub
        * @namespace
        * @memberof! PrimeHub
        * @returns {functions} - functions from PrimeHub.left_button
        * @example
        * var hub = new serviceSPIKE.PrimeHub();
        * var left_button = hub.left_button;
        * // do something with left_button
        */
        var left_button = {};

        /** execute callback after this button is pressed
        * @param {function} callback function to run when button is pressed
        * @example
        * var hub = new serviceSPIKE.PrimeHub();
        * var left_button = hub.left_button;
        * left_button.wait_until_pressed ( function () {
        *     console.log("left_button was pressed");
        * })
        * 
        */
        left_button.wait_until_pressed = function (callback) {
            virtualSpike.spikeMemory.funcAfterLeftButtonPress = callback;
        }
        /** execute callback after this button is released
         *
         * @param {function} callback function to run when button is released
         * @example
         * var hub = new serviceSPIKE.PrimeHub();
         * var left_button = hub.left_button;
         * left_button.wait_until_released ( function () {
         *     console.log("left_button was released");
         * })
         */
        left_button.wait_until_released = function (callback) {
            virtualSpike.spikeMemory.funcAfterLeftButtonRelease = callback;
        }
        /** Tests to see whether the button has been pressed since the last time this method called.
         *
         * @returns {boolean} - True if was pressed, false otherwise
         * @example
         * if (left_button.was_pressed()) {
         *      console.log("left_button was pressed")
         * }
         */
        left_button.was_pressed = function () {
            if (virtualSpike.hub.leftButton.duration > 0) {
                virtualSpike.hub.leftButton.duration = 0;
                return true;
            } else {
                return false;
            }
        }

        /** Tests to see whether the button is pressed
        *
        * @returns {boolean} True if pressed, false otherwise
        * @example
        * if (left_button.is_pressed()) {
        *      console.log("left_button is pressed")
        * }
        */
        left_button.is_pressed = function () {
            if (virtualSpike.hub.leftButton.pressed) {
                return true;
            }
            else {
                return false;
            }
        }

        /** The right button on the hub
         * @namespace
         * @memberof! PrimeHub
         * @returns {functions} functions from PrimeHub.right_button
         * @example
         * var hub = serviceSPIKE.PrimeHub();
         * var right_button = hub.right_button;
         * // do something with right_button
         */
        var right_button = {};

        /** execute callback after this button is pressed
        *
        * @param {function} callback function to run when button is pressed
        * @example
        * var hub = new serviceSPIKE.PrimeHub();
        * var right_button = hub.right_button;
        * right_button.wait_until_pressed ( function () {
        *     console.log("right_button was pressed");
        * })
        */
        right_button.wait_until_pressed = function (callback) {

            virtualSpike.spikeMemory.funcAfterRightButtonPress = callback;
        }

        /** execute callback after this button is released
         * 
         * @param {function} callback function to run when button is released
         * @example
         * var hub = new serviceSPIKE.PrimeHub();
         * var right_button = hub.right_button;
         * right_button.wait_until_released ( function () {
         *     console.log("right_button was released");
         * })
         */
        right_button.wait_until_released = function (callback) {

            virtualSpike.spikeMemory.funcAfterRightButtonRelease = callback;
        }

        /** Tests to see whether the button has been pressed since the last time this method called.
         * 
         * @returns {boolean} - True if was pressed, false otherwise
         * @example
         * var hub = new serviceSPIKE.PrimeHub();
         * if ( hub.right_button.was_pressed() ) {
         *     console.log("right_button was pressed");
         * }
         */
        right_button.was_pressed = function () {
            if (virtualSpike.hub.rightButton.duration > 0) {
                virtualSpike.hub.rightButton.duration = 0;
                return true;
            } else {
                return false;
            }
        }

        /** Tests to see whether the button is pressed
         * 
         * @returns {boolean} True if pressed, false otherwise
         * @example
         * if (right_button.is_pressed()) {
         *      console.log("right_button is pressed")
         * }
         */
        right_button.is_pressed = function () {
            if (virtualSpike.hub.rightButton.pressed) {
                return true;
            }
            else {
                return false;
            }
        }
        /** Following are all of the functions that are linked to the Hub’s programmable Brick Status Light.
         * @namespace
         * @memberof! PrimeHub
         * @returns {functions} - functions from PrimeHub.light_matrix
         * @example
         * var hub = serviceSPIKE.PrimeHub();
         * var status_light = hub.status_light;
         * // do something with status_light
        */
        var status_light = {};

        /** Sets the color of the light.
         * @param {string} color ["azure","black","blue","cyan","green","orange","pink","red","violet","yellow","white"]
         * @example
         * var hub = new Primehub()
         * hub.status_light.on("blue")
         * 
         */
        status_light.on = function (color) {
            let dictColor = {
                "azure": 4,
                "black": 12,
                "blue": 3,
                "cyan": 5,
                "green": 6,
                "orange": 8,
                "pink": 1,
                "red": 9,
                "violet": 2,
                "yellow": 7,
                "white": 10
            }

            let intColor = dictColor[color];
            ujsonLib.centerButtonLightUp(intColor, (c, rid) => virtualSpike.sendDATA(c));
        }

        /** Turns off the light.
         * @example
         * var hub = new Primehub()
         * hub.status_light.off()
         */
        status_light.off = function () {
            ujsonLib.centerButtonLightUp(0, (c, rid) => virtualSpike.sendDATA(c));
        }

        /** Hub's light matrix
         * @namespace
         * @memberof! PrimeHub
         * @returns {functions} - functions from PrimeHub.light_matrix
         * @example
         * var hub = serviceSPIKE.PrimeHub();
         * var light_matrix = hub.light_matrix;
         * // do something with light_matrix
         */
        var light_matrix = {};

        /**
         * @todo Implement this function
         * @ignore
         * @param {string}
         */
        light_matrix.show_image = function (image) {

        }
        /** Sets the brightness of one pixel (one of the 25 LED) on the Light Matrix.
         * 
         * @param {integer} x [0 to 4]
         * @param {integer} y [0 to 4]
         * @param {integer} brightness [0 to 100]
         */
        light_matrix.set_pixel = function (x, y, brightness = 100) {
            ujsonLib.displaySetPixel(x, y, brightness, (c, rid) => virtualSpike.sendDATA(c));

        }
        /** Writes text on the Light Matrix, one letter at a time, scrolling from right to left.
         * 
         * @param {string} message 
         */
        light_matrix.write = function (message) {
            ujsonLib.displayText(message, (c, rid) => virtualSpike.sendDATA(c));
        }
        /** Turns off all the pixels on the Light Matrix.
         * 
         */
        light_matrix.off = function () {
            ujsonLib.displayClear((c, rid) => virtualSpike.sendDATA(c));
        }

        /** Hub's speaker
         * @namespace
         * @memberof! PrimeHub
         * @returns {functions} functions from Primehub.speaker
         * @example
         * var hub = serviceSPIKE.PrimeHub();
         * var speaker = hub.speaker;
         * // do something with speaker
         */
        var speaker = {};

        speaker.volume = 100;

        /** Plays a beep on the Hub.
         * 
         * @param {integer} note The MIDI note number [44 to 123 (60 is middle C note)]
         * @param {number} seconds The duration of the beep in seconds
         */
        speaker.beep = function (note, seconds) {
            ujsonLib.soundBeep(speaker.volume, note, (c, rid) => virtualSpike.sendDATA(c));
            setTimeout(function () { ujsonLib.soundStop((c, rid) => virtualSpike.sendDATA(c)) }, seconds * 1000);
        }

        /** Starts playing a beep.
         * 
         * @param {integer} note The MIDI note number [44 to 123 (60 is middle C note)]
         */
        speaker.start_beep = function (note) {
            ujsonLib.soundBeep(speaker.volume, note, (c, rid) => virtualSpike.sendDATA(c))
        }

        /** Stops any sound that is playing.
         * 
         */
        speaker.stop = function () {
            ujsonLib.soundStop((c, rid) => virtualSpike.sendDATA(c));
        }

        /** Retrieves the value of the speaker volume.
         * @returns {number} The current volume [0 to 100]
         */
        speaker.get_volume = function () {
            return speaker.volume;
        }

        /** Sets the speaker volume.
         * 
         * @param {integer} newVolume 
         */
        speaker.set_volume = function (newVolume) {
            speaker.volume = newVolume
        }

        /** Hub's motion sensor
         * @namespace
         * @memberof! PrimeHub
         * @returns {functions} functions from PrimeHub.motion_sensor
         * @example
         * var hub = serviceSPIKE.PrimeHub();
         * var motion_sensor = hub.motion_sensor;
         * // do something with motion_sensor
         */
        var motion_sensor = {};

        /** Sees whether a gesture has occurred since the last time was_gesture() 
         * was used or since the beginning of the program (for the first use).
         * 
         * @param  {string} gesture
         * @returns {boolean} true if the gesture was made, false otherwise
         */
        motion_sensor.was_gesture = function (gesture) {

            var gestureWasMade = false;

            // iterate over the hubGestures array
            for (let index in virtualSpike.spikeMemory.hubGestures) {

                // pick a gesture from the array
                var oneGesture = virtualSpike.spikeMemory.hubGestures[index];

                // switch the flag that gesture existed
                if (oneGesture == gesture) {
                    gestureWasMade = true;
                    break;
                }
            }
            // reinitialize hubGestures so it only holds gestures that occurred after this was_gesture() execution
            virtualSpike.spikeMemory.hubGestures = [];

            return gestureWasMade;

        }

        /** Executes callback when a new gesture happens
         * 
         * @param  {function(string)} callback - A callback of which argument is name of the gesture
         * @example
         * motion_sensor.wait_for_new_gesture( function ( newGesture ) {
         *      if ( newGesture == 'tapped') {
         *             console.log("SPIKE was tapped")
         *      }
         *      else if ( newGesture == 'doubletapped') {
         *             console.log("SPIKE was doubletapped")
         *      }
         *      else if ( newGesture == 'shaken') {
         *             console.log("SPIKE was shaken")
         *      }
         *      else if ( newGesture == 'freefall') {
         *             console.log("SPIKE was freefall")
         *      }
         * })
         */
        motion_sensor.wait_for_new_gesture = function (callback) {

            virtualSpike.spikeMemory.funcAfterNewGesture = callback;

        }

        /** Executes callback when the orientation of the Hub changes or when function was first called
         * 
         * @param  {function(string)} callback - A callback whose signature is name of the orientation
         * @example
         * motion_sensor.wait_for_new_orientation( function ( newOrientation ) {
         *        if (newOrientation == "up") {
         *              console.log("orientation is up");
         *        }
         *        else if (newOrientation == "down") {
         *              console.log("orientation is down");
         *        }
         *        else if (newOrientation == "front") {
         *              console.log("orientation is front");
         *        }
         *        else if (newOrientation == "back") {
         *              console.log("orientation is back");
         *        }
         *        else if (newOrientation == "leftSide") {
         *              console.log("orientation is leftSide");
         *        }
         *        else if (newOrientation == "rightSide") {
         *              console.log("orientation is rightSide");
         *        }
         * })
         */
        motion_sensor.wait_for_new_orientation = function (callback) {
            // immediately return current orientation if the method was called for the first time
            if (virtualSpike.spikeMemory.waitForNewOriFirst) {
                virtualSpike.spikeMemory.waitForNewOriFirst = false;
                callback(virtualSpike.spikeMemory.lastHubOrientation);
            }
            // for future executions, wait until new orientation
            else {
                virtualSpike.spikeMemory.funcAfterNewOrientation = callback;
            }

        }

        /** “Yaw” is the rotation around the front-back (vertical) axis.
         * 
         * @returns {integer} yaw angle
         */
        motion_sensor.get_yaw_angle = function get_yaw_angle() {
            var currPos = virtualSpike.hub.pos[0];

            return currPos;
        }

        /** “Pitch” the is rotation around the left-right (transverse) axis.
         * 
         * @returns {integer} pitch angle
         */
        motion_sensor.get_pitch_angle = function get_pitch_angle() {
            return virtualSpike.hub.pos[1];
        }

        /** “Roll” the is rotation around the front-back (longitudinal) axis.
         * 
         * @returns {integer} roll angle
         */
        motion_sensor.get_roll_angle = function get_roll_angle() {
            return virtualSpike.hub.pos[2];
        }

        /** Gets the acceleration of the SPIKE's yaw axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_yaw_acceleration = function get_yaw_acceleration() {
            return virtualSpike.hub.pos[2];
        }

        /**  Gets the acceleration of the SPIKE's pitch axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_pitch_acceleration = function get_pitch_acceleration() {
            return virtualSpike.hub.pos[1];
        }

        /** Gets the acceleration of the SPIKE's roll axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_roll_acceleration = function get_roll_acceleration() {
            return virtualSpike.hub.pos[0];
        }

        /** Retrieves the most recently detected gesture.
         * 
         * @returns {string} the name of gesture
         */
        motion_sensor.get_gesture = function get_gesture() {
            devConsoleLog("hubGesture in Service: " + virtualSpike.hub.gesture);
            return virtualSpike.hub.gesture;
        }

        /** Retrieves the most recently detected orientation
         * Note: Hub does not detect orientation of when it was connected
         * 
         * @returns {string} the name of orientation
         */
        motion_sensor.get_orientation = function get_orientation() {
            return virtualSpike.spikeMemory.lastHubOrientation;
        }

        return {
            motion_sensor: motion_sensor,
            light_matrix: light_matrix,
            left_button: left_button,
            right_button: right_button,
            speaker: speaker
        }
    }

    /** Motor
     * @namespace
     * @memberof! Service_SPIKE
     * @param {string} Port
     * @returns {functions}
     * @example
     * // Initialize the Motor
     * var motor = new serviceSPIKE.Motor("A")
     */
    const Motor = function (port) {

        var motor = virtualSpike.ports[port]; // get the motor info by port

        // default settings
        var defaultSpeed = 100;
        var stopMethod = 1; // stop method doesnt seem to work in this current ujsonrpc config
        var stallSetting = true;

        var direction = {
            COUNTERCLOCKWISE: 'counterClockwise',
            CLOCKWISE: 'clockwise'
        }

        // check if device is a motor
        if (motor.device != "smallMotor" && motor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }

        /** Get current speed of the motor
         *  
         * @returns {number} speed of motor [-100 to 100]
         */
        function get_speed() {
            var motor = virtualSpike.ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.speed;

        }

        /** Get current position of the motor. The position may differ by a little margin from 
         * the position to which a motor ran with run_to_position()
         * @returns {number} position of motor [0 to 359]
         */
        function get_position() {
            var motor = virtualSpike.ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            let position = motorInfo.uAngle;
            if (position < 0)
                position = 360 + position;
            return position;
        }

        /** Get current degrees counted of the motor
         * 
         * @returns {number} counted degrees of the motor [any number]
         */
        function get_degrees_counted() {
            var motor = virtualSpike.ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.angle;
        }

        /** Get the power of the motor
         * 
         * @returns {number} motor power
         */
        function get_power() {
            var motor = virtualSpike.ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.power;
        }

        /** Get the default speed of this motor
         * 
         * @returns {number} motor default speed [-100 to 100]
         */
        function get_default_speed() {
            return defaultSpeed;
        }

        /** Set the default speed for this motor
         * 
         * @param {number} speed [-100 to 100]
         */
        function set_default_speed(speed) {
            if (typeof speed == "number") {
                defaultSpeed = speed;
            }
        }

        /** Turns stall detection on or off.
         * Stall detection senses when a motor has been blocked and can’t move.
         * If stall detection has been enabled and a motor is blocked, the motor will be powered off
         * after two seconds and the current motor command will be interrupted. If stall detection has been
         * disabled, the motor will keep trying to run and programs will “get stuck” until the motor is no
         * longer blocked.
         * @param {boolean} boolean - true if to detect stall, false otherwise
         */
        function set_stall_detection(boolean) {
            if (boolean === true)
                stallSetting = 1;
            else if (boolean === false)
                stallSetting = 0;
            else
                throw new Error("argument of set_stall_detection must be a boolean type")
        }


        /** Runs the motor to an absolute position.
         * The sign of the speed will be ignored (i.e., absolute value), and the motor will always travel in the direction that’s been specified by the "direction" parameter. 
         * If the speed is greater than "100," it will be limited to "100."

         * @param {integer} degrees [0 to 359]
         * @param {string} direction "Clockwise" or "Counterclockwise"
         * @param {integer} speed [-100 to 100]
         * @param {function} callback Params: "stalled" or "done"
         * @ignore
         * @example
         * motor.run_to_position(180, 100, function() {
         *      console.log("motor finished moving");
         * })
         */
        function run_to_position(degrees, direction, speed = defaultSpeed, callback = undefined) {
            ujsonLib.motorGoRelPos(port, degrees, speed, stallSetting, stopMethod, callback,
                                    (c, rid) => { 
                                        virtualSpike.sendDATA(c);
                                        if (callback != undefined)
                                            virtualSpike.pushResponseCallback(rid, callback);
                                        });
        }

        /** Runs the motor until the number of degrees counted is equal to the value that has been specified by the "degrees" parameter.
         * 
         * @param {integer} degrees any number
         * @param {integer} speed [0 to 100]
         * @param {any} [callback] (optional callback) callback param: "stalled" or "done"
         */
        function run_to_degrees_counted(degrees, speed = defaultSpeed, callback = undefined) {
            ujsonLib.motorGoRelPos(port, degrees, speed, stallSetting, stopMethod, callback,
                                    (c, rid) => {
                                        virtualSpike.sendDATA(c);
                                        if (callback != undefined)
                                            virtualSpike.pushResponseCallback(rid, callback);
                                    });
        }

        /** Start the motor at some power
         * 
         * @param {integer} power [-100 to 100]
         */
        function start_at_power(power) {
            ujsonLib.motorPwm(port, power, stallSetting, (c, rid) => virtualSpike.sendDATA(c));
        }


        /** Start the motor at some speed
         * 
         * @param {integer} speed [-100 to 100]
         */
        function start(speed = defaultSpeed) {
            // if (speed !== undefined && typeof speed == "number") {
            // ujsonLib.motorStart (port, speed, stallSetting);
            // }
            // else {
            // ujsonLib.motorStart(port, defaultSpeed, stallSetting);
            // }

            ujsonLib.motorStart(port, speed, stallSetting, (c, rid) => virtualSpike.sendDATA(c));
        }

        /** Run the motor for some seconds
         * 
         * @param {integer} seconds 
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         * @example
         * motor.run_for_seconds(10, 100, function() {
         *      console.log("motor just ran for 10 seconds");
         * })
         */
        function run_for_seconds(seconds, speed = defaultSpeed, callback = undefined) {
            ujsonLib.motorRunTimed(port, seconds, speed, stallSetting, stopMethod, callback,
                                    (c, rid) => {
                                        virtualSpike.sendDATA(c);
                                        if (callback != undefined)
                                            virtualSpike.pushResponseCallback(rid, callback);
                                    });
        }

        /** Run the motor for some degrees
         * 
         * @param {integer} degrees 
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         * motor.run_for_degrees(720, 100, function () {
         *      console.log("motor just ran for 720 degrees");
         * })
         */
        function run_for_degrees(degrees, speed = defaultSpeed, callback = undefined) {
            ujsonLib.motorRunDegrees(port, degrees, speed, stallSetting, stopMethod, callback,
                                    (c, rid) => {
                                        virtualSpike.sendDATA(c);
                                        if (callback != undefined)
                                            virtualSpike.pushResponseCallback(rid, callback);
                                    })
        }

        /** Stop the motor
         * 
         */
        function stop() {
            ujsonLib.motorPwm(port, 0, stallSetting, (c, rid) => virtualSpike.sendDATA(c));
        }

        return {
            run_to_position: run_to_position,
            run_to_degrees_counted: run_to_degrees_counted,
            start_at_power: start_at_power,
            start: start,
            stop: stop,
            run_for_degrees: run_for_degrees,
            run_for_seconds: run_for_seconds,
            set_default_speed: set_default_speed,
            set_stall_detection: set_stall_detection,
            get_power: get_power,
            get_degrees_counted: get_degrees_counted,
            get_position: get_position,
            get_speed: get_speed,
            get_default_speed: get_default_speed
        }
    }


    /** ColorSensor
     * @namespace
     * @param {string} Port
     * @memberof Service_SPIKE
     * @example
     * // Initialize the Color Sensor
     * var color = new serviceSPIKE.ColorSensor("E")
     */
    const ColorSensor = function (port) {
        var waitForNewColorFirst = false;

        var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
        var colorsensorData = colorsensor.data;

        // check if device is a color sensor
        if (colorsensor.device != "color") {
            throw new Error("No Color Sensor detected at port " + port);
        }

        /** Get the name of the detected color
         * @returns {string} 'black','violet','blue','cyan','green','yellow','red','white'
         */
        function get_color() {
            var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            var color = colorsensorData.color;

            return color;
        }

        /** Retrieves the intensity of the ambient light.
         * @ignore
         * @returns {number} The ambient light intensity. [0 to 100]
         */
        function get_ambient_light() {
            var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.Cambient;
        }

        /** Retrieves the intensity of the reflected light.
         * 
         * @returns {number} The reflected light intensity. [0 to 100]
         */
        function get_reflected_light() {
            var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.Creflected;
        }

        /** Retrieves the red, green, blue, and overall color intensity.
         * @todo Implement overall intensity
         * @ignore
         * @returns {(number|Array)} Red, green, blue, and overall intensity (0-1024)
         */
        function get_rgb_intensity() {
            var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            var toReturn = [];
            toReturn.push(colorsensorData.Cr);
            toReturn.push(colorsensorData.Cg);
            toReturn.push(colorsensorData.Cb)
            toReturn.push("TODO: unimplemented");;
        }

        /** Retrieves the red color intensity.
         * 
        * @returns {number} [0 to 1024]
         */
        function get_red() {
            var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[0];
        }

        /** Retrieves the green color intensity.
         * 
         * @returns {number} [0 to 1024]
         */
        function get_green() {
            var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[1];
        }

        /** Retrieves the blue color intensity.
         * 
         * @returns {number} [0 to 1024]
         */
        function get_blue() {
            var colorsensor = virtualSpike.ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[2];
        }

        /** Waits until the Color Sensor detects the specified color.
         * 
         * @param {string} colorInput 'black','violet','blue','cyan','green','yellow','red','white'
         * @param {function} callback callback function
         */
        function wait_until_color(colorInput, callback) {
            virtualSpike.spikeMemory.waitUntilColorCallback = [colorInput, callback];
        }


        /** Execute callback when Color Sensor detects a new color.
         * The first time this method is called, it returns immediately the detected color. 
         * After that, it waits until the Color Sensor detects a color that is different from the color that
         * was detected the last time this method was used.
         * @param {function(string)} callback params: detected new color
         */
        function wait_for_new_color(callback) {

            // check if this method has been executed after start of program
            if (virtualSpike.spikeMemory.waitForNewColorFirst) {
                virtualSpike.spikeMemory.waitForNewColorFirst = false;

                var currentColor = get_color();
                callback(currentColor)
            }
            virtualSpike.spikeMemory.funcAfterNewColor = callback;
        }

        return {
            get_color: get_color,
            wait_until_color: wait_until_color,
            wait_for_new_color: wait_for_new_color,
            get_ambient_light: get_ambient_light,
            get_reflected_light: get_reflected_light,
            get_rgb_intensity: get_rgb_intensity,
            get_red: get_red,
            get_green: get_green,
            get_blue: get_blue
        }

    }

    /** DistanceSensor
     * @namespace
     * @param {string} Port
     * @memberof Service_SPIKE
     * @example
     * // Initialize the DistanceSensor
     * var distance_sensor = new serviceSPIKE.DistanceSensor("A");
     */
    const DistanceSensor = function (port) {
        var distanceSensor = virtualSpike.ports[port]; // get the distance sensor info by port

        // check if device is a distance sensor
        if (distanceSensor.device != "ultrasonic") {
            console.error("Ports Info: ", ports);
            throw new Error("No DistanceSensor detected at port " + port);
        }

        /** Retrieves the measured distance in centimeters.
         * @returns {number} [0 to 200]
         * @todo find the short_range handling ujsonrpc script
         * @example
         * var distance_cm = distance_sensor.get_distance_cm();
         */
        function get_distance_cm() {
            var distanceSensor = virtualSpike.ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            return distanceSensorData.distance;
        }

        /** Retrieves the measured distance in inches.
         * 
         * @returns {number} [0 to 79]
         * @todo find the short_range handling ujsonrpc script
         * @example
         * var distance_inches = distance_sensor.get_distance_inches();
         */
        function get_distance_inches() {
            var distanceSensor = virtualSpike.ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            var inches = distanceSensorData.distance * 0.393701; // convert to inches

            if (inches % 1 < 0.5)
                inches = Math.floor(inches);
            else
                inches = Math.ceil(inches);

            return inches;
        }

        /** Retrieves the measured distance in percent.
         * 
         * @returns {number/string} [0 to 100] or 'none' if no distance is read
         * var distance_percentage = distance_sensor.get_distance_percentage();
         */
        function get_distance_percentage() {
            var distanceSensor = virtualSpike.ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            if (distanceSensorData.distance == null) {
                return "none"
            }
            var percentage = distanceSensorData.distance / 200;
            return percentage;
        }

        /** Waits until the measured distance is greater than distance.
         * @param {integer} threshold 
         * @param {string} unit 'cm','in','%'
         * @param {function} callback function to execute when distance is farther than threshold
         * @example
         * distance_sensor.wait_for_distance_farther_than(10, 'cm', function () {
         *      console.log("distance is farther than 10 CM");
         * })
         */
        function wait_for_distance_farther_than(threshold, unit, callback) {

            // set callbacks to be executed in updateHubPortsInfo()
            if (unit == 'cm') {
                virtualSpike.spikeMemory.waitForDistanceFartherThanCallback = [threshold, callback];
            }
            else if (unit == 'in') {
                virtualSpike.spikeMemory.waitForDistanceFartherThanCallback = [threshold / 0.393701, callback];
            }
            else if (unit == '%') {
                virtualSpike.spikeMemory.waitForDistanceFartherThanCallback = [(threshold * 0.01) * 200, callback];
            }
            else {
                throw new Error("The 'unit' argument in wait_for_distance_farther_than(threshold, unit, callback) must be either 'cm', 'in', or '%'.")
            }
        }

        /** Waits until the measured distance is less than distance.
         * @param {integer} threshold 
         * @param {string} unit 'cm','in','%'
         * @param {function} callback function to execute when distance is closer than threshold
         * @example
         * distance_sensor.wait_for_distance_closer_than(10, 'cm', function () {
         *      console.log("distance is closer than 10 CM");
         * })   
         */
        function wait_for_distance_closer_than(threshold, unit, callback) {
            // set callbacks to be executed in updateHubPortsInfo()
            if (unit == 'cm') {
                virtualSpike.spikeMemory.waitForDistanceCloserThanCallback = [threshold, callback];
            }
            else if (unit == 'in') {
                virtualSpike.spikeMemory.waitForDistanceCloserThanCallback = [threshold / 0.393701, callback];
            }
            else if (unit == '%') {

                /* floor or ceil thresholds larger or smaller than what's possible */
                if (threshold > 100) {
                    threshold = 100;
                }
                else if (threshold < 0) {
                    threshold = 0;
                }

                virtualSpike.spikeMemory.waitForDistanceCloserThanCallback = [(threshold * 0.01) * 200, callback];
            }
            else {
                throw new Error("The 'unit' argument in wait_for_distance_closer_than(threshold, unit, callback) must be either 'cm', 'in', or '%'.")
            }
        }

        /** Sets the brightness of the individual lights on the Distance Sensor.
         * 
         * @param {integer} right_top Brightness [1-100]
         * @param {integer} left_top Brightness [1-100]
         * @param {integer} right_bottom Brightness [1-100]
         * @param {integer} left_bottom Brightness [1-100]
         * @example
         * distance_sensor.light_up(100,100,100,100);
         */
        function light_up(right_top, left_top, right_bottom, left_bottom) {
            let lightArray = [0, 0, 0, 0];
            lightArray[0] = right_top;
            lightArray[1] = left_top;
            lightArray[2] = right_bottom;
            lightArray[3] = left_bottom;

            ujsonLib.ultrasonicLightUp(port, lightArray, (c, rid) => virtualSpike.sendDATA(c));
        }

        /** Lights up all of the lights on the Distance Sensor at the specified brightness.
         * 
         * @param {number} [brightness=100] The specified brightness of all of the lights
         * @example
         * distance_sensor.light_up_all(50)
         */
        function light_up_all(brightness = 100) {

            let lightArray = [brightness, brightness, brightness, brightness];

            ujsonLib.ultrasonicLightUp(port, lightArray, (c, rid) => virtualSpike.sendDATA(c));
        }

        return {
            get_distance_cm: get_distance_cm,
            get_distance_inches: get_distance_inches,
            get_distance_percentage: get_distance_percentage,
            light_up: light_up,
            light_up_all: light_up_all,
            wait_for_distance_closer_than: wait_for_distance_closer_than,
            wait_for_distance_farther_than: wait_for_distance_farther_than
        }

    }

    /** ForceSensor
     * @namespace
     * @param {string} Port
     * @memberof Service_SPIKE
     * @example
     * // Initialize the ForceSensor
     * var force_sensor = new serviceSPIKE.ForceSensor("E")
     */
    const ForceSensor = function (port) {

        var sensor = virtualSpike.ports[port]; // get the force sensor info by port

        if (sensor.device != "force") {
            throw new Error("No Force Sensor detected at port " + port);
        }

        /** Tests whether the button on the sensor is pressed.
         * 
         * @returns {boolean} true if force sensor is pressed, false otherwise
         * @example
         * if (force_sensor.is_pressed() === true) {
         *      console.log("force sensor is pressed");
         * }
         */
        function is_pressed() {
            var sensor = virtualSpike.ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            return ForceSensorData.pressed;
        }

        /** Retrieves the measured force, in newtons.
         * 
         * @returns {number}  Force in newtons [0 to 10]
         * @example
         * var newtons = force_sensor.get_force_newtons();
         */
        function get_force_newton() {
            var sensor = virtualSpike.ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            return ForceSensorData.force;
        }

        /** Retrieves the measured force as a percentage of the maximum force.
         * 
         * @returns {number} percentage [0 to 100]
         * var percentage = force_sensor.get_force_percentage();
         */
        function get_force_percentage() {
            var sensor = virtualSpike.ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            var denominator = 704 - 384 // highest detected - lowest detected forceSensitive values
            var numerator = ForceSensorData.forceSensitive - 384 // 384 is the forceSensitive value when not pressed
            var percentage = Math.round((numerator / denominator) * 100);
            return percentage;
        }

        /** Executes callback when Force Sensor is pressed
         * The function is executed in updateHubPortsInfo()'s Force Sensor part
         * @param {function} callback 
         * @example
         * force_sensor.wait_until_pressed( function () {
         *      console.log("force sensor is pressed!");
         * })
         */
        function wait_until_pressed(callback) {
            virtualSpike.spikeMemory.funcAfterForceSensorPress = callback;
        }

        /** Executes callback when Force Sensor is released
         * The function is executed in updateHubPortsInfo()'s Force Sensor part
         * @param {function} callback 
         * @example
         * force_sensor.wait_until_released ( function () {
         *      console.log("force sensor is released!");
         * })
         */
        function wait_until_released(callback) {
            virtualSpike.spikeMemory.funcAfterForceSensorRelease = callback;
        }

        return {
            is_pressed: is_pressed,
            get_force_newton: get_force_newton,
            get_force_percentage: get_force_percentage,
            wait_until_pressed: wait_until_pressed,
            wait_until_released: wait_until_released
        }

    }

    /** MotorPair
     * @namespace
     * @param {string} leftPort
     * @param {string} rightPort
     * @memberof Service_SPIKE
     * @example
     * var pair = new serviceSPIKE.MotorPair("A", "B")
     */
    const MotorPair = function (leftPort, rightPort) {
        // settings 
        var defaultSpeed = 100;
        var stopMethod = 1; // stop method doesnt seem to work in this current ujsonrpc config

        var leftMotor = virtualSpike.ports[leftPort];
        var rightMotor = virtualSpike.ports[rightPort];

        var DistanceTravelToRevolutionRatio = 17.6;

        // check if device is a motor
        if (leftMotor.device != "smallMotor" && leftMotor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }
        if (rightMotor.device != "smallMotor" && rightMotor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }

        /** Sets the ratio of one motor rotation to the distance traveled.
         * 
         * If there are no gears used between the motors and the wheels of the Driving Base, 
         * then amount is the circumference of one wheel.
         * 
         * Calling this method does not affect the Driving Base if it is already currently running. 
         * It will only have an effect the next time one of the move or start methods is used.
         * 
         * @param {number} amount 
         * @param {string} unit 'cm','in'
         */
        function set_motor_rotation(amount, unit) {

            // assume unit is 'cm' when undefined
            if (unit == "cm" || unit !== undefined) {
                DistanceTravelToRevolutionRatio = amount;
            }
            else if (unit == "in") {
                // convert to cm
                DistanceTravelToRevolutionRatio = amount * 2.54;
            }
        }

        function set_stop_action (action) {

        }

        /** Moves the Driving Base using differential (tank) steering.
         * 
         * @param {number} amount 
         * @param {string} unit 'rotations', 'degrees', 'seconds'
         * @param {number} left_spped [-100,100]
         * @param {number} right_speed [-100,100]
         */
        function move_tank (amount, unit, left_spped, right_speed) {
            /* this function is not implemented because "rotation" depends on a set rotatation measured by 'cm'
            */
            if (unit === 'rotations') {
                ujsonLib.moveTankDegrees(360*amount, left_speed, right_speed, leftPort, rightPort, )
            }
        }

        /** Starts moving the Driving Base
         * 
         * @param {integer} left_speed [-100 to 100]
         * @param {integer} right_speed [-100 to 100]
         * @example
         * pair.start_tank(100,100);
         */
        function start_tank(left_speed, right_speed) {
            ujsonLib.moveTankSpeeds(left_speed, right_speed, leftPort, rightPort, (c, rid) => virtualSpike.sendDATA(c));
        }

        /** Starts moving the Driving Base
         * 
         * @param {integer} leftPower [-100 to 100]
         * @param {integer} rightPower [-100 to 100]
         * @example
         * pair.start_tank_at_power(10, 10);
         */
        function start_tank_at_power(leftPower, rightPower) {
            ujsonLib.moveTankPowers(leftPower, rightPower, leftPort, rightPort, (c, rid) => virtualSpike.sendDATA(c));
        }

        /** Stops the 2 motors simultaneously, which will stop a Driving Base.
         * @example
         * pair.stop();
         */
        function stop() {
            ujsonLib.moveTankPowers(0, 0, leftPort, rightPort, (c, rid) => virtualSpike.sendDATA(c));
        }

        return {
            stop: stop,
            set_motor_rotation: set_motor_rotation,
            start_tank: start_tank,
            start_tank_at_power: start_tank_at_power
        }

    }

    const writeProgram = function (projectName, data, slotid, callback) {
        virtualSpike.writeProgram(projectName, data, slotid, callback);
    }

    const executeAfterInit = function (f) {
        if (typeof f === "function") {
            funcAtInit = f;
        }
        else {
            throw new Error("Argument to executeAfterInit must be a function")
        }
    }
    const executeAfterConnect = function (f) {
        if (typeof f === "function") {
            virtualSpike.passConnectCallback(f);
        }
        else {
            throw new Error("Argument to executeAfterConnect must be a function")
        }
    }
    const executeAfterDisconnect = function (f) {
        if (typeof f === "function") {
            virtualSpike.passDisconnectCallback(f);
        }
        else {
            throw new Error("Argument to executeAfterDisconnect must be a function")
        }
    }
    const executeAfterError = function (f) {
        if (typeof f === "function") {
            funcAfterError = f;
            virtualSpike.passErrorCallback(f);
        }
        else {
            throw new Error("Argument to executeAfterError must be a function")
        }
    }
    const executeAfterPrint = function (f) {
        if (typeof f === "function") {
            virtualSpike.passPrintCallback(f);
        }
        else {
            throw new Error("Argument to executeAfterPrint must be a function")
        }
    }
    const executeWithStream = function (f) {
        if (typeof f === "function") {
            virtualSpike.passStreamCallback(f);
        }
        else {
            throw new Error("Argument to executeWithStream must be a function")
        }
    }

    /** console log only in development
    * @private
    * @param {string} m 
    */
    const devConsoleLog = function (m) {
        if (dev === true)
            console.log("%cTuftsCEEO ", "color: #3ba336;", m);
    }

    /** console.error a message
    * @param {string} m 
    * @private
    */
    const consoleError = function (m) {
        console.error("%cTuftsCEEO ", "color: #3ba336;", m);
    }

    /**  Sleep function
    * @private
    * @param {number} ms Miliseconds to sleep
    * @returns {Promise} 
    */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    return {
        init: init,
        isActive: isActive,
        writeProgram: writeProgram,
        // SPIKE devices
        Motor: Motor,
        PrimeHub: PrimeHub,
        ForceSensor: ForceSensor,
        DistanceSensor: DistanceSensor,
        ColorSensor: ColorSensor,
        MotorPair: MotorPair,
        // key event callback setters
        executeAfterConnect: executeAfterConnect,
        executeAfterDisconnect: executeAfterDisconnect,
        executeAfterError: executeAfterError,
        executeAfterPrint: executeAfterPrint,
        executeWithStream: executeWithStream,
        executeAfterInit: executeAfterInit,
    }
}