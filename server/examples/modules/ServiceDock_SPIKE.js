/*
Project Name: SPIKE Prime Web Interface
File name: ServiceDock_SPIKE.js
Author: Jeremy Jung
Last update: 7/19/20
Description: HTML Element definition for <service-spike> to be used in ServiceDocks
Credits/inspirations:
History:
    Created by Jeremy on 7/16/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

// import { Service_SPIKE } from "./Service_SPIKE.js";

class servicespike extends HTMLElement {   

    constructor () {
        super();

        this.active = false; // whether the service was activated
        this.service = new Service_SPIKE(); // instantiate a service object ( one object per button )

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

        var imageRelPath = "./modules/views/four.png" // relative to the document in which a servicespike is created ( NOT this file )
        var length = 50; // for width and height of button
        var buttonBackgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background: url(" + imageRelPath + ") no-repeat; background-size: 40px 40px; background-color:" + buttonBackgroundColor
            + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        var status = document.createElement("div");
        status.setAttribute("class", "status");
        var length = 20; // for width and height of circle
        var statusBackgroundColor = "red" // default background color of service (inactive color)
        var posLeft = 30;
        var posTop = 20;
        var statusStyle = "border-radius: 50%; height:" + length + "px; width:" + length + "px; background-color:" + statusBackgroundColor +
            "; position: relative; left:" + posLeft + "px; top:" + posTop + "px;";
        status.setAttribute("style", statusStyle);

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
            if (!this.active) {
                console.log("activating service");
                var initSuccessful = await this.service.init();
                if (initSuccessful) {
                    this.active = true;
                    status.style.backgroundColor = "green";
                }
                // var checkConnection = setInterval(function () {
                //     if (!service.isActive()) {
                //         clearInterval(checkConnection);
                //         status.style.backgroundColor = "red";
                //     }
                // }, 5000)
            } 
        });


        shadow.appendChild(wrapper);
        button.appendChild(status);
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
    
    // initialize the service (is not used in this class but available for use publicly)
    async init() {
        var initSuccess = await this.service.init();
        if (initSuccess) {
            return true;
        }
        else {
            return false;
        }
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
    let readFrom = 0;

    // object containing real-time info on devices connected to each port of SPIKE Prime 
    let ports =
    {
        "A": { "device": "none", "data": {} },
        "B": { "device": "none", "data": {} },
        "C": { "device": "none", "data": {} },
        "D": { "device": "none", "data": {} },
        "E": { "device": "none", "data": {} },
        "F": { "device": "none", "data": {} }
    }

    // object containing real-time info on hub sensor values
    /*
        !say the usb wire is the nose of the spike prime

        ( looks at which side of the hub is facing up)
        gyro[0] - top/bottom detector ( top: 1000, bottom: -1000, neutral: 0)
        gyro[1] - rightside/leftside detector ( leftside : -1000 , rightside: 1000, neutal: 0 )
        gyro[2] - front/back detector ( front: 1000, back: 1000, neutral: 0 )

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
        "gyro": [0,0,0],
        "accel": [0,0,0],
        "pos": [0,0,0]
    }

    // string containing real-time info on hub events
    let hubFrontEvent;
    
    /*
        up: hub is upright/standing, with the display looking horizontally
        down: hub is upsidedown with the display, with the display looking horizontally
        front: hub's display facing towards the sky
        back: hub's display facing towards the earth
        leftside: hub rotated so that the side to the left of the display is facing the earth
        rightside: hub rotated so that the side to the right of the display is facing the earth
        shake:
    */
    let hubOrientation; 

    /*
        shake
        freefall
    */
    let hubEvent;

    let hubMainButton = {"pressed": false, "duration": 0};

    let hubBluetoothButton = { "pressed": false, "duration": 0 };

    let hubLeftButton = { "pressed": false, "duration": 0 };

    let hubRightButton = { "pressed": false, "duration": 0 };




    var micropython_interpreter = false; // whether micropython was reached or not

    let serviceActive = false; //serviceActive flag

    var funcAtInit = undefined; // function to call after init

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize SPIKE_service
    *
    * Parameter:
    * 
    * Effect:
    * - Makes prompt in Google Chrome ( Google Chrome Browser needs "Experimental Web Interface" enabled)
    * - Starts streaming UJSONRPC
    * 
    * Note:
    * - this function needs to be executed after executeAfterInit but before all other public functions
    */
    async function init() {
        // initialize web serial connection
        var webSerialConnected = await initWebSerial();

        if (webSerialConnected) {
            // start streaming UJSONRPC
            streamUJSONRPC();
            serviceActive = true;
            
            await sleep(2000); // wait for service to init
            
            // call funcAtInit if defined
            if ( funcAtInit !== undefined ) {
                funcAtInit();
            }
            return true;
        }
        else {
            return false;
        }
    }

    /* executeAfterInit() - get the callback function to execute after service is initialized
    *
    * Parameter:
    * {callback} (function) - function to execute after initialization
    * Effect:
    * - assigns global variable funcAtInit a pointer to callback function
    *
    * Note:
    * This function needs to be executed before calling init()
    */
    function executeAfterInit(callback) {
        funcAtInit = callback;
    }

    /* sendDATA() - send command to the SPIKE Prime (UJSON RPC or Micropy depending on current interpreter)
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

        // send it in micropy if micropy reached
        if (micropython_interpreter) {
            
            for (var i = 0; i < commands.length; i++) {
                console.log("commands.length", commands.length)

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
    * ports.{yourPortLetter}.data --returns--> device info (ex. {"speed": 0, "angle":0, "uAngle": 0, "power":0} ) 
    *
    * MOTOR_INFO (smallMotor/bigMotor) = { "speed": motor speed, 
    *               "angle": motor angle , 
    *               "uAngle": motor angle in unit circle ( -180 ~ 180 ), 
    *               "power": motor power }
    * 
    * ULTRASONIC_INFO (ultrasonic) = { "distance": distance from surface }
    * 
    * COLOR_SENSOR_INFO (color) = { "reflected": reflected luminosity,
    *                       "ambient": ambient luminosity, 
    *                       "RGB": [R, G, B] }
    * 
    * FORCE_SENSOR_INFO (force) = { "force": pressed force amount ( 1 ~ 10 ), 
    *                       "pressed": whether pressed or not ( true or false), 
    *                       "forceSensitive": a more sesntiive pressed force amount ( 0 ~ 900 ) }
    */
    async function getPortsInfo() {
        return ports;
    }

    /* getPortInfo() - get the info of a single port
    *
    * Parameter:
    * {letter} - letter of the port to retrieve data from
    * Returns:
    * {port[leter]} (object/dictionary) - an object with keys as device and info
    */
    async function getPortInfo(letter) {
        return ports[letter];
    }

    /* getHubInfo() - get info of the hub
    *
    * Returns:
    * {hub} (object/dict) - includes info of the hub
    */
    async function getHubInfo() {
        return hub;
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

    /* isActive() - get whether the Service was initialized or not
    *
    * Returns:
    * {serviceActive} (boolean) - whether Service was initialized or not
    */
    function isActive() {
        return serviceActive;
    }

    async function getHubOrientation() {
        return hubOrientation;
    }

    async function getHubFrontEvent() {
        return hubFrontEvent;
    }

    async function getHubEvent() {
        return hubEvent;
    }

    async function getBluetoothButton() {
        return hubBluetoothButton;
    }

    async function getMainButton() {
        return hubMainButton;
    }

    async function getLeftButton() {
        return hubLeftButton;
    }

    async function getRightButton() {
        return hubRightButton;
    }

    //////////////////////////////////////////
    //                                      //
    //          UJSONRPC Functions          //
    //                                      //
    //////////////////////////////////////////

    async function displayText(text) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.display_text", "p": {"text":' + '"' + text + '"' + '} }'
        sendDATA(command);
    }

    async function displaySetPixel(x, y, brightness) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.display_set_pixel", "p": {"x":' + x +
            ', "y":' + y + ', "brightness":' + brightness + '} }';
        sendDATA(command);
    }

    async function displayClear() {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.display_clear" }';
        sendDATA(command);
    }

    async function motorStart(port, speed, stall) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.motor_start", "p": {"port":' + '"' + port + '"' +
            ', "speed":' + speed + ', "stall":' + stall + '} }';
        sendDATA(command);
    }

    async function motorGoRelPos(port, position, speed) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.motor_go_to_relative_position"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "position":' + position +
            ', "speed":' + speed +
            ', "stall":' + 0 +
            ', "stop":' + 0 +
            '} }';
        sendDATA(command);
    }

    async function motorRunTimed(port, time, speed) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.motor_run_timed"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "time":' + time +
            ', "speed":' + speed +
            ', "stall":' + 0 +
            ', "stop":' + 0 +
            '} }';
        sendDATA(command);
    }

    async function motorRunDegrees(port, degrees, speed) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.motor_run_for_degrees"' +
            ', "p": {' +
            '"port":' + '"' + port + '"' +
            ', "degrees":' + degrees +
            ', "speed":' + speed +
            ', "stall":' + 0 +
            ', "stop":' + 0 +
            '} }';
        sendDATA(command);
    }

    async function moveTankTime(time, lspeed, rspeed, lmotor, rmotor, stop) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.move_tank_time"' +
            ', "p": {' +
            '"time":' + time + 
            ', "lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' + 
            ', "rmotor":' + '"' + rmotor + '"' + 
            ', "stop":' + stop   +
            '} }';
        sendDATA(command);
    }

    async function moveTankDegrees(degrees, lspeed, rspeed, lmotor, rmotor, stop) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.move_tank_degrees"' +
            ', "p": {' +
            '"degrees":' + degrees + 
            ', "lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' + 
            ', "rmotor":' + '"' + rmotor + '"' + 
            ', "stop":' + stop +
            '} }';
        sendDATA(command);
    }

    async function moveTankSpeeds(lspeed, rspeed, lmotor, rmotor) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.move_start_speeds"' +
            ', "p": {' +
            '"lspeed":' + lspeed +
            ', "rspeed":' + rspeed +
            ', "lmotor":' + '"' + lmotor + '"' + 
            ', "rmotor":' + '"' + rmotor + '"' + 
            '} }';
        sendDATA(command);
    }

    async function moveTankPowers(lpower, rpower, lmotor, rmotor) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.move_start_powers"' +
            ', "p": {' +
            '"lpower":' + lpower +
            ', "rpower":' + rpower +
            ', "lmotor":' + '"' + lmotor + '"' + 
            ', "rmotor":' + '"' +  rmotor + '"' + 
            '} }';
        sendDATA(command);
    }

    async function soundBeep(volume, note) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.sound_beep"' +
            ', "p": {' +
            '"volume":' + volume +
            ', "note":' + note +
            '} }';
        sendDATA(command);
    }

    async function soundStop(volume, note) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId +
            ', "m": "scratch.sound_off"' +
            '}';
        sendDATA(command);
    }


    async function motorPwm(port, power, stall) {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "scratch.motor_pwm", "p": {"port":' + '"' + port + '"' +
            ', "power":' + power + ', "stall":' + stall + '} }';
        sendDATA(command);
    }

    async function getFirmwareInfo() {
        var randomId = Math.floor((Math.random() * 10000));
        var command = '{"i":' + randomId + ', "m": "get_firmware_info" ' + '}';
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
    * - Modifies {hub} global variable
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
                console.log("error parsing one_Line at updatePortsInfo", one_line);
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
                        if ( Fbinary == 1 ) {
                            var Fboolean = true;
                        } else {
                            var Fboolean = false;
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
                        var Cambient = await data_stream[key][1][1];
                        var Cr = await data_stream[key][1][2];
                        var Cg = await data_stream[key][1][3];
                        var Cb = await data_stream[key][1][4];
                        var rgb_array = [Cr, Cg, Cb];

                        // populate value object
                        device_value.device = "color";
                        device_value.data = { "reflected": Creflected, "ambient": Cambient, "RGB": rgb_array };
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

    /* getLatestUJSON() - get the latest complete line of UJSON RPC from stream 
    * 
    * Effect:
    * Logs in the console when some particular messages are caught
    * Assigns the hub events global variables
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
            // give center button click, left, right (?)
            else if (result["m"] == 3) {
                console.log(one_line);
                if (result.p[0] == "center") {
                    hubMainButton.pressed = true;
                    if (result.p[1] > 0) {
                        hubMainButton.pressed = false;
                        hubMainButton.duration = result.p[1];
                    }
                }
                else if (result.p[0] == "connect") {
                    hubBluetoothButton.pressed = true;
                    if (result.p[1] > 0) {
                        hubBluetoothButton.pressed = false;
                        hubBluetoothButton.duration = result.p[1];
                    }
                }
                else if (result.p[0] == "left") {
                    hubLeftButton.pressed = true;
                    if (result.p[1] > 0) {
                        hubLeftButton.pressed = false;
                        hubLeftButton.duration = result.p[1];
                    }
                }
                else if (result.p[0] == "right") {
                    hubRightButton.pressed = true;
                    if (result.p[1] > 0) {
                        hubRightButton.pressed = false;
                        hubRightButton.duration = result.p[1];
                    }
                }
                
            }
            else if (result["m"] == 11) {
                console.log(one_line);
            }
            // gives orientation of the hub (leftside, up,..), tapping of hub, 
            else if (result["m"] == 4) {
                if ( result.p == "tapped" ) {
                    hubFrontEvent = "tapped";
                }
                else if ( result.p == "doubletapped") {
                    hubFrontEvent = "doubletapped";
                }
                else if (result.p == "up") {
                    hubOrientation = "up";
                }
                else if (result.p == "down") {
                    hubOrientation = "down";
                }
                else if (result.p == "front") {
                    hubOrientation = "front";
                }
                else if (result.p == "back") {
                    hubOrientation = "back";
                }
                else if (result.p == "freefall") {
                    hubEvent = "freefall";
                }
                else if (result.p == "shake") {
                    hubEvent = "shake";
                }
                console.log(one_line);
            }
            else {
                hubEvent = "";
                hubFrontEvent = "";
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
                //filters: [filter]
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
                            var rcb_index = json_string.indexOf('}', readFrom)
                            var lcb_index = json_string.indexOf('{')

                            // if the right curly brace exists (end of json)
                            if (rcb_index > -1) {
                                if (json_string.substring(rcb_index-1,rcb_index) != '{') {
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
                                    readFrom = 0;
                                }
                                else {
                                    readFrom = jsonline.length - json_string.length + rcb_index+1;
                                    console.log("jsonline", jsonline);
                                    console.log("reading from", JSON.stringify(jsonline).substring(readFrom, jsonline.length));
                                }
                            }
                        }
                        if (done) {
                            serviceActive = false;
                            // reader has been canceled.
                            console.log("[readLoop] DONE", done);
                        }
                    }
                    // error handler
                    catch (error) {
                        serviceActive = false;
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
            serviceActive = false;
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
        executeAfterInit: executeAfterInit,
        getPortsInfo: getPortsInfo,
        getPortInfo: getPortInfo,
        getHubInfo: getHubInfo,
        displayText: displayText,
        displayClear: displayClear,
        soundStop: soundStop, 
        soundBeep: soundBeep, 
        motorRunDegrees: motorRunDegrees, 
        motorRunTimed: motorRunTimed, 
        motorGoRelPos: motorGoRelPos, 
        displaySetPixel: displaySetPixel,
        motorStart: motorStart,
        getFirmwareInfo: getFirmwareInfo,
        motorPwm: motorPwm,
        moveTankDegrees: moveTankDegrees,
        moveTankSpeeds: moveTankSpeeds,
        moveTankTime: moveTankTime,
        moveTankPowers: moveTankPowers,
        isActive: isActive,
        getLatestUJSON: getLatestUJSON,
        getBluetoothButton: getBluetoothButton,
        getMainButton: getMainButton,
        getLeftButton: getLeftButton,
        getRightButton: getRightButton,
        getHubEvent: getHubEvent,
        getHubFrontEvent: getHubFrontEvent,
        getHubOrientation: getHubOrientation
    };
}