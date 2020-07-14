/*
Project Name: SPIKE Prime Web Interface
File name: UJSONRPClib.js
Description: General library for using communicating Webserial UJSON RPC with SPIKE
* This webpage works in Chrome and uses 
* the #enable-experimental-web-platform-features
* flag for enabling WebSerial communication, for
* talking back-and-forth with the LEGO SPIKE Prime.
Credits/inspirations:
    Written by Jeremy Jung
    Based on code written by Ethan Danahy
    Based on WebSerial investigations by Olga Sans
History: 
    - 0.3 update by Ethan Danahy (2020-05-26)
    - 0.4 (2020-07-7)
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

VERSION = "0.4"; // version of this code

// define for communication
let port;
let reader;
let writer;
let value;
let done;

//define for json concatenation
let jsonline = ""
//contains latest full json object from SPIKE readings
let one_line;

VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub

// common characters to send (for REPL/uPython on the Hub)
CONTROL_C = '\x03'; // CTRL-C character (ETX character)
CONTROL_D = '\x04'; // CTRL-D character (EOT character)
RETURN = '\x0D';	// RETURN key (enter, new line)

const filter = {
    usbVendorId: VENDOR_ID 
};

/* setup_port() - prompt user to select web serial port and make connection to SPIKE Prime
 * 
 * Effect:
 * Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled)
 *
 * Note:
 * This function is to be executed before reading in JSON RPC streams from the hub
 */
async function setup_port() {
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


/* read_stream() - Continuously take UJSON RPC input from SPIKE Prime
 * 
 * Effect:
 * Changes "#connection_status" icon in servicedock.html
 * 
 */
async function read_stream() {
    try {
        // read when port is set up
        while (port.readable) {
            // change connection status in HTML elements
            document.getElementById("connection_status").innerHTML = "Status: Connected";
			document.getElementById("connection_status").style.backgroundColor = "green";
            
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
                    //console.log('Value:', value)

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
                    document.getElementById("connection_status").innerHTML = "Status: Disconnected";
					document.getElementById("connection_status").style.backgroundColor = "red";
                    await port.close();
                    break; // stop trying to read
                }
            } // end of: while (true) [reader loop]
            
            // release the lock
            reader.releaseLock();
            
        } // end of: while (port.readable) [checking if readable loop]
        
        console.log("- port.readable is FALSE")
        document.getElementById("connection_status").innerHTML = "Status: Disconnected";
		document.getElementById("connection_status").style.backgroundColor = "red";
        
    } // end of: trying to open port
    catch (e) {
        // Permission to access a device was denied implicitly or explicitly by the user.
        console.log('ERROR trying to open:', e);
        document.getElementById("connection_status").innerHTML = "Status: Disconnected";
		document.getElementById("connection_status").style.backgroundColor = "red";
    }
}

//////////////////////////////////////////
//                                      //
//        While reading stream          //
//                                      //
//////////////////////////////////////////


/* retrieve_data() - get the latest complete line of UJSON RPC from stream 
 * 
 * Returns:
 * {one_line} (string) - a string represent a JSON object from UJSON RPC
 * 
 * Effect:
 * Logs in the console when some particular messages are caught
 * 
 */
async function retrieve_data() {
    try {
        result = await JSON.parse(one_line)
        //catch runtime_error made at ujsonrpc level
        if( result["m"] == "runtime_error" ) {
            console.log(one_line);
        }
        //catch this mysterious thing
        else if (result["m"]== 2) {
            console.log(one_line);
        }
    }
    catch (error) {
        //console.log('[retrieveData] ERROR', error);
    }
    console.log("typof one_line", typeof one_line)
    return one_line
}


/* setup_writer() - initialize writer object before sending commands
 */
function setup_writer() {
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
 * 
 */
async function sendDATA(command) {
    // look up the command to send
    //commands = command.split("\n"); // split on new line
    commands = command
    // console.log("sendDATA: " + commands);

    // make sure ready to write to device
    setup_writer();

    // go through each line of the command
    // trim it, send it, and send a return...
    for ( var i = 0; i < commands.length; i++ ) {
        console.log("commands.length", commands.length)
        current = commands[i].trim();
        console.log("current", current);
        // turn string into JSON
        //string_current = (JSON.stringify(current));
        //myobj = JSON.parse(string_current);
        myobj = await JSON.parse(current);
        // turn JSON back into string and write it out
        writer.write(JSON.stringify(myobj));
        writer.write(RETURN); // extra return at the end
    }
}


/* reboot_hub() - send character sequences to reboot SPIKE Prime
 * 
 */
async function reboot_hub() {
    console.log("rebooting")
    // make sure ready to write to device
    setup_writer();
    writer.write(CONTROL_C);
    writer.write(CONTROL_D);
}
/* get_devices() - get the devices that are connected to each port on the SPIKE Prime
 * 
 * Returns:
 * {ports} (object/dictionary) - an object with keys as port letters and values as strings of connected devices
 * 
 */
async function get_devices() {
    if (one_line) {
        var data_stream;
        
        //get a line from the latest JSON RPC stream
        try{
            data_stream = await JSON.parse(one_line)
        }
        catch (e){
            console.log("error parsing one_Line at get_devices", one_line);
        }

        //initialize ports to send
        var ports = 
        {
            "A": "None",
            "B": "None",
            "C": "None",
            "D": "None",
            "E": "None",
            "F": "None"
        }
        var index_to_port = ["A","B","C","D","E","F"]

        data_stream = data_stream.p

        // iterate through each port and assign a device_type to {ports}
        for (var key = 0; key < 6; key++) {
            try {
                var the_key = index_to_port[key]
                if (data_stream[key][0] == 48 || data_stream[key][0] == 49) {
                    ports[the_key] = "Motor"
                }
                else if (data_stream[key][0] == 62) {
                    ports[the_key] = "Ultrasonic"
                }
                else if (data_stream[key][0] == 63) {
                    ports[the_key] = "Force"
                }
                else if (data_stream[key][0] == 61) {
                    ports[the_key] = "Color"
                }
                else if (data_stream[key][0] == 0) {
                    ports[the_key] = "None"
                }
            } catch (e) {} //ignore errors
        }
        return ports
    }
}


//NOT IMPLEMENTED
//reach the micropy level of REPL
function sendPythonDATA(command){
    commands = command.split("\n"); // split on new line
    console.log("sendDATA: " + commands);
    writer.write(commands);
    writer.write(RETURN);

}
