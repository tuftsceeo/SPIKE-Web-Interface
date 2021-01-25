
/** MotorPair
 * @namespace
 * @param {string} leftPort
 * @param {string} rightPort
 * @memberof Service_SPIKE
 * @example
 * var pair = new mySPIKE.MotorPair("A", "B")
 */
Service_SPIKE.prototype.MotorPair = function (leftPort, rightPort) {
    // settings 
    var defaultSpeed = 100;

    var leftMotor = this.ports[leftPort];
    var rightMotor = this.ports[rightPort];

    var DistanceTravelToRevolutionRatio = 17.6;

    // check if device is a motor
    if (leftMotor.device != "smallMotor" && leftMotor.device != "bigMotor") {
        throw new Error("No motor detected at port " + this.port);
    }
    if (rightMotor.device != "smallMotor" && rightMotor.device != "bigMotor") {
        throw new Error("No motor detected at port " + this.port);
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

    /** Starts moving the Driving Base
     * 
     * @param {integer} left_speed [-100 to 100]
     * @param {integer} right_speed [-100 to 100]
     */
    function start_tank(left_speed, right_speed) {
        UJSONRPC.moveTankSpeeds(left_speed, right_speed, leftPort, rightPort);
    }

    // /** Starts moving the Driving Base without speed control.
    //  * 
    //  * @param {any} power 
    //  * @param {any} steering 
    //  * @todo Implement this function
    //  */
    // function start_at_power (power, steering) {

    // }

    /** Starts moving the Driving Base
     * 
     * @param {integer} leftPower 
     * @param {integer} rightPower  
     */
    function start_tank_at_power(leftPower, rightPower) {
        UJSONRPC.moveTankPowers(leftPower, rightPower, leftPort, rightPort);
    }

    /** Stops the 2 motors simultaneously, which will stop a Driving Base.
     * 
     */
    function stop() {
        UJSONRPC.moveTankPowers(0, 0, leftPort, rightPort);
    }

    return {
        stop: stop,
        set_motor_rotation: set_motor_rotation,
        start_tank: start_tank,
        start_tank_at_power: start_tank_at_power
    }

}