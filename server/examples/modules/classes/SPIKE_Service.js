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

    //////////////////////////////////////////
    //                                      //
    //             Functions                //
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
        await initWebSerial();

        // start streaming UJSONRPC
        streamUJSONRPC();

        return true;
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
        success = false;

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
            console.log('ERROR trying to open:', e);
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
                        ({value, done} = await reader.read());
                        
                        // log value
                        if (micropython_interpreter) {
                            console.log(value)
                        }

                        //concatenating incomplete json objects from the hub
                        if (value) {
                            /* stringify input value and concatenate to jsonline */
                            json_string = JSON.stringify(value)
                            jsonline = jsonline + value

                            /* parse jsonline where the JSON object starts and ends */
                            rcb_index = json_string.indexOf('}')
                            lcb_index = json_string.indexOf('{')

                            // if the right curly brace exists (end of json)
                            if (rcb_index > -1) {

                                // if the first index is a left curly brace (start of json)
                                if (jsonline[0] === "{") {

                                    /* get substring until instance of }\r */

                                    // when REPL is declared with vanilla js (ex) document.getElementById
                                    one_line = jsonline.substring(0,jsonline.indexOf('}')+2)

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
                        await readableStreamClosed.catch(reason => {});
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
            result = await JSON.parse(one_line)
            //catch runtime_error made at ujsonrpc level
            if( result["m"] == "runtime_error" ) {
                console.log(one_line);
            }
            //catch this mysterious thing
            else if (result["m"]== 2) {
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
        for ( var i = 0; i < commands.length; i++ ) {
            console.log("commands.length", commands.length)
            current = commands[i].trim();
            //console.log("current", current);
            // turn string into JSON
            //string_current = (JSON.stringify(current));
            //myobj = JSON.parse(string_current);
            myobj = await JSON.parse(current);
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


    /* updateHubPortsInfo() - get the devices that are connected to each port on the SPIKE Prime
     * 
     * Effect:
     * - Modifies {ports} object
     * 
     * Returns:
     * {ports} (object/dictionary) - an object with keys as port letters and values as strings of connected devices
     * 
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
            catch (e){
                console.log("error parsing one_Line at get_devices", one_line);
            }


            var index_to_port = ["A", "B", "C", "D", "E", "F"]

            // iterate through each port and assign a device_type to {ports}
            for (var key = 0; key < 6; key++) {

                let device_value = { "device": "None", "info": {} }; // value to go in ports associated with the port letter keys
                
                try {
                    var the_key = index_to_port[key]

                    // get MOTOR information
                    if (data_stream[key][0] == 48 || data_stream[key][0] == 49) {

                        // parse motor information
                        Mspeed = await data_stream[key][1][0];
                        Mangle = await data_stream[key][1][1];
                        Muangle = await data_stream[key][1][2];
                        Mpower = await data_stream[key][1][3];

                        // populate value object
                        device_value.device = "Motor";
                        device_value.info = { "Speed": Mspeed, "Angle": Mangle, "UAngle": Muangle, "Power": Mpower };
                        ports[the_key] = device_value;
                    }
                    // get ULTRASONIC sensor information
                    else if (data_stream[key][0] == 62) {

                        // parse ultrasonic sensor information
                        Udist = await data[key][1][0];

                        // populate value object
                        device_value.device = "Ultrasonic";
                        device_value.info = { "Distance": 0 };
                        ports[the_key] = device_value;
                    }
                    // get FORCE sensor information
                    else if (data_stream[key][0] == 63) {

                        // parse force sensor information
                        Famount = await data[key][1][0];
                        Fbinary = await data[key][1][1];
                        Fbigamount = await data[key][1][2];

                        // populate value object
                        device_value = "Force";
                        device_value.info = { "Force": Famount, "Pressed": Fbinary, "ForceSensitive": Fbitamount }
                        ports[the_key] = device_value;
                    }
                    // get COLOR sensor information
                    else if (data_stream[key][0] == 61) {
                        
                        // parse color sensor information
                        Creflected = await data[key][1][0];
                        Cambient = await data[key][1][1];
                        Cr = await data[key][1][2];
                        Cg = await data[key][1][3];
                        Cb = await data[key][1][4];
                        rgb_array = [Cr, Cg, Cb];
                        
                        // populate value object
                        device_value.device = "Color";
                        device_value.info = { "Reflected": Creflected, "Ambient": Cambient, "RGB": rgb_array };
                        ports[the_key] = device_value;
                    }
                    /// NOTHING is connected
                    else if (data_stream[key][0] == 0) {
                        // populate value object
                        device_value.device = "None";
                        device_value.info = {};
                        ports[the_key] = device_value;
                    }

                } catch (e) {} //ignore errors
            }
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
    * ports.{yourPortLetter}.device --returns--> device type (ex. "Motor" or "Ultrasonic")
    * ports.{yourPortLetter}.info --returns--> device info (ex. {"Speed": 0, "Angle":0, "UAngle": 0, "Power":0} ) 
    *
    * MOTOR_INFO = { "Speed": motor speed, 
    *               "Angle": motor angle , 
    *               "UAngle": motor angle in unit circle ( -180 ~ 180 ), 
    *               "Power": motor power }
    * 
    * ULTRASONIC_INFO = { "Distance": distance from surface }
    * 
    * COLOR_SENSOR_INFO = { "Reflected": reflected luminosity,
    *                       "Ambient": ambient luminosity, 
    *                       "RGB": [R, G, B] }
    * 
    * FORCE_SENSOR_INFO = { "Force": pressed force amount ( 1 ~ 10 ), 
    *                       "Pressed": whether pressed or not ( 0 or 1 ), 
    *                       "ForceSensitive": a more sesntiive pressed force amount ( 0 ~ 900 ) }
    */
    async function getPortsInfo() {
        return ports;
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
            commands = command.split("\n"); // split on new line
            setupWriter();
            console.log("sendpythonDATA: " + commands);
            for (var i = 0; i < commands.length; i++) {
                console.log("commands.length", commands.length)

                // trim trailing, leading whitespaces
                current = commands[i].trim();

                writer.write(current);
                writer.write(RETURN); // extra return at the end
            }
        }
    }

    //sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // public members
    return {
        init: init,
        sendDATA: sendDATA,
        rebootHub: rebootHub,
        reachMicroPy: reachMicroPy,
        sendPythonDATA: sendPythonDATA,
        getPortsInfo: getPortsInfo
    };
}