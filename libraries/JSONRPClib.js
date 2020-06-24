/*
Project Name: SPIKE Prime Web Interface
File name: JSONRPClib.js
Description: General library for using communicating Webserial JSON RPC with SPIKE
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
    - 0.3.1 debugged update by Jeremy Jung (Latest: 2020-06-21)
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

VERSION = "0.3.1"; // version of this code

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

async function reboot_hub() {
    console.log("rebooting")
    // make sure ready to write to device
    await setup_writer();
    writer.write(CONTROL_C);
    writer.write(CONTROL_D);
}

//to be run once before getting stream
//list the available ports and initialize it
async function setup_port() {
    port = await navigator.serial.getPorts();
    console.log("ports:", port);
    try {
         // select device
        port = await navigator.serial.requestPort({
        filters: [filter]
        });
        // wait for the port to open.
        await port.open({ baudrate: 115200 });

    } catch (e) {
        console.log('ERROR trying to open:', e);
    }
    return
}

//continuously take input from the hub 
async function read_stream() {
    try {
        // now start reading
        while (port.readable) {
            document.getElementById("connection_status").innerHTML = "Status: Connected";
			document.getElementById("connection_status").style.backgroundColor = "green";
            const decoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(decoder.writable);
            reader = decoder.readable.getReader();
            while (true) {
                try {
                    // read
                    ({value, done} = await reader.read());

                    // log value
                    //console.log('Value:', value)

                    //concatenating incomplete json objects from the hub
                    if (value) {
                        json_string = JSON.stringify(value)
                        //console.log("json_string", json_string)
                        rcb_index = json_string.indexOf('}')
                        jsonline = jsonline + value
                        //console.log("jsonline", jsonline)
                        if (rcb_index > -1) {
                            one_line = jsonline.substring(0,jsonline.indexOf('}')+4)
                            jsonline = ""
                        }
                    }

                    if (done) {
                        // reader has been canceled.
                        console.log("[readLoop] DONE", done);
                    }
                }
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

//return the latest complete json object stream retrieved from Hub
async function retrieve_data() {
    try {
        //result = JSON.parse(one_line)
        return one_line
    }
    catch (error) {
        //console.log('[retrieveData] ERROR', error);
    }
}
// helper function used when sending commands
function setup_writer() {
    // if writer not yet defined:
    if (typeof writer === 'undefined') {
        // set up writer for the first time
        const encoder = new TextEncoderStream();
        const writableStreamClosed = encoder.readable.pipeTo(port.writable);
        writer = encoder.writable.getWriter();
    }
}

// generic send data function
// command is a string to send (or sequence of commands, separated by new lines
function sendDATA(command) {
    // look up the command to send
    commands = command.split("\n"); // split on new line
    console.log("sendDATA: " + commands);

    // make sure ready to write to device
    setup_writer();

    // go through each line of the command
    // trim it, send it, and send a return...
    for (i=0; i<commands.length; i++) {
        current = commands[i].trim();
        // turn string into JSON
        myobj = JSON.parse(current);
        // turn JSON back into string and write it out
        writer.write(JSON.stringify(myobj));
        writer.write(RETURN); // extra return at the end
    }
}