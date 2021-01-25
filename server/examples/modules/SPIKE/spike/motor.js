/** Motor
 * @namespace
 * @memberof! Service_SPIKE
 * @param {string} Port
 * @returns {functions}
 * @example
 * // Initialize the Motor
 * var motor = new mySPIKE.Motor("A")
 */
Service_SPIKE.prototype.Motor = function (port) {

    var motor = this.ports[port]; // get the motor info by port

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
        var motor = this.ports[port]; // get the motor info by port
        var motorInfo = motor.data;
        return motorInfo.speed;

    }

    /** Get current position of the motor. The position may differ by a little margin from 
     * the position to which a motor ran with run_to_position()
     * @returns {number} position of motor [0 to 359]
     */
    function get_position() {
        var motor = this.ports[port]; // get the motor info by port
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
        var motor = this.ports[port]; // get the motor info by port
        var motorInfo = motor.data;
        return motorInfo.angle;
    }

    /** Get the power of the motor
     * 
     * @returns {number} motor power
     */
    function get_power() {
        var motor = this.ports[port]; // get the motor info by port
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
        if (typeof boolean == "boolean") {
            stallSetting = boolean;
        }
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
     * mySPIKE.run_to_position(180, 100, function() {
     *      console.log("motor finished moving");
     * })
     */
    function run_to_position(degrees, direction, speed, callback = undefined) {
        if (speed !== undefined && typeof speed == "number")
            this.UJSONRPC.motorGoRelPos(port, degrees, speed, stallSetting, stopMethod, callback);
        else
            this.UJSONRPC.motorGoRelPos(port, degrees, defaultSpeed, stallSetting, stopMethod, callback);
    }

    /** Runs the motor until the number of degrees counted is equal to the value that has been specified by the "degrees" parameter.
     * 
     * @param {integer} degrees any number
     * @param {integer} speed [0 to 100]
     * @param {any} [callback] (optional callback) callback param: "stalled" or "done"
     */
    this.run_to_degrees_counted = function (degrees, speed, callback = undefined) {
        console.log("this in runtodeg: ", this);
        if (speed !== undefined && typeof speed == "number")
            this.UJSONRPC.motorGoRelPos(port, degrees, speed, stallSetting, stopMethod, callback);
        else
            this.UJSONRPC.motorGoRelPos(port, degrees, defaultSpeed, stallSetting, stopMethod, callback);


    }.bind(this);

    /** Start the motor at some power
     * 
     * @param {integer} power [-100 to 100]
     */
    function start_at_power(power) {
        this.UJSONRPC.motorPwm(port, power, stallSetting);
    }


    /** Start the motor at some speed
     * 
     * @param {integer} speed [-100 to 100]
     */
    function start(speed = defaultSpeed) {

        this.UJSONRPC.motorStart(port, speed, stallSetting);
    }

    /** Run the motor for some seconds
     * 
     * @param {integer} seconds 
     * @param {integer} speed [-100 to 100]
     * @param {function} [callback==undefined] Parameters:"stalled" or "done"
     * @example
     * mySPIKE.run_for_seconds(10, 100, function() {
     *      console.log("motor just ran for 10 seconds");
     * })
     */
    function run_for_seconds(seconds, speed, callback = undefined) {
        if (speed !== undefined && typeof speed == "number") {
            this.UJSONRPC.motorRunTimed(port, seconds, speed, stallSetting, stopMethod, callback)
        }
        else {
            this.UJSONRPC.motorRunTimed(port, seconds, defaultSpeed, stallSetting, stopMethod, callback)
        }
    }

    /** Run the motor for some degrees
     * 
     * @param {integer} degrees 
     * @param {integer} speed [-100 to 100]
     * @param {function} [callback==undefined] Parameters:"stalled" or "done"
     * mySPIKE.run_for_degrees(720, 100, function () {
     *      console.log("motor just ran for 720 degrees");
     * })
     */
    function run_for_degrees(degrees, speed, callback = undefined) {
        if (speed !== undefined && typeof speed == "number") {
            this.UJSONRPC.motorRunDegrees(port, degrees, speed, stallSetting, stopMethod, callback);
        }
        else {
            this.UJSONRPC.motorRunDegrees(port, degrees, defaultSpeed, stallSetting, stopMethod, callback);
        }
    }

    /** Stop the motor
     * 
     */
    function stop() {
        this.UJSONRPC.motorPwm(port, 0, stallSetting);
    }

    return {
        run_to_position: run_to_position,
        run_to_degrees_counted: this.run_to_degrees_counted,
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