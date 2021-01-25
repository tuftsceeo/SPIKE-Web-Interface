
/**  Prompt user to select web serial port and make connection to SPIKE Prime
 * <p> Effect Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled) </p>
 * <p> Note: </p>
 * <p> This function is to be executed before reading in JSON RPC streams from the hub </p>
 * <p> This function needs to be called when system is handling a user gesture (like button click) </p>
 * @private
 * @returns {boolean} True if web serial initialization is successful, false otherwise
 */
Service_SPIKE.prototype.initWebSerial = async function () {
    try {
        var success = false;

        this.port = await navigator.serial.getPorts();
        console.log("%cTuftsCEEO ", "color: #3ba336;", "ports:", this.port);
        // select device
        this.port = await navigator.serial.requestPort({
            // filters:[filter]
        });
        // wait for the port to open.
        try {
            await this.port.open({ baudRate: 115200 });
        }
        catch (er) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", er);
            // check if system requires baudRate syntax
            if (er.message.indexOf("baudrate") > -1) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "baudRate needs to be baudrate");
                await this.port.open({ baudrate: 115200 });
            }
            // check if error is due to unsuccessful closing of previous port
            else if (er.message.indexOf("close") > -1) {
                if (this.funcAfterError != undefined) {
                    this.funcAfterError(er + "\nPlease try again. If error persists, refresh this environment.");
                }
                await this.port.close();
            } else {
                if (this.funcAfterError != undefined) {
                    this.funcAfterError(er + "\nPlease try again. If error persists, refresh this environment.");
                }
            }
            await this.port.close();
        }

        if (this.port.readable) {
            success = true;
        }
        else {
            success = false;
        }

        return success;


    } catch (e) {
        console.log("%cTuftsCEEO ", "color: #3ba336;", "Cannot read port:", e);
        if (this.funcAfterError != undefined) {
            this.funcAfterError(e);
        }
        return false;
    }
}


/**  Send command to the SPIKE Prime (UJSON RPC or Micropy depending on current interpreter)
 * <p> May make the SPIKE Prime do something </p>
 * @ignore
 * @param {string} command Command to send (or sequence of commands, separated by new lines)
 */
Service_SPIKE.prototype.sendDATA = async function (command) {
    // look up the command to send
    var commands = command.split("\n"); // split on new line

    // ignore console logging trigger_current_state (to avoid it spamming)
    if (command.indexOf("trigger_current_state") == -1)
        console.log("%cTuftsCEEO ", "color: #3ba336;", "sendDATA: " + commands);

    // make sure ready to write to device
    setupWriter();

    // send it in micropy if micropy reached
    if (this.micropython_interpreter) {

        for (var i = 0; i < commands.length; i++) {
            // console.log("%cTuftsCEEO ", "color: #3ba336;", "commands.length", commands.length)

            // trim trailing, leading whitespaces
            var current = commands[i].trim();

            this.writer.write(current);
            this.writer.write(RETURN); // extra return at the end
        }
    }
    // expect json scripts if micropy not reached
    else {
        // go through each line of the command
        // trim it, send it, and send a return...
        for (var i = 0; i < commands.length; i++) {

            //console.log("%cTuftsCEEO ", "color: #3ba336;", "commands.length", commands.length)

            current = commands[i].trim();
            //console.log("%cTuftsCEEO ", "color: #3ba336;", "current", current);
            // turn string into JSON

            //string_current = (JSON.stringify(current));
            //myobj = JSON.parse(string_current);
            var myobj = await JSON.parse(current);

            // turn JSON back into string and write it out
            this.writer.write(JSON.stringify(myobj));
            this.writer.write(RETURN); // extra return at the end
        }
    }
}


/**  Continuously take UJSON RPC input from SPIKE Prime
 * @private
 */
Service_SPIKE.prototype.streamUJSONRPC = async function () {
    try {
        // COMMENTED BY JEREMY JUNG (DECEMBER/10/2020)
        // var triggerCurrentStateInterval = setInterval(function() {
        // UJSONRPC.triggerCurrentState();
        // }, 500);

        var firstReading = true;
        // read when port is set up
        while (this.port.readable) {

            // initialize readers
            const decoder = new TextDecoderStream();
            const readableStreamClosed = this.port.readable.pipeTo(decoder.writable);
            this.reader = decoder.readable.getReader();

            // continuously get
            while (true) {
                try {

                    if (firstReading) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", "##### READING FIRST UJSONRPC LINE ##### CHECKING VARIABLES");
                        console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline: ", this.jsonline);
                        console.log("%cTuftsCEEO ", "color: #3ba336;", "lastUJSONRPC: ", this.lastUJSONRPC);
                        firstReading = false;
                    }
                    // read UJSON RPC stream ( actual data in {value} )
                    ({ value, done } = await this.reader.read());

                    // log value
                    if (this.micropython_interpreter) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", value);
                    }

                    // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

                    //concatenate UJSONRPC packets into complete JSON objects
                    if (value) {
                        await this.parsePacket(value);
                    }
                    if (done) {
                        this.serviceActive = false;
                        // reader has been canceled.
                        console.log("%cTuftsCEEO ", "color: #3ba336;", "[readLoop] DONE", done);
                    }
                }
                // error handler
                catch (error) {
                    console.log("%cTuftsCEEO ", "color: #3ba336;", '[readLoop] ERROR', error);

                    this.serviceActive = false;

                    if (this.funcAfterDisconnect != undefined) {
                        this.funcAfterDisconnect();
                    }

                    if (this.funcAfterError != undefined) {
                        this.funcAfterError("SPIKE Prime hub has been disconnected");
                    }

                    this.writer.close();
                    //await writer.releaseLock();
                    await this.writableStreamClosed;

                    this.reader.cancel();
                    //await reader.releaseLock();
                    await this.readableStreamClosed.catch(reason => { });

                    await this.port.close();

                    this.writer = undefined;
                    this.reader = undefined;
                    this.jsonline = "";
                    this.lastUJSONRPC = undefined;
                    json_string = undefined;
                    cleanedJsonString = undefined;

                    break; // stop trying to read
                }
            } // end of: while (true) [reader loop]

            // release the lock
            this.reader.releaseLock();

        } // end of: while (port.readable) [checking if readable loop]
        console.log("%cTuftsCEEO ", "color: #3ba336;", "- port.readable is FALSE")
    } // end of: trying to open port
    catch (e) {
        this.serviceActive = false;
        // Permission to access a device was denied implicitly or explicitly by the user.
        console.log("%cTuftsCEEO ", "color: #3ba336;", 'ERROR trying to open:', e);
    }
}

/**  Initialize writer object before sending commands
 * @private
 * 
 */
Service_SPIKE.prototype.setupWriter = function () {
    // if writer not yet defined:
    if (typeof this.writer === 'undefined') {
        // set up writer for the first time
        const encoder = new TextEncoderStream();
        this.writableStreamClosed = encoder.readable.pipeTo(port.writable);
        this.writer = encoder.writable.getWriter();
    }
}