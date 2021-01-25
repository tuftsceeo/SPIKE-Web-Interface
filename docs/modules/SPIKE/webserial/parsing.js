
/** clean the json_string for concatenation into jsonline
 * @private
 * 
 * @param {any} json_string 
 * @returns {string}
 */
Service_SPIKE.prototype.cleanJsonString = function (json_string) {
    var cleanedJsonString = "";
    json_string = json_string.trim();

    let findEscapedQuotes = /\\"/g;

    cleanedJsonString = json_string.replace(findEscapedQuotes, '"');
    cleanedJsonString = cleanedJsonString.substring(1, cleanedJsonString.length - 1);
    // cleanedJsonString = cleanedJsonString.replace(findNewLines,'');

    return cleanedJsonString;
}

/** Process the UJSON RPC script
 * 
 * @private
 * @param {any} lastUJSONRPC 
 * @param {string} [json_string="undefined"] 
 * @param {boolean} [testing=false] 
 * @param {any} callback 
 */
Service_SPIKE.prototype.processFullUJSONRPC = async function (lastUJSONRPCToProcess, cleanedJsonString = "undefined", json_string = "undefined", testing = false, callback) {

    try {

        var parseTest = await JSON.parse(lastUJSONRPCToProcess);

        if (testing) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", "processing FullUJSONRPC line: ", lastUJSONRPCToProcess);
        }

        // update hub information using lastUJSONRPCToProcess
        if (parseTest["m"] == 0) {
            this.updateHubPortsInfo();
        }
        this.PrimeHubEventHandler();

        if (this.funcWithStream) {
            await this.funcWithStream();
        }

    }
    catch (e) {
        // don't throw error when failure of processing UJSONRPC is due to micropython
        if (lastUJSONRPCToProcess.indexOf("Traceback") == -1 && lastUJSONRPCToProcess.indexOf(">>>") == -1 && json_string.indexOf("Traceback") == -1 && json_string.indexOf(">>>") == -1) {
            if (this.funcAfterError != undefined) {
                this.funcAfterError("Fatal Error: Please close any other window or program that is connected to your SPIKE Prime");
            }
        }
        console.log(e);
        console.log("%cTuftsCEEO ", "color: #3ba336;", "error parsing lastUJSONRPCToProcess: ", lastUJSONRPCToProcess);
        console.log("%cTuftsCEEO ", "color: #3ba336;", "current jsonline: ", jsonline);
        console.log("%cTuftsCEEO ", "color: #3ba336;", "current cleaned json_string: ", cleanedJsonString)
        console.log("%cTuftsCEEO ", "color: #3ba336;", "current json_string: ", json_string);
        console.log("%cTuftsCEEO ", "color: #3ba336;", "current value: ", value);

        if (callback != undefined) {
            callback();
        }

    }
}

/**  Process a packet in UJSONRPC
* @private
* 
*/
Service_SPIKE.prototype.parsePacket = async function (value, testing = false, callback) {
    // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

    // stringify the packet to look for carriage return
    var json_string = await JSON.stringify(value);

    // remove quotation marks from json_string
    var cleanedJsonString = this.cleanJsonString(json_string);
    // cleanedJsonString = cleanedJsonString.replace(findNewLines,'');

    // console.log(cleanedJsonString);

    this.jsonline = this.jsonline + cleanedJsonString; // concatenate packet to data
    this.jsonline = this.jsonline.trim();

    // regex search for carriage return
    let pattern = /\\r/g;
    var carriageReIndex = this.jsonline.search(pattern);

    // there is at least one carriage return in this packet
    if (carriageReIndex > -1) {
        //////////////////////////////// NEW parsePacket implementation ongoing since (29/12/20)

        let jsonlineSplitByCR = this.jsonline.split(/\\r/); // array of jsonline split by \r

        this.jsonline = ""; //reset jsonline
        /*
            each element in this array will be assessed for processing, 
            and the last element, if unable to be processed, will be concatenated to jsonline
        */

        for (let i = 0; i < jsonlineSplitByCR.length; i++) {

            // set lastUJSONRPC to an element in split array
            this.lastUJSONRPC = jsonlineSplitByCR[i];
            // remove any newline character in the beginning of this.lastUJSONRPC
            if (this.lastUJSONRPC.search(/\\n/g) == 0)
                this.lastUJSONRPC = this.lastUJSONRPC.substring(2, this.lastUJSONRPC.length);

            /* Case 1: this.lastUJSONRPC is a valid, complete, and standard UJSONRPC packet */
            if (this.lastUJSONRPC[0] == "{" && this.lastUJSONRPC[this.lastUJSONRPC.length - 1] == "}") {
                await this.processFullUJSONRPC(this.lastUJSONRPC, cleanedJsonString, json_string, testing, callback);
            }
            /* Case 3: this.lastUJSONRPC is a micropy print result */
            else if (this.lastUJSONRPC != "" && this.lastUJSONRPC.indexOf('"p":') == -1 && this.lastUJSONRPC.indexOf('],') == -1 && this.lastUJSONRPC.indexOf('"m":') == -1 &&
                this.lastUJSONRPC.indexOf('}') == -1 && this.lastUJSONRPC.indexOf('{"i":') == -1 && this.lastUJSONRPC.indexOf('{') == -1) {
                /* filter reboot message */
                var rebootMessage =
                    'Traceback (most recent call last): File "main.py", line 8, in <module> File "hub_runtime.py", line 1, in start File "event_loop/event_loop.py", line 1, in run_forever File "event_loop/event_loop.py", line 1, in step KeyboardInterrupt: MicroPython v1.12-1033-g97d7f7dd4 on 2020-09-18; LEGO Technic Large Hub with STM32F413xx Type "help()" for more in formation. >>> HUB: sync filesystems HUB: soft reboot'
                let rebootMessageRemovedWS = rebootMessage.replace(/[' ']/g, "");
                let lastUJSONRPCRemovedWS = this.lastUJSONRPC.replace(/[' ']/g, "");
                if (rebootMessageRemovedWS.indexOf(lastUJSONRPCRemovedWS) == -1) {
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "micropy print: ", this.lastUJSONRPC);
                    if (this.funcAfterPrint != undefined)
                        this.funcAfterPrint(this.lastUJSONRPC);
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
                if (this.lastUJSONRPC[0] == "{") {
                    this.jsonline = this.lastUJSONRPC;
                    // console.log("TEST (last elemnt in split array): ", i == jsonlineSplitByCR.length-1);
                    // console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline was reset to:" + jsonline);
                }
                /* Case 3B: */
                else {
                    /* the last portion of UJSONRPC cannot be concatenated to form a full packet
                        -> need to purge lastUJSONRPC
                    */
                }
            }
        }
    }

}


/** Get the devices that are connected to each port on the SPIKE Prime
 * <p> Effect: </p>
 * <p> Modifies {ports} global variable </p>
 * <p> Modifies {hub} global variable </p>
 * @private
 */
Service_SPIKE.prototype.updateHubPortsInfo = async function () {
    // if a complete ujson rpc line was read
    if (this.lastUJSONRPC) {
        var data_stream; //UJSON RPC info to be parsed

        //get a line from the latest JSON RPC stream and parse to devices info
        try {
            data_stream = await JSON.parse(this.lastUJSONRPC);
            data_stream = data_stream.p;
        }
        catch (e) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", "error parsing lastUJSONRPC at updateHubPortsInfo", this.lastUJSONRPC);
            console.log("%cTuftsCEEO ", "color: #3ba336;", typeof this.lastUJSONRPC);
            console.log("%cTuftsCEEO ", "color: #3ba336;", this.lastUJSONRPC.p);

            if (this.funcAfterError != undefined) {
                this.funcAfterError("Fatal Error: Please reboot the Hub and refresh this environment");
            }

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
                    this.ports[letter] = device_value;

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
                    this.ports[letter] = device_value;

                }
                // get ULTRASONIC sensor information
                else if (data_stream[key][0] == 62) {

                    // parse ultrasonic sensor information
                    var Udist = await data_stream[key][1][0];

                    // populate value object
                    device_value.device = "ultrasonic";
                    device_value.data = { "distance": Udist };
                    this.ports[letter] = device_value;

                    /* check if callback from wait_for_distance_farther_than() can be executed */
                    if (this.waitForDistanceFartherThanCallback != undefined) {
                        let thresholdDistance = this.waitForDistanceFartherThanCallback[0];

                        if (Udist > thresholdDistance) {

                            // current distance is farther than threshold, so execute callback
                            this.waitForDistanceFartherThanCallback[1]();
                            this.waitForDistanceFartherThanCallback = undefined; // reset callback
                        }
                    }

                    /* check if callback from wait_for_distance_closer_than() can be executed */
                    if (this.waitForDistanceCloserThanCallback != undefined) {
                        let thresholdDistance = this.waitForDistanceCloserThanCallback[0];

                        if (Udist < thresholdDistance) {

                            // current distance is closer than threshold, so execute callback
                            this.waitForDistanceCloserThanCallback[1]();
                            this.waitForDistanceCloserThanCallback = undefined; // reset callback
                        }
                    }


                }
                // get FORCE sensor information
                else if (data_stream[key][0] == 63) {

                    // parse force sensor information
                    var Famount = await data_stream[key][1][0];
                    var Fbinary = await data_stream[key][1][1];
                    var Fbigamount = await data_stream[key][1][2];

                    // convert the binary output to boolean for "pressed" key
                    if (Fbinary == 1) {
                        var Fboolean = true;
                    } else {
                        var Fboolean = false;
                    }
                    // execute callback from ForceSensor.wait_until_pressed() 
                    if (Fboolean) {
                        // execute call back from wait_until_pressed() if it is defined
                        this.funcAfterForceSensorPress !== undefined && this.funcAfterForceSensorPress();

                        // destruct callback function
                        this.funcAfterForceSensorPress = undefined;

                        // indicate that the ForceSensor was pressed
                        this.ForceSensorWasPressed = true;
                    }
                    // execute callback from ForceSensor.wait_until_released()
                    else {
                        // check if the Force Sensor was just released
                        if (this.ForceSensorWasPressed) {
                            this.ForceSensorWasPressed = false;
                            this.funcAfterForceSensorRelease !== undefined && this.funcAfterForceSensorRelease();
                            this.funcAfterForceSensorRelease = undefined;
                        }
                    }

                    // populate value object
                    device_value.device = "force";
                    device_value.data = { "force": Famount, "pressed": Fboolean, "forceSensitive": Fbigamount }
                    this.ports[letter] = device_value;
                }
                // get COLOR sensor information
                else if (data_stream[key][0] == 61) {

                    // parse color sensor information
                    var Creflected = await data_stream[key][1][0];
                    var CcolorID = await data_stream[key][1][1];
                    var Ccolor = colorDictionary[CcolorID];
                    var Cr = await data_stream[key][1][2];
                    var Cg = await data_stream[key][1][3];
                    var Cb = await data_stream[key][1][4];
                    var rgb_array = [Cr, Cg, Cb];

                    // populate value object
                    device_value.device = "color";

                    // convert Ccolor to lower case because in the SPIKE APP the color is lower case
                    Ccolor = Ccolor.toLowerCase();
                    device_value.data = { "reflected": Creflected, "color": Ccolor, "RGB": rgb_array };

                    // execute wait_until_color callback when color matches its argument
                    if (this.waitUntilColorCallback != undefined)
                        if (Ccolor == this.waitUntilColorCallback[0]) {
                            this.waitUntilColorCallback[1]();

                            this.waitUntilColorCallback = undefined;
                        }

                    if (this.lastDetectedColor != Ccolor) {

                        if (this.funcAfterNewColor != undefined) {
                            this.funcAfterNewColor(Ccolor);
                            this.funcAfterNewColor = undefined;
                        }

                        this.lastDetectedColor = Ccolor;
                    }

                    this.ports[letter] = device_value;
                }
                /// NOTHING is connected
                else if (data_stream[key][0] == 0) {
                    // populate value object
                    device_value.device = "none";
                    device_value.data = {};
                    this.ports[letter] = device_value;
                }

                //parse hub information
                var gyro_x = data_stream[6][0];
                var gyro_y = data_stream[6][1];
                var gyro_z = data_stream[6][2];
                var gyro = [gyro_x, gyro_y, gyro_z];
                this.hub["gyro"] = gyro;

                var newOri = this.setHubOrientation(gyro);
                // see if currently detected orientation is different from the last detected orientation
                if (newOri !== this.lastHubOrientation) {
                    this.lastHubOrientation = newOri;

                    if (typeof this.funcAfterNewOrientation == "function") {
                        this.funcAfterNewOrientation(newOri);
                        this.funcAfterNewOrientation = undefined;
                    }
                }

                var accel_x = data_stream[7][0];
                var accel_y = data_stream[7][1];
                var accel_z = data_stream[7][2];
                var accel = [accel_x, accel_y, accel_z];
                this.hub["accel"] = accel;

                var posi_x = data_stream[8][0];
                var posi_y = data_stream[8][1];
                var posi_z = data_stream[8][2];
                var pos = [posi_x, posi_y, posi_z];
                this.hub["pos"] = pos;

            } catch (e) { } //ignore errors
        }
    }
}

/**  Catch hub events in UJSONRPC
 * <p> Effect: </p>
 * <p> Logs in the console when some particular messages are caught </p>
 * <p> Assigns the hub events global variables </p>
 * @private
 */
Service_SPIKE.prototype.PrimeHubEventHandler = async function () {

    var parsedUJSON = await JSON.parse(this.lastUJSONRPC);

    var messageType = parsedUJSON["m"];

    //catch runtime_error made at ujsonrpc level
    if (messageType == "runtime_error") {
        var decodedResponse = atob(parsedUJSON["p"][3]);

        decodedResponse = JSON.stringify(decodedResponse);

        console.log("%cTuftsCEEO ", "color: #3ba336;", decodedResponse);

        var splitData = decodedResponse.split(/\\n/); // split the code by every newline

        // execute function after print if defined (only print the last line of error message)
        if (funcAfterError != undefined) {
            var errorType = splitData[splitData.length - 2];

            // error is a syntax error
            if (errorType.indexOf("SyntaxError") > -1) {
                /* get the error line number*/
                var lineNumberLine = splitData[splitData.length - 3];
                console.log("%cTuftsCEEO ", "color: #3ba336;", "lineNumberLine: ", lineNumberLine);
                var indexLine = lineNumberLine.indexOf("line");
                var lineNumberSubstring = lineNumberLine.substring(indexLine, lineNumberLine.length);
                var numberPattern = /\d+/g;
                var lineNumber = lineNumberSubstring.match(numberPattern)[0];
                console.log("%cTuftsCEEO ", "color: #3ba336;", lineNumberSubstring.match(numberPattern));
                console.log("%cTuftsCEEO ", "color: #3ba336;", "lineNumber:", lineNumber);
                console.log("%cTuftsCEEO ", "color: #3ba336;", "typeof lineNumber:", typeof lineNumber);
                var lineNumberInNumber = parseInt(lineNumber) - 5;
                console.log("%cTuftsCEEO ", "color: #3ba336;", "typeof lineNumberInNumber:", typeof lineNumberInNumber);

                this.funcAfterError("line " + lineNumberInNumber + ": " + errorType);
            }
            else {
                this.funcAfterError(errorType);
            }
        }
    }
    else if (messageType == 0) {
        /*
            DEV NOTE (26/12/2020):
                messageType = 0 is regular UJSONRPC stream.
                Pixel matrix SOMETIMES shows in this message, but exactly when is not clear.
        */
        // console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);
    }
    // storage information
    else if (messageType == 1) {

        var storageInfo = parsedUJSON["p"]["slots"]; // get info of all the slots

        for (var slotid in storageInfo) {
            this.hubProjects[slotid] = storageInfo[slotid]; // reassign hubProjects global variable
        }

    }
    // battery status
    else if (messageType == 2) {
        this.batteryAmount = parsedUJSON["p"][1];
    }
    // give center button click, left, right (?)
    else if (messageType == 3) {
        console.log("%cTuftsCEEO ", "color: #3ba336;", this.lastUJSONRPC);
        if (parsedUJSON.p[0] == "center") {
            this.hubMainButton.pressed = true;

            if (parsedUJSON.p[1] > 0) {
                this.hubMainButton.pressed = false;
                this.hubMainButton.duration = parsedUJSON.p[1];
            }
        }
        else if (parsedUJSON.p[0] == "connect") {
            this.hubBluetoothButton.pressed = true;

            if (parsedUJSON.p[1] > 0) {
                this.hubBluetoothButton.pressed = false;
                this.hubBluetoothButton.duration = parsedUJSON.p[1];
            }
        }
        else if (parsedUJSON.p[0] == "left") {
            this.hubLeftButton.pressed = true;

            // execute callback for wait_until_pressed() if defined
            if (this.funcAfterLeftButtonPress != undefined) {
                this.funcAfterLeftButtonPress();
            }
            this.funcAfterLeftButtonPress = undefined;

            if (parsedUJSON.p[1] > 0) {
                this.hubLeftButton.pressed = false;
                this.hubLeftButton.duration = parsedUJSON.p[1];

                // execute callback for wait_until_released() if defined
                if (this.funcAfterLeftButtonRelease != undefined) {
                    this.funcAfterLeftButtonRelease();
                }

                this.funcAfterLeftButtonRelease = undefined;
            }

        }
        else if (parsedUJSON.p[0] == "right") {
            this.hubRightButton.pressed = true;

            // execute callback for wait_until_pressed() if defined
            if (this.funcAfterRightButtonPress != undefined) {
                this.funcAfterRightButtonPress();
            }

            this.funcAfterRightButtonPress = undefined;

            if (parsedUJSON.p[1] > 0) {
                this.hubRightButton.pressed = false;
                this.hubRightButton.duration = parsedUJSON.p[1];

                // execute callback for wait_until_released() if defined
                if (this.funcAfterRightButtonRelease != undefined) {
                    this.funcAfterRightButtonRelease();
                }

                this.funcAfterRightButtonRelease = undefined;
            }
        }

    }
    // gives orientation of the hub (leftside, up,..)
    else if (messageType == 14) {
        /* this data stream is about hub orientation */

        var newOrientation = parsedUJSON.p;
        // console.log(newOrientation);
        if (newOrientation == "1") {
            this.lastHubOrientation = "up";
        }
        else if (newOrientation == "4") {
            this.lastHubOrientation = "down";
        }
        else if (newOrientation == "0") {
            this.lastHubOrientation = "front";
        }
        else if (newOrientation == "3") {
            this.lastHubOrientation = "back";
        }
        else if (newOrientation == "2") {
            this.lastHubOrientation = "rightside";
        }
        else if (newOrientation == "5") {
            this.lastHubOrientation = "leftside";
        }

        console.log("%cTuftsCEEO ", "color: #3ba336;", this.lastUJSONRPC);
    }
    else if (messageType == 7) {
        if (this.funcAfterPrint != undefined) {
            this.funcAfterPrint(">>> Program started!");
        }
    }
    else if (messageType == 8) {
        if (this.funcAfterPrint != undefined) {
            this.funcAfterPrint(">>> Program finished!");
        }
    }
    else if (messageType == 9) {
        var encodedName = parsedUJSON["p"];
        var decodedName = atob(encodedName);
        this.hubName = decodedName;

        if (this.triggerCurrentStateCallback != undefined) {
            this.triggerCurrentStateCallback();
        }
    }
    else if (messageType == 11) {
        console.log("%cTuftsCEEO ", "color: #3ba336;", this.lastUJSONRPC);
    }
    else if (messageType == 12) {
        // this is usually the response from trigger_current_state, don't console log to avoid spam
    }
    else if (messageType == 4) {
        var newGesture = parsedUJSON.p;

        if (newGesture == "3") {
            this.hubGesture = "freefall";
            this.hubGestures.push(this.hubGesture);
        }
        else if (newGesture == "2") {
            this.hubGesture = "shaken";
            this.hubGestures.push("shaken"); // the string is different at higher level
        }
        else if (newGesture == "1") {
            this.hubFrontEvent = "doubletapped";
            this.hubGesture = "doubletapped";
            this.hubGestures.push(this.hubGesture);
        }
        else if (newGesture == "0") {
            this.hubFrontEvent = "tapped";
            this.hubGesture = "tapped";
            this.hubGestures.push(this.hubGesture);
        }

        // execute funcAfterNewGesture callback that was taken at wait_for_new_gesture()
        if (typeof funcAfterNewGesture === "function") {
            this.funcAfterNewGesture(hubGesture);
            this.funcAfterNewGesture = undefined;
        }

        console.log("%cTuftsCEEO ", "color: #3ba336;", this.lastUJSONRPC);

    }
    else {

        // general parameters check
        if (parsedUJSON["r"]) {
            if (parsedUJSON["r"]["slots"]) {

                var storageInfo = parsedUJSON["r"]["slots"]; // get info of all the slots

                for (var slotid in storageInfo) {
                    this.hubProjects[slotid] = storageInfo[slotid]; // reassign hubProjects global variable
                }

            }
        }

        // getFirmwareInfo callback check
        if (this.getFirmwareInfoCallback != undefined) {
            if (this.getFirmwareInfoCallback[0] == parsedUJSON["i"]) {
                var version = parsedUJSON["r"]["runtime"]["version"];
                var stringVersion = ""
                for (var index in version) {
                    if (index < version.length - 1) {
                        stringVersion = stringVersion + version[index] + ".";
                    }
                    else {
                        stringVersion = stringVersion + version[index];
                    }
                }
                console.log("%cTuftsCEEO ", "color: #3ba336;", "firmware version: ", stringVersion);
                this.getFirmwareInfoCallback[1](stringVersion);
            }
        }
        // COMMENTED BY JEREMY JUNG ON DECEMBER 10TH AFTER REMOVING TRIGGER_CURRENT_STATE INTERVAL
        // if (parsedUJSON.r !== undefined && parsedUJSON.r !== null) {
        // if (Object.keys(parsedUJSON.r).length !== 0 && parsedUJSON.r.constructor === Object) {
        // console.log("%cTuftsCEEO ", "color: #3ba336;", "received response: ", lastUJSONRPC);
        // }
        // }
        // else {
        // console.log("%cTuftsCEEO ", "color: #3ba336;", "received response: ", lastUJSONRPC);
        // }

        console.log("%cTuftsCEEO ", "color: #3ba336;", "received response: ", this.lastUJSONRPC);
        /* See if any of the stored responseCallbacks need to be executed due to this UJSONRPC response */
        for (var index = 0; index < this.responseCallbacks.length; index++) {

            var currCallbackInfo = this.responseCallbacks[index];

            if (currCallbackInfo != undefined) {

                if (currCallbackInfo[0] == parsedUJSON["i"]) {
                    /* the message id of UJSONRPC corresponds to that of a response callback */

                    var response = "null";

                    // parse motor stoppage reason responses 
                    if (parsedUJSON["r"] == 0) {
                        response = "done";
                    }
                    else if (parsedUJSON["r"] == 2) {
                        response = "stalled";
                    }

                    // execute callback with the response
                    currCallbackInfo[1](response);

                    // empty the index of which callback that was just executed
                    this.responseCallbacks[index] = undefined;
                }
            }
        }

        // execute the callback function after sending start_write_program UJSONRPC
        if (this.startWriteProgramCallback != undefined) {

            console.log("%cTuftsCEEO ", "color: #3ba336;", "startWriteProgramCallback is defined. Looking for matching mesasage id: ", this.startWriteProgramCallback[0]);

            // check if the message id of UJSONRPC corresponds to that of a response callback
            if (this.startWriteProgramCallback[0] == parsedUJSON["i"]) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "matching message id detected with startWriteProgramCallback[0]: ", this.startWriteProgramCallback[0])

                // get the information for the packet sending
                var blocksize = parsedUJSON["r"]["blocksize"]; // maximum size of each packet to be sent in bytes
                var transferid = parsedUJSON["r"]["transferid"]; // id to use for transferring this program

                console.log("%cTuftsCEEO ", "color: #3ba336;", "executing writePackageFunc expecting transferID of ", transferid);

                // execute callback
                await this.startWriteProgramCallback[1](blocksize, transferid);

                console.log("%cTuftsCEEO ", "color: #3ba336;", "deallocating startWriteProgramCallback");

                // deallocate callback
                this.startWriteProgramCallback = undefined;
            }

        }

        // check if the program should write packages for a program
        if (this.writePackageInformation != undefined) {

            console.log("%cTuftsCEEO ", "color: #3ba336;", "writePackageInformation is defined. Looking for matching mesasage id: ", this.writePackageInformation[0]);

            // check if the message id of UJSONRPC corresponds to that of the first write_package script that was sent
            if (this.writePackageInformation[0] == parsedUJSON["i"]) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "matching message id detected with writePackageInformation[0]: ", this.writePackageInformation[0]);

                // get the information for the package sending process
                var remainingData = this.writePackageInformation[1];
                var transferID = this.writePackageInformation[2];
                var blocksize = this.writePackageInformation[3];

                // the size of the remaining data to send is less than or equal to blocksize
                if (remainingData.length <= blocksize) {
                    console.log("%cTuftsCEEO ", "color: #3ba336;", "remaining data's length is less than or equal to blocksize");

                    // the size of remaining data is not zero
                    if (remainingData.length != 0) {

                        var dataToSend = remainingData.substring(0, remainingData.length);

                        console.log("%cTuftsCEEO ", "color: #3ba336;", "reminaing data's length is not zero, sending entire remaining data: ", dataToSend);

                        var base64data = btoa(dataToSend);

                        this.UJSONRPC.writePackage(base64data, transferID);

                        console.log("%cTuftsCEEO ", "color: #3ba336;", "deallocating writePackageInforamtion")

                        if (this.writeProgramCallback != undefined) {

                            this.writeProgramCallback();
                        }


                        this.writePackageInformation = undefined;
                    }
                }
                // the size of remaining data is more than the blocksize
                else if (remainingData.length > blocksize) {

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "remaining data's length is more than blocksize");

                    var dataToSend = remainingData.substring(0, blocksize);

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "sending blocksize amount of data: ", dataToSend)

                    var base64data = btoa(dataToSend);

                    var messageid = UJSONRPC.writePackage(base64data, transferID);

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "expected response with message id of ", messageid);

                    var remainingData = remainingData.substring(blocksize, remainingData.length);

                    this.writePackageInformation = [messageid, remainingData, transferID, blocksize];
                }
            }
        }
    }
}

/** Get the orientation of the hub based on gyroscope values
 * 
 * @private
 * @param {(number|Array)} gyro 
 */
Service_SPIKE.prototype.setHubOrientation = function (gyro) {
    var newOrientation;
    if (gyro[0] < 500 && gyro[0] > -500) {
        if (gyro[1] < 500 && gyro[1] > -500) {

            if (gyro[2] > 500) {
                newOrientation = "front";
            }
            else if (gyro[2] < -500) {
                newOrientation = "back";
            }
        }
        else if (gyro[1] > 500) {
            newOrientation = "up";
        }
        else if (gyro[1] < -500) {
            newOrientation = "down";
        }
    } else if (gyro[0] > 500) {
        newOrientation = "rightside";
    }
    else if (gyro[0] < -500) {
        newOrientation = "leftside";
    }

    return newOrientation;
}
