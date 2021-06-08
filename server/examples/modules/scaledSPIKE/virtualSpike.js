function _virtualSpike () {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    // Service Dock variables
    let spikeRPC = new _SpikeRPC(); // Spike communication interface
    let ujsonLib = _SpikeUjsonLib;

    // flag for development
    let dev = false;

    var colorDictionary = {
        0: "BLACK",
        1: "VIOLET",
        3: "BLUE",
        4: "AZURE",
        5: "GREEN",
        7: "YELLOW",
        9: "RED",
        1: "WHITE",
    };
    
    // object containing real-time info on devices connected to each port of SPIKE Prime 
    let ports =
    {
        "A": { "device": "none", "data": {}},
        "B": { "device": "none", "data": {}},
        "C": { "device": "none", "data": {}},
        "D": { "device": "none", "data": {}},
        "E": { "device": "none", "data": {}},
        "F": { "device": "none", "data": {}}
    };

    // object containing real-time info on hub sensor values
    /*
        !say the usb wire is the nose of the spike prime

        ( looks at which side of the hub is facing up)
        gyro[0] - up/down detector ( down: 1000, up: -1000, neutral: 0)
        gyro[1] - rightside/leftside detector ( leftside : 1000 , rightside: -1000, neutal: 0 )
        gyro[2] - front/back detector ( front: 1000, back: -1000, neutral: 0 )

        ( assume the usb wire port is the nose of the spike prime )
        accel[0] - roll acceleration (roll to right: -, roll to left: +)
        accel[1] - pitch acceleration (up: +, down: -)
        accel[2] - yaw acceleration (counterclockwise: +. clockwise: -)

        ()
        pos[0] - yaw angle
        pos[1] - pitch angle
        pos[2] - roll angle

    */
    let hub =
    {
        "gyro"            : [0, 0, 0],
        "accel"           : [0, 0, 0],
        "pos"             : [0, 0, 0],
        "gesture"         : undefined, // shake, freefall, tapped, doubletapped
        "name"            : undefined,
        "frontEvent"      : undefined, // string of real-time info on hub events
        "batteryAmount"   : 0, // battery [0-100]
        "mainButton"      : { "pressed": false, "duration": 0 },
        "bluetoothButton" : { "pressed": false, "duration": 0 },
        "leftButton"      : { "pressed": false, "duration": 0 },
        "rightButton"     : { "pressed": false, "duration": 0 }
    }

    // Button states
    let hubMainButton = { "pressed": false, "duration": 0 };
    let hubBluetoothButton = { "pressed": false, "duration": 0 };
    let hubLeftButton = { "pressed": false, "duration": 0 };
    let hubRightButton = { "pressed": false, "duration": 0 };

    // Hub states
    let hubProjects = {
        "0": "None",
        "1": "None",
        "2": "None",
        "3": "None",
        "4": "None",
        "5": "None",
        "6": "None",
        "7": "None",
        "8": "None",
        "9": "None",
        "10": "None",
        "11": "None",
        "12": "None",
        "13": "None",
        "14": "None",
        "15": "None",
        "16": "None",
        "17": "None",
        "18": "None",
        "19": "None"
    };

    let spikeMemory = {
        /* States memory */
        ForceSensorWasPressed: false,
        waitForNewOriFirst: true,
        hubGestures: [], // hubGestures detected since program started or since was_gesture()
        hubButtonPresses: [],
        lastDetectedColor: undefined,
        /*
            up: hub is upright/standing, with the display looking horizontally
            down: hub is upsidedown with the display, with the display looking horizontally
            front: hub's display facing towards the sky
            back: hub's display facing towards the earth
            leftside: hub rotated so that the side to the left of the display is facing the earth
            rightside: hub rotated so that the side to the right of the display is facing the earth
        */
        lastHubOrientation: undefined, //PrimeHub orientation read from caught UJSONRPC 
        /* Spike callbacks */
        funcAfterNewGesture: undefined,
        funcAfterNewOrientation: undefined,
        funcAfterLeftButtonPress: undefined,
        funcAfterLeftButtonRelease: undefined,
        funcAfterRightButtonPress: undefined,
        funcAfterRightButtonRelease: undefined,
        funcAfterNewColor: undefined,
        waitUntilColorCallback: undefined, // [colorToDetect, function to execute]
        waitForDistanceFartherThanCallback: undefined, // [distance, function to execute]
        waitForDistanceCloserThanCallback: undefined, // [distance, function to execute]
        funcAfterForceSensorPress: undefined,
        funcAfterForceSensorRelease: undefined,
        /* array that holds the pointers to callback functions to be executed after a UJSONRPC response */
        responseCallbacks: [],
        // Spike write program memory
        startWriteProgramCallback: undefined, // [message_id, function to execute ]
        writePackageInformation: undefined, // [ message_id, remaining_data, transfer_id, blocksize]
        writeProgramCallback: undefined, // callback function to run after a program was successfully written
        writeProgramSetTimeout: undefined, // setTimeout object for looking for response to start_write_program
        /* callback functions added for Coding Rooms */
        getFirmwareInfoCallback: undefined,
        triggerCurrentStateCallback: undefined
    }

    var funcAfterPrint = (m) => { }; // function to call for SPIKE python program print statements or errors
    var funcAfterError = (er) => { }; // function to call for errors in ServiceDock
    var funcAfterDisconnect = () => { }; // function to call after SPIKE Prime is disconnected
    var funcAfterConnect = () => { }; // function to call after SPIKE Prime is connected
    var funcWithStream = () => { } // function to call during SPIKE Prime data stream

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////
    /** Connect to a webserial port and begin data stream with hub
     * @public
     */
    const init = async function (isDev) {
        try {
            dev = isDev;
            let connected = await spikeRPC.init(isDev, updateHubPortsInfo, PrimeHubEventHandler);
            
            devConsoleLog("connected: " + connected);

            await sleep(1000); // wait for at least one UJSONRPC to be parsed

            ujsonLib.triggerCurrentState((c, rid) => sendDATA(c));
            ujsonLib.getFirmwareInfo( (c, rid) => {
                sendDATA(c);
                spikeMemory.getFirmwareInfoCallback =
                     [rid, (version) => devConsoleLog("This SPIKE Prime is using Hub OS " + version)];
            });

            await sleep(2000); // wait for service to init

            return connected;
        }
        catch (e) {
            consoleError(e);
        }
        // reinit variables in the case of hardware disconnection and Service reactivation
        // reader = undefined;
        // writer = undefined;

        // initialize web serial connection
        // var webSerialConnected = await initWebSerial();

        // if (webSerialConnected) {

        // start streaming UJSONRPC
        // streamUJSONRPC();

        // await sleep(1000);

        // triggerCurrentState();
        // getFirmwareInfo(function (version) {
        //     console.log("%cTuftsCEEO ", "color: #3ba336;", "This SPIKE Prime is using Hub OS ", version);
        // });
        // serviceActive = true;

        // await sleep(2000); // wait for service to init

        // // call funcAtInit if defined
        // if (funcAtInit !== undefined) {
        //     funcAtInit();
        // }
        // return true;
        // }
        // else {
        // return false;
        // }
    }

    /** Write a micropy program into a slot of the SPIKE Prime
     * 
     * @param {string} projectName name of the program
     * @param {string} data the micropython source code (expecting an input tag's value). All characters must be ASCII
     * @param {integer} slotid slot number to assign the program
     * @param {function} callback function to run after program is written
     */
    const writeProgram = async function (projectName, data, slotid, callback) {
        // check for non-ascii characters 
        let ascii = /[^\x00-\x7F]/;
        if (ascii.test(data)) {
            funcAfterError("non-ASCII characters detected in micropy program. Only ASCII characters are supported. Please check your micropy input.")
            throw new Error("non-ASCII characters detected in micropy program. Only ASCII characters are supported. Please check your micropy input.")
        }
        else {
            // reinit witeProgramTimeout
            if (spikeMemory.writeProgramSetTimeout != undefined) {
                clearTimeout(spikeMemory.writeProgramSetTimeout);
                spikeMemory.writeProgramSetTimeout = undefined;
            }

            // template of python file that needs to be concatenated
            var firstPart = "from runtime import VirtualMachine\n\n# Stack for execution:\nasync def stack_1(vm, stack):\n"
            var secondPart = "# Setup for execution:\ndef setup(rpc, system, stop):\n\n    # Initialize VM:\n    vm = VirtualMachine(rpc, system, stop, \"Target__1\")\n\n    # Register stack on VM:\n    vm.register_on_start(\"stack_1\", stack_1)\n\n    return vm"

            // stringify data and strip trailing and leading quotation marks
            var stringifiedData = JSON.stringify(data);
            stringifiedData = stringifiedData.substring(1, stringifiedData.length - 1);

            var result = ""; // string to which the final code will be appended

            var splitData = stringifiedData.split(/\\n/); // split the code by every newline

            // add a tab before every newline (this is syntactically needed for concatenating with the template)
            for (var index in splitData) {

                var addedTab = "    " + splitData[index] + "\n";

                result = result + addedTab;
            }

            // replace tab characters
            result = result.replace(/\\t/g, "    ");

            stringifiedData = firstPart + result + secondPart;

            spikeMemory.writeProgramCallback = callback;

            // begin the write program process
            ujsonLib.startWriteProgram(projectName, "python", stringifiedData, slotid, (command, randomId) => {

                spikeMemory.startWriteProgramCallback = [randomId, (blocksize, transferid) => {

                    devConsoleLog("in writePackageFunc...");

                    devConsoleLog("stringified the entire data to send: " + stringifiedData);

                    // when data's length is less than the blocksize limit of sending data
                    if (stringifiedData.length <= blocksize) {
                        devConsoleLog("data's length is less than the blocksize of " + blocksize);

                        // if the data's length is not zero (not empty)
                        if (stringifiedData.length != 0) {

                            var dataToSend = stringifiedData.substring(0, stringifiedData.length); // get the entirety of data
                            devConsoleLog("data's length is not zero, sending the entire data: " + dataToSend);

                            var base64data = btoa(dataToSend); // encode the packet to base64

                            ujsonLib.writePackage(base64data, transferid, (wpCommand, wpRandomId) => {
                                sendDATA(wpCommand); // send the packet

                                // writeProgram's callback defined by the user
                                if (spikeMemory.writeProgramCallback != undefined) {
                                    spikeMemory.writeProgramCallback();
                                }
                            });

                        }
                        // the package to send is empty, so throw error
                        else {
                            throw new Error("package to send is initially empty");
                        }

                    }
                    // if the length of data to send is larger than the blocksize, send only a blocksize amount
                    // and save the remaining data to send packet by packet
                    else if (stringifiedData.length > blocksize) {
                        devConsoleLog("data's length is more than the blocksize of " + blocksize);

                        var dataToSend = stringifiedData.substring(0, blocksize); // get the first block of packet
                        devConsoleLog("sending the blocksize amount of data: " + dataToSend)

                        var base64data = btoa(dataToSend); // encode the packet to base64

                        ujsonLib.writePackage(base64data, transferid, (wpCommand, wpRandomId) => {
                            sendDATA(wpCommand); // send the packet

                            var remainingData = stringifiedData.substring(blocksize, stringifiedData.length); // remove the portion just sent from data
                            devConsoleLog("reassigning writePackageInformation with message ID: " + wpRandomId);
                            devConsoleLog("reassigning writePackageInformation with remainingData: " + remainingData);

                            // update package information to be used for sending remaining packets
                            spikeMemory.writePackageInformation = [wpRandomId, remainingData, transferid, blocksize];
                        });
                    }
                }];

                sendDATA(command);

                // check if start_write_program received a response after 5 seconds
                spikeMemory.writeProgramSetTimeout = setTimeout(function () {
                    if (spikeMemory.startWriteProgramCallback != undefined) {
                        funcAfterError("5 seconds have passed without response... Please reboot the hub and try again.");
                        consoleError("5 seconds have passed without response... Please reboot the hub and try again.");
                    }
                }, 5000)

            });
        }
    }

    /** Parse information on devices connected to SPIKE Prime ports
     * Effect: Modifies {ports}, {hub}
     * @param {object} data_stream portion of prased lastUJSONRPC containing port devices info
     * @private
     */
    const updateHubPortsInfo = async function (data_stream) {

        var index_to_port = ["A", "B", "C", "D", "E", "F"];

        // iterate through each port and assign a device_type to {ports}
        for (var key = 0; key < 6; key++) {

            let device_value = { "device": "none", "data": {} }; // value to go in ports associated with the port letter keys

            try {
                var letter = index_to_port[key];

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

                    /* check if callback from wait_for_distance_farther_than() can be executed */
                    if (spikeMemory.waitForDistanceFartherThanCallback != undefined) {
                        let thresholdDistance = spikeMemory.waitForDistanceFartherThanCallback[0];

                        if (Udist > thresholdDistance) {
                            // current distance is farther than threshold, so execute callback
                            spikeMemory.waitForDistanceFartherThanCallback[1]();
                            spikeMemory.waitForDistanceFartherThanCallback = undefined; // reset callback
                        }
                    }

                    /* check if callback from wait_for_distance_closer_than() can be executed */
                    if (spikeMemory.waitForDistanceCloserThanCallback != undefined) {
                        let thresholdDistance = spikeMemory.waitForDistanceCloserThanCallback[0];

                        if (Udist < thresholdDistance) {

                            // current distance is closer than threshold, so execute callback
                            spikeMemory.waitForDistanceCloserThanCallback[1]();
                            spikeMemory.waitForDistanceCloserThanCallback = undefined; // reset callback
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
                        if (spikeMemory.funcAfterForceSensorPress !== undefined)
                            spikeMemory.funcAfterForceSensorPress();

                        // destruct callback function
                        spikeMemory.funcAfterForceSensorPress = undefined;

                        // indicate that the ForceSensor was pressed
                        spikeMemory.ForceSensorWasPressed = true;
                    }
                    // execute callback from ForceSensor.wait_until_released()
                    else {
                        // check if the Force Sensor was just released
                        if (spikeMemory.ForceSensorWasPressed) {
                            spikeMemory.ForceSensorWasPressed = false;
                            if (spikeMemory.funcAfterForceSensorRelease !== undefined)
                                spikeMemory.funcAfterForceSensorRelease();
                            spikeMemory.funcAfterForceSensorRelease = undefined;
                        }
                    }

                    // populate value object
                    device_value.device = "force";
                    device_value.data = { "force": Famount, "pressed": Fboolean, "forceSensitive": Fbigamount }
                    ports[letter] = device_value;
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
                    if (Ccolor !== undefined)
                        Ccolor = Ccolor.toLowerCase();
                    else
                        Ccolor = "null";
                    device_value.data = { "reflected": Creflected, "color": Ccolor, "RGB": rgb_array };

                    // execute wait_until_color callback when color matches its argument
                    if (spikeMemory.waitUntilColorCallback != undefined)
                        if (Ccolor == spikeMemory.waitUntilColorCallback[0]) {
                            spikeMemory.waitUntilColorCallback[1]();

                            spikeMemory.waitUntilColorCallback = undefined;
                        }

                    if (spikeMemory.lastDetectedColor != Ccolor) {

                        if (spikeMemory.funcAfterNewColor != undefined) {
                            spikeMemory.funcAfterNewColor(Ccolor);
                            spikeMemory.funcAfterNewColor = undefined;
                        }

                        spikeMemory.lastDetectedColor = Ccolor;
                    }
                    ports[letter] = device_value;
                }
                /// NOTHING is connected
                else if (data_stream[key][0] == 0) {
                    // populate value object
                    device_value.device = "none";
                    device_value.data = {};
                    ports[letter] = device_value;
                }

                ports.time = Date.now();

                //parse hub information
                var gyro_x = data_stream[6][0];
                var gyro_y = data_stream[6][1];
                var gyro_z = data_stream[6][2];
                var gyro = [gyro_x, gyro_y, gyro_z];
                hub["gyro"] = gyro;

                var newOri = setHubOrientation(gyro);
                // see if currently detected orientation is different from the last detected orientation
                if (newOri !== spikeMemory.lastHubOrientation) {
                    spikeMemory.lastHubOrientation = newOri;

                    if (typeof spikeMemory.funcAfterNewOrientation == "function")
                        spikeMemory.funcAfterNewOrientation(newOri);
                    spikeMemory.funcAfterNewOrientation = undefined;
                }

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

            } catch (e) {
                console.log(e);
            } //ignore errors
        }
    }

    /**  Catch hub events in UJSONRPC
     * <p> Effect: </p>
     * <p> Logs in the console when some particular messages are caught </p>
     * <p> Assigns the hub events global variables </p>
     * @private
     */
    const PrimeHubEventHandler = async function (parsedUJSON, lastUJSONRPC) {
        var messageType = parsedUJSON["m"];

        //catch runtime_error made at ujsonrpc level
        if (messageType == "runtime_error") {
            var decodedResponse = atob(parsedUJSON["p"][3]);

            decodedResponse = JSON.stringify(decodedResponse);
            consoleError("spike runtime error: " + decodedResponse);

            var splitData = decodedResponse.split(/\\n/); // split the code by every newline

            // execute function after print if defined (only print the last line of error message)
            var errorType = splitData[splitData.length - 2];

            // error is a syntax error
            if (errorType.indexOf("SyntaxError") > -1) {
                /* get the error line number*/
                var lineNumberLine = splitData[splitData.length - 3];
                devConsoleLog("lineNumberLine: " + lineNumberLine);
                var indexLine = lineNumberLine.indexOf("line");
                var lineNumberSubstring = lineNumberLine.substring(indexLine, lineNumberLine.length);
                var numberPattern = /\d+/g;
                var lineNumber = lineNumberSubstring.match(numberPattern)[0];
                devConsoleLog(lineNumberSubstring.match(numberPattern));
                devConsoleLog("lineNumber: " + lineNumber);
                devConsoleLog("typeof lineNumber: " + typeof lineNumber);
                var lineNumberInNumber = parseInt(lineNumber) - 5;
                devConsoleLog("typeof lineNumberInNumber: " + typeof lineNumberInNumber);

                funcAfterError("line " + lineNumberInNumber + ": " + errorType);
            }
            else {
                funcAfterError(errorType);
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
                hubProjects[slotid] = storageInfo[slotid]; // reassign hubProjects global variable
            }

        }
        // battery status
        else if (messageType == 2) {
            hub.batteryAmount = parsedUJSON["p"][1];
        }
        // give center button click, left, right (?)
        else if (messageType == 3) {
            devConsoleLog(lastUJSONRPC);
            if (parsedUJSON.p[0] == "center") {
                hub.mainButton.pressed = true;

                if (parsedUJSON.p[1] > 0) {
                    hub.mainButton.pressed = false;
                    hub.mainButton.duration = parsedUJSON.p[1];
                }
            }
            else if (parsedUJSON.p[0] == "connect") {
                hub.bluetoothButton.pressed = true;

                if (parsedUJSON.p[1] > 0) {
                    hub.bluetoothButton.pressed = false;
                    hub.bluetoothButton.duration = parsedUJSON.p[1];
                }
            }
            else if (parsedUJSON.p[0] == "left") {
                hub.leftButton.pressed = true;

                // execute callback for wait_until_pressed() if defined
                if (spikeMemory.funcAfterLeftButtonPress != undefined) {
                    spikeMemory.funcAfterLeftButtonPress();
                }
                spikeMemory.funcAfterLeftButtonPress = undefined;

                if (parsedUJSON.p[1] > 0) {
                    hub.leftButton.pressed = false;
                    hub.leftButton.duration = parsedUJSON.p[1];

                    // execute callback for wait_until_released() if defined
                    if (spikeMemory.funcAfterLeftButtonRelease != undefined) {
                        spikeMemory.funcAfterLeftButtonRelease();
                    }

                    spikeMemory.funcAfterLeftButtonRelease = undefined;
                }

            }
            else if (parsedUJSON.p[0] == "right") {
                hub.rightButton.pressed = true;

                // execute callback for wait_until_pressed() if defined
                if (spikeMemory.funcAfterRightButtonPress != undefined) {
                    spikeMemory.funcAfterRightButtonPress();
                }

                spikeMemory.funcAfterRightButtonPress = undefined;

                if (parsedUJSON.p[1] > 0) {
                    hub.rightButton.pressed = false;
                    hub.rightButton.duration = parsedUJSON.p[1];

                    // execute callback for wait_until_released() if defined
                    if (spikeMemory.funcAfterRightButtonRelease != undefined) {
                        spikeMemory.funcAfterRightButtonRelease();
                    }

                    spikeMemory.funcAfterRightButtonRelease = undefined;
                }
            }

        }
        else if (messageType == 4) {
            var newGesture = parsedUJSON.p;

            if (newGesture == "3") {
                hub.gesture = "freefall";
                spikeMemory.hubGestures.push(hub.gesture);
            }
            else if (newGesture == "2") {
                hub.gesture = "shaken";
                spikeMemory.hubGestures.push(hub.gesture); // the string is different at higher level
            }
            else if (newGesture == "1") {
                hub.frontEvent = "doubletapped";
                hub.gesture = "doubletapped";
                spikeMemory.hubGestures.push(hub.gesture);
            }
            else if (newGesture == "0") {
                hub.frontEvent = "tapped";
                hub.gesture = "tapped";
                spikeMemory.hubGestures.push(hub.gesture);
            }
            devConsoleLog("hubGesture in virtualSpike: " + hub.gesture);
            // execute funcAfterNewGesture callback that was taken at wait_for_new_gesture()
            if (typeof spikeMemory.funcAfterNewGesture === "function") {
                spikeMemory.funcAfterNewGesture(hub.gesture);
                spikeMemory.funcAfterNewGesture = undefined;
            }

            devConsoleLog(lastUJSONRPC);

        }
        else if (messageType == 7) {
            funcAfterPrint(">>> Program started!");
        }
        else if (messageType == 8) {
            funcAfterPrint(">>> Program finished!");
        }
        else if (messageType == 9) {
            var encodedName = parsedUJSON["p"];
            var decodedName = atob(encodedName);
            hub.name = decodedName;

            if (spikeMemory.triggerCurrentStateCallback != undefined) {
                spikeMemory.triggerCurrentStateCallback();
            }
        }
        else if (messageType == 11) {
            devConsoleLog(lastUJSONRPC);
        }
        else if (messageType == 12) {
            // this is usually the response from trigger_current_state, don't console log to avoid spam
        }
        // gives orientation of the hub (leftside, up,..)
        else if (messageType == 14) {
            /* this data stream is about hub orientation */

            var newOrientation = parsedUJSON.p;
            // console.log(newOrientation);
            if (newOrientation == "1") {
                spikeMemory.lastHubOrientation = "up";
            }
            else if (newOrientation == "4") {
                spikeMemory.lastHubOrientation = "down";
            }
            else if (newOrientation == "0") {
                spikeMemory.lastHubOrientation = "front";
            }
            else if (newOrientation == "3") {
                spikeMemory.lastHubOrientation = "back";
            }
            else if (newOrientation == "2") {
                spikeMemory.lastHubOrientation = "rightside";
            }
            else if (newOrientation == "5") {
                spikeMemory.lastHubOrientation = "leftside";
            }

            devConsoleLog(lastUJSONRPC);
        }
        else {
            devConsoleLog("received response: " + lastUJSONRPC);

            // general parameters check
            if (parsedUJSON["r"]) {
                if (parsedUJSON["r"]["slots"]) {

                    var storageInfo = parsedUJSON["r"]["slots"]; // get info of all the slots

                    for (var slotid in storageInfo) {
                        hubProjects[slotid] = storageInfo[slotid]; // reassign hubProjects global variable
                    }

                }
            }

            // getFirmwareInfo callback check
            if (spikeMemory.getFirmwareInfoCallback != undefined) {
                if (spikeMemory.getFirmwareInfoCallback[0] == parsedUJSON["i"]) {
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
                    // console.log("%cTuftsCEEO ", "color: #3ba336;", "firmware version: ", stringVersion);
                    spikeMemory.getFirmwareInfoCallback[1](stringVersion);
                }
            }

            /* See if any of the stored responseCallbacks need to be executed due to this UJSONRPC response */
            for (var index = 0; index < spikeMemory.responseCallbacks.length; index++) {

                var currCallbackInfo = spikeMemory.responseCallbacks[index];

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
                        spikeMemory.responseCallbacks[index] = undefined;
                    }
                }
            }

            // execute the callback function after sending start_write_program UJSONRPC
            if (spikeMemory.startWriteProgramCallback != undefined) {

                devConsoleLog("startWriteProgramCallback is defined. Looking for matching mesasage id: " + spikeMemory.startWriteProgramCallback[0]);
                // check if the message id of UJSONRPC corresponds to that of a response callback
                if (spikeMemory.startWriteProgramCallback[0] == parsedUJSON["i"]) {

                    devConsoleLog("matching message id detected with startWriteProgramCallback[0]: " + spikeMemory.startWriteProgramCallback[0]);

                    // get the information for the packet sending
                    var blocksize = parsedUJSON["r"]["blocksize"]; // maximum size of each packet to be sent in bytes
                    var transferid = parsedUJSON["r"]["transferid"]; // id to use for transferring this program

                    devConsoleLog("executing writePackageFunc expecting transferID of " + transferid);

                    // execute callback
                    await spikeMemory.startWriteProgramCallback[1](blocksize, transferid);

                    devConsoleLog("deallocating startWriteProgramCallback");

                    // deallocate callback
                    spikeMemory.startWriteProgramCallback = undefined;
                }

            }

            // check if the program should write packages for a program
            if (spikeMemory.writePackageInformation != undefined) {

                devConsoleLog("writePackageInformation is defined. Looking for matching mesasage id: " + spikeMemory.writePackageInformation[0]);

                // check if the message id of UJSONRPC corresponds to that of the first write_package script that was sent
                if (spikeMemory.writePackageInformation[0] == parsedUJSON["i"]) {

                    devConsoleLog("matching message id detected with writePackageInformation[0]: " + spikeMemory.writePackageInformation[0]);

                    // get the information for the package sending process
                    var remainingData = spikeMemory.writePackageInformation[1];
                    var transferID = spikeMemory.writePackageInformation[2];
                    var blocksize = spikeMemory.writePackageInformation[3];

                    // the size of the remaining data to send is less than or equal to blocksize
                    if (remainingData.length <= blocksize) {
                        devConsoleLog("remaining data's length is less than or equal to blocksize");

                        // the size of remaining data is not zero
                        if (remainingData.length != 0) {

                            var dataToSend = remainingData.substring(0, remainingData.length);

                            devConsoleLog("remaining data's length is not zero, sending entire remaining data: " + dataToSend);

                            var base64data = btoa(dataToSend);

                            ujsonLib.writePackage(base64data, transferID, (wpCommand, wpRandomId) => {
                                sendDATA(wpCommand);

                                devConsoleLog("deallocating writePackageInforamtion");

                                if (spikeMemory.writeProgramCallback != undefined) {
                                    spikeMemory.writeProgramCallback();
                                }

                                spikeMemory.writePackageInformation = undefined;
                            });
                        }
                    }
                    // the size of remaining data is more than the blocksize
                    else if (remainingData.length > blocksize) {
                        devConsoleLog("remaining data's length is more than blocksize");

                        var dataToSend = remainingData.substring(0, blocksize);

                        devConsoleLog("sending blocksize amount of data: " + dataToSend);

                        var base64data = btoa(dataToSend);

                        ujsonLib.writePackage(base64data, transferID, (wpCommand, wpRandomId) => {
                            sendDATA(wpCommand);

                            devConsoleLog("expected response with message id of " + wpRandomId)

                            var remainingData = remainingData.substring(blocksize, remainingData.length);

                            spikeMemory.writePackageInformation = [wpRandomId, remainingData, transferID, blocksize];
                        });
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
    const setHubOrientation = function (gyro) {
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

    /** 
     * 
     * @private
     * @param {string} id 
     * @param {function} cb
     */
    const pushResponseCallback = function (id, cb) {
        var toPush = []; // [ ujson string id, function pointer ]

        toPush.push(id);
        toPush.push(cb);

        // responseCallbacks has elements in it
        if (spikeMemory.responseCallbacks.length > 0) {

            var emptyFound = false; // empty index was found flag

            // insert the pointer to the function where index is empty
            for (var index in spikeMemory.responseCallbacks) {
                if (spikeMemory.responseCallbacks[index] == undefined) {
                    spikeMemory.responseCallbacks[index] = toPush;
                    emptyFound = true;
                }
            }

            // if all indices were full, push to the back
            if (!emptyFound) {
                spikeMemory.responseCallbacks.push(toPush);
            }

        }
        // responseCallbacks current has no elements in it
        else {
            spikeMemory.responseCallbacks.push(toPush);
        }
    }

    const sendDATA = function (command) {
        spikeRPC.sendDATA(command);
    }
    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passConnectCallback = function (f) {
        funcAfterConnect = f;
        spikeRPC.passConnectCallback(f);
    }
    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passDisconnectCallback = function (f) {
        funcAfterDisconnect = f;
        spikeRPC.passDisconnectCallback(f);
    }
    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passErrorCallback = function (f) {
        funcAfterError = f;
        spikeRPC.passErrorCallback(f);
    }
    /** assign event callback and pass callback down
     * @param {function} f 
     */
    const passPrintCallback = function (f) {
        funcAfterPrint = f;
        spikeRPC.passPrintCallback(f);
    }

    const passStreamCallback = function (f) {
        spikeRPC.executeWithStream(f);
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

    /**  Sleep function
    * @private
    * @param {number} ms Miliseconds to sleep
    * @returns {Promise} 
    */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    return {
        init: init,
        spikeMemory: spikeMemory,
        ports,
        hub: hub,
        writeProgram: writeProgram,
        sendDATA: sendDATA,
        pushResponseCallback: pushResponseCallback,
        // key event callback setters
        passConnectCallback: passConnectCallback,
        passDisconnectCallback: passDisconnectCallback,
        passErrorCallback: passErrorCallback,
        passPrintCallback: passPrintCallback,
        passStreamCallback: passStreamCallback
    }

}