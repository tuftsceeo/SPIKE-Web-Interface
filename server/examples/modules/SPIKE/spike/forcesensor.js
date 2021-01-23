
/** ForceSensor
 * @namespace
 * @param {string} Port
 * @memberof Service_SPIKE
 * @example
 * // Initialize the ForceSensor
 * var force = new mySPIKE.ForceSensor("E")
 */
Service_SPIKE.prototype.ForceSensor = function (port) {

    var sensor = this.ports[port]; // get the force sensor info by port

    if (sensor.device != "force") {
        throw new Error("No Force Sensor detected at port " + port);
    }

    /** Tests whether the button on the sensor is pressed.
     * 
     * @returns {boolean} true if force sensor is pressed, false otherwise
     */
    function is_pressed() {
        var sensor = this.ports[port]; // get the force sensor info by port
        var ForceSensorData = sensor.data;

        return ForceSensorData.pressed;
    }

    /** Retrieves the measured force, in newtons.
     * 
     * @returns {number}  Force in newtons [0 to 10]
     */
    function get_force_newton() {
        var sensor = this.ports[port]; // get the force sensor info by port
        var ForceSensorData = sensor.data;

        return ForceSensorData.force;
    }

    /** Retrieves the measured force as a percentage of the maximum force.
     * 
     * @returns {number} percentage [0 to 100]
     */
    function get_force_percentage() {
        var sensor = this.ports[port]; // get the force sensor info by port
        var ForceSensorData = sensor.data;

        var denominator = 704 - 384 // highest detected - lowest detected forceSensitive values
        var numerator = ForceSensorData.forceSensitive - 384 // 384 is the forceSensitive value when not pressed
        var percentage = Math.round((numerator / denominator) * 100);
        return percentage;
    }

    /** Executes callback when Force Sensor is pressed
     * The function is executed in updateHubPortsInfo()'s Force Sensor part
     * 
     * @param {function} callback 
     */
    function wait_until_pressed(callback) {
        this.funcAfterForceSensorPress = callback;
    }

    /** Executes callback when Force Sensor is released
     * The function is executed in updateHubPortsInfo()'s Force Sensor part
     * @param {function} callback 
     */
    function wait_until_released(callback) {
        this.funcAfterForceSensorRelease = callback;
    }

    return {
        is_pressed: is_pressed,
        get_force_newton: get_force_newton,
        get_force_percentage: get_force_percentage,
        wait_until_pressed: wait_until_pressed,
        wait_until_released: wait_until_released
    }

}