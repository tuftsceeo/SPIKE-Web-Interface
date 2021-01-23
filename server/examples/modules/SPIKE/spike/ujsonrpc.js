Service_SPIKE.UJSONRPC = {};

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} text 
 */
Service_SPIKE.UJSONRPC.prototype.displayText = async function displayText(text) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_text", "p": {"text":' + '"' + text + '"' + '} }'
    this.sendDATA(command);
}

/**
 * @memberof! UJSONRPC
 * @param {integer} x [0 to 4]
 * @param {integer} y [0 to 4]
 * @param {integer} brightness [1 to 100]
 */
Service_SPIKE.UJSONRPC.prototype.displaySetPixel = async function displaySetPixel(x, y, brightness) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_set_pixel", "p": {"x":' + x +
        ', "y":' + y + ', "brightness":' + brightness + '} }';
    this.sendDATA(command);
}

/**
 * @memberof! UJSONRPC
 */
Service_SPIKE.UJSONRPC.prototype.displayClear = async function displayClear() {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_clear" }';
    this.sendDATA(command);
}

/**
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {array} array [1-100,1-100,1-100,1-100] array of size 4
 */
Service_SPIKE.UJSONRPC.prototype.ultrasonicLightUp = async function ultrasonicLightUp(port, array) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.ultrasonic_light_up", "p": {' +
        '"port": ' + '"' + port + '"' +
        ', "lights": ' + '[' + array + ']' +
        '} }';
    this.sendDATA(command);
}

/**
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {integer} speed 
 * @param {integer} stall 
 */
Service_SPIKE.UJSONRPC.prototype.motorStart = async function motorStart(port, speed, stall) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_start", "p": {"port":'
        + '"' + port + '"' +
        ', "speed":' + speed +
        ', "stall":' + stall +
        '} }';
    this.sendDATA(command);
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
Service_SPIKE.UJSONRPC.prototype.motorGoRelPos = async function motorGoRelPos(port, position, speed, stall, stop, callback) {
    console.log("this in motorGoRelPos: ", this);
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.motor_go_to_relative_position"' +
        ', "p": {' +
        '"port":' + '"' + port + '"' +
        ', "position":' + position +
        ', "speed":' + speed +
        ', "stall":' + stall +
        ', "stop":' + stop +
        '} }';

    if (callback != undefined) {
        this.pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);
}

Service_SPIKE.UJSONRPC.prototype.motorGoDirToPosition = async function motorGoDirToPosition(port, position, direction, speed, stall, stop, callback) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.motor_go_direction_to_position"' +
        ', "p": {' +
        '"port":' + '"' + port + '"' +
        ', "position":' + position +
        ', "direction":' + direction +
        ', "speed":' + speed +
        ', "stall":' + stall +
        ', "stop":' + stop +
        '} }';

    if (callback != undefined) {
        pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);

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
Service_SPIKE.UJSONRPC.prototype.motorRunTimed = async function motorRunTimed(port, time, speed, stall, stop, callback) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.motor_run_timed"' +
        ', "p": {' +
        '"port":' + '"' + port + '"' +
        ', "time":' + time +
        ', "speed":' + speed +
        ', "stall":' + stall +
        ', "stop":' + stop +
        '} }';
    if (callback != undefined) {
        pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);
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
Service_SPIKE.UJSONRPC.prototype.motorRunDegrees = async function motorRunDegrees(port, degrees, speed, stall, stop, callback) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.motor_run_for_degrees"' +
        ', "p": {' +
        '"port":' + '"' + port + '"' +
        ', "degrees":' + degrees +
        ', "speed":' + speed +
        ', "stall":' + stall +
        ', "stop":' + stop +
        '} }';
    if (callback != undefined) {
        pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);
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
Service_SPIKE.UJSONRPC.prototype.moveTankTime = async function moveTankTime(time, lspeed, rspeed, lmotor, rmotor, stop, callback) {
    var randomId = this.generateId();
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
    if (callback != undefined) {
        pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);
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
Service_SPIKE.UJSONRPC.prototype.moveTankDegrees = async function moveTankDegrees(degrees, lspeed, rspeed, lmotor, rmotor, stop, callback) {
    var randomId = this.generateId();
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
    if (callback != undefined) {
        pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);
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
Service_SPIKE.UJSONRPC.prototype.moveTankSpeeds = async function moveTankSpeeds(lspeed, rspeed, lmotor, rmotor, callback) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.move_start_speeds"' +
        ', "p": {' +
        '"lspeed":' + lspeed +
        ', "rspeed":' + rspeed +
        ', "lmotor":' + '"' + lmotor + '"' +
        ', "rmotor":' + '"' + rmotor + '"' +
        '} }';
    if (callback != undefined) {
        pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);
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
Service_SPIKE.UJSONRPC.prototype.moveTankPowers = async function moveTankPowers(lpower, rpower, lmotor, rmotor, callback) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.move_start_powers"' +
        ', "p": {' +
        '"lpower":' + lpower +
        ', "rpower":' + rpower +
        ', "lmotor":' + '"' + lmotor + '"' +
        ', "rmotor":' + '"' + rmotor + '"' +
        '} }';
    if (callback != undefined) {
        pushResponseCallback(randomId, callback);
    }
    this.sendDATA(command);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {integer} volume 
 * @param {integer} note 
 */
Service_SPIKE.UJSONRPC.prototype.soundBeep = async function soundBeep(volume, note) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.sound_beep"' +
        ', "p": {' +
        '"volume":' + volume +
        ', "note":' + note +
        '} }';
    this.sendDATA(command);
}

/**
 * @memberof! UJSONRPC
 */
Service_SPIKE.UJSONRPC.prototype.soundStop = async function soundStop() {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.sound_off"' +
        '}';
    this.sendDATA(command);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {integer} power 
 * @param {integer} stall 
 */
Service_SPIKE.UJSONRPC.prototype.motorPwm = async function motorPwm(port, power, stall) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_pwm", "p": {"port":' + '"' + port + '"' +
        ', "power":' + power + ', "stall":' + stall + '} }';
    this.sendDATA(command);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {function} callback
 */
Service_SPIKE.UJSONRPC.prototype.getFirmwareInfo = async function getFirmwareInfo(callback) {
    var randomId = this.generateId();

    var command = '{"i":' + '"' + randomId + '"' + ', "m": "get_hub_info" ' + '}';
    this.sendDATA(command);
    if (callback != undefined) {
        getFirmwareInfoCallback = [randomId, callback];
    }
}

/**
 * @memberof! UJSONRPC
 * @param {function} callback 
 */
Service_SPIKE.UJSONRPC.prototype.triggerCurrentState = async function triggerCurrentState(callback) {
    var randomId = this.generateId();

    var command = '{"i":' + '"' + randomId + '"' + ', "m": "trigger_current_state" ' + '}';
    this.sendDATA(command);
    if (callback != undefined) {
        triggerCurrentStateCallback = callback;
    }
}

/** 
 * 
 * @memberof! UJSONRPC
 * @param {integer} slotid 
 */
Service_SPIKE.UJSONRPC.prototype.programExecute = async function programExecute(slotid) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "program_execute", "p": {"slotid":' + slotid + '} }';
    this.sendDATA(command);
}

/**
 * @memberof! UJSONRPC
 */
Service_SPIKE.UJSONRPC.prototype.programTerminate = function programTerminate() {

    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "program_terminate"' +
        '}';

    this.sendDATA(command);
}

/**
 * @memberof! UJSONRPC
 * @param {string} projectName name of the project
 * @param {integer} type type of data (micropy or scratch)
 * @param {string} data entire data to send in ASCII
 * @param {integer} slotid slot to which to assign the program
 */
Service_SPIKE.UJSONRPC.prototype.startWriteProgram = async function startWriteProgram(projectName, type, data, slotid) {

    console.log("%cTuftsCEEO ", "color: #3ba336;", "in startWriteProgram...");
    console.log("%cTuftsCEEO ", "color: #3ba336;", "constructing start_write_program script...");

    if (type == "python") {
        var typeInt = 0;
    }

    // construct the UJSONRPC packet to start writing program

    var dataSize = (new TextEncoder().encode(data)).length;

    var randomId = this.generateId();

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

    this.sendDATA(command);

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

                Service_SPIKE.UJSONRPC.prototype.writePackage(base64data, transferid); // send the packet

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

            var msgID = Service_SPIKE.UJSONRPC.prototype.writePackage(base64data, transferid); // send the packet

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
Service_SPIKE.UJSONRPC.prototype.writePackage = function writePackage(base64data, transferid) {

    var randomId = this.generateId();
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
Service_SPIKE.UJSONRPC.prototype.getStorageStatus = function getStorageStatus() {

    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "get_storage_status"' +
        '}';

    this.sendDATA(command);

}

/**
 * @memberof! UJSONRPC
 * @param {string} slotid 
 */
Service_SPIKE.UJSONRPC.prototype.removeProject = function removeProject(slotid) {

    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "remove_project", "p": {' +
        '"slotid": ' + slotid +
        '} }';

    this.sendDATA(command);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} oldslotid 
 * @param {string} newslotid 
 */
Service_SPIKE.UJSONRPC.prototype.moveProject = function moveProject(oldslotid, newslotid) {

    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "move_project", "p": {' +
        '"old_slotid": ' + oldslotid +
        ', "new_slotid: ' + newslotid +
        '} }';

    this.sendDATA(command);

}

Service_SPIKE.UJSONRPC.prototype.centerButtonLightUp = function centerButtonLightUp(color) {
    var randomId = this.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.center_button_lights", "p": {' +
        '"color": ' + color +
        '} }';

    this.sendDATA(command);
}

/**  generate random id for UJSONRPC messages
 * @private
 * @returns {string}
 */
Service_SPIKE.prototype.generateId = function () {
    var generatedID = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 4; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        generatedID = generatedID + characters[randomIndex];
    }

    return generatedID;
}