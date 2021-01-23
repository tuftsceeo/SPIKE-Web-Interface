
/**  initialize SPIKE_service
 * <p> Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled) </p>
 * <p> Starts streaming UJSONRPC </p>
 * <p> <em> this function needs to be executed after executeAfterInit but before all other public functions </em> </p>
 * @public
 * @returns {boolean} True if service was successsfully initialized, false otherwise
 */
Service_SPIKE.prototype.init = async function () {
    
    console.log("%cTuftsCEEO ", "color: #3ba336;", "navigator.product is ", navigator.product);

    console.log("%cTuftsCEEO ", "color: #3ba336;", "navigator.appName is ", navigator.appName);
    // reinit variables in the case of hardware disconnection and Service reactivation
    this.reader = undefined;
    this.writer = undefined;

    // initialize web serial connection
    var webSerialConnected = await this.initWebSerial();

    if (webSerialConnected) {

        // start streaming UJSONRPC
        this.streamUJSONRPC();

        await this.sleep(1000);

        // this.triggerCurrentState();
        this.serviceActive = true;

        await this.sleep(2000); // wait for service to init

        // call funcAtInit if defined
        if (this.funcAtInit !== undefined) {
            this.funcAtInit();
        }
        return true;
    }
    else {
        return false;
    }
}


/**  Get the callback function to execute after service is initialized.
     * <p> <em> This function needs to be executed before calling init() </em> </p>
     * @public
     * @param {function} callback Function to execute after initialization ( during init() )
     * @example
     * mySPIKE.executeAfterInit( function () {
     *     var motor = mySPIKE.Motor("A");
     *     var speed = motor.get_speed();
     *     // do something with speed
     * })
     */
Service_SPIKE.prototype.executeAfterInit = function (callback) {
    // Assigns global variable funcAtInit a pointer to callback function
    this.funcAtInit = callback;
}

/**  Get the callback function to execute after a print or error from SPIKE python program
 * @ignore
 * @param {function} callback 
 */
Service_SPIKE.prototype.executeAfterPrint = function (callback) {
    this.funcAfterPrint = callback;
}

/**  Get the callback function to execute after Service Dock encounters an error
 * @ignore
 * @param {any} callback 
 */
Service_SPIKE.prototype.executeAfterError = function (callback) {
    this.funcAfterError = callback;
}

/**  Execute a stack of functions continuously with SPIKE sensor feed
 * 
 * @public
 * @param {any} callback 
 * @example
 * var motor = new mySPIKE.Motor('A')
 * mySPIKE.executeWithStream( async function() {
 *      var speed = await motor.get_speed();
 *      // do something with motor speed
 * })
 */
Service_SPIKE.prototype.executeWithStream = function (callback) {
    this.funcWithStream = callback;
}

/**  Get the callback function to execute after service is disconnected
 * @ignore
 * @param {any} callback 
 */
Service_SPIKE.prototype.executeAfterDisconnect = function (callback) {
    this.funcAfterDisconnect = callback;
}