_SpikeUjsonLib = {};
    
/**
* 
* @memberof! UJSONRPC
* @param {string} text 
* @param {function} immediateCB
*/
_SpikeUjsonLib.displayText = async function displayText(text, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_text", "p": {"text":' + '"' + text + '"' + '} }'
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 * @param {integer} x [0 to 4]
 * @param {integer} y [0 to 4]
 * @param {integer} brightness [1 to 100]
 * @param {function} immediateCB
 */
_SpikeUjsonLib.displaySetPixel = async function displaySetPixel(x, y, brightness, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_set_pixel", "p": {"x":' + x +
        ', "y":' + y + ', "brightness":' + brightness + '} }';
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 * @param {function} immediateCB
 */
_SpikeUjsonLib.displayClear = async function displayClear(immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.display_clear" }';
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {array} array [1-100,1-100,1-100,1-100] array of size 4
 * @param {function} immediateCB
 */
_SpikeUjsonLib.ultrasonicLightUp = async function ultrasonicLightUp(port, array, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.ultrasonic_light_up", "p": {' +
        '"port": ' + '"' + port + '"' +
        ', "lights": ' + '[' + array + ']' +
        '} }';
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {integer} speed 
 * @param {integer} stall 
 * @param {function} immediateCB
 */
_SpikeUjsonLib.motorStart = async function motorStart(port, speed, stall, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_start", "p": {"port":'
        + '"' + port + '"' +
        ', "speed":' + speed +
        ', "stall":' + stall +
        '} }';
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/** moves motor to a position
 * 
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {integer} position 
 * @param {integer} speed 
 * @param {boolean} stall 
 * @param {boolean} stop 
 * @param {function} immediateCB
 * @param {function} callback
 */
_SpikeUjsonLib.motorGoRelPos = async function motorGoRelPos(port, position, speed, stall, stop, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.motor_go_to_relative_position"' +
        ', "p": {' +
        '"port":' + '"' + port + '"' +
        ', "position":' + position +
        ', "speed":' + speed +
        ', "stall":' + stall +
        ', "stop":' + stop +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

_SpikeUjsonLib.motorGoDirToPosition = async function motorGoDirToPosition(port, position, direction, speed, stall, stop, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
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

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);

}

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {integer} time 
 * @param {integer} speed 
 * @param {integer} stall 
 * @param {boolean} stop
 * @param {function} immediateCB
 * @param {function} callback
 */
_SpikeUjsonLib.motorRunTimed = async function motorRunTimed(port, time, speed, stall, stop, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.motor_run_timed"' +
        ', "p": {' +
        '"port":' + '"' + port + '"' +
        ', "time":' + time +
        ', "speed":' + speed +
        ', "stall":' + stall +
        ', "stop":' + stop +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {integer} degrees 
 * @param {integer} speed 
 * @param {integer} stall 
 * @param {boolean} stop
 * @param {function} immediateCB
 * @param {function} callback
 */
_SpikeUjsonLib.motorRunDegrees = async function motorRunDegrees(port, degrees, speed, stall, stop, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.motor_run_for_degrees"' +
        ', "p": {' +
        '"port":' + '"' + port + '"' +
        ', "degrees":' + degrees +
        ', "speed":' + speed +
        ', "stall":' + stall +
        ', "stop":' + stop +
        '} }';
    
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 * @param {integer} time 
 * @param {integer} lspeed 
 * @param {integer} rspeed 
 * @param {string} lmotor 
 * @param {string} rmotor 
 * @param {boolean} stop
 * @param {function} immediateCB
 * @param {function} callback
 */
_SpikeUjsonLib.moveTankTime = async function moveTankTime(time, lspeed, rspeed, lmotor, rmotor, stop, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
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
    
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
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
 * @param {function} immediateCB
 * @param {function} callback
 */
_SpikeUjsonLib.moveTankDegrees = async function moveTankDegrees(degrees, lspeed, rspeed, lmotor, rmotor, stop, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
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

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {integer} lspeed 
 * @param {integer} rspeed 
 * @param {string} lmotor 
 * @param {string} rmotor
 * @param {function} immediateCB
 * @param {function} callback
 */
_SpikeUjsonLib.moveTankSpeeds = async function moveTankSpeeds(lspeed, rspeed, lmotor, rmotor, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.move_start_speeds"' +
        ', "p": {' +
        '"lspeed":' + lspeed +
        ', "rspeed":' + rspeed +
        ', "lmotor":' + '"' + lmotor + '"' +
        ', "rmotor":' + '"' + rmotor + '"' +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
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
_SpikeUjsonLib.moveTankPowers = async function moveTankPowers(lpower, rpower, lmotor, rmotor, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.move_start_powers"' +
        ', "p": {' +
        '"lpower":' + lpower +
        ', "rpower":' + rpower +
        ', "lmotor":' + '"' + lmotor + '"' +
        ', "rmotor":' + '"' + rmotor + '"' +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {integer} volume 
 * @param {integer} note 
 */
_SpikeUjsonLib.soundBeep = async function soundBeep(volume, note, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.sound_beep"' +
        ', "p": {' +
        '"volume":' + volume +
        ', "note":' + note +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 */
_SpikeUjsonLib.soundStop = async function soundStop(immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.sound_off"' +
        '}';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} port 
 * @param {integer} power 
 * @param {integer} stall 
 */
_SpikeUjsonLib.motorPwm = async function motorPwm(port, power, stall, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "scratch.motor_pwm", "p": {"port":' + '"' + port + '"' +
        ', "power":' + power + ', "stall":' + stall + '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {function} callback
 */
_SpikeUjsonLib.getFirmwareInfo = async function getFirmwareInfo(callback, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();

    var command = '{"i":' + '"' + randomId + '"' + ', "m": "get_hub_info" ' + '}';
    
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);

    // sendDATA(command);
    // if (callback != undefined) {
        // getFirmwareInfoCallback = [randomId, callback];
    // }
}

/**
 * @memberof! UJSONRPC
 * @param {function} immediateCB
 */
_SpikeUjsonLib.triggerCurrentState = async function triggerCurrentState(immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();

    var command = '{"i":' + '"' + randomId + '"' + ', "m": "trigger_current_state" ' + '}';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);

    // sendDATA(command);
    // if (callback != undefined) {
        // triggerCurrentStateCallback = callback;
    // }
}

/** 
 * 
 * @memberof! UJSONRPC
 * @param {integer} slotid 
 */
_SpikeUjsonLib.programExecute = async function programExecute(slotid, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' + ', "m": "program_execute", "p": {"slotid":' + slotid + '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 */
_SpikeUjsonLib.programTerminate = function programTerminate(immediateCB) {

    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "program_terminate"' +
        '}';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 * @param {string} projectName name of the project
 * @param {integer} type type of data (micropy or scratch)
 * @param {string} data entire data to send in ASCII
 * @param {integer} slotid slot to which to assign the program
 */
_SpikeUjsonLib.startWriteProgram = async function startWriteProgram(projectName, type, data, slotid, immediateCB) {
    
    console.log("%cTuftsCEEO ", "color: #3ba336;", "in startWriteProgram...");
    console.log("%cTuftsCEEO ", "color: #3ba336;", "constructing start_write_program script...");

    if (type == "python") {
        var typeInt = 0;
    }

    // construct the UJSONRPC packet to start writing program

    var dataSize = (new TextEncoder().encode(data)).length;

    var randomId = _SpikeUjsonLib.generateId();

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
    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} base64data base64 encoded data to send
 * @param {string} transferid transferid of this program write process
 * @returns {string} the randomly generated message id used to send this UJSONRPC script
 */
_SpikeUjsonLib.writePackage = function writePackage(base64data, transferid, immediateCB) {

    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "write_package", "p": {' +
        '"data": ' + '"' + base64data + '"' +
        ', "transferid": ' + '"' + transferid + '"' +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);

}

/**
 * @memberof! UJSONRPC
 */
_SpikeUjsonLib.getStorageStatus = function getStorageStatus(immediateCB) {

    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "get_storage_status"' +
        '}';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * @memberof! UJSONRPC
 * @param {string} slotid 
 */
_SpikeUjsonLib.removeProject = function removeProject(slotid, immediateCB) {

    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "remove_project", "p": {' +
        '"slotid": ' + slotid +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**
 * 
 * @memberof! UJSONRPC
 * @param {string} oldslotid 
 * @param {string} newslotid 
 */
_SpikeUjsonLib.moveProject = function moveProject(oldslotid, newslotid, immediateCB) {

    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "move_project", "p": {' +
        '"old_slotid": ' + oldslotid +
        ', "new_slotid: ' + newslotid +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

_SpikeUjsonLib.centerButtonLightUp = function centerButtonLightUp(color, immediateCB) {
    var randomId = _SpikeUjsonLib.generateId();
    var command = '{"i":' + '"' + randomId + '"' +
        ', "m": "scratch.center_button_lights", "p": {' +
        '"color": ' + color +
        '} }';

    if (typeof immediateCB === "function")
        immediateCB(command, randomId);
}

/**  generate random id for UJSONRPC messages
* @private
* @returns {string}
*/
_SpikeUjsonLib.generateId = function () {
    var generatedID = ""
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 4; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        generatedID = generatedID + characters[randomIndex];
    }

    return generatedID;
}