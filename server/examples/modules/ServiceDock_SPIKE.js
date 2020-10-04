/*
Project Name: SPIKE Prime Web Interface
File name: ServiceDock_SPIKE.js
Author: Jeremy Jung
Last update: 9/22/20
Description: HTML Element definition for <service-spike> to be used in ServiceDocks
Credits/inspirations:
History:
    Created by Jeremy on 7/16/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
TODO:
include bluetooth_button and main_button in PrimeHub() SPIKE APP functions
Remove all instances of getPortsInfo in example codes
implement get_color
*/

// import { Service_SPIKE } from "./Service_SPIKE.js";

class servicespike extends HTMLElement {   

    constructor () {
        super();

        var active = false; // whether the service was activated
        this.service = new Service_SPIKE(); // instantiate a service object ( one object per button )

        this.service.executeAfterDisconnect(function () {
            active = false;
            status.style.backgroundColor = "red";
        })

        // Create a shadow root
        var shadow = this.attachShadow({ mode: 'open' });

        /* wrapper definition and CSS */

        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        wrapper.setAttribute("style", "width: 50px; height: 50px; position: relative; margin-top: 10px;")

        /* ServiceDock button definition and CSS */ 

        var button = document.createElement("button");
        button.setAttribute("id", "sl_button");
        button.setAttribute("class", "SD_button");

        var imageRelPath = "./modules/views/SPIKE_button.png" // relative to the document in which a servicespike is created ( NOT this file )
        var length = 50; // for width and height of button
        var buttonBackgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background: url(" + imageRelPath + ") no-repeat; background-size: 50px 50px; background-color:" + buttonBackgroundColor
            + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        this.status = document.createElement("div");
        this.status.setAttribute("class", "status");
        var length = 20; // for width and height of circle
        var statusBackgroundColor = "red" // default background color of service (inactive color)
        var posLeft = 30;
        var posTop = 20;
        var statusStyle = "border-radius: 50%; height:" + length + "px; width:" + length + "px; background-color:" + statusBackgroundColor +
            "; position: relative; left:" + posLeft + "px; top:" + posTop + "px;";
        this.status.setAttribute("style", statusStyle);

        /* event listeners */
        
        button.addEventListener("mouseleave", function (event) {
            button.style.backgroundColor = "#A2E1EF";
            button.style.color = "#000000";
        });

        button.addEventListener("mouseenter", function (event) {
            button.style.backgroundColor = "#FFFFFF";
            button.style.color = "#000000";
        })

        // when ServiceDock button is double clicked
        this.addEventListener("click", async function () {
            // check active flag so once activated, the service doesnt reinit
            if (!active) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "activating service");
                var initSuccessful = await this.service.init();
                if (initSuccessful) {
                    active = true;
                    this.status.style.backgroundColor = "green";
                }
            } 
        });


        shadow.appendChild(wrapper);
        button.appendChild(this.status);
        wrapper.appendChild(button);

    }

    /* get the Service_SPIKE object */
    getService() {
        return this.service;
    }

    /* get whether the ServiceDock button was clicked */
    getClicked() {
        return this.active;
    }

}

// when defining custom element, the name must have at least one - dash 
window.customElements.define('service-spike', servicespike);

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


/**
 * @class Service_SPIKE 
 * @classdesc
 * ServiceDock library for interfacing with LEGO® SPIKE™ Prime
 * @example
 * // if you're using ServiceDock 
 * var mySPIKE = document.getElemenyById("service_spike").getService();
 * mySPIKE.executeAfterInit(async function() {
 *     // write code here
 * })
 * 
 * // if you're not using ServiceDock
 * var mySPIKE = new Service_SPIKE();
 * mySPIKE.init();
 * 
 * 
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

    /* using this filter in webserial setup will only take serial ports*/
    const filter = {
        usbVendorId: VENDOR_ID

    };

    // define for communication
    let port;
    let reader;
    let writer;
    let value;
    let done;
    let writableStreamClosed;

    //define for json concatenation
    let jsonline = "";

    // contains latest full json object from SPIKE readings
    let lastUJSONRPC;

    // object containing real-time info on devices connected to each port of SPIKE Prime 
    let ports =
    {
        "A": { "device": "none", "data": {} },
        "B": { "device": "none", "data": {} },
        "C": { "device": "none", "data": {} },
        "D": { "device": "none", "data": {} },
        "E": { "device": "none", "data": {} },
        "F": { "device": "none", "data": {} }
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
        "gyro": [0, 0, 0],
        "accel": [0, 0, 0],
        "pos": [0, 0, 0]
    }

    let batteryAmount = 0; // battery [0-100]

    // string containing real-time info on hub events
    let hubFrontEvent;

    /*
        up: hub is upright/standing, with the display looking horizontally
        down: hub is upsidedown with the display, with the display looking horizontally
        front: hub's display facing towards the sky
        back: hub's display facing towards the earth
        leftside: hub rotated so that the side to the left of the display is facing the earth
        rightside: hub rotated so that the side to the right of the display is facing the earth
    */
    let lastHubOrientation; //PrimeHub orientation read from caught UJSONRPC 

    /*
        shake
        freefall
    */
    let hubGesture;

    // 
    let hubMainButton = { "pressed": false, "duration": 0 };

    let hubBluetoothButton = { "pressed": false, "duration": 0 };

    let hubLeftButton = { "pressed": false, "duration": 0 };

    let hubRightButton = { "pressed": false, "duration": 0 };

    /* PrimeHub data storage arrays for was_***() functions */
    let hubGestures = []; // array of hubGestures run since program started or since was_gesture() ran
    let hubButtonPresses = [];
    let hubName = undefined;

    /* SPIKE Prime Projects */

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

    // true after Force Sensor is pressed, turned to false after reading it for the first time that it is released
    let ForceSensorWasPressed = false;

    var micropython_interpreter = false; // whether micropython was reached or not

    let serviceActive = false; //serviceActive flag

    var waitForNewOriFirst = true; //whether the wait_for_new_orientation method would be the first time called

    /* stored callback functions from wait_until functions and etc. */

    var funcAtInit = undefined; // function to call after init of SPIKE Service

    var funcAfterNewGesture = undefined;
    var funcAfterNewOrientation = undefined;

    var funcAfterLeftButtonPress = undefined;
    var funcAfterLeftButtonRelease = undefined;
    var funcAfterRightButtonPress = undefined;
    var funcAfterRightButtonRelease = undefined;

    var funcUntilColor = undefined;
    var funcAfterNewColor = undefined;

    var funcAfterForceSensorPress = undefined;
    var funcAfterForceSensorRelease = undefined;

    /* array that holds the pointers to callback functions to be executed after a UJSONRPC response */
    var responseCallbacks = [];

    // array of information needed for writing program
    var startWriteProgramCallback = undefined; // [message_id, function to execute ]
    var writePackageInformation = undefined; // [ message_id, remaining_data, transfer_id, blocksize]
    var writeProgramCallback = undefined; // callback function to run after a program was successfully written
    var writeProgramSetTimeout = undefined; // setTimeout object for looking for response to start_write_program

    /* callback functions added for Coding Rooms */
    
    var getFirmwareInfoCallback = undefined;

    var funcAfterPrint = undefined; // function to call for SPIKE python program print statements or errors
    var funcAfterError = undefined; // function to call for errors in ServiceDock

    var funcAfterDisconnect = undefined; // function to call after SPIKE Prime is disconnected

    var funcWithStream = undefined; // function to call after every parsed UJSONRPC package

    var triggerCurrentStateCallback = undefined;

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /**  initialize SPIKE_service
     * <p> Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled) </p>
     * <p> Starts streaming UJSONRPC </p>
     * <p> <em> this function needs to be executed after executeAfterInit but before all other public functions </em> </p>
     * @public
     * @returns {boolean} True if service was successsfully initialized, false otherwise
     */
    async function init() {

        console.log("%cTuftsCEEO ", "color: #3ba336;", "navigator.product is ", navigator.product);
        console.log("%cTuftsCEEO ", "color: #3ba336;", "navigator.appName is ", navigator.appName);
        // reinit variables in the case of hardware disconnection and Service reactivation
        reader = undefined;
        writer = undefined;

        // initialize web serial connection
        var webSerialConnected = await initWebSerial();

        if (webSerialConnected) {

            // start streaming UJSONRPC
            streamUJSONRPC();

            await sleep(1000);

            triggerCurrentState();
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

    /**  Get the callback function to execute after service is initialized.
     * <p> <em> This function needs to be executed before calling init() </em> </p>
     * @public
     * @param {function} callback Function to execute after initialization ( during init() )
     * @example
     * var motor = mySPIKE.Motor("A");
     * mySPIKE.executeAfterInit( async function () {
     *     var speed = await motor.get_speed();
     *     // do something with speed
     * })
     */
    function executeAfterInit(callback) {
        // Assigns global variable funcAtInit a pointer to callback function
        funcAtInit = callback;
    }

    /**  Get the callback function to execute after a print or error from SPIKE python program
     * @ignore
     * @param {function} callback 
     */
    function executeAfterPrint(callback) {
        funcAfterPrint = callback;
    }

    /**  Get the callback function to execute after Service Dock encounters an error
     * @ignore
     * @param {any} callback 
     */
    function executeAfterError(callback) {
        funcAfterError = callback;
    }


    /**  Execute a stack of functions continuously with SPIKE sensor feed
     * 
     * @public
     * @param {any} callback 
     * @example
     * var motor = new mySPIKE.Motor('A')
     * mySPIKE.executeWithStream( async function() {
     *      var speed = await motor.get_speed();
     *      // do something with motor speed
     * })
     */
    function executeWithStream(callback) {
        funcWithStream = callback;
    }

    /**  Get the callback function to execute after service is disconnected
     * @ignore
     * @param {any} callback 
     */
    function executeAfterDisconnect(callback) {
        funcAfterDisconnect = callback;
    }

    /**  Send command to the SPIKE Prime (UJSON RPC or Micropy depending on current interpreter)
     * <p> May make the SPIKE Prime do something </p>
     * @ignore
     * @param {string} command Command to send (or sequence of commands, separated by new lines)
     */
    async function sendDATA(command) {
        // look up the command to send
        commands = command.split("\n"); // split on new line
        //commands = command
        console.log("%cTuftsCEEO ", "color: #3ba336;", "sendDATA: " + commands);

        // make sure ready to write to device
        setupWriter();

        // send it in micropy if micropy reached
        if (micropython_interpreter) {

            for (var i = 0; i < commands.length; i++) {
                // console.log("%cTuftsCEEO ", "color: #3ba336;", "commands.length", commands.length)

                // trim trailing, leading whitespaces
                var current = commands[i].trim();

                writer.write(current);
                writer.write(RETURN); // extra return at the end
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
                writer.write(JSON.stringify(myobj));
                writer.write(RETURN); // extra return at the end
            }
        }
    }


    /**  Send character sequences to reboot SPIKE Prime
     * <p> <em> Run this function to exit micropython interpreter </em> </p>
     * @public
     * @example
     * mySPIKE.rebootHub();
     */
    function rebootHub() {
        console.log("%cTuftsCEEO ", "color: #3ba336;", "rebooting")
        // make sure ready to write to device
        setupWriter();
        writer.write(CONTROL_C);
        writer.write(CONTROL_D);

        //toggle micropython_interpreter flag if its was active
        if (micropython_interpreter) {
            micropython_interpreter = false;
        }
    }

    /**  Get the information of all the ports and devices connected to them
     * @ignore
     * @returns {object} <p> An object with keys as port letters and values as objects of device type and info </p>
     * @example
     * // USAGE 
     * 
     * var portsInfo = await mySPIKE.getPortsInfo();
     * // ports.{yourPortLetter}.device --returns--> device type (ex. "smallMotor" or "ultrasonic") </p>
     * // ports.{yourPortLetter}.data --returns--> device info (ex. {"speed": 0, "angle":0, "uAngle": 0, "power":0} ) </p>
     * 
     * // Motor on port A
     * var motorSpeed = portsInfo["A"]["speed"]; // motor speed
     * var motorDegreesCounted = portsInfo["A"]["angle"]; // motor angle
     * var motorPosition = portsInfo["A"]["uAngle"]; // motor angle in unit circle ( -180 ~ 180 )
     * var motorPower = portsInfo["A"]["power"]; // motor power
     * 
     * // Ultrasonic Sensor on port A
     * var distance = portsInfo["A"]["distance"] // distance value from ultrasonic sensor
     * 
     * // Color Sensor on port A
     * var reflectedLight = portsInfo["A"]["reflected"]; // reflected light
     * var ambientLight = portsInfo["A"]["ambient"]; // ambient light
     * var RGB = portsInfo["A"]["RGB"]; // [R, G, B]
     * 
     * // Force Sensor on port A
     * var forceNewtons = portsInfo["A"]["force"]; // Force in Newtons ( 1 ~ 10 ) 
     * var pressedBool = portsInfo["A"]["pressed"] // whether pressed or not ( true or false )
     * var forceSensitive = portsInfo["A"]["forceSensitive"] // More sensitive force output( 0 ~ 900 )
     */
    async function getPortsInfo() {
        return ports;
    }

    /**  get the info of a single port
     * @ignore
     * @param {string} letter Port on the SPIKE hub
     * @returns {object} Keys as device and info as value
     */
    async function getPortInfo(letter) {
        return ports[letter];
    }

    /**  Get battery status
     * @ignore
     * @returns {integer} battery percentage
     */
    async function getBatteryStatus() {
        return batteryAmount;
    }

    /**  Get info of the hub
     * @ignore
     * @returns {object} Info of the hub
     * @example
     * var hubInfo = await mySPIKE.getHubInfo();
     * 
     * var upDownDetector = hubInfo["gyro"][0];
     * var rightSideLeftSideDetector = hubInfo["gyro"][1];
     * var frontBackDetector = hubInfo["gyro"][2];
     * 
     * var rollAcceleration = hubInfo["pos"][0];  
     * var pitchAcceleration = hubInfo["pos"][1]; 
     * var yawAcceleration = hubInfo["pos"][2];   
     * 
     * var yawAngle = hubInfo["pos"][0];
     * var pitchAngle = hubInfo["pos"][1];
     * var rollAngle = hubInfo["pos"][2];
     * 
     * 
     */
    async function getHubInfo() {
        return hub;
    }

    /**  Get the name of the hub
     * 
     * @public
     * @returns name of hub
     */
    async function getHubName() {
        return hubName;
    }

    /**
     * @ignore
     * @param {any} callback 
     */
    async function getFirmwareInfo(callback) {

        UJSONRPC.getFirmwareInfo(callback);

    }


    /**  get projects in all the slots of SPIKE Prime hub
     * 
     * @ignore
     * @returns {object}
     */
    async function getProjects() {

        UJSONRPC.getStorageStatus();

        await sleep(2000);

        return hubProjects
    }

    /**  Reach the micropython interpreter beneath UJSON RPC
     * <p> Note: Stops UJSON RPC stream </p>
     * <p> hub needs to be rebooted to return to UJSONRPC stream</p>
     * @ignore
     * @example
     * mySPIKE.reachMicroPy();
     * mySPIKE.sendDATA("from spike import PrimeHub");
     * mySPIKE.sendDATA("hub = PrimeHub()");
     * mySPIKE.sendDATA("hub.light_matrix.show_image('HAPPY')");
     */
    function reachMicroPy() {
        console.log("%cTuftsCEEO ", "color: #3ba336;", "starting micropy interpreter");
        setupWriter();
        writer.write(CONTROL_C);
        micropython_interpreter = true;
    }

    /**  Get the latest complete line of UJSON RPC from stream
     * @ignore
     * @returns {string} Represents a JSON object from UJSON RPC
     */
    async function getLatestUJSON() {

        try {
            var parsedUJSON = await JSON.parse(lastUJSONRPC)
        }
        catch (error) {
            //console.log("%cTuftsCEEO ", "color: #3ba336;", '[retrieveData] ERROR', error);
        }

        return lastUJSONRPC
    }

    /** Get whether the Service was initialized or not
     * @public
     * @returns {boolean} True if service initialized, false otherwise
     * @example
     * if (mySPIKE.isActive()) {
     *      // do something
     * }
     */
    function isActive() {
        return serviceActive;
    }

    /**  Get the most recently detected event on the display of the hub
     * @public
     * @returns {string} ['tapped','doubletapped']
     * var event = await mySPIKE.getHubEvent();
     * if (event == "tapped" ) {
     *      console.log("SPIKE is tapped");
     * }
     */
    async function getHubEvent() {
        return hubFrontEvent;
    }

    /**  Get the most recently detected gesture of the hub
     * @public
     * @returns {string} ['shake', 'freefall']
     * @example
     * var gesture = await mySPIKE.getHubGesture();
     * if (gesture == "shake") {
     *      console.log("SPIKE is being shaked");
     * }
     */
    async function getHubGesture() {
        return hubGesture;
    }

    /**  Get the most recently detected orientation of the hub
     * @public
     * @returns {string} ['up','down','front','back','leftside','rightside']
     * @example
     * var orientation = await mySPIKE.getHubOrientation();
     * if (orientation == "front") {
     *      console.log("SPIKE is facing up");
     * }
     */
    async function getHubOrientation() {
        return lastHubOrientation;
    }


    /**  Get the latest press event information on the "connect" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
     * @example
     * var bluetoothButtonInfo = await mySPIKE.getBluetoothButton();
     * var pressedBool = bluetoothButtonInfo["pressed"];
     * var pressedDuration = bluetoothButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     */
    async function getBluetoothButton() {
        return hubBluetoothButton;
    }

    /**  Get the latest press event information on the "center" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER }
     * @example
     * var mainButtonInfo = await mySPIKE.getMainButton();
     * var pressedBool = mainButtonInfo["pressed"];
     * var pressedDuration = mainButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     * 
     */
    async function getMainButton() {
        return hubMainButton;
    }

    /**  Get the latest press event information on the "left" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
     * @example
     * var leftButtonInfo = await mySPIKE.getLeftButton();
     * var pressedBool = leftButtonInfo["pressed"];
     * var pressedDuration = leftButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     * 
     */
    async function getLeftButton() {
        return hubLeftButton;
    }

    /**  Get the latest press event information on the "right" button
     * @ignore
     * @returns {object} { "pressed": BOOLEAN, "duration": NUMBER } 
     * @example
     * var rightButtonInfo = await mySPIKE.getRightButton();
     * var pressedBool = rightButtonInfo["pressed"];
     * var pressedDuration = rightButtonInfo["duration"]; // duration is miliseconds the button was pressed until release
     */
    async function getRightButton() {
        return hubRightButton;
    }

    /**  Get the letters of ports connected to any kind of Motors
     * @public
     * @returns {(string|Array)} Ports that are connected to Motors
     */
    async function getMotorPorts() {

        var portsInfo = ports;
        var motorPorts = [];
        for (var key in portsInfo) {
            if (portsInfo[key].device == "smallMotor" || portsInfo[key].device == "bigMotor") {
                motorPorts.push(key);
            }
        }
        return motorPorts;

    }

    /**  Get the letters of ports connected to Small Motors
     * @public
     * @returns {(string|Array)} Ports that are connected to Small Motors
     */
    async function getSmallMotorPorts() {

        var portsInfo = ports;
        var motorPorts = [];
        for (var key in portsInfo) {
            if (portsInfo[key].device == "smallMotor") {
                motorPorts.push(key);
            }
        }
        return motorPorts;

    }

    /**  Get the letters of ports connected to Big Motors
     * @public
     * @returns {(string|Array)} Ports that are connected to Big Motors
     */
    async function getBigMotorPorts() {
        var portsInfo = ports;
        var motorPorts = [];
        for (var key in portsInfo) {
            if (portsInfo[key].device == "bigMotor") {
                motorPorts.push(key);
            }
        }
        return motorPorts;
    }

    /**  Get the letters of ports connected to Distance Sensors
     * @public
     * @returns {(string|Array)} Ports that are connected to Distance Sensors
     */
    async function getUltrasonicPorts() {

        var portsInfo = await this.getPortsInfo();
        var ultrasonicPorts = [];

        for (var key in portsInfo) {
            if (portsInfo[key].device == "ultrasonic") {
                ultrasonicPorts.push(key);
            }
        }

        return ultrasonicPorts;

    }

    /**  Get the letters of ports connected to Color Sensors
     * @public
     * @returns {(string|Array)} Ports that are connected to Color Sensors
     */
    async function getColorPorts() {

        var portsInfo = await this.getPortsInfo();
        var colorPorts = [];

        for (var key in portsInfo) {
            if (portsInfo[key].device == "color") {
                colorPorts.push(key);
            }
        }

        return colorPorts;

    }

    /**  Get the letters of ports connected to Force Sensors
     * @public
     * @returns {(string|Array)} Ports that are connected to Force Sensors
     */
    async function getForcePorts() {

        var portsInfo = await this.getPortsInfo();
        var forcePorts = [];

        for (var key in portsInfo) {
            if (portsInfo[key].device == "force") {
                forcePorts.push(key);
            }
        }

        return forcePorts;

    }

    /**  Get all motor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected Motor objects
     * @example
     * var motors = await mySPIKE.getMotors();
     * var myMotor = motors["A"]  
     */
    async function getMotors() {
        var portsInfo = ports;
        var motors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "smallMotor" || portsInfo[key].device == "bigMotor") {
                motors[key] = new Motor(key);
            }
        }
        return motors;
    }

    /**  Get all distance sensor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected DistanceSensor objects
     * @example
     * var distanceSensors = await mySPIKE.getDistanceSensors();
     * var mySensor = distanceSensors["A"];
     */
    async function getDistanceSensors() {
        var portsInfo = ports;
        var distanceSensors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "ultrasonic") {
                distanceSensors[key] = new DistanceSensor(key);
            }
        }
        return distanceSensors;
    }

    /**  Get all color sensor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected ColorSensor objects
     * @example
     * var colorSensors = await mySPIKE.getColorSensors();
     * var mySensor = colorSensors["A"];
     */
    async function getColorSensors() {
        var portsInfo = ports;
        var colorSensors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "color") {
                colorSensors[key] = new ColorSensor(key);
            }
        }
        return colorSensors;
    }

    /**  Get all force sensor objects currently connected to SPIKE
     * 
     * @public
     * @returns {object} All connected ForceSensor objects
     * @example
     * var forceSensors = await mySPIKE.getForceSensors();
     * var mySensor = forceSensors["A"];
     */
    async function getForceSensors() {
        var portsInfo = ports;
        var forceSensors = {};
        for (var key in portsInfo) {
            if (portsInfo[key].device == "force") {
                forceSensors[key] = new ForceSensor(key);
            }
        }
        return forceSensors;
    }


    /**  Terminate currently running micropy progra
     * @ignore
     */
    function stopCurrentProgram() {
        UJSONRPC.programTerminate();
    }

    /**  write a micropy program into a slot of the SPIKE Prime
     * 
     * @ignore
     * @param {string} projectName name of the project to register
     * @param {string} data the micropy code to send (expecting an <input type="text">.value)
     * @param {integer} slotid slot number to assign the program in [0-9]
     * @param {function} callback callback to run after program is written
     */
    async function writeProgram(projectName, data, slotid, callback) {

        // reinit witeProgramTimeout
        if (writeProgramSetTimeout != undefined) {
            clearTimeout(writeProgramSetTimeout);
            writeProgramSetTimeout = undefined;
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

        writeProgramCallback = callback;

        // begin the write program process
        UJSONRPC.startWriteProgram(projectName, "python", stringifiedData, slotid);

    }

    /**  Execute a program in a slot
     * 
     * @ignore
     * @param {integer} slotid slot of program to execute [0-9]
     */
    function executeProgram(slotid) {
        UJSONRPC.programExecute(slotid)
    }

    //////////////////////////////////////////
    //                                      //
    //         SPIKE APP Functions          //
    //                                      //
    //////////////////////////////////////////

    /** PrimeHub object
    * @ignore
    * @memberof Service_SPIKE
    * @returns {classes} 
    * <p> left_button </p>
    * <p> right_button </p>
    * <p> motion_sensor </p>
    * <p> light_matrix </p>
    */
    PrimeHub = function () {
        var newOrigin = 0;

        /** The left button on the hub
        * @class
        * @returns {functions} - functions from PrimeHub.left_button
        * @example
        * var hub = mySPIKE.PrimeHub();
        * var left_button = hub.left_button();
        * // do something with left_button
        */
        var left_button = {};

        /** execute callback after this button is pressed
        * @param {function} callback
        */
        left_button.wait_until_pressed = function wait_until_pressed(callback) {
            funcAfterLeftButtonPress = callback;
        }
        /** execute callback after this button is released
         *
         * @param {function} callback
         */
        left_button.wait_until_released = function wait_until_released(callback) {
            funcAfterLeftButtonRelease = callback;
        }
        /** Tests to see whether the button has been pressed since the last time this method called.
         *
         * @returns {boolean} - True if was pressed, false otherwise
         */
        left_button.was_pressed = function was_pressed() {
            if (hubLeftButton.duration > 0) {
                hubLeftButton.duration = 0;
                return true;
            } else {
                return false;
            }
        }

        /** Tests to see whether the button is pressed
        *
        * @returns {boolean} True if pressed, false otherwise
        */
        left_button.is_pressed = function is_pressed() {
            if (hubLeftButton.pressed) {
                return true;
            }
            else {
                return false;
            }
        }

        /** The right button on the hub
         * @class
         * @returns {functions} functions from PrimeHub.right_button
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var right_button = hub.right_button();
         * // do something with right_button
         */
        var right_button = {};

        /** execute callback after this button is pressed
        *
        * @param {function} callback
        * @example
        * var hub = new mySPIKE.PrimeHub();
        * var right_button = hub.right_button;
        * right_button.wait_until_pressed ( function () {
        *     console.log("right_button was pressed");
        * })
        */
        right_button.wait_until_pressed = function wait_until_pressed(callback) {

            funcAfterRightButtonPress = callback;
        }

        /** execute callback after this button is released
         * 
         * @param {function} callback 
         * @example
         * var hub = new mySPIKE.PrimeHub();
         * var right_button = hub.right_button;
         * right_button.wait_until_released ( function () {
         *     console.log("right_button was released");
         * })
         */
        right_button.wait_until_released = function wait_until_released(callback) {

            functAfterRightButtonRelease = callback;
        }

        /** Tests to see whether the button has been pressed since the last time this method called.
         * 
         * @returns {boolean} - True if was pressed, false otherwise
         * @example
         * var hub = new mySPIKE.PrimeHub();
         * if ( hub.right_button.was_pressed() ) {
         *     console.log("right_button was pressed");
         * }
         */
        right_button.was_pressed = function was_pressed() {
            if (hubRightButton.duration > 0) {
                hubRightButton.duration = 0;
                return true;
            } else {
                return false;
            }
        }

        /** Tests to see whether the button is pressed
         * 
         * @returns {boolean} True if pressed, false otherwise
         */
        right_button.is_pressed = function is_pressed() {
            if (hubRightButton.pressed) {
                return true;
            }
            else {
                return false;
            }
        }

        /** Hub's light matrix
         * @class
         * @returns {functions} - functions from PrimeHub.light_matrix
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var light_matrix = hub.light_matrix();
         * // do something with light_matrix
         */
        var light_matrix = {};

        /**
         * @todo Implement this function
         * @param {string}
         */
        light_matrix.show_image = function show_image(image) {

        }
        /** Sets the brightness of one pixel (one of the 25 LED) on the Light Matrix.
         * 
         * @param {integer} x [0 to 4]
         * @param {integer} y [0 to 4]
         * @param {integer} brightness [0 to 100]
         */
        light_matrix.set_pixel = function set_pixel(x, y, brightness = 100) {
            UJSONRPC.displaySetPixel(x, y, brightness);

        }
        /** Writes text on the Light Matrix, one letter at a time, scrolling from right to left.
         * 
         * @param {string} message 
         */
        light_matrix.write = function write(message) {
            UJSONRPC.displayText(message);
        }
        /** Turns off all the pixels on the Light Matrix.
         * 
         */
        light_matrix.off = function off() {
            UJSONRPC.displayClear();
        }

        /** Hub's speaker
         * @class
         * @returns {functions} functions from Primehub.speaker
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var speaker = hub.speaker();
         * // do something with speaker
         */
        var speaker = {};

        speaker.volume = 100;

        /** Plays a beep on the Hub.
         * 
         * @param {integer} note The MIDI note number [44 to 123 (60 is middle C note)]
         * @param {number} seconds The duration of the beep in seconds
         */
        speaker.beep = function beep(note, seconds) {
            UJSONRPC.soundBeep(speaker.volume, note);
            setTimeout(function () { UJSONRPC.soundStop() }, seconds * 1000);
        }

        /** Starts playing a beep.
         * 
         * @param {integer} note The MIDI note number [44 to 123 (60 is middle C note)]
         */
        speaker.start_beep = function start_beep(note) {
            UJSONRPC.soundBeep(speaker.volume, note)
        }

        /** Stops any sound that is playing.
         * 
         */
        speaker.stop = function stop() {
            UJSONRPC.soundStop();
        }

        /** Retrieves the value of the speaker volume.
         * @returns {number} The current volume [0 to 100]
         */
        speaker.get_volume = function get_volume() {
            return speaker.volume;
        }

        /** Sets the speaker volume.
         * 
         * @param {integer} newVolume 
         */
        speaker.set_volume = function set_volume(newVolume) {
            speaker.volume = newVolume
        }

        /** Hub's motion sensor
         * @class
         * @returns {functions} functions from PrimeHub.motion_sensor
         * @example
         * var hub = mySPIKE.PrimeHub();
         * var motion_sensor = hub.motion_sensor();
         * // do something with motion_sensor
         */
        var motion_sensor = {};

        /** Sees whether a gesture has occurred since the last time was_gesture() 
         * was used or since the beginning of the program (for the first use).
         * 
         * @param  {string} gesture
         * @returns {boolean} true if the gesture was made, false otherwise
         */
        motion_sensor.was_gesture = function was_gesture(gesture) {

            var gestureWasMade = false;

            // iterate over the hubGestures array
            for (index in hubGestures) {

                // pick a gesture from the array
                var oneGesture = hubGestures[index];

                // switch the flag that gesture existed
                if (oneGesture == gesture) {
                    gestureWasMade = true;
                    break;
                }
            }
            // reinitialize hubGestures so it only holds gestures that occurred after this was_gesture() execution
            hubGestures = [];

            return gestureWasMade;

        }

        /** Executes callback when a new gesture happens
         * 
         * @param  {function(string)} callback - A callback whose signature is name of the gesture
         */
        motion_sensor.wait_for_new_gesture = function wait_for_new_gesture(callback) {

            funcAfterNewGesture = callback;

        }

        /** Executes callback when the orientation of the Hub changes or when function was first called
         * 
         * @param  {function(string)} callback - A callback whose signature is name of the orientation
         */
        motion_sensor.wait_for_new_orientation = function wait_for_new_orientation(callback) {
            // immediately return current orientation if the method was called for the first time
            if (waitForNewOriFirst) {
                waitForNewOriFirst = false;
                callback(lastHubOrientation);
            }
            // for future executions, wait until new orientation
            else {
                funcAfterNewOrientation = callback;
            }

        }

        /** “Yaw” is the rotation around the front-back (vertical) axis.
         * 
         * @returns {integer} yaw angle
         */
        motion_sensor.get_yaw_angle = function get_yaw_angle() {
            var currPos = hub.pos[0];

            return currPos;
        }

        /** “Pitch” the is rotation around the left-right (transverse) axis.
         * 
         * @returns {integer} pitch angle
         */
        motion_sensor.get_pitch_angle = function get_pitch_angle() {
            return hub.pos[1];
        }

        /** “Roll” the is rotation around the front-back (longitudinal) axis.
         * 
         * @returns {integer} roll angle
         */
        motion_sensor.get_roll_angle = function get_roll_angle() {
            return hub.pos[2];
        }

        /** Gets the acceleration of the SPIKE's yaw axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_yaw_acceleration = function get_yaw_acceleration() {
            return hub.pos[2];
        }

        /**  Gets the acceleration of the SPIKE's pitch axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_pitch_acceleration = function get_pitch_acceleration() {
            return hub.pos[1];
        }

        /** Gets the acceleration of the SPIKE's roll axis
         * 
         * @returns {integer} acceleration
         */
        motion_sensor.get_roll_acceleration = function get_roll_acceleration() {
            return hub.pos[0];
        }

        /** Retrieves the most recently detected gesture.
         * 
         * @returns {string} the name of gesture
         */
        motion_sensor.get_gesture = function get_gesture() {
            return hubGesture;
        }

        /** Retrieves the most recently detected orientation
         * Note: Hub does not detect orientation of when it was connected
         * 
         * @returns {string} the name of orientation
         */
        motion_sensor.get_orientation = function get_orientation() {
            return lastHubOrientation;
        }

        return {
            motion_sensor: motion_sensor,
            light_matrix: light_matrix,
            left_button: left_button,
            right_button: right_button,
            speaker: speaker
        }
    }

    /** Motor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    Motor = function (port) {

        var motor = ports[port]; // get the motor info by port

        // default settings
        var defaultSpeed = 100;
        var stopMethod = false; // stop method doesnt seem to work in this current ujsonrpc config
        var stallSetting = true;

        // check if device is a motor
        if (motor.device != "smallMotor" && motor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }

        /** Get current speed of the motor
         *  
         * @returns {number} speed of motor [-100 to 100]
         */
        function get_speed() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.speed;

        }

        /** Get current position of the motor
         * 
         * @returns {number} position of motor [0 to 359]
         */
        function get_position() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.angle;
        }

        /** Get current degrees counted of the motor
         * 
         * @returns {number} counted degrees of the motor [any number]
         */
        function get_degrees_counted() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.uAngle;
        }

        /** Get the power of the motor
         * 
         * @returns {number} motor power
         */
        function get_power() {
            var motor = ports[port]; // get the motor info by port
            var motorInfo = motor.data;
            return motorInfo.power;
        }

        /** Get the default speed of this motor
         * 
         * @returns {number} motor default speed [-100 to 100]
         */
        function get_default_speed() {
            return defaultSpeed;
        }

        /** Set the default speed for this motor
         * 
         * @param {number} speed [-100 to 100]
         */
        function set_default_speed(speed) {
            if (typeof speed == "number") {
                defaultSpeed = speed;
            }
        }

        /** Turns stall detection on or off.
         * Stall detection senses when a motor has been blocked and can’t move.
         * If stall detection has been enabled and a motor is blocked, the motor will be powered off
         * after two seconds and the current motor command will be interrupted. If stall detection has been
         * disabled, the motor will keep trying to run and programs will “get stuck” until the motor is no
         * longer blocked.
         * @param {boolean} boolean - true if to detect stall, false otherwise
         */
        function set_stall_detection(boolean) {
            if (typeof boolean == "boolean") {
                stallSetting = boolean;
            }
        }

        /** Runs the motor to an absolute position.
         * 
         * @param {integer} degrees [0 to 359]
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         */
        function run_to_position(degrees, speed, callback = undefined) {
            if (speed !== undefined && typeof speed == "number") {
                UJSONRPC.motorGoRelPos(port, degrees, speed, stallSetting, stopMethod, callback);
            }
            else {
                UJSONRPC.motorGoRelPos(port, degrees, defaultSpeed, stallSetting, stopMethod, callback);
            }
        }

        /** Start the motor at some power
         * 
         * @param {integer} power [-100 to 100]
         */
        function start_at_power(power) {
            UJSONRPC.motorPwm(port, power, stallSetting);
        }


        /** Start the motor at some speed
         * 
         * @param {integer} speed [-100 to 100]
         */
        function start(speed = defaultSpeed) {
            // if (speed !== undefined && typeof speed == "number") {
            // UJSONRPC.motorStart (port, speed, stallSetting);
            // }
            // else {
            // UJSONRPC.motorStart(port, defaultSpeed, stallSetting);
            // }

            UJSONRPC.motorStart(port, speed, stallSetting);
        }

        /** Run the motor for some seconds
         * 
         * @param {integer} seconds 
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         */
        function run_for_seconds(seconds, speed, callback = undefined) {
            if (speed !== undefined && typeof speed == "number") {
                UJSONRPC.motorRunTimed(port, seconds, speed, stallSetting, stopMethod, callback)
            }
            else {
                UJSONRPC.motorRunTimed(port, seconds, defaultSpeed, stallSetting, stopMethod, callback)
            }
        }

        /** Run the motor for some degrees
         * 
         * @param {integer} degrees 
         * @param {integer} speed [-100 to 100]
         * @param {function} [callback==undefined] Parameters:"stalled" or "done"
         */
        function run_for_degrees(degrees, speed, callback = undefined) {
            if (speed !== undefined && typeof speed == "number") {
                UJSONRPC.motorRunDegrees(port, degrees, speed, stallSetting, stopMethod, callback);
            }
            else {
                UJSONRPC.motorRunDegrees(port, degrees, defaultSpeed, stallSetting, stopMethod, callback);
            }
        }

        /** Stop the motor
         * 
         */
        function stop() {
            UJSONRPC.motorPwm(port, 0, stallSetting);
        }

        return {
            run_to_position: run_to_position,
            start_at_power: start_at_power,
            start: start,
            stop: stop,
            run_for_degrees: run_for_degrees,
            run_for_seconds: run_for_seconds,
            set_default_speed: set_default_speed,
            set_stall_detection: set_stall_detection,
            get_power: get_power,
            get_degrees_counted: get_degrees_counted,
            get_position: get_position,
            get_speed: get_speed,
            get_default_speed: get_default_speed
        }
    }

    /** ColorSensor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    ColorSensor = function (port) {
        var waitForNewColorFirst = false;

        var colorsensor = ports[port]; // get the color sensor info by port
        var colorsensorData = colorsensor.data;

        // check if device is a color sensor
        if (colorsensor.device != "color") {
            throw new Error("No Color Sensor detected at port " + port);
        }

        /** Get the name of the detected color
         * @ignore
         * @returns {string} 'black','violet','blue','cyan','green','yellow','red','white',None
         * @todo Implement this function
         */
        function get_color() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            var color = colorsensorData.color;

            return color;
        }

        /** Retrieves the intensity of the ambient light.
         * @ignore
         * @returns {number} The ambient light intensity. [0 to 100]
         */
        function get_ambient_light() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.Cambient;
        }

        /** Retrieves the intensity of the reflected light.
         * 
         * @returns {number} The reflected light intensity. [0 to 100]
         */
        function get_reflected_light() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.Creflected;
        }

        /** Retrieves the red, green, blue, and overall color intensity.
         * @todo Implement overall intensity
         * @ignore
         * @returns {(number|Array)} Red, green, blue, and overall intensity (0-1024)
         */
        function get_rgb_intensity() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            var toReturn = [];
            toReturn.push(colorsensorData.Cr);
            toReturn.push(colorsensorData.Cg);
            toReturn.push(colorsensorData.Cb)
            toReturn.push("TODO: unimplemented");;
        }

        /** Retrieves the red color intensity.
         * 
        * @returns {number} [0 to 1024]
         */
        function get_red() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[0];
        }

        /** Retrieves the green color intensity.
         * 
         * @returns {number} [0 to 1024]
         */
        function get_green() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[1];
        }

        /** Retrieves the blue color intensity.
         * 
         * @returns {number} [0 to 1024]
         */
        function get_blue() {
            var colorsensor = ports[port]; // get the color sensor info by port
            var colorsensorData = colorsensor.data;

            return colorsensorData.RGB[2];
        }


        /** Waits until the Color Sensor detects the specified color.
         * @ignore
         * @todo Implement this function
         */
        function wait_until_color(color) {
            var color = get_color();
            console.log(color);
        }


        /** Execute callback when Color Sensor detects a new color.
         * The first time this method is called, it returns immediately the detected color. 
         * After that, it waits until the Color Sensor detects a color that is different from the color that
         * was detected the last time this method was used.
         * @ignore
         * @todo Implement this function
         * @param {function(string)} callback  
         */
        function wait_for_new_color(callback) {

            // check if this method has been executed after start of program
            if (waitForNewColorFirst) {
                waitForNewColorFirst = true;

                var currentColor = get_color();
                callback(currentColor)
            }
            funcAfterNewColor = callback;
        }

        return {
            get_color: get_color,
            get_ambient_light: get_ambient_light,
            get_reflected_light: get_reflected_light,
            get_rgb_intensity: get_rgb_intensity,
            get_red: get_red,
            get_green: get_green,
            get_blue: get_blue
        }

    }

    /** DistanceSensor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    DistanceSensor = function (port) {

        var distanceSensor = ports[port] // get the distance sensor info by port
        var distanceSensorData = distanceSensor.data;

        // check if device is a distance sensor
        if (distanceSensor.device != "ultrasonic") {
            throw new Error("No Distance Sensor detected at port " + port);
        }

        /** Retrieves the measured distance in centimeters.
         * @param {boolean} short_range Whether to use or not the short range mode.
         * @returns {number} [0 to 200]
         * @todo find the short_range handling ujsonrpc script
         */
        function get_distance_cm(short_range) {
            var distanceSensor = ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            return distanceSensorData.distance;
        }

        /** Retrieves the measured distance in inches.
         * 
         * @param {boolean} short_range Whether to use or not the short range mode.
         * @returns {number} [0 to 79]
         * @todo find the short_range handling ujsonrpc script
         */
        function get_distance_inches(short_range) {
            var distanceSensor = ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            var inches = distanceSensorData.distance * 0.393701;
            return inches;
        }

        /** Retrieves the measured distance in percent.
         * 
         * @param {boolean} short_range Whether to use or not the short range mode.
         * @returns {number/string} [0 to 100] or 'none' if can't read distance
         * @todo find the short_range handling ujsonrpc script
         */
        function get_distance_percentage(short_range) {
            var distanceSensor = ports[port] // get the distance sensor info by port
            var distanceSensorData = distanceSensor.data;

            if (distanceSensorData.distance == null) {
                return "none"
            }
            var percentage = distanceSensorData.distance / 200;
            return percentage;
        }

        /** Waits until the measured distance is greater than distance.
         * 
         * @param {integer} distance 
         * @param {string} unit 'cm','in','%'
         * @param {integer} short_range 
         * @todo Implement this function
         */
        function wait_for_distance_farther_than(distance, unit, short_range) {

        }

        /** xWaits until the measured distance is less than distance.
         * 
         * @param {any} distance 
         * @param {any} unit 'cm','in','%'
         * @param {any} short_range 
         * @todo Implement this function
         */
        function wait_for_distance_closer_than(distance, unit, short_range) {

        }

        return {
            get_distance_cm: get_distance_cm,
            get_distance_inches: get_distance_inches,
            get_distance_percentage: get_distance_percentage
        }

    }

    /** ForceSensor
     * @class
     * @param {string} Port
     * @memberof Service_SPIKE
     * @returns {functions}
     */
    ForceSensor = function (port) {

        var sensor = ports[port]; // get the force sensor info by port

        if (sensor.device != "force") {
            throw new Error("No Force Sensor detected at port " + port);
        }

        /** Tests whether the button on the sensor is pressed.
         * 
         * @returns {boolean} true if force sensor is pressed, false otherwise
         */
        function is_pressed() {
            var sensor = ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            return ForceSensorData.pressed;
        }

        /** Retrieves the measured force, in newtons.
         * 
         * @returns {number}  Force in newtons [0 to 10]
         */
        function get_force_newton() {
            var sensor = ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            return ForceSensorData.force;
        }

        /** Retrieves the measured force as a percentage of the maximum force.
         * 
         * @returns {number} percentage [0 to 100]
         */
        function get_force_percentage() {
            var sensor = ports[port]; // get the force sensor info by port
            var ForceSensorData = sensor.data;

            var denominator = 704 - 384 // highest detected - lowest detected forceSensitive values
            var numerator = ForceSensorData.forceSensitive - 384 // 384 is the forceSensitive value when not pressed
            var percentage = Math.round((numerator / denominator) * 100);
            return percentage;
        }

        /** Executes callback when Force Sensor is pressed
         * The function is executed in updateHubPortsInfo()'s Force Sensor part
         * 
         * @param {function} callback 
         */
        function wait_until_pressed(callback) {
            funcAfterForceSensorPress = callback;
        }

        /** Executes callback when Force Sensor is released
         * The function is executed in updateHubPortsInfo()'s Force Sensor part
         * @param {function} callback 
         */
        function wait_until_released(callback) {
            funcAfterForceSensorRelease = callback;
        }

        return {
            is_pressed: is_pressed,
            get_force_newton: get_force_newton,
            get_force_percentage: get_force_percentage,
            wait_until_pressed: wait_until_pressed,
            wait_until_released: wait_until_released
        }

    }

    /** MotorPair
     * @class
     * @param {string} leftPort
     * @param {string} rightPort
     * @memberof Service_SPIKE
     * @returns {functions}
     * @todo implement the rest (what is differential (tank) steering? )
     */
    MotorPair = function (leftPort, rightPort) {
        // settings 
        var defaultSpeed = 100;

        var leftMotor = ports[leftPort];
        var rightMotor = ports[rightPort];

        var DistanceTravelToRevolutionRatio = 17.6;

        // check if device is a motor
        if (leftMotor.device != "smallMotor" && leftMotor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }
        if (rightMotor.device != "smallMotor" && rightMotor.device != "bigMotor") {
            throw new Error("No motor detected at port " + port);
        }

        /** Sets the ratio of one motor rotation to the distance traveled.
         * 
         * If there are no gears used between the motors and the wheels of the Driving Base, 
         * then amount is the circumference of one wheel.
         * 
         * Calling this method does not affect the Driving Base if it is already currently running. 
         * It will only have an effect the next time one of the move or start methods is used.
         * 
         * @param {number} amount 
         * @param {string} unit 'cm','in'
         */
        function set_motor_rotation(amount, unit) {

            // assume unit is 'cm' when undefined
            if (unit == "cm" || unit !== undefined) {
                DistanceTravelToRevolutionRatio = amount;
            }
            else if (unit == "in") {
                // convert to cm
                DistanceTravelToRevolutionRatio = amount * 2.54;
            }
        }

        /** Starts moving the Driving Base
         * 
         * @param {integer} left_speed [-100 to 100]
         * @param {integer} right_speed [-100 to 100]
         */
        function start_tank(left_speed, right_speed) {
            UJSONRPC.moveTankSpeeds(left_speed, right_speed, leftPort, rightPort);
        }

        // /** Starts moving the Driving Base without speed control.
        //  * 
        //  * @param {any} power 
        //  * @param {any} steering 
        //  * @todo Implement this function
        //  */
        // function start_at_power (power, steering) {

        // }

        /** Starts moving the Driving Base
         * 
         * @param {integer} leftPower 
         * @param {integer} rightPower  
         */
        function start_tank_at_power(leftPower, rightPower) {
            UJSONRPC.moveTankPowers(leftPower, rightPower, leftPort, rightPort);
        }

        /** Stops the 2 motors simultaneously, which will stop a Driving Base.
         * 
         */
        function stop() {
            UJSONRPC.moveTankPowers(0, 0, leftPort, rightPort);
        }

        return {
            stop: stop,
            set_motor_rotation: set_motor_rotation,
            start_tank: start_tank,
            start_tank_at_power: start_tank_at_power
        }

    }

    //////////////////////////////////////////
    //                                      //
    //          UJSONRPC Functions          //
    //                                      //
    //////////////////////////////////////////

    /** Low Level UJSONRPC Commands
     * @ignore
     * @namespace UJSONRPC
     */
    var UJSONRPC = {};

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} text 
     */
    UJSONRPC.displayText = async function displayText(text) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_text", "p": {"text":' + '"' + text + '"' + '} }'
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {integer} x [0 to 4]
     * @param {integer} y [0 to 4]
     * @param {integer} brightness [1 to 100]
     */
    UJSONRPC.displaySetPixel = async function displaySetPixel(x, y, brightness) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_set_pixel", "p": {"x":' + x +
            ', "y":' + y + ', "brightness":' + brightness + '} }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.displayClear = async function displayClear() {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_clear" }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} speed 
     * @param {integer} stall 
     */
    UJSONRPC.motorStart = async function motorStart(port, speed, stall) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_start", "p": {"port":'
            + '"' + port + '"' +
            ', "speed":' + speed +
            ', "stall":' + stall +
            '} }';
        sendDATA(command);
    }

    /** moves motor to a position
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} position 
     * @param {integer} speed 
     * @param {boolean} stall 
     * @param {boolean} stop 
     * @param {function} callback
     */
    UJSONRPC.motorGoRelPos = async function motorGoRelPos(port, position, speed, stall, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.motor_go_to_relative_position"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "position":' + position +
            ', "speed":' + speed +
            ', "stall":' + stall +
            ', "stop":' + stop +
            '} }';
        typeof callback !== undefined && pushResponseCallback(randomId, callback);
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} time 
     * @param {integer} speed 
     * @param {integer} stall 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.motorRunTimed = async function motorRunTimed(port, time, speed, stall, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.motor_run_timed"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "time":' + time +
            ', "speed":' + speed +
            ', "stall":' + stall +
            ', "stop":' + stop +
            '} }';
        typeof callback !== undefined && pushResponseCallback(randomId, callback);
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} degrees 
     * @param {integer} speed 
     * @param {integer} stall 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.motorRunDegrees = async function motorRunDegrees(port, degrees, speed, stall, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.motor_run_for_degrees"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "degrees":' + degrees +
            ', "speed":' + speed +
            ', "stall":' + stall +
            ', "stop":' + stop +
            '} }';
        typeof callback !== undefined && pushResponseCallback(randomId, callback);
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {integer} time 
     * @param {integer} lspeed 
     * @param {integer} rspeed 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.moveTankTime = async function moveTankTime(time, lspeed, rspeed, lmotor, rmotor, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_tank_time"' +
            ', "p": {' +
            '"time":' + time +
            ', "lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            ', "stop":' + stop +
            '} }';
        typeof callback !== undefined && pushResponseCallback(randomId, callback);
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} degrees 
     * @param {integer} lspeed 
     * @param {integer} rspeed 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {boolean} stop
     * @param {function} callback
     */
    UJSONRPC.moveTankDegrees = async function moveTankDegrees(degrees, lspeed, rspeed, lmotor, rmotor, stop, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_tank_degrees"' +
            ', "p": {' +
            '"degrees":' + degrees +
            ', "lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            ', "stop":' + stop +
            '} }';
        typeof callback !== undefined && pushResponseCallback(randomId, callback);
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} lspeed 
     * @param {integer} rspeed 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {function} callback
     */
    UJSONRPC.moveTankSpeeds = async function moveTankSpeeds(lspeed, rspeed, lmotor, rmotor, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_start_speeds"' +
            ', "p": {' +
            '"lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            '} }';
        typeof callback !== undefined && pushResponseCallback(randomId, callback);
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} lpower 
     * @param {integer} rpower 
     * @param {string} lmotor 
     * @param {string} rmotor 
     * @param {function} callback
     */
    UJSONRPC.moveTankPowers = async function moveTankPowers(lpower, rpower, lmotor, rmotor, callback) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.move_start_powers"' +
            ', "p": {' +
            '"lpower":' + lpower +
            ', "rpower":' + rpower +
            ', "lmotor":' + '"' + lmotor + '"' +
            ', "rmotor":' + '"' + rmotor + '"' +
            '} }';
        typeof callback !== undefined && pushResponseCallback(randomId, callback);
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {integer} volume 
     * @param {integer} note 
     */
    UJSONRPC.soundBeep = async function soundBeep(volume, note) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.sound_beep"' +
            ', "p": {' +
            '"volume":' + volume +
            ', "note":' + note +
            '} }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.soundStop = async function soundStop() {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "scratch.sound_off"' +
            '}';
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} port 
     * @param {integer} power 
     * @param {integer} stall 
     */
    UJSONRPC.motorPwm = async function motorPwm(port, power, stall) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_pwm", "p": {"port":' + '"' + port + '"' +
            ', "power":' + power + ', "stall":' + stall + '} }';
        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {function} callback
     */
    UJSONRPC.getFirmwareInfo = async function getFirmwareInfo(callback) {
        var randomId = generateId();

        var command = '{"i":' + '"' + randomId + '"' + ', "m": "get_hub_info" ' + '}';
        sendDATA(command);
        if (callback != undefined) {
            getFirmwareInfoCallback = [randomId, callback];
        }
    }

    /**
     * @memberof! UJSONRPC
     * @param {function} callback 
     */
    UJSONRPC.triggerCurrentState = async function triggerCurrentState(callback) {
        var randomId = generateId();

        var command = '{"i":' + '"' + randomId + '"' + ', "m": "trigger_current_state" ' + '}';
        sendDATA(command);
        if (callback != undefined) {
            triggerCurrentStateCallback = callback;
        }
    }

    /** 
     * 
     * @memberof! UJSONRPC
     * @param {integer} slotid 
     */
    UJSONRPC.programExecute = async function programExecute(slotid) {
        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' + ', "m": "program_execute", "p": {"slotid":' + slotid + '} }';
        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.programTerminate = function programTerminate() {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "program_terminate"' +
            '}';

        sendDATA(command);
    }

    /**
     * @memberof! UJSONRPC
     * @param {string} projectName name of the project
     * @param {integer} type type of data (micropy or scratch)
     * @param {string} data entire data to send in ASCII
     * @param {integer} slotid slot to which to assign the program
     */
    UJSONRPC.startWriteProgram = async function startWriteProgram(projectName, type, data, slotid) {

        console.log("%cTuftsCEEO ", "color: #3ba336;", "in startWriteProgram...");
        console.log("%cTuftsCEEO ", "color: #3ba336;", "constructing start_write_program script...");

        if (type == "python") {
            var typeInt = 0;
        }

        // construct the UJSONRPC packet to start writing program

        var dataSize = (new TextEncoder().encode(data)).length;

        var randomId = generateId();

        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "start_write_program", "p": {' +
            '"meta": {' +
            '"created": ' + parseInt(Date.now()) +
            ', "modified": ' + parseInt(Date.now()) +
            ', "name": ' + '"' + btoa(projectName) + '"' +
            ', "type": ' + typeInt +
            ', "project_id":' + Math.floor(Math.random() * 1000) +
            '}' +
            ', "fname": ' + '"' + projectName + '"' +
            ', "size": ' + dataSize +
            ', "slotid": ' + slotid +
            '} }';

        console.log("%cTuftsCEEO ", "color: #3ba336;", "constructed start_write_program script...");

        // assign function to start sending packets after confirming blocksize and transferid
        startWriteProgramCallback = [randomId, writePackageFunc];

        console.log("%cTuftsCEEO ", "color: #3ba336;", "sending start_write_program script");

        sendDATA(command);

        // check if start_write_program received a response after 5 seconds
        writeProgramSetTimeout = setTimeout(function () {
            if (startWriteProgramCallback != undefined) {
                if (funcAfterError != undefined) {
                    funcAfterError("5 seconds have passed without response... Please reboot the hub and try again.")
                }
            }
        }, 5000)

        // function to write the first packet of data
        function writePackageFunc(blocksize, transferid) {

            console.log("%cTuftsCEEO ", "color: #3ba336;", "in writePackageFunc...");

            console.log("%cTuftsCEEO ", "color: #3ba336;", "stringified the entire data to send: ", data);

            // when data's length is less than the blocksize limit of sending data
            if (data.length <= blocksize) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "data's length is less than the blocksize of ", blocksize);

                // if the data's length is not zero (not empty)
                if (data.length != 0) {

                    var dataToSend = data.substring(0, data.length); // get the entirety of data

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "data's length is not zero, sending the entire data: ", dataToSend);

                    var base64data = btoa(dataToSend); // encode the packet to base64

                    UJSONRPC.writePackage(base64data, transferid); // send the packet

                    // writeProgram's callback defined by the user
                    if (writeProgramCallback != undefined) {
                        writeProgramCallback();
                    }

                }
                // the package to send is empty, so throw error
                else {
                    throw new Error("package to send is initially empty");
                }

            }
            // if the length of data to send is larger than the blocksize, send only a blocksize amount
            // and save the remaining data to send packet by packet
            else if (data.length > blocksize) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "data's length is more than the blocksize of ", blocksize);

                var dataToSend = data.substring(0, blocksize); // get the first block of packet

                console.log("%cTuftsCEEO ", "color: #3ba336;", "sending the blocksize amount of data: ", dataToSend);

                var base64data = btoa(dataToSend); // encode the packet to base64

                var msgID = UJSONRPC.writePackage(base64data, transferid); // send the packet

                var remainingData = data.substring(blocksize, data.length); // remove the portion just sent from data

                console.log("%cTuftsCEEO ", "color: #3ba336;", "reassigning writePackageInformation with message ID: ", msgID);
                console.log("%cTuftsCEEO ", "color: #3ba336;", "reassigning writePackageInformation with remainingData: ", remainingData);

                // update package information to be used for sending remaining packets
                writePackageInformation = [msgID, remainingData, transferid, blocksize];

            }

        }

    }



    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} base64data base64 encoded data to send
     * @param {string} transferid transferid of this program write process
     * @returns {string} the randomly generated message id used to send this UJSONRPC script
     */
    UJSONRPC.writePackage = function writePackage(base64data, transferid) {

        var randomId = generateId();
        var writePackageCommand = '{"i":' + '"' + randomId + '"' +
            ', "m": "write_package", "p": {' +
            '"data": ' + '"' + base64data + '"' +
            ', "transferid": ' + '"' + transferid + '"' +
            '} }';

        sendDATA(writePackageCommand);

        return randomId;

    }

    /**
     * @memberof! UJSONRPC
     */
    UJSONRPC.getStorageStatus = function getStorageStatus() {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "get_storage_status"' +
            '}';

        sendDATA(command);

    }

    /**
     * @memberof! UJSONRPC
     * @param {string} slotid 
     */
    UJSONRPC.removeProject = function removeProject(slotid) {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "remove_project", "p": {' +
            '"slotid": ' + slotid +
            '} }';

        sendDATA(command);
    }

    /**
     * 
     * @memberof! UJSONRPC
     * @param {string} oldslotid 
     * @param {string} newslotid 
     */
    UJSONRPC.moveProject = function moveProject(oldslotid, newslotid) {

        var randomId = generateId();
        var command = '{"i":' + '"' + randomId + '"' +
            ', "m": "move_project", "p": {' +
            '"old_slotid": ' + oldslotid +
            ', "new_slotid: ' + newslotid +
            '} }';

        sendDATA(command);

    }


    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////
    
    /**
    * @private
    * @param {function} callback 
    */
    async function triggerCurrentState(callback) {

        UJSONRPC.triggerCurrentState(callback);
    }

    /** 
     * 
     * @private
     * @param {string} id 
     * @param {string} funcName 
     */
    function pushResponseCallback(id, funcName) {

        var toPush = []; // [ ujson string id, function pointer ]

        toPush.push(id);
        toPush.push(funcName);

        // responseCallbacks has elements in it
        if (responseCallbacks.length > 0) {

            var emptyFound = false; // empty index was found flag

            // insert the pointer to the function where index is empty
            for (var index in responseCallbacks) {
                if (responseCallbacks[index] == undefined) {
                    responseCallbacks[index] = toPush;
                    emptyFound = true;
                }
            }

            // if all indices were full, push to the back
            if (!emptyFound) {
                responseCallbacks.push(toPush);
            }

        }
        // responseCallbacks current has no elements in it
        else {
            responseCallbacks.push(toPush);
        }

    }

    /**  Sleep function
     * @private
     * @param {number} ms Miliseconds to sleep
     * @returns {Promise} 
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**  generate random id for UJSONRPC messages
     * @private
     * @returns {string}
     */
    function generateId() {
        var generatedID = ""
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 4; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            generatedID = generatedID + characters[randomIndex];
        }

        return generatedID;
    }

    /**  Prompt user to select web serial port and make connection to SPIKE Prime
     * <p> Effect Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled) </p>
     * <p> Note: </p>
     * <p> This function is to be executed before reading in JSON RPC streams from the hub </p>
     * <p> This function needs to be called when system is handling a user gesture (like button click) </p>
     * @private
     * @returns {boolean} True if web serial initialization is successful, false otherwise
     */
    async function initWebSerial() {
        try {
            var success = false;

            port = await navigator.serial.getPorts();
            console.log("%cTuftsCEEO ", "color: #3ba336;", "ports:", port);
            // select device
            port = await navigator.serial.requestPort({
                // filters:[filter]
            });

            // wait for the port to open.
            try {
                await port.open({ baudrate: 115200 });
            }
            catch (er) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", er)
                if (funcAfterError != undefined) {
                    funcAfterError(er + "\nPlease try again. If error persists, refresh this environment.");
                }
                await port.close();
            }

            if (port.readable) {
                success = true;
            }
            else {
                success = false;
            }

            return success;


        } catch (e) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", "Cannot read port:", e);
            if (funcAfterError != undefined) {
                funcAfterError(e);
            }
            return false;
        }
    }

    /**  Initialize writer object before sending commands
     * @private
     * 
     */
    function setupWriter() {
        // if writer not yet defined:
        if (typeof writer === 'undefined') {
            // set up writer for the first time
            const encoder = new TextEncoderStream();
            writableStreamClosed = encoder.readable.pipeTo(port.writable);
            writer = encoder.writable.getWriter();
        }
    }

    /** clean the json_string for concatenation into jsonline
     * @private
     * 
     * @param {any} json_string 
     * @returns 
     */
    function cleanJsonString(json_string) {
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
    async function processFullUJSONRPC(lastUJSONRPC, json_string = "undefined", testing = false, callback) {
        try {

            var parseTest = await JSON.parse(lastUJSONRPC)

            if (testing) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "processing FullUJSONRPC line: ", lastUJSONRPC);
            }

            // update hub information using lastUJSONRPC
            if (parseTest["m"] == 0) {
                updateHubPortsInfo();
            }
            PrimeHubEventHandler();

            if (funcWithStream) {
                await funcWithStream();
            }

        }
        catch (e) {
            // don't throw error when failure of processing UJSONRPC is due to micropython
            if (lastUJSONRPC.indexOf("Traceback") == -1 && lastUJSONRPC.indexOf(">>>") == -1 && json_string.indexOf("Traceback") == -1 && json_string.indexOf(">>>") == -1) {
                if (funcAfterError != undefined) {
                    funcAfterError("Fatal Error: Please close any other window or program that is connected to your SPIKE Prime");
                }
            }
            console.log(e);
            console.log("%cTuftsCEEO ", "color: #3ba336;", "error parsing lastUJSONRPC: ", lastUJSONRPC);
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
    async function parsePacket(value, testing = false, callback) {

        // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

        // stringify the packet to look for carriage return
        var json_string = await JSON.stringify(value);

        cleanedJsonString = cleanJsonString(json_string);
        // cleanedJsonString = cleanedJsonString.replace(findNewLines,'');

        jsonline = jsonline + cleanedJsonString; // concatenate packet to data
        jsonline = jsonline.trim();

        // regex search for carriage return
        let pattern = /\\r/g;
        var carriageReIndex = jsonline.search(pattern);

        // there is at least one carriage return in this packet
        if (carriageReIndex > -1) {

            // the concatenated packets start with a left curly brace (start of JSON)
            if (jsonline[0] == "{") {

                lastUJSONRPC = jsonline.substring(0, carriageReIndex);

                // look for conjoined JSON packets: there's at least two carriage returns in jsonline
                if (jsonline.match(/\\r/g).length > 1) {

                    var conjoinedPacketsArray = jsonline.split(/\\r/); // array that split jsonline by \r

                    // last index only contains "" as it would be after \r
                    for (var i = 0; i < conjoinedPacketsArray.length ; i++) {

                        // for every JSON object in array except last, perform data handling
                        if ( i < conjoinedPacketsArray.length -1 ) {
                            lastUJSONRPC = conjoinedPacketsArray[i];

                            processFullUJSONRPC(lastUJSONRPC, json_string, testing, callback);
                        }
                        else {
                            jsonline = conjoinedPacketsArray[i];
                        }
                    }
                }
                // there are no conjoined packets in this jsonline
                else {
                    lastUJSONRPC = jsonline.substring(0, carriageReIndex);

                    processFullUJSONRPC(lastUJSONRPC, json_string, testing, callback);

                    jsonline = jsonline.substring(carriageReIndex + 2, jsonline.length);
                }

            }
            else {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline needs reset: ", jsonline);

                jsonline = jsonline.substring(carriageReIndex + 2, jsonline.length);

                console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline was reset to:" + jsonline);

                // reset jsonline for next concatenation
                // jsonline = "";
            }
        }

    }


    /**  Continuously take UJSON RPC input from SPIKE Prime
     * @private
     */
    async function streamUJSONRPC() {
        try {
            var firstReading = true;
            // read when port is set up
            while (port.readable) {

                // initialize readers
                const decoder = new TextDecoderStream();
                const readableStreamClosed = port.readable.pipeTo(decoder.writable);
                reader = decoder.readable.getReader();

                // continuously get
                while (true) {
                    try {

                        if (firstReading) {
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "##### READING FIRST UJSONRPC LINE ##### CHECKING VARIABLES");
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "jsonline: ", jsonline);
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "lastUJSONRPC: ", lastUJSONRPC);
                            firstReading = false;
                        }
                        // read UJSON RPC stream ( actual data in {value} )
                        ({ value, done } = await reader.read());

                        // log value
                        if (micropython_interpreter) {
                            console.log("%cTuftsCEEO ", "color: #3ba336;", value);
                        }

                        // console.log("%cTuftsCEEO ", "color: #3ba336;", value);

                        //concatenate UJSONRPC packets into complete JSON objects
                        if (value) {
                            parsePacket(value);
                        }
                        if (done) {
                            serviceActive = false;
                            // reader has been canceled.
                            console.log("%cTuftsCEEO ", "color: #3ba336;", "[readLoop] DONE", done);
                        }
                    }
                    // error handler
                    catch (error) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", '[readLoop] ERROR', error);

                        serviceActive = false;

                        if (funcAfterDisconnect != undefined) {
                            funcAfterDisconnect();
                        }

                        if (funcAfterError != undefined) {
                            funcAfterError("SPIKE Prime hub has been disconnected");
                        }

                        writer.close();
                        //await writer.releaseLock();
                        await writableStreamClosed;

                        reader.cancel();
                        //await reader.releaseLock();
                        await readableStreamClosed.catch(reason => { });

                        await port.close();

                        writer = undefined;
                        reader = undefined;
                        jsonline = "";
                        lastUJSONRPC = undefined;
                        json_string = undefined;
                        cleanedJsonString = undefined;

                        break; // stop trying to read
                    }
                } // end of: while (true) [reader loop]

                // release the lock
                reader.releaseLock();

            } // end of: while (port.readable) [checking if readable loop]
            console.log("%cTuftsCEEO ", "color: #3ba336;", "- port.readable is FALSE")
        } // end of: trying to open port
        catch (e) {
            serviceActive = false;
            // Permission to access a device was denied implicitly or explicitly by the user.
            console.log("%cTuftsCEEO ", "color: #3ba336;", 'ERROR trying to open:', e);
        }
    }

    /** Get the devices that are connected to each port on the SPIKE Prime
     * <p> Effect: </p>
     * <p> Modifies {ports} global variable </p>
     * <p> Modifies {hub} global variable </p>
     * @private
     */
    async function updateHubPortsInfo() {

        // if a complete ujson rpc line was read
        if (lastUJSONRPC) {
            var data_stream; //UJSON RPC info to be parsed

            //get a line from the latest JSON RPC stream and parse to devices info
            try {
                data_stream = await JSON.parse(lastUJSONRPC);
                data_stream = data_stream.p;
            }
            catch (e) {
                console.log("%cTuftsCEEO ", "color: #3ba336;", "error parsing lastUJSONRPC at updateHubPortsInfo", lastUJSONRPC);
                console.log("%cTuftsCEEO ", "color: #3ba336;", typeof lastUJSONRPC);
                console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC.p);

                if (funcAfterError != undefined) {
                    funcAfterError("Fatal Error: Please reboot the Hub and refresh this environment");
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

                        // convert the binary output to boolean for "pressed" key
                        if (Fbinary == 1) {
                            var Fboolean = true;
                        } else {
                            var Fboolean = false;
                        }
                        // execute callback from ForceSensor.wait_until_pressed() 
                        if (Fboolean) {
                            // execute call back from wait_until_pressed() if it is defined
                            funcAfterForceSensorPress !== undefined && funcAfterForceSensorPress();

                            // destruct callback function
                            funcAfterForceSensorPress = undefined;

                            // indicate that the ForceSensor was pressed
                            ForceSensorWasPressed = true;
                        }
                        // execute callback from ForceSensor.wait_until_released()
                        else {
                            // check if the Force Sensor was just released
                            if (ForceSensorWasPressed) {
                                ForceSensorWasPressed = false;
                                funcAfterForceSensorRelease !== undefined && funcAfterForceSensorRelease();
                                funcAfterForceSensorRelease = undefined;
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
                        device_value.data = { "reflected": Creflected, "color": Ccolor, "RGB": rgb_array };
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

                    var newOri = setHubOrientation(gyro);
                    // see if currently detected orientation is different from the last detected orientation
                    if (newOri !== lastHubOrientation) {
                        lastHubOrientation = newOri;

                        typeof funcAfterNewOrientation == "function" && funcAfterNewOrientation(newOri);
                        funcAfterNewOrientation = undefined;
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
    async function PrimeHubEventHandler() {

        var parsedUJSON = await JSON.parse(lastUJSONRPC);

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

                    funcAfterError("line " + lineNumberInNumber + ": " + errorType);
                }
                else {
                    funcAfterError(errorType);
                }
            }
        }
        else if (messageType == 0) {

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
            batteryAmount = parsedUJSON["p"][1];
        }
        // give center button click, left, right (?)
        else if (messageType == 3) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);
            if (parsedUJSON.p[0] == "center") {
                hubMainButton.pressed = true;

                if (parsedUJSON.p[1] > 0) {
                    hubMainButton.pressed = false;
                    hubMainButton.duration = parsedUJSON.p[1];
                }
            }
            else if (parsedUJSON.p[0] == "connect") {
                hubBluetoothButton.pressed = true;

                if (parsedUJSON.p[1] > 0) {
                    hubBluetoothButton.pressed = false;
                    hubBluetoothButton.duration = parsedUJSON.p[1];
                }
            }
            else if (parsedUJSON.p[0] == "left") {
                hubLeftButton.pressed = true;

                // execute callback for wait_until_pressed() if defined
                typeof funcAfterLeftButtonPress === "function" && funcAfterLeftButtonPress();
                funcAfterLeftButtonPress = undefined;

                if (parsedUJSON.p[1] > 0) {
                    hubLeftButton.pressed = false;
                    hubLeftButton.duration = parsedUJSON.p[1];

                    // execute callback for wait_until_released() if defined
                    typeof funcAfterLeftButtonRelease === "function" && funcAfterLeftButtonRelease();
                    funcAfterLeftButtonRelease = undefined;
                }

            }
            else if (parsedUJSON.p[0] == "right") {
                hubRightButton.pressed = true;

                // execute callback for wait_until_pressed() if defined
                typeof funcAfterRightButtonPress === "function" && funcAfterRightButtonPress();
                funcAfterRightButtonPress = undefined;

                if (parsedUJSON.p[1] > 0) {
                    hubRightButton.pressed = false;
                    hubRightButton.duration = parsedUJSON.p[1];

                    // execute callback for wait_until_released() if defined
                    typeof funcAfterRightButtonRelease === "function" && funcAfterRightButtonRelease();
                    funcAfterRightButtonRelease = undefined;
                }
            }

        }
        // gives orientation of the hub (leftside, up,..), tapping of hub, 
        else if (messageType == 4) {
            /* this data stream is about hub orientation */

            var newOrientation = parsedUJSON.p;
            if (newOrientation == "1") {
                lastHubOrientation = "up";
            }
            else if (newOrientation == "4") {
                lastHubOrientation = "down";
            }
            else if (newOrientation == "0") {
                lastHubOrientation = "front";
            }
            else if (newOrientation == "3") {
                lastHubOrientation = "back";
            }
            else if (newOrientation == "2") {
                lastHubOrientation = "leftSide";
            }
            else if (newOrientation == "5") {
                lastHubOrientation = "rightSide";
            }

            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);
        }
        else if (messageType == 7) {
            if (funcAfterPrint != undefined) {
                funcAfterPrint(">>> Program started!");
            }
        }
        else if (messageType == 8) {
            if (funcAfterPrint != undefined) {
                funcAfterPrint(">>> Program finished!");
            }
        }
        else if (messageType == 9) {
            var encodedName = parsedUJSON["p"];
            var decodedName = atob(encodedName);
            hubName = decodedName;

            if (triggerCurrentStateCallback != undefined) {
                triggerCurrentStateCallback();
            }
        }
        else if (messageType == 11) {
            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);
        }
        else if (messageType == 14) {
            var newGesture = parsedUJSON.p;

            if (newGesture == "3") {
                hubGesture = "freefall";
                hubGestures.push(newGesture);
            }
            else if (newGesture == "2") {
                hubGesture = "shake";
                hubGestures.push("shaken"); // the string is different at higher level
            }
            else if (newGesture == "1") {
                hubFrontEvent = "tapped";
                hubGestures.push(newGesture);
            }
            else if (newGesture == "0") {
                hubFrontEvent = "doubletapped";
                hubGestures.push(newGesture);
            }

            // execute funcAfterNewGesture callback that was taken at wait_for_new_gesture()
            if (typeof funcAfterNewGesture === "function") {
                funcAfterNewGesture(newGesture);
                funcAfterNewGesture = undefined;
            }

            console.log("%cTuftsCEEO ", "color: #3ba336;", lastUJSONRPC);

        }
        else if (messageType == "userProgram.print") {
            var printedMessage = parsedUJSON["p"]["value"];
            var NLindex = printedMessage.search(/\\n/);
            printedMessage = await printedMessage.substring(0, NLindex);

            console.log("%cTuftsCEEO ", "color: #3ba336;", atob(printedMessage));

            // execute function after print if defined
            if (funcAfterPrint != undefined) {
                funcAfterPrint(atob(printedMessage));
            }
        }
        else {

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
            if (getFirmwareInfoCallback != undefined) {
                if (getFirmwareInfoCallback[0] == parsedUJSON["i"]) {
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
                    getFirmwareInfoCallback[1](stringVersion);
                }
            }

            console.log("%cTuftsCEEO ", "color: #3ba336;", "received response: ", lastUJSONRPC);

            // iterate over responseCallbacks global variable
            for (var index in responseCallbacks) {

                var currCallbackInfo = responseCallbacks[index];

                // check if the message id of UJSONRPC corresponds to that of a response callback
                if (currCallbackInfo[0] == parsedUJSON["i"]) {

                    var response = "null";

                    if (parsedUJSON["r"] == 0) {
                        response = "done";
                    }
                    else if (parsedUJSON["r"] == 2) {
                        response = "stalled";
                    }

                    // execute callback with the response
                    currCallbackInfo[1](response);

                    // empty the index of which callback that was just executed
                    responseCallbacks[index] = undefined;
                }
            }

            // execute the callback function after sending start_write_program UJSONRPC
            if (startWriteProgramCallback != undefined) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "startWriteProgramCallback is defined. Looking for matching mesasage id...")

                // check if the message id of UJSONRPC corresponds to that of a response callback
                if (startWriteProgramCallback[0] == parsedUJSON["i"]) {

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "matching message id detected with startWriteProgramCallback[0]: ", startWriteProgramCallback[0])

                    // get the information for the packet sending
                    var blocksize = parsedUJSON["r"]["blocksize"]; // maximum size of each packet to be sent in bytes
                    var transferid = parsedUJSON["r"]["transferid"]; // id to use for transferring this program

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "executing writePackageFunc expecting transferID of ", transferid);

                    // execute callback
                    await startWriteProgramCallback[1](blocksize, transferid);

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "deallocating startWriteProgramCallback");

                    // deallocate callback
                    startWriteProgramCallback = undefined;
                }

            }

            // check if the program should write packages for a program
            if (writePackageInformation != undefined) {

                console.log("%cTuftsCEEO ", "color: #3ba336;", "writePackageInformation is defined. Looking for matching mesasage id...")

                // check if the message id of UJSONRPC corresponds to that of the first write_package script that was sent
                if (writePackageInformation[0] == parsedUJSON["i"]) {

                    console.log("%cTuftsCEEO ", "color: #3ba336;", "matching message id detected with writePackageInformation[0]: ", writePackageInformation[0]);

                    // get the information for the package sending process
                    var remainingData = writePackageInformation[1];
                    var transferID = writePackageInformation[2];
                    var blocksize = writePackageInformation[3];

                    // the size of the remaining data to send is less than or equal to blocksize
                    if (remainingData.length <= blocksize) {
                        console.log("%cTuftsCEEO ", "color: #3ba336;", "remaining data's length is less than or equal to blocksize");

                        // the size of remaining data is not zero
                        if (remainingData.length != 0) {

                            var dataToSend = remainingData.substring(0, remainingData.length);

                            console.log("%cTuftsCEEO ", "color: #3ba336;", "reminaing data's length is not zero, sending entire remaining data: ", dataToSend);

                            var base64data = btoa(dataToSend);

                            UJSONRPC.writePackage(base64data, transferID);

                            console.log("%cTuftsCEEO ", "color: #3ba336;", "deallocating writePackageInforamtion")

                            if (writeProgramCallback != undefined) {

                                writeProgramCallback();
                            }


                            writePackageInformation = undefined;
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

                        writePackageInformation = [messageid, remainingData, transferID, blocksize];
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
    function setHubOrientation(gyro) {
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
            newOrientation = "leftSide";
        }
        else if (gyro[0] < -500) {
            newOrientation = "rightSide";
        }

        return newOrientation;
    }

    // public members
    return {
        init: init,
        sendDATA: sendDATA,
        rebootHub: rebootHub,
        reachMicroPy: reachMicroPy,
        executeAfterInit: executeAfterInit,
        executeAfterPrint: executeAfterPrint,
        executeAfterError: executeAfterError,
        executeAfterDisconnect: executeAfterDisconnect,
        executeWithStream: executeWithStream,
        getPortsInfo: getPortsInfo,
        getPortInfo: getPortInfo,
        getBatteryStatus: getBatteryStatus,
        getFirmwareInfo: getFirmwareInfo,
        getHubInfo: getHubInfo,
        getHubName: getHubName,
        getProjects: getProjects,
        isActive: isActive,
        getBigMotorPorts: getBigMotorPorts,
        getSmallMotorPorts: getSmallMotorPorts,
        getUltrasonicPorts: getUltrasonicPorts,
        getColorPorts: getColorPorts,
        getForcePorts: getForcePorts,
        getMotorPorts: getMotorPorts,
        getMotors: getMotors,
        getDistanceSensors: getDistanceSensors,
        getColorSensors: getColorSensors,
        getForceSensors: getForceSensors,
        getLatestUJSON: getLatestUJSON,
        getBluetoothButton: getBluetoothButton,
        getMainButton: getMainButton,
        getLeftButton: getLeftButton,
        getRightButton: getRightButton,
        getHubGesture: getHubGesture,
        getHubEvent: getHubEvent,
        getHubOrientation: getHubOrientation,
        Motor: Motor,
        PrimeHub: PrimeHub,
        ForceSensor: ForceSensor,
        DistanceSensor: DistanceSensor,
        ColorSensor: ColorSensor,
        MotorPair: MotorPair,
        writeProgram: writeProgram,
        stopCurrentProgram: stopCurrentProgram,
        executeProgram: executeProgram
    };
}
