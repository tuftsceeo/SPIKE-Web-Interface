function _SpikeRPC(_virtualSpike) {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////
    
    // flag for development 
    let dev                  = undefined;
    // ServiceDock objects
    let webSerial = new _WebSerial();

    // flag for when RPC is pure micropython
    let micropython_interpreter = false;

    //define for json concatenation
    let jsonline             = "";
    // contains latest full json object from SPIKE readings
    let lastUJSONRPC         = undefined;

    const VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub
    // common characters to send (for REPL/uPython on the Hub)
    const CONTROL_C = '\x03'; // CTRL-C character (ETX character)
    const CONTROL_D = '\x04'; // CTRL-D character (EOT character)
    const RETURN = '\x0D';	// RETURN key (enter, new line)

    // servicedock functions passed down from main Service
    var funcAfterPrint = (m) => { }; // function to call for SPIKE python program print statements or errors
    var funcAfterError = (er) => { }; // function to call for errors in ServiceDock
    var funcAfterDisconnect = () => {}; // function to call after SPIKE Prime is disconnected
    var funcAfterConnect = () => {}; // function to call after SPIKE Prime is connected
    var funcWithStream = () => {} // function to call during SPIKE Prime data stream


    let updateHubPortsInfo   = undefined;
    let PrimeHubEventHandler = undefined;

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////
    const init = async function (isDev, portsUpdater, hubEventsUpdater) {
        try {
            dev = isDev;
            updateHubPortsInfo = portsUpdater;
            PrimeHubEventHandler = hubEventsUpdater;

            let connected = await webSerial.init(isDev);
            if (connected === true) 
                webSerial.streamData(parsePacket);
            
            return connected
            
        }
        catch (e) {
            /* Catch and display errors */
            if (e.code == 10001) {
                funcAfterError("Please reconnect your hub. If error persists, refresh this web environment.");
            }
            else if (e.code == 10002) {
                funcAfterError("Please check if you have any other window or app currently connected to your hub.");
            }
            else if (e.code == 10003) {
                if (isDev)
                    consoleError("Please try again. If error persists, refresh this environment." + e.message);
                else
                    consoleError("Please try again. If error persists, refresh this environment.");
                funcAfterError("Please try again. If error persists, refresh this environment.");
            }
            else if (e.code == 10004) {
                if (isDev)
                    consoleError("Please try again. If error persists, refresh this environment." + e.message);
                else
                    consoleError("Please try again. If error persists, refresh this environment.");
                consoleError(e.message);
                funcAfterError("Please try again. If error persists, refresh this environment.");
            }
            else if (e.code == 10005) {
                funcAfterError("Please try again. If error persists, refresh this environment.");
            }
            else {
                consoleError(e);
            }
            return false;
        }
    }

    const sendDATA = async function (command) {
        // look up the command to send
        var commands = command.split("\n"); // split on new line

        // ignore console logging trigger_current_state (to avoid it spamming)
        if (command.indexOf("trigger_current_state") === -1)
            devConsoleLog("sendDATA: " + commands);

        // send it in micropy if micropy reached
        if (micropython_interpreter) {

            for (var i = 0; i < commands.length; i++) {
                // console.log("%cTuftsCEEO ", "color: #3ba336;", "commands.length", commands.length)

                // trim trailing, leading whitespaces
                var current = commands[i].trim();

                webSerial.write(current);
                webSerial.write(RETURN); // extra return at the end
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
                webSerial.write(JSON.stringify(myobj));
                webSerial.write(RETURN) // extra return at the end
            }
        }
    }

    /** Process a raw packet from data stream
     * @public
     * @param {any} value 
     * @param {boolean} [testing=false] 
     * @param {any} callback 
     */
    const parsePacket = async function (value) {

        // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

        // stringify the packet to look for carriage return
        var json_string = await JSON.stringify(value);

        // remove quotation marks from json_string
        var cleanedJsonString = cleanJsonString(json_string);

        jsonline = jsonline + cleanedJsonString; // concatenate packet to data
        jsonline = jsonline.trim();

        // regex search for carriage return
        let pattern = /\\r/g;
        var carriageReIndex = jsonline.search(pattern);

        // there is at least one carriage return in this packet
        if (carriageReIndex > -1) {
            //////////////////////////////// NEW parsePacket implementation ongoing since (29/12/20)

            let jsonlineSplitByCR = jsonline.split(/\\r/); // array of jsonline split by \r

            jsonline = ""; //reset jsonline
            /*
                each element in this array will be assessed for processing, 
                and the last element, if unable to be processed, will be concatenated to jsonline
            */

            for (let i = 0; i < jsonlineSplitByCR.length; i++) {

                // set lastUJSONRPC to an element in split array
                lastUJSONRPC = jsonlineSplitByCR[i];
                // remove any newline character in the beginning of lastUJSONRPC
                if (lastUJSONRPC.search(/\\n/g) == 0)
                    lastUJSONRPC = lastUJSONRPC.substring(2, lastUJSONRPC.length);

                /* Case 1: lastUJSONRPC is a valid, complete, and standard UJSONRPC packet */
                if (lastUJSONRPC[0] == "{" && lastUJSONRPC[lastUJSONRPC.length - 1] == "}") {

                    let arrayLeftCurly = lastUJSONRPC.match(/{/g);
                    let arrayRightCurly = lastUJSONRPC.match(/}/g);
                    if (arrayLeftCurly.length === arrayRightCurly.length) {
                        /* Case 1A: complete packet*/

                        await processFullUJSONRPC(lastUJSONRPC, cleanedJsonString, json_string);
                    }
                    else {
                        /* Case 1B: {"i": 1234, "r": {} */
                        jsonline = lastUJSONRPC;
                    }
                }
                /* Case 3: lastUJSONRPC is a micropy print result */
                else if (lastUJSONRPC != "" && lastUJSONRPC.indexOf('"p":') == -1 && lastUJSONRPC.indexOf('],') == -1 && lastUJSONRPC.indexOf('"m":') == -1 &&
                    lastUJSONRPC.indexOf('}') == -1 && lastUJSONRPC.indexOf('{"i":') == -1 && lastUJSONRPC.indexOf('{') == -1) {
                    /* filter reboot message */
                    var rebootMessage =
                        'Traceback (most recent call last): File "main.py", line 8, in <module> File "hub_runtime.py", line 1, in start File "event_loop/event_loop.py", line 1, in run_forever File "event_loop/event_loop.py", line 1, in step KeyboardInterrupt: MicroPython v1.12-1033-g97d7f7dd4 on 2020-09-18; LEGO Technic Large Hub with STM32F413xx Type "help()" for more in formation. >>> HUB: sync filesystems HUB: soft reboot'
                    let rebootMessageRemovedWS = rebootMessage.replace(/[' ']/g, "");
                    let lastUJSONRPCRemovedWS = lastUJSONRPC.replace(/[' ']/g, "");
                    if (rebootMessageRemovedWS.indexOf(lastUJSONRPCRemovedWS) == -1) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", "micropy print: ", lastUJSONRPC);
                        if (funcAfterPrint != undefined)
                            funcAfterPrint(lastUJSONRPC);
                    }
                }
                /* Case 3: lastUJSONRPC is only a portion of a standard UJSONRPC packet 
                    Then lastUJSONRPC must be EITHER THE FIRST OR THE LAST ELEMENT in jsonlineSplitByCR
                    because
                    an incomplete UJSONRPC can either be 
                    Case 3A: the beginning portion of a UJSONRPC packet with no \r in the end (LAST)
                    Case 3B: the last portion of a UJSONRPC packet with \r in the end (FIRST)
                */
                else {
                    /* Case 3A: */
                    if (lastUJSONRPC[0] == "{") {
                        jsonline = lastUJSONRPC;
                        // console.log("TEST (last elemnt in split array): ", i == jsonlineSplitByCR.length-1);
                        // console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline was reset to:" + jsonline);
                    }
                    /* Case 3B: */
                    else {
                        /* the last portion of UJSONRPC cannot be concatenated to form a full packet
                            -> purge lastUJSONRPC
                        */
                    }
                }
            }
        }
    }

    /** Process a UJSONRPC packet stringified
     * 
     * @private
     * @param {any} lastUJSONRPC 
     * @param {string} [json_string="undefined"] 
     * @param {boolean} [testing=false] 
     * @param {any} callback 
     */
    const processFullUJSONRPC = async function (lastUJSONRPC, cleanedJsonString = undefined, json_string = undefined) {
        try {
            
            // check that the data is JSON parsable
            var parsedLastURPC = await JSON.parse(lastUJSONRPC);

            // devConsoleLog(lastUJSONRPC);

            // update hub information using lastUJSONRPC
            if (parsedLastURPC["m"] == 0) {
                await updateHubPortsInfo(parsedLastURPC.p);
            }

            PrimeHubEventHandler(parsedLastURPC, lastUJSONRPC);

            if (funcWithStream !== undefined) {
                await funcWithStream();
            }

        }
        catch (e) {
            // don't throw error when failure of processing UJSONRPC is due to micropython
            if (lastUJSONRPC.indexOf("Traceback") == -1 && lastUJSONRPC.indexOf(">>>") == -1 && json_string.indexOf("Traceback") == -1 && json_string.indexOf(">>>") == -1) {
                if (funcAfterError !== undefined) {
                    funcAfterError("Fatal Error: Please close any other window or program that is connected to your SPIKE Prime");
                }
            }
            consoleError(e);
            consoleError("error parsing lastUJSONRPC: ");
            consoleError(lastUJSONRPC);
            consoleError("current jsonline: ");
            consoleError(jsonline);
            consoleError("current cleaned json_string: ");
            consoleError(cleanedJsonString);
            consoleError("current json_string: ");
            consoleError(json_string);
            consoleError("current value: ");
            consoleError(value);
        }
    }

    /** Clean the json_string for concatenation into jsonline
     * @private
     * 
     * @param {any} json_string 
     * @returns {string}
     */
    const cleanJsonString = function (json_string) {
        var cleanedJsonString = "";
        json_string = json_string.trim();

        let findEscapedQuotes = /\\"/g;

        cleanedJsonString = json_string.replace(findEscapedQuotes, '"');
        cleanedJsonString = cleanedJsonString.substring(1, cleanedJsonString.length - 1);
        // cleanedJsonString = cleanedJsonString.replace(findNewLines,'');

        return cleanedJsonString;
    }

    const executeWithStream = function (f) {
        funcWithStream = f;
    }

    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passConnectCallback = function (f) {
        funcAfterConnect = f;
        webSerial.executeAfterConnect(f);
    }
    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passDisconnectCallback = function (f) {
        funcAfterDisconnect = f;
        webSerial.executeAfterDisconnect(f);
    }
    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passErrorCallback = function (f) {
        funcAfterError = f;
        webSerial.executeAfterError(f);
    }
    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passPrintCallback = function (f) {
        funcAfterPrint = f;
        webSerial.executeAfterPrint(f);
    }

    /** console log only in development
    * @private
    * @param {string} m 
    */
    const devConsoleLog = function (m) {
        if (dev === true)
            console.log("%cTuftsCEEO ", "color: #3ba336;", m);
    }

    /** console.error a message
    * @param {string} m 
    * @private
    */
    const consoleError = function (m) {
        console.error("%cTuftsCEEO ", "color: #3ba336;", m);
    }

    return {
        init: init,
        parsePacket: parsePacket,
        executeWithStream: executeWithStream,
        sendDATA: sendDATA,
        // callback passing continuations
        passConnectCallback: passConnectCallback,
        passDisconnectCallback: passDisconnectCallback,
        passErrorCallback: passErrorCallback,
        passPrintCallback: passPrintCallback
    }
}