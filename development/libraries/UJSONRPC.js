/*
 Summary: This webpage works in Chrome and uses 
 the #enable-experimental-web-platform-features
 flag for enabling WebSerial communication, for
 talking back-and-forth with the LEGO SPIKE Prime. 
 
 Tufts Center for Engineering Education and Outreach
    - Original WebSerial investigations: Olga Sans
    - Interface updates: Ethan Danahy
    
    Last updated on: 2020-05-26
*/
VERSION = "0.3"; // version of this code
		
// define for communication
let port;
let reader;
let writer;

VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub

// common characters to send (for REPL/uPython on the Hub)
CONTROL_C = '\x03'; // CTRL-C character (ETX character)
CONTROL_D = '\x04'; // CTRL-D character (EOT character)
RETURN = '\x0D';	// RETURN key (enter, new line)

sendButtonsContent = [
    '{"i": 1234, "m": "scratch.display_text", "p": {"text": "Hello"} }',
    '{"i": 5678, "m": "scratch.display_text", "p": {"text": "Goodbye"} }',
    '{"i": 2468, "m": "get_firmware_info" }'
    
];

// when document loads, set up all interface elements
document.addEventListener('DOMContentLoaded', event => {
    // interface buttons
    let connectbutton = document.getElementById('connect');
    let rebootButton = document.getElementById('reboot');
    let sendbutton = document.getElementById('send');

    let delay_elem = document.getElementById('delay_amount'); // text area with delay amount
    let REPL = document.getElementById('REPL'); // big text area for Hub output
    
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
    
    // function for sleeping in code
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // CONNECT (and stream data)
    connectbutton.addEventListener('click', async() => {
        const filter = {
              usbVendorId: VENDOR_ID 
        };

        port = await navigator.serial.getPorts();
        console.log("ports:", port);

        try {
            // select device
            port = await navigator.serial.requestPort({
                filters: [filter]
            });
            // wait for the port to open.
            await port.open({ baudrate: 115200 });
            // now start reading
            while (port.readable) {
                document.getElementById("connection_status").innerHTML = "Status: Connected";
                document.getElementById("connection_status").style.backgroundColor = "green";
                const decoder = new TextDecoderStream();
                const readableStreamClosed = port.readable.pipeTo(decoder.writable);
                reader = decoder.readable.getReader();
                while (true) {
                    sleep(parseFloat(delay_elem.value) * 1000); // convert seconds to milliseconds and wait
                    let value, done;
                    try {
                        // read
                        ({value, done} = await reader.read());
                        // log value
                        //console.log('Value:', value)
                        // PUSH CURRENT READ VALUE TO TEXTAREA IN BROWSER
                        REPL.value = REPL.value + value;
                        REPL.scrollTop = REPL.scrollHeight;

                        if (value) {
                            // pass
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
        }
    }); // end of connectbutton "click" EventListener

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

        // create listeners for each button
        sendbutton.addEventListener('click', async() => {
                sendDATA(document.getElementById("data").value);
        });
        

        // SEND Hub Reboot (control-C + control-D)
        rebootButton.addEventListener('click', async() => {
            console.log("rebooting")
            // make sure ready to write to device
            setup_writer();
            writer.write(CONTROL_C);
            writer.write(CONTROL_D);
        });
     
}); // end of: addEventListener for document load