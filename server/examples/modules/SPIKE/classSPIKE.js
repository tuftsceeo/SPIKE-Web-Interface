Service_SPIKE = function () {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    /* private members */

    this.VENDOR_ID = 0x0694; // LEGO SPIKE Prime Hub

    // common characters to send (for REPL/uPython on the Hub)
    this.CONTROL_C = '\x03'; // CTRL-C character (ETX character)
    this.CONTROL_D = '\x04'; // CTRL-D character (EOT character)
    this.RETURN = '\x0D';	// RETURN key (enter, new line)

    /* using this filter in webserial setup will only take serial ports*/
    this.filter = {
        usbVendorId: this.VENDOR_ID
    };

    // define for communication
    this.port;
    this.reader;
    this.writer;
    this.value;
    this.done;
    this.writableStreamClosed;

    //define for json concatenation
    this.jsonline = "";

    // contains latest full json object from SPIKE readings
    this.lastUJSONRPC;

    // object containing real-time info on devices connected to each port of SPIKE Prime 
    this.ports =
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
    this.hub =
    {
        "gyro": [0, 0, 0],
        "accel": [0, 0, 0],
        "pos": [0, 0, 0]
    }

    this.batteryAmount = 0; // battery [0-100]

    // string containing real-time info on hub events
    this.hubFrontEvent;

    /*
        up: hub is upright/standing, with the display looking horizontally
        down: hub is upsidedown with the display, with the display looking horizontally
        front: hub's display facing towards the sky
        back: hub's display facing towards the earth
        leftside: hub rotated so that the side to the left of the display is facing the earth
        rightside: hub rotated so that the side to the right of the display is facing the earth
    */
    this.lastHubOrientation; //PrimeHub orientation read from caught UJSONRPC 

    /*
        shake
        freefall
    */
    this.hubGesture;

    // 
    this.hubMainButton = { "pressed": false, "duration": 0 };

    this.hubBluetoothButton = { "pressed": false, "duration": 0 };

    this.hubLeftButton = { "pressed": false, "duration": 0 };

    this.hubRightButton = { "pressed": false, "duration": 0 };

    /* PrimeHub data storage arrays for was_***() functions */
    this.hubGestures = []; // array of hubGestures run since program started or since was_gesture() ran
    this.hubButtonPresses = [];
    this.hubName = undefined;
    this.lastDetectedColor = undefined;

    /* SPIKE Prime Projects */

    this.hubProjects = {
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

    this.colorDictionary = {
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
    this.ForceSensorWasPressed = false;

    this.micropython_interpreter = false; // whether micropython was reached or not

    this.serviceActive = false; //serviceActive flag

    this.waitForNewOriFirst = true; //whether the wait_for_new_orientation method would be the first time called

    /* stored callback functions from wait_until functions and etc. */

    this.funcAtInit = undefined; // function to call after init of SPIKE Service

    this.funcAfterNewGesture = undefined;
    this.funcAfterNewOrientation = undefined;

    this.funcAfterLeftButtonPress = undefined;
    this.funcAfterLeftButtonRelease = undefined;
    this.funcAfterRightButtonPress = undefined;
    this.funcAfterRightButtonRelease = undefined;

    this.funcAfterNewColor = undefined;

    this.waitUntilColorCallback = undefined; // [colorToDetect, function to execute]
    this.waitForDistanceFartherThanCallback = undefined; // [distance, function to execute]
    this.waitForDistanceCloserThanCallback = undefined; // [distance, function to execute]

    this.funcAfterForceSensorPress = undefined;
    this.funcAfterForceSensorRelease = undefined;

    /* array that holds the pointers to callback functions to be executed after a UJSONRPC response */
    this.responseCallbacks = [];

    // array of information needed for writing program
    this.startWriteProgramCallback = undefined; // [message_id, function to execute ]
    this.writePackageInformation = undefined; // [ message_id, remaining_data, transfer_id, blocksize]
    this.writeProgramCallback = undefined; // callback function to run after a program was successfully written
    this.writeProgramSetTimeout = undefined; // setTimeout object for looking for response to start_write_program

    /* callback functions added for Coding Rooms */

    this.getFirmwareInfoCallback = undefined;

    this.funcAfterPrint = undefined; // function to call for SPIKE python program print statements or errors
    this.funcAfterError = undefined; // function to call for errors in ServiceDock

    this.funcAfterDisconnect = undefined; // function to call after SPIKE Prime is disconnected

    this.funcWithStream = undefined; // function to call after every parsed UJSONRPC package

    this.triggerCurrentStateCallback = undefined;   
    
    // namespace for all UJSONRPC scripts
    // this.UJSONRPC = this.UJSONRPC.bind(this);
}