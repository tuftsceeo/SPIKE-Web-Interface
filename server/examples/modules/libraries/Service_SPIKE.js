/*
Project Name: SPIKE Prime Web Interface
File name: Service_SPIKE.js
Author: Jeremy Jung
Last update: 7/22/20
Description: SPIKE Service Library (OOP)
Credits/inspirations:
    Based on code wrriten by Ethan Danahy, Chris Rogers
History:
    Created by Jeremy on 7/15/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

function Service_SPIKE() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* private members */

    const VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub

    // common characters to send (for REPL/uPython on the Hub)
    const CONTROL_C = '\x03'; // CTRL-C character (ETX character)
    const CONTROL_D = '\x04'; // CTRL-D character (EOT character)
    const RETURN = '\x0D';	// RETURN key (enter, new line)

    const filter = {
        usbVendorId: VENDOR_ID
    };

    // define for communication
    let port;
    let reader;
    let writer;
    let value;
    let done;

    //define for json concatenation
    let jsonline = ""

    // contains latest full json object from SPIKE readings
    let one_line;

    // object containing real-time info on devices connected to each port of SPIKE Prime 
    let ports =
    {
        "A": { "device": "none", "data": {} },
        "B": { "device": "none", "data": {} },
        "C": { "device": "none", "data": {} },
        "D": { "device": "none", "data": {} },
        "E": { "device": "none", "data": {} },
        "F": { "device": "none", "data": {} }
    }
    let hub =
    {
        "gyro": [0, 0, 0],
        "accel": [0, 0, 0],
        "pos": [0, 0, 0]
    }

    var micropython_interpreter = false; // whether micropython was reached or not

    let serviceActive = false; //serviceActive flag

    var funcAtInit = undefined; // function to call after init

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize SPIKE_service
    *
    * Parameter:
    * 
    * Effect:
    * - Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled)
    * - Starts streaming UJSONRPC
    * 
    * Note:
    * - this function needs to be executed after executeAfterInit but before all other public functions
    */
    async function init() {
        // initialize web serial connection
        var webSerialConnected = await initWebSerial();

        if (webSerialConnected) {
            // start streaming UJSONRPC
            streamUJSONRPC();
            serviceActive = true;

            await sleep(2000); // wait for service to init

            // call funcAtInit if defined
            if (funcAtInit !== undefined) {
                funcAtInit();
            }
            return true;
        }
        else {
            return false;
        }
    }

    /* executeAfterInit() - get the callback function to execute after service is initialized
    *
    * Parameter:
    * {callback} (function) - function to execute after initialization
    * Effect:
    * - assigns global variable funcAtInit a pointer to callback function
    *
    * Note:
    * This function needs to be executed before calling init()
    */
    function executeAfterInit(callback) {
        funcAtInit = callback;
    }

    /* sendDATA() - send UJSON RPC command to the SPIKE Prime
     * 
     * Parameters:
     * {command} (string) - a string to send (or sequence of commands, separated by new lines)
     * 
     * Effect:
     * May make the SPIKE Prime do something
     */
    async function sendDATA(command) {
        // look up the command to send
        commands = command.split("\n"); // split on new line
        //commands = command
        console.log("sendDATA: " + commands);

        // make sure ready to write to device
        setupWriter();

        // go through each line of the command
        // trim it, send it, and send a return...
        for (var i = 0; i < commands.length; i++) {
            console.log("commands.length", commands.length)
            current = commands[i].trim();
            //console.log("current", current);
            // turn string into JSON

            //string_current = (JSON.stringify(current));
            //myobj = JSON.parse(string_current);
            var myobj = await JSON.parse(current);

            // turn JSON back into string and write it out
            writer.write(JSON.stringify(myobj));
            writer.write(RETURN); // extra return at the end
        }
    }

    /* rebootHub() - send character sequences to reboot SPIKE Prime
    * 
    */
    async function rebootHub() {
        console.log("rebooting")
        // make sure ready to write to device
        setupWriter();
        writer.write(CONTROL_C);
        writer.write(CONTROL_D);

        //toggle micropython_interpreter flag if its was active
        if (micropython_interpreter) {
            micropython_interpreter = false;
        }
    }

    /* getPortsInfo() - 
    *
    * Returns:
    * {ports} (object/dictionary) - an object with keys as port letters and values as objects of device type and info
    *
    * Note:
    * ///USAGE///
    * ports = await getPortsInfo();
    * ports.{yourPortLetter}.device --returns--> device type (ex. "smallMotor" or "ultrasonic")
    * ports.{yourPortLetter}.data --returns--> device info (ex. {"speed": 0, "angle":0, "uAngle": 0, "power":0} ) 
    *
    * MOTOR_INFO = { "speed": motor speed, 
    *               "angle": motor angle , 
    *               "uAngle": motor angle in unit circle ( -180 ~ 180 ), 
    *               "power": motor power }
    * 
    * ULTRASONIC_INFO = { "distance": distance from surface }
    * 
    * COLOR_SENSOR_INFO = { "reflected": reflected luminosity,
    *                       "ambient": ambient luminosity, 
    *                       "RGB": [R, G, B] }
    * 
    * FORCE_SENSOR_INFO = { "force": pressed force amount ( 1 ~ 10 ), 
    *                       "pressed": whether pressed or not ( 0 or 1 ), 
    *                       "forceSensitive": a more sesntiive pressed force amount ( 0 ~ 900 ) }
    */
    async function getPortsInfo() {
        return ports;
    }

    /* getPortInfo() - get the info of a single port
    *
    * Parameter:
    * {letter} - letter of the port to retrieve data from
    * Returns:
    * {port[leter]} (object/dictionary) - an object with keys as device and info
    */
    async function getPortInfo(letter) {
        return ports[letter];
    }

    /* getHubInfo() - get info of the hub
    *
    * Returns:
    * {hub} (object/dict) - includes info of the hub
    */
    async function getHubInfo() {
        return hub;
    }

    /* reach_micropython() - reach the micropython interpreter beneath UJSON RPC
    * 
    * Effect:
    * stops UJSON RPC stream
    * 
    * Note:
    * to get UJSON RPC back, hub needs to be rebooted
    */
    async function reachMicroPy() {
        console.log("starting micropy interpreter");
        setupWriter();
        writer.write(CONTROL_C);
        micropython_interpreter = true;
    }

    /* sendPythonDATA() - send micropy commands to hub
    * 
    * Effect:
    * may make the hub do something
    * 
    */
    function sendPythonDATA(command) {
        if (micropython_interpreter) {
            var commands = command.split("\n"); // split on new line
            setupWriter();
            console.log("sendpythonDATA: " + commands);
            for (var i = 0; i < commands.length; i++) {
                console.log("commands.length", commands.length)

                // trim trailing, leading whitespaces
                var current = commands[i].trim();

                writer.write(current);
                writer.write(RETURN); // extra return at the end
            }
        }
    }

    /* isActive() - get whether the Service was initialized or not
    *
    * Returns:
    * {serviceActive} (boolean) - whether Service was initialized or not
    */
    function isActive() {
        return serviceActive;
    }

    //////////////////////////////////////////
    //                                      //
    //          UJSONRPC Functions          //
    //                                      //
    //////////////////////////////////////////

    async function displayText(text) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.display_text", "p": {"text":' + '"' + text + '"' + '} }'
        sendDATA(command);
    }

    async function displayImage(image) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.display_image", "p": {"image":' + '"' + image + '"' + '} }'
        sendDATA(command);
    }

    async function motorStart(port, speed, stall) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.motor_start", "p": {"port":' + '"' + port + '"' +
            ', "speed":' + speed + ', "stall":' + stall + '} }';
        sendDATA(command);
    }

    /* doesnt work, runtime_error a KeyError at handling motor_stop in python firmware */
    async function motorStop(port) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.motor_stop", "p": {"port":' + '"' + port + '"' + '} }';
        sendDATA(command);
    }

    async function motorPwm(port, power, stall) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.motor_start", "p": {"port":' + '"' + port + '"' +
            ', "power":' + power + ', "stall":' + stall + '} }';
        sendDATA(command);
    }

    async function lightUltrasonic(port, lights) {
        var lightsOptions = ['upper-left', 'upper-right', 'lower-left', 'lower-right'];
        var validLights = false;
        console.log("lights", lights)
        // check if the lights parameter is correctly given
        for (var option in lightsOptions) {
            console.log("option", option)
            if (lightsOptions[option] == lights) {
                validLights = true;
                break;
            }
        }
        // throw error when invalid parameter
        if (!validLights) {
            throw Error("lights parameter is not valid, choose from: 'upper-left', 'upper-right', 'lower-left', 'lower-right'")
        }
        else {
            var randomId = Math.floor((Math.random() * 10000));
            var command = '{"i":' + randomId + ', "m": "scratch.ultrasonic_light_up", "p": {"port":' + '"' + port
                + '", ' + '"lights":' + '"' + lights + '"' + '} }';
            sendDATA(command);
        }

    }

    async function getFirmwareInfo() {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "get_firmware_info" ' + '}';
        sendDATA(command);
    }



    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////

    //sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* updateHubPortsInfo() - get the devices that are connected to each port on the SPIKE Prime
    * 
    * Effect:
    * - Modifies {ports} global variable
    * - Modifies {hub} global variable
    */
    async function updateHubPortsInfo() {

        // if a complete ujson rpc line was read
        if (one_line) {
            var data_stream; //UJSON RPC info to be parsed

            //get a line from the latest JSON RPC stream and parse to devices info
            try {
                data_stream = await JSON.parse(await getLatestUJSON());
                data_stream = data_stream.p;
            }
            catch (e) {
                console.log("error parsing one_Line at get_devices", one_line);
            }


            var index_to_port = ["A", "B", "C", "D", "E", "F"]

            // iterate through each port and assign a device_type to {ports}
            for (var key = 0; key < 6; key++) {

                let device_value = { "device": "none", "data": {} }; // value to go in ports associated with the port letter keys

                try {
                    var letter = index_to_port[key]

                    // get SMALL MOTOR information
                    if (data_stream[key][0] == 48) {

                        // parse motor information
                        var Mspeed = await data_stream[key][1][0];
                        var Mangle = await data_stream[key][1][1];
                        var Muangle = await data_stream[key][1][2];
                        var Mpower = await data_stream[key][1][3];

                        // populate value object
                        device_value.device = "smallMotor";
                        device_value.data = { "speed": Mspeed, "angle": Mangle, "uAngle": Muangle, "power": Mpower };
                        ports[letter] = device_value;
                    }
                    // get BIG MOTOR information
                    else if (data_stream[key][0] == 49) {
                        // parse motor information
                        var Mspeed = await data_stream[key][1][0];
                        var Mangle = await data_stream[key][1][1];
                        var Muangle = await data_stream[key][1][2];
                        var Mpower = await data_stream[key][1][3];

                        // populate value object
                        device_value.device = "bigMotor";
                        device_value.data = { "speed": Mspeed, "angle": Mangle, "uAngle": Muangle, "power": Mpower };
                        ports[letter] = device_value;

                    }
                    // get ULTRASONIC sensor information
                    else if (data_stream[key][0] == 62) {

                        // parse ultrasonic sensor information
                        var Udist = await data_stream[key][1][0];

                        // populate value object
                        device_value.device = "ultrasonic";
                        device_value.data = { "distance": Udist };
                        ports[letter] = device_value;
                    }
                    // get FORCE sensor information
                    else if (data_stream[key][0] == 63) {

                        // parse force sensor information
                        var Famount = await data_stream[key][1][0];
                        var Fbinary = await data_stream[key][1][1];
                        var Fbigamount = await data_stream[key][1][2];

                        // populate value object
                        device_value.device = "force";
                        device_value.data = { "force": Famount, "pressed": Fbinary, "forceSensitive": Fbigamount }
                        ports[letter] = device_value;
                    }
                    // get COLOR sensor information
                    else if (data_stream[key][0] == 61) {

                        // parse color sensor information
                        var Creflected = await data_stream[key][1][0];
                        var Cambient = await data_stream[key][1][1];
                        var Cr = await data_stream[key][1][2];
                        var Cg = await data_stream[key][1][3];
                        var Cb = await data_stream[key][1][4];
                        var rgb_array = [Cr, Cg, Cb];

                        // populate value object
                        device_value.device = "color";
                        device_value.data = { "reflected": Creflected, "ambient": Cambient, "RGB": rgb_array };
                        ports[letter] = device_value;
                    }
                    /// NOTHING is connected
                    else if (data_stream[key][0] == 0) {
                        // populate value object
                        device_value.device = "none";
                        device_value.data = {};
                        ports[letter] = device_value;
                    }

                    //parse hub information
                    var gyro_x = data_stream[6][0];
                    var gyro_y = data_stream[6][1];
                    var gyro_z = data_stream[6][2];
                    var gyro = [gyro_x, gyro_y, gyro_z];
                    hub["gyro"] = gyro;

                    var accel_x = data_stream[7][0];
                    var accel_y = data_stream[7][1];
                    var accel_z = data_stream[7][2];
                    var accel = [accel_x, accel_y, accel_z];
                    hub["accel"] = accel;

                    var posi_x = data_stream[8][0];
                    var posi_y = data_stream[8][1];
                    var posi_z = data_stream[8][2];
                    var pos = [posi_x, posi_y, posi_z];
                    hub["pos"] = pos;

                } catch (e) { } //ignore errors
            }
        }
    }

    /* getLatestUJSON() - get the latest complete line of UJSON RPC from stream 
    * 
    * Effect:
    * Logs in the console when some particular messages are caught
    * 
    *  Returns:
    * {one_line} (string) - a string represent a JSON object from UJSON RPC
    * 
    */
    async function getLatestUJSON() {

        try {
            var result = await JSON.parse(one_line)
            //catch runtime_error made at ujsonrpc level
            if (result["m"] == "runtime_error") {
                console.log(one_line);
            }
            //catch this mysterious thing
            else if (result["m"] == 2) {
                //console.log(one_line);
            }
        }
        catch (error) {
            //console.log('[retrieveData] ERROR', error);
        }

        return one_line
    }

    /* setupWriter() - initialize writer object before sending commands
    */
    function setupWriter() {
        // if writer not yet defined:
        if (typeof writer === 'undefined') {
            // set up writer for the first time
            const encoder = new TextEncoderStream();
            const writableStreamClosed = encoder.readable.pipeTo(port.writable);
            writer = encoder.writable.getWriter();
        }
    }

    /* initWebSerial() - prompt user to select web serial port and make connection to SPIKE Prime
    * 
    * Effect:
    * Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled)
    *
    * Note:
    * This function is to be executed before reading in JSON RPC streams from the hub
    * This function needs to be called when system is handling a user gesture (like button click)
    */
    async function initWebSerial() {
        var success = false;

        port = await navigator.serial.getPorts();
        console.log("ports:", port);
        try {
            // select device
            port = await navigator.serial.requestPort({
                filters: [filter]
            });
            // wait for the port to open.
            await port.open({ baudrate: 115200 });
            success = true;

        } catch (e) {
            console.log("Cannot read port:", e);
        }

        return success
    }

    /* streamUJSONRPC() - Continuously take UJSON RPC input from SPIKE Prime
    * 
    * Effect:
    * Changes "#connection_status" icon in servicedock.html
    * 
    */
    async function streamUJSONRPC() {
        try {
            // read when port is set up
            while (port.readable) {

                // initialize readers
                const decoder = new TextDecoderStream();
                const readableStreamClosed = port.readable.pipeTo(decoder.writable);
                reader = decoder.readable.getReader();

                // continuously get
                while (true) {
                    try {
                        // read UJSON RPC stream ( actual data in {value} )
                        ({ value, done } = await reader.read());

                        // log value
                        if (micropython_interpreter) {
                            console.log(value)
                        }

                        //concatenating incomplete json objects from the hub
                        if (value) {
                            /* stringify input value and concatenate to jsonline */
                            var json_string = JSON.stringify(value)
                            jsonline = jsonline + value

                            /* parse jsonline where the JSON object starts and ends */
                            var rcb_index = json_string.indexOf('}')
                            var lcb_index = json_string.indexOf('{')

                            // if the right curly brace exists (end of json)
                            if (rcb_index > -1) {

                                // if the first index is a left curly brace (start of json)
                                if (jsonline[0] === "{") {

                                    /* get substring until instance of }\r */

                                    // when REPL is declared with vanilla js (ex) document.getElementById
                                    one_line = jsonline.substring(0, jsonline.indexOf('}') + 2)

                                    // when REPL is decalred with jquery (ex) $("#REPL")
                                    //one_line = jsonline.substring(0,jsonline.indexOf('}')+4)

                                    updateHubPortsInfo();
                                }

                                // reset jsonline to concatenate next stream
                                jsonline = ""
                            }
                        }
                        if (done) {
                            serviceActive = false;
                            // reader has been canceled.
                            console.log("[readLoop] DONE", done);
                        }
                    }
                    // error handler
                    catch (error) {
                        serviceActive = false;
                        console.log('[readLoop] ERROR', error);
                        // error detected: release
                        reader.releaseLock();
                        await readableStreamClosed.catch(reason => { });
                        await port.close();
                        break; // stop trying to read
                    }
                } // end of: while (true) [reader loop]

                // release the lock
                reader.releaseLock();

            } // end of: while (port.readable) [checking if readable loop]
            console.log("- port.readable is FALSE")
        } // end of: trying to open port
        catch (e) {
            serviceActive = false;
            // Permission to access a device was denied implicitly or explicitly by the user.
            console.log('ERROR trying to open:', e);
        }
    }

    // public members
    return {
        init: init,
        sendDATA: sendDATA,
        rebootHub: rebootHub,
        reachMicroPy: reachMicroPy,
        sendPythonDATA: sendPythonDATA,
        executeAfterInit: executeAfterInit,
        getPortsInfo: getPortsInfo,
        getPortInfo: getPortInfo,
        getHubInfo: getHubInfo,
        displayText: displayText,
        displayImage: displayImage,
        motorStart: motorStart,
        getFirmwareInfo: getFirmwareInfo,
        motorPwm: motorPwm,
        lightUltrasonic: lightUltrasonic,
        isActive: isActive,
        getLatestUJSON: getLatestUJSON
    };
}