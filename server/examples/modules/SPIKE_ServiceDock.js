// import { SPIKE_Service } from "./SPIKE_Service.js";

class spikeservice extends HTMLElement {   

    constructor () {
        super();
        this.service = new SPIKE_Service();
        this.active = false;

        // Create a shadow root
        var shadow = this.attachShadow({ mode: 'open' });

        // Create spans
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        wrapper.setAttribute("style", "width: 50px; height: 50px; position: relative;")
        /* making systemlink button */

        // define the button
        var button = document.createElement("button");
        button.setAttribute("id", "sl_button");
        button.setAttribute("class", "SD_button");
        var slButtonStyle = "width: 50px; height: 50px; background: url(./modules/views/four.png) no-repeat; background-size: 40px 40px; background-color: #A2E1EF; border: none;"
            + "background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", slButtonStyle);

        //var style = document.createElement("style");
        //style.textContent = "#sl_button:hover { color:#000000; background-color:#FFFFFF;}";

        /* button mouse hover/leave event listeners */
        button.addEventListener("mouseleave", function (event) {
            button.style.backgroundColor = "#A2E1EF";
            button.style.color = "#000000";
        });

        button.addEventListener("mouseenter", function (event) {
            button.style.backgroundColor = "#FFFFFF";
            button.style.color = "#000000";
        })

        this.addEventListener("dblclick", function () {
            console.log("activating service");
            this.active = true;
            this.service.init();
        });


        shadow.appendChild(wrapper);
        wrapper.appendChild(button);

    }

    getService() {
        return this.service;
    }

    getClicked() {
        return this.active;
    }
    
}

window.customElements.define('spike-service', spikeservice);

/*
Project Name: SPIKE Prime Web Interface
File name: SPIKE_Service.js
Author: Jeremy Jung
Last update: 7/15/20
Description: SPIKE Service Library (OOP)
Credits/inspirations:
    Based on code wrriten by Ethan Danahy, Chris Rogers
History:
    Created by Jeremy on 7/15/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

function SPIKE_Service() {

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
        "A": { "None": {} },
        "B": { "None": {} },
        "C": { "None": {} },
        "D": { "None": {} },
        "E": { "None": {} },
        "F": { "None": {} }
    }

    var micropython_interpreter = false; // whether micropython was reached or not

    let serviceActive = false;
    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize SPIKE_service
    *
    * Effect:
    * - Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled)
    * - Starts streaming UJSONRPC
    * 
    * Note:
    * This function needs to be executed first before executing any other public functions of this class
    */
    async function init() {
        // initialize web serial connection
        var webSerialConnected = await initWebSerial();

        if (webSerialConnected) {
            // start streaming UJSONRPC
            streamUJSONRPC();
            serviceActive = true;
            return true;
        }
        else {
            return false;
        }
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
    * ports.{yourPortLetter}.info --returns--> device info (ex. {"speed": 0, "angle":0, "uAngle": 0, "power":0} ) 
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

    async function getPortInfo(letter) {
        return ports[letter];
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
            ', "speed":' + speed + ', "stall":' + stall + '} }'
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

                let device_value = { "device": "none", "info": {} }; // value to go in ports associated with the port letter keys

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
                        device_value.info = { "speed": Mspeed, "angle": Mangle, "uAngle": Muangle, "power": Mpower };
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
                        device_value.info = { "speed": Mspeed, "angle": Mangle, "uAngle": Muangle, "power": Mpower };
                        ports[letter] = device_value;

                    }
                    // get ULTRASONIC sensor information
                    else if (data_stream[key][0] == 62) {

                        // parse ultrasonic sensor information
                        var Udist = await data[key][1][0];

                        // populate value object
                        device_value.device = "ultrasonic";
                        device_value.info = { "distance": 0 };
                        ports[letter] = device_value;
                    }
                    // get FORCE sensor information
                    else if (data_stream[key][0] == 63) {

                        // parse force sensor information
                        var Famount = await data[key][1][0];
                        var Fbinary = await data[key][1][1];
                        var Fbigamount = await data[key][1][2];

                        // populate value object
                        device_value = "force";
                        device_value.info = { "force": Famount, "pressed": Fbinary, "forceSensitive": Fbitamount }
                        ports[letter] = device_value;
                    }
                    // get COLOR sensor information
                    else if (data_stream[key][0] == 61) {

                        // parse color sensor information
                        var Creflected = await data[key][1][0];
                        var Cambient = await data[key][1][1];
                        var Cr = await data[key][1][2];
                        var Cg = await data[key][1][3];
                        var Cb = await data[key][1][4];
                        var rgb_array = [Cr, Cg, Cb];

                        // populate value object
                        device_value.device = "color";
                        device_value.info = { "reflected": Creflected, "ambient": Cambient, "RGB": rgb_array };
                        ports[letter] = device_value;
                    }
                    /// NOTHING is connected
                    else if (data_stream[key][0] == 0) {
                        // populate value object
                        device_value.device = "none";
                        device_value.info = {};
                        ports[letter] = device_value;
                    }

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
                            // reader has been canceled.
                            console.log("[readLoop] DONE", done);
                        }
                    }
                    // error handler
                    catch (error) {
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
        getPortsInfo: getPortsInfo,
        getPortInfo: getPortInfo,
        displayText: displayText,
        displayImage: displayImage,
        motorStart: motorStart,
        isActive: isActive
    };
}